import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  message: string;
  audience: "All" | "Students" | "Faculty";
  type: "Info" | "Alert" | "Success";
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    audience: {
      type: String,
      enum: ["All", "Students", "Faculty"],
      default: "All",
    },
    type: {
      type: String,
      enum: ["Info", "Alert", "Success"],
      default: "Info",
    },
    author: { type: String, default: "System Admin" },
  },
  { timestamps: true }
);

const Announcement: Model<IAnnouncement> =
  (mongoose.models.Announcement as Model<IAnnouncement>) ||
  mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);

export default Announcement;
