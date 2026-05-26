import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expiresAt: Date,
    data: Object, // stores signup info temporarily
  },
  { timestamps: true }
)

export default mongoose.model('Otp', otpSchema)