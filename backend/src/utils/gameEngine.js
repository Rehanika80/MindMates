// Game recommendations and metadata based on mood
const GAME_LIBRARY = {
  Calm: [
    {
      id: 'zen-sand',
      name: 'Zen Sand',
      description: 'Draw calming sand trails and reset your breathing',
      duration: '3-5 min',
      benefit: 'Grounding and calm',
      emoji: 'Zen',
    },
    {
      id: 'mandala-art',
      name: 'Mandala Art',
      description: 'Create symmetrical mindful patterns',
      duration: '5-10 min',
      benefit: 'Creative relaxation',
      emoji: 'Art',
    },
    {
      id: 'piano',
      name: 'Piano Master',
      description: 'Play relaxing melodies on the piano',
      duration: '5-10 min',
      benefit: 'Stress relief through music',
      emoji: '🎹',
    },
    {
      id: 'bubble-shot',
      name: 'Bubble Shot',
      description: 'Pop bubbles at a relaxed pace',
      duration: '3-5 min',
      benefit: 'Light, meditative gameplay',
      emoji: '🫧',
    },
  ],
  Happy: [
    {
      id: 'bubble-shot',
      name: 'Bubble Shot',
      description: 'Pop bubbles at a relaxed pace',
      duration: '3-5 min',
      benefit: 'Keep the momentum going',
      emoji: '🫧',
    },
    {
      id: 'flappy-focus',
      name: 'Flappy Focus',
      description: 'Guide your focus through gentle gates',
      duration: '3-5 min',
      benefit: 'Quick reflex boost',
      emoji: 'Fly',
    },
    {
      id: 'quiz',
      name: 'Quick Quiz',
      description: 'Answer fun trivia questions',
      duration: '5-10 min',
      benefit: 'Celebrate learning',
      emoji: '❓',
    },
  ],
  Focused: [
    {
      id: 'flappy-focus',
      name: 'Flappy Focus',
      description: 'Keep steady rhythm through focus gates',
      duration: '3-5 min',
      benefit: 'Attention and timing',
      emoji: 'Fly',
    },
    {
      id: 'quiz',
      name: 'Quick Quiz',
      description: 'Challenge your brain with trivia',
      duration: '5-10 min',
      benefit: 'Sharpen focus and memory',
      emoji: '❓',
    },
  ],
  Stressed: [
    {
      id: 'zen-sand',
      name: 'Zen Sand',
      description: 'Slowly draw, breathe, and smooth the sand',
      duration: '3-5 min',
      benefit: 'Release tension',
      emoji: 'Zen',
    },
    {
      id: 'rain',
      name: 'Rain Drops',
      description: 'Dodge falling raindrops',
      duration: '3-5 min',
      benefit: 'Release tension through gameplay',
      emoji: '🌧️',
    },
    {
      id: 'piano',
      name: 'Piano Master',
      description: 'Play calming piano melodies',
      duration: '5-10 min',
      benefit: 'Immediate stress relief',
      emoji: '🎹',
    },
  ],
  Tired: [
    {
      id: 'mandala-art',
      name: 'Mandala Art',
      description: 'Low-pressure pattern making',
      duration: '5-10 min',
      benefit: 'Gentle creative recharge',
      emoji: 'Art',
    },
    {
      id: 'piano',
      name: 'Piano Master',
      description: 'Play relaxing melodies',
      duration: '5-10 min',
      benefit: 'Gentle, restorative activity',
      emoji: '🎹',
    },
    {
      id: 'bubble-shot',
      name: 'Bubble Shot',
      description: 'Pop bubbles slowly',
      duration: '3-5 min',
      benefit: 'Low-effort, meditative',
      emoji: '🫧',
    },
  ],
  Sad: [
    {
      id: 'mandala-art',
      name: 'Mandala Art',
      description: 'Build a bright repeating pattern',
      duration: '5-10 min',
      benefit: 'Positive creative expression',
      emoji: 'Art',
    },
    {
      id: 'quiz',
      name: 'Quick Quiz',
      description: 'Learn fun facts',
      duration: '5-10 min',
      benefit: 'Positive mental engagement',
      emoji: '❓',
    },
    {
      id: 'piano',
      name: 'Piano Master',
      description: 'Express emotions through music',
      duration: '5-10 min',
      benefit: 'Emotional outlet',
      emoji: '🎹',
    },
  ],
}

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
]

const getGameRecommendations = (emotion) => {
  return GAME_LIBRARY[emotion] || GAME_LIBRARY.Calm
}

const getRandomQuizQuestions = (count = 5) => {
  const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

const createGameSession = (emotion, gameId) => {
  return {
    gameId,
    emotion,
    startTime: new Date(),
    sessionId: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  }
}

export const getGamesForMood = (emotion) => {
  return getGameRecommendations(emotion)
}

export const getGameConfig = (gameId) => {
  const allGames = Object.values(GAME_LIBRARY).flat()
  return allGames.find((game) => game.id === gameId)
}

export const getAllGames = () => {
  const games = Object.values(GAME_LIBRARY).flat()
  return [...new Map(games.map((game) => [game.id, game])).values()]
}

export const generateQuizSession = () => {
  return getRandomQuizQuestions(5)
}

export const createGameRecommendation = (emotion, intensity) => {
  const games = getGameRecommendations(emotion)
  
  if (intensity >= 4) {
    return games.slice(0, 1) // Only recommend one game for high stress
  }
  
  return games
}

export default {
  getGamesForMood,
  getGameConfig,
  getAllGames,
  generateQuizSession,
  createGameRecommendation,
  QUIZ_QUESTIONS,
  GAME_LIBRARY,
}
