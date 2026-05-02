import User from '../models/User.js'
import { generateToken } from '../middleware/authMiddleware.js'

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
})

export const register = async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Account already exists with this email',
      })
    }

    const user = await User.create({
      name,
      email,
      password,
      role: adminCode && adminCode === process.env.ADMIN_CODE ? 'admin' : 'user',
    })

    const token = generateToken(user._id)

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: sanitizeUser(user),
    })
  } catch (error) {
    console.error('register Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    const token = generateToken(user._id)

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: sanitizeUser(user),
    })
  } catch (error) {
    console.error('login Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Login failed',
    })
  }
}

export const getProfile = async (req, res) =>
  res.json({
    success: true,
    user: sanitizeUser(req.user),
  })