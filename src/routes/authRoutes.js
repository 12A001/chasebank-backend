import express from 'express'
import { login, sendEnrollOtp, enrollUser } from '../controllers/authController.js'

const router = express.Router()

router.post('/login', login)
router.post('/send-enroll-otp', sendEnrollOtp)
router.post('/enroll', enrollUser)

export default router




// import express from 'express'

// const router = express.Router()

// router.get('/test', (req, res) => {
//   res.json({ ok: true })
// })

// export default router