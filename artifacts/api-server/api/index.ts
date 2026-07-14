import app from "../src/app";
import { connectToMongo } from "../src/lib/mongo";

let isConnected = false;

// Middleware to ensure Mongo is connected before handling requests
app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectToMongo();
    isConnected = true;
  }
  next();
});

export default app;
