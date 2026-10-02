import mongoose from 'mongoose'

const studentProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    university: { type: String, default: 'Chitkara University' },
    department: { type: String, default: '' },
    year: { type: String, default: '' },
    bio: { type: String, default: '' },

    // Skills stored with a proficiency level so the frontend progress bars work directly
    skills: [
      {
        name: { type: String, required: true },
        level: { type: Number, min: 0, max: 100, default: 50 },
      },
    ],

    interests: [{ type: String }],
    preferredRole: { type: String, default: '' },
    lookingForTeam: { type: Boolean, default: false },

    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },

    achievements: [{ type: String }],
    certifications: [{ type: String }],

    profileImage: { type: String, default: '' },
  },
  { timestamps: true }
)

// Simple completion % used by the frontend's ProgressBar — counts how many
// of the key profile fields have been filled in.
studentProfileSchema.methods.calculateCompletion = function () {
  const fields = [
    this.university,
    this.department,
    this.year,
    this.bio,
    this.skills.length > 0,
    this.interests.length > 0,
    this.preferredRole,
    this.socialLinks.github,
  ]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
}

export default mongoose.model('StudentProfile', studentProfileSchema)
