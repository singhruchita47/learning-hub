import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IQuestion extends Document {
  title: string;
  description: string;
  inputTestCase: string;
  expectedOutput: string;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    inputTestCase: { type: String, required: true },
    expectedOutput: { type: String, required: true },
  },
  { timestamps: true },
);

const Question: Model<IQuestion> =
  (mongoose.models.Question as Model<IQuestion>) ||
  mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
