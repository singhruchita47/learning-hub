import mongoose from "mongoose";
import { logger } from "./logger";

export async function connectToMongo(): Promise<boolean> {
  const uri = process.env["MONGODB_URI"] ?? "mongodb://127.0.0.1:27017/learning-hub";

  try {
    await mongoose.connect(uri, { 
      serverSelectionTimeoutMS: 2500,
      bufferCommands: false 
    });
    logger.info({ uri }, "Connected to MongoDB");
    return true;
  } catch (err) {
    logger.warn({ err, uri }, "MongoDB unavailable. API will run with in-memory fallback data.");
    return false;
  }
}
