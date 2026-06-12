import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  let token = req.headers.authorization

  if (token && token.startsWith('Bearer')) {
    try {
      token = token.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      const user = await User.findById(decoded.id).select('-password')

      if (!user) {
        return res.status(401).json({ message: 'User not found' })
      }

      req.user = user   // 👈 now includes role automatically

      next()
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized' })
    }
  } else {
    return res.status(401).json({ message: 'No token' })
  }
}