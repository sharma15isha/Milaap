import mongoose from 'mongoose'

const registrationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    status: {
      type: String,
      enum: ['registered', 'cancelled'],
      default: 'registered',
    },
    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

// One student can't register twice for the same event
registrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true })

export default mongoose.model('Registration', registrationSchema)
