import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Verifies the JWT sent in the Authorization header and attaches the
// logged-in user to req.user for downstream route handlers.
export async function protect(req, res, next) {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id)

      if (!req.user) {
        return res.status(401).json({ message: 'User no longer exists' })
      }
      return next()
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' })
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token provided' })
}

export const authenticateToken = protect

