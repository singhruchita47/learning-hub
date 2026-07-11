import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IClassSession extends Document {
  title: string;
  courseCode: string;
  facultyId: string;
  startsAt: Date;
  endsAt?: Date;
  meetingUrl?: string;
  status: "scheduled" | "live" | "completed";
  recordingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSessionSchema = new Schema<IClassSession>(
  {
    title: { type: String, required: true, trim: true },
    courseCode: { type: String, required: true, trim: true },
    facultyId: { type: String, required: true, trim: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date },
    meetingUrl: { type: String, trim: true },
    status: {
      type: String,
      enum: ["scheduled", "live", "completed"],
      default: "scheduled",
    },
    recordingUrl: { type: String, trim: true },
  },
  { timestamps: true },
);

const ClassSession: Model<IClassSession> =
  (mongoose.models.ClassSession as Model<IClassSession>) ||
  mongoose.model<IClassSession>("ClassSession", ClassSessionSchema);

export default ClassSession;
