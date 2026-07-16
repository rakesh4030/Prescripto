import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  docId: { type: mongoose.Schema.Types.Mixed, required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  status: { type: String, default: 'booked', enum: ['booked', 'cancelled', 'completed'] },
  // Payment fields
  doctorFees: { type: Number, required: true },
  advancePaymentAmount: { type: Number, required: true }, // 25% of fees
  advancePaymentStatus: { type: String, default: 'pending', enum: ['pending', 'completed', 'failed'] },
  razorpayOrderId: { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
  paymentDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
})

appointmentSchema.index(
  { docId: 1, slotDate: 1, slotTime: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'booked' } }
)

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema)
export default appointmentModel
