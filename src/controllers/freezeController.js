// controllers/freezeController.js

import User from '../models/User.js'

export const freezeAccount = async (req, res) => {
  try {
    const { accountNumber, reason } = req.body

    const user = await User.findOne({
      accountNumber,
    })

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    user.isFrozen = true
    user.frozenReason =
      reason || 'Account under review'

    await user.save()

    res.json({
      message: 'Account frozen successfully',
      user,
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Server error',
    })
  }
}
export const unfreezeAccount = async (req, res) => {
  try {
    const { accountNumber } = req.body

    const user = await User.findOne({
      accountNumber,
    })

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    user.isFrozen = false
    user.frozenReason = ''

    await user.save()

    res.json({
      message: 'Account unfrozen successfully',
      user,
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Server error',
    })
  }
}