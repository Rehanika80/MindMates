import CheckIn from '../models/CheckIn.js'
import mongoose from 'mongoose'
import GameSession from '../models/GameSession.js'
import { calculateGrowthStats } from '../utils/growthSystem.js'
import { findDevCheckInsByUser } from '../utils/devCheckInStore.js'
import { findDevGameSessionsByUser } from '../utils/devGameStore.js'

const countByEmotion = (checkIns) => {
  return checkIns.reduce((accumulator, checkIn) => {
    const emotion = checkIn.detectedEmotion || checkIn.mood || 'Unknown'
    accumulator[emotion] = (accumulator[emotion] || 0) + 1
    return accumulator
  }, {})
}

const getStreak = (checkIns) => {
  if (checkIns.length === 0) {
    return 0
  }

  const uniqueDays = new Set(
    checkIns.map((checkIn) => new Date(checkIn.createdAt).toISOString().slice(0, 10)),
  )

  return uniqueDays.size
}

const buildRecommendations = (topEmotion, recentCheckIn) => {
  const recommendations = []

  if (topEmotion === 'Stressed') {
    recommendations.push('Use a short focus block followed by a reset break.')
  }

  if (topEmotion === 'Tired') {
    recommendations.push('Schedule a lighter task after a short rest.')
  }

  if (topEmotion === 'Focused') {
    recommendations.push('Protect your peak hours and keep distractions away.')
  }

  if (recentCheckIn?.productivityCue) {
    recommendations.push(recentCheckIn.productivityCue)
  }

  if (recommendations.length === 0) {
    recommendations.push('Keep logging check-ins to improve the suggestions.')
  }

  return recommendations.slice(0, 4)
}

export const getDashboardOverview = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const checkIns = findDevCheckInsByUser(req.user._id, 30)
      const gameSessions = findDevGameSessionsByUser(req.user._id)

      return res.json({
        success: true,
        message: 'Dashboard overview loaded',
        data: {
          totalCheckIns: checkIns.length,
          streakDays: calculateGrowthStats(gameSessions, checkIns).streakDays,
          topEmotion: checkIns[0]?.detectedEmotion || checkIns[0]?.mood || 'Calm',
          emotionCounts: countByEmotion(checkIns),
          latestCheckIn: checkIns[0] || null,
          recommendations: ['Backend is live. Connect MongoDB Atlas to save check-ins permanently.'],
          focusScore: 0,
          growth: calculateGrowthStats(gameSessions, checkIns),
        },
      })
    }

    const checkIns = await CheckIn.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(30)
    const gameSessions = await GameSession.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50)
    const emotionCounts = countByEmotion(checkIns)
    const topEmotion =
      Object.entries(emotionCounts).sort((left, right) => right[1] - left[1])[0]?.[0] || 'Calm'
    const latestCheckIn = checkIns[0] || null

    return res.json({
      success: true,
      message: 'Dashboard overview loaded',
      data: {
        totalCheckIns: checkIns.length,
        streakDays: getStreak(checkIns),
        topEmotion,
        emotionCounts,
        latestCheckIn,
        recommendations: buildRecommendations(topEmotion, latestCheckIn),
        focusScore:
          checkIns.length === 0
            ? 0
            : Math.min(100, Math.round((emotionCounts.Focused || 0) * 25 + checkIns.length * 2)),
        growth: calculateGrowthStats(gameSessions, checkIns),
      },
    })
  } catch (error) {
    console.error('getDashboardOverview Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to load dashboard overview',
    })
  }
}
