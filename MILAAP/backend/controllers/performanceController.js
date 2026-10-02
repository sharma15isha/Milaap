import PerformanceHistory from '../models/PerformanceHistory.js'
import StudentProfile from '../models/StudentProfile.js'
import Event from '../models/Event.js'
import { computeSkillGap } from '../utils/matchAlgorithm.js'

// GET /api/performance/me  — full participation history
export async function getMyPerformanceHistory(req, res, next) {
  try {
    const history = await PerformanceHistory.find({ studentId: req.user._id })
      .populate('eventId', 'title type startDate')
      .sort({ createdAt: -1 })
    res.json(history)
  } catch (err) {
    next(err)
  }
}

// GET /api/performance/analytics  — overall score, trend, best/average, strengths
export async function getPerformanceAnalytics(req, res, next) {
  try {
    const history = await PerformanceHistory.find({ studentId: req.user._id })
      .populate('eventId', 'title')
      .sort({ createdAt: 1 })

    if (history.length === 0) {
      return res.json({
        overall: 0,
        best: 0,
        trend: 'No data yet',
        totalEvents: 0,
        trendSeries: [],
      })
    }

    const overallScores = history.map((h) => h.overall)
    const overall = Math.round(overallScores.reduce((a, b) => a + b, 0) / overallScores.length)
    const best = Math.max(...overallScores)

    const trendSeries = history.map((h) => ({
      event: h.eventId?.title || 'Event',
      score: h.overall,
    }))

    const trend =
      trendSeries.length >= 2 && trendSeries.at(-1).score >= trendSeries[0].score
        ? 'Improving'
        : trendSeries.length >= 2
        ? 'Declining'
        : 'Stable'

    res.json({ overall, best, trend, totalEvents: history.length, trendSeries })
  } catch (err) {
    next(err)
  }
}

// GET /api/performance/skills  — average score per skill category
export async function getSkillPerformance(req, res, next) {
  try {
    const history = await PerformanceHistory.find({ studentId: req.user._id })

    if (history.length === 0) return res.json([])

    const categories = ['innovation', 'technical', 'problemSolving', 'presentation', 'teamwork']
    const averages = categories.map((cat) => {
      const values = history.map((h) => h.scores[cat] || 0)
      const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length)
      return { skill: cat, score: avg }
    })

    res.json(averages)
  } catch (err) {
    next(err)
  }
}

// GET /api/performance/skill-gap?eventId=xxx
export async function getSkillGap(req, res, next) {
  try {
    const { eventId } = req.query

    let profile = await StudentProfile.findOne({ userId: req.user._id })
    if (!profile) {
      profile = await StudentProfile.create({ userId: req.user._id })
    }

    let targetEvent = eventId
      ? await Event.findById(eventId)
      : await Event.findOne({ status: 'Registration Open' })

    if (!targetEvent) {
      targetEvent = await Event.findOne().sort({ startDate: -1 })
    }

    if (!targetEvent) {
      return res.json({
        event: 'No upcoming events currently scheduled',
        eventId: null,
        required: [],
        strong: [],
        gaps: [],
      })
    }

    const { strong, gaps } = computeSkillGap(profile.skills || [], targetEvent.requiredSkills || [])

    res.json({
      event: targetEvent.title,
      eventId: targetEvent._id,
      deadline: targetEvent.registrationDeadline,
      required: targetEvent.requiredSkills || [],
      strong,
      gaps,
    })
  } catch (err) {
    next(err)
  }
}
