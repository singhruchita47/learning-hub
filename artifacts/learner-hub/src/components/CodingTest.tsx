import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, Code2, FileCode2, Play, Send, XCircle } from "lucide-react";
import type { CodingQuestion } from "@/data/codingQuestions";

interface CodingTestProps {
  questions: CodingQuestion[];
  onBack: () => void;
}

const languages = [
  { id: 63, name: "JavaScript", key: "javascript" },
  { id: 71, name: "Python", key: "python" },
  { id: 62, name: "Java", key: "java" },
  { id: 54, name: "C++", key: "cpp" },
] as const;

type LanguageKey = (typeof languages)[number]["key"];

type RunResult = {
  status: "success" | "error" | "info";
  output: string;
  expectedOutput: string;
  message: string;
};

type CodingResult = {
  questionId: string;
  title: string;
  passed: boolean;
  output: string;
  expectedOutput: string;
};

function starterCodeFor(language: LanguageKey) {
  if (language === "python") {
    return "import sys\n\n# Write your code here\n";
  }

  if (language === "java") {
    return "import java.util.*;\n\nclass Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    // Write your code here\n  }\n}\n";
  }

  if (language === "cpp") {
    return "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  // Write your code here\n  return 0;\n}\n";
  }

  return "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim();\n\n// Write your code here\n";
}

