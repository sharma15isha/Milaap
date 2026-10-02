import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['Hackathon', 'Coding Competition', 'Workshop', 'Ideathon', 'Innovation Challenge'],
      required: true,
    },
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organizerName: { type: String, default: '' },
    university: { type: String, default: 'Chitkara University' },

    startDate: { type: Date, required: true },
    endDate: { type: Date },
    registrationDeadline: { type: Date, required: true },

    mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'], default: 'Offline' },
    venue: { type: String, default: '' },

    requiredSkills: [{ type: String }],
    teamSize: { type: String, default: '1' },
    rules: { type: String, default: '' },
    eligibility: { type: String, default: '' },
    prize: { type: String, default: '' },

    status: {
      type: String,
      enum: ['Registration Open', 'Ongoing', 'Completed'],
      default: 'Registration Open',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Event', eventSchema)
