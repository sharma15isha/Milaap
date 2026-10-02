import mongoose from 'mongoose'

const performanceHistorySchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    role: { type: String, default: '' },
    skillsUsed: [{ type: String }],

    scores: {
      innovation: { type: Number, default: 0 },
      technical: { type: Number, default: 0 },
      problemSolving: { type: Number, default: 0 },
      presentation: { type: Number, default: 0 },
      teamwork: { type: Number, default: 0 },
    },

    overall: { type: Number, default: 0 },
    rank: { type: Number, default: null },
    feedback: { type: String, default: '' },
    achievement: { type: String, default: '' }, // e.g. "Finalist", "Top 10", "Winner"
  },
  { timestamps: true }
)

export default mongoose.model('PerformanceHistory', performanceHistorySchema)
