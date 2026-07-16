import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'

function MyAppointments() {
  const { doctors, backendUrl, token } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)

  const cancelAppointment = async (appointmentId) => {
    try {
      await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      )
      setAppointments((prev) => prev.map((appt) =>
        appt._id === appointmentId ? { ...appt, status: 'cancelled' } : appt
      ))
    } catch (error) {
      console.error('Failed to cancel appointment', error)
    }
  }

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) return
      setLoading(true)
      try {
        const res = await axios.get(`${backendUrl}/api/user/get-appointments`, {
          headers: { token }
        })
        if (res.data?.success) {
          setAppointments(res.data.appointments)
        } else {
          setAppointments([])
        }
      } catch (error) {
        console.error('Failed to load appointments', error)
        setAppointments([])
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [backendUrl, token])

  if (!token) {
    return (
      <div className='p-8'>
        <p className='text-xl font-medium'>Please log in to view your appointments.</p>
      </div>
    )
  }

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div className='space-y-4 mt-4'>
        {loading && <p className='text-sm text-gray-600'>Loading appointments...</p>}
        {!loading && appointments.length === 0 && (
          <p className='text-sm text-gray-600'>You have no appointments yet.</p>
        )}
        {appointments.map((appointment, index) => {
          const doctor = doctors.find((doc) => doc._id === appointment.docId)
          const isCancelled = appointment.status === 'cancelled'
          const isCompleted = appointment.status === 'completed'
          const canCancel = appointment.status === 'booked'
          const paymentPending = appointment.advancePaymentStatus === 'pending'
          const paymentCompleted = appointment.advancePaymentStatus === 'completed'
          const statusLabel = isCancelled ? 'Cancelled' : isCompleted ? 'Appointment Done' : 'Booked'
          const statusClass = isCancelled ? 'text-red-600' : isCompleted ? 'text-blue-600' : 'text-green-600'
          const paymentLabel = paymentCompleted ? 'Payment Done' : paymentPending ? 'Payment Pending' : 'Payment Failed'
          const paymentClass = paymentCompleted
            ? 'bg-green-100 text-green-700'
            : paymentPending
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'

          return (
            <div key={appointment._id || index} className='grid grid-cols-[1fr_3fr] gap-4 sm:flex sm:gap-6 py-4 border rounded-lg'>
              <div>
                <img
                  src={doctor?.image || '/src/assets/profile_pic.png'}
                  className='w-32 bg-indigo-50'
                  alt={doctor?.name || 'Doctor'}
                />
              </div>
              <div className='flex-1 text-sm text-zinc-700'>
                <div className='flex items-center justify-between gap-4'>
                  <div>
                    <p className='text-neutral-800 font-semibold'>{doctor?.name || `Doctor ${appointment.docId}`}</p>
                    <p>{doctor?.speciality || 'Appointment details'}</p>
                  </div>
                  <div className='flex flex-col gap-2 items-end'>
                    <span className={`text-xs font-semibold ${statusClass}`}>
                      {statusLabel}
                    </span>
                    {appointment.advancePaymentStatus && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${paymentClass}`}>
                        {paymentLabel}
                      </span>
                    )}
                  </div>
                </div>
                {doctor?.address && (
                  <>
                    <p className='text-neutral-800 font-medium mt-1'>Address:</p>
                    <p className='text-xs'>{doctor.address.line1}</p>
                    <p className='text-xs'>{doctor.address.line2}</p>
                  </>
                )}
                <p className='text-xs mt-1'>
                  <span className='text-sm text-neutral-700 font-medium'>Date & Time</span>
                  {` ${appointment.slotDate} | ${appointment.slotTime}`}
                </p>
                {appointment.doctorFees && (
                  <p className='text-xs mt-1'>
                    <span className='text-sm text-neutral-700 font-medium'>Fee:</span>
                    {` Rs. ${appointment.doctorFees}`}
                    {appointment.advancePaymentAmount && (
                      <span className='text-gray-600'>{` (Advance Paid: Rs. ${appointment.advancePaymentAmount})`}</span>
                    )}
                  </p>
                )}
                {canCancel && (
                  <button
                    onClick={() => cancelAppointment(appointment._id)}
                    className='mt-4 bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition'
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyAppointments
