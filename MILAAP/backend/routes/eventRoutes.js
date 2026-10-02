import express from 'express'
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventParticipants,
  getOrganizerStats,
  getMyRegistrations,
  getOrganizerEvents,
} from '../controllers/eventController.js'
import { getEventLeaderboard } from '../controllers/leaderboardController.js'
import { protect } from '../middleware/auth.js'
import { authorize } from '../middleware/roles.js'

const router = express.Router()

router.get('/', getEvents)
router.get('/my-registrations', protect, authorize('student'), getMyRegistrations)
router.get('/organizer/my-events', protect, authorize('organizer', 'admin'), getOrganizerEvents)
router.get('/stats/organizer', protect, authorize('organizer', 'admin'), getOrganizerStats)
router.get('/:id', getEventById)
router.get('/:id/participants', protect, authorize('organizer', 'admin'), getEventParticipants)
router.get('/:id/leaderboard', getEventLeaderboard)

router.post('/', protect, authorize('organizer', 'admin'), createEvent)
router.post('/:id/register', protect, authorize('student'), registerForEvent)

router.put('/:id', protect, authorize('organizer', 'admin'), updateEvent)
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent)

export default router
