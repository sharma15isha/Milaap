import Notification from '../models/Notification.js'

// GET /api/notifications
export async function getMyNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(30)
    res.json(notifications)
  } catch (err) {
    next(err)
  }
}

// PUT /api/notifications/:id/read
export async function markNotificationRead(req, res, next) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { readStatus: true },
      { new: true }
    )
    if (!notification) return res.status(404).json({ message: 'Notification not found' })
    res.json(notification)
  } catch (err) {
    next(err)
  }
}
