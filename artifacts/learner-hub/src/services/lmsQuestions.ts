import aptitudeJson from "./aptitude_questions.json";
import reasoningJson from "./reasoning_questions.json";

export interface LMSQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  category: "GK Question" | "Quantitative Aptitude" | "Reasoning";
  difficulty?: string;
  sourceId?: string;
  topic?: string;
}

// ─── Types for JSON shapes ────────────────────────────────────────────────────

interface AptitudeJsonItem {
  questionText?: string;
  options?: string[];
  correctAnswer?: string;
  topic?: string;
  category?: string;
}

interface OpenTriviaQuestion {
  category?: string;
  type?: string;
  difficulty?: string;
  question?: string;
  correct_answer?: string;
  incorrect_answers?: string[];
}

interface OpenTriviaResponse {
  response_code?: number;
  results?: OpenTriviaQuestion[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function decodeHtml(value: string): string {
  try {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = value;
    return textarea.value;
  } catch {
    return value;
  }
}

function shuffleOptions(options: string[]): string[] {
  return [...options].sort(() => Math.random() - 0.5);
}

// ─── Load Quantitative Aptitude questions from our static JSON dataset ────────
// This JSON was collected from https://aptitude-gold.vercel.app/ API (429 real questions)

function loadQuantitativeAptitudeQuestions(): LMSQuestion[] {
  const rawItems = aptitudeJson as AptitudeJsonItem[];

  return rawItems
    .filter(
      (item) =>
        item.questionText &&
        Array.isArray(item.options) &&
        item.options.length >= 2 &&
        item.correctAnswer &&
        // Filter out malformed entries (options that look like JSON strings)
        !item.options.some(
          (opt) => opt.startsWith("[") || opt.includes("\\\"")
        )
    )
    .map((item, index) => ({
      id: 1000 + index,
      sourceId: `aptitude-${index + 1}`,
      category: "Quantitative Aptitude" as const,
      topic: item.topic ?? "Quantitative Aptitude",
      questionText: item.questionText!,
      options: item.options!,
      correctAnswer: item.correctAnswer!,
    }));
}

// ─── Load GK questions from OpenTrivia API ────────────────────────────────────

async function fetchGKQuestions(startIndex: number): Promise<LMSQuestion[]> {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=50&category=9&type=multiple"
    );
    if (!response.ok) {
      throw new Error(`OpenTrivia API returned ${response.status}`);
    }

    const data = (await response.json()) as OpenTriviaResponse;
    const results = data.results ?? [];

    return results.map((item, index) => {
      const correctAnswer = decodeHtml(item.correct_answer ?? "");
      const incorrectAnswers = item.incorrect_answers ?? [];
      return {
        id: startIndex + index,
        sourceId: `gk-${index + 1}`,
        category: "GK Question" as const,
        difficulty: item.difficulty,
        topic: "General Knowledge",
        questionText: decodeHtml(item.question ?? "Question text unavailable"),
        correctAnswer,
        options: shuffleOptions(
          [correctAnswer, ...incorrectAnswers.map(decodeHtml)].filter(Boolean)
        ),
      };
    });
  } catch {
    // Return empty if API is unavailable
    return [];
  }
}

// ─── Load Reasoning questions from our static JSON dataset ────────
function loadReasoningQuestions(startIndex: number): LMSQuestion[] {
  const rawItems = reasoningJson as AptitudeJsonItem[];
  return rawItems
    .filter(item => item.questionText && Array.isArray(item.options) && item.correctAnswer)
    .map((item, index) => ({
      id: startIndex + index,
      sourceId: `reasoning-${index + 1}`,
      category: "Reasoning" as const,
      topic: item.topic ?? "Reasoning",
      questionText: item.questionText!,
      options: item.options!,
      correctAnswer: item.correctAnswer!,
    }));
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function loadLMSQuestions(): Promise<LMSQuestion[]> {
  // Load aptitude questions from static JSON (always available, no API needed)
  const aptitudeQuestions = loadQuantitativeAptitudeQuestions();
  
  // Load reasoning questions
  const reasoningQuestions = loadReasoningQuestions(10000);

  // Fetch GK questions from OpenTrivia API (best-effort, returns empty on failure)
  const gkQuestions = await fetchGKQuestions(0);

  return [...gkQuestions, ...aptitudeQuestions, ...reasoningQuestions];
}

// ─── Export counts for display in UI ─────────────────────────────────────────

export function getAptitudeQuestionCount(): number {
  const rawItems = aptitudeJson as AptitudeJsonItem[];
  return rawItems.filter(
    (item) =>
      item.questionText &&
      Array.isArray(item.options) &&
      item.options.length >= 2 &&
      item.correctAnswer &&
      !item.options.some((opt) => opt.startsWith("[") || opt.includes("\\\""))
  ).length;
}
