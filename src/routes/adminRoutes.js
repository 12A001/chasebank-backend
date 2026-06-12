import express from 'express'
import User from '../models/User.js'
import { protect } from '../middleware/authMiddleware.js'
import { isAdmin } from '../middleware/adminMiddleware.js'
import { freezeAccount, unfreezeAccount } from '../controllers/freezeController.js'

const router = express.Router()

// 👇 GET ALL USERS (ADMIN ONLY)
router.get('/users', protect, isAdmin, async (req, res) => {
  const users = await User.find().select('-password')
  res.json(users)
})

// FREEZE USER
router.post('/freeze', protect, isAdmin, freezeAccount)

// UNFREEZE USER
router.post('/unfreeze', protect, isAdmin, unfreezeAccount)

export default router