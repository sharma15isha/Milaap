import Event from '../models/Event.js'
import Registration from '../models/Registration.js'
import Notification from '../models/Notification.js'

// GET /api/events  — supports ?type=&status=&search=
export async function getEvents(req, res, next) {
  try {
    const { type, status, search } = req.query
    const filter = {}
    if (type && type !== 'All') filter.type = type
    if (status && status !== 'All') filter.status = status
    if (search) filter.title = { $regex: search, $options: 'i' }

    const events = await Event.find(filter).sort({ startDate: 1 })
    res.json(events)
  } catch (err) {
    next(err)
  }
}

// GET /api/events/:id
export async function getEventById(req, res, next) {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })
    res.json(event)
  } catch (err) {
    next(err)
  }
}

// POST /api/events  — organizer/admin only
export async function createEvent(req, res, next) {
  try {
    const event = await Event.create({
      ...req.body,
      organizerId: req.user._id,
      organizerName: req.user.name,
    })
    res.status(201).json(event)
  } catch (err) {
    next(err)
  }
}

// PUT /api/events/:id
export async function updateEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })

    if (event.organizerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only edit events you created' })
    }

    Object.assign(event, req.body)
    await event.save()
    res.json(event)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/events/:id
export async function deleteEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })

    if (event.organizerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete events you created' })
    }

    await event.deleteOne()
    res.json({ message: 'Event deleted' })
  } catch (err) {
    next(err)
  }
}

// POST /api/events/:id/register  — student registers for an event
export async function registerForEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })

    const existing = await Registration.findOne({ eventId: event._id, studentId: req.user._id })
    if (existing) return res.status(400).json({ message: 'Already registered for this event' })

    const registration = await Registration.create({
      eventId: event._id,
      studentId: req.user._id,
    })

    await Notification.create({
      userId: req.user._id,
      type: 'registration',
      message: `You're registered for ${event.title}`,
    })

    res.status(201).json(registration)
  } catch (err) {
    next(err)
  }
}

// GET /api/events/:id/participants
export async function getEventParticipants(req, res, next) {
  try {
    const registrations = await Registration.find({ eventId: req.params.id }).populate('studentId', 'name email')
    res.json(registrations)
  } catch (err) {
    next(err)
  }
}

// GET /api/events/stats/organizer  — quick counts for the Organizer Dashboard
export async function getOrganizerStats(req, res, next) {
  try {
    const Registration = (await import('../models/Registration.js')).default
    const Team = (await import('../models/Team.js')).default
    const Project = (await import('../models/Project.js')).default

    const myEvents = await Event.find({ organizerId: req.user._id })
    const eventIds = myEvents.map((e) => e._id)

    const [totalRegistrations, totalTeams, totalSubmissions, evaluatedSubmissions] = await Promise.all([
      Registration.countDocuments({ eventId: { $in: eventIds } }),
      Team.countDocuments({ eventId: { $in: eventIds } }),
      Project.countDocuments({ eventId: { $in: eventIds } }),
      Project.countDocuments({ eventId: { $in: eventIds }, status: 'Evaluated' }),
    ])

    const evaluationProgress = totalSubmissions > 0 ? Math.round((evaluatedSubmissions / totalSubmissions) * 100) : 0

    res.json({
      totalEvents: myEvents.length,
      totalRegistrations,
      totalTeams,
      totalSubmissions,
      evaluationProgress,
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/events/my-registrations  — events registered by current student
export async function getMyRegistrations(req, res, next) {
  try {
    const registrations = await Registration.find({ studentId: req.user._id })
      .populate('eventId')
      .sort({ createdAt: -1 })
    res.json(registrations)
  } catch (err) {
    next(err)
  }
}

// GET /api/events/organizer/my-events  — events created by current organizer
export async function getOrganizerEvents(req, res, next) {
  try {
    const events = await Event.find({ organizerId: req.user._id }).sort({ createdAt: -1 })
    res.json(events)
  } catch (err) {
    next(err)
  }
}

