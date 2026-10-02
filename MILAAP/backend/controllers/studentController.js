import User from '../models/User.js'
import StudentProfile from '../models/StudentProfile.js'

// GET /api/students  — used by the Team Formation Hub to list candidates
export async function getStudents(req, res, next) {
  try {
    const { lookingForTeam } = req.query
    const filter = {}
    if (lookingForTeam === 'true') filter.lookingForTeam = true

    const profiles = await StudentProfile.find(filter).populate('userId', 'name email')
    res.json(profiles)
  } catch (err) {
    next(err)
  }
}

// GET /api/students/me — get logged-in student's own profile
export async function getMyProfile(req, res, next) {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user._id }).populate('userId', 'name email role')
    if (!profile) {
      profile = await StudentProfile.create({ userId: req.user._id })
      profile = await profile.populate('userId', 'name email role')
    }

    res.json({ ...profile.toObject(), profileCompletion: profile.calculateCompletion() })
  } catch (err) {
    next(err)
  }
}

// GET /api/students/:id
export async function getStudentById(req, res, next) {
  try {
    const profile = await StudentProfile.findOne({ userId: req.params.id }).populate('userId', 'name email')
    if (!profile) return res.status(404).json({ message: 'Student profile not found' })

    res.json({ ...profile.toObject(), profileCompletion: profile.calculateCompletion() })
  } catch (err) {
    next(err)
  }
}

// PUT /api/students/:id  — student can only edit their own profile
export async function updateStudent(req, res, next) {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only edit your own profile' })
    }

    if (req.body.name) {
      await User.findByIdAndUpdate(req.params.id, { name: req.body.name.trim() })
    }

    const { name, ...profileFields } = req.body

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.params.id },
      { $set: profileFields },
      { new: true, runValidators: true, upsert: true }
    ).populate('userId', 'name email role')

    res.json({ ...profile.toObject(), profileCompletion: profile.calculateCompletion() })
  } catch (err) {
    next(err)
  }
}
