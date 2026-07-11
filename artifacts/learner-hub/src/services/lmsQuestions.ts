export interface LMSQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  category: "GK Question" | "Quantitative Aptitude";
  difficulty?: string;
  sourceId?: string;
}

interface TriviaApiQuestion {
  id?: string;
  question?: {
    text?: string;
  };
  correctAnswer?: string;
  incorrectAnswers?: string[];
  difficulty?: string;
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

const REASONING_API =
  "https://the-trivia-api.com/v2/questions?limit=50&categories=science,geography";

const QUANTITATIVE_API =
  "https://the-trivia-api.com/v2/questions?limit=50&categories=science&tags=mathematics,numbers";

function decodeHtml(value: string) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function shuffleOptions(options: string[]) {
  return [...options].sort(() => Math.random() - 0.5);
}

function mapTriviaQuestion(
  item: TriviaApiQuestion,
  index: number,
  category: LMSQuestion["category"],
): LMSQuestion {
  const correctAnswer = item.correctAnswer ?? "";
  const incorrectAnswers = item.incorrectAnswers ?? [];

  return {
    id: index + 1,
    sourceId: item.id,
    category,
    difficulty: item.difficulty,
    questionText: item.question?.text ?? "Question text unavailable",
    correctAnswer,
    options: shuffleOptions([correctAnswer, ...incorrectAnswers].filter(Boolean)),
  };
}

function mapOpenTriviaQuestion(
  item: OpenTriviaQuestion,
  index: number,
  category: LMSQuestion["category"],
): LMSQuestion {
  const correctAnswer = decodeHtml(item.correct_answer ?? "");
  const incorrectAnswers = item.incorrect_answers ?? [];

  return {
    id: index + 1,
    sourceId: `${category}-${index + 1}`,
    category,
    difficulty: item.difficulty,
    questionText: decodeHtml(item.question ?? "Question text unavailable"),
    correctAnswer,
    options: shuffleOptions([correctAnswer, ...incorrectAnswers.map(decodeHtml)].filter(Boolean)),
  };
}

async function fetchTriviaQuestions(url: string, category: LMSQuestion["category"], startIndex: number) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load ${category} questions`);
  }

  const data = (await response.json()) as TriviaApiQuestion[];
  return data.slice(0, 50).map((item, index) => mapTriviaQuestion(item, startIndex + index, category));
}

async function fetchOpenTriviaQuestions(url: string, category: LMSQuestion["category"], startIndex: number) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load ${category} questions`);
  }

  const data = (await response.json()) as OpenTriviaResponse;
  const results = data.results ?? [];
  return results.slice(0, 50).map((item, index) => mapOpenTriviaQuestion(item, startIndex + index, category));
}

export async function loadLMSQuestions() {
  const [reasoningQuestions, quantitativeQuestions] = await Promise.all([
    fetchTriviaQuestions(REASONING_API, "GK Question", 0),
    fetchTriviaQuestions(QUANTITATIVE_API, "Quantitative Aptitude", 50),
  ]);

  return [...reasoningQuestions, ...quantitativeQuestions];
}
