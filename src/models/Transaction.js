import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    accountName: String,

    bank: String,

    amount: Number,

    direction: {
      type: String,
      enum: ['sent', 'received'],
    },

    senderName: String,
    senderAccountNumber: String,

    receiverName: String,
    receiverAccountNumber: String,

    note: String,
  },
  { timestamps: true }
)

export default mongoose.model('Transaction', transactionSchema)