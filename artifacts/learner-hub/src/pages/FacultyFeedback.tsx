import { useEffect, useState } from "react";
import { ACADEMIC_API_BASE } from "@/lib/api";
import { Star, MessageSquare, TrendingUp } from "lucide-react";

type Feedback = {
  _id: string;
  studentId: string;
  courseCode: string;
  rating: number;
  comments: string;
  createdAt: string;
};

export default function FacultyFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeedback() {
      try {
        const res = await fetch(`${ACADEMIC_API_BASE}/feedback`);
        if (res.ok) {
          const data = await res.json();
          setFeedbacks(data.feedback || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadFeedback();
  }, []);

  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((a, b) => a + b.rating, 0) / feedbacks.length).toFixed(1)
    : "0.0";

  return (
    <div className="p-4 md:p-8 max-w-[1540px] mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Student Feedback</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">Review ratings and comments from your students.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Average Rating</p>
            <p className="text-2xl font-black text-slate-900">{avgRating} <span className="text-sm text-slate-400">/ 5.0</span></p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Reviews</p>
            <p className="text-2xl font-black text-slate-900">{feedbacks.length}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Performance</p>
            <p className="text-2xl font-black text-emerald-600">Excellent</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
          <h2 className="text-sm font-black text-slate-800">Recent Comments</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-400">Loading feedback...</div>
          ) : feedbacks.length === 0 ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-400">No feedback received yet.</div>
          ) : (
            feedbacks.map((item) => (
              <div key={item._id} className="p-6 transition-colors hover:bg-slate-50/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-black text-xs">
                      {item.studentId.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{item.studentId}</p>
                      <p className="text-[10px] font-bold text-slate-400">Course: {item.courseCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-black text-amber-700">{item.rating}</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-600 leading-relaxed pl-[3.25rem]">
                  "{item.comments}"
                </p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-3 pl-[3.25rem]">
                  {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
