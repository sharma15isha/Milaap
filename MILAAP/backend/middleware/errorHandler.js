export function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` })
}

export function errorHandler(err, req, res, next) {
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' })
  }

  // Mongoose duplicate key (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({ message: `${field} already exists` })
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({ message: messages.join(', ') })
  }

  console.error(err.stack)
  res.status(err.statusCode || 500).json({
    message: err.message || 'Server error',
  })
}
