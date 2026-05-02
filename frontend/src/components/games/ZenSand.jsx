import { useRef, useState } from 'react'
import { apiRequest } from '../../lib/api.js'

const ZenSand = ({ onClose, emotion }) => {
  const canvasRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  const [isDrawing, setIsDrawing] = useState(false)
  const [score, setScore] = useState(0)

  const drawTrail = (event) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(x, y, 12, 0, Math.PI * 2)
    ctx.stroke()

    ctx.strokeStyle = 'rgba(34, 211, 238, 0.45)'
    ctx.lineWidth = 1
    for (let i = -2; i <= 2; i += 1) {
      ctx.beginPath()
      ctx.arc(x + i * 12, y, 9, 0, Math.PI * 2)
      ctx.stroke()
    }

    setScore((current) => current + 1)
  }

  const smoothSand = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#334155')
    gradient.addColorStop(1, '#0f172a')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setScore((current) => Math.max(0, current - 10))
  }

  const closeGame = async () => {
    try {
      await apiRequest('/games/session', {
        method: 'POST',
        body: JSON.stringify({
          gameId: 'zen-sand',
          score: Math.min(400, score),
          duration: Math.round((Date.now() - startTimeRef.current) / 1000),
          emotion,
        }),
      })
    } catch (error) {
      console.error('Error logging zen sand session:', error)
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-4xl rounded-lg border border-emerald-400/20 bg-slate-950 p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Zen Sand</h2>
            <p className="text-sm text-slate-300">Trace slow circles and smooth the sand whenever you need a reset.</p>
          </div>
          <button onClick={closeGame} className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white">
            Close
          </button>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <button onClick={smoothSand} className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950">
            Smooth Sand
          </button>
          <span className="text-sm font-semibold text-emerald-200">XP score: {Math.min(400, score)}</span>
        </div>
        <canvas
          ref={canvasRef}
          width="900"
          height="520"
          onPointerDown={(event) => {
            setIsDrawing(true)
            drawTrail(event)
          }}
          onPointerMove={(event) => isDrawing && drawTrail(event)}
          onPointerUp={() => setIsDrawing(false)}
          onPointerLeave={() => setIsDrawing(false)}
          className="h-[62vh] w-full touch-none rounded-lg border border-emerald-400/30 bg-slate-800"
        />
      </div>
    </div>
  )
}

export default ZenSand
