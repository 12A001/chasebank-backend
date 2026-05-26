import express from 'express'
import {
  getUserTransactions,
    getSingleTransaction,
  sendMoney,
} from '../controllers/transactionController.js'

import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getUserTransactions)
router.get('/:id', protect, getSingleTransaction)
router.post('/send', protect, sendMoney)

export default router