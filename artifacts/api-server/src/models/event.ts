import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  date: Date;
  time: string;
  type: "Event" | "Exam" | "Holiday";
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, default: "All Day" },
    type: {
      type: String,
      enum: ["Event", "Exam", "Holiday"],
      default: "Event",
    },
    location: { type: String, default: "TBA" },
  },
  { timestamps: true }
);

const Event: Model<IEvent> =
  (mongoose.models.Event as Model<IEvent>) ||
  mongoose.model<IEvent>("Event", EventSchema);

export default Event;
