import { useEffect, useRef, useState } from 'react'
import { apiRequest } from '../../lib/api.js'

const BubbleShot = ({ onClose, emotion }) => {
  const canvasRef = useRef(null)
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(true)
  const [timeLeft, setTimeLeft] = useState(60)
  const bubblesRef = useRef([])
  const animationRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameActive(false)
      // Log game session
      logGameSession()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const logGameSession = async () => {
    if (isSaving) return
    setIsSaving(true)

    try {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000)
      await apiRequest('/games/session', {
        method: 'POST',
        body: JSON.stringify({
          gameId: 'bubble-shot',
          score: score,
          duration: duration,
          emotion: emotion,
        }),
      })
    } catch (error) {
      console.error('Error logging game session:', error)
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !gameActive) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth - 40
    canvas.height = window.innerHeight - 200

    // Initialize bubbles
    if (bubblesRef.current.length === 0) {
      for (let i = 0; i < 8; i++) {
        bubblesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 20 + 15,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
          popped: false,
        })
      }
    }

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      bubblesRef.current.forEach((bubble) => {
        if (!bubble.popped) {
          const dist = Math.hypot(bubble.x - x, bubble.y - y)
          if (dist < bubble.radius) {
            bubble.popped = true
            setScore((prev) => prev + 10)

            // Add new bubble
            bubblesRef.current.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              radius: Math.random() * 20 + 15,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
              popped: false,
            })
          }
        }
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      bubblesRef.current.forEach((bubble) => {
        if (!bubble.popped) {
          bubble.x += bubble.vx
          bubble.y += bubble.vy

          if (bubble.x - bubble.radius < 0 || bubble.x + bubble.radius > canvas.width) {
            bubble.vx *= -1
            bubble.x = Math.max(bubble.radius, Math.min(canvas.width - bubble.radius, bubble.x))
          }
          if (bubble.y - bubble.radius < 0 || bubble.y + bubble.radius > canvas.height) {
            bubble.vy *= -1
            bubble.y = Math.max(bubble.radius, Math.min(canvas.height - bubble.radius, bubble.y))
          }

          ctx.fillStyle = bubble.color
          ctx.beginPath()
          ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2)
          ctx.fill()

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
          ctx.lineWidth = 2
          ctx.stroke()
        }
      })

      if (gameActive) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    canvas.addEventListener('click', handleClick)
    animate()

    return () => {
      canvas.removeEventListener('click', handleClick)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameActive])

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-white">🫧 Bubble Shot</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Close
          </button>
        </div>

        <div className="flex justify-between mb-4">
          <div className="text-2xl font-bold text-cyan-300">Score: {score}</div>
          <div className="text-2xl font-bold text-yellow-300">Time: {timeLeft}s</div>
        </div>

        {gameActive ? (
          <canvas ref={canvasRef} className="w-full border-2 border-cyan-400 rounded-lg bg-slate-900" />
        ) : (
          <div className="bg-gradient-to-br from-purple-900 to-slate-900 p-8 rounded-lg text-center">
            <h3 className="text-4xl font-bold text-white mb-4">Game Over!</h3>
            <p className="text-3xl text-cyan-300 mb-8">Final Score: {score}</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BubbleShot
