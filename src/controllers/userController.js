import User from '../models/User.js'
import bcrypt from 'bcrypt'
export const getMe = async (req, res) => {
  res.json(req.user)
}

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const {
      phone,
      email,
      password,
      loginPin,
      transferPin,
    } = req.body

    // CONTACT
    if (phone) user.phone = phone
    if (email) user.email = email

    // LOGIN PASSWORD
    if (password) {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
    }

    // LOGIN PIN (6 digits)
    if (loginPin) {
      if (loginPin.length !== 8) {
        return res.status(400).json({ message: 'Login PIN must be 8 digits' })
      }
      user.loginPin = await bcrypt.hash(loginPin, 10)
    }

    // TRANSFER PIN (4 digits)
    if (transferPin) {
      if (transferPin.length !== 4) {
        return res.status(400).json({ message: 'Transfer PIN must be 4 digits' })
      }
      user.transferPin = await bcrypt.hash(transferPin, 10)
    }

    await user.save()

    res.json({
      message: 'Profile updated',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        birthday: user.birthday,
        accountNumber: user.accountNumber,
      },
    })
  } catch (err) {
    res.status(500).json({ message: 'Update failed' })
  }
}
export const verifyTransferPin = async (req, res) => {
  try {
    const { pin } = req.body

    if (!pin) {
      return res.status(400).json({ message: 'PIN required' })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(pin, user.transferPin)

    return res.json({ valid: isMatch })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'PIN verification failed' })
  }
}