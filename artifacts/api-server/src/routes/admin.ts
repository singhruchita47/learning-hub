import { Router } from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import User from "../models/user";
import Course from "../models/course";
import Event from "../models/event";
import Announcement from "../models/announcement";
import { memoryUsers } from "./auth";
import { memoryStore } from "./academic";

const router = Router();

function mongoReady() {
  return mongoose.connection.readyState === 1;
}

// ==========================================
// User Management & Allocations & Badges
// ==========================================

// Get all users
router.get("/users", async (req, res) => {
  if (!mongoReady()) {
    // Return memoryUsers formatted to look like DB users
    const users = memoryUsers.map(u => ({
      _id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: "active"
    }));
    return res.json({ users, storage: "memory" });
  }
  try {
    const users = await User.find().select("-passwordHash").populate("mentorId", "name email");
    res.json({ users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create user (admin creates student or faculty)
router.post("/users", async (req, res) => {
  try {
    const { name, email, role, password, branch, course, enrollmentYear } = req.body;
    
    if (!name || !email || !role || !password) {
      return res.status(400).json({ error: "Name, email, role, and password are required" });
    }

    // Use the password provided by the admin
    const salt = crypto.randomBytes(16).toString("hex");
    const derived = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
    const passwordHash = `${salt}:${derived}`;

    if (!mongoReady()) {
      const existing = memoryUsers.find(u => u.email === email);
      if (existing) return res.status(409).json({ error: "Email already exists" });

      const newUser = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        name,
        email,
        passwordHash, 
        role
      };
      memoryUsers.push(newUser);
      
      const userObj = { _id: newUser.id, name, email, role, status: "active" };
      return res.status(201).json({ user: userObj, storage: "memory" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already exists" });

    const user = new User({
      name, email, role, passwordHash, branch, course, enrollmentYear
    });
    await user.save();
    
    // Convert to simple object and remove hash
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;

    res.status(201).json({ user: userObj });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk create users
router.post("/users/bulk", async (req, res) => {
  try {
    const { users } = req.body;
    if (!Array.isArray(users)) return res.status(400).json({ error: "Expected 'users' array" });

    const salt = crypto.randomBytes(16).toString("hex");
    const derived = crypto.pbkdf2Sync("password123", salt, 120000, 64, "sha512").toString("hex");
    const passwordHash = `${salt}:${derived}`;

    const usersToInsert = users.map((u: any) => ({
      name: u.name,
      email: u.email || `${u.name.toLowerCase().replace(/\s+/g, ".")}@lh.edu`,
      role: u.role || "student",
      branch: u.branch,
      course: u.course,
      enrollmentYear: u.enrollmentYear,
      passwordHash
    }));

    // For simplicity, we just use insertMany and skip validation for existing emails
    // A robust system would check each, but insertMany throws on duplicate if email is unique index.
    // Assuming we want a simple approach:
    const inserted = await User.insertMany(usersToInsert, { ordered: false }).catch((e) => e.insertedDocs || []);

    res.status(201).json({ count: inserted.length, message: "Bulk insert completed" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user details (branch, course, status, etc)
router.patch("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Assign mentor to student
router.patch("/users/:id/mentor", async (req, res) => {
  try {
    const { mentorId } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { mentorId }, { new: true });
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Award badge
router.patch("/users/:id/badge", async (req, res) => {
  try {
    const { badge } = req.body;
    if (!badge) return res.status(400).json({ error: "Badge is required" });
    
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { $push: { badges: badge } },
      { new: true }
    );
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Course Approval & Assignments
// ==========================================

// Get all courses (including pending ones)
router.get("/courses", async (req, res) => {
  if (!mongoReady()) {
    return res.json({ courses: memoryStore.courses, storage: "memory" });
  }
  try {
    const courses = await Course.find().populate("facultyId", "name email");
    res.json({ courses });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Approve/Reject/Update Course
router.patch("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json({ course });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Assign Faculty to Course
router.patch("/courses/:id/faculty", async (req, res) => {
  try {
    const { facultyId } = req.body;
    const course = await Course.findByIdAndUpdate(req.params.id, { facultyId }, { new: true });
    res.json({ course });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Calendar Events
// ==========================================

router.get("/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({ events });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/events", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ event });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==========================================
// System Announcements
// ==========================================

router.get("/announcements", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json({ announcements });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/announcements", async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.status(201).json({ announcement });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
