import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IFeedback extends Document {
  studentId: string;
  courseCode: string;
  rating: number; // 1 to 5 stars
  comments: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    studentId: { type: String, required: true, trim: true },
    courseCode: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comments: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Feedback: Model<IFeedback> =
  (mongoose.models.Feedback as Model<IFeedback>) ||
  mongoose.model<IFeedback>("Feedback", FeedbackSchema);

export default Feedback;
