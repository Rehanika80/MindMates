import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../lib/api.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('mindmates_token'))
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setAuthLoading(false)
        return
      }

      try {
        const data = await apiRequest('/auth/me')
        setUser(data.user)
      } catch (error) {
        localStorage.removeItem('mindmates_token')
        setToken(null)
        setUser(null)
      } finally {
        setAuthLoading(false)
      }
    }

    loadProfile()
  }, [token])

  const updateSession = (nextToken, nextUser) => {
    localStorage.setItem('mindmates_token', nextToken)
    setToken(nextToken)
    setUser(nextUser)
  }

  const logout = () => {
    localStorage.removeItem('mindmates_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, authLoading, updateSession, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)