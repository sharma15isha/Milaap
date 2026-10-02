import express from 'express'
import { createTeam, getTeams, getTeamRecommendations, getMyTeams } from '../controllers/teamController.js'
import { sendInvitation, respondToInvitation, getMyInvitations } from '../controllers/invitationController.js'
import { protect } from '../middleware/auth.js'
import { authorize } from '../middleware/roles.js'

const router = express.Router()

router.get('/', getTeams)
router.get('/me', protect, authorize('student'), getMyTeams)
router.get('/recommendations', protect, authorize('student'), getTeamRecommendations)
router.post('/', protect, authorize('student'), createTeam)
router.post('/:id/invite', protect, authorize('student'), sendInvitation)

export default router

// Separate router for /api/invitations — exported so server.js can mount it too
export const invitationRouter = express.Router()
invitationRouter.get('/me', protect, getMyInvitations)
invitationRouter.put('/:id', protect, respondToInvitation)
