import { useEffect, useState } from 'react'
import { apiRequest } from '../lib/api.js'

const AdminPage = () => {
  const [overview, setOverview] = useState(null)
  const [statusMessage, setStatusMessage] = useState('Loading admin overview...')

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const data = await apiRequest('/admin/overview')
        setOverview(data.data)
        setStatusMessage('Admin data loaded')
      } catch (error) {
        setStatusMessage(error.message)
      }
    }

    loadOverview()
  }, [])

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">Admin panel</p>
        <h1 className="mt-4 text-4xl font-bold text-white">Operations overview</h1>
        <p className="mt-3 text-slate-300">{statusMessage}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-slate-950/60 p-4">
            <p className="text-sm text-slate-400">Users</p>
            <p className="mt-2 text-3xl font-semibold text-white">{overview?.usersCount ?? 0}</p>
          </div>
          <div className="rounded-2xl bg-slate-950/60 p-4">
            <p className="text-sm text-slate-400">Check-ins</p>
            <p className="mt-2 text-3xl font-semibold text-white">{overview?.checkInsCount ?? 0}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-6">
          <h2 className="text-2xl font-semibold text-white">Recent users</h2>
          <div className="mt-6 space-y-3">
            {(overview?.recentUsers || []).map((user) => (
              <div key={user._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-sm text-slate-400">{user.email}</p>
                <p className="text-xs text-cyan-300">{user.role}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-6">
          <h2 className="text-2xl font-semibold text-white">Recent check-ins</h2>
          <div className="mt-6 space-y-3">
            {(overview?.recentCheckIns || []).map((checkIn) => (
              <div key={checkIn._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">{checkIn.user?.name || checkIn.name || 'Anonymous'}</p>
                <p className="text-sm text-cyan-300">{checkIn.mood}</p>
                <p className="mt-2 text-sm text-slate-300">{checkIn.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default AdminPage