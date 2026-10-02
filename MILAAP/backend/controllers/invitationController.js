import TeamInvitation from '../models/TeamInvitation.js'
import Team from '../models/Team.js'
import Notification from '../models/Notification.js'

// POST /api/teams/:id/invite
export async function sendInvitation(req, res, next) {
  try {
    const { receiverId } = req.body
    const team = await Team.findById(req.params.id)
    if (!team) return res.status(404).json({ message: 'Team not found' })

    if (team.leaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the team leader can send invitations' })
    }

    const invitation = await TeamInvitation.create({
      teamId: team._id,
      senderId: req.user._id,
      receiverId,
    })

    await Notification.create({
      userId: receiverId,
      type: 'invitation',
      message: `${req.user.name} invited you to join ${team.teamName}`,
    })

    res.status(201).json(invitation)
  } catch (err) {
    next(err)
  }
}

// PUT /api/invitations/:id  — accept or reject
export async function respondToInvitation(req, res, next) {
  try {
    const { status } = req.body // 'accepted' | 'rejected'
    const invitation = await TeamInvitation.findById(req.params.id)
    if (!invitation) return res.status(404).json({ message: 'Invitation not found' })

    if (invitation.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'This invitation is not addressed to you' })
    }

    invitation.status = status
    await invitation.save()

    if (status === 'accepted') {
      const team = await Team.findById(invitation.teamId)
      team.members.push({ userId: req.user._id, role: '' })
      await team.save()
    }

    await Notification.create({
      userId: invitation.senderId,
      type: 'invitation',
      message: `${req.user.name} ${status} your team invitation`,
    })

    res.json(invitation)
  } catch (err) {
    next(err)
  }
}

// GET /api/invitations/me
export async function getMyInvitations(req, res, next) {
  try {
    const invitations = await TeamInvitation.find({ receiverId: req.user._id, status: 'pending' })
      .populate('teamId', 'teamName')
      .populate('senderId', 'name')
    res.json(invitations)
  } catch (err) {
    next(err)
  }
}
