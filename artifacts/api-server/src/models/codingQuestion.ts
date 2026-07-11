import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ICodingQuestion extends Document {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  inputTestCase: string;
  expectedOutput: string;
  starterCode: string;
  facultyId: string;
  createdAt: Date;
  updatedAt: Date;
}

const CodingQuestionSchema = new Schema<ICodingQuestion>(
  {
    title: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
    description: { type: String, required: true, trim: true },
    inputTestCase: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    starterCode: { type: String, default: "" },
    facultyId: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const CodingQuestion: Model<ICodingQuestion> =
  (mongoose.models.CodingQuestion as Model<ICodingQuestion>) ||
  mongoose.model<ICodingQuestion>("CodingQuestion", CodingQuestionSchema);

export default CodingQuestion;
