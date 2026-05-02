const LEVEL_SIZE = 100

const REWARDS = [
  { id: 'first-play', title: 'First Play', description: 'Complete your first mind game.', minXp: 25 },
  { id: 'focus-spark', title: 'Focus Spark', description: 'Reach 100 XP.', minXp: 100 },
  { id: 'steady-builder', title: 'Steady Builder', description: 'Reach 250 XP.', minXp: 250 },
  { id: 'calm-master', title: 'Calm Master', description: 'Reach 500 XP.', minXp: 500 },
  { id: 'growth-legend', title: 'Growth Legend', description: 'Reach 1000 XP.', minXp: 1000 },
]

const uniquePlayDays = (sessions) =>
  new Set(
    sessions
      .map((session) => session.createdAt || session.startTime)
      .filter(Boolean)
      .map((date) => new Date(date).toISOString().slice(0, 10)),
  ).size

export const calculateGrowthStats = (sessions = [], checkIns = []) => {
  const totalScore = sessions.reduce((sum, session) => sum + (Number(session.score) || 0), 0)
  const playDays = uniquePlayDays(sessions)
  const streakDays = Math.max(playDays, uniquePlayDays(checkIns))
  const xp = Math.max(
    0,
    Math.round(sessions.length * 25 + totalScore / 5 + checkIns.length * 15 + streakDays * 20),
  )
  const level = Math.floor(xp / LEVEL_SIZE) + 1
  const levelXp = xp % LEVEL_SIZE
  const nextLevelXp = LEVEL_SIZE
  const unlockedRewards = REWARDS.filter((reward) => xp >= reward.minXp)

  if (streakDays >= 3 && !unlockedRewards.some((reward) => reward.id === 'three-day-focus')) {
    unlockedRewards.push({
      id: 'three-day-focus',
      title: '3 Day Focus Streak',
      description: '3 days focus streak = Level Up.',
      minXp: 0,
    })
  }

  return {
    xp,
    level,
    levelXp,
    nextLevelXp,
    progressPercent: Math.round((levelXp / nextLevelXp) * 100),
    streakDays,
    rewards: unlockedRewards,
    nextReward: REWARDS.find((reward) => xp < reward.minXp) || null,
  }
}
