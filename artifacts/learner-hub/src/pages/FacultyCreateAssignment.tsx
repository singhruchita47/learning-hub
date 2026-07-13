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
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1100px]">
        
        <section className="mb-6 rounded-[2rem] border border-[#d8c8ff] bg-gradient-to-br from-[#f7f2ff]/95 via-[#eee7ff]/90 to-white p-7 shadow-xl shadow-violet-200/40">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-650">Faculty assignment module</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Create Assignment</h1>
          <p className="mt-2 text-sm font-bold text-slate-600">
            Create student tasks and publish them directly into the student Assignment page.
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-950">Assignment Details</h2>
              <p className="text-sm font-bold text-slate-500">Title, instructions, course, and due date.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Assignment title"
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
            
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Instructions / description"
              rows={5}
              className="resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
            
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1 text-xs font-black text-slate-500">
                Course:
                <select
                  value={form.courseCode}
                  onChange={(event) => setForm((current) => ({ ...current, courseCode: event.target.value }))}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none focus:border-violet-300"
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

              <label className="grid gap-1 text-xs font-black text-slate-500">
                Due Date:
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-bold outline-none focus:border-violet-300"
                  />
                </div>
              </label>
            </div>

            {/* Image attachment block */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">Attach Reference Photo / Image</p>
              
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
                  className="flex h-11 px-4 items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-50 cursor-pointer text-xs font-black text-slate-650 gap-2 shadow-sm transition-all"
                >
                  {uploadingImage ? (
                    <Loader className="h-4 w-4 animate-spin text-violet-650" />
                  ) : (
                    <Image className="h-4 w-4 text-violet-650" />
                  )}
                  {uploadingImage ? "Uploading photo..." : "Choose Image File"}
                </label>

                {imageUrl && (
                  <button
                    onClick={() => setImageUrl("")}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {imageUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200 max-w-[280px] bg-white shadow-sm p-1.5">
                  <img src={imageUrl} alt="Attached preview" className="w-full h-auto rounded-lg object-contain" />
                </div>
              )}
            </div>

            {status && <p className="rounded-2xl bg-violet-50 px-4 py-3 text-sm font-bold text-violet-700">{status}</p>}
            
            <button
              type="button"
              onClick={createAssignment}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 text-sm font-black text-white shadow-lg shadow-violet-600/20"
            >
              <Send className="h-4 w-4" />
              Publish Assignment
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
