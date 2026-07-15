import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IEnrollment extends Document {
  courseId: string;
  studentId: string;
  studentName?: string;
  enrolledAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    courseId: { type: String, required: true },
    studentId: { type: String, required: true },
    studentName: { type: String, default: "Student" },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate enrollments
EnrollmentSchema.index({ courseId: 1, studentId: 1 }, { unique: true });

const Enrollment: Model<IEnrollment> =
  (mongoose.models.Enrollment as Model<IEnrollment>) ||
  mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);

export default Enrollment;
