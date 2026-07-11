import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IQuizAttempt extends Document {
  quizTitle: string;
  studentId: string;
  answers: Array<{
    questionText: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
  score: number;
  total: number;
  createdAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    quizTitle: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, trim: true },
    answers: [
      {
        questionText: { type: String, required: true },
        selectedAnswer: { type: String, required: true },
        correctAnswer: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],
    score: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const QuizAttempt: Model<IQuizAttempt> =
  (mongoose.models.QuizAttempt as Model<IQuizAttempt>) ||
  mongoose.model<IQuizAttempt>("QuizAttempt", QuizAttemptSchema);

export default QuizAttempt;
