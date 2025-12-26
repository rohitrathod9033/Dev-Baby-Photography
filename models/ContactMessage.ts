import mongoose, { Schema, type Document } from "mongoose"

export interface IContactMessage extends Document {
  name: string
  email: string
  message: string
  subject?: string
  createdAt: Date
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    subject: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      minlength: [10, "Message must be at least 10 characters"],
    },
  },
  { timestamps: true },
)

export default mongoose.models.ContactMessage || mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema)
