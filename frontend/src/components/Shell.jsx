import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Shell = () => {
  const auth = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/" className="font-semibold tracking-[0.35em] text-cyan-300 uppercase">
            MindMates
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link className="rounded-full px-4 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white" to="/">
              Home
            </Link>
            <Link className="rounded-full px-4 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white" to="/dashboard">
              Dashboard
            </Link>
            <Link className="rounded-full px-4 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white" to="/admin">
              Admin
            </Link>
            {auth.user ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    auth.logout()
                    navigate('/auth')
                  }}
                  className="rounded-full bg-rose-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-400"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link className="rounded-full bg-cyan-400 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-300" to="/auth">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  )
}

export default Shell