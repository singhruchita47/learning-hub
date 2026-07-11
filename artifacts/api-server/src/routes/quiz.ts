import { Router } from "express";
import multer from "multer";
import * as XLSX from "xlsx";
import Quiz from "../models/quiz";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/bulk-import", upload.single("file"), async (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: "File is required (form field name: file)" });
    }

    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return res.status(400).json({ error: "Workbook contains no sheets" });
    }

    const sheet = workbook.Sheets[sheetName];
    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const docs = rows.map((row) => {
      const questionText = row["questionText"] || row["QuestionText"] || row["question"] || row["Question"] || "";
      const optionsRaw = row["options"] || row["Options"] || row["choices"] || "";
      const correctAnswer = row["correctAnswer"] || row["CorrectAnswer"] || row["answer"] || "";
      const difficulty = row["difficulty"] || row["Difficulty"] || undefined;
      const imageUrl = row["imageUrl"] || row["ImageUrl"] || row["image"] || undefined;

      let options: string[] = [];
      if (Array.isArray(optionsRaw)) options = optionsRaw.map(String);
      else if (typeof optionsRaw === "string") {
        options = optionsRaw
          .toString()
          .split(/;|,|\|/)
          .map((s) => s.trim())
          .filter(Boolean);
      }

      return { questionText, options, correctAnswer, difficulty, imageUrl };
    });

    const validDocs = docs.filter((d) => d.questionText && d.options && d.options.length > 0 && d.correctAnswer);

    if (validDocs.length === 0) {
      return res.status(400).json({ error: "No valid rows to import. Ensure required columns are present." });
    }

    const inserted = await Quiz.insertMany(validDocs, { ordered: false });

    return res.status(201).json({ insertedCount: inserted.length });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
