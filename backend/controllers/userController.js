import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import Razorpay from 'razorpay'

// Initialize Razorpay only if credentials are provided
let razorpay = null
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  })
}

const APPOINTMENT_SLOT_MINUTES = 30

const parseAppointmentDateTime = (slotDate, slotTime) => {
  if (!slotDate || !slotTime) return null

  const [day, month, year] = slotDate.split('_').map(Number)
  if (!day || !month || !year) return null

  const timeMatch = String(slotTime).trim().match(/^(\d{1,2}):(\d{2})(?:\s*([AaPp][Mm]))?$/)
  if (!timeMatch) return null

  let hours = Number(timeMatch[1])
  const minutes = Number(timeMatch[2])
  const meridiem = timeMatch[3]?.toUpperCase()

  if (meridiem === 'PM' && hours < 12) hours += 12
  if (meridiem === 'AM' && hours === 12) hours = 0

  const appointmentDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0)
  return Number.isNaN(appointmentDateTime.getTime()) ? null : appointmentDateTime
}

const syncCompletedAppointments = async (appointments) => {
  const appointmentList = Array.isArray(appointments) ? appointments : [appointments]
  const now = new Date()
  const completedIds = []

  for (const appointment of appointmentList) {
    if (!appointment) continue
    if (appointment.status !== 'booked') continue
    if (appointment.advancePaymentStatus !== 'completed') continue

    const appointmentStartTime = parseAppointmentDateTime(appointment.slotDate, appointment.slotTime)
    if (!appointmentStartTime) continue

    const appointmentEndTime = new Date(appointmentStartTime)
    appointmentEndTime.setMinutes(appointmentEndTime.getMinutes() + APPOINTMENT_SLOT_MINUTES)

    if (appointmentEndTime > now) continue

    appointment.status = 'completed'
    completedIds.push(appointment._id)
  }

  if (completedIds.length > 0) {
    await appointmentModel.updateMany(
      { _id: { $in: completedIds } },
      { $set: { status: 'completed' } }
    )
  }

  return appointments
}

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Missing fields' })

    const existing = await userModel.findOne({ email })
    if (existing) return res.status(400).json({ success: false, message: 'User already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await userModel.create({ name, email, password: hashed })
    res.json({ success: true, user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Registration failed' })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(400).json({ success: false, message: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
    res.json({ success: true, token, user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Login failed' })
  }
}

const getProfile = async (req, res) => {
  try {
    const token = req.headers.token || req.query.token
    if (!token) return res.status(401).json({ success: false, message: 'No token' })
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const user = await userModel.findById(decoded.id).select('-password')
    res.json({ success: true, user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Failed to fetch profile' })
  }
}

const updateProfile = async (req, res) => {
  try {
    const token = req.headers.token
    if (!token) return res.status(401).json({ success: false, message: 'No token' })

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    } catch (jwtError) {
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }

    const { name, phone, gender, dob, address } = req.body

    const user = await userModel.findById(decoded.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    // Update user fields - always update all provided fields (even if empty)
    if (name !== undefined && name !== null) user.name = name
    if (phone !== undefined && phone !== null) user.phone = phone
    if (gender !== undefined && gender !== null) user.gender = gender

    // Convert dob string to timestamp (milliseconds since epoch)
    if (dob !== undefined && dob !== null) {
      if (typeof dob === 'string') {
        user.dob = new Date(dob).getTime()
      } else {
        user.dob = dob
      }
    }

    if (address !== undefined && address !== null) user.address = address

    const savedUser = await user.save()
    console.log('Profile updated:', savedUser)

    const updatedUser = await userModel.findById(decoded.id).select('-password')
    res.json({ success: true, message: 'Profile updated successfully', user: updatedUser })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Failed to update profile' })
  }
}

const getAppointments = async (req, res) => {
  try {
    const token = req.headers.token
    if (!token) return res.status(401).json({ success: false, message: 'No token' })

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    } catch (jwtError) {
      console.error('JWT error', jwtError)
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }

    const user = await userModel.findById(decoded.id)
    if (!user) return res.status(401).json({ success: false, message: 'Invalid user' })

    const appointments = await appointmentModel.find({ userId: user._id }).sort({ createdAt: -1 })
    await syncCompletedAppointments(appointments)

    res.json({ success: true, appointments })
  } catch (error) {
    console.error('Get appointments error', error)
    res.status(500).json({ success: false, message: 'Failed to fetch appointments' })
  }
}

const getBookedSlots = async (req, res) => {
  try {
    const { docId } = req.query
    if (!docId) return res.status(400).json({ success: false, message: 'Missing docId' })

    const slots = await appointmentModel.find({ docId, status: 'booked' }).select('slotDate slotTime -_id')
    res.json({ success: true, slots })
  } catch (error) {
    console.error('Get booked slots error', error)
    res.status(500).json({ success: false, message: 'Failed to fetch booked slots' })
  }
}

const cancelAppointment = async (req, res) => {
  try {
    const token = req.headers.token
    if (!token) return res.status(401).json({ success: false, message: 'No token' })

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    } catch (jwtError) {
      console.error('JWT error', jwtError)
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }

    const user = await userModel.findById(decoded.id)
    if (!user) return res.status(401).json({ success: false, message: 'Invalid user' })

    const { appointmentId } = req.body
    if (!appointmentId) return res.status(400).json({ success: false, message: 'Missing appointment ID' })

    const appointment = await appointmentModel.findOne({ _id: appointmentId, userId: user._id })
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' })

    await syncCompletedAppointments(appointment)

    if (appointment.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Appointment is already completed' })
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Appointment is already cancelled' })
    }

    appointment.status = 'cancelled'
    await appointment.save()

    res.json({ success: true, message: 'Appointment cancelled', appointment })
  } catch (error) {
    console.error('Cancel appointment error', error)
    res.status(500).json({ success: false, message: 'Failed to cancel appointment' })
  }
}

const bookAppointment = async (req, res) => {
  try {
    console.log('Book appointment request', {
      headers: req.headers,
      body: req.body
    })
    const token = req.headers.token
    if (!token) return res.status(401).json({ success: false, message: 'No token' })

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    } catch (jwtError) {
      console.error('JWT error', jwtError)
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }

    const user = await userModel.findById(decoded.id)
    if (!user) return res.status(401).json({ success: false, message: 'Invalid user' })

    const { docId, slotDate, slotTime } = req.body
    if (!docId || !slotDate || !slotTime) return res.status(400).json({ success: false, message: 'Missing booking fields' })

    let doctor = null
    if (mongoose.Types.ObjectId.isValid(docId)) {
      doctor = await doctorModel.findById(docId)
      if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' })
    } else {
      console.warn('Booking with non-ObjectId doctor ID:', docId)
    }

    const existingSlot = await appointmentModel.findOne({
      docId,
      slotDate,
      slotTime,
      status: 'booked'
    })

    if (existingSlot) {
      return res.status(400).json({
        success: false,
        message: 'This doctor is already booked for the selected date and time.'
      })
    }

    // Calculate 25% advance payment
    const doctorFees = doctor ? doctor.fees : 0
    const advancePaymentAmount = Math.ceil((doctorFees * 25) / 100) // 25% of fees

    // Create appointment with payment pending status
    const appt = await appointmentModel.create({
      userId: user._id,
      docId,
      slotDate,
      slotTime,
      doctorFees,
      advancePaymentAmount,
      advancePaymentStatus: 'pending'
    })

    res.json({
      success: true,
      message: 'Appointment created. Please complete payment.',
      appointment: appt,
      paymentRequired: {
        amount: advancePaymentAmount,
        currency: 'INR',
        description: `Advance payment for appointment with Dr. ${doctor?.name || 'Doctor'}`
      }
    })
  } catch (error) {
    console.error('Booking error', error)
    res.status(500).json({ success: false, message: error.message || 'Booking failed' })
  }
}

const createPaymentOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ success: false, message: 'Payment service not configured. Please set Razorpay credentials.' })
    }

    const token = req.headers.token
    if (!token) return res.status(401).json({ success: false, message: 'No token' })

    const { appointmentId } = req.body
    if (!appointmentId) return res.status(400).json({ success: false, message: 'Missing appointment ID' })

    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' })

    // Create Razorpay order
    const options = {
      amount: appointment.advancePaymentAmount * 100, // Convert to paise
      currency: 'INR',
      receipt: appointmentId.toString(),
      notes: {
        appointmentId: appointmentId.toString(),
        userId: appointment.userId.toString()
      }
    }

    const order = await razorpay.orders.create(options)

    // Update appointment with order ID
    appointment.razorpayOrderId = order.id
    await appointment.save()

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      }
    })
  } catch (error) {
    console.error('Create payment order error', error)
    res.status(500).json({ success: false, message: 'Failed to create payment order' })
  }
}

