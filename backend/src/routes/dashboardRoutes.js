import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getDashboardOverview } from '../controllers/dashboardController.js'

const router = Router()

router.get('/overview', protect, getDashboardOverview)

export default router