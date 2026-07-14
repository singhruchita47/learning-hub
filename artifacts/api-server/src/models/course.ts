import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ICourse extends Document {
  code: string;
  title: string;
  students: number;
  progress: number;
  color: string;
  teacher: string;
  branch?: string;
  facultyId?: mongoose.Types.ObjectId;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    code: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    students: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    color: { type: String, default: "#7130a1" },
    teacher: { type: String, default: "Dr. Faculty" },
    branch: { type: String, default: "All Branches" },
    facultyId: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Course: Model<ICourse> =
  (mongoose.models.Course as Model<ICourse>) ||
  mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
