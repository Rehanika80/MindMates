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
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
      <section className="flex flex-col justify-center">
        <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">Authentication</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Access your dashboard and admin tools.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
          Create an account or log in to start saving check-ins, then switch into the admin view when your role permits it.
        </p>
        <Link to="/" className="mt-8 inline-flex w-fit rounded-full border border-white/15 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10">
          Back to home
        </Link>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-950/60 p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-2xl px-4 py-3 transition ${mode === 'login' ? 'bg-cyan-400 text-slate-950' : 'text-slate-300'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`rounded-2xl px-4 py-3 transition ${mode === 'register' ? 'bg-cyan-400 text-slate-950' : 'text-slate-300'}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'register' ? (
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            />
          ) : null}
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-500"
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-500"
          />
          {mode === 'register' ? (
            <input
              name="adminCode"
              value={formData.adminCode}
              onChange={handleChange}
              placeholder="Admin code (optional)"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            />
          ) : null}
          {errorMessage ? <p className="text-sm text-red-300">{errorMessage}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Working...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AuthPage