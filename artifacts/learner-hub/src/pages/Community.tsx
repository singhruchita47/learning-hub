import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, PlusCircle, Send, ChevronDown, ChevronUp, Flame, Users, TrendingUp, MessageSquare } from "lucide-react";

interface Reply { id: number; author: string; initials: string; text: string; time: string; }
interface Thread {
  id: number; author: string; initials: string; role: string; color: string;
  title: string; body: string; time: string; tag: string; tagColor: string;
  likes: number; replies: Reply[];
}

const initialThreads: Thread[] = [
  {
    id: 1, author: "Priya Sharma", initials: "PS", role: "Student", color: "#4F46E5",
    title: "Best way to revise Binary Trees before exam?", tag: "CS301", tagColor: "#4F46E5",
    body: "Hey everyone! Exam is next week and I'm struggling with tree traversals. Any good resources or tips?",
    time: "2 hrs ago", likes: 14,
    replies: [
      { id: 1, author: "Dr. Sarah Chen", initials: "SC", text: "Try LeetCode's tree problems – start with easy ones. Also, drawing the tree on paper helps a lot!", time: "1 hr ago" },
      { id: 2, author: "Rahul Verma",   initials: "RV", text: "I found visualizing DFS vs BFS with animations on YouTube super helpful. Check 'Back to Back SWE'!", time: "45 min ago" },
    ],
  },
  {
    id: 2, author: "Arjun Singh", initials: "AS", role: "Student", color: "#7C3AED",
    title: "SQL vs NoSQL – which should I focus on for placements?", tag: "CS302", tagColor: "#0EA5E9",
    body: "Placement season is coming. Should I go deep on SQL or also learn MongoDB? What do companies prefer?",
    time: "5 hrs ago", likes: 22,
    replies: [
      { id: 1, author: "Prof. Wilson", initials: "PW", text: "For most software roles, strong SQL skills are must-have. NoSQL is a bonus. Master SQL first!", time: "4 hrs ago" },
    ],
  },
  {
    id: 3, author: "Sneha Reddy", initials: "SR", role: "Student", color: "#0EA5E9",
    title: "Study group for OS final exam – anyone interested?", tag: "CS303", tagColor: "#10B981",
    body: "Looking for 3-4 people to form a study group for the OS exam. We can meet in the library on weekends.",
    time: "1 day ago", likes: 31,
    replies: [],
  },
  {
    id: 4, author: "Dr. Sarah Chen", initials: "SC", role: "Faculty", color: "#10B981",
    title: "📢 Assignment 3 deadline extended to July 8th", tag: "Announcement", tagColor: "#F59E0B",
    body: "Due to server issues, I've extended the CS301 Assignment 3 deadline by 3 days. Please ensure you test your code before submission.",
    time: "2 days ago", likes: 48,
    replies: [
      { id: 1, author: "Arjun Singh",  initials: "AS", text: "Thank you Dr. Chen! 🙏", time: "2 days ago" },
      { id: 2, author: "Priya Sharma", initials: "PS", text: "Much appreciated! Will make sure to submit a quality solution.", time: "2 days ago" },
    ],
  },
];

const tagStyles: Record<string, string> = {
  "CS301":        "bg-indigo-100 text-indigo-700",
  "CS302":        "bg-blue-100 text-blue-700",
  "CS303":        "bg-emerald-100 text-emerald-700",
  "Announcement": "bg-amber-100 text-amber-700",
  "General":      "bg-purple-100 text-purple-700",
};

