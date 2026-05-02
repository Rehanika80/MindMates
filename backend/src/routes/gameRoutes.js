import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
  getGameRecommendations,
  logGameSession,
  getUserGameStats,
  getGameLeaderboard,
} from '../controllers/gameController.js'

const router = Router()

// Public routes
router.get('/recommendations', getGameRecommendations)
router.get('/leaderboard', getGameLeaderboard)

// Protected routes
router.post('/session', protect, logGameSession)
router.get('/stats', protect, getUserGameStats)

export default router
