import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    problemStatement: { type: String, default: '' },
    solution: { type: String, default: '' },
    technologies: [{ type: String }],
    githubUrl: { type: String, default: '' },
    demoUrl: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    presentationUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Evaluated'],
      default: 'Draft',
    },
    submissionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export default mongoose.model('Project', projectSchema)
