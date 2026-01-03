import mongoose, { Schema, type Document } from "mongoose"

export interface IPackage extends Document {
  title: string
  subtitle: string
  description: string
  price: number
  duration: string
  photos: string
  features: string[]
  category: string
  popular: boolean
  image?: string
  color?: string
  createdAt: Date
  updatedAt: Date
}

const PackageSchema = new Schema<IPackage>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    photos: { type: String, required: true },
    features: { type: [String], default: [] },
    category: { type: String, required: true },
    popular: { type: Boolean, default: false },
    image: { type: String },
    color: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.Package || mongoose.model<IPackage>("Package", PackageSchema)
