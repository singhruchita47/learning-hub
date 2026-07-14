import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Code2,
  Flame,
  Play,
  RotateCcw,
  Search,
  Send,
  Trophy,
  XCircle,
  Loader,
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
  const [activeTab, setActiveTab] = useState<"test" | "practice">("practice");

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
        isTest?: boolean;
      }> }) => {
        if (!mounted) return;
        const mapped = (data.codingQuestions ?? []).map((question) => {
          const isTest = question.isTest || question.title.toLowerCase().includes("test") || question.title.toLowerCase().includes("exam");
          return {
            id: `faculty-${question._id}`,
            title: question.title,
            difficulty: "Easy" as const,
            tags: [isTest ? "Coding Test" : "Practice Question", "Faculty Assigned"],
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
            isTest
          };
        });
        setFacultyProblems(mapped);
      })
      .catch(() => {
        if (mounted) setFacultyProblems([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // UI Text Parsing to hide raw code or JSON schema from the student
  const parsedDescription = useMemo(() => {
    if (!activeProblem) return { topic: "", description: "" };
    try {
      const desc = activeProblem.description.trim();
      if (desc.startsWith("{")) {
        const parsed = JSON.parse(desc);
        return {
          topic: parsed.topic || "Coding Challenge",
          description: parsed.description || desc,
        };
      }
    } catch {
      // ignore JSON parse error
    }
    return {
      topic: activeProblem.tags?.[0] || "Coding Practice",
      description: activeProblem.description,
    };
  }, [activeProblem]);

  // Separate problems into Coding Tests vs Daily Practice
  const dynamicTestsList = useMemo(() => {
    return practiceProblems.filter((p) => {
      const isTest = (p as any).isTest || p.tags.includes("Coding Test") || p.title.toLowerCase().includes("test") || p.title.toLowerCase().includes("exam");
      return isTest;
    });
  }, [practiceProblems]);

  const dynamicPracticeList = useMemo(() => {
    return practiceProblems.filter((p) => {
      const isTest = (p as any).isTest || p.tags.includes("Coding Test") || p.title.toLowerCase().includes("test") || p.title.toLowerCase().includes("exam");
      return !isTest;
    });
  }, [practiceProblems]);

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

  const langColors: Record<string, { bg: string; icon: string; glow: string; border: string; desc: string; text: string }> = {
    javascript: { bg: "from-yellow-400 to-amber-500",   icon: "JS", glow: "shadow-amber-500/20 hover:shadow-amber-500/40", border: "border-amber-100 hover:border-amber-400/40", desc: "Web & Fullstack Apps", text: "text-amber-600" },
    python:     { bg: "from-blue-500 to-sky-400",       icon: "PY", glow: "shadow-blue-500/20 hover:shadow-blue-500/40", border: "border-blue-100 hover:border-blue-400/40",   desc: "Data Science & AI Scripts", text: "text-blue-600" },
    java:       { bg: "from-red-500 to-orange-400",     icon: "JV", glow: "shadow-red-500/20 hover:shadow-red-500/40",   border: "border-red-100 hover:border-red-400/40",    desc: "OOPs & Enterprise Systems", text: "text-red-500" },
    cpp:        { bg: "from-violet-600 to-indigo-500",  icon: "C++", glow: "shadow-violet-500/20 hover:shadow-violet-500/40", border: "border-violet-100 hover:border-violet-400/40", desc: "Competitive Coding & Core Dev", text: "text-violet-650" },
  };

  if (!selectedLanguage) {
    return (
      <div className="relative overflow-hidden px-4 py-16 md:px-8 animate-in fade-in duration-700">
        
        {/* Glowing Background Decorative Blobs */}
        <div className="pointer-events-none absolute -left-10 top-1/4 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-1/4 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center space-y-10">
          
          {/* Centered Premium Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 border border-violet-150 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-violet-700">
              ⚡ SELECT YOUR ARENA
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Coding <span className="text-[#6c5ce7]">Arena</span>
            </h1>
            <p className="text-sm font-semibold text-slate-400 max-w-md mx-auto leading-relaxed">
              Select your preferred programming language to initialize the virtual workspace and start solving challenges.
            </p>
          </div>

          {/* 4 Language Selection Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-3xl mx-auto pt-4">
            {languages.map((item) => {
              const lc = langColors[item.key];
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => { setSelectedLanguage(item.key); setLocation("/coding-practice"); }}
                  className={`group relative overflow-hidden rounded-[2.25rem] bg-white/90 backdrop-blur-md p-6 text-center border ${lc.border} shadow-sm ${lc.glow} transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] focus:outline-none flex flex-col items-center justify-between h-56 cursor-pointer`}
                >
                  {/* Glowing dynamic gradient icon badge */}
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${lc.bg} text-sm font-black text-white shadow-md transform transition-transform group-hover:scale-110 duration-300`}>
                    {lc.icon}
                  </div>
                  
                  <div className="w-full space-y-1.5">
                    <h2 className="text-base font-black text-slate-800 transition-colors">{item.label}</h2>
                    <p className="text-[10px] font-semibold text-slate-400 leading-normal line-clamp-2 px-1">
                      {lc.desc}
                    </p>
                  </div>

                  <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${lc.text} group-hover:translate-x-1 transition-transform`}>
                    Enter Arena <span>→</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (!activeProblem) {
    const listToRender = activeTab === "test" ? dynamicTestsList : dynamicPracticeList;

    return (
      <div className="px-4 py-6 md:px-8 animate-in fade-in duration-500">
        <div className="mx-auto max-w-[1400px] space-y-6">

          {/* ── Title and Config Row ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Coding Practice</h1>
              <p className="text-xs font-semibold text-slate-400 mt-1">Solve coding challenges, run code, and track your metrics.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-650 shadow-sm">
                Language: {language?.label}
              </span>
              <button
                type="button"
                onClick={() => setSelectedLanguage("")}
                className="rounded-2xl bg-[#6c5ce7] px-4 py-2.5 text-xs font-black text-white hover:bg-[#584ac2] shadow-sm transition"
              >
                Change Language
              </button>
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "Solved Count",   value: solvedIds.length,  txt: "text-[#6c5ce7]" },
              { label: "Daily Practice", value: dynamicPracticeList.length, txt: "text-blue-600" },
              { label: "Coding Tests",   value: dynamicTestsList.length,   txt: "text-rose-500" },
              { label: "Streak Status",  value: "5 days",          txt: "text-amber-500" },
            ].map(({ label, value, txt }) => (
              <div key={label} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col justify-center min-h-[100px]">
                <span className={`text-4xl font-black ${txt}`}>{value}</span>
                <span className="text-xs font-bold text-slate-400 mt-1">{label}</span>
              </div>
            ))}
          </div>

          {/* ── Tabs and Main Area ── */}
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            
            <div className="space-y-6">
              {/* Tabs selector */}
              <div className="flex justify-between items-center pb-1">
                <div className="flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                  <button
                    onClick={() => setActiveTab("practice")}
                    className={`rounded-full px-5 py-2 text-xs font-black transition-all ${
                      activeTab === "practice" ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Daily Practice ({dynamicPracticeList.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("test")}
                    className={`rounded-full px-5 py-2 text-xs font-black transition-all ${
                      activeTab === "test" ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Coding Tests ({dynamicTestsList.length})
                  </button>
                </div>
              </div>

              {/* LeetCode-style Problem Table */}
              <div className="overflow-hidden rounded-[2rem] bg-white border border-slate-100/60 shadow-sm">
                <div className="grid grid-cols-[50px_1fr_120px_100px] items-center px-6 py-4 bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <span>Status</span>
                  <span>Title</span>
                  <span>Difficulty</span>
                  <span className="text-center">Action</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {listToRender.map((problem) => {
                    const solved = solvedIds.includes(problem.id);
                    const diffColors = 
                      problem.difficulty === "Easy" ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
                      problem.difficulty === "Medium" ? "text-amber-600 bg-amber-50 border-amber-100" :
                      "text-rose-600 bg-rose-50 border-rose-100";

                    return (
                      <div key={problem.id} className="grid grid-cols-[50px_1fr_120px_100px] items-center px-6 py-4.5 transition hover:bg-slate-50/40">
                        {/* Status Check */}
                        <div className="flex items-center">
                          {solved ? (
                            <span className="text-emerald-500 text-base font-black">✓</span>
                          ) : (
                            <span className="text-slate-300 text-[9px] font-black">•</span>
                          )}
                        </div>

                        {/* Title and details */}
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-800">{problem.title}</h3>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-400">
                            <span className="text-indigo-500">{problem.acceptance}</span>
                            <span>·</span>
                            <span>{problem.tags.join(", ")}</span>
                          </div>
                        </div>

                        {/* Difficulty */}
                        <div>
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${diffColors}`}>
                            {problem.difficulty}
                          </span>
                        </div>

                        {/* Solve Button */}
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => setLocation(`/coding-practice/${problem.id}`)}
                            className="rounded-xl border border-violet-650 px-4 py-1.5 text-xs font-black text-[#6c5ce7] hover:bg-[#6c5ce7] hover:text-white shadow-sm transition"
                          >
                            Solve
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {listToRender.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      <p className="text-sm font-extrabold">No questions available under this category.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-[2rem] bg-gradient-to-br from-indigo-600 to-violet-650 p-6 text-white shadow-sm relative overflow-hidden">
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
                <p className="text-[10px] font-black uppercase tracking-wider text-indigo-200">Practice Set</p>
                <h2 className="mt-2 text-base font-extrabold">Beginner Friendly</h2>
                <p className="mt-1.5 text-xs font-semibold text-indigo-50 leading-relaxed">
                  {practiceProblems.length} easy questions including faculty assigned tasks.
                </p>
              </div>

              <div className="rounded-[2.5rem] border border-slate-100/50 bg-white p-8 shadow-sm">
                <h2 className="mb-6 flex items-center gap-3 text-lg font-black text-slate-800">
                  <Trophy className="h-6 w-6 text-amber-500" />
                  Coding Leaderboard
                </h2>
                <div className="space-y-4">
                  {leaderboard.map((item) => (
                    <div key={item.rank} className="flex items-center gap-4 rounded-3xl bg-slate-50 p-4 border border-slate-100/50 transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-800 text-base font-black text-white shadow-sm">
                        #{item.rank}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-slate-900">{item.name}</p>
                        <p className="text-xs font-bold text-slate-500 mt-1">
                          <span className="text-violet-600">{item.solved} solved</span> • {item.score} pts
                        </p>
                      </div>
                      <span className="flex items-center gap-1.5 text-sm font-black text-rose-600 shrink-0 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
                        <Flame className="h-4 w-4 fill-rose-100 text-rose-500" />
                        {item.streak}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[720px] flex-col overflow-hidden bg-[#eef2f6] animate-in fade-in duration-300">
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
        
        {/* Left Side details */}
        <section className="h-full overflow-y-auto rounded-l-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h1 className="text-2xl font-extrabold text-slate-950">{activeProblem.title}</h1>
            <span className="rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-black uppercase text-indigo-700 tracking-wider">
              {parsedDescription.topic}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-5 text-xs font-black text-slate-400">
            <span>DIFFICULTY: <b className="text-indigo-600 uppercase">{activeProblem.difficulty}</b></span>
            <span>ACCURACY: <b className="text-slate-600">{activeProblem.acceptance}</b></span>
            <span>POINTS: <b className="text-slate-600">2</b></span>
          </div>
          <div className="my-5 h-px bg-slate-200" />
          <p className="text-sm font-semibold leading-relaxed text-slate-700">{parsedDescription.description}</p>

          <div className="mt-7 space-y-5">
            {activeProblem.examples.map((example, index) => (
              <div key={index}>
                <h3 className="mb-2 text-sm font-extrabold text-slate-900">Example {index + 1}:</h3>
                <div className="rounded-xl border border-slate-200 bg-slate-55/40 p-4 text-xs leading-normal text-slate-700 font-semibold space-y-1">
                  <p><b>Input:</b> {example.input}</p>
                  <p><b>Output:</b> {example.output}</p>
                  <p><b>Explanation:</b> {example.explanation}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            <h3 className="mb-3 text-sm font-extrabold text-slate-900">Constraints:</h3>
            <div className="space-y-2">
              {activeProblem.constraints.map((item) => (
                <p key={item} className="font-mono text-xs text-slate-650">{item}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Right Side Editor */}
        <section className="flex h-full min-h-0 flex-col rounded-r-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
              <Code2 className="h-4 w-4 text-indigo-600" />
              Code Editor
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
              <pre className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 font-mono">Input: {activeProblem.stdin}</pre>
              <pre className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 font-mono">Expected: {activeProblem.expectedOutput}</pre>
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
                <pre className="whitespace-pre-wrap rounded-lg bg-white/70 p-2 font-mono text-xs">Your Output: {currentRun.output}</pre>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
