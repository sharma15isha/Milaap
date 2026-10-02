import Team from '../models/Team.js'
import StudentProfile from '../models/StudentProfile.js'
import { computeMatch } from '../utils/matchAlgorithm.js'

// POST /api/teams
export async function createTeam(req, res, next) {
  try {
    const team = await Team.create({
      ...req.body,
      leaderId: req.user._id,
      members: [{ userId: req.user._id, role: req.body.leaderRole || 'Team Lead' }],
    })
    res.status(201).json(team)
  } catch (err) {
    next(err)
  }
}

// GET /api/teams  — supports ?eventId=
export async function getTeams(req, res, next) {
  try {
    const { eventId } = req.query
    const filter = eventId ? { eventId } : {}
    const teams = await Team.find(filter)
      .populate('leaderId', 'name email')
      .populate('members.userId', 'name email')
    res.json(teams)
  } catch (err) {
    next(err)
  }
}

// GET /api/teams/me — get teams the logged-in student belongs to
export async function getMyTeams(req, res, next) {
  try {
    const teams = await Team.find({
      $or: [
        { leaderId: req.user._id },
        { 'members.userId': req.user._id },
      ],
    })
      .populate('eventId', 'title type startDate')
      .populate('leaderId', 'name email')
      .populate('members.userId', 'name email')

    res.json(teams)
  } catch (err) {
    next(err)
  }
}

// GET /api/teams/recommendations
// This is Milap's core differentiator: ranks students who are
// "Looking for Team" by complementary-skill match against the logged-in student.
export async function getTeamRecommendations(req, res, next) {
  try {
    let myProfile = await StudentProfile.findOne({ userId: req.user._id })
    if (!myProfile) {
      myProfile = await StudentProfile.create({ userId: req.user._id })
    }

    const candidates = await StudentProfile.find({
      lookingForTeam: true,
      userId: { $ne: req.user._id },
    }).populate('userId', 'name email')

    const ranked = candidates
      .filter((c) => c.userId)
      .map((c) => {
        const previousParticipation = 0
        const match = computeMatch(myProfile.skills || [], {
          skills: c.skills || [],
          preferredRole: c.preferredRole || '',
          previousParticipation,
        })
        return {
          id: c.userId._id,
          name: c.userId.name,
          skills: (c.skills || []).map((s) => s.name),
          preferredRole: c.preferredRole || '',
          match,
        }
      })
      .sort((a, b) => b.match.score - a.match.score)

    res.json(ranked)
  } catch (err) {
    next(err)
  }
}

// POST /api/teams/:id/invite  — creates a TeamInvitation (handled in invitationController)
