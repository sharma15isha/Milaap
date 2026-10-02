import Project from '../models/Project.js'
import Team from '../models/Team.js'

// POST /api/projects
export async function createProject(req, res, next) {
  try {
    const { title, eventId, teamId, description, githubUrl, demoUrl, technologies, problemStatement, solution } = req.body

    if (!title || !eventId) {
      return res.status(400).json({ message: 'Project title and event are required' })
    }

    if (teamId) {
      const team = await Team.findById(teamId)
      if (!team) return res.status(404).json({ message: 'Team not found' })

      const isMember = team.members.some((m) => m.userId.toString() === req.user._id.toString())
      if (!isMember && team.leaderId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only team members can submit a project for this team' })
      }
    }

    const project = await Project.create({
      title,
      eventId,
      teamId: teamId || null,
      submittedBy: req.user._id,
      description: description || '',
      githubUrl: githubUrl || '',
      demoUrl: demoUrl || '',
      technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map(s => s.trim()) : []),
      problemStatement: problemStatement || '',
      solution: solution || '',
      status: 'Submitted',
    })

    res.status(201).json(project)
  } catch (err) {
    next(err)
  }
}

// GET /api/projects/me  — get projects submitted by the logged-in student or their teams
export async function getMySubmissions(req, res, next) {
  try {
    const myTeams = await Team.find({
      $or: [
        { leaderId: req.user._id },
        { 'members.userId': req.user._id },
      ],
    })
    const myTeamIds = myTeams.map((t) => t._id)

    const projects = await Project.find({
      $or: [
        { submittedBy: req.user._id },
        { teamId: { $in: myTeamIds } },
      ],
    })
      .populate('eventId', 'title type startDate status')
      .populate('teamId', 'teamName')
      .sort({ createdAt: -1 })

    res.json(projects)
  } catch (err) {
    next(err)
  }
}

// PUT /api/projects/:id  — edit before the deadline
export async function updateProject(req, res, next) {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })

    Object.assign(project, req.body)
    await project.save()
    res.json(project)
  } catch (err) {
    next(err)
  }
}

// GET /api/projects/:id
export async function getProjectById(req, res, next) {
  try {
    const project = await Project.findById(req.params.id).populate('teamId').populate('eventId', 'title')
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json(project)
  } catch (err) {
    next(err)
  }
}

// GET /api/projects?eventId=  — used by the judge dashboard to list submissions
export async function getProjects(req, res, next) {
  try {
    const { eventId } = req.query
    const filter = eventId ? { eventId } : {}
    const projects = await Project.find(filter).populate('teamId', 'teamName')
    res.json(projects)
  } catch (err) {
    next(err)
  }
}
