import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Video, Download, Search, BookMarked, ExternalLink, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const categories = ["All", "Lecture Notes", "Video Lectures", "Practice Papers", "Cheat Sheets"];

const allResources = [
  { id: "1",  title: "Data Structures & Algorithms",  cat: "Lecture Notes",   code: "CS301", format: "PDF",  size: "2.4 MB", icon: FileText,   color: "#4F46E5", pages: 87 },
  { id: "2",  title: "Database Management Systems",   cat: "Lecture Notes",   code: "CS302", format: "PDF",  size: "1.8 MB", icon: FileText,   color: "#0EA5E9", pages: 62 },
  { id: "3",  title: "Operating Systems Concepts",    cat: "Lecture Notes",   code: "CS303", format: "PDF",  size: "3.1 MB", icon: FileText,   color: "#10B981", pages: 104 },
  { id: "4",  title: "Computer Networks Notes",       cat: "Lecture Notes",   code: "CS304", format: "PDF",  size: "2.7 MB", icon: FileText,   color: "#F59E0B", pages: 95 },
  { id: "5",  title: "Machine Learning Fundamentals", cat: "Lecture Notes",   code: "CS401", format: "PDF",  size: "4.2 MB", icon: FileText,   color: "#8B5CF6", pages: 138 },
  { id: "6",  title: "Introduction to Binary Trees",  cat: "Video Lectures",  code: "CS301", format: "Video", size: "45 min", icon: Video,      color: "#EF4444", pages: 0 },
  { id: "7",  title: "SQL Joins Explained",           cat: "Video Lectures",  code: "CS302", format: "Video", size: "32 min", icon: Video,      color: "#EF4444", pages: 0 },
  { id: "8",  title: "Memory Management Deep Dive",   cat: "Video Lectures",  code: "CS303", format: "Video", size: "28 min", icon: Video,      color: "#EF4444", pages: 0 },
  { id: "9",  title: "Midterm 2023 Question Paper",   cat: "Practice Papers", code: "CS301", format: "PDF",  size: "0.8 MB", icon: FileText,   color: "#F97316", pages: 12 },
  { id: "10", title: "Final Exam 2022 Paper",         cat: "Practice Papers", code: "CS302", format: "PDF",  size: "1.2 MB", icon: FileText,   color: "#F97316", pages: 16 },
  { id: "11", title: "Python Programming Cheat Sheet",cat: "Cheat Sheets",    code: "CS201", format: "PDF",  size: "1.1 MB", icon: BookMarked, color: "#06B6D4", pages: 8 },
  { id: "12", title: "SQL Quick Reference Card",      cat: "Cheat Sheets",    code: "CS302", format: "PDF",  size: "0.6 MB", icon: BookMarked, color: "#06B6D4", pages: 4 },
];

const catColors: Record<string, string> = {
  "Lecture Notes":   "bg-indigo-100 text-indigo-700",
  "Video Lectures":  "bg-red-100 text-red-600",
  "Practice Papers": "bg-amber-100 text-amber-700",
  "Cheat Sheets":    "bg-cyan-100 text-cyan-700",
};

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());

  const filtered = allResources.filter((r) => {
    const matchCat = activeCategory === "All" || r.cat === activeCategory;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDownload = (id: string) => {
    setDownloaded((prev) => new Set([...prev, id]));
    setTimeout(() => setDownloaded((prev) => { const n = new Set(prev); n.delete(id); return n; }), 2500);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Study Resources</h1>
          <p className="text-muted-foreground mt-1">Download lecture notes, videos, and practice papers.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..." className="w-full rounded-lg bg-white pl-8 shadow-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {[
          { label: "Total Resources", value: allResources.length, color: "#4F46E5" },
          { label: "Lecture Notes",   value: 5, color: "#10B981" },
          { label: "Video Lectures",  value: 3, color: "#EF4444" },
          { label: "Practice Papers", value: 2, color: "#F59E0B" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-7">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
              activeCategory === cat ? "bg-primary text-white shadow-md shadow-primary/25" : "bg-white border border-gray-200 text-slate-600 hover:border-primary/40"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeCategory + search} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((res, i) => {
            const isDL = downloaded.has(res.id);
            return (
              <motion.div key={res.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex flex-col gap-3">
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
                    onClick={() => handleDownload(res.id)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all text-white`}
                    style={{ background: isDL ? "#10B981" : `linear-gradient(135deg, ${res.color}cc, ${res.color})` }}>
                    {isDL ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
                    {isDL ? "Downloaded!" : "Download"}
                  </motion.button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-slate-400 hover:border-primary/30 hover:text-primary transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
      {filtered.length === 0 && (
        <div className="text-center py-16"><div className="text-4xl mb-3">📚</div><p className="text-slate-500 font-medium">No resources found</p></div>
      )}
    </div>
  );
}
