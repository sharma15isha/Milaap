import express from 'express'
import { createProject, updateProject, getProjectById, getProjects, getMySubmissions } from '../controllers/projectController.js'
import { protect } from '../middleware/auth.js'
import { authorize } from '../middleware/roles.js'

const router = express.Router()

router.get('/', protect, getProjects)
router.get('/me', protect, authorize('student'), getMySubmissions)
router.get('/:id', protect, getProjectById)
router.post('/', protect, authorize('student'), createProject)
router.put('/:id', protect, authorize('student'), updateProject)

export default router
