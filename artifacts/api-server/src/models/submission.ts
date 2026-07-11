import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ISubmission extends Document {
  studentId: string;
  question: mongoose.Types.ObjectId;
  answer: string;
  result: "AC" | "WA";
  createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    studentId: { type: String, required: true },
    question: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    answer: { type: String, required: true },
    result: { type: String, enum: ["AC", "WA"], required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const Submission: Model<ISubmission> = (mongoose.models.Submission as Model<ISubmission>) || mongoose.model<ISubmission>("Submission", SubmissionSchema);

export default Submission;
