import express from 'express'
import { register, login, adminLogin, googleAuth, getMe } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/admin/login', adminLogin)
router.post('/google', googleAuth)
router.get('/me', protect, getMe)

export default router
