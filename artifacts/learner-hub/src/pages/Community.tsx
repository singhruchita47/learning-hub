import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, PlusCircle, Send, ChevronDown, ChevronUp, Flame, TrendingUp } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

interface Reply { id: number; author: string; initials: string; text: string; time: string; }
interface Thread {
  id: number; author: string; initials: string; role: string; color: string;
  title: string; body: string; time: string; tag: string; tagColor: string;
  likes: number; replies: Reply[];
}

// Removing unused static initialThreads

const tagStyles: Record<string, string> = {
  "CS301":        "bg-indigo-100 text-indigo-700",
  "CS302":        "bg-blue-100 text-blue-700",
  "CS303":        "bg-emerald-100 text-emerald-700",
  "Announcement": "bg-amber-100 text-amber-700",
  "General":      "bg-purple-100 text-purple-700",
};

function timeAgo(dateStr: string) {
  try {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  } catch { return "recently"; }
}

export default function Community() {
  const [threads, setThreads]             = useState<Thread[]>([]);
  const [apiAnnouncements, setApiAnnouncements] = useState<Thread[]>([]);
  const [likedIds, setLikedIds]           = useState<Set<number>>(new Set());
  const [expandedId, setExpandedId]       = useState<number | null>(null);
  const [replyText, setReplyText]         = useState<Record<number, string>>({});
  const [showNewPost, setShowNewPost]     = useState(false);
  const [newTitle, setNewTitle]           = useState("");
  const [newBody, setNewBody]             = useState("");

  const user = (() => {
    try {
      const saved = localStorage.getItem("learningHubUser");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  })();

  const fetchThreads = async () => {
    try {
      const r = await fetch(`${ACADEMIC_API_BASE}/forum/threads`);
      if (r.ok) {
        const data = await r.json();
        setThreads(data.threads || []);
      }
    } catch {}
  };

  useEffect(() => {
    fetchThreads();
    fetch(`${ACADEMIC_API_BASE}/notifications`)
      .then(r => r.ok ? r.json() : null)
      .then((data: any) => {
        if (!data) return;
        const notifs: any[] = data.notifications || [];
        const announcements: Thread[] = notifs
          .filter(n => n.audience === "student" || n.audience === "all")
          .map((n, i) => {
            const poster = n.postedBy || n.author || "Faculty / Admin";
            return {
              id: 90000 + i,
              author: poster,
              initials: poster.split(" ").map((w: string) => w[0] ?? "").join("").slice(0, 2).toUpperCase() || "FA",
              role: "Faculty",
              color: "#F59E0B",
              title: `📢 ${n.title}`,
              body: n.message,
              time: timeAgo(n.createdAt),
              tag: "Announcement",
              tagColor: "#F59E0B",
              likes: 0,
              replies: [],
            };
          });
        setApiAnnouncements(announcements);
      })
      .catch(() => {});
  }, []);

  const toggleLike = async (id: number) => {
    const isAlreadyLiked = likedIds.has(id);
    setLikedIds(prev => { const n = new Set(prev); isAlreadyLiked ? n.delete(id) : n.add(id); return n; });
    const delta = isAlreadyLiked ? -1 : 1;
    setThreads(prev => prev.map(t => t.id === id ? { ...t, likes: Math.max(0, t.likes + delta) } : t));
    setApiAnnouncements(prev => prev.map(t => t.id === id ? { ...t, likes: Math.max(0, t.likes + delta) } : t));
    
    if (id < 90000) {
      await fetch(`${ACADEMIC_API_BASE}/forum/threads/${id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta })
      });
    }
  };

  const sendReply = async (threadId: number) => {
    const text = replyText[threadId]?.trim();
    if (!text) return;

    const author = user?.name || "Student";
    const initials = author.substring(0, 2).toUpperCase();

    try {
      const res = await fetch(`${ACADEMIC_API_BASE}/forum/threads/${threadId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, initials, text })
      });
      if (res.ok) {
        const data = await res.json();
        const newReply = data.reply;
        setThreads(prev => prev.map(t => t.id === threadId ? { ...t, replies: [...t.replies, newReply] } : t));
        setApiAnnouncements(prev => prev.map(t => t.id === threadId ? { ...t, replies: [...t.replies, newReply] } : t));
      }
    } catch {}
    
    setReplyText(prev => ({ ...prev, [threadId]: "" }));
  };

  const postThread = async () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    
    const author = user?.name || "Student";
    const initials = author.substring(0, 2).toUpperCase();
    const role = user?.role || "student";

    try {
      const res = await fetch(`${ACADEMIC_API_BASE}/forum/threads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author, initials, role, color: "#6c5ce7", title: newTitle, body: newBody, tag: "General", tagColor: "#6c5ce7"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setThreads(prev => [data.thread, ...prev]);
      }
    } catch {}
    
    setNewTitle(""); setNewBody(""); setShowNewPost(false);
  };

  const allThreads = useMemo(() => [
    ...apiAnnouncements,
    ...threads,
  ], [threads, apiAnnouncements]);

  const totalLikes   = allThreads.reduce((s, t) => s + t.likes, 0);
  const totalReplies = allThreads.reduce((s, t) => s + t.replies.length, 0);

  return (
    <div className="px-4 py-6 md:px-8 animate-in fade-in duration-500">
      <div className="mx-auto max-w-[1000px] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Community Hub</h1>
            <p className="text-xs font-semibold text-slate-400 mt-1">Discuss, collaborate, ask doubts — and see all faculty notices here.</p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-2xl bg-[#6c5ce7]/10 border border-[#6c5ce7]/20 px-4 py-2.5 text-xs font-bold text-[#6c5ce7] shadow-sm shrink-0">
            <span>💬</span>
            <span>{allThreads.length} Active Discussions</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {[
            { label: "Posts",   value: allThreads.length },
            { label: "Likes",   value: totalLikes },
            { label: "Replies", value: totalReplies },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col justify-center min-h-[100px] text-center">
              <span className="text-4xl font-black text-slate-900">{value}</span>
              <span className="text-xs font-bold text-slate-400 mt-1">{label}</span>
            </div>
          ))}
        </div>

        {apiAnnouncements.length > 0 && (
          <div className="flex items-center gap-2 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-2.5">
            <span className="text-base">📌</span>
            <span className="text-xs font-black text-amber-800">
              {apiAnnouncements.length} official notice{apiAnnouncements.length > 1 ? "s" : ""} pinned from Faculty / Admin
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
            <TrendingUp className="h-5 w-5 text-[#6c5ce7]" /> Discussions
          </h2>
          <button
            onClick={() => setShowNewPost(v => !v)}
            className="flex items-center gap-2 rounded-xl bg-[#6c5ce7] px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-[#6c5ce7]/25 transition hover:bg-[#5b4bd5]"
          >
            <PlusCircle className="h-4 w-4" /> New Post
          </button>
        </div>

        <AnimatePresence>
          {showNewPost && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="rounded-2xl border border-[#6c5ce7]/20 bg-white p-5 shadow-lg"
            >
              <h3 className="mb-3 text-sm font-black text-slate-900">✍️ Create a new post</h3>
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Post title..."
                className="mb-3 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none focus:border-[#6c5ce7]/40 focus:ring-4 focus:ring-[#6c5ce7]/10" />
              <textarea value={newBody} onChange={e => setNewBody(e.target.value)} placeholder="Share your question or thoughts..." rows={3}
                className="mb-3 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#6c5ce7]/40 focus:ring-4 focus:ring-[#6c5ce7]/10" />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowNewPost(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={postThread} disabled={!newTitle.trim() || !newBody.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-[#6c5ce7] px-4 py-2 text-xs font-black text-white disabled:opacity-50">
                  <Send className="h-3.5 w-3.5" /> Post
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-4">
          {allThreads.map((thread, i) => {
            const isExpanded     = expandedId === thread.id;
            const isLiked        = likedIds.has(thread.id);
            const tagStyle       = tagStyles[thread.tag] ?? "bg-purple-100 text-purple-700";
            const isAnnouncement = thread.tag === "Announcement";

            return (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow ${isAnnouncement ? "ring-1 ring-amber-200" : ""}`}
                style={{ borderLeft: `4px solid ${thread.color}` }}
              >
                {isAnnouncement && (
                  <div className="bg-amber-50 px-5 py-1.5 flex items-center gap-2 border-b border-amber-100">
                    <span className="text-xs font-black text-amber-700">📌 Official Notice from {thread.author}</span>
                  </div>
                )}

                <div className="p-5">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-black text-white shadow-md" style={{ background: thread.color }}>
                      {thread.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{thread.author}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 capitalize">{thread.role}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${tagStyle}`}>{thread.tag}</span>
                        {!isAnnouncement && i === apiAnnouncements.length && (
                          <span className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-black text-orange-600">
                            <Flame className="h-3 w-3 fill-orange-400" /> Trending
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">{thread.time}</span>
                    </div>
                  </div>

                  <h3 className="mb-2 text-sm font-black text-slate-900">{thread.title}</h3>
                  <p className="text-sm font-semibold leading-relaxed text-slate-600">{thread.body}</p>

                  <div className="mt-4 flex items-center gap-5">
                    <button onClick={() => toggleLike(thread.id)}
                      className={`flex items-center gap-1.5 text-xs font-black transition-colors ${isLiked ? "text-rose-500" : "text-slate-400 hover:text-rose-400"}`}>
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-rose-500" : ""}`} /> {thread.likes}
                    </button>
                    <button onClick={() => setExpandedId(isExpanded ? null : thread.id)}
                      className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-[#6c5ce7] transition-colors">
                      <MessageCircle className="h-4 w-4" /> {thread.replies.length} replies
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-[#6c5ce7] transition-colors">
                      <Share2 className="h-4 w-4" /> Share
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-slate-100 bg-[#f8f7ff]">
                      <div className="space-y-3 px-5 py-4">
                        {thread.replies.map(r => (
                          <div key={r.id} className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#6c5ce7]/10 text-[10px] font-black text-[#6c5ce7]">{r.initials}</div>
                            <div className="flex-1 rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm">
                              <div className="mb-1 flex items-center gap-2">
                                <span className="text-xs font-black text-slate-900">{r.author}</span>
                                <span className="text-[10px] text-slate-400">{r.time}</span>
                              </div>
                              <p className="text-xs font-semibold text-slate-600">{r.text}</p>
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center gap-2 pt-1">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#6c5ce7] text-[10px] font-black text-white">ME</div>
                          <input value={replyText[thread.id] ?? ""} onChange={e => setReplyText(p => ({ ...p, [thread.id]: e.target.value }))}
                            onKeyDown={e => e.key === "Enter" && sendReply(thread.id)} placeholder="Write a reply..."
                            className="flex-1 h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#6c5ce7]/40" />
                          <button onClick={() => sendReply(thread.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6c5ce7] text-white hover:bg-[#5b4bd5] transition-colors">
                            <Send className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
