import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const auth = useAuth()

  if (auth.authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-24 text-center text-slate-300">
        Loading session...
      </div>
    )
  }

  if (!auth.user) {
    return <Navigate to="/auth" replace />
  }

  if (adminOnly && auth.user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute