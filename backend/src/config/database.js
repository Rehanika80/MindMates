import mongoose from 'mongoose'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const connectDatabase = async (options = {}) => {
  const connectionString = process.env.MONGODB_URI
  const maxAttempts = options.maxAttempts || 5
  const baseDelay = options.baseDelay || 1000

  if (!connectionString) {
    throw new Error('MONGODB_URI is missing')
  }

  let attempt = 0
  while (attempt < maxAttempts) {
    try {
      attempt += 1
      await mongoose.connect(connectionString)
      console.log('MongoDB connected')
      return true
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt} failed: ${error.message}`)
      if (attempt >= maxAttempts) {
        throw new Error(`MongoDB connection failed after ${attempt} attempts: ${error.message}`)
      }
      const delay = baseDelay * attempt
      console.log(`Retrying MongoDB connection in ${delay}ms...`)
      await wait(delay)
    }
  }
}

export default connectDatabase