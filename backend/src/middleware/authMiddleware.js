import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'
import { findDevUserById } from '../utils/devUserStore.js'

const secret = process.env.JWT_SECRET || 'mindmates-dev-secret'

const generateToken = (userId) =>
  jwt.sign({ userId }, secret, {
    expiresIn: '7d',
  })

export const protect = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization || ''
  const token = authorizationHeader.startsWith('Bearer ')
    ? authorizationHeader.slice(7)
    : null

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token is required',
    })
  }

  try {
    const decoded = jwt.verify(token, secret)

    if (mongoose.connection.readyState !== 1) {
      const user = findDevUserById(decoded.userId)

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        })
      }

      req.user = user
      req.token = token
      return next()
    }

    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      })
    }

    req.user = user
    req.token = token
    return next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    })
  }
}

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    })
  }

  return next()
}

export { generateToken }
