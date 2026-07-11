import type { Question } from "@/context/AcademicContext";

type LocalSubjectName = "Reasoning" | "English";

interface LocalQuestion {
  id?: number;
  topic?: string;
  category?: string;
  question?: string | { text?: string };
  questionText?: string;
  options?: string[];
  choices?: string[];
  incorrectAnswers?: string[];
  correct_answer?: string;
  correctAnswer?: string;
  answer?: string;
  incorrect_answers?: string[];
}

const REASONING_URL = "https://the-trivia-api.com/v2/questions?limit=50&categories=science&tags=logic,puzzles";
const ENGLISH_URL = "https://open-trivia-database.com/api.php?amount=50&category=23&type=multiple";

function asQuestionArray(data: unknown, subject: LocalSubjectName): LocalQuestion[] {
  if (Array.isArray(data)) return data as LocalQuestion[];
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const direct = record[subject];
    if (Array.isArray(direct)) return direct as LocalQuestion[];
    for (const key of ["questions", "data", "results", subject.toLowerCase()]) {
      if (Array.isArray(record[key])) return record[key] as LocalQuestion[];
    }
  }
  return [];
}

async function fetchJson(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType && !contentType.includes("application/json") && !url.includes("raw.githubusercontent.com")) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

function decodeHtml(value: string) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function getQuestionText(item: LocalQuestion) {
  if (typeof item.question === "string") return decodeHtml(item.question);
  if (item.question?.text) return decodeHtml(item.question.text);
  return decodeHtml(item.questionText ?? "");
}

function shuffleOptions(options: string[]) {
  return [...options].sort(() => Math.random() - 0.5);
}

function normalizeLocalQuestions(
  questions: LocalQuestion[] = [],
  category: LocalSubjectName,
  startId: number,
): Question[] {
  return questions
    .map((item, index) => {
      const correctAnswer = decodeHtml(item.correct_answer ?? item.correctAnswer ?? item.answer ?? "");
      const incorrectAnswers = item.incorrect_answers ?? item.incorrectAnswers ?? [];
      const suppliedOptions = item.options ?? item.choices ?? [];
      const options =
        suppliedOptions.length > 0
          ? suppliedOptions.map(decodeHtml)
          : shuffleOptions([correctAnswer, ...incorrectAnswers.map(decodeHtml)].filter(Boolean));

      return {
        id: startId + index,
        sourceId: item.id != null ? String(item.id) : `${category}-${index + 1}`,
        category,
        topic: item.topic ?? item.category ?? category,
        questionText: getQuestionText(item),
        options,
        correctAnswer,
      };
    })
    .filter((question) => question.questionText && question.correctAnswer && question.options.length > 0);
}

export async function loadLocalSubjectQuestions(startId = 1001): Promise<Question[]> {
  const [reasoningData, englishData] = await Promise.all([
    fetchJson(REASONING_URL),
    fetchJson(ENGLISH_URL),
  ]);

  const primaryReasoningQuestions = asQuestionArray(reasoningData, "Reasoning");
  const primaryEnglishQuestions = asQuestionArray(englishData, "English");

  const reasoningQuestions = primaryReasoningQuestions.slice(0, 50);
  const englishQuestions = primaryEnglishQuestions.slice(0, 50);

  return [
    ...normalizeLocalQuestions(reasoningQuestions, "Reasoning", startId),
    ...normalizeLocalQuestions(englishQuestions, "English", startId + 50),
  ];
}
