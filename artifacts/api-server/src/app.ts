import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { connectToMongo } from "./lib/mongo";

const app: Express = express();

import User from "./models/user";
import crypto from "node:crypto";

function createPasswordHash(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return `${salt}:${derived}`;
}

let isConnected = false;
app.use(async (req, res, next) => {
  if (process.env.VERCEL && !isConnected) {
    try {
      await connectToMongo();
      isConnected = true;
      
      // Seed Mongo Admin
      const adminExists = await User.findOne({ email: "admin@learning.hub" });
      if (!adminExists) {
        await User.create({
          name: "System Admin",
          email: "admin@learning.hub",
          role: "admin",
          passwordHash: createPasswordHash("admin123"),
        });
      }
    } catch (error) {
      console.error("MongoDB Connection/Seeding failed, falling back to memory:", error);
    }
  }
  next();
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api", router);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

export default app;
