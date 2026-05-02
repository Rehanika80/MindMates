import { Link } from 'react-router-dom'

const featureCards = [
  {
    emoji: '🔐',
    title: 'Secure Auth',
    description: 'Register, log in, and persist a JWT session across refreshes.',
  },
  {
    emoji: '📊',
    title: 'Personal Dashboard',
    description: 'Track your own check-ins and see recent activity in one place.',
  },
  {
    emoji: '👑',
    title: 'Admin Overview',
    description: 'View users, check-in volume, and moderation-ready data snapshots.',
  },
  {
    emoji: '🧠',
    title: 'AI Emotion Engine',
    description: 'AI detects your emotion from your mood & note, generates action plans.',
  },
  {
    emoji: '🎮',
    title: 'Mind Games',
    description: '7 calming games recommended based on your current emotional state.',
  },
  {
    emoji: '🏆',
    title: 'XP & Growth',
    description: 'Earn XP from check-ins & games. Level up and unlock badges.',
  },
]

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-[#07111f]">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.15),_transparent_24%),linear-gradient(135deg,_rgba(2,6,23,1),_rgba(15,23,42,1))]" />
        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-200 sm:px-4 sm:py-2 sm:text-sm">
              MERN stack: React · Tailwind · Node.js · Express · MongoDB
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:mt-6 sm:text-5xl lg:text-7xl xl:text-8xl">
              MindMates gives you a calm, secure space to{' '}
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                track progress.
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
              An AI-powered emotional intelligence platform with auth, dashboard, mind games, and
              personalized action plans — all wired to a MongoDB-backed API.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link
                className="rounded-full bg-cyan-400 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-cyan-300 active:scale-95"
                to="/auth"
              >
                Get Started →
              </Link>
              <Link
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-center font-medium text-white transition hover:bg-white/10 active:scale-95"
                to="/dashboard"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 sm:px-6 md:grid-cols-4 lg:px-10">
          {[
            { label: 'Mind Games', value: '7' },
            { label: 'Emotions Tracked', value: '6' },
            { label: 'XP Rewards', value: '5+' },
            { label: 'AI Powered', value: '100%' },
          ].map((stat) => (
            <div key={stat.label} className="px-6 py-8 text-center">
              <p className="text-3xl font-black text-cyan-300 sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
        <div className="mb-10 text-center sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Features</p>
          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Everything you need to stay mentally fit
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {featureCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/30 hover:bg-white/[0.07] sm:rounded-3xl sm:p-6"
            >
              <span className="text-2xl">{card.emoji}</span>
              <h3 className="mt-3 text-base font-semibold text-white sm:text-lg">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/10 bg-gradient-to-br from-cyan-950/40 to-slate-950">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-10">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to track your mental wellness?
          </h2>
          <p className="mt-4 text-slate-300">
            Join MindMates today — it's free, fast, and built for you.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/auth"
              className="rounded-full bg-cyan-400 px-8 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 active:scale-95"
            >
              Create Account
            </Link>
            <Link
              to="/dashboard"
              className="rounded-full border border-white/15 bg-white/5 px-8 py-3 font-medium text-white transition hover:bg-white/10 active:scale-95"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 py-6 text-center sm:px-6">
        <p className="text-xs text-slate-500">
          © 2026 MindMates · Built with ❤️ using MERN Stack
        </p>
      </footer>
    </main>
  )
}

export default LandingPage