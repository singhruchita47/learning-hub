import { useEffect, useState } from "react";
import { CheckSquare, Code2, Database, Send, Sparkles, UploadCloud, Loader, Eye, X } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";
import { uploadToCloudinary } from "@/lib/cloudinary";
import generatedQuestions from "@/services/coding_questions.json";
import graphQuestions from "@/services/graph_coding_questions.json";
import leetcodeQuestions from "@/services/scraped_leetcode.json";

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
  imageUrl?: string;
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
  imageUrl?: string;
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

export default function FacultyCodingQuestions({ isAdmin = false }: { isAdmin?: boolean }) {
  const [questions, setQuestions] = useState<CodingQuestion[]>([]);
  const [codingBank, setCodingBank] = useState<BankQuestion[]>(localCodingBank);
  const [selectedBankIds, setSelectedBankIds] = useState<string[]>([]);
  const [openPanel, setOpenPanel] = useState<"bank" | "create" | "ai" | "created" | null>(null);
  const [aiTopic, setAiTopic] = useState("");
  const [aiDifficulty, setAiDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [aiPreview, setAiPreview] = useState<BankQuestion | null>(null);
  const [bankQuestionType, setBankQuestionType] = useState<"Practice Set" | "Coding Test">("Practice Set");
  const [aiQuestionType, setAiQuestionType] = useState<"Practice Set" | "Coding Test">("Practice Set");
  const [form, setForm] = useState({
    title: "",
    difficulty: "Easy",
    description: "",
    inputTestCase: "",
    expectedOutput: "",
    starterCode,
    imageUrl: "",
    questionType: "Practice Set" as "Practice Set" | "Coding Test",
  });
  const [status, setStatus] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [topicFilter, setTopicFilter] = useState("All");
  const [previewQuestion, setPreviewQuestion] = useState<BankQuestion | null>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    setStatus("Uploading image...");
    try {
      const secureUrl = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, imageUrl: secureUrl }));
      setStatus("Image uploaded successfully!");
    } catch {
      setStatus("Image upload failed. Please try again or paste a URL.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function loadQuestions() {
    try {
      const response = await fetch(`${API_BASE}/coding-questions`);
      if (!response.ok) throw new Error("API unavailable");
      const data = await response.json() as { codingQuestions?: CodingQuestion[] };
      const apiQuestions = data.codingQuestions ?? [];
      const localQuestions = JSON.parse(localStorage.getItem('local_coding_questions') || '[]');
      setQuestions([...localQuestions, ...apiQuestions]);
    } catch {
      const existing = JSON.parse(localStorage.getItem('local_coding_questions') || '[]');
      setQuestions(existing);
      setStatus("Backend offline: loading questions from local storage.");
    }
  }

  async function loadRemoteCodingBank() {
    try {
      const response = await fetch(CODING_BANK_API);
      if (!response.ok) throw new Error("Question bank API unavailable");
      const data = await response.json();
      const remoteQuestions = listFromApi(data).slice(0, 50).map(mapRemoteBankQuestion);
      
      const combinedBank = [...leetcodeQuestions as BankQuestion[], ...remoteQuestions, ...generatedQuestions as BankQuestion[], ...graphQuestions as BankQuestion[]];
      
      setCodingBank(combinedBank);
      setSelectedBankIds([]);
      setStatus(`${combinedBank.length} JavaScript coding questions available in the question bank.`);
    } catch {
      const fallbackBank = [...leetcodeQuestions as BankQuestion[], ...localCodingBank, ...generatedQuestions as BankQuestion[], ...graphQuestions as BankQuestion[]];
      setCodingBank(fallbackBank);
      setStatus(`Successfully loaded ${fallbackBank.length} JavaScript coding questions from local databank.`);
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
    imageUrl?: string;
    questionType?: string;
  }) {
    const user = (() => {
      try {
        const saved = localStorage.getItem("learningHubUser");
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    })();
    const facultyId = user?.email ?? user?.id ?? "faculty-demo";

    try {
      const response = await fetch(`${API_BASE}/coding-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          questionType: payload.questionType ?? "Practice Set",
          facultyId,
        }),
      });
      if (!response.ok) throw new Error("Unable to save");
      return response.json() as Promise<{ codingQuestion: CodingQuestion }>;
    } catch {
      const offlineQuestion = {
        _id: "local-" + Date.now() + Math.floor(Math.random() * 1000),
        ...payload,
        questionType: payload.questionType ?? "Practice Set",
        facultyId,
        createdAt: new Date().toISOString()
      } as CodingQuestion;
      const existing = JSON.parse(localStorage.getItem('local_coding_questions') || '[]');
      localStorage.setItem('local_coding_questions', JSON.stringify([offlineQuestion, ...existing]));
      return { codingQuestion: offlineQuestion };
    }
  }

  async function createQuestion() {
    if (!form.title.trim() || !form.description.trim() || !form.inputTestCase.trim() || !form.expectedOutput.trim()) {
      setStatus("Please fill title, description, input testcase, and expected output.");
      return;
    }

    try {
      const data = await saveQuestion(form);
      setQuestions((current) => [data.codingQuestion, ...current]);
      setForm({ title: "", difficulty: "Easy", description: "", inputTestCase: "", expectedOutput: "", starterCode, imageUrl: "", questionType: "Practice Set" });
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
            imageUrl: question.imageUrl,
            questionType: bankQuestionType,
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
        imageUrl: aiPreview.imageUrl,
        questionType: aiQuestionType,
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
        {!isAdmin && (
          <section className="mb-6 rounded-[2rem] border border-[#d8c8ff] bg-gradient-to-br from-[#f7f2ff]/95 via-[#eee7ff]/90 to-white p-7 shadow-xl shadow-violet-200/40">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-600">Coding practice builder</p>
            <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-950">Create Coding Question</h1>
                <p className="mt-2 text-sm font-bold text-slate-600">Add easy coding problems with sample input/output and starter code.</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
                <Code2 className="h-7 w-7" />
              </div>
            </div>
          </section>
        )}

        {openPanel === null && (
        <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Card 1: Question Bank (Violet Gradient & Glow) */}
          <button
            type="button"
            onClick={() => setOpenPanel("bank")}
            className="group relative text-left aspect-square rounded-[2.25rem] border border-violet-100/80 bg-gradient-to-br from-white via-white to-violet-50/20 p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-violet-100/50 hover:border-violet-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Background design blob */}
            <div className="pointer-events-none absolute -right-8 -bottom-8 h-20 w-20 rounded-full bg-violet-200/10 blur-xl group-hover:bg-violet-300/25 transition duration-300" />
            
            <div className="flex w-full items-start justify-between relative z-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 border border-violet-100/60 shadow-sm group-hover:scale-110 transition duration-300">
                <CheckSquare className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[9px] font-black text-violet-700 border border-violet-150/30 uppercase tracking-wider">
                {selectedBankIds.length} selected
              </span>
            </div>

            <div className="mt-4 flex-1 flex flex-col justify-end relative z-10">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-violet-500">Select questions</p>
              <h2 className="mt-1 text-base font-black text-slate-800 leading-snug group-hover:text-violet-650 transition-colors">Question Bank</h2>
              <p className="mt-1.5 text-xs font-semibold text-slate-400 leading-relaxed line-clamp-3">
                Choose from {codingBank.length} ready-made JavaScript coding questions and publish them instantly.
              </p>
              <span className="mt-2 text-[10px] font-black text-violet-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Open Bank <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </button>

          {/* Card 2: Custom Coding Question (Indigo Gradient & Glow) */}
          <button
            type="button"
            onClick={() => setOpenPanel("create")}
            className="group relative text-left aspect-square rounded-[2.25rem] border border-indigo-100/80 bg-gradient-to-br from-white via-white to-indigo-50/20 p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Background design blob */}
            <div className="pointer-events-none absolute -right-8 -bottom-8 h-20 w-20 rounded-full bg-indigo-200/10 blur-xl group-hover:bg-indigo-300/25 transition duration-300" />

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100/60 shadow-sm group-hover:scale-110 transition duration-300 relative z-10">
              <Code2 className="h-5 w-5" />
            </div>

            <div className="mt-4 flex-1 flex flex-col justify-end relative z-10">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-indigo-550">Create coding test</p>
              <h2 className="mt-1 text-base font-black text-slate-800 leading-snug group-hover:text-indigo-650 transition-colors">Custom Question</h2>
              <p className="mt-1.5 text-xs font-semibold text-slate-400 leading-relaxed line-clamp-3">
                Create your own custom coding problem statement, test cases, and starter code editor environment.
              </p>
              <span className="mt-2 text-[10px] font-black text-indigo-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Create Now <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </button>

          {/* Card 3: Generate Question With AI (Fuchsia Gradient & Glow) */}
          <button
            type="button"
            onClick={() => setOpenPanel("ai")}
            className="group relative text-left aspect-square rounded-[2.25rem] border border-fuchsia-100/80 bg-gradient-to-br from-white via-white to-fuchsia-50/20 p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-fuchsia-100/50 hover:border-fuchsia-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Background design blob */}
            <div className="pointer-events-none absolute -right-8 -bottom-8 h-20 w-20 rounded-full bg-fuchsia-200/10 blur-xl group-hover:bg-fuchsia-300/25 transition duration-300" />

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-100/60 shadow-sm group-hover:scale-110 transition duration-300 relative z-10">
              <Sparkles className="h-5 w-5" />
            </div>

            <div className="mt-4 flex-1 flex flex-col justify-end relative z-10">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-fuchsia-550">AI assistant</p>
              <h2 className="mt-1 text-base font-black text-slate-800 leading-snug group-hover:text-fuchsia-650 transition-colors">Generate Question</h2>
              <p className="mt-1.5 text-xs font-semibold text-slate-400 leading-relaxed line-clamp-3">
                Enter topic instructions and let the AI generate customized programming problems with test cases.
              </p>
              <span className="mt-2 text-[10px] font-black text-fuchsia-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Generate <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </button>

          {/* Card 4: Created Questions Feed (Sky Gradient & Glow - PLACED LAST AS REQUESTED) */}
          <button
            type="button"
            onClick={() => setOpenPanel("created")}
            className="group relative text-left aspect-square rounded-[2.25rem] border border-sky-100/80 bg-gradient-to-br from-white via-white to-sky-50/20 p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-sky-100/50 hover:border-sky-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Background design blob */}
            <div className="pointer-events-none absolute -right-8 -bottom-8 h-20 w-20 rounded-full bg-sky-200/10 blur-xl group-hover:bg-sky-300/25 transition duration-300" />
            
            <div className="flex w-full items-start justify-between relative z-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100/60 shadow-sm group-hover:scale-110 transition duration-300">
                <Database className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[9px] font-black text-sky-700 border border-sky-150/30 uppercase tracking-wider">
                {questions.length} Live
              </span>
            </div>

            <div className="mt-4 flex-1 flex flex-col justify-end relative z-10">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-sky-550">Published Feed</p>
              <h2 className="mt-1 text-base font-black text-slate-800 leading-snug group-hover:text-sky-650 transition-colors">Created Questions</h2>
              <p className="mt-1.5 text-xs font-semibold text-slate-400 leading-relaxed line-clamp-3">
                Review, filter and track coding questions already published to student-side Practice.
              </p>
              <span className="mt-2 text-[10px] font-black text-sky-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Review Feed <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </span>
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
                <div className="flex items-center gap-2 rounded-2xl border border-violet-100 bg-white px-3 py-2 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">Topic:</span>
                  <select
                    value={topicFilter}
                    onChange={(e) => setTopicFilter(e.target.value)}
                    className="bg-transparent text-xs font-bold text-violet-700 outline-none cursor-pointer"
                  >
                    <option value="All">All Topics</option>
                    <option value="LeetCode">LeetCode (Scraped)</option>
                    <option value="Linear Regression">Linear Regression</option>
                    <option value="Numpy">NumPy</option>
                    <option value="Pandas">Pandas</option>
                    <option value="Graph">Graph Data Structures</option>
                  </select>
                </div>
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

                {/* ── Assign As dropdown — moved to header ── */}
                <div className="flex items-center gap-2 rounded-2xl border border-violet-100 bg-white px-3 py-2 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">Assign As:</span>
                  <select
                    value={bankQuestionType}
                    onChange={(e) => setBankQuestionType(e.target.value as "Practice Set" | "Coding Test")}
                    className="bg-transparent text-xs font-bold text-violet-700 outline-none cursor-pointer"
                  >
                    <option value="Practice Set">📘 Practice Set</option>
                    <option value="Coding Test">🧪 Coding Test</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={publishSelectedBankQuestions}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 text-xs font-black text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 disabled:bg-slate-300"
                  disabled={selectedBankIds.length === 0}
                >
                  <Send className="h-4 w-4" />
                  Publish as {bankQuestionType}
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-[560px] overflow-y-auto bg-slate-50/70 p-5 [scrollbar-width:thin]">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {codingBank.filter(q => {
              if (topicFilter === "All") return true;
              if (topicFilter === "LeetCode") return q.id.startsWith("leetcode-");
              return q.title.toLowerCase().includes(topicFilter.toLowerCase());
            }).map((question, index) => {
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
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPreviewQuestion(question);
                        }}
                        className="rounded-full p-2 text-slate-400 hover:bg-violet-100 hover:text-violet-700 transition"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleBankQuestion(question.id)}
                        className="h-5 w-5 accent-violet-600"
                      />
                    </div>
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

          <div className="flex items-center justify-between border-t border-violet-100 bg-white px-5 py-3">
            <p className="text-xs font-semibold text-slate-400">
              💡 Tip: select questions above, choose type in header, then publish.
            </p>
          </div>
        </section>
      )}

      {openPanel === "create" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_450px] text-left">
          
          {/* ── Left Column: Create Form Box (Compact) ── */}
          <section className="rounded-[2rem] border border-slate-150 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
                <button
                  type="button"
                  onClick={() => setOpenPanel(null)}
                  className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-black text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                >
                  ← Back to tools
                </button>
                <h2 className="text-lg font-black text-slate-805 text-slate-800">Question Details</h2>
              </div>

              <div className="grid gap-4">
                
                {/* Title */}
                <input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Question title"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold outline-none focus:border-violet-300 focus:bg-white transition"
                />

                {/* Difficulty & Type Selection */}
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Difficulty:
                    <select
                      value={form.difficulty}
                      onChange={(event) => setForm((current) => ({ ...current, difficulty: event.target.value }))}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none focus:border-violet-300 focus:bg-white transition cursor-pointer"
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </label>

                  {/* Question Type selection dropdown as requested */}
                  <label className="grid gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Assign To:
                    <select
                      value={form.questionType}
                      onChange={(event) => setForm((current) => ({ ...current, questionType: event.target.value as "Practice Set" | "Coding Test" }))}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none focus:border-violet-300 focus:bg-white transition cursor-pointer"
                    >
                      <option value="Practice Set">Practice Set</option>
                      <option value="Coding Test">Coding Test</option>
                    </select>
                  </label>
                </div>

                {/* Description */}
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Problem description / statement"
                  rows={3}
                  className="resize-none w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-bold outline-none focus:border-violet-300 focus:bg-white transition"
                />

                {/* Optional Image URL or Upload */}
                <div className="flex items-center gap-3">
                  <input
                    value={form.imageUrl}
                    onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
                    placeholder="Optional: Image URL (diagram/chart)"
                    className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold outline-none focus:border-violet-300 focus:bg-white transition"
                  />
                  <label className={`flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-600 transition hover:bg-slate-100 ${isUploadingImage ? "opacity-50 pointer-events-none" : ""}`}>
                    {isUploadingImage ? <Loader className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                    {isUploadingImage ? "Uploading..." : "Upload Image"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploadingImage} />
                  </label>
                </div>

                {/* Testcases */}
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Input Test Case:
                    <textarea
                      value={form.inputTestCase}
                      onChange={(event) => setForm((current) => ({ ...current, inputTestCase: event.target.value }))}
                      placeholder="e.g. 5 10"
                      rows={2}
                      className="resize-none font-mono w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold outline-none focus:border-violet-300 focus:bg-white transition"
                    />
                  </label>
                  <label className="grid gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Expected Output:
                    <textarea
                      value={form.expectedOutput}
                      onChange={(event) => setForm((current) => ({ ...current, expectedOutput: event.target.value }))}
                      placeholder="e.g. 15"
                      rows={2}
                      className="resize-none font-mono w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold outline-none focus:border-violet-300 focus:bg-white transition"
                    />
                  </label>
                </div>

                {/* Starter Code */}
                <label className="grid gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Starter Code Template:
                  <textarea
                    value={form.starterCode}
                    onChange={(event) => setForm((current) => ({ ...current, starterCode: event.target.value }))}
                    placeholder="Starter code snippet..."
                    rows={4}
                    className="resize-none font-mono w-full rounded-xl border border-slate-200 bg-slate-950 p-4 text-xs font-semibold text-slate-200 outline-none focus:ring-2 focus:ring-violet-300 transition"
                  />
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={createQuestion}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 text-xs font-black text-white hover:bg-violet-700 shadow-md transition cursor-pointer"
            >
              <Send className="h-4 w-4" />
              Save Coding Question
            </button>
          </section>

          {/* ── Right Column: Live Coding Question Preview Panel ── */}
          <section className="rounded-[2rem] border border-slate-150 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-violet-500 animate-pulse" />
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-450">Live IDE Preview</h2>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-black border uppercase tracking-wider ${
                  form.questionType === "Coding Test" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-sky-50 text-sky-600 border-sky-100"
                }`}>
                  {form.questionType || "Practice Set"}
                </span>
              </div>

              {/* simulated card view */}
              <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-black border uppercase tracking-wider ${
                    form.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                    form.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border-amber-100" :
                    "bg-rose-50 text-rose-700 border-rose-100"
                  }`}>
                    {form.difficulty || "Easy"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    💻 JavaScript IDE
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-800 leading-snug truncate">
                    {form.title || "Untitled Coding Question"}
                  </h3>
                  <p className="mt-2 text-xs font-semibold text-slate-500 leading-relaxed whitespace-pre-wrap min-h-[60px] max-h-[120px] overflow-y-auto">
                    {form.description || "Describe the programming challenge instructions here..."}
                  </p>
                  {form.imageUrl && (
                    <img src={form.imageUrl} alt="Problem visual" className="mt-4 max-h-40 w-auto rounded-xl border border-slate-200 object-cover shadow-sm" />
                  )}
                </div>

                {/* Testcases row */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100 min-w-0">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Sample Input</span>
                    <code className="block mt-0.5 font-mono text-[10px] font-bold truncate text-slate-655">{form.inputTestCase || "—"}</code>
                  </div>
                  <div className="rounded-xl bg-emerald-50/40 p-2.5 border border-emerald-100/30 min-w-0">
                    <span className="text-[9px] font-black uppercase text-emerald-600 tracking-wider">Expected Output</span>
                    <code className="block mt-0.5 font-mono text-[10px] font-bold truncate text-emerald-700">{form.expectedOutput || "—"}</code>
                  </div>
                </div>

                {/* Code Editor mockup */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Editor Starter File</span>
                  <div className="rounded-xl overflow-hidden border border-slate-900 bg-slate-950 p-3.5 relative">
                    <div className="absolute right-3 top-3 flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="h-2 w-2 rounded-full bg-yellow-500" />
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                    </div>
                    <pre className="font-mono text-[10.5px] font-semibold text-slate-350 overflow-x-auto min-h-[60px] max-h-[100px] text-left [scrollbar-width:thin] text-slate-300 leading-relaxed">
                      {form.starterCode || "// editor template"}
                    </pre>
                  </div>
                </div>

              </div>

            </div>

            <div className="text-[10px] font-semibold text-slate-400 text-center mt-6">
              This preview matches the student-facing compiler workspace interface format.
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

                {/* ── Assign As: Practice Set or Coding Test ── */}
                <label className="mt-4 grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Assign As</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(["Practice Set", "Coding Test"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAiQuestionType(opt)}
                        className={`flex h-11 items-center justify-center gap-1.5 rounded-2xl border text-xs font-black transition cursor-pointer ${
                          aiQuestionType === opt
                            ? opt === "Coding Test"
                              ? "border-rose-300 bg-rose-50 text-rose-700 shadow-sm"
                              : "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700 shadow-sm"
                            : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
                        }`}
                      >
                        {opt === "Practice Set" ? "📘" : "🧪"} {opt}
                      </button>
                    ))}
                  </div>
                </label>

                <button
                  type="button"
                  onClick={handleGenerateAiQuestion}
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-fuchsia-600 text-sm font-black text-white shadow-lg shadow-fuchsia-600/20 cursor-pointer hover:bg-fuchsia-700 transition"
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
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-black text-fuchsia-700">{aiPreview.difficulty}</span>
                          <span className={`rounded-full border px-3 py-1 text-xs font-black ${
                            aiQuestionType === "Coding Test"
                              ? "bg-rose-50 border-rose-200 text-rose-700"
                              : "bg-sky-50 border-sky-200 text-sky-700"
                          }`}>
                            {aiQuestionType === "Coding Test" ? "🧪" : "📘"} {aiQuestionType}
                          </span>
                        </div>
                        <h3 className="mt-3 text-2xl font-black text-slate-950">{aiPreview.title}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={publishAiQuestion}
                        className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-xs font-black text-white shadow-lg shadow-slate-900/10 transition hover:bg-fuchsia-700 cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                        Publish as {aiQuestionType}
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

      {/* Coding Bank Question Preview Modal */}
      {previewQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black text-indigo-700">
                    {previewQuestion.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900">{previewQuestion.title}</h2>
              </div>
              <button
                onClick={() => setPreviewQuestion(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto [scrollbar-width:thin] space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Description</p>
                <p className="text-sm font-bold text-slate-700 leading-relaxed whitespace-pre-wrap">{previewQuestion.description}</p>
              </div>

              {previewQuestion.imageUrl && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex justify-center">
                  <img src={previewQuestion.imageUrl} alt="Question Visual" className="max-h-[250px] w-auto rounded-lg shadow-sm" />
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Sample Input</p>
                  <pre className="font-mono text-sm font-bold text-slate-800 whitespace-pre-wrap">{previewQuestion.inputTestCase}</pre>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Expected Output</p>
                  <pre className="font-mono text-sm font-bold text-slate-800 whitespace-pre-wrap">{previewQuestion.expectedOutput}</pre>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Starter Code Template</p>
                <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 overflow-x-auto">
                  <pre className="font-mono text-xs font-medium text-emerald-400 whitespace-pre-wrap">{previewQuestion.starterCode}</pre>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 p-6 flex justify-end gap-3 bg-slate-50 rounded-b-[2rem]">
              <button
                onClick={() => setPreviewQuestion(null)}
                className="rounded-xl bg-white border border-slate-200 px-5 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50 transition"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  toggleBankQuestion(previewQuestion.id);
                  setPreviewQuestion(null);
                }}
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-black text-white hover:bg-violet-700 transition"
              >
                {selectedBankIds.includes(previewQuestion.id) ? "Deselect Question" : "Select Question"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
