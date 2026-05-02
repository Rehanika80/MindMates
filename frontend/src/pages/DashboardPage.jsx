import { useEffect, useRef, useState } from 'react'
import { apiRequest } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import GamesModal from '../components/games/GamesModal.jsx'
import styles from './DashboardPage.module.css'

const EMOTION_OPTIONS = ['Calm', 'Happy', 'Focused', 'Stressed', 'Tired', 'Sad']
const QUICK_PROMPTS = [
  'I am feeling stuck and need a plan',
  'Help me focus for the next hour',
  'I am stressed because of deadlines',
  'I want to improve my productivity today',
]
const TIMER_PRESETS = [15, 25, 45]
const DEFAULT_TIMER_MINUTES = 25

const DashboardPage = () => {
  const auth = useAuth()
  const intervalRef = useRef(null)

  const [checkIns, setCheckIns] = useState([])
  const [overview, setOverview] = useState(null)
  const [gameStats, setGameStats] = useState(null)
  const [statusMessage, setStatusMessage] = useState('Loading dashboard...')
  const [loading, setLoading] = useState(false)
  const [supportLoading, setSupportLoading] = useState(false)
  const [formData, setFormData] = useState({
    mood: 'Calm',
    intensity: 3,
    note: '',
  })
  const [chatMessage, setChatMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'I am your MindMate coach. Tell me how you feel or what you want to achieve.',
      quickActions: [],
    },
  ])
  const [timerMinutes, setTimerMinutes] = useState(DEFAULT_TIMER_MINUTES)
  const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_TIMER_MINUTES * 60)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerTask, setTimerTask] = useState('Write one priority task')
  const [showGamesModal, setShowGamesModal] = useState(false)

  const loadDashboardData = async () => {
    try {
      const [checkInData, overviewData] = await Promise.all([
        apiRequest('/checkins/mine'),
        apiRequest('/dashboard/overview'),
      ])
      const statsData = await apiRequest('/games/stats')

      setCheckIns(checkInData.data || [])
      setOverview(overviewData.data || null)
      setGameStats(statsData.data || null)
      setStatusMessage(overviewData.message || 'Dashboard ready')
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    if (!timerRunning) {
      return undefined
    }

    intervalRef.current = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current)
            intervalRef.current = null
          }

          setTimerRunning(false)
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [timerRunning])

  const refreshFocusTimer = (minutes) => {
    const nextMinutes = Number(minutes)
    setTimerMinutes(nextMinutes)
    setRemainingSeconds(nextMinutes * 60)
    setTimerRunning(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      await apiRequest('/checkins', {
        method: 'POST',
        body: JSON.stringify({
          name: auth.user?.name || '',
          mood: formData.mood,
          note: formData.note,
          intensity: formData.intensity,
        }),
      })

      setFormData({ mood: 'Calm', intensity: 3, note: '' })
      setStatusMessage('Check-in saved and analyzed')
      await loadDashboardData()
    } catch (error) {
      setStatusMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const sendChatMessage = async (messageText) => {
    const finalMessage = (messageText || chatMessage).trim()

    if (!finalMessage) {
      return
    }

    setSupportLoading(true)
    setChatMessages((current) => [...current, { role: 'user', text: finalMessage }])
    setChatMessage('')

    try {
      const data = await apiRequest('/coach/chat', {
        method: 'POST',
        body: JSON.stringify({ message: finalMessage }),
      })

      setChatMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: data.data.reply,
          quickActions: data.data.quickActions || [],
        },
      ])
    } catch (error) {
      setChatMessages((current) => [...current, { role: 'assistant', text: error.message, quickActions: [] }])
    } finally {
      setSupportLoading(false)
    }
  }

  const startTimer = () => {
    if (remainingSeconds === 0) {
      setRemainingSeconds(timerMinutes * 60)
    }

    setTimerRunning(true)
  }

  const pauseTimer = () => {
    setTimerRunning(false)
  }

  const resetTimer = () => {
    setTimerRunning(false)
    setRemainingSeconds(timerMinutes * 60)
  }

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = String(remainingSeconds % 60).padStart(2, '0')
  const latestCheckIn = overview?.latestCheckIn || checkIns[0] || null
  const growth = gameStats?.growth || overview?.growth || {
    xp: 0,
    level: 1,
    levelXp: 0,
    nextLevelXp: 100,
    progressPercent: 0,
    streakDays: overview?.streakDays || 0,
    rewards: [],
    nextReward: null,
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-6 py-12 lg:px-10">
      {/* Header Section */}
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Welcome Card */}
          <div className="group relative rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-900/30 via-slate-900/40 to-slate-950/60 p-8 shadow-2xl transition hover:border-cyan-400/40 hover:shadow-cyan-900/50">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="relative z-10">
              <p className="inline-block rounded-full bg-cyan-400/20 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-200">
                🧠 Emotional Intelligence Dashboard
              </p>
              <h1 className="mt-4 bg-gradient-to-r from-white via-cyan-100 to-cyan-200 bg-clip-text text-5xl font-bold text-transparent lg:text-6xl">
                Welcome, {auth.user?.name.split(' ')[0]}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-300">{statusMessage}</p>
              
              {/* Stats Grid */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="group/card rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 transition hover:border-white/20 hover:bg-gradient-to-br hover:from-white/20 hover:to-white/10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">👤 Role</p>
                  <p className="mt-3 text-2xl font-bold text-white">{auth.user?.role}</p>
                </div>
                <div className="group/card rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 transition hover:border-white/20 hover:bg-gradient-to-br hover:from-white/20 hover:to-white/10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">📊 Check-ins</p>
                  <p className="mt-3 text-2xl font-bold text-white">{overview?.totalCheckIns ?? checkIns.length}</p>
                </div>
                <div className="group/card rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 transition hover:border-white/20 hover:bg-gradient-to-br hover:from-white/20 hover:to-white/10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">🔥 Streak</p>
                  <p className="mt-3 text-2xl font-bold text-cyan-300">{overview?.streakDays ?? 0} days</p>
                </div>
                <div className="group/card rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 transition hover:border-white/20 hover:bg-gradient-to-br hover:from-white/20 hover:to-white/10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">⚡ Focus</p>
                  <p className="mt-3 text-2xl font-bold text-emerald-300">{overview?.focusScore ?? 0}<span className="text-sm">/100</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Insights Card */}
          <div className="rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-900/30 via-slate-900/40 to-slate-950/60 p-6 shadow-2xl">
            <p className="inline-block rounded-full bg-purple-400/20 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-purple-200">
              ✨ Smart Insights
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-5 transition hover:border-purple-400/40">
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-300">Top Emotion</p>
                <p className="mt-3 text-3xl font-bold text-white">{overview?.topEmotion || 'Calm'}</p>
              </div>
              <div className="rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-5 transition hover:border-purple-400/40">
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-300">💡 Tip for you</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {latestCheckIn?.productivityCue || '✅ Keep logging to unlock personalized insights'}
                </p>
              </div>
              <div className="rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-5 transition hover:border-purple-400/40">
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-300">🎯 Next steps</p>
                <ul className="mt-3 space-y-2">
                  {(latestCheckIn?.actionPlan || overview?.recommendations || []).slice(0, 2).map((step) => (
                    <li key={step} className="flex items-start gap-2 text-sm text-slate-200">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {latestCheckIn?.gameRecommendations && latestCheckIn.gameRecommendations.length > 0 && (
                <button
                  onClick={() => setShowGamesModal(true)}
                  className="w-full rounded-2xl border-2 border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-4 text-left transition hover:border-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2">🎮 Play Games</p>
                  <p className="text-sm text-cyan-100 font-medium">Recommended for your mood</p>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gamified Growth System */}
      <section className="mx-auto mt-8 max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-900/25 via-slate-900/45 to-slate-950/70 p-6 shadow-2xl">
            <p className="inline-block rounded-full bg-amber-400/20 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-amber-200">
              Gamified Growth
            </p>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-4xl font-black text-white">Level {growth.level}</h2>
                <p className="mt-2 text-sm text-slate-300">{growth.xp} XP earned from games, focus, and check-ins.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowGamesModal(true)}
                className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 font-bold text-white transition hover:from-cyan-400 hover:to-blue-400"
              >
                Play Mind Games
              </button>
            </div>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
                <span>{growth.levelXp} XP</span>
                <span>{growth.nextLevelXp} XP to next level</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 transition-all"
                  style={{ width: `${growth.progressPercent}%` }}
                />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">Focus streak</p>
                <p className="mt-2 text-2xl font-bold text-amber-200">{growth.streakDays} days</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">Games played</p>
                <p className="mt-2 text-2xl font-bold text-cyan-200">{gameStats?.totalGamesPlayed || 0}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">Avg score</p>
                <p className="mt-2 text-2xl font-bold text-emerald-200">{gameStats?.averageScore || 0}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-900/25 via-slate-900/45 to-slate-950/70 p-6 shadow-2xl">
            <p className="inline-block rounded-full bg-emerald-400/20 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200">
              Rewards
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {growth.rewards.length > 0 ? (
                growth.rewards.slice(0, 4).map((reward) => (
                  <div key={reward.id} className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="font-bold text-white">{reward.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{reward.description}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-300 sm:col-span-2">
                  Play one mind game to unlock your first reward.
                </div>
              )}
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">Next reward</p>
              <p className="mt-2 font-semibold text-white">
                {growth.nextReward ? `${growth.nextReward.title} at ${growth.nextReward.minXp} XP` : 'All current rewards unlocked'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detect & Decide Section */}
      <section className="mx-auto mt-12 max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Detect Form */}
          <form onSubmit={handleSubmit} className="group rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-900/30 via-slate-900/40 to-slate-950/60 p-8 shadow-2xl transition hover:border-blue-400/40 hover:shadow-blue-900/40">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="relative z-10">
              <p className="inline-block rounded-full bg-blue-400/20 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-blue-200">
                🔍 Detect
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white">How are you feeling?</h2>
              <p className="mt-2 text-sm text-slate-400">
                Share your mood, intensity, and context. AI will generate a personalized action plan.
              </p>
              
              <div className="mt-8 space-y-5">
                {/* Mood Selector */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">Select your mood</label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {EMOTION_OPTIONS.map((emotion) => (
                      <button
                        key={emotion}
                        type="button"
                        onClick={() => setFormData((current) => ({ ...current, mood: emotion }))}
                        className={`rounded-2xl border-2 px-3 py-3 text-sm font-semibold transition ${
                          formData.mood === emotion
                            ? 'border-cyan-400 bg-cyan-400/20 text-cyan-100'
                            : 'border-white/15 bg-white/5 text-slate-300 hover:border-white/30 hover:bg-white/10'
                        }`}
                      >
                        {emotion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Intensity Slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-slate-300">Intensity level</label>
                    <span className="text-2xl font-bold text-cyan-300">{formData.intensity}</span>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.intensity}
                      onChange={(event) =>
                        setFormData((current) => ({ ...current, intensity: Number(event.target.value) }))
                      }
                      className="h-2 w-full appearance-none rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 accent-cyan-400"
                    />
                    <div className="mt-3 flex justify-between text-xs text-slate-400">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>

                {/* Notes Textarea */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">What's on your mind?</label>
                  <textarea
                    value={formData.note}
                    onChange={(event) => setFormData((current) => ({ ...current, note: event.target.value }))}
                    rows="5"
                    placeholder="Describe your situation, tasks, challenges, wins... Be honest!"
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-white outline-none transition placeholder:text-slate-500 hover:border-white/30 focus:border-cyan-400/50 focus:bg-white/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 font-bold text-white shadow-lg transition hover:from-cyan-400 hover:to-blue-400 hover:shadow-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? '🔄 Analyzing your input...' : '✨ Generate Action Plan'}
              </button>
            </div>
          </form>

          {/* Decide Analysis */}
          <div className="group rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-900/30 via-slate-900/40 to-slate-950/60 p-8 shadow-2xl transition hover:border-emerald-400/40 hover:shadow-emerald-900/40">
            <p className="inline-block rounded-full bg-emerald-400/20 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200">
              🎯 Decide
            </p>
            <h2 className="mt-4 text-3xl font-bold text-white">AI Analysis & Insights</h2>
            
            <div className="mt-8 grid gap-4">
              {latestCheckIn ? (
                <>
                  {/* Detected Emotion Card */}
                  <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-6 transition hover:border-emerald-400/40">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">Detected Emotion</p>
                        <p className="mt-2 text-4xl font-bold text-white">{latestCheckIn.detectedEmotion || latestCheckIn.mood}</p>
                      </div>
                      <div className="text-right">
                        <div className="inline-block rounded-full bg-emerald-400/20 px-4 py-2">
                          <p className="text-sm font-semibold text-emerald-200">
                            {Math.round((latestCheckIn.confidence || 0) * 100)}% confident
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Support Suggestion */}
                  <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-6 transition hover:border-emerald-400/40">
                    <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">💬 Support Message</p>
                    <p className="mt-3 leading-7 text-slate-100">"{latestCheckIn.supportSuggestion || 'Stay strong and keep moving forward!'}"</p>
                  </div>

                  {/* Insight Tags */}
                  <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-6 transition hover:border-emerald-400/40">
                    <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300 mb-4">🏷️ Insight Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {(latestCheckIn.insightTags || []).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200"
                        >
                          • {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Your Note */}
                  <div className="rounded-2xl border border-slate-400/20 bg-gradient-to-br from-slate-500/10 to-slate-500/5 p-6 transition hover:border-slate-400/40">
                    <p className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-3">📝 Your Context</p>
                    <p className="text-slate-200 leading-7">{latestCheckIn.note}</p>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-8 text-center">
                  <p className="text-sm text-slate-400">📊 No check-in yet</p>
                  <p className="mt-2 text-slate-400">Submit the form on the left to generate personalized insights</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Act & Improve Section */}
      <section className="mx-auto mt-12 max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Act - Focus Timer */}
          <div className="group rounded-3xl border border-orange-400/20 bg-gradient-to-br from-orange-900/30 via-slate-900/40 to-slate-950/60 p-8 shadow-2xl transition hover:border-orange-400/40 hover:shadow-orange-900/40">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="relative z-10">
              <p className="inline-block rounded-full bg-orange-400/20 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-orange-200">
                ⏱️ Act
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white">Focus Mode Timer</h2>
              <p className="mt-2 text-sm text-slate-400">Execute your action plan with dedicated focus time.</p>

              {/* Timer Display */}
              <div className="mt-8 rounded-3xl border border-orange-400/20 bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-orange-300">Current Task</p>
                <p className="mt-3 max-h-20 overflow-y-auto text-lg font-medium text-white">{timerTask}</p>
                
                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 p-8">
                    <p className="text-7xl font-black text-white tabular-nums">
                      {minutes}:{seconds}
                    </p>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={startTimer}
                      className="flex-1 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-4 font-bold text-white transition hover:from-green-400 hover:to-emerald-400 hover:shadow-green-500/50 hover:shadow-lg"
                    >
                      ▶️ Start
                    </button>
                    <button
                      type="button"
                      onClick={pauseTimer}
                      className="flex-1 rounded-2xl border border-white/20 bg-white/5 px-4 py-4 font-bold text-white transition hover:bg-white/10"
                    >
                      ⏸️ Pause
                    </button>
                    <button
                      type="button"
                      onClick={resetTimer}
                      className="flex-1 rounded-2xl border border-white/20 bg-white/5 px-4 py-4 font-bold text-white transition hover:bg-white/10"
                    >
                      🔄 Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Preset Buttons */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {TIMER_PRESETS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => refreshFocusTimer(value)}
                    className={`rounded-2xl border-2 px-4 py-3 font-bold transition ${
                      timerMinutes === value
                        ? 'border-orange-400 bg-orange-400/20 text-orange-100'
                        : 'border-white/15 bg-white/5 text-slate-300 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    {value}m
                  </button>
                ))}
              </div>

              {/* Task Input */}
              <input
                value={timerTask}
                onChange={(event) => setTimerTask(event.target.value)}
                placeholder="✏️ What will you focus on?"
                className="mt-6 w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-white outline-none transition placeholder:text-slate-500 hover:border-white/30 focus:border-orange-400/50 focus:bg-white/10"
              />
            </div>
          </div>

          {/* Improve - AI Coach */}
          <div className="group rounded-3xl border border-pink-400/20 bg-gradient-to-br from-pink-900/30 via-slate-900/40 to-slate-950/60 p-8 shadow-2xl transition hover:border-pink-400/40 hover:shadow-pink-900/40">
            <p className="inline-block rounded-full bg-pink-400/20 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-pink-200">
              🤖 Improve
            </p>
            <h2 className="mt-4 text-3xl font-bold text-white">AI Coach Chat</h2>
            <p className="mt-2 text-sm text-slate-400">Ask your coach for guidance, motivation & strategies.</p>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              {/* Chat Interface */}
              <div className="rounded-2xl border border-pink-400/20 bg-gradient-to-br from-pink-500/5 to-slate-950/50 p-5 flex flex-col">
                {/* Messages */}
                <div className="max-h-96 space-y-3 overflow-y-auto pr-2 mb-4">
                  {chatMessages.map((message, index) => (
                    <div
                      key={`chat-${index}`}
                      className={`rounded-2xl px-5 py-4 text-sm leading-6 ${styles.animateFadeIn} ${
                        message.role === 'user'
                          ? 'ml-auto max-w-xs rounded-br-none border border-cyan-400/30 bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                          : 'mr-auto max-w-xs rounded-bl-none border border-pink-400/30 bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-slate-100'
                      }`}
                    >
                      {message.text}
                      {message.quickActions && message.quickActions.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.quickActions.map((action, actionIdx) => (
                            <button
                              key={`action-${index}-${actionIdx}`}
                              type="button"
                              onClick={() => sendChatMessage(action)}
                              className="rounded-full border border-pink-400/30 bg-pink-400/10 px-3 py-1 text-xs font-medium text-pink-200 transition hover:border-pink-400/50 hover:bg-pink-400/20"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>

                {/* Quick Prompts */}
                <div className="mb-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendChatMessage(prompt)}
                      className="rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:border-white/30 hover:bg-white/10"
                    >
                      💬 {prompt.substring(0, 20)}...
                    </button>
                  ))}
                </div>

                {/* Chat Input */}
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    sendChatMessage()
                  }}
                  className="flex gap-3 border-t border-white/10 pt-4"
                >
                  <input
                    value={chatMessage}
                    onChange={(event) => setChatMessage(event.target.value)}
                    placeholder="Ask anything..."
                    className="min-w-0 flex-1 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 hover:border-white/30 focus:border-pink-400/50 focus:bg-white/10"
                  />
                  <button
                    type="submit"
                    disabled={supportLoading}
                    className="rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 font-bold text-white transition hover:from-pink-400 hover:to-rose-400 hover:shadow-pink-500/50 hover:shadow-lg disabled:opacity-70"
                  >
                    Send
                  </button>
                </form>
              </div>

              {/* Right Sidebar - Insights */}
              <div className="space-y-4">
                {/* Dominant Mood Card */}
                <div className="rounded-2xl border border-pink-400/20 bg-gradient-to-br from-pink-500/10 to-pink-500/5 p-5 transition hover:border-pink-400/40">
                  <p className="text-xs font-semibold uppercase tracking-wider text-pink-300">Top Emotion</p>
                  <p className="mt-3 text-3xl font-bold text-white">{overview?.topEmotion || 'Calm'}</p>
                </div>

                {/* Recommendations Card */}
                <div className="rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-5 transition hover:border-purple-400/40">
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-300 mb-3">Recommended Actions</p>
                  <div className="space-y-2">
                    {(overview?.recommendations || ['✨ Keep tracking your mood daily']).map((item) => (
                      <div key={item} className="rounded-xl bg-white/10 px-3 py-2 text-xs text-slate-200 border border-white/10">
                        🎯 {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Check-ins */}
                <div className="rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-5 transition hover:border-indigo-400/40">
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-3">Recent History</p>
                  <div className="max-h-40 space-y-2 overflow-y-auto">
                    {checkIns.length > 0 ? (
                      checkIns.map((entry) => (
                        <div key={entry._id} className="rounded-xl bg-white/10 px-3 py-3 text-xs text-slate-200 border border-white/10">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-indigo-200">{entry.detectedEmotion || entry.mood}</span>
                            <span className="text-slate-400 text-xs">
                              {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : 'New'}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-300 line-clamp-2">{entry.note}</p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-white/15 bg-white/5 px-3 py-3 text-xs text-slate-400">
                        No history yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Games Modal */}
      {showGamesModal && (
        <GamesModal
          gameRecommendations={latestCheckIn?.gameRecommendations || []}
          emotion={latestCheckIn?.detectedEmotion || overview?.topEmotion || 'Calm'}
          onClose={() => {
            setShowGamesModal(false)
            loadDashboardData()
          }}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}
      </style>
    </main>
  )
}

export default DashboardPage
