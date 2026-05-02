import { Link } from 'react-router-dom'

const featureCards = [
  {
    title: 'Secure auth',
    description: 'Register, log in, and persist a JWT session across refreshes.',
  },
  {
    title: 'Personal dashboard',
    description: 'Track your own check-ins and see recent activity in one place.',
  },
  {
    title: 'Admin overview',
    description: 'View users, check-in volume, and moderation-ready data snapshots.',
  },
]

const LandingPage = () => {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.15),_transparent_24%),linear-gradient(135deg,_rgba(2,6,23,1),_rgba(15,23,42,1))]" />
        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-6 py-8 lg:px-10">
          <div className="max-w-4xl pt-12">
            <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              MERN stack build: React, Tailwind, Node.js, Express, MongoDB
            </span>
            <h1 className="mt-6 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-8xl">
              MindMates gives your users a calm, secure space to track progress.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A production-shaped starter with auth, dashboard, and admin flows already wired to a MongoDB-backed API.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rounded-full bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300" to="/auth">
                Get started
              </Link>
              <Link className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10" to="/dashboard">
                Open dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          {featureCards.map((card) => (
            <article key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-white">{card.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{card.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default LandingPage