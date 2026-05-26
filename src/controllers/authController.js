import User from '../models/User.js'
import Otp from '../models/Otp.js'
import bcrypt from 'bcrypt'
import { sendEmail } from '../utils/sendEmail.js'
import { generateToken } from '../utils/generateToken.js'


export const login = async (req, res) => {
  try {
    const { userId, password } = req.body

    if (!userId || !password) {
      return res.status(400).json({ message: 'Missing credentials' })
    }

    const user = await User.findOne({
      $or: [
        { username: userId },
        { accountNumber: userId },
        { email: userId }, //  ADDED
      ],
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = generateToken(user._id)

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        accountNumber: user.accountNumber,
        phone: user.phone,
        address: user.address,
        birthday: user.birthday,
        balance: user.balance,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Login failed' })
  }
}
/* =========================
   SEND OTP
========================= */
export const sendEnrollOtp = async (req, res) => {
  try {
    const { fullName, email, accountNumber } = req.body

    if (!fullName || !email || !accountNumber) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // remove old otp
    await Otp.deleteMany({ email })

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
      data: { fullName, email, accountNumber },
    })

    await sendEmail(
      email,
      'Chase Bank Verification Code',
      `Your OTP code is: ${otp}. It expires in 10 minutes.`
    )

    res.json({ message: 'OTP sent successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to send OTP' })
  }
}

/* =========================
   COMPLETE ENROLLMENT
========================= */
export const enrollUser = async (req, res) => {
  try {
    const {
      fullName,
      accountNumber,
      ssn,
      email,
      otp,
      phone,
      username,
      password,
      token,
      remember,
    } = req.body

    if (!otp) {
      return res.status(400).json({ message: 'OTP required' })
    }

    const otpRecord = await Otp.findOne({ email, otp })

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired' })
    }

    // check duplicate user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { accountNumber }],
    })

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      fullName,
      accountNumber,
      ssn,
      email,
      phone,
      username,
      password: hashedPassword,
      token,
      remember,
      balance: 0,
    })

    await Otp.deleteMany({ email })

    const jwtToken = generateToken(user._id)

    res.status(201).json({
      message: 'Enrollment successful',
      token: jwtToken,
      user,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Enrollment failed' })
  }
}