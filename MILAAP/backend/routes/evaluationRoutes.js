import express from 'express'
import { createEvaluation, getEvaluationsForProject, getJudgeEvaluations } from '../controllers/evaluationController.js'
import { protect } from '../middleware/auth.js'
import { authorize } from '../middleware/roles.js'

const router = express.Router()

router.post('/', protect, authorize('judge'), createEvaluation)
router.get('/judge/me', protect, authorize('judge'), getJudgeEvaluations)
router.get('/:projectId', protect, getEvaluationsForProject)

export default router
