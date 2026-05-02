import { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Shell = () => {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/admin', label: 'Admin' },
  ]

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
          {/* Logo */}
          <Link
            to="/"
            className="text-base font-bold tracking-[0.3em] text-cyan-300 uppercase sm:tracking-[0.35em]"
            onClick={() => setMenuOpen(false)}
          >
            MindMates
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 text-sm md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-full px-4 py-2 transition ${
                  isActive(link.to)
                    ? 'bg-white/10 text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {auth.user ? (
              <button
                type="button"
                onClick={() => {
                  auth.logout()
                  navigate('/auth')
                }}
                className="ml-2 rounded-full bg-rose-500/90 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-400"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                className="ml-2 rounded-full bg-cyan-400 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-300"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile: right side */}
          <div className="flex items-center gap-2 md:hidden">
            {auth.user ? (
              <button
                type="button"
                onClick={() => {
                  auth.logout()
                  navigate('/auth')
                  setMenuOpen(false)
                }}
                className="rounded-full bg-rose-500/90 px-3 py-1.5 text-xs font-medium text-white"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMenuOpen(false)}
                className="rounded-full bg-cyan-400 px-3 py-1.5 text-xs font-medium text-slate-950"
              >
                Login
              </Link>
            )}
            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5"
              aria-label="Toggle menu"
            >
              <span
                className={`block h-0.5 w-5 rounded bg-slate-300 transition-all ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
              />
              <span
                className={`block h-0.5 w-5 rounded bg-slate-300 transition-all ${menuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`block h-0.5 w-5 rounded bg-slate-300 transition-all ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="border-t border-white/10 bg-slate-950/95 backdrop-blur-xl md:hidden">
            <nav className="flex flex-col px-4 py-3 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive(link.to)
                      ? 'bg-cyan-400/15 text-cyan-300'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <Outlet />
    </div>
  )
}

export default Shell