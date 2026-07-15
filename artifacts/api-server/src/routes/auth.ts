import { Router, type Request, type Response } from "express";
import crypto from "node:crypto";
import mongoose from "mongoose";
import User, { type UserRole } from "../models/user";
import { getDB, updateDB } from "../lib/memoryDb";

const router = Router();

type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch?: string;
  course?: string;
  enrollmentYear?: string;
};

type MemoryUser = PublicUser & {
  passwordHash: string;
};

export let memoryUsers: MemoryUser[] = getDB("users", []);
const allowedRoles: UserRole[] = ["student", "faculty", "admin"];

function saveMemoryUsers() {
  updateDB("users", memoryUsers);
}

// Seed default admin if it doesn't exist
if (!memoryUsers.find((u) => u.email === "admin@learning.hub")) {
  memoryUsers.push({
    id: "usr_admin_default",
    name: "System Admin",
    email: "admin@learning.hub",
    role: "admin",
    passwordHash: createPasswordHash("admin123")
  });
  saveMemoryUsers();
}

function mongoReady() {
  return mongoose.connection.readyState === 1;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function createPasswordHash(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  const derived = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512");
  const saved = Buffer.from(hash, "hex");
  return saved.length === derived.length && crypto.timingSafeEqual(saved, derived);
}

function signToken(user: PublicUser) {
  const secret = process.env["AUTH_SECRET"] ?? "learning-hub-local-secret";
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      role: user.role,
      email: user.email,
      iat: Date.now(),
    }),
  ).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function toPublicUser(user: { _id?: unknown; id?: string; name: string; email: string; role: UserRole }): PublicUser {
  return {
    id: String(user.id ?? user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    branch: (user as any).branch,
    course: (user as any).course,
    enrollmentYear: (user as any).enrollmentYear,
  };
}

function validateAuthBody(req: Request) {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body.email === "string" ? normalizeEmail(req.body.email) : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";
  const role = allowedRoles.includes(req.body.role) ? (req.body.role as UserRole) : "student";
  return { name, email, password, role };
}

router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password, role } = validateAuthBody(req);

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  if (!mongoReady()) {
    const existing = memoryUsers.find((user) => user.email === email);
    if (existing) return res.status(409).json({ message: "Account already exists. Please sign in." });

    const user = {
      id: `user-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      email,
      role,
      passwordHash: createPasswordHash(password),
    };
    memoryUsers.push(user);
    saveMemoryUsers();

    const publicUser = toPublicUser(user);
    return res.status(201).json({ user: publicUser, token: signToken(publicUser), storage: "memory" });
  }

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Account already exists. Please sign in." });

  const user = await User.create({
    name,
    email,
    role,
    passwordHash: createPasswordHash(password),
  });
  const publicUser = toPublicUser(user);

  return res.status(201).json({ user: publicUser, token: signToken(publicUser), storage: "mongo" });
});

router.post("/login", async (req: Request, res: Response) => {
  const email = typeof req.body.email === "string" ? normalizeEmail(req.body.email) : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  if (!mongoReady()) {
    const user = memoryUsers.find((item) => item.email === email);
    if (!user) {
      return res.status(404).json({ message: "Account not found. Please register first." });
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ message: "Password is incorrect." });
    }

    const publicUser = toPublicUser(user);
    return res.json({ user: publicUser, token: signToken(publicUser), storage: "memory" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "Account not found. Please register first." });
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ message: "Password is incorrect." });
  }

  const publicUser = toPublicUser(user);
  return res.json({ user: publicUser, token: signToken(publicUser), storage: "mongo" });
});

export default router;
