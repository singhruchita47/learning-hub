import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Video, Download, Search, BookMarked, ExternalLink, CheckCircle2, Library, BookOpen, PlaySquare, Bookmark } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

const categories = ["All", "Lecture Notes", "Video Lectures", "Practice Papers", "Cheat Sheets"];

const catColors: Record<string, string> = {
  "Lecture Notes":   "bg-indigo-100 text-indigo-700",
  "Video Lectures":  "bg-red-100 text-red-600",
  "Practice Papers": "bg-amber-100 text-amber-700",
  "Cheat Sheets":    "bg-cyan-100 text-cyan-700",
};

const catPillActive: Record<string, string> = {
  "All":             "bg-[#6c5ce7] text-white shadow-lg shadow-[#6c5ce7]/30",
  "Lecture Notes":   "bg-indigo-600 text-white shadow-lg shadow-indigo-200",
  "Video Lectures":  "bg-red-500 text-white shadow-lg shadow-red-200",
  "Practice Papers": "bg-amber-500 text-white shadow-lg shadow-amber-200",
  "Cheat Sheets":    "bg-cyan-500 text-white shadow-lg shadow-cyan-200",
};

const catPillInactive: Record<string, string> = {
  "All":             "bg-white/70 text-slate-600 hover:bg-white",
  "Lecture Notes":   "bg-white/70 text-indigo-600 hover:bg-indigo-50",
  "Video Lectures":  "bg-white/70 text-red-600 hover:bg-red-50",
  "Practice Papers": "bg-white/70 text-amber-600 hover:bg-amber-50",
  "Cheat Sheets":    "bg-white/70 text-cyan-600 hover:bg-cyan-50",
};

interface DynamicResource {
  id: string;
  title: string;
  cat: "Lecture Notes" | "Video Lectures" | "Practice Papers" | "Cheat Sheets";
  code: string;
  format: "PDF" | "Video";
  size: string;
  pages: number;
  fileUrl: string;
  icon: any;
  color: string;
}

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());
  const [resources, setResources] = useState<DynamicResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResources() {
      try {
        const response = await fetch(`${ACADEMIC_API_BASE}/resources`);
        if (!response.ok) throw new Error("API error");
        const data = await response.json() as { resources?: any[] };
        if (data.resources) {
          const mapped = data.resources.map((item) => {
            const cat = item.category as any;
            return {
              id: item._id,
              title: item.title,
              cat,
              code: item.courseCode,
              format: item.format,
              size: item.size || "1.2 MB",
              pages: item.pages || 0,
              fileUrl: item.fileUrl,
              icon: item.format === "Video" ? Video : cat === "Cheat Sheets" ? BookMarked : FileText,
              color: cat === "Video Lectures" ? "#EF4444" : cat === "Lecture Notes" ? "#4F46E5" : cat === "Practice Papers" ? "#F97316" : "#06B6D4",
            };
          });
          setResources(mapped);
        }
      } catch {
        // Empty if API is offline as requested to avoid fltu khali items
        setResources([]);
      } finally {
        setLoading(false);
      }
    }
    void loadResources();
  }, []);

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchCat = activeCategory === "All" || r.cat === activeCategory;
      const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [resources, activeCategory, search]);

  const handleDownload = (res: DynamicResource) => {
    setDownloaded((prev) => new Set([...prev, res.id]));
    window.open(res.fileUrl, "_blank");
    setTimeout(() => setDownloaded((prev) => { const n = new Set(prev); n.delete(res.id); return n; }), 2500);
  };

  const stats = useMemo(() => {
    return [
      { label: "Total Resources",  value: resources.length,                                          icon: Library,     bg: "bg-[#6c5ce7]/10", txt: "text-[#6c5ce7]" },
      { label: "Lecture Notes",    value: resources.filter(r => r.cat === "Lecture Notes").length,   icon: BookOpen,    bg: "bg-red-50",       txt: "text-red-600" },
      { label: "Video Lectures",   value: resources.filter(r => r.cat === "Video Lectures").length,  icon: PlaySquare,  bg: "bg-amber-50",     txt: "text-amber-600" },
      { label: "Cheat Sheets",     value: resources.filter(r => r.cat === "Cheat Sheets").length,    icon: Bookmark,    bg: "bg-cyan-50",      txt: "text-cyan-600" },
    ];
  }, [resources]);

  return (
    <div className="min-h-screen bg-[#eef2fb]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-8 space-y-5">

        {/* ── Page Header ── */}
        <section className="relative overflow-hidden rounded-2xl bg-white px-8 py-6 shadow-sm ring-1 ring-slate-100">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-50 to-transparent" />
          <div className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rounded-full bg-indigo-100/50 blur-2xl" />

          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Student Module</p>
              <h1 className="mt-1 text-3xl font-black text-slate-900">Study <span className="text-indigo-600">Resources</span></h1>
              <p className="mt-1.5 text-xs font-semibold text-slate-400">PDFs, video lectures, cheat sheets and practice papers — all in one place.</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {stats.map(({ label, value, icon: Icon, bg, txt }) => (
                  <span key={label} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black ring-1 ${bg} ${txt} ring-current/20`}>
                    <span className="text-sm font-black">{value}</span> {label}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input type="search" placeholder="Search resources…" value={search} onChange={(e) => setSearch(e.target.value)}
                    className="h-8 w-44 rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs font-bold text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                </div>
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-black transition-all ${
                        isActive ? catPillActive[cat] ?? "bg-indigo-600 text-white" : "border border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                      }`}>{cat}</button>
                  );
                })}
              </div>
            </div>
            <div className="relative ml-6 hidden shrink-0 lg:block">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 shadow-inner">
                <span className="text-5xl select-none">📚</span>
              </div>
              <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-rose-400 text-sm shadow-md">📌</div>
            </div>
          </div>
        </section>

        {/* Folder Tabs Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.filter(c => c !== "All").map((cat) => {
            const isActive = activeCategory === cat;
            const colors = catColors[cat] || "bg-indigo-50 text-indigo-700";
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(isActive ? "All" : cat)}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                  isActive
                    ? "border-violet-300 bg-violet-50/50 shadow-md shadow-violet-100"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${colors}`}>
                  📁
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Folder</p>
                  <p className="text-sm font-extrabold text-slate-900 truncate">{cat}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* List Grid */}
        {loading ? (
          <div className="text-center py-10 text-slate-500 font-bold">Loading study material...</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory + search} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((res, i) => {
                const isDL = downloaded.has(res.id);
                return (
                  <motion.div key={res.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}
                    className="rounded-2xl border-l-4 border-gray-100 bg-white p-5 shadow-sm flex flex-col gap-3"
                    style={{ borderLeftColor: res.color }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${res.color}18` }}>
                        <res.icon className="h-5 w-5" style={{ color: res.color }} />
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${catColors[res.cat]}`}>
                        {res.format}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-extrabold text-slate-800 leading-tight">{res.title}</h3>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                        <span className="font-mono font-bold text-indigo-600">{res.code}</span>
                        <span>·</span><span>{res.size}</span>
                        {res.pages > 0 && <><span>·</span><span>{res.pages}p</span></>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={() => handleDownload(res)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all text-white`}
                        style={{ background: isDL ? "#10B981" : `linear-gradient(135deg, ${res.color}cc, ${res.color})` }}>
                        {isDL ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
                        {isDL ? "Opened!" : "Open Material"}
                      </motion.button>
                      <button
                        onClick={() => window.open(res.fileUrl, "_blank")}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-slate-400 hover:border-primary/30 hover:text-primary transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📂</div>
            <p className="text-slate-500 font-medium">No study materials in this folder yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
