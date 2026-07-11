import { useEffect, useState } from "react";
import { CheckSquare, Code2, Database, Send, Sparkles } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

const API_BASE = ACADEMIC_API_BASE;
const CODING_BANK_API = "https://api.jsonbin.io/v3/b/66ebfa4ae41b4d34e433145a?meta=false";

type CodingQuestion = {
  _id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  inputTestCase: string;
  expectedOutput: string;
  starterCode: string;
  createdAt: string;
};

const starterCode = `const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim();

// write your code here
`;

type BankQuestion = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  inputTestCase: string;
  expectedOutput: string;
  starterCode: string;
};

type RawBankQuestion = Record<string, unknown>;

const localQuestionTemplates = [
  ["Add Two Numbers", "Read two integers and print their sum.", "5 7", "12"],
  ["Largest of Three", "Read three integers and print the largest number.", "12 8 19", "19"],
  ["Even or Odd", "Read one integer and print Even or Odd.", "14", "Even"],
  ["Reverse String", "Read a string and print it in reverse order.", "react", "tcaer"],
  ["Count Vowels", "Read a string and print the number of vowels.", "education", "5"],
  ["Square of Number", "Read one integer and print its square.", "9", "81"],
  ["Positive or Negative", "Read one integer and print Positive, Negative, or Zero.", "-4", "Negative"],
  ["Print First Character", "Read a word and print its first character.", "javascript", "j"],
  ["Simple Interest", "Read principal, rate, time and print simple interest.", "1000 5 2", "100"],
  ["Area of Rectangle", "Read length and breadth and print rectangle area.", "8 6", "48"],
  ["Swap Two Numbers", "Read two numbers and print them in swapped order.", "3 9", "9 3"],
  ["Check Leap Year", "Read a year and print Leap Year or Not Leap Year.", "2024", "Leap Year"],
  ["Sum of Digits", "Read an integer and print sum of its digits.", "1234", "10"],
  ["Factorial", "Read a number and print its factorial.", "5", "120"],
  ["Multiplication Table", "Read a number and print first five multiples separated by space.", "3", "3 6 9 12 15"],
  ["Count Words", "Read a sentence and print number of words.", "learn javascript daily", "3"],
  ["Find Minimum", "Read three integers and print the smallest.", "4 9 2", "2"],
  ["Check Palindrome", "Read a word and print Palindrome or Not Palindrome.", "madam", "Palindrome"],
  ["Temperature Converter", "Read Celsius and print Fahrenheit.", "0", "32"],
  ["Array Sum", "Read numbers and print their sum.", "1 2 3 4 5", "15"],
  ["Average of Numbers", "Read three numbers and print their average.", "6 9 12", "9"],
  ["Last Character", "Read a word and print its last character.", "coding", "g"],
  ["Remove Spaces", "Read a sentence and print it without spaces.", "a b c d", "abcd"],
  ["Number Sign", "Read a number and print its sign.", "0", "Zero"],
  ["Power of Two", "Read n and print 2 raised to n.", "4", "16"],
];

const localCodingBank: BankQuestion[] = Array.from({ length: 50 }, (_, index) => {
  const template = localQuestionTemplates[index % localQuestionTemplates.length];
  const round = Math.floor(index / localQuestionTemplates.length) + 1;
  return {
    id: `local-js-${index + 1}`,
    title: `${template[0]}${round > 1 ? ` ${round}` : ""}`,
    difficulty: "Easy",
    description: template[1],
    inputTestCase: template[2],
    expectedOutput: template[3],
    starterCode,
  };
});

