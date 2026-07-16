import { useEffect, useState, useRef } from "react";
import { Plus, Video, FileText, Upload, X, Loader, Check, Radio as RadioIcon } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";
import { uploadToCloudinary } from "@/lib/cloudinary";

const API_BASE = ACADEMIC_API_BASE;

interface Course {
  _id?: string;
  code: string;
  title: string;
  teacher: string;
  students?: number;
  progress?: number;
  description?: string;
}

interface UploadModal {
  course: Course;
  defaultType: "video" | "notes";
}

const FOLDER_CATS = ["Video Lectures", "Lecture Notes", "Practice Papers", "Cheat Sheets"];
const FORMATS    = ["Video Playlist / File", "PDF Document", "Presentation (PPT)", "External Link"];

export default function FacultyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState({ code: "", title: "", themeColor: "Purple (#7130a1)", branch: "B.Tech CSE" });
  const [addSaving, setAddSaving] = useState(false);

  /* ─── Upload modal state ─── */
  const [modal, setModal] = useState<UploadModal | null>(null);
  const [matTitle, setMatTitle] = useState("");
  const [folderCat, setFolderCat] = useState(FOLDER_CATS[0]);
  const [resFormat, setResFormat] = useState(FORMATS[0]);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("url");
  const [extUrl, setExtUrl] = useState("");
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const user = (() => { try { return JSON.parse(localStorage.getItem("learningHubUser") || "null"); } catch { return null; } })();
  const facultyName: string = user?.name || "Faculty";

  useEffect(() => { void loadCourses(); }, []);

  async function loadCourses() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/courses`);
      const data = await res.json() as { courses: Course[] };
      setCourses(data.courses || []);
    } catch { setCourses([]); }
    finally { setLoading(false); }
  }

  async function addCourse() {
    if (!newForm.code.trim() || !newForm.title.trim()) return;
    setAddSaving(true);
    try {
      await fetch(`${API_BASE}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newForm, teacher: facultyName, students: 0, progress: 0, branch: newForm.branch }),
      });
      setShowAddForm(false);
      setNewForm({ code: "", title: "", themeColor: "Purple (#7130a1)", branch: "B.Tech CSE" });
      void loadCourses();
    } catch { /* ignore */ }
    finally { setAddSaving(false); }
  }

  function openModal(course: Course, type: "video" | "notes") {
    setModal({ course, defaultType: type });
    setFolderCat(type === "video" ? "Video Lectures" : "Lecture Notes");
    setResFormat(type === "video" ? "Video Playlist / File" : "PDF Document");
    setMatTitle("");
    setExtUrl("");
    setPickedFile(null);
    setUploadMode("url");
    setUploadDone(false);
  }

  async function confirmUpload() {
    if (!modal || !matTitle.trim()) return;

    // For URL mode, validate the URL first
    if (uploadMode === "url" && !extUrl.trim()) {
      alert("Please enter a valid URL.");
      return;
    }

    // For file mode, validate file is picked
    if (uploadMode === "file" && !pickedFile) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);
    try {
      let fileUrl = extUrl.trim();

      // Only upload to Cloudinary if a file is selected (not for external URLs)
      if (uploadMode === "file" && pickedFile) {
        fileUrl = await uploadToCloudinary(pickedFile);
      }

      /* Save to API → students see it on Resources page */
      const response = await fetch(`${API_BASE}/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: matTitle,
          category: folderCat,
          format: resFormat,
          fileUrl,
          courseCode: modal.course.code,
          uploadedBy: facultyName,
        }),
      });

      if (!response.ok) throw new Error("API save failed.");

      setUploadDone(true);
      setTimeout(() => setModal(null), 1200);
    } catch (err: any) {
      if (uploadMode === "file") {
        alert("File upload to Cloudinary failed. Try using External URL instead.");
      } else {
        alert("Could not save the resource. Please check if the backend server is running.");
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1400px] space-y-8">

        {/* ── Welcome Banner ── */}
        <section className="rounded-[2rem] border border-[#d8c8ff] bg-gradient-to-br from-[#f7f2ff]/95 via-[#eee7ff]/90 to-white p-7 shadow-xl shadow-violet-200/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-600">Faculty Dashboard</p>
              <h1 className="mt-1 text-3xl font-black text-slate-900">
                Welcome back, <span className="text-violet-600">{facultyName}!</span>
              </h1>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Manage your courses, upload lecture videos and notes for students.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["B.Tech CSE", "Semester 4", "SGSU Faculty"].map(tag => (
                  <span key={tag} className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Courses Grid ── */}
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader className="h-8 w-8 animate-spin text-violet-500" />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* Course Cards */}
            {courses.map((course, idx) => (
              <div key={course._id || course.code}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-sm font-black text-white shadow-lg shadow-violet-400/30">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <span className="text-xs font-bold text-slate-400">{course.students || 0} students</span>
                </div>

                {/* Course info */}
                <div className="mt-4">
                  <h2 className="text-xl font-black text-slate-900 leading-snug">{course.title}</h2>
                  <p className="mt-0.5 text-sm font-black text-violet-600">{course.code}</p>
                  {(course as any).branch && (
                    <span className="mt-1.5 inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-black text-indigo-600">
                      {(course as any).branch}
                    </span>
                  )}
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-xs font-bold text-slate-400">
                    <span>Syllabus progress</span>
                    <span>{course.progress || 0}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-violet-600 transition-all duration-500"
                      style={{ width: `${course.progress || 0}%` }} />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openModal(course, "video")}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-black text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 transition cursor-pointer"
                  >
                    <Video className="h-3.5 w-3.5" /> Upload Video
                  </button>
                  <button
                    onClick={() => openModal(course, "notes")}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-black text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 transition cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5" /> Add Notes
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Course card */}
            <button
              onClick={() => setShowAddForm(true)}
              className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.75rem] border-2 border-dashed border-slate-200 bg-white text-slate-400 hover:border-violet-300 hover:text-violet-500 transition-all duration-200"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-dashed border-current text-2xl font-black">
                +
              </div>
              <span className="text-xs font-black uppercase tracking-wider">Add New Course</span>
            </button>
          </div>
        )}

      </div>

      {/* ════════════════════════════════════════════ CREATE COURSE MODAL ══ */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-[440px] rounded-[1.75rem] bg-white shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Create New Course</h3>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X className="h-5 w-5" /></button>
            </div>
            
            <div className="space-y-4">
              <label className="grid gap-1.5">
                <span className="text-xs font-black text-slate-500">Course Code:</span>
                <input
                  value={newForm.code}
                  onChange={e => setNewForm(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="e.g. CS301"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 transition"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-black text-slate-500">Course Title:</span>
                <input
                  value={newForm.title}
                  onChange={e => setNewForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Data Structures & Algorithms"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 transition"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-black text-slate-500">Branch / Department:</span>
                <select
                  value={newForm.branch}
                  onChange={e => setNewForm(prev => ({ ...prev, branch: e.target.value }))}
                  className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none focus:border-violet-400 cursor-pointer"
                >
                  <option>B.Tech CSE</option>
                  <option>B.Tech IT</option>
                  <option>B.Tech ECE</option>
                  <option>B.Tech ME</option>
                  <option>B.Tech CE</option>
                  <option>B.Tech EE</option>
                  <option>MCA</option>
                  <option>MBA</option>
                  <option>All Branches</option>
                </select>
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-black text-slate-500">Theme Color:</span>
                <select
                  value={newForm.themeColor}
                  onChange={e => setNewForm(prev => ({ ...prev, themeColor: e.target.value }))}
                  className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none focus:border-violet-400 cursor-pointer"
                >
                  <option>Purple (#7130a1)</option>
                  <option>Blue (#3b82f6)</option>
                  <option>Emerald (#10b981)</option>
                  <option>Rose (#f43f5e)</option>
                </select>
              </label>

              <button
                onClick={addCourse}
                disabled={addSaving || !newForm.code.trim() || !newForm.title.trim()}
                className="w-full mt-2 h-12 rounded-2xl bg-violet-600 text-sm font-black text-white hover:bg-violet-700 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-violet-300/50"
              >
                {addSaving ? <Loader className="h-4 w-4 animate-spin mx-auto" /> : "Create Course"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════ UPLOAD MODAL ══ */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-[440px] rounded-[1.75rem] bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 pt-5 pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Upload Material</p>
                <h3 className="mt-0.5 text-base font-black text-slate-900">{modal.course.code}</h3>
              </div>
              <button onClick={() => setModal(null)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">

              {/* Material Title */}
              <label className="grid gap-1.5">
                <span className="text-xs font-black text-slate-500">Material Title:</span>
                <input
                  value={matTitle}
                  onChange={e => setMatTitle(e.target.value)}
                  placeholder="e.g. Tree Traversals Lecture 1"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 transition"
                />
              </label>

              {/* Folder Category + Resource Format */}
              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1.5">
                  <span className="text-xs font-black text-slate-500">Folder Category:</span>
                  <select
                    value={folderCat}
                    onChange={e => setFolderCat(e.target.value)}
                    className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none focus:border-violet-400 cursor-pointer"
                  >
                    {FOLDER_CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <label className="grid gap-1.5">
                  <span className="text-xs font-black text-slate-500">Resource Format:</span>
                  <select
                    value={resFormat}
                    onChange={e => setResFormat(e.target.value)}
                    className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none focus:border-violet-400 cursor-pointer"
                  >
                    {FORMATS.map(f => <option key={f}>{f}</option>)}
                  </select>
                </label>
              </div>

              {/* Upload Mode toggle */}
              <div className="flex items-center gap-6">
                {(["file", "url"] as const).map(mode => (
                  <label key={mode} className="flex cursor-pointer items-center gap-2">
                    <div
                      onClick={() => setUploadMode(mode)}
                      className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition ${
                        uploadMode === mode ? "border-violet-600 bg-violet-600" : "border-slate-300"
                      }`}
                    >
                      {uploadMode === mode && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-xs font-bold text-slate-600">
                      {mode === "file" ? "File Upload" : "External URL / Link"}
                    </span>
                  </label>
                ))}
              </div>

              {/* File picker OR URL input */}
              {uploadMode === "file" ? (
                <div>
                  <input ref={fileRef} type="file" className="hidden"
                    onChange={e => setPickedFile(e.target.files?.[0] || null)} />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className={`w-full flex items-center gap-3 rounded-2xl border-2 border-dashed px-4 py-3 text-sm font-bold transition cursor-pointer ${
                      pickedFile ? "border-violet-300 bg-violet-50 text-violet-700" : "border-slate-200 bg-slate-50 text-slate-400 hover:border-violet-300"
                    }`}
                  >
                    <Upload className="h-4 w-4 shrink-0" />
                    {pickedFile ? pickedFile.name : "Click to choose file…"}
                  </button>
                  <p className="mt-1 text-[10px] font-semibold text-slate-400">Uploaded to Cloudinary — accessible globally.</p>
                </div>
              ) : (
                <label className="grid gap-1.5">
                  <span className="text-xs font-black text-slate-500">External URL / Playlist Link:</span>
                  <input
                    value={extUrl}
                    onChange={e => setExtUrl(e.target.value)}
                    placeholder="e.g. https://www.youtube.com/playlist?list=…"
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 transition"
                  />
                </label>
              )}

              {/* Confirm Button */}
              <button
                onClick={confirmUpload}
                disabled={uploading || uploadDone || !matTitle.trim() || (uploadMode === "file" ? !pickedFile : !extUrl.trim())}
                className={`w-full flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-black text-white shadow-lg transition ${
                  uploadDone
                    ? "bg-emerald-500 shadow-emerald-200"
                    : "bg-violet-600 shadow-violet-300/50 hover:bg-violet-700 disabled:opacity-50"
                } cursor-pointer`}
              >
                {uploading ? (
                  <><Loader className="h-4 w-4 animate-spin" /> Uploading to Cloudinary…</>
                ) : uploadDone ? (
                  <><Check className="h-4 w-4" /> Saved! Students can now access this.</>
                ) : (
                  <><Upload className="h-4 w-4" /> Confirm &amp; Send</>
                )}
              </button>

              <p className="text-center text-[10px] font-semibold text-slate-400">
                This resource will appear in the student <span className="font-black text-violet-600">Resources</span> page.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
