import { useEffect, useState } from 'react'
import { apiRequest } from '../../lib/api.js'

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correct: 'Mars',
  },
  {
    id: 2,
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'],
    correct: 'Pacific',
  },
  {
    id: 3,
    question: 'What is the smallest country in the world?',
    options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'],
    correct: 'Vatican City',
  },
  {
    id: 4,
    question: 'Which element has the chemical symbol "Au"?',
    options: ['Silver', 'Gold', 'Aluminum', 'Argon'],
    correct: 'Gold',
  },
  {
    id: 5,
    question: 'What is the capital of Japan?',
    options: ['Osaka', 'Kyoto', 'Tokyo', 'Hokkaido'],
    correct: 'Tokyo',
  },
  {
    id: 6,
    question: 'How many continents are there?',
    options: ['5', '6', '7', '8'],
    correct: '7',
  },
  {
    id: 7,
    question: 'What is the fastest land animal?',
    options: ['Lion', 'Horse', 'Cheetah', 'Gazelle'],
    correct: 'Cheetah',
  },
  {
    id: 8,
    question: 'Which gas do plants absorb from the atmosphere?',
    options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
    correct: 'Carbon Dioxide',
  },
  {
    id: 9,
    question: 'What is the largest mammal in the world?',
    options: ['African Elephant', 'Giraffe', 'Blue Whale', 'Hippopotamus'],
    correct: 'Blue Whale',
  },
  {
    id: 10,
    question: 'What year did the Titanic sink?',
    options: ['1912', '1920', '1905', '1915'],
    correct: '1912',
  },
]

const Quiz = ({ onClose, emotion }) => {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5)
    setQuestions(shuffled)
  }, [])

  const handleAnswerClick = (option) => {
    if (answered) return

    setSelectedAnswer(option)
    setAnswered(true)

    if (option === questions[currentQuestion].correct) {
      setScore((prev) => prev + 20)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setGameComplete(true)
      logGameSession()
    }
  }

  const logGameSession = async () => {
    if (isSaving) return
    setIsSaving(true)

    try {
      const duration = Math.round((Date.now() - startTime) / 1000)
      await apiRequest('/games/session', {
        method: 'POST',
        body: JSON.stringify({
          gameId: 'quiz',
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

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 rounded-lg border border-purple-400/20 max-w-md">
          <p className="text-white text-lg">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (gameComplete) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 rounded-lg border border-purple-400/20 max-w-md text-center">
          <h3 className="text-4xl font-bold text-white mb-4">🎉 Quiz Complete!</h3>
          <p className="text-5xl font-bold text-cyan-300 mb-2">{score}/{questions.length * 20}</p>
          <p className="text-slate-300 mb-8">
            {Math.round((score / (questions.length * 20)) * 100)}% Correct
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 w-full"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const isCorrect = selectedAnswer === question.correct

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-lg p-8 border border-purple-400/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">❓ Quick Quiz</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
          >
            Close
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-cyan-300 font-semibold">Score: {score}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">{question.question}</h3>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === option
              const showCorrect = answered && option === question.correct
              const showIncorrect = answered && isSelected && !isCorrect

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerClick(option)}
                  disabled={answered}
                  className={`w-full p-4 rounded-lg font-semibold text-lg transition transform border-2 ${
                    showCorrect
                      ? 'border-green-400 bg-green-400/20 text-green-200'
                      : showIncorrect
                        ? 'border-red-400 bg-red-400/20 text-red-200'
                        : isSelected && answered
                          ? 'border-yellow-400 bg-yellow-400/10 text-yellow-200'
                          : 'border-purple-400/30 bg-purple-400/10 text-slate-200 hover:border-purple-400/60 hover:bg-purple-400/20 active:scale-95'
                  } ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {option}
                  {showCorrect && ' ✓'}
                  {showIncorrect && ' ✗'}
                </button>
              )
            })}
          </div>
        </div>

        {/* Next Button */}
        {answered && (
          <div className="text-center">
            <p className={`mb-4 text-lg font-semibold ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition"
            >
              {currentQuestion === questions.length - 1 ? 'See Results' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Quiz
