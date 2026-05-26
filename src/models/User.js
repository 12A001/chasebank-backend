import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      unique: true,
      required: true
    },

    username: {
      type: String,
      unique: true,
      required: true
    },

    accountNumber: {
      type: String,
      unique: true,
      required: true
    },

    phone: {
      type: String
    },

    // 🛡️ SENSITIVE DATA
    ssn: {
      type: String,
      required: true,
      select: false
    },

    // 🔐 LOGIN CREDENTIAL (THIS IS YOUR LOGIN PASSWORD)
    password: {
      type: String,
      required: true
    },

    // 💰 ACCOUNT INFO
    accountType: {
      type: String,
      enum: ['checking', 'savings'],
      default: 'checking'
    },

    balance: {
      type: Number,
      default: 0
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    role: {
      type: String,
      default: 'user'
    },

    address: {
      type: String,
      default: ''
    },

    birthday: {
      type: Date
    },
    profileImage: {
  type: String,
  default: null
},

    // 🔐 TRANSACTION SECURITY ONLY
    loginPin: {
      type: String,
      default: null
    },

    transferPin: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)