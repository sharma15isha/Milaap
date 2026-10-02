import mongoose from 'mongoose'

const announcementSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('Announcement', announcementSchema)
