import { Router } from "express";
import axios from "axios";
import mongoose from "mongoose";
import Question from "../models/question";

const router = Router();

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions?wait=true";
const JUDGE0_HOST = "judge0-ce.p.rapidapi.com";

router.post("/run-code", async (req, res) => {
  try {
    const { questionId, source_code, language_id } = req.body;

    if (!questionId || !source_code || !language_id) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["questionId", "source_code", "language_id"],
      });
    }

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ error: "Invalid questionId" });
    }

    const rapidApiKey = process.env["RAPIDAPI_KEY"];

    if (!rapidApiKey) {
      return res.status(500).json({
        error: "RAPIDAPI_KEY environment variable is not configured",
      });
    }

    const question = await Question.findById(questionId).lean();

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const judgeResponse = await axios.post(
      JUDGE0_URL,
      {
        source_code,
        language_id,
        stdin: question.inputTestCase,
        expected_output: question.expectedOutput,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": rapidApiKey,
          "X-RapidAPI-Host": JUDGE0_HOST,
        },
      },
    );

    const result = judgeResponse.data;

    return res.json({
      questionId,
      status: result.status,
      stdout: result.stdout,
      stderr: result.stderr,
      compile_output: result.compile_output,
      message: result.message,
      time: result.time,
      memory: result.memory,
      token: result.token,
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return res.status(err.response?.status ?? 502).json({
        error: "Judge0 request failed",
        details: err.response?.data ?? err.message,
      });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/run-code-direct", async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_output } = req.body;

    if (!source_code || !language_id || stdin == null || expected_output == null) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["source_code", "language_id", "stdin", "expected_output"],
      });
    }

    const rapidApiKey = process.env["RAPIDAPI_KEY"];

    if (!rapidApiKey) {
      return res.status(500).json({
        error: "RAPIDAPI_KEY environment variable is not configured",
      });
    }

    const judgeResponse = await axios.post(
      JUDGE0_URL,
      {
        source_code,
        language_id,
        stdin,
        expected_output,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": rapidApiKey,
          "X-RapidAPI-Host": JUDGE0_HOST,
        },
      },
    );

    return res.json(judgeResponse.data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return res.status(err.response?.status ?? 502).json({
        error: "Judge0 request failed",
        details: err.response?.data ?? err.message,
      });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
