const checkIns = []

export const createDevCheckIn = (checkIn) => {
  const nextCheckIn = {
    _id: `dev-checkin-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    ...checkIn,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  checkIns.unshift(nextCheckIn)
  return nextCheckIn
}

export const findDevCheckInsByUser = (userId, limit = 10) =>
  checkIns.filter((checkIn) => String(checkIn.user) === String(userId)).slice(0, limit)

export const findPublicDevCheckIns = (limit = 5) => checkIns.filter((checkIn) => !checkIn.user).slice(0, limit)
