import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IQuiz extends Document {
  questionText: string;
  options: string[];
  correctAnswer: string;
  difficulty?: "easy" | "medium" | "hard";
  imageUrl?: string;
}

const QuizSchema = new Schema<IQuiz>(
  {
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    imageUrl: { type: String },
  },
  { timestamps: true },
);

const Quiz: Model<IQuiz> = (mongoose.models.Quiz as Model<IQuiz>) || mongoose.model<IQuiz>("Quiz", QuizSchema);

export default Quiz;
