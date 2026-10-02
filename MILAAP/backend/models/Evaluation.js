import mongoose from 'mongoose'

const evaluationSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    judgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    innovationScore: { type: Number, min: 0, max: 100, required: true },
    technicalScore: { type: Number, min: 0, max: 100, required: true },
    problemSolvingScore: { type: Number, min: 0, max: 100, required: true },
    impactScore: { type: Number, min: 0, max: 100, required: true },
    presentationScore: { type: Number, min: 0, max: 100, required: true },
    teamworkScore: { type: Number, min: 0, max: 100, required: true },

    totalScore: { type: Number, min: 0, max: 100 },
    feedback: { type: String, default: '' },
  },
  { timestamps: true }
)

// A judge can only evaluate a given project once
evaluationSchema.index({ projectId: 1, judgeId: 1 }, { unique: true })

// Auto-calculate the total (average of the six criteria) before saving
evaluationSchema.pre('save', function (next) {
  const scores = [
    this.innovationScore,
    this.technicalScore,
    this.problemSolvingScore,
    this.impactScore,
    this.presentationScore,
    this.teamworkScore,
  ]
  this.totalScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  next()
})

export default mongoose.model('Evaluation', evaluationSchema)
