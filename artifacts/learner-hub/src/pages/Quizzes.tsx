import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, HelpCircle, Zap, ChevronRight, CheckCircle2 } from "lucide-react";
import { useLocation, useParams } from "wouter";
import Quiz from "@/components/Quiz";
import StudentLiveTestsPanel from "@/components/StudentLiveTestsPanel";

interface Question { q: string; opts: string[]; ans: number; }

const quizData = [
  {
    id: "1", title: "Data Structures Basics", course: "CS301", questions: 5, difficulty: "Easy", time: "8 mins",
    color: "#4F46E5", icon: "🌳", completed: false,
    qBank: [
      { q: "What is the time complexity of accessing an element in an array by index?", opts: ["O(n)", "O(log n)", "O(1)", "O(n²)"], ans: 2 },
      { q: "Which data structure uses LIFO (Last In First Out) order?", opts: ["Queue", "Stack", "Linked List", "Tree"], ans: 1 },
      { q: "What is the height of a balanced binary search tree with n nodes?", opts: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], ans: 1 },
      { q: "In a singly linked list, what does the last node point to?", opts: ["First node", "Itself", "null / None", "Previous node"], ans: 2 },
      { q: "Which traversal visits the root node first in a binary tree?", opts: ["Inorder", "Postorder", "Preorder", "Level-order"], ans: 2 },
    ] as Question[],
  },
  {
    id: "2", title: "Database MCQ", course: "CS302", questions: 5, difficulty: "Medium", time: "10 mins",
    color: "#0EA5E9", icon: "🗄️", completed: true,
    qBank: [
      { q: "What does SQL stand for?", opts: ["Structured Query Language", "Simple Query Language", "Standard Query Logic", "Structured Question Language"], ans: 0 },
      { q: "Which SQL clause is used to filter records?", opts: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"], ans: 2 },
      { q: "What is a primary key?", opts: ["A key that can be null", "A unique identifier for a record", "A foreign key reference", "A composite key"], ans: 1 },
      { q: "Which normal form eliminates transitive dependencies?", opts: ["1NF", "2NF", "3NF", "BCNF"], ans: 2 },
      { q: "What does JOIN do in SQL?", opts: ["Deletes tables", "Combines rows from two or more tables", "Creates a new table", "Filters duplicate rows"], ans: 1 },
    ] as Question[],
  },
  {
    id: "3", title: "Operating Systems Quiz", course: "CS303", questions: 5, difficulty: "Hard", time: "12 mins",
    color: "#10B981", icon: "💻", completed: false,
    qBank: [
      { q: "What is a deadlock?", opts: ["A fast process", "A condition where processes wait forever", "A type of memory leak", "A scheduling algorithm"], ans: 1 },
      { q: "Which scheduling algorithm gives CPU to shortest job first?", opts: ["FCFS", "Round Robin", "SJF", "Priority"], ans: 2 },
      { q: "What is virtual memory?", opts: ["Extra RAM", "Cache memory", "An abstraction that allows more memory than physical", "GPU memory"], ans: 2 },
      { q: "What does a semaphore control?", opts: ["CPU speed", "Access to shared resources", "Memory allocation", "Disk I/O"], ans: 1 },
      { q: "Which is NOT a process state?", opts: ["Running", "Blocked", "Ready", "Sleeping"], ans: 3 },
    ] as Question[],
  },
  {
    id: "4", title: "Networking Quiz", course: "CS304", questions: 5, difficulty: "Medium", time: "8 mins",
    color: "#6366F1", icon: "🌐", completed: false,
    qBank: [
      { q: "What does IP stand for?", opts: ["Internal Protocol", "Internet Protocol", "Interface Point", "Integrated Path"], ans: 1 },
      { q: "Which layer handles routing in the OSI model?", opts: ["Physical", "Data Link", "Network", "Transport"], ans: 2 },
      { q: "What port does HTTP use by default?", opts: ["443", "21", "80", "22"], ans: 2 },
      { q: "What does DNS do?", opts: ["Encrypts data", "Translates domain names to IP addresses", "Routes packets", "Manages firewalls"], ans: 1 },
      { q: "Which protocol is connection-oriented?", opts: ["UDP", "ICMP", "TCP", "ARP"], ans: 2 },
    ] as Question[],
  },
  {
    id: "5", title: "AI Fundamentals Quiz", course: "CS401", questions: 5, difficulty: "Hard", time: "12 mins",
    color: "#8B5CF6", icon: "🤖", completed: false,
    qBank: [
      { q: "What is supervised learning?", opts: ["Learning without labels", "Learning with labeled data", "Reinforcement learning", "Clustering"], ans: 1 },
      { q: "Which activation function maps values to 0 or 1?", opts: ["ReLU", "Tanh", "Sigmoid", "Softmax"], ans: 2 },
      { q: "What is overfitting?", opts: ["Model performs well on unseen data", "Model memorizes training data", "Model underfits training data", "Model has too few parameters"], ans: 1 },
      { q: "What does CNN stand for?", opts: ["Computed Neural Network", "Convolutional Neural Network", "Connected Neural Node", "Cyclic Neural Network"], ans: 1 },
      { q: "Which algorithm is used for classification and regression trees?", opts: ["K-Means", "PCA", "CART", "SVM"], ans: 2 },
    ] as Question[],
  },
];

