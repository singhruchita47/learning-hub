import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Code2,
  Flame,
  ListChecks,
  Play,
  RotateCcw,
  Search,
  Send,
  Trophy,
  XCircle,
} from "lucide-react";
import { useLocation } from "wouter";
import { codingPracticeProblems, type PracticeProblem } from "@/data/codingPracticeProblems";
import { ACADEMIC_API_BASE, RUN_CODE_DIRECT_URL } from "@/lib/api";

const API_BASE = ACADEMIC_API_BASE;

const languages = [
  { key: "javascript", label: "JavaScript", judge0Id: 63 },
  { key: "python", label: "Python 3", judge0Id: 71 },
  { key: "java", label: "Java", judge0Id: 62 },
  { key: "cpp", label: "C++", judge0Id: 54 },
] as const;

type LanguageKey = (typeof languages)[number]["key"];

type RunState = {
  status: "running" | "accepted" | "wrong" | "error";
  output: string;
  expected: string;
  message: string;
};

const leaderboard = [
  { rank: 1, name: "Ruchita Singh", solved: 5, score: 500, streak: 7 },
  { rank: 2, name: "Arjun Singh", solved: 4, score: 420, streak: 5 },
  { rank: 3, name: "Priya Sharma", solved: 4, score: 390, streak: 4 },
  { rank: 4, name: "Rahul Verma", solved: 3, score: 310, streak: 3 },
];

function starterCode(language: LanguageKey, problem: PracticeProblem) {
  if (language === "python") {
    return `class Solution:\n    def solve(self):\n        data = input().strip()\n        # code here\n\nSolution().solve()\n`;
  }

  if (language === "java") {
    return `import java.util.*;\n\nclass Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    // code here\n  }\n}\n`;
  }

  if (language === "cpp") {
    return `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  // code here\n  return 0;\n}\n`;
  }

  return `const fs = require("fs");\nconst input = fs.readFileSync(0, "utf8").trim();\n\n// code here\n`;
}

function runJavaScript(sourceCode: string, stdin: string, expected: string): RunState {
  const logs: string[] = [];
  const fakeConsole = { log: (...args: unknown[]) => logs.push(args.map(String).join(" ")) };
  const fakeRequire = (moduleName: string) => {
    if (moduleName !== "fs") throw new Error(`Module "${moduleName}" is not available.`);
    return { readFileSync: () => stdin };
  };

  try {
    const runner = new Function("require", "console", sourceCode);
    runner(fakeRequire, fakeConsole);
    const output = logs.join("\n").trim();
    const accepted = output === expected.trim();
    return {
      status: accepted ? "accepted" : "wrong",
      output: output || "(no output)",
      expected,
      message: accepted ? "Accepted" : "Wrong Answer",
    };
  } catch (error) {
    return {
      status: "error",
      output: error instanceof Error ? error.message : "Runtime error",
      expected,
      message: "Runtime Error",
    };
  }
}

async function runWithJudge0(problem: PracticeProblem, sourceCode: string, languageId: number) {
  const response = await fetch(RUN_CODE_DIRECT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source_code: sourceCode,
      language_id: languageId,
      stdin: problem.stdin,
      expected_output: problem.expectedOutput,
    }),
  });

  if (!response.ok) throw new Error("Judge0 backend is not running or API key is missing.");
  return response.json();
}

