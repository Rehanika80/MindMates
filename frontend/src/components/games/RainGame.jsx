import { useEffect, useRef, useState } from 'react'
import { apiRequest } from '../../lib/api.js'

const RainGame = ({ onClose, emotion }) => {
  const canvasRef = useRef(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameActive, setGameActive] = useState(true)
  const playerRef = useRef({ x: 0, y: 0, width: 40, height: 40 })
  const raindropsRef = useRef([])
  const keysRef = useRef({})
  const animationRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key] = true
    }

    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const logGameSession = async () => {
    if (isSaving) return
    setIsSaving(true)

    try {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000)
      await apiRequest('/games/session', {
        method: 'POST',
        body: JSON.stringify({
          gameId: 'rain',
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

  const handleGameClose = () => {
    logGameSession()
    onClose()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !gameActive) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth - 40
    canvas.height = window.innerHeight - 200

    playerRef.current.x = canvas.width / 2 - playerRef.current.width / 2
    playerRef.current.y = canvas.height - 60

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(15, 23, 42, 0.2)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update player position
      if (keysRef.current['ArrowLeft'] || keysRef.current['a']) {
        playerRef.current.x = Math.max(0, playerRef.current.x - 7)
      }
      if (keysRef.current['ArrowRight'] || keysRef.current['d']) {
        playerRef.current.x = Math.min(canvas.width - playerRef.current.width, playerRef.current.x + 7)
      }

      // Draw player
      ctx.fillStyle = '#06b6d4'
      ctx.fillRect(
        playerRef.current.x,
        playerRef.current.y,
        playerRef.current.width,
        playerRef.current.height
      )

      // Add new raindrops
      if (Math.random() < 0.02) {
        raindropsRef.current.push({
          x: Math.random() * canvas.width,
          y: -10,
          width: 8,
          height: 15,
          speed: Math.random() * 3 + 4,
          color: `hsl(200, ${Math.random() * 30 + 70}%, ${Math.random() * 20 + 50}%)`,
        })
      }

      // Update raindrops
      raindropsRef.current = raindropsRef.current.filter((drop) => {
        drop.y += drop.speed

        // Draw raindrop
        ctx.fillStyle = drop.color
        ctx.fillRect(drop.x, drop.y, drop.width, drop.height)

        // Check collision with player
        if (
          drop.x < playerRef.current.x + playerRef.current.width &&
          drop.x + drop.width > playerRef.current.x &&
          drop.y < playerRef.current.y + playerRef.current.height &&
          drop.y + drop.height > playerRef.current.y
        ) {
          setScore((prev) => prev + 10)
          return false // Remove raindrop
        }

        // Remove if off screen
        if (drop.y > canvas.height) {
          setLives((prev) => {
            const newLives = prev - 1
            if (newLives <= 0) {
              setGameActive(false)
            }
            return newLives
          })
          return false
        }

        return true
      })

      // Draw UI
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 24px Arial'
      ctx.fillText(`Score: ${score}`, 20, 40)
      ctx.fillText(`Lives: ${lives}`, canvas.width - 150, 40)

      if (gameActive) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [score, lives, gameActive])

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-white">🌧️ Rain Drops</h2>
          <button
            onClick={handleGameClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Close
          </button>
        </div>

        <p className="text-slate-300 mb-4">
          Use ← → arrows or A/D to move and catch the raindrops!
        </p>

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

export default RainGame
