import { Router, type Request, type Response } from "express";
import mongoose from "mongoose";
import Assignment from "../models/assignment";
import AssignmentSubmission from "../models/assignmentSubmission";
import ClassSession from "../models/classSession";
import CodingQuestion from "../models/codingQuestion";
import Notification from "../models/notification";
import QuizAttempt from "../models/quizAttempt";

const router = Router();

const memoryStore = {
  assignments: [] as any[],
  assignmentSubmissions: [] as any[],
  quizAttempts: [] as any[],
  notifications: [] as any[],
  codingQuestions: [] as any[],
  classes: [] as any[],
};

function mongoReady() {
  return mongoose.connection.readyState === 1;
}

function memoryId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

router.post("/assignments", async (req: Request, res: Response) => {
  const { title, description, dueDate, courseCode, facultyId } = req.body;

  if (!title || !description || !dueDate || !courseCode || !facultyId) {
    return res.status(400).json({ message: "title, description, dueDate, courseCode, and facultyId are required." });
  }

  if (!mongoReady()) {
    const assignment = {
      _id: memoryId("assignment"),
      title,
      description,
      dueDate: new Date(dueDate).toISOString(),
      courseCode,
      facultyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.assignments.unshift(assignment);
    memoryStore.notifications.unshift({
      _id: memoryId("notification"),
      title: "New assignment published",
      message: `${title} is due on ${new Date(dueDate).toLocaleDateString("en-IN")}.`,
      audience: "student",
      type: "assignment",
      createdAt: new Date().toISOString(),
    });
    return res.status(201).json({ assignment, storage: "memory" });
  }

  const assignment = await Assignment.create({
    title,
    description,
    dueDate: new Date(dueDate),
    courseCode,
    facultyId,
  });

  await Notification.create({
    title: "New assignment published",
    message: `${title} is due on ${new Date(dueDate).toLocaleDateString("en-IN")}.`,
    audience: "student",
    type: "assignment",
  });

  return res.status(201).json({ assignment });
});

router.get("/assignments", async (_req: Request, res: Response) => {
  if (!mongoReady()) {
    return res.json({ assignments: memoryStore.assignments, storage: "memory" });
  }

  const assignments = await Assignment.find().sort({ dueDate: 1 }).lean();
  return res.json({ assignments });
});

router.post("/assignments/:assignmentId/submissions", async (req: Request, res: Response) => {
  const { assignmentId } = req.params;
  const { studentId, fileName, note } = req.body;

  if (!studentId || !fileName) {
    return res.status(400).json({ message: "studentId and fileName are required." });
  }

  if (!mongoReady()) {
    const assignment = memoryStore.assignments.find((item) => item._id === assignmentId);
    const submission = {
      _id: memoryId("submission"),
      assignment: assignment ?? assignmentId,
      studentId,
      fileName,
      note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.assignmentSubmissions.unshift(submission);
    memoryStore.notifications.unshift({
      _id: memoryId("notification"),
      title: "Assignment submitted",
      message: `${studentId} submitted ${fileName}.`,
      audience: "faculty",
      type: "assignment",
      createdAt: new Date().toISOString(),
    });
    return res.status(201).json({ submission, storage: "memory" });
  }

  const submission = await AssignmentSubmission.create({
    assignment: assignmentId,
    studentId,
    fileName,
    note,
  });

  await Notification.create({
    title: "Assignment submitted",
    message: `${studentId} submitted ${fileName}.`,
    audience: "faculty",
    type: "assignment",
  });

  return res.status(201).json({ submission });
});

router.get("/assignment-submissions", async (_req: Request, res: Response) => {
  if (!mongoReady()) {
    return res.json({ submissions: memoryStore.assignmentSubmissions, storage: "memory" });
  }

  const submissions = await AssignmentSubmission.find()
    .populate("assignment")
    .sort({ createdAt: -1 })
    .lean();

  return res.json({ submissions });
});

router.patch("/assignment-submissions/:submissionId/feedback", async (req: Request, res: Response) => {
  const { submissionId } = req.params;
  const { feedback, marks } = req.body;

  if (!mongoReady()) {
    const submission = memoryStore.assignmentSubmissions.find((item) => item._id === submissionId);
    if (!submission) return res.status(404).json({ message: "Submission not found." });
    submission.feedback = feedback;
    submission.marks = marks;
    submission.updatedAt = new Date().toISOString();
    memoryStore.notifications.unshift({
      _id: memoryId("notification"),
      title: "Assignment feedback received",
      message: `Faculty added feedback for ${submission.assignment?.title ?? "your assignment"}.`,
      audience: "student",
      type: "assignment",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return res.json({ submission, storage: "memory" });
  }

  const submission = await AssignmentSubmission.findByIdAndUpdate(
    submissionId,
    { feedback, marks },
    { new: true },
  ).populate("assignment");

  if (!submission) {
    return res.status(404).json({ message: "Submission not found." });
  }

  await Notification.create({
    title: "Assignment feedback received",
    message: "Faculty added feedback for your assignment submission.",
    audience: "student",
    type: "assignment",
  });

  return res.json({ submission });
});

router.post("/quiz-attempts", async (req: Request, res: Response) => {
  const { quizTitle, studentId, answers, score, total } = req.body;

  if (!quizTitle || !studentId || !Array.isArray(answers)) {
    return res.status(400).json({ message: "quizTitle, studentId, and answers are required." });
  }

  if (!mongoReady()) {
    const attempt = {
      _id: memoryId("quiz-attempt"),
      quizTitle,
      studentId,
      answers,
      score,
      total,
      createdAt: new Date().toISOString(),
    };
    memoryStore.quizAttempts.unshift(attempt);
    memoryStore.notifications.unshift({
      _id: memoryId("notification"),
      title: "Quiz attempt received",
      message: `${studentId} scored ${score}/${total} in ${quizTitle}.`,
      audience: "faculty",
      type: "quiz",
      createdAt: new Date().toISOString(),
    });
    return res.status(201).json({ attempt, storage: "memory" });
  }

  const attempt = await QuizAttempt.create({ quizTitle, studentId, answers, score, total });
  await Notification.create({
    title: "Quiz attempt received",
    message: `${studentId} scored ${score}/${total} in ${quizTitle}.`,
    audience: "faculty",
    type: "quiz",
  });
  return res.status(201).json({ attempt });
});

router.get("/quiz-attempts", async (_req: Request, res: Response) => {
  if (!mongoReady()) {
    return res.json({ attempts: memoryStore.quizAttempts, storage: "memory" });
  }

  const attempts = await QuizAttempt.find().sort({ createdAt: -1 }).lean();
  return res.json({ attempts });
});

router.post("/classes", async (req: Request, res: Response) => {
  const { title, courseCode, facultyId, startsAt, endsAt, meetingUrl } = req.body;

  if (!title || !courseCode || !facultyId || !startsAt) {
    return res.status(400).json({ message: "title, courseCode, facultyId, and startsAt are required." });
  }

  if (!mongoReady()) {
    const classSession = {
      _id: memoryId("class"),
      title,
      courseCode,
      facultyId,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
      meetingUrl,
      status: "scheduled",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.classes.unshift(classSession);
    memoryStore.notifications.unshift({
      _id: memoryId("notification"),
      title: "Live class scheduled",
      message: `${title} is scheduled for ${new Date(startsAt).toLocaleString("en-IN")}.`,
      audience: "student",
      type: "class",
      createdAt: new Date().toISOString(),
    });
    return res.status(201).json({ classSession, storage: "memory" });
  }

  const classSession = await ClassSession.create({
    title,
    courseCode,
    facultyId,
    startsAt: new Date(startsAt),
    endsAt: endsAt ? new Date(endsAt) : undefined,
    meetingUrl,
  });

  await Notification.create({
    title: "Live class scheduled",
    message: `${title} is scheduled for ${new Date(startsAt).toLocaleString("en-IN")}.`,
    audience: "student",
    type: "class",
  });

  return res.status(201).json({ classSession });
});

router.get("/classes", async (_req: Request, res: Response) => {
  if (!mongoReady()) {
    return res.json({ classes: memoryStore.classes, storage: "memory" });
  }

  const classes = await ClassSession.find().sort({ startsAt: 1 }).lean();
  return res.json({ classes });
});

router.patch("/classes/:classId/status", async (req: Request, res: Response) => {
  const { classId } = req.params;
  const { status, recordingUrl } = req.body;

  if (!mongoReady()) {
    const classSession = memoryStore.classes.find((item) => item._id === classId);
    if (!classSession) return res.status(404).json({ message: "Class session not found." });
    classSession.status = status;
    classSession.recordingUrl = recordingUrl;
    classSession.updatedAt = new Date().toISOString();
    return res.json({ classSession, storage: "memory" });
  }

  const classSession = await ClassSession.findByIdAndUpdate(
    classId,
    { status, recordingUrl },
    { new: true },
  );

  if (!classSession) {
    return res.status(404).json({ message: "Class session not found." });
  }

  return res.json({ classSession });
});

router.post("/notifications", async (req: Request, res: Response) => {
  const { title, message, audience = "student", type = "general" } = req.body;

  if (!title || !message) {
    return res.status(400).json({ message: "title and message are required." });
  }

  if (!mongoReady()) {
    const notification = {
      _id: memoryId("notification"),
      title,
      message,
      audience,
      type,
      readBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.notifications.unshift(notification);
    return res.status(201).json({ notification, storage: "memory" });
  }

  const notification = await Notification.create({ title, message, audience, type });
  return res.status(201).json({ notification });
});

router.get("/notifications", async (req: Request, res: Response) => {
  const audience = typeof req.query.audience === "string" ? req.query.audience : undefined;
  if (!mongoReady()) {
    const notifications = memoryStore.notifications.filter(
      (item) => !audience || item.audience === audience || item.audience === "all",
    );
    return res.json({ notifications, storage: "memory" });
  }

  const filter = audience ? { audience: { $in: [audience, "all"] } } : {};
  const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(30).lean();
  return res.json({ notifications });
});

router.patch("/notifications/:notificationId/read", async (req: Request, res: Response) => {
  const { notificationId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required." });
  }

  if (!mongoReady()) {
    const notification = memoryStore.notifications.find((item) => item._id === notificationId);
    if (!notification) return res.status(404).json({ message: "Notification not found." });
    notification.readBy = Array.from(new Set([...(notification.readBy ?? []), userId]));
    notification.updatedAt = new Date().toISOString();
    return res.json({ notification, storage: "memory" });
  }

  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { $addToSet: { readBy: userId } },
    { new: true },
  );

  if (!notification) {
    return res.status(404).json({ message: "Notification not found." });
  }

  return res.json({ notification });
});

router.post("/coding-questions", async (req: Request, res: Response) => {
  const { title, difficulty = "Easy", description, inputTestCase, expectedOutput, starterCode = "", facultyId } = req.body;

  if (!title || !description || !inputTestCase || !expectedOutput || !facultyId) {
    return res.status(400).json({
      message: "title, description, inputTestCase, expectedOutput, and facultyId are required.",
    });
  }

  if (!mongoReady()) {
    const codingQuestion = {
      _id: memoryId("coding-question"),
      title,
      difficulty,
      description,
      inputTestCase,
      expectedOutput,
      starterCode,
      facultyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.codingQuestions.unshift(codingQuestion);
    memoryStore.notifications.unshift({
      _id: memoryId("notification"),
      title: "New coding question added",
      message: `${title} is now available for coding practice.`,
      audience: "student",
      type: "general",
      createdAt: new Date().toISOString(),
    });
    return res.status(201).json({ codingQuestion, storage: "memory" });
  }

  const codingQuestion = await CodingQuestion.create({
    title,
    difficulty,
    description,
    inputTestCase,
    expectedOutput,
    starterCode,
    facultyId,
  });

  await Notification.create({
    title: "New coding question added",
    message: `${title} is now available for coding practice.`,
    audience: "student",
    type: "general",
  });

  return res.status(201).json({ codingQuestion });
});

router.get("/coding-questions", async (_req: Request, res: Response) => {
  if (!mongoReady()) {
    return res.json({ codingQuestions: memoryStore.codingQuestions, storage: "memory" });
  }

  const codingQuestions = await CodingQuestion.find().sort({ createdAt: -1 }).lean();
  return res.json({ codingQuestions });
});

export default router;
