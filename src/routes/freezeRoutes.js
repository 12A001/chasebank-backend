// routes/freezeRoutes.js

import express from 'express'
import {
  freezeAccount,
  unfreezeAccount,
} from '../controllers/freezeController.js'

const router = express.Router()

router.post('/freeze', freezeAccount)
router.post('/unfreeze', unfreezeAccount)

export default router