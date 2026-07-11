import type { LMSQuestion } from "@/services/lmsQuestions";

export interface GeminiReviewResult {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
}

export async function reviewAnswerWithGemini(question: LMSQuestion, userAnswer: string): Promise<GeminiReviewResult> {
  const prompt = `
Question: ${question.questionText}
User Answer: ${userAnswer}
Correct Answer: ${question.correctAnswer}

Explain whether the user's answer is correct. If it is wrong, explain the concept clearly in simple language.
`;

  // Production note:
  // Keep the Gemini API key on your backend. This frontend calls your own route,
  // and your server should forward the prompt to Gemini securely.
  const response = await fetch("/api/gemini-review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      questionText: question.questionText,
      userAnswer,
      correctAnswer: question.correctAnswer,
    }),
  });

  if (!response.ok) {
    throw new Error("Gemini review request failed");
  }

  return response.json();
}

