import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ILiveClass extends Document {
  title: string;
  courseCode: string;
  facultyId: string;
  startsAt: Date;
  endsAt?: Date;
  meetingUrl?: string;
  status: "scheduled" | "live" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const LiveClassSchema = new Schema<ILiveClass>(
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
  },
  { timestamps: true }
);

const LiveClass: Model<ILiveClass> =
  (mongoose.models.LiveClass as Model<ILiveClass>) ||
  mongoose.model<ILiveClass>("LiveClass", LiveClassSchema);

export default LiveClass;
