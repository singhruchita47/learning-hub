import { Router, type Request, type Response } from "express";
import mongoose from "mongoose";
import Assignment from "../models/assignment";
import AssignmentSubmission from "../models/assignmentSubmission";
import ClassSession from "../models/classSession";
import CodingQuestion from "../models/codingQuestion";
import Notification from "../models/notification";
import QuizAttempt from "../models/quizAttempt";
import Attendance from "../models/attendance";
import Feedback from "../models/feedback";
import LiveClass from "../models/liveClass";
import Resource from "../models/resource";
import Course from "../models/course";
import Enrollment from "../models/enrollment";
import { isCloudinaryConfigured, uploadBufferToCloudinary } from "../lib/cloudinary";
import { getDB, updateDB } from "../lib/memoryDb";

const router = Router();

export let memoryStore = {
  assignments: getDB("assignments", []) as any[],
  assignmentSubmissions: getDB("assignmentSubmissions", []) as any[],
  quizAttempts: getDB("quizAttempts", []) as any[],
  notifications: getDB("notifications", []) as any[],
  codingQuestions: getDB("codingQuestions", []) as any[],
  classes: getDB("classes", []) as any[],
  attendance: getDB("attendance", []) as any[],
  feedback: getDB("feedback", []) as any[],
  liveClasses: getDB("liveClasses", []) as any[],
  resources: getDB("resources", []) as any[],
  courses: getDB("courses", []) as any[],
  enrollments: getDB("enrollments", []) as any[],
};

function saveMemoryStore(key: keyof typeof memoryStore) {
  updateDB(key, memoryStore[key]);
}

function mongoReady() {
  return mongoose.connection.readyState === 1;
}

function memoryId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

