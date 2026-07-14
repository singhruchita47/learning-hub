import { Router, type Request, type Response } from "express";
import fs from "fs";
import path from "path";

const router = Router();

const DB_FILE = path.join(process.cwd(), "local_memory_db.json");

function readDB(): Record<string, any> {
  try {
    if (!fs.existsSync(DB_FILE)) return {};
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeDB(data: Record<string, any>) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// GET /api/attendance?date=YYYY-MM-DD&courseCode=XYZ
router.get("/", (req: Request, res: Response) => {
  const db = readDB();
  const records: any[] = db.attendance || [];
  const { date, courseCode } = req.query as { date?: string; courseCode?: string };

  let filtered = records;
  if (date) filtered = filtered.filter((r) => r.date === date);
  if (courseCode) filtered = filtered.filter((r) => r.courseCode === courseCode);

  // Group by date+courseCode for faculty summary
  const summary: Record<string, { date: string; courseCode: string; present: string[]; total: number }> = {};
  filtered.forEach((r) => {
    const key = `${r.date}__${r.courseCode}`;
    if (!summary[key]) {
      summary[key] = { date: r.date, courseCode: r.courseCode, present: [], total: 0 };
    }
    if (r.status === "present" && !summary[key].present.includes(r.studentId)) {
      summary[key].present.push(r.studentId);
    }
    summary[key].total = Math.max(summary[key].total, summary[key].present.length);
  });

  res.json({ attendance: filtered, summary: Object.values(summary) });
});

// POST /api/attendance - student marks attendance
router.post("/", (req: Request, res: Response) => {
  const { studentId, studentName, courseCode, date, status } = req.body as {
    studentId: string;
    studentName: string;
    courseCode: string;
    date: string;
    status: "present" | "absent";
  };

  if (!studentId || !courseCode || !date) {
    res.status(400).json({ message: "studentId, courseCode, date required" });
    return;
  }


  const db = readDB();
  if (!db.attendance) db.attendance = [];

  // Upsert: one record per student per course per date
  const idx = (db.attendance as any[]).findIndex(
    (r: any) => r.studentId === studentId && r.courseCode === courseCode && r.date === date
  );

  const record = {
    _id: idx >= 0 ? db.attendance[idx]._id : `att-${Date.now()}`,
    studentId,
    studentName: studentName || studentId,
    courseCode,
    date,
    status: status || "present",
    markedAt: new Date().toISOString(),
  };

  if (idx >= 0) {
    db.attendance[idx] = record;
  } else {
    db.attendance.push(record);
  }

  writeDB(db);
  res.status(200).json({ message: "Attendance recorded", record });
});

// GET /api/attendance/student/:studentId - get full attendance history
router.get("/student/:studentId", (req: Request, res: Response) => {
  const db = readDB();
  const records: any[] = db.attendance || [];
  const { studentId } = req.params;
  const studentRecords = records.filter((r) => r.studentId === studentId);
  res.json({ attendance: studentRecords });
});

// GET /api/attendance/faculty-summary - faculty sees today's counts per course
router.get("/faculty-summary", (req: Request, res: Response) => {
  const db = readDB();
  const records: any[] = db.attendance || [];
  const { date } = req.query as { date?: string };
  const targetDate = date || new Date().toISOString().slice(0, 10);

  const todayRecords = records.filter((r) => r.date === targetDate && r.status === "present");

  const byCourse: Record<string, { courseCode: string; presentCount: number; students: string[] }> = {};
  todayRecords.forEach((r) => {
    if (!byCourse[r.courseCode]) {
      byCourse[r.courseCode] = { courseCode: r.courseCode, presentCount: 0, students: [] };
    }
    if (!byCourse[r.courseCode].students.includes(r.studentName || r.studentId)) {
      byCourse[r.courseCode].students.push(r.studentName || r.studentId);
      byCourse[r.courseCode].presentCount++;
    }
  });

  res.json({ date: targetDate, summary: Object.values(byCourse) });
});

// GET /api/attendance/faculty - get all faculty attendance records
router.get("/faculty", (req: Request, res: Response) => {
  const db = readDB();
  const records = db.facultyAttendance || [];
  const { date } = req.query as { date?: string };
  const targetDate = date || new Date().toISOString().slice(0, 10);
  
  const filtered = records.filter((r: any) => r.date === targetDate);
  res.json({ attendance: filtered });
});

// POST /api/attendance/faculty - mark/update faculty attendance
router.post("/faculty", (req: Request, res: Response) => {
  const { facultyId, facultyName, date, status } = req.body as {
    facultyId: string;
    facultyName: string;
    date: string;
    status: "present" | "absent";
  };

  if (!facultyId || !date || !status) {
    res.status(400).json({ message: "facultyId, date, status are required" });
    return;
  }

  const db = readDB();
  if (!db.facultyAttendance) db.facultyAttendance = [];

  const idx = (db.facultyAttendance as any[]).findIndex(
    (r: any) => r.facultyId === facultyId && r.date === date
  );

  const record = {
    _id: idx >= 0 ? db.facultyAttendance[idx]._id : `fatt-${Date.now()}`,
    facultyId,
    facultyName: facultyName || facultyId,
    date,
    status,
    markedAt: new Date().toISOString(),
  };

  if (idx >= 0) {
    db.facultyAttendance[idx] = record;
  } else {
    db.facultyAttendance.push(record);
  }

  writeDB(db);
  res.status(200).json({ message: "Faculty attendance recorded", record });
});

export default router;
