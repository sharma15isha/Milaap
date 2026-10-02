import User from '../models/User.js'
import StudentProfile from '../models/StudentProfile.js'
import { generateToken } from '../utils/generateToken.js'

// POST /api/auth/register
export async function register(req, res, next) {
  try {
    const { name, email, password, role, university } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' })
    }

    const allowedPublicRoles = ['student', 'organizer', 'judge']
    const assignedRole = allowedPublicRoles.includes(role) ? role : 'student'

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: assignedRole,
    })

    // Every student automatically gets a linked profile document
    if (user.role === 'student') {
      await StudentProfile.create({
        userId: user._id,
        university: university || 'Chitkara University',
      })
    }

    const token = generateToken(user._id)

    res.status(201).json({
      token,
      user: { id: user._id, _id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login (Normal users: student, organizer, judge)
export async function login(req, res, next) {
  try {
    const { email, password, role } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Admin accounts must NOT log in through normal user login
    if (user.role === 'admin') {
      return res.status(403).json({
        message: 'Admin accounts must use the dedicated Admin Portal at /admin/login',
      })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Guard against logging in with the wrong role tab selected
    if (role && user.role !== role) {
      return res.status(401).json({ message: `This account is registered as '${user.role}', not '${role}'` })
    }

    const token = generateToken(user._id)

    res.json({
      token,
      user: { id: user._id, _id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/admin/login (Dedicated Admin Authentication)
export async function adminLogin(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Admin email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid admin credentials' })
    }

    // Strict verification: user must have 'admin' role
    if (user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied: This account does not possess administrator permissions.',
      })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' })
    }

    const token = generateToken(user._id)

    res.json({
      token,
      user: { id: user._id, _id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/google (Google OAuth for normal users — NEVER grants admin)
export async function googleAuth(req, res, next) {
  try {
    const { email, name, role } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required for Google authentication' })
    }

    const cleanEmail = email.toLowerCase().trim()
    let user = await User.findOne({ email: cleanEmail })

    if (user) {
      // Security rule: Google login must NEVER grant or authenticate admin access
      if (user.role === 'admin') {
        return res.status(403).json({
          message: 'Admin accounts cannot use Google authentication. Please sign in via the Admin Portal at /admin/login.',
        })
      }
    } else {
      // Create new user for student, organizer, or judge (never admin)
      const allowedRoles = ['student', 'organizer', 'judge']
      const assignedRole = allowedRoles.includes(role) ? role : 'student'

      // Generate random secure password for database schema
      const randomPassword = Math.random().toString(36).slice(-10) + '!A9z'

      user = await User.create({
        name: name?.trim() || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: randomPassword,
        role: assignedRole,
      })

      if (user.role === 'student') {
        await StudentProfile.create({
          userId: user._id,
          university: 'Chitkara University',
        })
      }
    }

    const token = generateToken(user._id)

    res.json({
      token,
      user: { id: user._id, _id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    next(err)
  }
}


// GET /api/auth/me
export async function getMe(req, res, next) {
  try {
    res.json({
      user: {
        id: req.user._id,
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    })
  } catch (err) {
    next(err)
  }
}
