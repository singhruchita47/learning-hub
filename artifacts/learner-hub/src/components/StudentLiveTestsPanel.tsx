import { useState } from "react";
import { CalendarClock, Clock, PlayCircle } from "lucide-react";
import ExamPage from "@/pages/ExamPage";
import { PublishedTest, useAcademic } from "@/context/AcademicContext";

function formatSchedule(test: PublishedTest) {
  const dateLabel = new Date(`${test.testDate}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${dateLabel} at ${test.startTime}`;
}

export default function StudentLiveTestsPanel() {
  const { publishedTests } = useAcademic();
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const activeTest = publishedTests.find((test) => test.id === activeTestId);

  return (
    <>
      {activeTest && <ExamPage test={activeTest} onExit={() => setActiveTestId(null)} />}

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Quiz / Exam</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Faculty-published tests open in a full-screen exam view.
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-600">
            {publishedTests.length} live
          </span>
        </div>

        {publishedTests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-slate-50 p-8 text-center">
            <p className="text-sm font-extrabold text-slate-800">No published tests yet</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Faculty can publish custom tests from the Faculty Dashboard.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {publishedTests.map((test) => (
              <article key={test.id} className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">{test.title}</h3>
                <div className="mt-3 space-y-2 text-sm font-semibold text-slate-600">
                  <p className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-emerald-500" />
                    {formatSchedule(test)}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-500" />
                    {test.durationMinutes} minutes - {test.questions.length} questions
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTestId(test.id)}
                  className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-extrabold text-white shadow-sm transition-all hover:bg-emerald-700"
                >
                  <PlayCircle className="h-4 w-4" />
                  Start Test
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
