import mongoose, { Schema, type Document, type Model } from "mongoose";

export type UserRole = "student" | "faculty" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: "active" | "banned";
  mentorId?: mongoose.Types.ObjectId;
  badges: string[];
  streak: number;
  lastActive: Date;
  // Student specifics
  branch?: string;
  course?: string;
  enrollmentYear?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "faculty", "admin"],
      default: "student",
    },
    status: {
      type: String,
      enum: ["active", "banned"],
      default: "active",
    },
    mentorId: { type: Schema.Types.ObjectId, ref: "User" },
    badges: { type: [String], default: [] },
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    branch: { type: String },
    course: { type: String },
    enrollmentYear: { type: String },
  },
  { timestamps: true },
);

const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
