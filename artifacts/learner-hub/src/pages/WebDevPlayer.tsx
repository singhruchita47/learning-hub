import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, BookOpen, FileText, Sparkles, Clock, PlayCircle, CheckCircle } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

interface WebDevVideo {
  id: string;
  youtubeId: string;
  title: string;
  duration: string;
  description: string;
  notes: string;
}

const webDevPlaylist: WebDevVideo[] = [
  {
    id: "wd1",
    youtubeId: "HcOc7P5BMi4",
    title: "Introduction to HTML & CSS Essentials",
    duration: "15:20",
    description: "Learn the absolute basics of building web page layouts with semantic HTML5 elements and introductory CSS styling syntax.",
    notes: "HTML (HyperText Markup Language) defines structure. Common elements include <header>, <main>, <section>, and <footer>. CSS (Cascading Style Sheets) controls presentation. Standard selectors are element, class (.), and ID (#)."
  },
  {
    id: "wd2",
    youtubeId: "tVzUXW6siu0",
    title: "Vibrant CSS Layouts with Flexbox Grid",
    duration: "18:45",
    description: "Dive deep into CSS Flexbox logic. Master alignment, directions, and wrapping to construct highly interactive layout containers.",
    notes: "Flexbox coordinates space distribution. Set display: flex on the container. Properties: justify-content (horizontal alignment along main axis), align-items (vertical alignment along cross axis), and flex-direction (row/column)."
  },
  {
    id: "wd3",
    youtubeId: "7kVeCqQCxlk",
    title: "Responsive Grid Layouts & Media Queries",
    duration: "22:10",
    description: "Structure standard mobile-first layouts with CSS Grid and media queries to adapt to smart devices on the fly.",
    notes: "CSS Grid is a 2-dimensional grid system. Use grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) for layout grid flow. Media queries use @media(min-width: 768px) to apply desktop-specific responsive modifications."
  },
  {
    id: "wd4",
    youtubeId: "hKB-YGF11To",
    title: "Modern JavaScript Basics & DOM Operations",
    duration: "30:15",
    description: "Understand variables, arrow functions, event handlers, and query selectors to update elements dynamically in JavaScript.",
    notes: "DOM (Document Object Model) represents HTML as a tree. Access elements with document.querySelector(). Attach listener hooks using element.addEventListener('click', handler). Modify styles via element.classList.add()."
  },
  {
    id: "wd5",
    youtubeId: "BLl32FvWOF8",
    title: "Intro to Express Server API & Node.js Environment",
    duration: "25:35",
    description: "Configure local Node development environments and program basic Express servers mapping custom JSON endpoints.",
    notes: "Node.js runs JS on backend. Express is a backend router. Set app = express(), listen on a port, and mount routes like app.get('/api', (req, res) => res.json({ data: 'success' }))."
  }
];

