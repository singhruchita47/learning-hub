import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IAssignmentSubmission extends Document {
  assignment: mongoose.Types.ObjectId;
  studentId: string;
  fileName: string;
  fileUrl?: string;
  note?: string;
  feedback?: string;
  marks?: number;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSubmissionSchema = new Schema<IAssignmentSubmission>(
  {
    assignment: { type: Schema.Types.ObjectId, ref: "Assignment", required: true },
    studentId: { type: String, required: true, trim: true },
    fileName: { type: String, required: true, trim: true },
    fileUrl: { type: String, trim: true },
    note: { type: String, trim: true },
    feedback: { type: String, trim: true },
    marks: { type: Number, min: 0 },
  },
  { timestamps: true },
);

const AssignmentSubmission: Model<IAssignmentSubmission> =
  (mongoose.models.AssignmentSubmission as Model<IAssignmentSubmission>) ||
  mongoose.model<IAssignmentSubmission>("AssignmentSubmission", AssignmentSubmissionSchema);

export default AssignmentSubmission;
