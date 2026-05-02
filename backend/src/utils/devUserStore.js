import bcrypt from 'bcryptjs'

const users = new Map()

const sanitize = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
})

export const createDevUser = async ({ name, email, password, role = 'user' }) => {
  const normalizedEmail = email.toLowerCase()

  if (users.has(normalizedEmail)) {
    const error = new Error('Account already exists with this email')
    error.code = 'DUPLICATE_USER'
    throw error
  }

  const user = {
    _id: `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name,
    email: normalizedEmail,
    password: await bcrypt.hash(password, 10),
    role,
    createdAt: new Date(),
  }

  users.set(normalizedEmail, user)
  return sanitize(user)
}

export const findDevUserByEmail = (email) => {
  const user = users.get(email.toLowerCase())
  return user || null
}

export const findDevUserById = (id) => {
  for (const user of users.values()) {
    if (user._id === id) {
      return sanitize(user)
    }
  }

  return null
}

export const validateDevUserPassword = async (user, password) => {
  if (!user) {
    return false
  }

  return bcrypt.compare(password, user.password)
}