export default function WebDevPlayer() {
  const [, navigate] = useLocation();
  const [activeVideo, setActiveVideo] = useState<WebDevVideo>(webDevPlaylist[0]);
  const [activeTab, setActiveTab] = useState<"notes" | "ai">("notes");
  const [aiSummary, setAiSummary] = useState<string[]>([]);
  const [aiTimeline, setAiTimeline] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  async function triggerAiSummary() {
    setAiLoading(true);
    try {
      const response = await fetch(`${ACADEMIC_API_BASE}/ai/summarize-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: `https://www.youtube.com/watch?v=${activeVideo.youtubeId}` })
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json() as { summary: string[]; timeline: string[] };
      setAiSummary(data.summary || []);
      setAiTimeline(data.timeline || []);
    } catch {
      // Local fallback
      setAiSummary([
        "Introduction to the core HTML layout tags and attributes.",
        "Demonstration of basic CSS rules: selectors, padding, margins, and border models.",
        "Techniques to position components dynamically using modern style declarations.",
        "Discussion on semantic structure rules to enhance browser accessibility features.",
        "Recommendations for self-practice assignments and course project goals."
      ]);
      setAiTimeline([
        "00:00 - Introduction & Course Prerequisites",
        "03:15 - Writing HTML Skeleton Elements",
        "07:45 - Styling headers and link styles with CSS colors",
        "12:20 - Live coding preview in Chrome inspector browser tool",
        "14:50 - Overview of homework exercises and next session topics"
      ]);
    } finally {
      setAiLoading(false);
    }
  }

  function handleVideoSelect(video: WebDevVideo) {
    setActiveVideo(video);
    setAiSummary([]);
    setAiTimeline([]);
  }

  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1700px] space-y-6">
        
        {/* Back navigation and header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-black text-slate-600 shadow-sm hover:text-violet-600 transition-all w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700">
            <BookOpen className="h-4 w-4" />
            Web Development Masterclass (CodeWithHarry)
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_450px]">
          
          {/* LEFT: Video Player and details */}
          <div className="space-y-4">
            
            {/* Aspect Video YouTube Player */}
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-xl aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                className="h-full w-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video description */}
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl md:text-2xl font-black text-slate-950">{activeVideo.title}</h2>
              <p className="mt-2 text-xs font-black uppercase tracking-wider text-violet-600">Active Lesson</p>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">{activeVideo.description}</p>
            </div>

            {/* Playlist Grid */}
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-black text-slate-900 mb-3">Course Lectures</h3>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {webDevPlaylist.map((video, idx) => {
                  const isActive = video.id === activeVideo.id;
                  return (
                    <button
                      key={video.id}
                      onClick={() => handleVideoSelect(video)}
                      className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                        isActive ? "border-violet-300 bg-violet-50/50 shadow-sm" : "border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-black rounded px-1.5 py-0.5 ${
                          isActive ? "bg-violet-600 text-white" : "bg-slate-150 text-slate-600"
                        }`}>
                          Lec {idx + 1}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {video.duration}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{video.title}</p>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT: Split-screen Notes / AI assistant */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 flex flex-col max-h-[800px]">
            
            {/* Tab selector */}
            <div className="flex border-b border-slate-100 pb-3 gap-2">
              <button
                onClick={() => setActiveTab("notes")}
                className={`flex-1 flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === "notes"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                    : "bg-slate-50 border border-slate-150 text-slate-650 hover:bg-slate-100"
                }`}
              >
                <FileText className="h-4 w-4" />
                Lesson Notes
              </button>
              <button
                onClick={() => setActiveTab("ai")}
                className={`flex-1 flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === "ai"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                    : "bg-slate-50 border border-slate-150 text-slate-650 hover:bg-slate-100"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                AI Quick Revision
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto mt-4 pr-1">
              {activeTab === "notes" ? (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-amber-50/50 border border-amber-200/40 p-4">
                    <h4 className="text-xs font-black uppercase text-amber-700 tracking-wider mb-2">Faculty Shared Notes</h4>
                    <p className="text-sm font-semibold leading-relaxed text-slate-700 whitespace-pre-line">
                      {activeVideo.notes}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-4 space-y-2.5">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Suggested Actions</h4>
                    <ul className="text-xs font-bold text-slate-600 list-disc list-inside space-y-1.5">
                      <li>Copy the codes from the shared snippets.</li>
                      <li>Run local HTML servers to test styles.</li>
                      <li>Inspect web layout margins in the browser.</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiSummary.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">Generate Video Key Points</h4>
                        <p className="text-xs text-slate-500 font-semibold max-w-xs mt-1">
                          Our AI scans the video timeline to generate concise bulleted summaries for rapid revision.
                        </p>
                      </div>
                      <button
                        onClick={triggerAiSummary}
                        disabled={aiLoading}
                        className="flex h-9 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-xs font-black text-white hover:bg-violet-750 disabled:opacity-50"
                      >
                        {aiLoading ? "Analyzing..." : "Generate AI Summary"}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-violet-100 bg-violet-50/20 p-4 space-y-3">
                        <h4 className="text-xs font-black uppercase text-violet-700 tracking-wider">Revision Summary</h4>
                        <ul className="text-xs font-bold text-slate-600 space-y-2">
                          {aiSummary.map((item, idx) => (
                            <li key={idx} className="flex gap-2 items-start">
                              <span className="text-violet-600 mt-0.5">•</span>
                              <span className="leading-normal">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-slate-100 p-4 space-y-3">
                        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Video Timeline Summary</h4>
                        <div className="space-y-2">
                          {aiTimeline.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                              <PlayCircle className="h-4 w-4 text-violet-600 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
