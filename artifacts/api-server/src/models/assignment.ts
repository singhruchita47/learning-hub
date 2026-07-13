import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IAssignment extends Document {
  title: string;
  description: string;
  dueDate: Date;
  courseCode: string;
  facultyId: string;
  imageUrl?: string;
  maxMarks?: number;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    courseCode: { type: String, required: true, trim: true },
    facultyId: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
    maxMarks: { type: Number, default: 100 },
  },
  { timestamps: true },
);

const Assignment: Model<IAssignment> =
  (mongoose.models.Assignment as Model<IAssignment>) ||
  mongoose.model<IAssignment>("Assignment", AssignmentSchema);

export default Assignment;
