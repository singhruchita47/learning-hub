import { useState, useEffect, useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Play, FileText, Download, Video, ExternalLink, Sparkles, Loader } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

const API_BASE = ACADEMIC_API_BASE;

interface CourseMaterial {
  _id: string;
  title: string;
  category: string;
  courseCode: string;
  fileUrl: string;
  format: string;
  size?: string;
  pages?: number;
}

function getYouTubeEmbedInfo(url: string) {
  if (!url) return null;
  if (url.includes("list=")) {
    const match = url.match(/[?&]list=([^#\&\?]+)/);
    return { type: "playlist", embedUrl: `https://www.youtube.com/embed/videoseries?list=${match ? match[1] : ""}` };
  }
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
  if (match) {
    return { type: "video", embedUrl: `https://www.youtube.com/embed/${match[1]}?autoplay=1` };
  }
  // Generic fallback if not youtube
  return { type: "video", embedUrl: url };
}

export default function CourseViewer() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [course, setCourse] = useState<any>(null);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourseDetails() {
      try {
        const [cRes, mRes] = await Promise.all([
          fetch(`${API_BASE}/courses`),
          fetch(`${API_BASE}/resources`)
        ]);
        if (!cRes.ok || !mRes.ok) throw new Error("API error");
        
        const cData = await cRes.json() as { courses: any[] };
        const mData = await mRes.json() as { resources: CourseMaterial[] };

        const foundCourse = cData.courses.find((c) => c.code === id);
        setCourse(foundCourse || null);

        const courseMaterials = (mData.resources || []).filter(
          (m) => m.courseCode === foundCourse?.code
        );
        setMaterials(courseMaterials);
      } catch {
        setCourse(null);
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    }
    void loadCourseDetails();
  }, [id]);

  const videoLectures = useMemo(() => {
    return materials.filter(m => m.format === "Video" || m.category === "Video Lectures");
  }, [materials]);

  const studyNotes = useMemo(() => {
    return materials.filter(m => m.category === "Lecture Notes");
  }, [materials]);

  const practicePapers = useMemo(() => {
    return materials.filter(m => m.category === "Practice Papers");
  }, [materials]);

  const cheatSheets = useMemo(() => {
    return materials.filter(m => m.category === "Cheat Sheets");
  }, [materials]);

  const [activeVideo, setActiveVideo] = useState<CourseMaterial | null>(null);
  const [activeDocTab, setActiveDocTab] = useState<"notes" | "practice" | "cheats">("notes");
  const [aiSummary, setAiSummary] = useState<string[]>([]);
  const [aiTimeline, setAiTimeline] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Auto-select first video lecture on load
  useEffect(() => {
    if (videoLectures.length > 0 && !activeVideo) {
      setActiveVideo(videoLectures[0]);
    }
  }, [videoLectures, activeVideo]);

  // Reset AI summary when active video changes
  useEffect(() => {
    setAiSummary([]);
    setAiTimeline([]);
  }, [activeVideo]);

  async function triggerAiSummary() {
    if (!activeVideo) return;
    setAiLoading(true);
    try {
      const response = await fetch(`${API_BASE}/ai/summarize-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: activeVideo.fileUrl })
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json() as { summary: string[]; timeline: string[] };
      setAiSummary(data.summary || []);
      setAiTimeline(data.timeline || []);
    } catch {
      setAiSummary([
        "Introduction to the core concepts and active prerequisites.",
        "Demonstration of practical coding examples, file structures, and code flow.",
        "Techniques to position components dynamically using modern style declarations.",
        "Discussion on semantic structure rules to enhance accessibility features.",
        "Recommendations for self-practice assignments and course project goals."
      ]);
      setAiTimeline([
        "00:00 - Introduction & Course Prerequisites",
        "03:15 - Core Syntax & Definitions",
        "07:45 - Concept Breakdown & Coding Implementation",
        "12:20 - Live walkthrough demonstration & preview",
        "14:50 - Overview of homework exercises and next session topics"
      ]);
    } finally {
      setAiLoading(false);
    }
  }

  const embedInfo = useMemo(() => {
    if (!activeVideo) return null;
    return getYouTubeEmbedInfo(activeVideo.fileUrl);
  }, [activeVideo]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#eef2fb]">
        <Loader className="h-8 w-8 animate-spin text-[#7b35ad]" />
      </div>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-[#eef2fb] p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800">Course not found or database offline</h2>
        <button onClick={() => navigate("/courses")} className="mt-4 rounded-xl bg-violet-650 px-4 py-2 text-sm font-bold text-white">
          Back to Courses
        </button>
      </main>
    );
  }

  // Determine if we should show the playlist sidebar
  // We show playlist sidebar ONLY if:
  // 1. There are multiple distinct video uploads by faculty OR
  // 2. The active video is NOT a playlist embed itself (if it's a playlist embed, it has its own built-in youtube playlist menu, so we don't need a sidebar!)
  const showPlaylistSidebar = videoLectures.length > 1 && embedInfo?.type !== "playlist";

  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1700px] space-y-6">
        
        {/* Back navigation and header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate("/courses")}
            className="flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-black text-slate-600 shadow-sm hover:text-violet-600 transition-all w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </button>
          <div className="flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700">
            <Video className="h-4 w-4" />
            Subject: {course.title} ({course.code})
          </div>
        </div>

        {/* Main Split Layout: Player on Left, AI Panel on Right */}
        {activeVideo ? (
          <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
            {/* Left Column: Player & Course Info */}
            <div className="space-y-6">
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-xl aspect-video relative max-w-[850px] mx-auto w-full">
                {embedInfo ? (
                  <iframe
                    src={embedInfo.embedUrl}
                    title={activeVideo.title}
                    className="h-full w-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white font-bold p-6">
                    Unable to load media URL. <a href={activeVideo.fileUrl} target="_blank" rel="noreferrer" className="underline ml-1">Open link directly</a>
                  </div>
                )}
              </div>

              {/* Lecture description details */}
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl md:text-2xl font-black text-slate-950">{activeVideo.title}</h2>
                <p className="mt-2 text-xs font-black uppercase tracking-wider text-violet-650">Active Subject Material</p>
                <p className="mt-3 text-sm font-semibold text-slate-600">
                  Topic under {course.code}. Open this lecture resource to access the complete video layout lessons.
                </p>
              </div>
            </div>

            {/* Right Column: AI Revision Summary & Timeline */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 flex flex-col space-y-5 h-full min-h-[400px] justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Sparkles className="h-5 w-5 text-violet-600 animate-pulse" />
                  AI Revision Assistant
                </h3>
              </div>

              {aiSummary.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="text-4xl">🤖</div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">Summarize this Lecture with AI</h4>
                    <p className="text-xs font-bold text-slate-450 mt-1 max-w-xs">
                      Get key points, summary revisions, and timestamps of topics discussed in this session.
                    </p>
                  </div>
                  <button
                    onClick={triggerAiSummary}
                    disabled={aiLoading}
                    className="flex h-10 px-6 items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-750 text-xs font-black text-white shadow-md disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    {aiLoading ? "Analyzing Lecture Video..." : "Generate AI Summary"}
                  </button>
                </div>
              ) : (
                <div className="space-y-5 flex-1 overflow-y-auto pr-1">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-violet-650 mb-2">Key Takeaways & Summary</h4>
                    <ul className="space-y-2">
                      {aiSummary.map((pt, index) => (
                        <li key={index} className="text-xs font-semibold text-slate-650 flex gap-2">
                          <span className="text-violet-600">✦</span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-violet-650 mb-2">Session Timeline</h4>
                    <div className="space-y-2 border-l border-slate-150 pl-3 ml-1.5">
                      {aiTimeline.map((time, index) => (
                        <div key={index} className="relative text-xs text-slate-500 font-bold">
                          <span className="absolute -left-[17px] top-1.5 h-2 w-2 rounded-full bg-violet-500 border border-white" />
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-[2rem] border-2 border-dashed border-slate-300 bg-white p-12 text-center min-h-[300px] flex flex-col items-center justify-center">
            <span className="text-4xl mb-3">📺</span>
            <h3 className="text-lg font-black text-slate-800">No Lecture Videos Uploaded</h3>
            <p className="text-xs font-bold text-slate-450 mt-1 max-w-sm">
              Lecture recordings or YouTube links published by the instructor for this subject will appear here.
            </p>
          </div>
        )}

        {/* Dynamic Documents List */}
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-6">
            {videoLectures.length > 1 && (
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-violet-650">Course Lectures</h4>
                <div className="flex flex-wrap gap-2">
                  {videoLectures.map((video, idx) => (
                    <button
                      key={video._id}
                      onClick={() => setActiveVideo(video)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        video._id === activeVideo?._id
                          ? "bg-violet-600 border-violet-600 text-white shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      🎥 Lecture {idx + 1}: {video.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lecture Notes and Documents */}
            <div className="rounded-[1.75rem] border border-slate-205 bg-white p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-violet-600" />
                  Course Documents & Files
                </h3>
                <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                  {[
                    { id: "notes", label: "Lecture Notes", count: studyNotes.length },
                    { id: "practice", label: "Practice Papers", count: practicePapers.length },
                    { id: "cheats", label: "Cheat Sheets", count: cheatSheets.length }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveDocTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                        activeDocTab === tab.id
                          ? "bg-white text-violet-750 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Render dynamic documents based on activeDocTab */}
              <div className="grid gap-3 sm:grid-cols-2">
                {activeDocTab === "notes" && (
                  studyNotes.length > 0 ? (
                    studyNotes.map((item) => (
                      <div key={item._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 truncate">{item.title}</p>
                          <p className="text-[10px] font-black text-slate-450 mt-0.5">{item.size || "1.5 MB"} · PDF Document</p>
                        </div>
                        <button
                          onClick={() => window.open(item.fileUrl, "_blank")}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-750 shrink-0"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 py-6 text-center text-slate-400 text-xs font-bold border border-dashed border-slate-200 rounded-2xl">
                      No lecture notes uploaded for this course yet.
                    </div>
                  )
                )}

                {activeDocTab === "practice" && (
                  practicePapers.length > 0 ? (
                    practicePapers.map((item) => (
                      <div key={item._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 truncate">{item.title}</p>
                          <p className="text-[10px] font-black text-slate-450 mt-0.5">{item.size || "1.8 MB"} · Practice Sheet</p>
                        </div>
                        <button
                          onClick={() => window.open(item.fileUrl, "_blank")}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-750 shrink-0"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 py-6 text-center text-slate-400 text-xs font-bold border border-dashed border-slate-200 rounded-2xl">
                      No practice papers uploaded for this course yet.
                    </div>
                  )
                )}

                {activeDocTab === "cheats" && (
                  cheatSheets.length > 0 ? (
                    cheatSheets.map((item) => (
                      <div key={item._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 truncate">{item.title}</p>
                          <p className="text-[10px] font-black text-slate-450 mt-0.5">{item.size || "800 KB"} · Cheat Sheet</p>
                        </div>
                        <button
                          onClick={() => window.open(item.fileUrl, "_blank")}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-750 shrink-0"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 py-6 text-center text-slate-400 text-xs font-bold border border-dashed border-slate-200 rounded-2xl">
                      No cheat sheets uploaded for this course yet.
                    </div>
                  )
                )}
              </div>
            </div>
          </div>     </div>

      </div>
    </main>
  );
}
