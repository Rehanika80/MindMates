import gameEngine from './gameEngine.js'

const EMOTION_RULES = [
  {
    emotion: 'Focused',
    confidence: 0.9,
    keywords: ['focused', 'deep work', 'productive', 'clear', 'productive', 'flow'],
  },
  {
    emotion: 'Stressed',
    confidence: 0.88,
    keywords: ['stress', 'overwhelmed', 'anxious', 'pressure', 'deadline', 'panic'],
  },
  {
    emotion: 'Tired',
    confidence: 0.86,
    keywords: ['tired', 'sleepy', 'exhausted', 'drained', 'fatigued'],
  },
  {
    emotion: 'Sad',
    confidence: 0.84,
    keywords: ['sad', 'down', 'low', 'hurt', 'lonely', 'unmotivated'],
  },
  {
    emotion: 'Happy',
    confidence: 0.9,
    keywords: ['happy', 'great', 'good', 'excited', 'joy', 'grateful', 'calm'],
  },
]

const ACTION_LIBRARY = {
  Focused: [
    'Lock one priority task for 25 minutes.',
    'Keep notifications on silent while you work.',
    'End the block with a one-line progress note.',
  ],
  Stressed: [
    'Take a 3-minute breathing reset before the next task.',
    'Break the problem into the smallest possible next step.',
    'Reduce your task list to one must-do item.',
  ],
  Tired: [
    'Use a 10-minute rest or walk before restarting.',
    'Switch to a lighter task that still moves work forward.',
    'Hydrate and keep the next focus block short.',
  ],
  Sad: [
    'Reach out to one trusted person today.',
    'Choose a tiny win and complete it now.',
    'Write down one thing that still went okay.',
  ],
  Happy: [
    'Capture what helped so you can repeat it tomorrow.',
    'Use this momentum for your hardest task.',
    'Share the win with someone who supported you.',
  ],
  Calm: [
    'Keep a steady pace and protect your focus window.',
    'Turn your current calm into a simple action plan.',
    'Use the moment to clear one pending item.',
  ],
  Default: [
    'Start with one clear next step.',
    'Set a 15-minute timer and begin.',
    'Write down the next action before opening another task.',
  ],
}

const detectEmotionFromText = (mood, note) => {
  const combinedText = `${mood} ${note}`.toLowerCase()

  const matchedRule = EMOTION_RULES.find((rule) =>
    rule.keywords.some((keyword) => combinedText.includes(keyword)),
  )

  if (matchedRule) {
    return {
      ...matchedRule,
      confidence: matchedRule.confidence || 0.8
    }
  }

  return {
    emotion: mood || 'Calm',
    confidence: 0.72,
  }
}

const createActionPlan = (emotion, intensity) => {
  const basePlan = ACTION_LIBRARY[emotion] || ACTION_LIBRARY.Default
  const plan = [...basePlan]

  if (intensity >= 4) {
    plan.unshift('Do not force multitasking right now.')
  }

  return plan.slice(0, 3)
}

const createSupportSuggestion = (emotion, note) => {
  const noteHint = note?.trim() ? `I noticed: "${note.trim().slice(0, 80)}".` : ''

  switch (emotion) {
    case 'Focused':
      return `You already have momentum. ${noteHint} Keep the current rhythm and protect one 25-minute focus block.`
    case 'Stressed':
      return `You do not need to solve everything at once. ${noteHint} Pause, breathe, and cut the work down to the smallest next step.`
    case 'Tired':
      return `Your energy is the signal today. ${noteHint} Shorten the next work block and recover first.`
    case 'Sad':
      return `Stay gentle with yourself. ${noteHint} Choose one tiny win and do not isolate completely.`
    case 'Happy':
      return `Good momentum is present. ${noteHint} Use this window to finish something meaningful and capture what worked.`
    default:
      return `Keep moving with one clear action. ${noteHint} Protect your attention and review the next step after one focused block.`
  }
}

const createProductivityCue = (emotion, intensity) => {
  if (emotion === 'Stressed' || intensity >= 4) {
    return 'Focus mode: 25 minutes work, 5 minutes reset.'
  }

  if (emotion === 'Tired') {
    return 'Recovery mode: 10 minutes rest, then one light task.'
  }

  return 'Focus mode: 45 minutes deep work, 10 minutes review.'
}

const createInsightTags = (emotion, note) => {
  const tags = [emotion.toLowerCase()]

  if (/deadline|urgent|pressure/.test(note.toLowerCase())) {
    tags.push('deadline-pressure')
  }

  if (/sleep|tired|fatigue/.test(note.toLowerCase())) {
    tags.push('energy-drop')
  }

  if (/team|people|conversation|call/.test(note.toLowerCase())) {
    tags.push('social-impact')
  }

  return Array.from(new Set(tags))
}

export const analyzeCheckIn = ({ mood, note, intensity = 3 }) => {
  const detection = detectEmotionFromText(mood, note)
  const detectedEmotion = detection.emotion || 'Calm'
  const gameRecommendations = gameEngine.createGameRecommendation(detectedEmotion, intensity)

  return {
    detectedEmotion,
    confidence: detection.confidence ?? 0.72,
    actionPlan: createActionPlan(detectedEmotion, intensity),
    supportSuggestion: createSupportSuggestion(detectedEmotion, note),
    productivityCue: createProductivityCue(detectedEmotion, intensity),
    insightTags: createInsightTags(detectedEmotion, note),
    gameRecommendations: gameRecommendations,
  }
}

export const analyzeChatMessage = ({ message, detectedEmotion = 'Calm' }) => {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('focus') || lowerMessage.includes('study') || lowerMessage.includes('work')) {
    return {
      reply: `Use a single priority task and work for 25 minutes. Since you feel ${detectedEmotion.toLowerCase()}, keep the target realistic and remove distractions first.`,
      quickActions: ['Start a 25-minute timer', 'Close one distracting tab', 'Write the first tiny step'],
    }
  }

  if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('overwhelmed')) {
    return {
      reply: 'Pause for one minute. Inhale for 4, hold 4, exhale 6. Then choose only the next smallest action instead of the whole problem.',
      quickActions: ['Breathe for 1 minute', 'List one next action', 'Reply to only the most urgent message'],
    }
  }

  if (lowerMessage.includes('motivation') || lowerMessage.includes('lazy') || lowerMessage.includes('stuck')) {
    return {
      reply: 'Motivation is often a result of motion. Start with a 10-minute version of the task and let momentum do the rest.',
      quickActions: ['Open the task', 'Work for 10 minutes', 'Mark one small win'],
    }
  }

  return {
    reply: `I am tracking your state as ${detectedEmotion.toLowerCase()}. Keep it simple: choose one action, set a timer, and review progress after the block.`,
    quickActions: ['Set a focus timer', 'Pick one action', 'Review the result'],
  }
}
