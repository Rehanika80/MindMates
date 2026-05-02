import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import checkInRoutes from './routes/checkInRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import coachRoutes from './routes/coachRoutes.js'
import gameRoutes from './routes/gameRoutes.js'

dotenv.config()

const app = express()

const parseFrontendOrigins = () => {
  const fromEnv = process.env.FRONTEND_URL || 'http://localhost:5173'
  const arr = fromEnv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  // include common dev ports and dedupe
  const defaults = ['http://localhost:5175', 'http://localhost:5174', 'http://localhost:5173']
  const combined = [...arr, ...defaults]
  return combined.filter((v, i, a) => a.indexOf(v) === i)
}

const allowedOrigins = parseFrontendOrigins()
console.log('CORS allowed origins:', allowedOrigins)

const isAllowedDevOrigin = (origin) => {
  if (!origin) {
    return true
  }

  if (allowedOrigins.includes(origin)) {
    return true
  }

  try {
    const { hostname, protocol } = new URL(origin)
    return protocol === 'http:' && ['localhost', '127.0.0.1'].includes(hostname)
  } catch {
    return false
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedDevOrigin(origin)) {
        callback(null, true)
        return
      }

      callback(new Error(`CORS blocked origin: ${origin}`))
    },
    credentials: true,
  }),
)

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MindMates API is running',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/checkins', checkInRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/coach', coachRoutes)
app.use('/api/games', gameRoutes)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(err?.status || 500).json({
    success: false,
    message: err?.message || 'Internal server error',
  })
})

export default app
