// Usage: router.post('/events', protect, authorize('organizer', 'admin'), createEvent)
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' })
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role '${req.user.role}' is not permitted to perform this action` })
    }
    next()
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' })
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Administrator privileges required' })
  }
  next()
}

