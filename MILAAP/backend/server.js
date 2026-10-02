import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

import authRoutes from './routes/authRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import teamRoutes, { invitationRouter } from './routes/teamRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import evaluationRoutes from './routes/evaluationRoutes.js'
import performanceRoutes from './routes/performanceRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Milap API is running' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/invitations', invitationRouter)
app.use('/api/projects', projectRoutes)
app.use('/api/evaluations', evaluationRoutes)
app.use('/api/performance', performanceRoutes)
app.use('/api/notifications', notificationRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Milap API running on port ${PORT}`))
