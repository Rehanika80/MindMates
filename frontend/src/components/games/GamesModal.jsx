import { useState } from 'react'
import BubbleShot from './BubbleShot'
import Piano from './Piano'
import RainGame from './RainGame'
import Quiz from './Quiz'

const GamesModal = ({ gameRecommendations = [], emotion = 'Calm', onClose }) => {
  const [selectedGame, setSelectedGame] = useState(null)
  const [activeGame, setActiveGame] = useState(null)

  const handleGameClick = (gameId) => {
    setActiveGame(gameId)
  }

  const handleGameClose = () => {
    setActiveGame(null)
  }

  const renderGame = () => {
    switch (activeGame) {
      case 'bubble-shot':
        return <BubbleShot onClose={handleGameClose} emotion={emotion} />
      case 'piano':
        return <Piano onClose={handleGameClose} emotion={emotion} />
      case 'rain':
        return <RainGame onClose={handleGameClose} emotion={emotion} />
      case 'quiz':
        return <Quiz onClose={handleGameClose} emotion={emotion} />
      default:
        return null
    }
  }

  if (activeGame) {
    return renderGame()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-lg p-8 border border-purple-400/20 shadow-2xl max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">🎮 Recommended Games</h2>
            <p className="text-slate-300">
              Based on your <span className="text-cyan-300 font-semibold">{emotion}</span> mood
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
          >
            Close
          </button>
        </div>

        {/* Games Grid */}
        {gameRecommendations && gameRecommendations.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {gameRecommendations.map((game) => (
              <div
                key={game.id}
                onClick={() => handleGameClick(game.id)}
                className="group cursor-pointer rounded-lg border-2 border-purple-400/30 bg-gradient-to-br from-purple-400/10 to-purple-500/5 p-6 transition hover:border-purple-400/60 hover:bg-gradient-to-br hover:from-purple-400/20 hover:to-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20 transform hover:scale-105"
              >
                <div className="text-5xl mb-4">{game.emoji}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                <p className="text-slate-300 mb-4">{game.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">⏱️ Duration:</span>
                    <span className="text-cyan-300 font-semibold">{game.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">💡 Benefit:</span>
                    <span className="text-green-300 font-semibold">{game.benefit}</span>
                  </div>
                </div>
                <button className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition opacity-0 group-hover:opacity-100">
                  Play Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-slate-300 mb-4">
              No specific games recommended for this mood right now.
            </p>
            <p className="text-slate-400">Try any game you like to improve your mood!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GamesModal
