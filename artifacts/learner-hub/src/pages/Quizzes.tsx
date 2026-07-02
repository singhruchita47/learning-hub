import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, HelpCircle, Zap, CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    color: "#F59E0B", icon: "🌐", completed: false,
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
  Medium: "bg-amber-100 text-amber-700",
  Hard:   "bg-red-100 text-red-600",
};

type Phase = "list" | "quiz" | "result";

export default function Quizzes() {
  const [phase, setPhase] = useState<Phase>("list");
  const [activeQuiz, setActiveQuiz] = useState<typeof quizData[0] | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);

  const startQuiz = (quiz: typeof quizData[0]) => {
    setActiveQuiz(quiz);
    setCurrentQ(0);
    setSelected(null);
    setAnswers(Array(quiz.qBank.length).fill(null));
    setScore(0);
    setPhase("quiz");
  };

  const handleSelect = (idx: number) => { if (selected === null) setSelected(idx); };

  const handleNext = () => {
    if (selected === null || !activeQuiz) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = selected;
    setAnswers(newAnswers);
    if (currentQ < activeQuiz.qBank.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      const finalScore = newAnswers.filter((a, i) => a === activeQuiz.qBank[i].ans).length;
      setScore(finalScore);
      setPhase("result");
    }
  };

  if (phase === "quiz" && activeQuiz) {
    const q = activeQuiz.qBank[currentQ];
    const prog = ((currentQ) / activeQuiz.qBank.length) * 100;
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto animate-in fade-in duration-300">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setPhase("list")} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">← Back</button>
          <span className="text-sm font-bold text-muted-foreground">{currentQ + 1} / {activeQuiz.qBank.length}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-100 mb-8 overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ backgroundColor: activeQuiz.color }} animate={{ width: `${prog}%` }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm mb-5">
              <p className="text-lg font-bold text-slate-800 leading-relaxed">{q.q}</p>
            </div>
            <div className="flex flex-col gap-3">
              {q.opts.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = selected !== null && i === q.ans;
                const isWrong = selected !== null && isSelected && i !== q.ans;
                return (
                  <motion.button key={i} whileHover={selected === null ? { scale: 1.01 } : {}} onClick={() => handleSelect(i)}
                    className={`w-full rounded-xl border-2 px-4 py-3.5 text-left text-sm font-semibold transition-all ${
                      isCorrect ? "border-emerald-400 bg-emerald-50 text-emerald-800" :
                      isWrong   ? "border-red-400 bg-red-50 text-red-800" :
                      isSelected ? "border-primary bg-primary/5 text-primary" :
                      "border-gray-200 bg-white text-slate-700 hover:border-gray-300"
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                        isCorrect ? "bg-emerald-500 text-white" : isWrong ? "bg-red-500 text-white" : isSelected ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                      }`}>{String.fromCharCode(65 + i)}</div>
                      {opt}
                      {isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />}
                      {isWrong   && <XCircle className="h-4 w-4 text-red-500 ml-auto" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
            <Button onClick={handleNext} disabled={selected === null} className="w-full mt-6 h-12 rounded-xl text-base font-bold"
              style={{ background: activeQuiz.color }}>
              {currentQ < activeQuiz.qBank.length - 1 ? "Next Question →" : "Submit Quiz"}
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (phase === "result" && activeQuiz) {
    const pct = Math.round((score / activeQuiz.qBank.length) * 100);
    const grade = pct >= 80 ? "Excellent!" : pct >= 60 ? "Good Job!" : "Keep Practicing!";
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="p-4 md:p-8 max-w-lg mx-auto text-center mt-10">
        <div className="flex h-24 w-24 items-center justify-center rounded-full mx-auto mb-5"
          style={{ background: `${activeQuiz.color}20` }}>
          <Trophy className="h-12 w-12" style={{ color: activeQuiz.color }} />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-1">{grade}</h2>
        <p className="text-muted-foreground mb-6">{activeQuiz.title}</p>
        <div className="flex items-center justify-center gap-6 mb-8">
          <div><div className="text-4xl font-extrabold" style={{ color: activeQuiz.color }}>{score}/{activeQuiz.qBank.length}</div><div className="text-xs text-slate-500 font-medium">Correct</div></div>
          <div className="h-12 w-px bg-gray-200" />
          <div><div className="text-4xl font-extrabold text-slate-800">{pct}%</div><div className="text-xs text-slate-500 font-medium">Score</div></div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => startQuiz(activeQuiz)} className="flex-1 gap-2 rounded-xl font-bold"><RotateCcw className="h-4 w-4" />Retry</Button>
          <Button onClick={() => setPhase("list")} className="flex-1 rounded-xl font-bold">Back to Quizzes</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Quizzes</h1>
        <p className="text-muted-foreground mt-1">Test your knowledge and earn XP points.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {quizData.map((quiz, i) => (
          <motion.div key={quiz.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            whileHover={{ y: -5 }} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: `${quiz.color}15` }}>{quiz.icon}</div>
              <div className="flex items-center gap-2">
                {quiz.completed && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">✓ Done</span>}
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${diffColor[quiz.difficulty]}`}>{quiz.difficulty}</span>
              </div>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">{quiz.title}</h3>
              <p className="text-xs font-mono font-bold text-indigo-600 mt-0.5">{quiz.course}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1"><HelpCircle className="h-3.5 w-3.5" />{quiz.questions} questions</div>
              <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{quiz.time}</div>
              <div className="flex items-center gap-1 text-amber-600 font-semibold"><Zap className="h-3.5 w-3.5" />+50 XP</div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => startQuiz(quiz)}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition-all"
              style={{ background: `linear-gradient(135deg, ${quiz.color}cc, ${quiz.color})` }}>
              {quiz.completed ? "Retake Quiz" : "Start Quiz"} <ChevronRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
