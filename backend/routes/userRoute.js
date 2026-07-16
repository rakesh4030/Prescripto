import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, getAppointments, getBookedSlots, cancelAppointment, bookAppointment, createPaymentOrder, verifyPayment, verifyPaymentDemo } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/get-profile', getProfile)
userRouter.post('/update-profile', updateProfile)
userRouter.get('/get-appointments', getAppointments)
userRouter.get('/get-booked-slots', getBookedSlots)
userRouter.post('/cancel-appointment', cancelAppointment)
userRouter.post('/book-appointment', bookAppointment)
userRouter.post('/create-payment-order', createPaymentOrder)
userRouter.post('/verify-payment', verifyPayment)
userRouter.post('/verify-payment-demo', verifyPaymentDemo)

export default userRouter
