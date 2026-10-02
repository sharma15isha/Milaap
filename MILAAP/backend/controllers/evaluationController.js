import Evaluation from '../models/Evaluation.js'
import Project from '../models/Project.js'
import Team from '../models/Team.js'
import PerformanceHistory from '../models/PerformanceHistory.js'
import Notification from '../models/Notification.js'

// POST /api/evaluations  — judge submits scores for a project
export async function createEvaluation(req, res, next) {
  try {
    const { projectId, criteria, feedback } = req.body

    const project = await Project.findById(projectId)
    if (!project) return res.status(404).json({ message: 'Project not found' })

    const evalData = {
      projectId,
      judgeId: req.user._id,
      feedback: feedback || '',
      innovationScore: req.body.innovationScore ?? criteria?.innovationScore ?? criteria?.innovation ?? 75,
      technicalScore: req.body.technicalScore ?? criteria?.technicalScore ?? criteria?.technicalComplexity ?? 75,
      problemSolvingScore: req.body.problemSolvingScore ?? criteria?.problemSolvingScore ?? criteria?.problemSolving ?? 75,
      impactScore: req.body.impactScore ?? criteria?.impactScore ?? criteria?.marketPotential ?? 75,
      presentationScore: req.body.presentationScore ?? criteria?.presentationScore ?? criteria?.presentation ?? 75,
      teamworkScore: req.body.teamworkScore ?? criteria?.teamworkScore ?? criteria?.scalability ?? 75,
    }

    const evaluation = await Evaluation.create(evalData)

    project.status = 'Evaluated'
    await project.save()

    // Write a PerformanceHistory row for every team member or solo submitter so the
    // student's "Performance Analysis" page has data to show.
    const team = project.teamId ? await Team.findById(project.teamId) : null
    const studentEntries = []

    if (team && team.members?.length > 0) {
      team.members.forEach((m) => {
        studentEntries.push({ studentId: m.userId, role: m.role || 'Team Member' })
      })
    } else if (project.submittedBy) {
      studentEntries.push({ studentId: project.submittedBy, role: 'Participant' })
    }

    if (studentEntries.length > 0) {
      const historyEntries = studentEntries.map((entry) => ({
        studentId: entry.studentId,
        eventId: project.eventId,
        teamId: project.teamId || null,
        role: entry.role,
        skillsUsed: project.technologies || [],
        scores: {
          innovation: evaluation.innovationScore,
          technical: evaluation.technicalScore,
          problemSolving: evaluation.problemSolvingScore,
          presentation: evaluation.presentationScore,
          teamwork: evaluation.teamworkScore,
        },
        overall: evaluation.totalScore,
        feedback: evaluation.feedback,
      }))
      await PerformanceHistory.insertMany(historyEntries)

      await Notification.insertMany(
        studentEntries.map((entry) => ({
          userId: entry.studentId,
          type: 'evaluation',
          message: `Your submission "${project.title}" was evaluated — overall score ${evaluation.totalScore}%`,
        }))
      )
    }

    res.status(201).json(evaluation)
  } catch (err) {
    next(err)
  }
}

// GET /api/evaluations/judge/me  — all evaluations submitted by current judge
export async function getJudgeEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find({ judgeId: req.user._id })
    res.json(evaluations)
  } catch (err) {
    next(err)
  }
}

// GET /api/evaluations/:projectId
export async function getEvaluationsForProject(req, res, next) {
  try {
    const evaluations = await Evaluation.find({ projectId: req.params.projectId }).populate('judgeId', 'name')
    res.json(evaluations)
  } catch (err) {
    next(err)
  }
}
