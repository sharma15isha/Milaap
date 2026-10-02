import Project from '../models/Project.js'
import Evaluation from '../models/Evaluation.js'

// GET /api/events/:id/leaderboard
export async function getEventLeaderboard(req, res, next) {
  try {
    const projects = await Project.find({ eventId: req.params.id, status: 'Evaluated' })
      .populate('teamId', 'teamName')
      .populate('submittedBy', 'name')

    const rows = await Promise.all(
      projects.map(async (project) => {
        const evaluations = await Evaluation.find({ projectId: project._id })
        if (evaluations.length === 0) return null

        const avg = (key) => Math.round(evaluations.reduce((sum, e) => sum + e[key], 0) / evaluations.length)

        return {
          team: project.teamId?.teamName || project.submittedBy?.name || 'Solo Innovator',
          project: project.title,
          innovation: avg('innovationScore'),
          technical: avg('technicalScore'),
          presentation: avg('presentationScore'),
          total: avg('totalScore'),
        }
      })
    )

    const leaderboard = rows
      .filter(Boolean)
      .sort((a, b) => b.total - a.total)
      .map((row, i) => ({ rank: i + 1, ...row }))

    res.json(leaderboard)
  } catch (err) {
    next(err)
  }
}
