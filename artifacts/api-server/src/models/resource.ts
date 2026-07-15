import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IResource extends Document {
  title: string;
  category: "Lecture Notes" | "Video Lectures" | "Practice Papers" | "Cheat Sheets";
  courseCode: string;
  fileUrl: string;
  format: string;
  size?: string;
  pages?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Lecture Notes", "Video Lectures", "Practice Papers", "Cheat Sheets"],
      required: true,
    },
    courseCode: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true, trim: true },
    format: { type: String, required: true },
    size: { type: String, default: "1.2 MB" },
    pages: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Resource: Model<IResource> =
  (mongoose.models.Resource as Model<IResource>) ||
  mongoose.model<IResource>("Resource", ResourceSchema);

export default Resource;
