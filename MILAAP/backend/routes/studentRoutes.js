import express from 'express'
import { getStudents, getStudentById, updateStudent, getMyProfile } from '../controllers/studentController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, getStudents)
router.get('/me', protect, getMyProfile)
router.get('/:id', protect, getStudentById)
router.put('/:id', protect, updateStudent)

export default router
