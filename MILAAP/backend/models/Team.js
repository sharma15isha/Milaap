import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    teamName: { type: String, required: true, trim: true },
    leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, default: '' },
      },
    ],
    requiredSkills: [{ type: String }],
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['recruiting', 'full', 'locked'],
      default: 'recruiting',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Team', teamSchema)
