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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-4 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:rounded-3xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300/80">
            Admin Panel
          </p>
          <h1 className="mt-3 text-2xl font-bold text-white sm:mt-4 sm:text-4xl">
            Operations Overview
          </h1>
          <p className="mt-2 text-sm text-slate-300 sm:mt-3">{statusMessage}</p>

          {/* Stats Grid */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 xl:grid-cols-4">
            {[
              { label: 'Total Users', value: overview?.usersCount ?? 0, color: 'text-cyan-300' },
              { label: 'Total Check-ins', value: overview?.checkInsCount ?? 0, color: 'text-emerald-300' },
              { label: 'Active Today', value: overview?.activeToday ?? 0, color: 'text-amber-300' },
              { label: 'Platform Status', value: 'Live', color: 'text-green-400' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-slate-950/60 p-4 sm:rounded-2xl sm:p-5">
                <p className="text-xs text-slate-400">{stat.label}</p>
                <p className={`mt-2 text-2xl font-bold sm:text-3xl ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Data */}
        <section className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-2">
          {/* Recent Users */}
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 sm:rounded-3xl sm:p-6">
            <h2 className="text-lg font-semibold text-white sm:text-2xl">Recent Users</h2>
            <div className="mt-4 space-y-3">
              {(overview?.recentUsers || []).length > 0 ? (
                (overview?.recentUsers || []).map((user) => (
                  <div
                    key={user._id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3 sm:rounded-2xl sm:p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">{user.name}</p>
                      <p className="truncate text-sm text-slate-400">{user.email}</p>
                    </div>
                    <span
                      className={`mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-amber-400/15 text-amber-300'
                          : 'bg-cyan-400/15 text-cyan-300'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-center text-sm text-slate-400">
                  No users yet
                </div>
              )}
            </div>
          </div>

          {/* Recent Check-ins */}
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 sm:rounded-3xl sm:p-6">
            <h2 className="text-lg font-semibold text-white sm:text-2xl">Recent Check-ins</h2>
            <div className="mt-4 space-y-3">
              {(overview?.recentCheckIns || []).length > 0 ? (
                (overview?.recentCheckIns || []).map((checkIn) => (
                  <div
                    key={checkIn._id}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 sm:rounded-2xl sm:p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-white truncate">
                        {checkIn.user?.name || checkIn.name || 'Anonymous'}
                      </p>
                      <span className="shrink-0 rounded-full bg-cyan-400/15 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
                        {checkIn.mood}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-300">{checkIn.note}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-center text-sm text-slate-400">
                  No check-ins yet
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AdminPage