const verifyPayment = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ success: false, message: 'Payment service not configured. Please set Razorpay credentials.' })
    }

    const token = req.headers.token
    if (!token) return res.status(401).json({ success: false, message: 'No token' })

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    } catch (jwtError) {
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }

    const { appointmentId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body

    if (!appointmentId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Missing payment details' })
    }

    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' })

    // Verify signature
    const crypto = await import('crypto')
    const hmac = crypto.default.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    hmac.update(razorpayOrderId + '|' + razorpayPaymentId)
    const generatedSignature = hmac.digest('hex')

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' })
    }

    // Update appointment with payment details
    appointment.razorpayPaymentId = razorpayPaymentId
    appointment.advancePaymentStatus = 'completed'
    appointment.paymentDate = new Date()
    await appointment.save()

    res.json({ success: true, message: 'Payment verified and appointment confirmed', appointment })
  } catch (error) {
    console.error('Verify payment error', error)
    res.status(500).json({ success: false, message: 'Failed to verify payment' })
  }
}

const verifyPaymentDemo = async (req, res) => {
  try {
    const token = req.headers.token
    if (!token) return res.status(401).json({ success: false, message: 'No token' })

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    } catch (jwtError) {
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }

    const { appointmentId } = req.body

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: 'Missing appointment ID' })
    }

    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' })

    // Demo mode: Mark payment as completed without Razorpay verification
    appointment.razorpayPaymentId = 'DEMO_' + Date.now()
    appointment.advancePaymentStatus = 'completed'
    appointment.paymentDate = new Date()
    await appointment.save()

    console.log('[DEMO MODE] Appointment payment confirmed without Razorpay:', appointmentId)

    res.json({ success: true, message: 'Demo payment confirmed - appointment booked', appointment })
  } catch (error) {
    console.error('Demo payment error', error)
    res.status(500).json({ success: false, message: 'Failed to confirm appointment' })
  }
}

export { registerUser, loginUser, getProfile, updateProfile, getAppointments, getBookedSlots, cancelAppointment, bookAppointment, createPaymentOrder, verifyPayment, verifyPaymentDemo }
