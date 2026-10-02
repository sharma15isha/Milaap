import express from 'express'
import { getMyNotifications, markNotificationRead } from '../controllers/notificationController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, getMyNotifications)
router.put('/:id/read', protect, markNotificationRead)

export default router
