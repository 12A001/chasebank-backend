import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/authRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import userRoutes from './routes/userRoutes.js'
import freezeRoutes from './routes/freezeRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

/* SECURITY */
app.use(helmet())
app.use(cors({
  origin: '*',
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

/* RATE LIMIT */
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}))

/* ROUTES */
app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/user', userRoutes)
app.use('/api/freeze', freezeRoutes)
app.use('/api/admin', adminRoutes)
/* HEALTH CHECK */
app.get('/', (req, res) => {
  res.json({ message: 'Chase Bank API Running ' })
})

export default app