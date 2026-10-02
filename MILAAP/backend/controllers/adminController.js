import User from '../models/User.js'
import StudentProfile from '../models/StudentProfile.js'
import Event from '../models/Event.js'
import Team from '../models/Team.js'
import Project from '../models/Project.js'
import Evaluation from '../models/Evaluation.js'
import Registration from '../models/Registration.js'

// GET /api/admin/stats
export async function getAdminStats(req, res, next) {
  try {
    const [
      totalUsers,
      totalStudents,
      totalOrganizers,
      totalJudges,
      totalAdmins,
      totalEvents,
      totalTeams,
      totalProjects,
      totalEvaluations,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'organizer' }),
      User.countDocuments({ role: 'judge' }),
      User.countDocuments({ role: 'admin' }),
      Event.countDocuments(),
      Team.countDocuments(),
      Project.countDocuments(),
      Evaluation.countDocuments(),
    ])

    res.json({
      totalUsers,
      totalStudents,
      totalOrganizers,
      totalJudges,
      totalAdmins,
      totalEvents,
      totalTeams,
      totalProjects,
      totalEvaluations,
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/users
export async function getAllUsers(req, res, next) {
  try {
    const { role, search } = req.query
    const filter = {}

    if (role && role !== 'all') {
      filter.role = role
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ]
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/users/:id/role
export async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body
    const validRoles = ['student', 'organizer', 'judge', 'admin']

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' })
    }

    if (req.user._id.toString() === req.params.id && role !== 'admin') {
      return res.status(400).json({ message: 'Admins cannot remove their own admin privileges' })
    }

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.role = role
    await user.save()

    // If changing to student, ensure a StudentProfile exists
    if (role === 'student') {
      const existingProfile = await StudentProfile.findOne({ userId: user._id })
      if (!existingProfile) {
        await StudentProfile.create({ userId: user._id, university: 'Chitkara University' })
      }
    }

    res.json({
      message: `User role successfully updated to ${role}`,
      user: { id: user._id, _id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/users/:id
export async function deleteUser(req, res, next) {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'Admins cannot delete their own account' })
    }

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    await Promise.all([
      User.findByIdAndDelete(req.params.id),
      StudentProfile.deleteMany({ userId: req.params.id }),
      Registration.deleteMany({ studentId: req.params.id }),
    ])

    res.json({ message: `User "${user.name}" was successfully deleted` })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/events
export async function getAllAdminEvents(req, res, next) {
  try {
    const events = await Event.find().populate('organizerId', 'name email').sort({ createdAt: -1 })
    res.json(events)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/events/:id
export async function deleteAdminEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    await Event.findByIdAndDelete(req.params.id)
    res.json({ message: `Event "${event.title}" was successfully deleted` })
  } catch (err) {
    next(err)
  }
}
