import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['invitation', 'deadline', 'evaluation', 'announcement', 'registration', 'achievement'],
      required: true,
    },
    message: { type: String, required: true },
    readStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Notification', notificationSchema)
