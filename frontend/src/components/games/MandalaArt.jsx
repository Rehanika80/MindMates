import { useRef, useState } from 'react'
import { apiRequest } from '../../lib/api.js'

const colors = ['#22d3ee', '#a78bfa', '#34d399', '#f59e0b', '#fb7185', '#f8fafc']

const MandalaArt = ({ onClose, emotion }) => {
  const canvasRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  const [brushColor, setBrushColor] = useState(colors[0])
  const [strokes, setStrokes] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)

  const drawPoint = (event) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const dx = x - cx
    const dy = y - cy

    ctx.fillStyle = brushColor
    for (let i = 0; i < 12; i += 1) {
      const angle = (Math.PI * 2 * i) / 12
      const rx = cx + dx * Math.cos(angle) - dy * Math.sin(angle)
      const ry = cy + dx * Math.sin(angle) + dy * Math.cos(angle)
      ctx.beginPath()
      ctx.arc(rx, ry, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const handlePointerMove = (event) => {
    if (!isDrawing) return
    drawPoint(event)
    setStrokes((current) => current + 1)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    setStrokes(0)
  }

  const closeGame = async () => {
    try {
      await apiRequest('/games/session', {
        method: 'POST',
        body: JSON.stringify({
          gameId: 'mandala-art',
          score: Math.min(500, strokes * 2),
          duration: Math.round((Date.now() - startTimeRef.current) / 1000),
          emotion,
        }),
      })
    } catch (error) {
      console.error('Error logging mandala session:', error)
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-4xl rounded-lg border border-cyan-400/20 bg-slate-950 p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Mandala Art</h2>
            <p className="text-sm text-slate-300">Draw once and watch symmetry bloom.</p>
          </div>
          <button onClick={closeGame} className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white">
            Close
          </button>
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setBrushColor(color)}
              className={`h-9 w-9 rounded-full border-2 ${brushColor === color ? 'border-white' : 'border-white/20'}`}
              style={{ backgroundColor: color }}
              aria-label={`Use ${color}`}
            />
          ))}
          <button onClick={clearCanvas} className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white">
            Clear
          </button>
          <span className="ml-auto text-sm font-semibold text-cyan-200">XP score: {Math.min(500, strokes * 2)}</span>
        </div>
        <canvas
          ref={canvasRef}
          width="900"
          height="520"
          onPointerDown={(event) => {
            setIsDrawing(true)
            drawPoint(event)
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={() => setIsDrawing(false)}
          onPointerLeave={() => setIsDrawing(false)}
          className="h-[62vh] w-full touch-none rounded-lg border border-cyan-400/30 bg-slate-900"
        />
      </div>
    </div>
  )
}

export default MandalaArt
