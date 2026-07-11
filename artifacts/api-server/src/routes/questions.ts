import { Router } from "express";
import Question from "../models/question";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { title, description, inputTestCase, expectedOutput } = req.body;

    if (!title || !description || inputTestCase == null || expectedOutput == null) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["title", "description", "inputTestCase", "expectedOutput"],
      });
    }

    const created = await Question.create({
      title,
      description,
      inputTestCase,
      expectedOutput,
    });

    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
