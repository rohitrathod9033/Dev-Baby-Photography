import mongoose, { Schema, type Document, type Types } from "mongoose"

export interface IBooking extends Document {
  userId: Types.ObjectId
  packageId: Types.ObjectId
  bookingDate: Date
  sessionDate: Date
  notes?: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packageId: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    sessionDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
)

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema)
