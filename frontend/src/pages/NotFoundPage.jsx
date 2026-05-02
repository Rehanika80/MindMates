import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-3xl flex-col items-center justify-center px-6 text-center">
    <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">404</p>
    <h1 className="mt-4 text-4xl font-bold text-white">Page not found</h1>
    <p className="mt-3 text-slate-300">The route you requested does not exist.</p>
    <Link to="/" className="mt-8 rounded-full bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300">
      Go home
    </Link>
  </main>
)

export default NotFoundPage