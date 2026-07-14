import { useState, useEffect } from "react";
import { CalendarDays, ClipboardList, Send, Image, Loader, X } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

const API_BASE = ACADEMIC_API_BASE;

export default function FacultyCreateAssignment() {
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    courseCode: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [status, setStatus] = useState("");

  // Fetch courses dynamically on mount
  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch(`${API_BASE}/courses`);
        if (res.ok) {
          const data = await res.json() as { courses: any[] };
          setCoursesList(data.courses || []);
          if (data.courses && data.courses.length > 0) {
            setForm((prev) => ({ ...prev, courseCode: data.courses[0].code }));
          }
        }
      } catch {
        setCoursesList([]);
      }
    }
    void loadCourses();
  }, []);

  // Convert image to base64 data URL directly in browser - no server needed!
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImageUrl(dataUrl);
      setUploadingImage(false);
    };
    reader.onerror = () => {
      alert("Error reading file. Please try again.");
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  }

  async function createAssignment() {
    if (!form.title.trim() || !form.description.trim() || !form.dueDate || !form.courseCode) {
      setStatus("Please fill title, instructions, course code, and due date.");
      return;
    }

    const payload = {
      ...form,
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    try {
      const user = (() => {
        try {
          const saved = localStorage.getItem("learningHubUser");
          return saved ? JSON.parse(saved) : null;
        } catch {
          return null;
        }
      })();
      const facultyId = user?.email ?? user?.id ?? "faculty-demo";

      const response = await fetch(`${API_BASE}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, facultyId }),
      });
      if (!response.ok) throw new Error("Unable to save assignment");
      setForm({ title: "", description: "", dueDate: "", courseCode: coursesList[0]?.code || "" });
      setImageUrl("");
      setStatus("Assignment created and sent to student Assignment module.");
    } catch {
      setStatus("Unable to save assignment. Please check the API server and try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8 animate-in fade-in duration-500">
      <div className="mx-auto max-w-[1400px] space-y-6">
        
        {/* Header */}
        <section className="mb-6 rounded-[2rem] border border-[#d8c8ff] bg-gradient-to-br from-[#f7f2ff]/95 via-[#eee7ff]/90 to-white p-6 shadow-xl shadow-violet-200/40">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-600">Faculty assignment module</p>
          <h1 className="mt-1 text-2xl font-black text-slate-955">Create Assignment</h1>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Create student tasks and publish them directly into the student Assignment page.
          </p>
        </section>

        {/* 2-Column Workspace */}
        <div className="grid gap-6 lg:grid-cols-[1fr_450px]">
          
          {/* ── Left Column: Form Box (Smaller/Compact) ── */}
          <section className="rounded-[2rem] border border-slate-150 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-55 bg-[#f5f3ff] text-violet-600">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-805 text-slate-800">Assignment Details</h2>
                  <p className="text-xs font-bold text-slate-400">Fill in the workspace task fields.</p>
                </div>
              </div>

              <div className="grid gap-4">
                <input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Assignment title"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold outline-none focus:border-violet-300 focus:bg-white transition"
                />
                
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Instructions / description"
                  rows={4}
                  className="resize-none w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-bold outline-none focus:border-violet-300 focus:bg-white transition"
                />
                
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Course:
                    <select
                      value={form.courseCode}
                      onChange={(event) => setForm((current) => ({ ...current, courseCode: event.target.value }))}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none focus:border-violet-300 focus:bg-white transition cursor-pointer"
                    >
                      {coursesList.length > 0 ? (
                        coursesList.map((course) => (
                          <option key={course.code} value={course.code}>
                            {course.code} - {course.title}
                          </option>
                        ))
                      ) : (
                        <option value="">No courses created yet</option>
                      )}
                    </select>
                  </label>

                  <label className="grid gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Due Date:
                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="date"
                        value={form.dueDate}
                        onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs font-bold outline-none focus:border-violet-300 focus:bg-white transition cursor-pointer"
                      />
                    </div>
                  </label>
                </div>

                {/* Image attachment block */}
                <div className="rounded-xl border border-slate-150 bg-slate-50/50 p-4 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Attach Reference Photo / Image</p>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      id="assignment-img-picker"
                      className="hidden"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                    <label
                      htmlFor="assignment-img-picker"
                      className="flex h-10 px-4 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-xs font-black text-slate-600 gap-2 shadow-sm transition-all"
                    >
                      {uploadingImage ? (
                        <Loader className="h-4 w-4 animate-spin text-violet-600" />
                      ) : (
                        <Image className="h-4 w-4 text-violet-600" />
                      )}
                      {uploadingImage ? "Uploading..." : "Choose Image File"}
                    </label>

                    {imageUrl && (
                      <button
                        onClick={() => setImageUrl("")}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {status && <p className="rounded-xl bg-violet-50 border border-violet-100 px-4 py-3 text-xs font-bold text-violet-750">{status}</p>}
              </div>
            </div>
            
            <button
              type="button"
              onClick={createAssignment}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 text-xs font-black text-white hover:bg-violet-700 shadow-md transition cursor-pointer"
            >
              <Send className="h-4 w-4" />
              Publish Assignment
            </button>
          </section>

          {/* ── Right Column: Live Preview Panel ── */}
          <section className="rounded-[2rem] border border-slate-150 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-[#6c5ce7] animate-pulse" />
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-405 text-slate-450">Live Student Preview</h2>
                </div>
                <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[9px] font-black text-[#6c5ce7] border border-violet-100">
                  DRAFT MODE
                </span>
              </div>

              {/* Simulated Assignment Card Container */}
              <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[9px] font-black text-violet-700 uppercase tracking-wider border border-violet-100">
                    {form.courseCode || "CS301"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    ⏰ Due: {form.dueDate ? new Date(form.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Not Set"}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-800 leading-snug truncate">
                    {form.title || "Untitled Assignment"}
                  </h3>
                  <p className="mt-2 text-xs font-semibold text-slate-500 leading-relaxed whitespace-pre-wrap min-h-[60px] max-h-[140px] overflow-y-auto">
                    {form.description || "Instructions and details will appear here as you type..."}
                  </p>
                </div>

                {/* Attached Image inside the card preview */}
                {imageUrl ? (
                  <div className="rounded-xl overflow-hidden border border-slate-150 max-h-[180px] bg-slate-50 relative flex items-center justify-center">
                    <img src={imageUrl} alt="Reference Attachment" className="max-w-full max-h-[180px] object-cover" />
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-xs text-slate-400 font-semibold flex flex-col items-center justify-center gap-1.5">
                    <span>🖼️</span>
                    <span>No reference photo attached</span>
                  </div>
                )}
              </div>

              {/* Student Upload Simulation Area */}
              <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4 space-y-3 text-center">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Student Upload Area (Simulated)</p>
                <div className="flex h-10 w-full items-center justify-center rounded-xl bg-white border border-slate-200 border-dashed text-xs text-slate-400 font-bold">
                  📂 Drop submission files here
                </div>
              </div>
            </div>

            <div className="text-[10px] font-semibold text-slate-400 text-center mt-6">
              This preview matches the student-facing dashboard layout exactly.
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
