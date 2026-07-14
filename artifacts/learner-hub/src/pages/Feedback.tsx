import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACADEMIC_API_BASE } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const courseOptions = [
  { code: "CS301", name: "Data Structures & Algorithms" },
  { code: "CS302", name: "Database Management Systems" },
  { code: "CS303", name: "Operating Systems" },
  { code: "CS304", name: "Computer Networks" },
  { code: "CS401", name: "Machine Learning Fundamentals" },
];

const ratingCategories = [
  { key: "content",  label: "Content Quality",    hint: "Clarity and depth of course material" },
  { key: "teaching", label: "Teaching Style",      hint: "Instructor's explanation & engagement" },
  { key: "pace",     label: "Course Pace",         hint: "Speed and balance of topics covered" },
  { key: "overall",  label: "Overall Experience",  hint: "Your overall satisfaction" },
];

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)} className="transition-transform hover:scale-110">
          <Star className={`h-7 w-7 transition-colors ${(hovered || value) >= star ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-100"}`} />
        </button>
      ))}
    </div>
  );
}

const ratingLabel = (v: number) => ["", "Poor", "Fair", "Good", "Great", "Excellent!"][v] ?? "";

export default function Feedback() {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [ratings, setRatings] = useState<Record<string, number>>({ content: 0, teaching: 0, pace: 0, overall: 0 });
  const [comment, setComment] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("learningHubUser") || "null"); }
    catch { return null; }
  })();
  const studentId = user?.email || user?.id || "student-demo";

  const allRated = Object.values(ratings).every((r) => r > 0);
  const canSubmit = selectedCourse && allRated && comment.trim().length >= 10;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    
    const avgRating = Object.values(ratings).reduce((a, b) => a + b, 0) / 4;

    try {
      const res = await fetch(`${ACADEMIC_API_BASE}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          courseCode: selectedCourse,
          rating: avgRating,
          comments: comment,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit feedback");
      
      setSubmitted(true);
    } catch (err) {
      toast({
        title: "Submission Failed",
        description: "Could not submit feedback at this time.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto mt-10">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-5">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </motion.div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Thank You!</h2>
          <p className="text-muted-foreground mb-6">Your feedback for <span className="font-bold text-foreground">{courseOptions.find(c => c.code === selectedCourse)?.name}</span> has been submitted. It helps us improve!</p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-amber-500">{(Object.values(ratings).reduce((a, b) => a + b, 0) / 4).toFixed(1)}</div>
              <div className="text-xs text-slate-500 font-medium">Avg Rating</div>
            </div>
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className={`h-6 w-6 ${s <= Math.round(Object.values(ratings).reduce((a, b) => a + b, 0) / 4) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
              ))}
            </div>
          </div>
          <Button onClick={() => { setSubmitted(false); setSelectedCourse(""); setRatings({ content: 0, teaching: 0, pace: 0, overall: 0 }); setComment(""); setWouldRecommend(null); }}
            className="rounded-full font-bold">Submit Another Feedback</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[760px] mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Course Feedback</h1>
        <p className="text-muted-foreground mt-1">Help us improve by sharing your experience.</p>
      </div>

      {/* Course selector */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm mb-5">
        <h3 className="text-sm font-extrabold text-slate-700 mb-3">Select a Course</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {courseOptions.map((c) => (
            <button key={c.code} onClick={() => setSelectedCourse(c.code)}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                selectedCourse === c.code ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
              }`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold text-white ${selectedCourse === c.code ? "bg-primary" : "bg-slate-300"}`}>
                {c.code.slice(-3)}
              </div>
              <div>
                <p className={`text-xs font-extrabold ${selectedCourse === c.code ? "text-primary" : "text-slate-700"}`}>{c.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{c.code}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm mb-5">
        <h3 className="text-sm font-extrabold text-slate-700 mb-4">Rate Your Experience</h3>
        <div className="space-y-5">
          {ratingCategories.map((cat) => (
            <div key={cat.key}>
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <p className="text-sm font-bold text-slate-800">{cat.label}</p>
                  <p className="text-xs text-slate-400">{cat.hint}</p>
                </div>
                <AnimatePresence mode="wait">
                  {ratings[cat.key] > 0 && (
                    <motion.span key={ratings[cat.key]} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-extrabold text-amber-600">{ratingLabel(ratings[cat.key])}</motion.span>
                  )}
                </AnimatePresence>
              </div>
              <StarRating value={ratings[cat.key]} onChange={(v) => setRatings((p) => ({ ...p, [cat.key]: v }))} />
            </div>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm mb-5">
        <h3 className="text-sm font-extrabold text-slate-700 mb-3">Your Comments</h3>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)}
          placeholder="Share your detailed thoughts about this course — what you liked, what could be improved..."
          rows={4} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] text-slate-400">Minimum 10 characters</span>
          <span className={`text-[11px] font-semibold ${comment.length >= 10 ? "text-emerald-500" : "text-slate-400"}`}>{comment.length} chars</span>
        </div>
      </div>

      {/* Recommend */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm mb-6">
        <p className="text-sm font-extrabold text-slate-700 mb-3">Would you recommend this course to peers?</p>
        <div className="flex gap-3">
          {[true, false].map((val) => (
            <button key={String(val)} onClick={() => setWouldRecommend(val)}
              className={`flex-1 rounded-xl border-2 py-2.5 text-sm font-bold transition-all ${
                wouldRecommend === val ? val ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-red-300 bg-red-50 text-red-600"
                  : "border-gray-200 text-slate-500 hover:border-gray-300"
              }`}>
              {val ? "👍 Yes, definitely!" : "👎 Not really"}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting}
        className="w-full h-12 rounded-xl text-base font-bold gap-2">
        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />} 
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </div>
  );
}
