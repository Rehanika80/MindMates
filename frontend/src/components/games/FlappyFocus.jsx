import { useEffect, useRef, useState } from 'react'
import { apiRequest } from '../../lib/api.js'

const FlappyFocus = ({ onClose, emotion }) => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  const birdRef = useRef({ x: 110, y: 180, velocity: 0 })
  const gatesRef = useRef([])
  const [score, setScore] = useState(0)
  const [active, setActive] = useState(true)

  const flap = () => {
    birdRef.current.velocity = -7
  }

  const closeGame = async () => {
    try {
      await apiRequest('/games/session', {
        method: 'POST',
        body: JSON.stringify({
          gameId: 'flappy-focus',
          score: score * 25,
          duration: Math.round((Date.now() - startTimeRef.current) / 1000),
          emotion,
        }),
      })
    } catch (error) {
      console.error('Error logging flappy focus session:', error)
    }

    onClose()
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        event.preventDefault()
        flap()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = 900
    canvas.height = 500

    if (gatesRef.current.length === 0) {
      gatesRef.current = [
        { x: 620, gapY: 210, passed: false },
        { x: 980, gapY: 260, passed: false },
      ]
    }

    const animate = () => {
      ctx.fillStyle = '#020617'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      birdRef.current.velocity += 0.35
      birdRef.current.y += birdRef.current.velocity

      ctx.fillStyle = '#22d3ee'
      ctx.beginPath()
      ctx.arc(birdRef.current.x, birdRef.current.y, 16, 0, Math.PI * 2)
      ctx.fill()

      gatesRef.current.forEach((gate) => {
        gate.x -= 3.2
        if (gate.x < -80) {
          gate.x = canvas.width + 260
          gate.gapY = 120 + Math.random() * 240
          gate.passed = false
        }

        const gap = 150
        ctx.fillStyle = '#34d399'
        ctx.fillRect(gate.x, 0, 64, gate.gapY - gap / 2)
        ctx.fillRect(gate.x, gate.gapY + gap / 2, 64, canvas.height)

        const hitX = birdRef.current.x + 16 > gate.x && birdRef.current.x - 16 < gate.x + 64
        const hitY = birdRef.current.y - 16 < gate.gapY - gap / 2 || birdRef.current.y + 16 > gate.gapY + gap / 2
        if (hitX && hitY) {
          setActive(false)
        }

        if (!gate.passed && gate.x + 64 < birdRef.current.x) {
          gate.passed = true
          setScore((current) => current + 1)
        }
      })

      ctx.fillStyle = '#e2e8f0'
      ctx.font = 'bold 24px Arial'
      ctx.fillText(`Focus gates: ${score}`, 24, 40)

      if (birdRef.current.y < 0 || birdRef.current.y > canvas.height) {
        setActive(false)
      }

      if (active) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()
    return () => cancelAnimationFrame(animationRef.current)
  }, [active, score])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-4xl rounded-lg border border-cyan-400/20 bg-slate-950 p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Flappy Focus</h2>
            <p className="text-sm text-slate-300">Click or press Space to keep your focus steady.</p>
          </div>
          <button onClick={closeGame} className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white">
            Close
          </button>
        </div>
        {active ? (
          <canvas
            ref={canvasRef}
            onPointerDown={flap}
            className="h-[62vh] w-full rounded-lg border border-cyan-400/30 bg-slate-900"
          />
        ) : (
          <div className="rounded-lg border border-cyan-400/20 bg-slate-900 p-10 text-center">
            <h3 className="text-4xl font-bold text-white">Session Complete</h3>
            <p className="mt-4 text-3xl font-bold text-cyan-300">Score: {score * 25}</p>
            <button onClick={closeGame} className="mt-8 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950">
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FlappyFocus
