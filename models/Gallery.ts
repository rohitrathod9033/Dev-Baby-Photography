import mongoose, { Schema, type Document } from "mongoose"

export interface IGalleryItem extends Document {
    type: 'photo' | 'reel'
    src: string
    thumbnail?: string
    title?: string
    alt?: string
    category?: string
    createdAt: Date
    updatedAt: Date
}

const GallerySchema = new Schema<IGalleryItem>(
    {
        type: { type: String, required: true, enum: ['photo', 'reel'] },
        src: { type: String, required: true },
        thumbnail: { type: String },
        title: { type: String },
        alt: { type: String },
        category: { type: String },
    },
    { timestamps: true },
)

export default mongoose.models.Gallery || mongoose.model<IGalleryItem>("Gallery", GallerySchema)
