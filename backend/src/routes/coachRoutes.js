import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { chatWithCoach } from '../controllers/coachController.js'

const router = Router()

router.post('/chat', protect, chatWithCoach)

export default router