export default function Community() {
  const [threads, setThreads]       = useState(initialThreads);
  const [likedIds, setLikedIds]     = useState<Set<number>>(new Set());
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [replyText, setReplyText]   = useState<Record<number, string>>({});
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle]     = useState("");
  const [newBody, setNewBody]       = useState("");

  const toggleLike = (id: number) => {
    setLikedIds(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
    setThreads(prev => prev.map(t => t.id === id
      ? { ...t, likes: t.likes + (likedIds.has(id) ? -1 : 1) } : t));
  };

  const sendReply = (threadId: number) => {
    const text = replyText[threadId]?.trim();
    if (!text) return;
    setThreads(prev => prev.map(t => t.id === threadId
      ? { ...t, replies: [...t.replies, { id: Date.now(), author: "You", initials: "AS", text, time: "just now" }] }
      : t));
    setReplyText(prev => ({ ...prev, [threadId]: "" }));
  };

  const postThread = () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    setThreads(prev => [{
      id: Date.now(), author: "You", initials: "AS", role: "Student", color: "#6c5ce7",
      title: newTitle, body: newBody, time: "just now", tag: "General", tagColor: "#6c5ce7",
      likes: 0, replies: [],
    }, ...prev]);
    setNewTitle(""); setNewBody(""); setShowNewPost(false);
  };

  const sortedThreads = useMemo(() =>
    [...threads].sort((a, b) => {
      const aAnn = a.tag === "Announcement";
      const bAnn = b.tag === "Announcement";
      return aAnn === bAnn ? 0 : aAnn ? -1 : 1;
    }), [threads]);

  const totalLikes   = threads.reduce((s, t) => s + t.likes, 0);
  const totalReplies = threads.reduce((s, t) => s + t.replies.length, 0);

  return (
    <div className="min-h-screen bg-[#eef2fb]">
      <div className="mx-auto max-w-[900px] px-4 py-6 md:px-8 space-y-6">

        {/* ── Hero Banner ── */}
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#fdf4ff] via-[#ede9fe] to-[#dbeafe] p-8 shadow-lg">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#6c5ce7]/10" />
          <div className="pointer-events-none absolute bottom-0 left-1/4 h-28 w-28 rounded-full bg-pink-400/10" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#6c5ce7]/10 px-3 py-1.5">
                <Users className="h-4 w-4 text-[#6c5ce7]" />
                <span className="text-xs font-black text-[#6c5ce7]">Student Community</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900">
                Community <span className="text-[#6c5ce7]">Hub</span>
              </h1>
              <p className="mt-1.5 text-sm font-semibold text-slate-500">Discuss, collaborate, ask doubts and learn together.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 shrink-0">
              {[
                { icon: MessageSquare, val: threads.length, label: "Posts",   bg: "bg-[#6c5ce7]/10", txt: "text-[#6c5ce7]" },
                { icon: Heart,         val: totalLikes,     label: "Likes",   bg: "bg-rose-50",      txt: "text-rose-500" },
                { icon: MessageCircle, val: totalReplies,   label: "Replies", bg: "bg-emerald-50",   txt: "text-emerald-600" },
              ].map(({ icon: Icon, val, label, bg, txt }) => (
                <div key={label} className={`rounded-2xl ${bg} p-3 text-center min-w-[72px]`}>
                  <Icon className={`mx-auto mb-1 h-4 w-4 ${txt}`} />
                  <p className={`text-lg font-black ${txt}`}>{val}</p>
                  <p className="text-[10px] font-bold text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Actions bar ── */}
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

        {/* ── New Post form ── */}
        <AnimatePresence>
          {showNewPost && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="rounded-2xl border border-[#6c5ce7]/20 bg-white p-5 shadow-lg"
            >
              <h3 className="mb-3 text-sm font-black text-slate-900">✍️ Create a new post</h3>
              <input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Post title..."
                className="mb-3 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none focus:border-[#6c5ce7]/40 focus:ring-4 focus:ring-[#6c5ce7]/10"
              />
              <textarea
                value={newBody}
                onChange={e => setNewBody(e.target.value)}
                placeholder="Share your question or thoughts..."
                rows={3}
                className="mb-3 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#6c5ce7]/40 focus:ring-4 focus:ring-[#6c5ce7]/10"
              />
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

        {/* ── Thread list ── */}
        <div className="flex flex-col gap-4">
          {sortedThreads.map((thread, i) => {
            const isExpanded = expandedId === thread.id;
            const isLiked    = likedIds.has(thread.id);
            const tagStyle   = tagStyles[thread.tag] ?? "bg-purple-100 text-purple-700";

            return (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow"
                style={{ borderLeft: `4px solid ${thread.color}` }}
              >
                <div className="p-5">
                  {/* Author */}
                  <div className="mb-3 flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-black text-white shadow-md"
                      style={{ background: thread.color }}
                    >
                      {thread.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{thread.author}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 capitalize">{thread.role}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${tagStyle}`}>{thread.tag}</span>
                        {thread.id === 1 && (
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

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-5">
                    <button
                      onClick={() => toggleLike(thread.id)}
                      className={`flex items-center gap-1.5 text-xs font-black transition-colors ${isLiked ? "text-rose-500" : "text-slate-400 hover:text-rose-400"}`}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-rose-500" : ""}`} /> {thread.likes}
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : thread.id)}
                      className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-[#6c5ce7] transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" /> {thread.replies.length} replies
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-[#6c5ce7] transition-colors">
                      <Share2 className="h-4 w-4" /> Share
                    </button>
                  </div>
                </div>

                {/* Replies panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-slate-100 bg-[#f8f7ff]"
                    >
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

                        {/* Reply input */}
                        <div className="flex items-center gap-2 pt-1">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#6c5ce7] text-[10px] font-black text-white">AS</div>
                          <input
                            value={replyText[thread.id] ?? ""}
                            onChange={e => setReplyText(p => ({ ...p, [thread.id]: e.target.value }))}
                            onKeyDown={e => e.key === "Enter" && sendReply(thread.id)}
                            placeholder="Write a reply..."
                            className="flex-1 h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#6c5ce7]/40"
                          />
                          <button
                            onClick={() => sendReply(thread.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6c5ce7] text-white hover:bg-[#5b4bd5] transition-colors"
                          >
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
