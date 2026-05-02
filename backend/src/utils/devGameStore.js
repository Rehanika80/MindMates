const sessions = []

export const createDevGameSession = (session) => {
  const nextSession = {
    _id: `dev-game-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    ...session,
    status: session.status || 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  sessions.unshift(nextSession)
  return nextSession
}

export const findDevGameSessionsByUser = (userId, limit = 50) =>
  sessions.filter((session) => String(session.user) === String(userId)).slice(0, limit)

export const findDevLeaderboard = (gameId, limit = 10) =>
  sessions
    .filter((session) => session.gameId === gameId && session.status === 'completed')
    .sort((left, right) => (right.score || 0) - (left.score || 0))
    .slice(0, limit)
