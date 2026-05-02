import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiRequest } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const AuthPage = () => {
  const navigate = useNavigate()
  const auth = useAuth()
  const [mode, setMode] = useState('login')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminCode: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      const payload =
        mode === 'register'
          ? formData
          : {
              email: formData.email,
              password: formData.password,
            }

      const data = await apiRequest(`/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      auth.updateSession(data.token, data.user)
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-57px)] bg-[#07111f]">
      {/* Mobile: stacked | Desktop: two column */}
      <div className="mx-auto grid max-w-7xl gap-0 lg:min-h-[calc(100vh-57px)] lg:grid-cols-[1.1fr_0.9fr]">

        {/* Left Hero Panel — hidden on small, visible lg+ */}
        <section className="hidden flex-col justify-center px-10 py-16 lg:flex xl:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300/80">
            Authentication
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white xl:text-5xl">
            Access your dashboard and admin tools.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">
            Create an account or log in to start saving check-ins, then switch into the admin view
            when your role permits it.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex w-fit rounded-full border border-white/15 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
          >
            ← Back to home
          </Link>

          {/* Feature bullets */}
          <div className="mt-12 space-y-4">
            {[
              { icon: '🔐', text: 'JWT-secured sessions that persist across refreshes' },
              { icon: '🧠', text: 'AI emotion detection on every check-in' },
              { icon: '🎮', text: '7 mind games matched to your current mood' },
              { icon: '🏆', text: 'XP, levels & badge rewards for consistent use' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <span className="text-xl">{item.icon}</span>
                <p className="text-sm text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Right / Mobile Form Panel */}
        <section className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center bg-slate-950/60 px-4 py-10 sm:px-8 lg:border-l lg:border-white/10 lg:px-12">

          {/* Mobile back link */}
          <div className="mb-6 w-full max-w-sm lg:hidden">
            <Link to="/" className="text-sm text-slate-400 hover:text-white">
              ← Back to home
            </Link>
          </div>

          <div className="w-full max-w-sm">
            {/* Mobile heading */}
            <div className="mb-6 lg:hidden">
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300/80">
                Authentication
              </p>
              <h1 className="mt-2 text-2xl font-bold text-white">Access your account</h1>
            </div>

            {/* Tab Toggle */}
            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-900 p-1 text-sm font-medium">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage('') }}
                className={`rounded-xl px-4 py-2.5 transition ${
                  mode === 'login'
                    ? 'bg-cyan-400 font-semibold text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMessage('') }}
                className={`rounded-xl px-4 py-2.5 transition ${
                  mode === 'register'
                    ? 'bg-cyan-400 font-semibold text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              {mode === 'register' && (
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
                />
              )}
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
              />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
              />
              {mode === 'register' && (
                <input
                  name="adminCode"
                  value={formData.adminCode}
                  onChange={handleChange}
                  placeholder="Admin code (optional)"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
                />
              )}

              {errorMessage && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  ⚠️ {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-2xl bg-cyan-400 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading
                  ? '⏳ Please wait...'
                  : mode === 'login'
                  ? 'Login'
                  : 'Create Account'}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-slate-500">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
              >
                {mode === 'login' ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AuthPage