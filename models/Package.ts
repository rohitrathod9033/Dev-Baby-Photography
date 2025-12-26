import mongoose, { Schema, type Document } from "mongoose"

export interface IPackage extends Document {
  name: string
  category: string
  description: string
  price: number
  features: string[]
  duration: number
  durationUnit: string
  images: string[]
  createdAt: Date
  updatedAt: Date
}

const PackageSchema = new Schema<IPackage>(
  {
    name: {
      type: String,
      required: [true, "Please provide a package name"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: 0,
    },
    features: {
      type: [String],
      default: [],
    },
    duration: {
      type: Number,
      required: [true, "Please provide a duration"],
    },
    durationUnit: {
      type: String,
      enum: ["hours", "days", "weeks", "months"],
      default: "hours",
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
)

export default mongoose.models.Package || mongoose.model<IPackage>("Package", PackageSchema)
