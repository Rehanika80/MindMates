import app from './app.js'
import connectDatabase from './config/database.js'
import User from './models/User.js'

const port = process.env.PORT || 5001

const seedAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    return
  }

  const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() })

  if (existingAdmin) {
    return
  }

  await User.create({
    name: process.env.ADMIN_NAME || 'Admin',
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
  })

  console.log('Seed admin user created')
}

const startServer = async () => {
  try {
    await connectDatabase()
    await seedAdminUser()
  } catch (error) {
    console.error('⚠️ Database Connection Failed:', error.message)
    console.log('📡 Server starting in Limited mode (No DB)...')
  }

  app.listen(port, () => {
    console.log(`\n🚀 MindMates Server running on: http://localhost:${port}`)
    console.log(`📡 Health Check: http://localhost:${port}/api/health\n`)
  })
}

startServer()