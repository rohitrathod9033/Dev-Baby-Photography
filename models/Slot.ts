import mongoose, { Schema, type Document, type Types } from "mongoose"

export interface ISlot extends Document {
  date: Date
  startTime: string
  endTime: string
  isBooked: boolean
  bookedBy?: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const SlotSchema = new Schema<ISlot>(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
      index: true,
    },
    bookedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
)

// Compound index to prevent double booking
SlotSchema.index({ date: 1, startTime: 1, isBooked: 1 }, { unique: true })

export default mongoose.models.Slot || mongoose.model<ISlot>("Slot", SlotSchema)
