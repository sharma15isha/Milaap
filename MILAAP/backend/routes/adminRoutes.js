import express from 'express'
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllAdminEvents,
  deleteAdminEvent,
} from '../controllers/adminController.js'
import { adminLogin } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/roles.js'

const router = express.Router()

// Dedicated Admin Login route mounted at /api/admin/login
router.post('/login', adminLogin)

// Protected Admin Routes (Requires valid JWT + Admin Role)
router.use(protect, requireAdmin)

router.get('/stats', getAdminStats)
router.get('/users', getAllUsers)
router.put('/users/:id/role', updateUserRole)
router.delete('/users/:id', deleteUser)

router.get('/events', getAllAdminEvents)
router.delete('/events/:id', deleteAdminEvent)

export default router