export default function CodingPractice() {
  const [location, setLocation] = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageKey | "">("");
  const [facultyProblems, setFacultyProblems] = useState<PracticeProblem[]>([]);
  const [solutions, setSolutions] = useState<Record<string, string>>({});
  const [runStates, setRunStates] = useState<Record<string, RunState>>({});
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const activeId = location.startsWith("/coding-practice/")
    ? decodeURIComponent(location.split("/").filter(Boolean).at(-1) ?? "")
    : null;

  const activeProblem = useMemo(
    () => [...facultyProblems, ...codingPracticeProblems].find((problem) => problem.id === activeId) ?? null,
    [activeId, facultyProblems],
  );
  const practiceProblems = useMemo(() => [...facultyProblems, ...codingPracticeProblems], [facultyProblems]);
  const language = languages.find((item) => item.key === selectedLanguage);
  const solutionKey = activeProblem ? `${activeProblem.id}-${selectedLanguage}` : "";
  const currentCode =
    activeProblem && selectedLanguage
      ? solutions[solutionKey] ?? starterCode(selectedLanguage, activeProblem)
      : "";
  const currentRun = solutionKey ? runStates[solutionKey] : undefined;

  useEffect(() => {
    let mounted = true;

    fetch(`${API_BASE}/coding-questions`)
      .then((response) => {
        if (!response.ok) throw new Error("Coding question API unavailable");
        return response.json();
      })
      .then((data: { codingQuestions?: Array<{
        _id: string;
        title: string;
        description: string;
        inputTestCase: string;
        expectedOutput: string;
      }> }) => {
        if (!mounted) return;
        const mapped = (data.codingQuestions ?? []).map((question) => ({
          id: `faculty-${question._id}`,
          title: question.title,
          difficulty: "Easy" as const,
          tags: ["Faculty Assigned", "Practice"],
          acceptance: "New",
          description: question.description,
          examples: [
            {
              input: question.inputTestCase,
              output: question.expectedOutput,
              explanation: "This sample is provided by faculty.",
            },
          ],
          constraints: ["Follow the input/output format exactly."],
          stdin: question.inputTestCase,
          expectedOutput: question.expectedOutput,
        }));
        setFacultyProblems(mapped);
      })
      .catch(() => {
        if (mounted) setFacultyProblems([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function handleRun(submit = false) {
    if (!selectedLanguage || !language || !activeProblem) return;

    setRunStates((current) => ({
      ...current,
      [solutionKey]: {
        status: "running",
        output: "Running sample test...",
        expected: activeProblem.expectedOutput,
        message: "Running",
      },
    }));

    try {
      let result: RunState;
      if (selectedLanguage === "javascript") {
        result = runJavaScript(currentCode, activeProblem.stdin, activeProblem.expectedOutput);
      } else {
        const judgeResult = await runWithJudge0(activeProblem, currentCode, language.judge0Id);
        const output = (judgeResult.stdout || judgeResult.stderr || judgeResult.compile_output || "").trim();
        const accepted = judgeResult.status?.description === "Accepted";
        result = {
          status: accepted ? "accepted" : "wrong",
          output: output || "(no output)",
          expected: activeProblem.expectedOutput,
          message: judgeResult.status?.description ?? "Judge0 result",
        };
      }

      setRunStates((current) => ({ ...current, [solutionKey]: result }));
      if (submit && result.status === "accepted") {
        setSolvedIds((current) => (current.includes(activeProblem.id) ? current : [...current, activeProblem.id]));
      }
    } catch (error) {
      setRunStates((current) => ({
        ...current,
        [solutionKey]: {
          status: "error",
          output: error instanceof Error ? error.message : "Unable to run code",
          expected: activeProblem.expectedOutput,
          message: "Judge0 unavailable",
        },
      }));
    }
  }

  if (!selectedLanguage) {
    return (
      <div className="min-h-[calc(100vh-130px)] bg-gradient-to-br from-white via-indigo-50 to-violet-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
              <Code2 className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-950">Coding Practice</h1>
            <p className="mt-2 text-sm font-semibold text-slate-600">Choose your language first, then select an easy question.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {languages.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setSelectedLanguage(item.key);
                  setLocation("/coding-practice");
                }}
                className="rounded-3xl border border-indigo-100 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
              >
                <Code2 className="mb-5 h-7 w-7 text-indigo-500" />
                <h2 className="text-lg font-extrabold text-slate-950">{item.label}</h2>
                <p className="mt-2 text-xs font-semibold text-slate-500">Problem list, editor, tests, submit, leaderboard.</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!activeProblem) {
    return (
      <div className="min-h-[calc(100vh-130px)] bg-[#f6f8fb]">
        <div className="border-b border-slate-200 bg-white px-4 py-4">
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-black text-indigo-600">LH</div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-950">Coding Practice</h1>
                <p className="text-xs font-bold text-slate-500">Language: {language?.label}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedLanguage("")}
              className="rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-extrabold text-indigo-700 hover:bg-indigo-50"
            >
              Change Language
            </button>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1500px] gap-5 p-5 lg:grid-cols-[1fr_330px]">
          <main className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-950">Popular Problems</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {solvedIds.length} of {practiceProblems.length} Problems Solved
                  {facultyProblems.length > 0 && (
                    <span className="ml-2 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-black text-violet-700">
                      {facultyProblems.length} faculty assigned
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-500">
                  <Search className="h-4 w-4" />
                  Search
                </div>
                <div className="h-11 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600">
                  Sort: Submissions
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {practiceProblems.map((problem) => {
                const solved = solvedIds.includes(problem.id);
                return (
                  <div key={problem.id} className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      <button className="mt-1 text-slate-400">♡</button>
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-800">{problem.title}</h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-sm font-semibold text-slate-500">
                          <span className="text-indigo-600">{problem.difficulty}</span>
                          <span>•</span>
                          <span>{problem.acceptance}</span>
                          <span>•</span>
                          <span>{problem.tags.join(", ")}</span>
                          {solved && <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-extrabold text-indigo-700">Solved</span>}
                        </div>
                        <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-slate-500">{problem.description}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLocation(`/coding-practice/${problem.id}`)}
                      className="h-11 min-w-28 rounded-xl border border-indigo-500 px-7 text-sm font-extrabold text-indigo-700 transition-all hover:bg-indigo-50"
                    >
                      Solve
                    </button>
                  </div>
                );
              })}
            </div>
          </main>

          <aside className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-100">Practice Set</p>
              <h2 className="mt-2 text-lg font-extrabold">Beginner Friendly</h2>
              <p className="mt-1 text-sm font-semibold text-indigo-50">
                {practiceProblems.length} easy questions including faculty assigned tasks.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Trophy className="h-4 w-4 text-amber-500" />
                Coding Leaderboard
              </h2>
              <div className="space-y-3">
                {leaderboard.map((item) => (
                  <div key={item.rank} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-extrabold text-white">#{item.rank}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold text-slate-900">{item.name}</p>
                      <p className="text-xs font-bold text-slate-500">{item.solved} solved • {item.score} pts</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-extrabold text-orange-500">
                      <Flame className="h-3.5 w-3.5" />
                      {item.streak}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[720px] flex-col overflow-hidden bg-[#eef2f6]">
      <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-2">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setLocation("/coding-practice")} className="text-2xl font-black text-indigo-600">LH</button>
            <span className="text-sm font-extrabold text-slate-500">Problem</span>
            <span className="text-sm font-extrabold text-slate-500">Editorial</span>
            <span className="text-sm font-extrabold text-slate-500">Submissions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-extrabold text-indigo-700">{language?.label}</span>
            <button
              type="button"
              onClick={() => setLocation("/coding-practice")}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-600 hover:bg-slate-50"
            >
              Question List
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid min-h-0 w-full max-w-[1600px] flex-1 grid-cols-[40fr_60fr] items-stretch gap-1 px-3 pb-2 pt-2">
        <section className="h-full overflow-y-auto rounded-l-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-extrabold text-slate-950">{activeProblem.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-5 text-sm font-semibold text-slate-600">
            <span>Difficulty: <b className="text-indigo-600">{activeProblem.difficulty}</b></span>
            <span>Accuracy: <b>{activeProblem.acceptance}</b></span>
            <span>Points: <b>2</b></span>
            <span>Average Time: <b>5m</b></span>
          </div>
          <div className="my-5 h-px bg-slate-200" />
          <p className="text-lg font-medium leading-8 text-slate-700">{activeProblem.description}</p>

          <div className="mt-7 space-y-5">
            {activeProblem.examples.map((example, index) => (
              <div key={index}>
                <h3 className="mb-2 text-base font-extrabold text-slate-900">Example {index + 1}:</h3>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-base leading-7 text-slate-700">
                  <p><b>Input:</b> {example.input}</p>
                  <p><b>Output:</b> {example.output}</p>
                  <p><b>Explanation:</b> {example.explanation}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="mb-3 text-base font-extrabold text-slate-900">Constraints:</h3>
            <div className="space-y-2">
              {activeProblem.constraints.map((item) => (
                <p key={item} className="font-mono text-sm text-slate-700">{item}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="flex h-full min-h-0 flex-col rounded-r-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
              <Code2 className="h-4 w-4 text-indigo-600" />
              Code
            </div>
            <select
              value={selectedLanguage}
              onChange={(event) => setSelectedLanguage(event.target.value as LanguageKey)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none"
            >
              {languages.map((item) => (
                <option key={item.key} value={item.key}>{item.label}</option>
              ))}
            </select>
          </div>

          <textarea
            value={currentCode}
            onChange={(event) => setSolutions((current) => ({ ...current, [solutionKey]: event.target.value }))}
            spellCheck={false}
            className="min-h-0 flex-1 resize-none bg-white p-4 font-mono text-sm leading-6 text-slate-900 outline-none"
          />

          <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                Testcase
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleRun(false)}
                  className="h-11 rounded-xl bg-slate-700 px-5 text-sm font-extrabold text-white hover:bg-slate-800"
                >
                  Compile & Run
                </button>
                <button
                  type="button"
                  onClick={() => handleRun(true)}
                  className="h-11 rounded-xl bg-indigo-600 px-6 text-sm font-extrabold text-white hover:bg-indigo-700"
                >
                  Submit
                </button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <pre className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">Input: {activeProblem.stdin}</pre>
              <pre className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">Expected: {activeProblem.expectedOutput}</pre>
            </div>
            {currentRun && (
              <div className={`mt-3 rounded-xl border p-3 text-sm ${
                currentRun.status === "accepted"
                  ? "border-indigo-200 bg-indigo-50 text-indigo-800"
                  : currentRun.status === "running"
                    ? "border-blue-200 bg-blue-50 text-blue-800"
                    : "border-red-200 bg-red-50 text-red-800"
              }`}>
                <div className="mb-2 flex items-center gap-2 font-extrabold">
                  {currentRun.status === "accepted" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  {currentRun.message}
                </div>
                <pre className="whitespace-pre-wrap rounded-lg bg-white/70 p-2">Your Output: {currentRun.output}</pre>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
