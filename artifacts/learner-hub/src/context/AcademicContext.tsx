import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ACADEMIC_API_BASE } from "@/lib/api";
import { loadLMSQuestions } from "@/services/lmsQuestions";
import { loadLocalSubjectQuestions } from "@/services/localSubjectQuestions";
import type { CodingQuestion } from "@/data/codingQuestions";

const API_BASE = ACADEMIC_API_BASE;

export interface SharedAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  courseCode?: string;
  submittedFileName?: string;
  submittedFileUrl?: string;
  submittedAt?: string;
  studentNote?: string;
  feedback?: string;
  marks?: number;
  imageUrl?: string;
}

export interface Question {
  id: number;
  topic?: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  category?: "GK Question" | "Quantitative Aptitude" | "Reasoning" | "English";
  difficulty?: string;
  sourceId?: string;
}

export interface PublishedTest {
  id: string;
  title: string;
  testDate: string;
  startTime: string;
  durationMinutes: number;
  questions: Question[];
  createdAt: string;
}

interface AcademicContextValue {
  assignments: SharedAssignment[];
  publishedTests: PublishedTest[];
  publishedCodingQuestions: CodingQuestion[];
  questionBank: Question[];
  questionsLoading: boolean;
  questionsError: string;
  reloadQuestions: () => Promise<void>;
  reloadAssignments: () => Promise<void>;
  addAssignment: (assignment: Omit<SharedAssignment, "id" | "createdAt">) => void;
  submitAssignment: (assignmentId: string, fileName: string, fileUrl?: string, note?: string) => void;
  addAssignmentFeedback: (assignmentId: string, feedback: string) => void;
  publishTest: (test: Omit<PublishedTest, "id" | "createdAt">) => void;
  publishCodingQuestions: (questions: CodingQuestion[]) => void;
  addQuestionsToBank: (questions: Question[]) => void;
}

