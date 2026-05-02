import { Router } from 'express'
import { createCheckIn, getCheckIns, getMyCheckIns } from '../controllers/checkInController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', getCheckIns)
router.get('/mine', protect, getMyCheckIns)
router.post('/', protect, createCheckIn)

export default router