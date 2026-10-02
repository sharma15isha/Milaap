import express from 'express'
import {
  getMyPerformanceHistory,
  getPerformanceAnalytics,
  getSkillPerformance,
  getSkillGap,
} from '../controllers/performanceController.js'
import { protect } from '../middleware/auth.js'
import { authorize } from '../middleware/roles.js'

const router = express.Router()

router.get('/me', protect, authorize('student'), getMyPerformanceHistory)
router.get('/analytics', protect, authorize('student'), getPerformanceAnalytics)
router.get('/skills', protect, authorize('student'), getSkillPerformance)
router.get('/skill-gap', protect, authorize('student'), getSkillGap)

export default router
