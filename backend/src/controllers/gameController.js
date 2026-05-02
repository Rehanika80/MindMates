import GameSession from '../models/GameSession.js'
import gameEngine from '../utils/gameEngine.js'
import mongoose from 'mongoose'
import { calculateGrowthStats } from '../utils/growthSystem.js'
import {
  createDevGameSession,
  findDevGameSessionsByUser,
  findDevLeaderboard,
} from '../utils/devGameStore.js'

const isDatabaseReady = () => mongoose.connection.readyState === 1

export const getGameRecommendations = async (req, res) => {
  try {
    const { emotion } = req.query

    if (!emotion) {
      return res.status(400).json({
        success: false,
        message: 'Emotion parameter is required',
      })
    }

    const recommendations = gameEngine.getGamesForMood(emotion)

    return res.json({
      success: true,
      message: 'Game recommendations retrieved',
      data: recommendations,
    })
  } catch (error) {
    console.error('getGameRecommendations Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to get game recommendations',
    })
  }
}

export const logGameSession = async (req, res) => {
  try {
    const { gameId, score, duration, emotion, difficulty } = req.body

    if (!gameId) {
      return res.status(400).json({
        success: false,
        message: 'Game ID is required',
      })
    }

    const gameConfig = gameEngine.getGameConfig(gameId)
    if (!gameConfig) {
      return res.status(400).json({
        success: false,
        message: 'Invalid game ID',
      })
    }

    if (!isDatabaseReady()) {
      const gameSession = createDevGameSession({
        user: req.user._id,
        gameId,
        gameName: gameConfig.name,
        score: score || 0,
        duration: duration || 0,
        emotion: emotion || 'Calm',
        difficulty: difficulty || 'normal',
      })
      const sessions = findDevGameSessionsByUser(req.user._id)

      return res.json({
        success: true,
        message: 'Game session recorded',
        data: gameSession,
        growth: calculateGrowthStats(sessions),
      })
    }

    const gameSession = new GameSession({
      user: req.user._id,
      gameId,
      gameName: gameConfig.name,
      score: score || 0,
      duration: duration || 0,
      emotion: emotion || 'Calm',
      difficulty: difficulty || 'normal',
      status: 'completed',
    })

    await gameSession.save()

    return res.json({
      success: true,
      message: 'Game session recorded',
      data: gameSession,
      growth: calculateGrowthStats([gameSession]),
    })
  } catch (error) {
    console.error('logGameSession Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to log game session',
    })
  }
}

export const getUserGameStats = async (req, res) => {
  try {
    if (!isDatabaseReady()) {
      const gameSessions = findDevGameSessionsByUser(req.user._id)
      const totalGamesPlayed = gameSessions.length
      const totalScore = gameSessions.reduce((sum, session) => sum + (session.score || 0), 0)
      const averageScore = totalGamesPlayed > 0 ? Math.round(totalScore / totalGamesPlayed) : 0
      const averageDuration =
        totalGamesPlayed > 0
          ? Math.round(gameSessions.reduce((sum, session) => sum + (session.duration || 0), 0) / totalGamesPlayed)
          : 0

      return res.json({
        success: true,
        message: 'Game stats retrieved',
        data: {
          totalGamesPlayed,
          totalScore,
          averageScore,
          averageDuration,
          recentSessions: gameSessions.slice(0, 10),
          gameStats: [],
          growth: calculateGrowthStats(gameSessions),
        },
      })
    }

    const gameSessions = await GameSession.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(50)

    const totalGamesPlayed = gameSessions.length
    const totalScore = gameSessions.reduce((sum, session) => sum + (session.score || 0), 0)
    const averageScore = totalGamesPlayed > 0 ? Math.round(totalScore / totalGamesPlayed) : 0
    const averageDuration = totalGamesPlayed > 0 ? Math.round(gameSessions.reduce((sum, session) => sum + (session.duration || 0), 0) / totalGamesPlayed) : 0

    const gameStats = {}
    gameSessions.forEach((session) => {
      if (!gameStats[session.gameId]) {
        gameStats[session.gameId] = {
          gameId: session.gameId,
          gameName: session.gameName,
          timesPlayed: 0,
          totalScore: 0,
          highScore: 0,
          averageScore: 0,
        }
      }
      gameStats[session.gameId].timesPlayed += 1
      gameStats[session.gameId].totalScore += session.score || 0
      gameStats[session.gameId].highScore = Math.max(
        gameStats[session.gameId].highScore,
        session.score || 0
      )
      gameStats[session.gameId].averageScore = Math.round(
        gameStats[session.gameId].totalScore / gameStats[session.gameId].timesPlayed
      )
    })

    return res.json({
      success: true,
      message: 'Game stats retrieved',
      data: {
        totalGamesPlayed,
        totalScore,
        averageScore,
        averageDuration,
        recentSessions: gameSessions.slice(0, 10),
        gameStats: Object.values(gameStats),
        growth: calculateGrowthStats(gameSessions),
      },
    })
  } catch (error) {
    console.error('getUserGameStats Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to get user game stats',
    })
  }
}

export const getGameLeaderboard = async (req, res) => {
  try {
    const { gameId } = req.query

    if (!gameId) {
      return res.status(400).json({
        success: false,
        message: 'Game ID is required',
      })
    }

    if (!isDatabaseReady()) {
      return res.json({
        success: true,
        message: 'Leaderboard retrieved',
        data: findDevLeaderboard(gameId),
      })
    }

    const topScores = await GameSession.find({
      gameId,
      status: 'completed',
    })
      .populate('user', 'name email')
      .sort({ score: -1 })
      .limit(10)

    return res.json({
      success: true,
      message: 'Leaderboard retrieved',
      data: topScores,
    })
  } catch (error) {
    console.error('getGameLeaderboard Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to get leaderboard',
    })
  }
}