const diffColor: Record<string, string> = {
  Easy:   "bg-emerald-100 text-emerald-700",
  Medium: "bg-violet-100 text-violet-700",
  Hard:   "bg-rose-100 text-rose-600",
};

type Phase = "list" | "quiz";

export default function Quizzes() {
  const { quizId } = useParams<{ quizId?: string }>();
  const [, navigate] = useLocation();
  const [phase, setPhase] = useState<Phase>("list");
  const [activeQuiz, setActiveQuiz] = useState<typeof quizData[0] | null>(null);
  const routedQuiz = useMemo(() => quizData.find((quiz) => quiz.id === quizId) ?? null, [quizId]);

  const startQuiz = (quiz: typeof quizData[0]) => {
    setActiveQuiz(quiz);
    setPhase("quiz");
    navigate(`/quizzes/${quiz.id}`);
  };

  if ((phase === "quiz" && activeQuiz) || routedQuiz) {
    const quiz = routedQuiz ?? activeQuiz!;
    return (
      <Quiz
        title={quiz.title}
        color={quiz.color}
        qBank={quiz.qBank}
        onBack={() => {
          setPhase("list");
          navigate("/quizzes");
        }}
      />
    );
  }

  const totalDone = quizData.filter(q => q.completed).length;

  return (
    <div className="px-4 py-6 md:px-8 animate-in fade-in duration-500">
      <div className="mx-auto max-w-[1400px] space-y-6">

        {/* ── Title and Alert Row ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Quizzes</h1>
            <p className="text-xs font-semibold text-slate-400 mt-1">Test your knowledge, earn XP and track your progress across all subjects.</p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-2xl bg-violet-50 border border-violet-200 px-4 py-2.5 text-xs font-bold text-violet-850 shadow-sm shrink-0">
            <span className="text-sm">⚡</span>
            <span>+{quizData.length * 50} XP Available</span>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Total Quizzes", value: quizData.length,              txt: "text-[#6c5ce7]" },
            { label: "Completed",     value: totalDone,                    txt: "text-emerald-600" },
            { label: "Remaining",     value: quizData.length - totalDone,  txt: "text-rose-500" },
            { label: "Available XP",  value: `+${quizData.length * 50}`,   txt: "text-indigo-600" },
          ].map(({ label, value, txt }) => (
            <div key={label} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col justify-center min-h-[100px]">
              <span className={`text-4xl font-black ${txt}`}>{value}</span>
              <span className="text-xs font-bold text-slate-400 mt-1">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Live Tests ── */}
        <StudentLiveTestsPanel />

        {/* ── Quiz Cards Grid ── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {quizData.map((quiz, i) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-[2rem] bg-white shadow-sm border border-slate-100/50 flex flex-col transition hover:shadow-md"
            >
              <div className="flex flex-col gap-4 p-6 flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ background: `${quiz.color}15` }}>
                    {quiz.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {quiz.completed && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-100">
                        Done
                      </span>
                    )}
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${diffColor[quiz.difficulty]}`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-800 leading-snug">{quiz.title}</h3>
                  <p className="mt-1 text-xs font-bold text-indigo-500">{quiz.course}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold">
                  <span className="flex items-center gap-1"><HelpCircle className="h-4 w-4 text-slate-400" />{quiz.questions} questions</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-slate-400" />{quiz.time}</span>
                  <span className="flex items-center gap-1 text-violet-650 font-bold"><Zap className="h-4 w-4 text-violet-500" />+50 XP</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => startQuiz(quiz)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs font-black text-white transition-all shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${quiz.color}cc, ${quiz.color})`,
                    boxShadow: `0 4px 12px -2px ${quiz.color}33`,
                  }}
                >
                  {quiz.completed ? "Retake Quiz" : "Start Quiz"} <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