export const fallbackQuestionBank: Question[] = [
  { id: 1, questionText: "Which data structure follows LIFO order?", options: ["Queue", "Stack", "Heap", "Graph"], correctAnswer: "Stack" },
  { id: 2, questionText: "What is the average lookup time for a hash table?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correctAnswer: "O(1)" },
  { id: 3, questionText: "Which SQL clause filters rows before grouping?", options: ["HAVING", "WHERE", "ORDER BY", "GROUP BY"], correctAnswer: "WHERE" },
  { id: 4, questionText: "What does CPU scheduling decide?", options: ["Which process gets CPU time", "Which file is opened", "Which port is used", "Which database is selected"], correctAnswer: "Which process gets CPU time" },
  { id: 5, questionText: "Which network protocol is connection-oriented?", options: ["UDP", "TCP", "ICMP", "ARP"], correctAnswer: "TCP" },
  { id: 6, questionText: "What does HTML primarily define?", options: ["Page structure", "Server routing", "Database schema", "Memory allocation"], correctAnswer: "Page structure" },
  { id: 7, questionText: "Which CSS utility concept does Tailwind use heavily?", options: ["Utility classes", "Binary trees", "Stored procedures", "Socket frames"], correctAnswer: "Utility classes" },
  { id: 8, questionText: "In React, which hook stores local component state?", options: ["useMemo", "useState", "useEffect", "useRef"], correctAnswer: "useState" },
  { id: 9, questionText: "What does REST commonly use to identify resources?", options: ["URLs", "CPU registers", "CSS selectors", "Binary opcodes"], correctAnswer: "URLs" },
  { id: 10, questionText: "Which algorithm finds the shortest path in a weighted graph with non-negative edges?", options: ["DFS", "Dijkstra's algorithm", "Bubble sort", "Binary search"], correctAnswer: "Dijkstra's algorithm" },
  { id: 11, questionText: "What is normalization used for in databases?", options: ["Reducing redundancy", "Increasing image size", "Rendering UI", "Encrypting passwords"], correctAnswer: "Reducing redundancy" },
  { id: 12, questionText: "Which command is typically used to clone a Git repository?", options: ["git clone", "git save", "git copy", "git package"], correctAnswer: "git clone" },
  { id: 13, questionText: "What does Big-O notation describe?", options: ["Algorithm growth rate", "Screen resolution", "API endpoint naming", "Color contrast"], correctAnswer: "Algorithm growth rate" },
  { id: 14, questionText: "Which language runs natively in modern browsers?", options: ["JavaScript", "SQL", "Bash", "CMake"], correctAnswer: "JavaScript" },
  { id: 15, questionText: "What is a primary key?", options: ["A unique row identifier", "A CSS variable", "A backup file", "A network cable"], correctAnswer: "A unique row identifier" },
  { id: 16, questionText: "Which OS concept isolates running programs?", options: ["Processes", "Pixels", "Tables", "Selectors"], correctAnswer: "Processes" },
  { id: 17, questionText: "What does HTTPS add to HTTP?", options: ["Encryption via TLS", "More HTML tags", "Lower latency always", "A database engine"], correctAnswer: "Encryption via TLS" },
  { id: 18, questionText: "Which testing level checks individual functions or modules?", options: ["Unit testing", "Load balancing", "Indexing", "Deployment"], correctAnswer: "Unit testing" },
  { id: 19, questionText: "What is recursion?", options: ["A function calling itself", "A database join", "A browser cache", "A CSS reset"], correctAnswer: "A function calling itself" },
  { id: 20, questionText: "Which cloud model provides virtual machines and storage infrastructure?", options: ["IaaS", "SaaS", "DNS", "SMTP"], correctAnswer: "IaaS" },
];

const AcademicContext = createContext<AcademicContextValue | null>(null);

const starterAssignments: SharedAssignment[] = [];

type ApiAssignment = {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  courseCode?: string;
  createdAt?: string;
  imageUrl?: string;
};

type ApiSubmission = {
  _id: string;
  studentId: string;
  fileName: string;
  fileUrl?: string;
  note?: string;
  feedback?: string;
  marks?: number;
  createdAt?: string;
  assignment?: ApiAssignment | string;
};

function mapApiAssignment(assignment: ApiAssignment): SharedAssignment {
  return {
    id: assignment._id,
    title: assignment.title,
    description: assignment.description,
    dueDate: assignment.dueDate?.slice(0, 10) ?? "",
    courseCode: assignment.courseCode,
    createdAt: assignment.createdAt ?? new Date().toISOString(),
    imageUrl: assignment.imageUrl,
  };
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "faculty" | "admin";
  token: string;
}

export function AcademicProvider({ children, user }: { children: React.ReactNode; user: AuthUser | null }) {
  const [assignments, setAssignments] = useState<SharedAssignment[]>(starterAssignments);
  const [publishedTests, setPublishedTests] = useState<PublishedTest[]>([]);
  const [publishedCodingQuestions, setPublishedCodingQuestions] = useState<CodingQuestion[]>([]);
  const [questionBank, setQuestionBank] = useState<Question[]>(fallbackQuestionBank);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState("");

  const reloadQuestions = useCallback(async () => {
    setQuestionsLoading(true);
    setQuestionsError("");

    try {
      const dynamicQuestions = await loadLMSQuestions();
      const localSubjectQuestions = await loadLocalSubjectQuestions(dynamicQuestions.length + 1);
      setQuestionBank([...dynamicQuestions, ...localSubjectQuestions]);
    } catch (error) {
      setQuestionsError(error instanceof Error ? error.message : "Failed to load dynamic questions");
      setQuestionBank(fallbackQuestionBank);
    } finally {
      setQuestionsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadQuestions();
  }, [reloadQuestions]);

  const reloadAssignments = useCallback(async () => {
    try {
      const [assignmentResponse, submissionResponse] = await Promise.all([
        fetch(`${API_BASE}/assignments`),
        fetch(`${API_BASE}/assignment-submissions`),
      ]);
      if (!assignmentResponse.ok) throw new Error("Assignment API unavailable");
      const data = await assignmentResponse.json() as { assignments?: ApiAssignment[] };
      const submissionData = submissionResponse.ok
        ? await submissionResponse.json() as { submissions?: ApiSubmission[] }
        : { submissions: [] };
      const submissions = submissionData.submissions ?? [];
      const apiAssignments = (data.assignments ?? []).map(mapApiAssignment);

      const assignmentsWithSubmissions = apiAssignments.map((assignment) => {
        const submission = submissions.find((item) => {
          const assignmentRef = item.assignment;
          return typeof assignmentRef === "string" ? assignmentRef === assignment.id : assignmentRef?._id === assignment.id;
        });
        return submission
          ? {
              ...assignment,
              submittedFileName: submission.fileName,
              submittedFileUrl: submission.fileUrl,
              submittedAt: submission.createdAt,
              studentNote: submission.note,
              feedback: submission.feedback,
              marks: submission.marks,
            }
          : assignment;
      });
      setAssignments(assignmentsWithSubmissions);
    } catch {
      setAssignments([]);
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem("local_assignments");
  }, []);

  useEffect(() => {
    void reloadAssignments();
  }, [reloadAssignments]);

  const value = useMemo<AcademicContextValue>(
    () => ({
      assignments,
      publishedTests,
      publishedCodingQuestions,
      questionBank,
      questionsLoading,
      questionsError,
      reloadQuestions,
      reloadAssignments,
      addAssignment: (assignment) => {
        void fetch(`${API_BASE}/assignments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: assignment.title,
            description: assignment.description,
            dueDate: assignment.dueDate,
            courseCode: assignment.courseCode ?? "CS301",
            facultyId: user?.email ?? "faculty-demo",
          }),
        })
          .then((response) => (response.ok ? response.json() : null))
          .then((data: { assignment?: ApiAssignment } | null) => {
            if (data?.assignment) {
              setAssignments((current) => [mapApiAssignment(data.assignment!), ...current]);
            }
          })
          .catch(() => {});
      },
      submitAssignment: (assignmentId, fileName, fileUrl = "", note = "") => {
        void fetch(`${API_BASE}/assignments/${assignmentId}/submissions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: user?.email ?? "student-demo-rs",
            fileName,
            fileUrl,
            note,
          }),
        })
          .then(() => reloadAssignments())
          .catch(() => {});

        setAssignments((current) =>
          current.map((assignment) =>
            assignment.id === assignmentId
              ? {
                  ...assignment,
                  submittedFileName: fileName,
                  submittedFileUrl: fileUrl,
                  submittedAt: new Date().toISOString(),
                  studentNote: note,
                }
              : assignment,
          ),
        );
      },
      addAssignmentFeedback: (assignmentId, feedback) => {
        setAssignments((current) =>
          current.map((assignment) =>
            assignment.id === assignmentId
              ? {
                  ...assignment,
                  feedback,
                }
              : assignment,
          ),
        );
      },
      publishTest: (test) => {
        setPublishedTests((current) => [
          {
            ...test,
            id: `test-${Date.now()}`,
            createdAt: new Date().toISOString(),
          },
          ...current,
        ]);
      },
      publishCodingQuestions: (questions) => {
        setPublishedCodingQuestions(questions);
      },
      addQuestionsToBank: (questions) => {
        setQuestionBank((current) => [...questions, ...current]);
      },
    }),
    [assignments, publishedTests, publishedCodingQuestions, questionBank, questionsLoading, questionsError, reloadAssignments],
  );

  return <AcademicContext.Provider value={value}>{children}</AcademicContext.Provider>;
}

export function useAcademic() {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error("useAcademic must be used inside AcademicProvider");
  }
  return context;
}
