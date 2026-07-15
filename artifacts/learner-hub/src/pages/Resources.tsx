import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Video, Download, Search, BookMarked, ExternalLink, CheckCircle2, Library, BookOpen, PlaySquare, Bookmark } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

const categories = ["All", "Lecture Notes", "Practice Papers", "Cheat Sheets"];

const catColors: Record<string, string> = {
  "Lecture Notes":   "bg-indigo-100 text-indigo-700",
  "Practice Papers": "bg-amber-100 text-amber-700",
  "Cheat Sheets":    "bg-cyan-100 text-cyan-700",
};

const catPillActive: Record<string, string> = {
  "All":             "bg-[#6c5ce7] text-white shadow-lg shadow-[#6c5ce7]/30",
  "Lecture Notes":   "bg-indigo-600 text-white shadow-lg shadow-indigo-200",
  "Practice Papers": "bg-amber-500 text-white shadow-lg shadow-amber-200",
  "Cheat Sheets":    "bg-cyan-500 text-white shadow-lg shadow-cyan-200",
};

const catPillInactive: Record<string, string> = {
  "All":             "bg-white/70 text-slate-600 hover:bg-white",
  "Lecture Notes":   "bg-white/70 text-indigo-600 hover:bg-indigo-50",
  "Practice Papers": "bg-white/70 text-amber-600 hover:bg-amber-50",
  "Cheat Sheets":    "bg-white/70 text-cyan-600 hover:bg-cyan-50",
};

interface DynamicResource {
  id: string;
  title: string;
  cat: "Lecture Notes" | "Practice Papers" | "Cheat Sheets";
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
          const mapped = data.resources
            .filter((item: any) => item.category !== "Video Lectures")
            .map((item) => {
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
                icon: cat === "Cheat Sheets" ? BookMarked : FileText,
                color: cat === "Lecture Notes" ? "#4F46E5" : cat === "Practice Papers" ? "#F97316" : "#06B6D4",
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
      { label: "Practice Papers",  value: resources.filter(r => r.cat === "Practice Papers").length, icon: FileText,    bg: "bg-amber-50",     txt: "text-amber-600" },
      { label: "Cheat Sheets",     value: resources.filter(r => r.cat === "Cheat Sheets").length,    icon: Bookmark,    bg: "bg-cyan-50",      txt: "text-cyan-600" },
    ];
  }, [resources]);

  return (
    <div className="px-4 py-6 md:px-8 animate-in fade-in duration-500">
      <div className="mx-auto max-w-[1400px] space-y-6">

        {/* ── Title and Search Row ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Study Resources</h1>
            <p className="text-xs font-semibold text-slate-400 mt-1">Download lecture notes, videos, and practice papers.</p>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-bold text-slate-700 outline-none shadow-sm focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition"
            />
          </div>
        </div>

        {/* ── Stats Cards Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Total Resources",  value: resources.length,                                          txt: "text-[#6c5ce7]" },
            { label: "Lecture Notes",    value: resources.filter(r => r.cat === "Lecture Notes").length,   txt: "text-emerald-600" },
            { label: "Practice Papers",  value: resources.filter(r => r.cat === "Practice Papers").length, txt: "text-amber-500" },
            { label: "Cheat Sheets",     value: resources.filter(r => r.cat === "Cheat Sheets").length,    txt: "text-cyan-500" },
          ].map(({ label, value, txt }) => (
            <div key={label} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col justify-center min-h-[100px]">
              <span className="text-4xl font-black text-slate-900">{value}</span>
              <span className="text-xs font-bold text-slate-400 mt-1">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Filter Pills Row ── */}
        <div className="flex flex-wrap gap-2.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2.5 text-xs font-black transition-all ${
                  isActive
                    ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                    : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ── Content Grid ── */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-bold">Loading study material...</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((res, i) => {
                const isDL = downloaded.has(res.id);
                const badgeColor =
                  res.cat === "Lecture Notes" ? "bg-blue-50 text-blue-600" :
                  res.cat === "Practice Papers" ? "bg-emerald-50 text-emerald-600" :
                  "bg-indigo-50 text-indigo-600";

                return (
                  <motion.div
                    key={res.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-100/50 flex flex-col gap-4 transition hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `${res.color}15` }}>
                        <res.icon className="h-5 w-5" style={{ color: res.color }} />
                      </div>
                      <span className={`rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider ${badgeColor}`}>
                        {res.format}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-base font-extrabold text-slate-800 leading-snug">{res.title}</h3>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 font-semibold">
                        <span className="font-mono font-bold text-indigo-500">{res.code}</span>
                        <span>·</span>
                        <span>{res.size}</span>
                        {res.pages > 0 && (
                          <>
                            <span>·</span>
                            <span>{res.pages}p</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleDownload(res)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-xs font-black text-white transition-all shadow-sm"
                        style={{
                          background: isDL
                            ? "#10B981"
                            : `linear-gradient(135deg, ${res.color}cc, ${res.color})`,
                        }}
                      >
                        {isDL ? <CheckCircle2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                        {isDL ? "Opened!" : "Download"}
                      </motion.button>
                      
                      <button
                        onClick={() => window.open(res.fileUrl, "_blank")}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-colors bg-white shadow-sm"
                      >
                        <ExternalLink className="h-4.5 w-4.5" />
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
            <p className="text-slate-400 font-extrabold text-sm">No study materials in this folder yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
