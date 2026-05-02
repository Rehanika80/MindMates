import app from './app.js'
import connectDatabase from './config/database.js'
import User from './models/User.js'
import net from 'net'
import path from 'path'
import { spawn } from 'child_process'

const port = Number(process.env.PORT || 5001)
const healthUrl = `http://localhost:${port}/api/health`
let localMongoProcess = null

const canConnectToPort = (host, targetPort, timeout = 1000) =>
  new Promise((resolve) => {
    const socket = net.createConnection({ host, port: targetPort })
    const finish = (result) => {
      socket.removeAllListeners()
      socket.destroy()
      resolve(result)
    }

    socket.setTimeout(timeout)
    socket.once('connect', () => finish(true))
    socket.once('timeout', () => finish(false))
    socket.once('error', () => finish(false))
  })

const ensureLocalMongo = async () => {
  if (!process.env.MONGODB_URI?.includes('127.0.0.1:27017')) {
    return
  }

  if (await canConnectToPort('127.0.0.1', 27017)) {
    return
  }

  const mongodPath = 'C:\\Program Files\\MongoDB\\Server\\8.2\\bin\\mongod.exe'
  const dataPath = path.resolve(process.cwd(), '..', '.mongo-data')
  const logPath = path.resolve(process.cwd(), '..', '.mongo-log', 'mongod.log')

  localMongoProcess = spawn(
    mongodPath,
    ['--dbpath', dataPath, '--bind_ip', '127.0.0.1', '--port', '27017', '--logpath', logPath, '--logappend'],
    {
      stdio: 'ignore',
      windowsHide: true,
    },
  )

  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (await canConnectToPort('127.0.0.1', 27017, 500)) {
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  throw new Error('Local MongoDB did not start on 127.0.0.1:27017')
}

const isExistingServerHealthy = async () => {
  try {
    const response = await fetch(healthUrl)
    if (!response.ok) {
      return false
    }

    const data = await response.json()
    return data?.success === true
  } catch {
    return false
  }
}

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
  if (await isExistingServerHealthy()) {
    console.log(`\nMindMates Server is already running on: http://localhost:${port}`)
    console.log(`Health Check: ${healthUrl}\n`)
    return
  }

  const server = app.listen(port, () => {
    console.log(`\nMindMates Server running on: http://localhost:${port}`)
    console.log(`Health Check: http://localhost:${port}/api/health\n`)
  })

  server.on('error', async (error) => {
    if (error.code === 'EADDRINUSE') {
      if (await isExistingServerHealthy()) {
        console.log(`\nMindMates Server is already running on: http://localhost:${port}`)
        console.log(`Health Check: ${healthUrl}\n`)
        process.exit(0)
      }

      console.error(`\nPort ${port} is already in use.`)
      console.error('Stop the existing backend server, or change PORT in backend/.env and VITE_API_URL in frontend/.env.')
      process.exit(1)
    }

    console.error('Server failed to start:', error.message)
    process.exit(1)
  })

  if (process.env.USE_DB === 'false') {
    console.log('Database disabled with USE_DB=false. Server is running in dev fallback mode.')
    return
  }

  try {
    await ensureLocalMongo()
    await connectDatabase({ maxAttempts: 1 })
    await seedAdminUser()
  } catch (error) {
    console.error('Database Connection Failed:', error.message)
    console.log('Server is running in dev fallback mode. Login/register will work until MongoDB is available.')
  }
}

startServer()