router.post("/assignments", async (req: Request, res: Response) => {
  const { title, description, dueDate, courseCode, facultyId, imageUrl, maxMarks } = req.body;

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
      imageUrl,
      maxMarks: maxMarks ? Number(maxMarks) : 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.assignments.unshift(assignment);
    saveMemoryStore("assignments");
    memoryStore.notifications.unshift({
      _id: memoryId("notification"),
      title: "New assignment published",
      message: `${title} is due on ${new Date(dueDate).toLocaleDateString("en-IN")}.`,
      audience: "student",
      type: "assignment",
      createdAt: new Date().toISOString(),
    });
    saveMemoryStore("notifications");
    return res.status(201).json({ assignment, storage: "memory" });
  }

  const assignment = await Assignment.create({
    title,
    description,
    dueDate: new Date(dueDate),
    courseCode,
    facultyId,
    imageUrl,
    maxMarks: maxMarks ? Number(maxMarks) : 100,
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
  const { studentId, fileName, fileUrl, note } = req.body;

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
      fileUrl,
      note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.assignmentSubmissions.unshift(submission);
    saveMemoryStore("assignmentSubmissions");
    memoryStore.notifications.unshift({
      _id: memoryId("notification"),
      title: "Assignment submitted",
      message: `${studentId} submitted ${fileName}.`,
      audience: "faculty",
      type: "assignment",
      createdAt: new Date().toISOString(),
    });
    saveMemoryStore("notifications");
    return res.status(201).json({ submission, storage: "memory" });
  }

  const submission = await AssignmentSubmission.create({
    assignment: assignmentId,
    studentId,
    fileName,
    fileUrl,
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
    saveMemoryStore("assignmentSubmissions");
    memoryStore.notifications.unshift({
      _id: memoryId("notification"),
      title: "Assignment feedback received",
      message: `Faculty added feedback for ${submission.assignment?.title ?? "your assignment"}. Marks: ${marks ?? "N/A"}.`,
      audience: "student",
      type: "assignment",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    saveMemoryStore("notifications");
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
    message: `Faculty added feedback for ${(submission.assignment as any)?.title ?? "your assignment submission"}. Marks: ${marks ?? "N/A"}.`,
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
    saveMemoryStore("quizAttempts");
    memoryStore.notifications.unshift({
      _id: memoryId("notification"),
      title: "Quiz attempt received",
      message: `${studentId} scored ${score}/${total} in ${quizTitle}.`,
      audience: "faculty",
      type: "quiz",
      createdAt: new Date().toISOString(),
    });
    saveMemoryStore("notifications");
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
    updateDB("classes", memoryStore.classes);
    memoryStore.notifications.unshift({
      _id: memoryId("notification"),
      title: "Live class scheduled",
      message: `${title} is scheduled for ${new Date(startsAt).toLocaleString("en-IN")}.`,
      audience: "student",
      type: "class",
      createdAt: new Date().toISOString(),
    });
    updateDB("notifications", memoryStore.notifications);
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
    return res.json({ classes: getDB().classes, storage: "memory" });
  }

  const classes = await ClassSession.find().sort({ startsAt: 1 }).lean();
  return res.json({ classes });
});

router.patch("/classes/:classId/status", async (req: Request, res: Response) => {
  const { classId } = req.params;
  const { status, recordingUrl } = req.body;

  if (!mongoReady()) {
    const db = getDB();
    const classSession = db.classes.find((item) => item._id === classId);
    if (!classSession) return res.status(404).json({ message: "Class session not found." });
    classSession.status = status;
    classSession.recordingUrl = recordingUrl;
    classSession.updatedAt = new Date().toISOString();
    updateDB("classes", db.classes);
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
    const db = getDB();
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
    db.notifications.unshift(notification);
    updateDB("notifications", db.notifications);
    return res.status(201).json({ notification, storage: "memory" });
  }

  const notification = await Notification.create({ title, message, audience, type });
  return res.status(201).json({ notification });
});

router.get("/notifications", async (req: Request, res: Response) => {
  const audience = typeof req.query.audience === "string" ? req.query.audience : undefined;
  if (!mongoReady()) {
    const notifications = getDB().notifications.filter(
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
    const db = getDB();
    const notification = db.notifications.find((item) => item._id === notificationId);
    if (!notification) return res.status(404).json({ message: "Notification not found." });
    notification.readBy = Array.from(new Set([...(notification.readBy ?? []), userId]));
    notification.updatedAt = new Date().toISOString();
    updateDB("notifications", db.notifications);
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
  const { title, difficulty = "Easy", description, inputTestCase, expectedOutput, starterCode = "", facultyId, imageUrl } = req.body;

  if (!title || !description || !inputTestCase || !expectedOutput || !facultyId) {
    return res.status(400).json({
      message: "title, description, inputTestCase, expectedOutput, and facultyId are required.",
    });
  }

  if (!mongoReady()) {
    const db = getDB();
    const codingQuestion = {
      _id: memoryId("coding-question"),
      title,
      difficulty,
      description,
      inputTestCase,
      expectedOutput,
      starterCode,
      facultyId,
      imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.codingQuestions.unshift(codingQuestion);
    updateDB("codingQuestions", db.codingQuestions);
    db.notifications.unshift({
      _id: memoryId("notification"),
      title: "New coding question added",
      message: `${title} is now available for coding practice.`,
      audience: "student",
      type: "general",
      createdAt: new Date().toISOString(),
    });
    updateDB("notifications", db.notifications);
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
    imageUrl,
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
    return res.json({ codingQuestions: getDB().codingQuestions, storage: "memory" });
  }

  const codingQuestions = await CodingQuestion.find().sort({ createdAt: -1 }).lean();
  return res.json({ codingQuestions });
});

// Attendance routes
router.post("/attendance/mark", async (req: Request, res: Response) => {
  const { studentId } = req.body;
  const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

  if (!studentId) {
    return res.status(400).json({ message: "studentId is required" });
  }

  if (!mongoReady()) {
    const db = getDB();
    const existing = db.attendance.find((item) => item.studentId === studentId && item.date === dateStr);
    if (existing) {
      return res.status(200).json({ attendance: existing, message: "Attendance already marked for today.", storage: "memory" });
    }
    const log = { _id: memoryId("attendance"), studentId, date: dateStr, marked: true, createdAt: new Date().toISOString() };
    db.attendance.push(log);
    updateDB("attendance", db.attendance);
    return res.status(201).json({ attendance: log, storage: "memory" });
  }

  const existing = await Attendance.findOne({ studentId, date: dateStr });
  if (existing) {
    return res.status(200).json({ attendance: existing, message: "Attendance already marked for today." });
  }

  const log = await Attendance.create({ studentId, date: dateStr, marked: true });
  return res.status(201).json({ attendance: log });
});

router.get("/attendance/list", async (_req: Request, res: Response) => {
  if (!mongoReady()) {
    return res.json({ attendance: getDB().attendance, storage: "memory" });
  }
  const attendance = await Attendance.find().sort({ createdAt: -1 }).lean();
  return res.json({ attendance });
});

// Feedback routes
router.post("/feedback", async (req: Request, res: Response) => {
  const { studentId, courseCode, rating, comments } = req.body;

  if (!studentId || !courseCode || !rating || !comments) {
    return res.status(400).json({ message: "studentId, courseCode, rating, and comments are required." });
  }

  if (!mongoReady()) {
    const db = getDB();
    const log = {
      _id: memoryId("feedback"),
      studentId,
      courseCode,
      rating: Number(rating),
      comments,
      createdAt: new Date().toISOString(),
    };
    db.feedback.push(log);
    updateDB("feedback", db.feedback);
    return res.status(201).json({ feedback: log, storage: "memory" });
  }

  const log = await Feedback.create({ studentId, courseCode, rating: Number(rating), comments });
  return res.status(201).json({ feedback: log });
});

router.get("/feedback", async (_req: Request, res: Response) => {
  if (!mongoReady()) {
    return res.json({ feedback: getDB().feedback, storage: "memory" });
  }
  const feedback = await Feedback.find().sort({ createdAt: -1 }).lean();
  return res.json({ feedback });
});

// Live Class routes
router.post("/live-classes", async (req: Request, res: Response) => {
  const { title, courseCode, facultyId, startsAt, meetingUrl } = req.body;

  if (!title || !courseCode || !facultyId || !startsAt) {
    return res.status(400).json({ message: "title, courseCode, facultyId, and startsAt are required." });
  }

  if (!mongoReady()) {
    const db = getDB();
    const liveClass = {
      _id: memoryId("liveclass"),
      title,
      courseCode,
      facultyId,
      startsAt: new Date(startsAt).toISOString(),
      meetingUrl,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    };
    db.liveClasses.unshift(liveClass);
    updateDB("liveClasses", db.liveClasses);
    
    // Trigger notification
    db.notifications.unshift({
      _id: memoryId("notification"),
      title: "Live class scheduled",
      message: `${title} starts at ${new Date(startsAt).toLocaleString("en-IN")}.`,
      audience: "student",
      type: "class",
      createdAt: new Date().toISOString(),
    });
    updateDB("notifications", db.notifications);
    
    return res.status(201).json({ liveClass, storage: "memory" });
  }

  const liveClass = await LiveClass.create({
    title,
    courseCode,
    facultyId,
    startsAt: new Date(startsAt),
    meetingUrl,
  });

  await Notification.create({
    title: "Live class scheduled",
    message: `${title} starts at ${new Date(startsAt).toLocaleString("en-IN")}.`,
    audience: "student",
    type: "class",
  });

  return res.status(201).json({ liveClass });
});

router.get("/live-classes", async (_req: Request, res: Response) => {
  if (!mongoReady()) {
    return res.json({ liveClasses: getDB().liveClasses, storage: "memory" });
  }
  const liveClasses = await LiveClass.find().sort({ startsAt: 1 }).lean();
  return res.json({ liveClasses });
});

router.patch("/live-classes/:classId/status", async (req: Request, res: Response) => {
  const { classId } = req.params;
  const { status } = req.body;

  if (!mongoReady()) {
    const db = getDB();
    const liveClass = db.liveClasses.find((item) => item._id === classId);
    if (!liveClass) return res.status(404).json({ message: "Live class not found." });
    liveClass.status = status;
    updateDB("liveClasses", db.liveClasses);
    return res.json({ liveClass, storage: "memory" });
  }

  const liveClass = await LiveClass.findByIdAndUpdate(classId, { status }, { new: true });
  if (!liveClass) return res.status(404).json({ message: "Live class not found." });
  return res.json({ liveClass });
});

// Batch Coding Question route (with aggregated alerts)
router.post("/coding-questions/batch", async (req: Request, res: Response) => {
  const { questions } = req.body;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: "questions must be a non-empty array." });
  }

  const createdQuestions: any[] = [];

  if (!mongoReady()) {
    for (const q of questions) {
      const codingQuestion = {
        _id: memoryId("coding-question"),
        title: q.title,
        difficulty: q.difficulty || "Easy",
        description: q.description,
        inputTestCase: q.inputTestCase,
        expectedOutput: q.expectedOutput,
        starterCode: q.starterCode || "",
        facultyId: q.facultyId,
        imageUrl: q.imageUrl,
        createdAt: new Date().toISOString(),
      };
      memoryStore.codingQuestions.unshift(codingQuestion);
      createdQuestions.push(codingQuestion);
    }
    updateDB("codingQuestions", memoryStore.codingQuestions);

    memoryStore.notifications.unshift({
      _id: memoryId("notification"),
      title: "New coding practice available",
      message: `Faculty has added ${questions.length} new practice coding questions.`,
      audience: "student",
      type: "general",
      createdAt: new Date().toISOString(),
    });
    updateDB("notifications", memoryStore.notifications);

    return res.status(201).json({ codingQuestions: createdQuestions, storage: "memory" });
  }

  for (const q of questions) {
    const codingQuestion = await CodingQuestion.create({
      title: q.title,
      difficulty: q.difficulty || "Easy",
      description: q.description,
      inputTestCase: q.inputTestCase,
      expectedOutput: q.expectedOutput,
      starterCode: q.starterCode || "",
      facultyId: q.facultyId,
      imageUrl: q.imageUrl,
    });
    createdQuestions.push(codingQuestion);
  }

  await Notification.create({
    title: "New coding practice available",
    message: `Faculty has added ${questions.length} new practice coding questions.`,
    audience: "student",
    type: "general",
  });

  return res.status(201).json({ codingQuestions: createdQuestions });
});

// Resources endpoints
router.post("/resources", async (req: Request, res: Response) => {
  const { title, category, courseCode, fileUrl, format, size, pages } = req.body;

  if (!title || !category || !courseCode || !fileUrl || !format) {
    return res.status(400).json({ message: "title, category, courseCode, fileUrl, and format are required." });
  }

  if (!mongoReady()) {
    const resource = {
      _id: memoryId("resource"),
      title,
      category,
      courseCode,
      fileUrl,
      format,
      size: size || "1.5 MB",
      pages: pages ? Number(pages) : 0,
      createdAt: new Date().toISOString(),
    };
    memoryStore.resources.unshift(resource);
    updateDB("resources", memoryStore.resources);

    // Trigger notification
    memoryStore.notifications.unshift({
      _id: memoryId("notification"),
      title: `New resource uploaded in ${category}`,
      message: `Faculty uploaded: ${title} (${courseCode}).`,
      audience: "student",
      type: "general",
      createdAt: new Date().toISOString(),
    });
    updateDB("notifications", memoryStore.notifications);

    return res.status(201).json({ resource, storage: "memory" });
  }

  const resource = await Resource.create({
    title,
    category,
    courseCode,
    fileUrl,
    format,
    size: size || "1.5 MB",
    pages: pages ? Number(pages) : 0,
  });

  await Notification.create({
    title: `New resource uploaded in ${category}`,
    message: `Faculty uploaded: ${title} (${courseCode}).`,
    audience: "student",
    type: "general",
  });

  return res.status(201).json({ resource });
});

router.get("/resources", async (_req: Request, res: Response) => {
  if (!mongoReady()) {
    return res.json({ resources: getDB().resources, storage: "memory" });
  }
  const resources = await Resource.find().sort({ createdAt: -1 }).lean();
  return res.json({ resources });
});

// Courses endpoints
router.post("/courses", async (req: Request, res: Response) => {
  const { code, title, color, teacher, status, branch } = req.body;

  if (!code || !title) {
    return res.status(400).json({ message: "code and title are required." });
  }

  if (!mongoReady()) {
    const course = {
      _id: memoryId("course"),
      code,
      title,
      color: color || "#7130a1",
      teacher: teacher || "Dr. Faculty",
      branch: branch || "All Branches",
      status: status || "approved",
      students: 0,
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    memoryStore.courses.push(course);
    updateDB("courses", memoryStore.courses);
    return res.status(201).json({ course, storage: "memory" });
  }

  try {
    const course = await Course.create({
      code,
      title,
      color: color || "#7130a1",
      teacher: teacher || "Dr. Faculty",
      branch: branch || "All Branches",
      status: status || "pending",
      students: Math.floor(Math.random() * 30) + 20,
      progress: Math.floor(Math.random() * 40) + 40,
    });
    return res.status(201).json({ course });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/courses", async (_req: Request, res: Response) => {
  if (!mongoReady()) {
    return res.json({ courses: memoryStore.courses, storage: "memory" });
  }
  const courses = await Course.find().sort({ createdAt: 1 }).lean();
  return res.json({ courses });
});

router.delete("/courses/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoReady()) {
    const index = memoryStore.courses.findIndex((c: any) => c.code === id || c._id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Course not found." });
    }
    const deletedCourse = memoryStore.courses.splice(index, 1)[0];
    updateDB("courses", memoryStore.courses);
    return res.json({ message: "Course deleted successfully.", course: deletedCourse });
  }

  try {
    const course = await Course.findOneAndDelete({ $or: [{ code: id }, { _id: id }] });
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }
    return res.json({ message: "Course deleted successfully.", course });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

// Enroll student in a course
router.post("/courses/:id/enroll", async (req: Request, res: Response) => {
  const { studentId, studentName } = req.body;
  const courseId = req.params.id;

  if (!studentId || !courseId) {
    return res.status(400).json({ message: "studentId and courseId are required." });
  }

  if (!mongoReady()) {
    const enrollments = memoryStore.enrollments;
    const alreadyEnrolled = enrollments.find(e => e.courseId === courseId && e.studentId === studentId);
    if (alreadyEnrolled) {
      return res.status(409).json({ message: "Already enrolled." });
    }
    const enrollment = {
      _id: memoryId("enrollment"),
      courseId,
      studentId,
      studentName: studentName || "Student",
      enrolledAt: new Date().toISOString(),
    };
    enrollments.push(enrollment);
    updateDB("enrollments", enrollments);

    // Increment student count on the course
    const course = memoryStore.courses.find(c => c._id === courseId);
    if (course) {
      course.students = (course.students || 0) + 1;
      updateDB("courses", memoryStore.courses);
    }

    return res.status(201).json({ enrollment, storage: "memory" });
  }

  // MongoDB mode
  try {
    const existing = await Enrollment.findOne({ courseId, studentId });
    if (existing) {
      return res.status(409).json({ message: "Already enrolled." });
    }

    const enrollment = await Enrollment.create({
      courseId,
      studentId,
      studentName: studentName || "Student",
    });

    await Course.findByIdAndUpdate(courseId, { $inc: { students: 1 } });

    return res.status(201).json({ enrollment });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

// Get enrolled course IDs for a student
router.get("/courses/enrolled/:studentId", async (req: Request, res: Response) => {
  const { studentId } = req.params;

  if (!mongoReady()) {
    const enrollments = memoryStore.enrollments || [];
    const studentEnrollments = enrollments.filter((e: any) => e.studentId === studentId);
    return res.json({ enrollments: studentEnrollments, storage: "memory" });
  }

  try {
    const enrollments = await Enrollment.find({ studentId });
    return res.json({ enrollments });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

// Upload file base64 endpoint
router.post("/upload-base64", async (req: Request, res: Response) => {
  const { fileName, base64Data } = req.body;
  if (!fileName || !base64Data) {
    return res.status(400).json({ message: "fileName and base64Data are required." });
  }

  if (!isCloudinaryConfigured()) {
    return res.status(503).json({ message: "Cloudinary is not configured on the server." });
  }

  try {
    const buffer = Buffer.from(base64Data, "base64");
    const fileUrl = await uploadBufferToCloudinary(buffer, fileName);
    return res.status(200).json({ fileUrl });
  } catch (error: any) {
    return res.status(500).json({ message: error.message ?? "Cloudinary upload failed." });
  }
});

// Reset database endpoint
router.post("/reset-db", async (_req: Request, res: Response) => {
  memoryStore.assignments = [];
  memoryStore.assignmentSubmissions = [];
  memoryStore.quizAttempts = [];
  memoryStore.notifications = [];
  memoryStore.codingQuestions = [];
  memoryStore.classes = [];
  memoryStore.attendance = [];
  memoryStore.feedback = [];
  memoryStore.liveClasses = [];
  memoryStore.resources = [];
  memoryStore.courses = [];
  
  if (mongoReady()) {
    try {
      await mongoose.connection.db.dropDatabase();
    } catch {
      // Ignore if cannot drop
    }
  }

  return res.json({ message: "Database reset successful" });
});

// ==========================================
// Doubt Forum endpoints
// ==========================================
router.get("/forum/threads", async (_req: Request, res: Response) => {
  if (!mongoReady()) {
    const db = getDB();
    if (!db.forumThreads) db.forumThreads = [];
    return res.json({ threads: db.forumThreads, storage: "memory" });
  }
  // If mongo is ready, we would fetch from DB. For now, fallback to memory if no model.
  return res.json({ threads: getDB().forumThreads || [], storage: "memory" });
});

router.post("/forum/threads", async (req: Request, res: Response) => {
  const { author, initials, role, color, title, body, tag, tagColor } = req.body;
  if (!title || !body) {
    return res.status(400).json({ message: "title and body are required." });
  }

  const db = getDB();
  if (!db.forumThreads) db.forumThreads = [];

  const thread = {
    id: Date.now(),
    author: author || "Student",
    initials: initials || "ST",
    role: role || "Student",
    color: color || "#6c5ce7",
    title,
    body,
    time: new Date().toISOString(),
    tag: tag || "General",
    tagColor: tagColor || "#6c5ce7",
    likes: 0,
    replies: []
  };

  db.forumThreads.unshift(thread);
  updateDB("forumThreads", db.forumThreads);
  
  return res.status(201).json({ thread, storage: "memory" });
});

router.post("/forum/threads/:id/replies", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { author, initials, text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "text is required." });
  }

  const db = getDB();
  if (!db.forumThreads) db.forumThreads = [];
  
  const thread = db.forumThreads.find((t: any) => t.id.toString() === id);
  if (!thread) return res.status(404).json({ message: "Thread not found." });

  const reply = {
    id: Date.now(),
    author: author || "User",
    initials: initials || "US",
    text,
    time: new Date().toISOString()
  };

  thread.replies.push(reply);
  updateDB("forumThreads", db.forumThreads);

  return res.status(201).json({ reply, storage: "memory" });
});

router.patch("/forum/threads/:id/like", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { delta } = req.body; // usually 1 or -1

  const db = getDB();
  if (!db.forumThreads) db.forumThreads = [];
  
  const thread = db.forumThreads.find((t: any) => t.id.toString() === id);
  if (!thread) return res.status(404).json({ message: "Thread not found." });

  thread.likes = Math.max(0, (thread.likes || 0) + (delta || 1));
  updateDB("forumThreads", db.forumThreads);

  return res.json({ likes: thread.likes, storage: "memory" });
});

// ==========================================
// Attendance endpoints
// ==========================================
router.get("/attendance", async (_req: Request, res: Response) => {
  if (!mongoReady()) {
    const db = getDB();
    if (!db.attendance) db.attendance = [];
    return res.json({ attendance: db.attendance, storage: "memory" });
  }
  return res.json({ attendance: getDB().attendance || [], storage: "memory" });
});

router.post("/attendance", async (req: Request, res: Response) => {
  const { course, date, attendance, facultyId, studentId, courseCode, status } = req.body;
  
  const db = getDB();
  if (!db.attendance) db.attendance = [];

  // Faculty batch submission
  if (course && date && attendance) {
    const session = {
      id: Date.now().toString(),
      course,
      date,
      attendance,
      facultyId: facultyId || "Faculty",
      createdAt: new Date().toISOString()
    };
    db.attendance.unshift(session);
    updateDB("attendance", db.attendance);
    return res.status(201).json({ session, storage: "memory" });
  }

  // Student individual submission
  if (studentId && courseCode && date && status) {
    let session = db.attendance.find((s: any) => s.course === courseCode && s.date === date);
    if (!session) {
      session = {
        id: Date.now().toString(),
        course: courseCode,
        date,
        attendance: {},
        facultyId: "System",
        createdAt: new Date().toISOString()
      };
      db.attendance.unshift(session);
    }
    session.attendance[studentId] = status;
    updateDB("attendance", db.attendance);
    
    return res.status(201).json({
      record: {
        _id: session.id + "_" + studentId,
        courseCode,
        date,
        status,
        markedAt: new Date().toISOString()
      },
      storage: "memory"
    });
  }

  return res.status(400).json({ message: "Invalid payload for attendance." });
});

router.get("/attendance/student/:studentId", async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const db = getDB();
  if (!db.attendance) db.attendance = [];

  const records = db.attendance.map((s: any) => {
    if (s.attendance[studentId as string]) {
      return {
        _id: s.id + "_" + studentId,
        courseCode: s.course,
        date: s.date,
        status: s.attendance[studentId as string],
        markedAt: s.createdAt
      };
    }
    return null;
  }).filter(Boolean);

  return res.json({ attendance: records, storage: "memory" });
});

router.get("/attendance/all", async (_req: Request, res: Response) => {
  const db = getDB();
  if (!db.attendance) db.attendance = [];
  
  // Flatten sessions into individual records
  const allRecords: any[] = [];
  db.attendance.forEach((s: any) => {
    for (const [studentId, status] of Object.entries(s.attendance || {})) {
      allRecords.push({
        _id: s.id + "_" + studentId,
        studentId,
        studentName: "Student", // Without a lookup table, fallback to generic
        courseCode: s.course,
        date: s.date,
        status,
        markedAt: s.createdAt
      });
    }
  });

  return res.json({ attendance: allRecords, storage: "memory" });
});

router.get("/attendance/faculty", async (req: Request, res: Response) => {
  const { date } = req.query;
  const db = getDB();
  if (!db.facultyAttendance) db.facultyAttendance = [];
  
  let records = db.facultyAttendance;
  if (date) {
    records = records.filter((r: any) => r.date === date);
  }
  return res.json({ attendance: records, storage: "memory" });
});

router.post("/attendance/faculty", async (req: Request, res: Response) => {
  const { facultyId, facultyName, date, status } = req.body;
  const db = getDB();
  if (!db.facultyAttendance) db.facultyAttendance = [];
  
  let record = db.facultyAttendance.find((r: any) => r.facultyId === facultyId && r.date === date);
  if (record) {
    record.status = status;
    record.markedAt = new Date().toISOString();
  } else {
    record = {
      _id: Date.now().toString(),
      facultyId,
      facultyName,
      date,
      status,
      markedAt: new Date().toISOString()
    };
    db.facultyAttendance.unshift(record);
  }
  updateDB("facultyAttendance", db.facultyAttendance);
  
  return res.status(201).json({ record, storage: "memory" });
});

// ==========================================
// Timetable endpoints
// ==========================================
router.get("/timetable", async (_req: Request, res: Response) => {
  const db = getDB();
  if (!db.timetable) db.timetable = [];
  return res.json({ timetable: db.timetable, storage: "memory" });
});

router.post("/timetable", async (req: Request, res: Response) => {
  const { courseCode, subject, facultyId, facultyName, day, startTime, endTime, type, location } = req.body;
  if (!courseCode || !day || !startTime || !endTime) {
    return res.status(400).json({ message: "courseCode, day, startTime, and endTime are required." });
  }

  const db = getDB();
  if (!db.timetable) db.timetable = [];

  const slot = {
    id: Date.now().toString(),
    courseCode,
    subject: subject || courseCode,
    facultyId: facultyId || "faculty-demo",
    facultyName: facultyName || "Faculty",
    day,
    startTime,
    endTime,
    type: type || "Lecture",
    location: location || "TBA",
    createdAt: new Date().toISOString()
  };

  db.timetable.push(slot);
  updateDB("timetable", db.timetable);
  
  return res.status(201).json({ slot, storage: "memory" });
});

router.delete("/timetable/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDB();
  if (!db.timetable) db.timetable = [];
  
  const index = db.timetable.findIndex((t: any) => t.id === id);
  if (index !== -1) {
    db.timetable.splice(index, 1);
    updateDB("timetable", db.timetable);
    return res.json({ message: "Timetable slot deleted." });
  }
  return res.status(404).json({ message: "Slot not found." });
});

router.get("/timetable/student/:studentId", async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const db = getDB();
  if (!db.timetable) db.timetable = [];
  if (!db.enrollments) db.enrollments = [];

  // Get courses the student is enrolled in
  // Mocking: If the student has no enrollments, we just return all timetable slots as a fallback/demo, 
  // or return specific courses. For a demo, returning all if empty might be better, or standard CS301.
  const studentEnrollments = db.enrollments.filter((e: any) => e.studentId === studentId);
  let courseCodes = studentEnrollments.map((e: any) => e.courseId);
  
  // If no enrollments, return a default mock schedule based on CS301, CS302, CS303
  if (courseCodes.length === 0) {
    courseCodes = ["CS301", "CS302", "CS303"];
  }

  const slots = db.timetable.filter((t: any) => courseCodes.includes(t.courseCode));
  return res.json({ timetable: slots, storage: "memory" });
});

router.get("/timetable/faculty/:facultyId", async (req: Request, res: Response) => {
  const { facultyId } = req.params;
  const db = getDB();
  if (!db.timetable) db.timetable = [];
  
  // For demo, if facultyId is generic or demo, return all. Otherwise filter by exact email/ID.
  let slots = db.timetable.filter((t: any) => t.facultyId === facultyId);
  if (slots.length === 0 && facultyId.includes("demo")) {
    slots = db.timetable;
  }
  
  return res.json({ timetable: slots, storage: "memory" });
});

// ==========================================
// Role Permissions Endpoints
// ==========================================
const DEFAULT_PERMISSIONS = {
  admin: ["manage_users", "manage_courses", "view_reports", "manage_permissions", "manage_timetable", "manage_announcements"],
  faculty: ["create_courses", "create_assignments", "mark_attendance", "view_submissions", "schedule_classes"],
  student: ["view_courses", "submit_assignments", "view_grades", "participate_forum", "view_timetable"]
};

router.get("/permissions", async (_req: Request, res: Response) => {
  const db = getDB();
  if (!db.permissions) {
    db.permissions = DEFAULT_PERMISSIONS;
    updateDB("permissions", db.permissions);
  }
  return res.json({ permissions: db.permissions, storage: "memory" });
});

router.post("/permissions", async (req: Request, res: Response) => {
  const { role, permissions } = req.body;
  if (!role || !permissions) {
    return res.status(400).json({ message: "role and permissions array are required." });
  }

  const db = getDB();
  if (!db.permissions) db.permissions = DEFAULT_PERMISSIONS;

  db.permissions[role] = permissions;
  updateDB("permissions", db.permissions);

  return res.json({ message: "Permissions updated successfully", permissions: db.permissions, storage: "memory" });
});

// Feedback Endpoints
// ==========================================
router.get("/feedback", async (_req: Request, res: Response) => {
  if (!mongoReady()) {
    return res.json({ feedback: memoryStore.feedback || [], storage: "memory" });
  }
  const feedback = await Feedback.find().sort({ createdAt: -1 });
  return res.json({ feedback });
});

router.post("/feedback", async (req: Request, res: Response) => {
  const { studentId, courseCode, rating, comments } = req.body;
  if (!studentId || !courseCode || rating === undefined || !comments) {
    return res.status(400).json({ message: "Missing fields" });
  }
  
  if (!mongoReady()) {
    const feedback = {
      _id: memoryId("feedback"),
      studentId,
      courseCode,
      rating: Number(rating),
      comments,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (!memoryStore.feedback) memoryStore.feedback = [];
    memoryStore.feedback.unshift(feedback);
    saveMemoryStore("feedback");
    return res.status(201).json({ feedback, storage: "memory" });
  }
  
  const feedback = await Feedback.create({ 
    studentId, 
    courseCode, 
    rating: Number(rating), 
    comments 
  });
  return res.status(201).json({ feedback });
});

export default router;
