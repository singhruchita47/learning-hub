import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IAttendance extends Document {
  studentId: string;
  date: string; // YYYY-MM-DD format for simple comparisons
  marked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    studentId: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    marked: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Attendance: Model<IAttendance> =
  (mongoose.models.Attendance as Model<IAttendance>) ||
  mongoose.model<IAttendance>("Attendance", AttendanceSchema);

export default Attendance;