function textFrom(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function listFromApi(data: unknown): RawBankQuestion[] {
  if (Array.isArray(data)) return data as RawBankQuestion[];
  if (!data || typeof data !== "object") return [];

  const record = data as Record<string, unknown>;
  const candidates = [record.questions, record.data, record.items, record.problems, record.codingQuestions];
  const nestedRecord = record.record && typeof record.record === "object" ? record.record as Record<string, unknown> : null;
  if (nestedRecord) {
    candidates.push(nestedRecord.questions, nestedRecord.data, nestedRecord.items, nestedRecord.problems);
  }

  const firstArray = candidates.find(Array.isArray);
  return (firstArray ?? []) as RawBankQuestion[];
}

function normalizeDifficulty(value: unknown): "Easy" | "Medium" | "Hard" {
  const difficulty = textFrom(value, "Easy").toLowerCase();
  if (difficulty.includes("hard")) return "Hard";
  if (difficulty.includes("medium")) return "Medium";
  return "Easy";
}

function mapRemoteBankQuestion(item: RawBankQuestion, index: number): BankQuestion {
  const title = textFrom(
    item.title ?? item.name ?? item.questionTitle ?? item.problemTitle,
    `JavaScript Coding Question ${index + 1}`,
  );
  const description = textFrom(
    item.description ?? item.question ?? item.problem ?? item.statement ?? item.prompt,
    title,
  );

  return {
    id: textFrom(item.id ?? item._id ?? item.slug, `remote-coding-${index + 1}`),
    title,
    difficulty: normalizeDifficulty(item.difficulty ?? item.level),
    description,
    inputTestCase: textFrom(item.inputTestCase ?? item.input ?? item.sampleInput ?? item.stdin ?? item.testcase, "1 2"),
    expectedOutput: textFrom(item.expectedOutput ?? item.output ?? item.sampleOutput ?? item.stdout ?? item.answer, "3"),
    starterCode: textFrom(item.starterCode ?? item.boilerplate ?? item.code ?? item.template, starterCode),
  };
}

function generateAiQuestion(topic: string, difficulty: "Easy" | "Medium" | "Hard"): BankQuestion {
  const cleanTopic = topic.trim() || "arrays";
  const titleTopic = cleanTopic
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const topicKey = cleanTopic.toLowerCase();
  if (topicKey.includes("array")) {
    return {
      id: `ai-${Date.now()}`,
      title: `${titleTopic}: Sum of Elements`,
      difficulty,
      description: `Read an array of integers and print the sum of all elements. This problem checks basic ${cleanTopic} traversal and input handling.`,
      inputTestCase: "5\n1 2 3 4 5",
      expectedOutput: "15",
      starterCode: "const fs = require('fs');\nconst data = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\n\n// write your code here\n",
    };
  }
  if (topicKey.includes("string")) {
    return {
      id: `ai-${Date.now()}`,
      title: `${titleTopic}: Count Characters`,
      difficulty,
      description: `Read a string and print the total number of characters. This problem helps students practice ${cleanTopic} basics.`,
      inputTestCase: "learning",
      expectedOutput: "8",
      starterCode: "const fs = require('fs');\nconst text = fs.readFileSync(0, 'utf8').trim();\n\n// write your code here\n",
    };
  }
  if (topicKey.includes("loop")) {
    return {
      id: `ai-${Date.now()}`,
      title: `${titleTopic}: Print Series Sum`,
      difficulty,
      description: `Read n and print the sum from 1 to n. This problem tests loop control and arithmetic logic.`,
      inputTestCase: "10",
      expectedOutput: "55",
      starterCode: "const fs = require('fs');\nconst n = Number(fs.readFileSync(0, 'utf8').trim());\n\n// write your code here\n",
    };
  }

  return {
    id: `ai-${Date.now()}`,
    title: `${titleTopic}: Basic Practice`,
    difficulty,
    description: `Create a simple solution for ${cleanTopic}. Read two integers and print their combined result as a starter practice task.`,
    inputTestCase: "6 4",
    expectedOutput: "10",
    starterCode,
  };
}

export default function FacultyCodingQuestions() {
  const [questions, setQuestions] = useState<CodingQuestion[]>([]);
  const [codingBank, setCodingBank] = useState<BankQuestion[]>(localCodingBank);
  const [selectedBankIds, setSelectedBankIds] = useState<string[]>([]);
  const [openPanel, setOpenPanel] = useState<"bank" | "create" | "ai" | "created" | null>(null);
  const [aiTopic, setAiTopic] = useState("");
  const [aiDifficulty, setAiDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [aiPreview, setAiPreview] = useState<BankQuestion | null>(null);
  const [form, setForm] = useState({
    title: "",
    difficulty: "Easy",
    description: "",
    inputTestCase: "",
    expectedOutput: "",
    starterCode,
  });
  const [status, setStatus] = useState("");

  async function loadQuestions() {
    try {
      const response = await fetch(`${API_BASE}/coding-questions`);
      if (!response.ok) throw new Error("API unavailable");
      const data = await response.json() as { codingQuestions: CodingQuestion[] };
      setQuestions(data.codingQuestions);
    } catch {
      setStatus("Backend offline: questions will save when API server is running.");
    }
  }

  async function loadRemoteCodingBank() {
    try {
      const response = await fetch(CODING_BANK_API);
      if (!response.ok) throw new Error("Question bank API unavailable");
      const data = await response.json();
      const remoteQuestions = listFromApi(data).slice(0, 50).map(mapRemoteBankQuestion);
      if (remoteQuestions.length > 0) {
        setCodingBank(remoteQuestions);
        setSelectedBankIds([]);
        setStatus(`${remoteQuestions.length} JavaScript coding questions loaded from API.`);
      }
    } catch {
      setCodingBank(localCodingBank);
      setStatus("Remote coding bank unavailable, using 50 local JavaScript fallback questions.");
    }
  }

  useEffect(() => {
    void loadQuestions();
    void loadRemoteCodingBank();
  }, []);

  async function saveQuestion(payload: {
    title: string;
    difficulty: string;
    description: string;
    inputTestCase: string;
    expectedOutput: string;
    starterCode: string;
  }) {
    const response = await fetch(`${API_BASE}/coding-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, facultyId: "faculty-demo" }),
      });
    if (!response.ok) throw new Error("Unable to save");
    return response.json() as Promise<{ codingQuestion: CodingQuestion }>;
  }

  async function createQuestion() {
    if (!form.title.trim() || !form.description.trim() || !form.inputTestCase.trim() || !form.expectedOutput.trim()) {
      setStatus("Please fill title, description, input testcase, and expected output.");
      return;
    }

    try {
      const data = await saveQuestion(form);
      setQuestions((current) => [data.codingQuestion, ...current]);
      setForm({ title: "", difficulty: "Easy", description: "", inputTestCase: "", expectedOutput: "", starterCode });
      setStatus("Coding question saved and sent to student practice module.");
    } catch {
      setStatus("Backend offline: start API server to save coding questions in MongoDB.");
    }
  }

  function toggleBankQuestion(questionId: string) {
    setSelectedBankIds((current) =>
      current.includes(questionId) ? current.filter((id) => id !== questionId) : [...current, questionId],
    );
  }

  async function publishSelectedBankQuestions() {
    const selectedQuestions = codingBank.filter((question) => selectedBankIds.includes(question.id));

    if (selectedQuestions.length === 0) {
      setStatus("Select at least one bank question to publish.");
      return;
    }

    try {
      const saved = await Promise.all(
        selectedQuestions.map((question) =>
          saveQuestion({
            title: question.title,
            difficulty: question.difficulty,
            description: question.description,
            inputTestCase: question.inputTestCase,
            expectedOutput: question.expectedOutput,
            starterCode: question.starterCode,
          }),
        ),
      );
      setQuestions((current) => [...saved.map((item) => item.codingQuestion), ...current]);
      setSelectedBankIds([]);
      setStatus(`${saved.length} coding bank question${saved.length > 1 ? "s" : ""} published to student Coding Practice.`);
    } catch {
      setStatus("Backend offline: selected bank questions could not be published.");
    }
  }

  function handleGenerateAiQuestion() {
    const generated = generateAiQuestion(aiTopic, aiDifficulty);
    setAiPreview(generated);
    setStatus("AI question preview generated. Review it and publish when ready.");
  }

  async function publishAiQuestion() {
    if (!aiPreview) {
      setStatus("Generate an AI question first.");
      return;
    }

    try {
      const data = await saveQuestion({
        title: aiPreview.title,
        difficulty: aiPreview.difficulty,
        description: aiPreview.description,
        inputTestCase: aiPreview.inputTestCase,
        expectedOutput: aiPreview.expectedOutput,
        starterCode: aiPreview.starterCode,
      });
      setQuestions((current) => [data.codingQuestion, ...current]);
      setStatus("AI generated question published to student Coding Practice.");
    } catch {
      setStatus("Backend offline: AI generated question could not be published.");
    }
  }

  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <section className="mb-6 rounded-[2rem] border border-[#d8c8ff] bg-gradient-to-br from-[#f7f2ff]/95 via-[#eee7ff]/90 to-white p-7 shadow-xl shadow-violet-200/40">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-600">Coding practice builder</p>
          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black text-slate-950">Create Coding Question</h1>
              <p className="mt-2 text-sm font-bold text-slate-600">Add easy coding problems with sample input/output and starter code.</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
              <Code2 className="h-7 w-7" />
            </div>
          </div>
        </section>

        {openPanel === null && (
        <div className="mb-6 grid gap-4 xl:grid-cols-4">
          <button
            type="button"
            onClick={() => setOpenPanel("bank")}
            className={`rounded-[1.75rem] border p-5 text-left shadow-lg transition ${
              openPanel === "bank"
                ? "border-violet-300 bg-white shadow-violet-100"
                : "border-slate-200 bg-white/80 shadow-slate-200/60 hover:border-violet-200"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  <CheckSquare className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">Select questions</p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">Question Bank</h2>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    Choose from {codingBank.length} JavaScript coding questions and publish selected questions.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                {selectedBankIds.length} selected
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setOpenPanel("create")}
            className={`rounded-[1.75rem] border p-5 text-left shadow-lg transition ${
              openPanel === "create"
                ? "border-indigo-300 bg-white shadow-indigo-100"
                : "border-slate-200 bg-white/80 shadow-slate-200/60 hover:border-indigo-200"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Code2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">Create coding test</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">Custom Coding Question</h2>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  Create your own problem statement, testcase, expected output, and starter code.
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setOpenPanel("created")}
            className={`rounded-[1.75rem] border p-5 text-left shadow-lg transition ${
              openPanel === "created"
                ? "border-sky-300 bg-white shadow-sky-100"
                : "border-slate-200 bg-white/80 shadow-slate-200/60 hover:border-sky-200"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">Published list</p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">Created Questions</h2>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    Review coding questions already sent to student Coding Practice.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">
                {questions.length} live
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setOpenPanel("ai")}
            className={`rounded-[1.75rem] border p-5 text-left shadow-lg transition ${
              openPanel === "ai"
                ? "border-fuchsia-300 bg-white shadow-fuchsia-100"
                : "border-slate-200 bg-white/80 shadow-slate-200/60 hover:border-fuchsia-200"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-600">AI generator</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">Generate Question</h2>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  Enter a topic and preview an AI-style coding problem with testcase.
                </p>
              </div>
            </div>
          </button>
        </div>
        )}

        {status && <p className="mb-6 rounded-2xl bg-violet-50 px-4 py-3 text-sm font-bold text-violet-700">{status}</p>}

        {openPanel === "bank" && (
        <section className="mb-6 overflow-hidden rounded-[2rem] border border-violet-100 bg-white shadow-xl shadow-violet-100/70">
          <div className="border-b border-violet-100 bg-gradient-to-br from-violet-50 via-indigo-50 to-white p-5">
            <button
              type="button"
              onClick={() => setOpenPanel(null)}
              className="mb-4 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-black text-violet-700 shadow-sm transition hover:bg-violet-50"
            >
              Back to coding tools
            </button>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
                  <CheckSquare className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">JavaScript bank</p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">Coding Question Bank</h2>
                  <p className="mt-1 max-w-2xl text-sm font-bold leading-6 text-slate-500">
                    Select ready-made API questions and publish them directly to student Coding Practice.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-violet-100 bg-white px-4 py-2 text-xs font-black text-violet-700 shadow-sm">
                  {selectedBankIds.length}/{codingBank.length} selected
                </span>
                <button
                  type="button"
                  onClick={loadRemoteCodingBank}
                  className="h-11 rounded-2xl border border-violet-200 bg-white px-4 text-xs font-black text-violet-700 shadow-sm transition hover:bg-violet-50"
                >
                  Reload API Bank
                </button>
                <button
                  type="button"
                  onClick={publishSelectedBankQuestions}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 text-xs font-black text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 disabled:bg-slate-300"
                  disabled={selectedBankIds.length === 0}
                >
                  <Send className="h-4 w-4" />
                  Publish Selected
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-[560px] overflow-y-auto bg-slate-50/70 p-5 [scrollbar-width:thin]">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {codingBank.map((question, index) => {
              const selected = selectedBankIds.includes(question.id);

              return (
                <label
                  key={question.id}
                  className={`group cursor-pointer rounded-2xl border p-4 transition ${
                    selected
                      ? "border-violet-300 bg-white shadow-lg shadow-violet-100"
                      : "border-slate-100 bg-white hover:border-violet-200 hover:shadow-md hover:shadow-slate-200/70"
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-violet-700">
                          Q{index + 1}
                        </span>
                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black text-indigo-700">
                          {question.difficulty}
                        </span>
                      </div>
                      <h3 className="line-clamp-1 text-sm font-black text-slate-950 group-hover:text-violet-700">{question.title}</h3>
                    </div>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleBankQuestion(question.id)}
                      className="mt-1 h-5 w-5 accent-violet-600"
                    />
                  </div>
                  <p className="line-clamp-2 min-h-12 text-xs font-bold leading-6 text-slate-600">{question.description}</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Input</p>
                      <pre className="mt-1 overflow-x-auto font-mono text-xs font-bold text-slate-700">{question.inputTestCase}</pre>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Output</p>
                      <pre className="mt-1 overflow-x-auto font-mono text-xs font-bold text-slate-700">{question.expectedOutput}</pre>
                    </div>
                  </div>
                </label>
              );
            })}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-violet-100 bg-white p-4 md:flex-row md:items-center md:justify-between">
            <p className="text-xs font-bold text-slate-500">
              Tip: selected questions are published to the student Coding Practice page.
            </p>
            <button
              type="button"
              onClick={publishSelectedBankQuestions}
              className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-xs font-black text-white shadow-lg shadow-slate-900/10 transition hover:bg-violet-700 disabled:bg-slate-300"
              disabled={selectedBankIds.length === 0}
            >
              <Send className="h-4 w-4" />
              Publish {selectedBankIds.length || ""} Selected
            </button>
          </div>
        </section>
        )}

        {openPanel === "create" && (
        <div className="grid gap-6">
          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
            <button
              type="button"
              onClick={() => setOpenPanel(null)}
              className="mb-4 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-black text-indigo-700 transition hover:bg-indigo-100"
            >
              Back to coding tools
            </button>
            <h2 className="mb-5 text-2xl font-black text-slate-950">Question Details</h2>
            <div className="grid gap-4">
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Question title"
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
              <select
                value={form.difficulty}
                onChange={(event) => setForm((current) => ({ ...current, difficulty: event.target.value }))}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Problem statement"
                rows={4}
                className="resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <textarea
                  value={form.inputTestCase}
                  onChange={(event) => setForm((current) => ({ ...current, inputTestCase: event.target.value }))}
                  placeholder="Input testcase"
                  rows={4}
                  className="resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />
                <textarea
                  value={form.expectedOutput}
                  onChange={(event) => setForm((current) => ({ ...current, expectedOutput: event.target.value }))}
                  placeholder="Expected output"
                  rows={4}
                  className="resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />
              </div>
              <textarea
                value={form.starterCode}
                onChange={(event) => setForm((current) => ({ ...current, starterCode: event.target.value }))}
                placeholder="Starter code"
                rows={7}
                className="resize-none rounded-2xl border border-slate-200 bg-slate-950 p-4 font-mono text-sm text-white outline-none focus:ring-4 focus:ring-violet-100"
              />
              <button
                type="button"
                onClick={createQuestion}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 text-sm font-black text-white shadow-lg shadow-violet-600/20"
              >
                <Send className="h-4 w-4" />
                Save Coding Question
              </button>
            </div>
          </section>
        </div>
        )}

        {openPanel === "ai" && (
          <section className="rounded-[2rem] border border-fuchsia-100 bg-white p-5 shadow-xl shadow-fuchsia-100/70">
            <button
              type="button"
              onClick={() => setOpenPanel(null)}
              className="mb-4 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-4 py-2 text-xs font-black text-fuchsia-700 transition hover:bg-fuchsia-100"
            >
              Back to coding tools
            </button>
            <div className="mb-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-600">AI coding test creator</p>
              <h2 className="mt-1 flex items-center gap-2 text-2xl font-black text-slate-950">
                <Sparkles className="h-6 w-6 text-fuchsia-600" />
                Generate Question With AI
              </h2>
              <p className="mt-1 text-sm font-bold text-slate-500">
                Topic do, preview check karo, phir publish karo. This uses a local generator now and can later connect to Gemini/OpenAI API.
              </p>
            </div>

            <div className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Topic</span>
                  <input
                    value={aiTopic}
                    onChange={(event) => setAiTopic(event.target.value)}
                    placeholder="Example: arrays, strings, loops"
                    className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
                  />
                </label>
                <label className="mt-4 grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Difficulty</span>
                  <select
                    value={aiDifficulty}
                    onChange={(event) => setAiDifficulty(event.target.value as "Easy" | "Medium" | "Hard")}
                    className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateAiQuestion}
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-fuchsia-600 text-sm font-black text-white shadow-lg shadow-fuchsia-600/20"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Preview
                </button>
              </div>

              <div className="rounded-3xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 via-white to-indigo-50 p-5">
                {aiPreview ? (
                  <div>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-black text-fuchsia-700">{aiPreview.difficulty}</span>
                        <h3 className="mt-3 text-2xl font-black text-slate-950">{aiPreview.title}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={publishAiQuestion}
                        className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-xs font-black text-white shadow-lg shadow-slate-900/10 transition hover:bg-fuchsia-700"
                      >
                        <Send className="h-4 w-4" />
                        Publish AI Question
                      </button>
                    </div>
                    <p className="text-sm font-bold leading-7 text-slate-600">{aiPreview.description}</p>
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Input testcase</p>
                        <pre className="mt-2 overflow-x-auto font-mono text-sm font-bold text-slate-800">{aiPreview.inputTestCase}</pre>
                      </div>
                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Expected output</p>
                        <pre className="mt-2 overflow-x-auto font-mono text-sm font-bold text-slate-800">{aiPreview.expectedOutput}</pre>
                      </div>
                    </div>
                    <pre className="mt-4 max-h-52 overflow-auto rounded-2xl bg-slate-950 p-4 font-mono text-xs text-white">{aiPreview.starterCode}</pre>
                  </div>
                ) : (
                  <div className="flex min-h-80 items-center justify-center rounded-3xl border border-dashed border-fuchsia-200 bg-white/70 p-8 text-center">
                    <div>
                      <Sparkles className="mx-auto h-10 w-10 text-fuchsia-500" />
                      <p className="mt-3 text-lg font-black text-slate-900">AI preview will appear here</p>
                      <p className="mt-1 text-sm font-bold text-slate-500">Enter topic and click Generate Preview.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {openPanel === "created" && (
          <section className="rounded-[2rem] border border-sky-100 bg-white p-5 shadow-xl shadow-sky-100/70">
            <button
              type="button"
              onClick={() => setOpenPanel(null)}
              className="mb-4 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-black text-sky-700 transition hover:bg-sky-100"
            >
              Back to coding tools
            </button>
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">Student practice feed</p>
                <h2 className="mt-1 flex items-center gap-2 text-2xl font-black text-slate-950">
                  <Database className="h-6 w-6 text-sky-600" />
                  Created Questions
                </h2>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  These questions are already available for students in Coding Practice.
                </p>
              </div>
              <button
                type="button"
                onClick={loadQuestions}
                className="h-11 rounded-2xl border border-sky-200 bg-sky-50 px-4 text-xs font-black text-sky-700 transition hover:bg-sky-100"
              >
                Refresh List
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {questions.length > 0 ? questions.map((question, index) => (
                <article key={question._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-white hover:shadow-md">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-sky-700">
                        Live Q{index + 1}
                      </span>
                      <h3 className="mt-3 line-clamp-1 text-base font-black text-slate-950">{question.title}</h3>
                    </div>
                    <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-black text-violet-700">{question.difficulty}</span>
                  </div>
                  <p className="line-clamp-3 min-h-16 text-sm font-bold leading-6 text-slate-500">{question.description}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Input</p>
                      <pre className="mt-1 overflow-x-auto font-mono text-xs font-bold text-slate-700">{question.inputTestCase}</pre>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Output</p>
                      <pre className="mt-1 overflow-x-auto font-mono text-xs font-bold text-slate-700">{question.expectedOutput}</pre>
                    </div>
                  </div>
                </article>
              )) : (
                <div className="col-span-full rounded-2xl border border-dashed border-sky-200 bg-sky-50/60 p-10 text-center">
                  <p className="text-sm font-black text-sky-800">No coding questions yet</p>
                  <p className="mt-1 text-xs font-bold text-sky-500">Publish from bank or create a custom question.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
