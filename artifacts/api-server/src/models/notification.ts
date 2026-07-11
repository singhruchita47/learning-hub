import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  audience: "student" | "faculty" | "admin" | "all";
  type: "assignment" | "quiz" | "class" | "general";
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    audience: {
      type: String,
      enum: ["student", "faculty", "admin", "all"],
      default: "student",
    },
    type: {
      type: String,
      enum: ["assignment", "quiz", "class", "general"],
      default: "general",
    },
    readBy: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

const Notification: Model<INotification> =
  (mongoose.models.Notification as Model<INotification>) ||
  mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