export default function CodingTest({ questions, onBack }: CodingTestProps) {
  const [activeId, setActiveId] = useState(questions[0]?.id ?? "");
  const [language, setLanguage] = useState<LanguageKey>("javascript");
  const [solutions, setSolutions] = useState<Record<string, string>>({});
  const [runResults, setRunResults] = useState<Record<string, RunResult>>({});
  const [submissionResults, setSubmissionResults] = useState<CodingResult[] | null>(null);

  const activeQuestion = useMemo(
    () => questions.find((question) => question.id === activeId) ?? questions[0],
    [activeId, questions],
  );

  const attemptedCount = questions.filter((question) => {
    const solutionKey = `${question.id}-${language}`;
    const solution = solutions[solutionKey] ?? "";
    return solution.trim() !== starterCodeFor(language).trim();
  }).length;

  if (!activeQuestion) return null;

  const currentSolutionKey = `${activeQuestion.id}-${language}`;
  const currentStarterCode = starterCodeFor(language);
  const currentSolution = solutions[currentSolutionKey] ?? currentStarterCode;
  const selectedLanguage = languages.find((item) => item.key === language) ?? languages[0];
  const currentRunResult = runResults[currentSolutionKey];

  function executeJavaScript(question: CodingQuestion, sourceCode: string): RunResult {
    const logs: string[] = [];
    const fakeConsole = {
      log: (...args: unknown[]) => logs.push(args.map(String).join(" ")),
    };
    const fakeRequire = (moduleName: string) => {
      if (moduleName !== "fs") {
        throw new Error(`Module "${moduleName}" is not available in sample runner.`);
      }

      return {
        readFileSync: () => question.inputTestCase,
      };
    };

    try {
      const runner = new Function("require", "console", sourceCode);
      runner(fakeRequire, fakeConsole);
      const output = logs.join("\n").trim();
      const expectedOutput = question.expectedOutput.trim();
      const passed = output === expectedOutput;

      return {
        status: passed ? "success" : "error",
        output: output || "(no output)",
        expectedOutput,
        message: passed ? "Sample passed" : "Output does not match expected output",
      };
    } catch (error) {
      return {
        status: "error",
        output: error instanceof Error ? error.message : "Runtime error",
        expectedOutput: question.expectedOutput,
        message: "Runtime error",
      };
    }
  }

  function handleRunSample() {
    if (language !== "javascript") {
      setRunResults((current) => ({
        ...current,
        [currentSolutionKey]: {
          status: "info",
          output: "Python, Java, and C++ need the Judge0 backend/API runner. JavaScript sample runs locally in the browser.",
          expectedOutput: activeQuestion.expectedOutput,
          message: `${selectedLanguage.name} runner needs backend`,
        },
      }));
      return;
    }

    const result = executeJavaScript(activeQuestion, currentSolution);
    setRunResults((current) => ({
      ...current,
      [currentSolutionKey]: result,
    }));
  }

  function handleSubmitTest() {
    if (language !== "javascript") {
      const results = questions.map((question) => {
        const result = runResults[`${question.id}-${language}`];
        return {
          questionId: question.id,
          title: question.title,
          passed: result?.status === "success",
          output: result?.output ?? "Not checked. Judge0 backend is needed for this language.",
          expectedOutput: question.expectedOutput,
        };
      });
      setSubmissionResults(results);
      return;
    }

    const nextRunResults: Record<string, RunResult> = {};
    const results = questions.map((question) => {
      const solutionKey = `${question.id}-${language}`;
      const sourceCode = solutions[solutionKey] ?? starterCodeFor(language);
      const result = executeJavaScript(question, sourceCode);
      nextRunResults[solutionKey] = result;

      return {
        questionId: question.id,
        title: question.title,
        passed: result.status === "success",
        output: result.output,
        expectedOutput: result.expectedOutput,
      };
    });

    setRunResults((current) => ({ ...current, ...nextRunResults }));
    setSubmissionResults(results);
  }

  const score = submissionResults?.filter((result) => result.passed).length ?? 0;
  const scorePercent = submissionResults ? Math.round((score / questions.length) * 100) : 0;
  const wrongCount = submissionResults ? questions.length - score : 0;

  return (
    <div className="min-h-[calc(100vh-96px)] bg-white p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="mb-3 inline-flex items-center gap-2 text-sm font-extrabold text-slate-500 transition-colors hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Quizzes
            </button>
            <h1 className="text-2xl font-extrabold text-slate-950">Coding Test</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {questions.length} faculty-selected programming questions for practice and assessment.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-50 px-4 text-sm font-extrabold text-indigo-700">
              <Clock className="h-4 w-4" />
              30 mins
            </span>
            <span className="inline-flex h-10 items-center rounded-xl bg-emerald-50 px-4 text-sm font-extrabold text-emerald-700">
              {attemptedCount}/{questions.length} attempted
            </span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as LanguageKey)}
              className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-extrabold text-slate-700 outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            >
              {languages.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {submissionResults && (
          <div className="mb-6 overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50 to-emerald-50 p-5 shadow-sm">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">Coding Result</p>
              <div className="mx-auto mt-4 flex h-32 w-32 items-center justify-center rounded-full border-8 border-white bg-slate-950 text-white shadow-xl shadow-indigo-200">
                <div>
                  <div className="text-4xl font-extrabold">{scorePercent}%</div>
                  <div className="text-[11px] font-bold text-slate-300">Score</div>
                </div>
              </div>
              <h2 className="mt-4 text-3xl font-extrabold text-slate-950">
                {score}/{questions.length} correct
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Your submitted code was checked against the sample test cases.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-extrabold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {score} Correct
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-extrabold text-red-700">
                  <XCircle className="h-4 w-4" />
                  {wrongCount} Wrong
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-extrabold text-indigo-700">
                  <Code2 className="h-4 w-4" />
                  {selectedLanguage.name}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {submissionResults.map((result, index) => (
                <button
                  key={result.questionId}
                  type="button"
                  onClick={() => setActiveId(result.questionId)}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    result.passed ? "border-emerald-200 bg-white" : "border-red-200 bg-white"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      result.passed ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {result.passed ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  </span>
                  <span>
                    <span className="block text-xs font-extrabold text-slate-500">Q{index + 1}</span>
                    <span className={`block text-sm font-extrabold ${result.passed ? "text-emerald-800" : "text-red-800"}`}>
                      {result.title}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-slate-500">
                      {result.passed ? "Sample output matched" : "Check output and expected result"}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-2xl border border-gray-100 bg-slate-50 p-3 shadow-sm">
            <div className="mb-3 flex items-center gap-2 px-2 text-sm font-extrabold text-slate-700">
              <FileCode2 className="h-4 w-4 text-indigo-600" />
              Coding Questions
            </div>
            <div className="space-y-2">
              {questions.map((question, index) => {
                const isActive = question.id === activeQuestion.id;
                const solutionKey = `${question.id}-${language}`;
                const isAttempted = (solutions[solutionKey] ?? "").trim() !== starterCodeFor(language).trim();
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => setActiveId(question.id)}
                    className={`w-full rounded-xl border p-3 text-left transition-all ${
                      isActive
                        ? "border-indigo-200 bg-white shadow-sm"
                        : "border-transparent bg-white/70 hover:border-gray-200 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-slate-400">Q{index + 1}</span>
                      {isAttempted && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    </div>
                    <p className="mt-1 text-sm font-extrabold text-slate-900">{question.title}</p>
                    <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                      Easy
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-700">
                  <Code2 className="h-3.5 w-3.5" />
                  {selectedLanguage.name}
                </div>
                <h2 className="text-xl font-extrabold text-slate-950">{activeQuestion.title}</h2>
                <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">{activeQuestion.description}</p>
              </div>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">Sample Input</p>
                <pre className="overflow-x-auto rounded-xl bg-white p-3 text-sm font-bold text-slate-800">{activeQuestion.inputTestCase}</pre>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">Expected Output</p>
                <pre className="overflow-x-auto rounded-xl bg-white p-3 text-sm font-bold text-slate-800">{activeQuestion.expectedOutput}</pre>
              </div>
            </div>

            <textarea
              value={currentSolution}
              onChange={(event) =>
                setSolutions((current) => ({
                  ...current,
                  [currentSolutionKey]: event.target.value,
                }))
              }
              spellCheck={false}
              className="min-h-[340px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-50 outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />

            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <button
                type="button"
                onClick={handleRunSample}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-extrabold text-slate-700 transition-all hover:bg-slate-50"
              >
                <Play className="h-4 w-4" />
                Run Sample
              </button>
              <button
                type="button"
                onClick={handleSubmitTest}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-extrabold text-white shadow-sm transition-all hover:bg-slate-800"
              >
                <Send className="h-4 w-4" />
                Submit Coding Test
              </button>
            </div>

            {currentRunResult && (
              <div
                className={`mt-4 rounded-2xl border p-4 ${
                  currentRunResult.status === "success"
                    ? "border-emerald-200 bg-emerald-50"
                    : currentRunResult.status === "info"
                      ? "border-amber-200 bg-amber-50"
                      : "border-red-200 bg-red-50"
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p
                    className={`text-sm font-extrabold ${
                      currentRunResult.status === "success"
                        ? "text-emerald-700"
                        : currentRunResult.status === "info"
                          ? "text-amber-700"
                          : "text-red-700"
                    }`}
                  >
                    {currentRunResult.message}
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-slate-500">Your Output</p>
                    <pre className="min-h-12 overflow-x-auto rounded-xl bg-white p-3 text-sm font-bold text-slate-800">
                      {currentRunResult.output}
                    </pre>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-slate-500">Expected Output</p>
                    <pre className="min-h-12 overflow-x-auto rounded-xl bg-white p-3 text-sm font-bold text-slate-800">
                      {currentRunResult.expectedOutput}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
