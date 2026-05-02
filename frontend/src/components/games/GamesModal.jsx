import { useState } from 'react'
import BubbleShot from './BubbleShot'
import Piano from './Piano'
import RainGame from './RainGame'
import Quiz from './Quiz'
import MandalaArt from './MandalaArt'
import ZenSand from './ZenSand'
import FlappyFocus from './FlappyFocus'

const gameCatalog = [
  {
    id: 'bubble-shot',
    name: 'Bubble Popup',
    description: 'Pop floating bubbles for a quick playful reset.',
    duration: '3-5 min',
    benefit: 'Light focus',
    label: 'Pop',
  },
  {
    id: 'rain',
    name: 'Rain Catch',
    description: 'Catch falling raindrops and settle your attention.',
    duration: '3-5 min',
    benefit: 'Stress release',
    label: 'Rain',
  },
  {
    id: 'piano',
    name: 'Rain and Piano',
    description: 'Play gentle notes for a calm musical break.',
    duration: '5-10 min',
    benefit: 'Relaxation',
    label: 'Piano',
  },
  {
    id: 'mandala-art',
    name: 'Mandala Art',
    description: 'Create symmetrical mindful patterns.',
    duration: '5-10 min',
    benefit: 'Creative calm',
    label: 'Art',
  },
  {
    id: 'zen-sand',
    name: 'Zen Sand',
    description: 'Draw soothing sand trails and smooth them away.',
    duration: '3-5 min',
    benefit: 'Grounding',
    label: 'Zen',
  },
  {
    id: 'flappy-focus',
    name: 'Flappy Focus',
    description: 'Fly through focus gates with steady timing.',
    duration: '3-5 min',
    benefit: 'Attention rhythm',
    label: 'Fly',
  },
  {
    id: 'quiz',
    name: 'Quick Quiz',
    description: 'Answer short trivia questions to wake up your brain.',
    duration: '5-10 min',
    benefit: 'Memory boost',
    label: 'Quiz',
  },
]

const GamesModal = ({ gameRecommendations = [], emotion = 'Calm', onClose }) => {
  const [activeGame, setActiveGame] = useState(null)

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
      case 'mandala-art':
        return <MandalaArt onClose={handleGameClose} emotion={emotion} />
      case 'zen-sand':
        return <ZenSand onClose={handleGameClose} emotion={emotion} />
      case 'flappy-focus':
        return <FlappyFocus onClose={handleGameClose} emotion={emotion} />
      default:
        return null
    }
  }

  if (activeGame) {
    return renderGame()
  }

  const mergedGames = [
    ...gameRecommendations.map((game) => ({
      ...game,
      label: game.label || game.emoji || 'Play',
    })),
    ...gameCatalog.filter((game) => !gameRecommendations.some((recommended) => recommended.id === game.id)),
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-lg border border-purple-400/20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 shadow-2xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-4xl font-bold text-white">Mind Games</h2>
            <p className="mt-2 text-slate-300">
              Recommended for your <span className="font-semibold text-cyan-300">{emotion}</span> mood, plus the full game library.
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600">
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {mergedGames.map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={() => setActiveGame(game.id)}
              className="group rounded-lg border-2 border-purple-400/30 bg-gradient-to-br from-purple-400/10 to-purple-500/5 p-6 text-left transition hover:scale-[1.02] hover:border-purple-400/60 hover:from-purple-400/20 hover:to-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <span className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-bold text-cyan-200">
                {game.label}
              </span>
              <h3 className="text-2xl font-bold text-white">{game.name}</h3>
              <p className="mt-3 min-h-16 text-sm leading-6 text-slate-300">{game.description}</p>
              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-400">Duration</span>
                  <span className="font-semibold text-cyan-300">{game.duration}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-400">Benefit</span>
                  <span className="font-semibold text-green-300">{game.benefit}</span>
                </div>
              </div>
              <span className="mt-6 block rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-center font-semibold text-white opacity-90 transition group-hover:opacity-100">
                Play Now
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GamesModal
