import { Router } from "express";
import User from "../models/user";
import Course from "../models/course";
import Enrollment from "../models/enrollment";
import Assignment from "../models/assignment";
import AssignmentSubmission from "../models/assignmentSubmission";
import LiveClass from "../models/liveClass";
import Event from "../models/event";
import Quiz from "../models/quiz";
import QuizAttempt from "../models/quizAttempt";
import CodingQuestion from "../models/codingQuestion";
import Resource from "../models/resource";
import Notification from "../models/notification";

const resetRouter = Router();

resetRouter.get("/", async (req, res) => {
  try {
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await Assignment.deleteMany({});
    await AssignmentSubmission.deleteMany({});
    await LiveClass.deleteMany({});
    await Event.deleteMany({});
    await Quiz.deleteMany({});
    await QuizAttempt.deleteMany({});
    await CodingQuestion.deleteMany({});
    await Resource.deleteMany({});
    await Notification.deleteMany({});
    await User.deleteMany({ email: { $ne: "admin@learning.hub" } }); // Keep the system admin
    res.json({ message: "Remote database reset complete!" });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

export default resetRouter;
