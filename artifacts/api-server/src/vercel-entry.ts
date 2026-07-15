import app from "./app";
import { connectToMongo } from "./lib/mongo";

let isConnected = false;

// Middleware to ensure Mongo is connected before handling requests on Vercel
app.use(async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  
  if (!isConnected) {
    try {
      await connectToMongo();
      isConnected = true;
    } catch (error) {
      console.error("Vercel Mongo Connection Error:", error);
    }
  }
  next();
});

export default app;
