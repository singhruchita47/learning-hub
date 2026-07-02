import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, PlusCircle, Send, ChevronDown, ChevronUp, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Reply { id: number; author: string; initials: string; text: string; time: string; }
interface Thread { id: number; author: string; initials: string; role: string; color: string; title: string; body: string; time: string; tag: string; tagColor: string; likes: number; replies: Reply[]; }

const initialThreads: Thread[] = [
  {
    id: 1, author: "Priya Sharma", initials: "PS", role: "Student", color: "#4F46E5",
    title: "Best way to revise Binary Trees before exam?", tag: "CS301", tagColor: "#4F46E580",
    body: "Hey everyone! Exam is next week and I'm struggling with tree traversals. Any good resources or tips?",
    time: "2 hrs ago", likes: 14,
    replies: [
      { id: 1, author: "Dr. Sarah Chen", initials: "SC", text: "Try LeetCode's tree problems – start with easy ones. Also, drawing the tree on paper helps a lot!", time: "1 hr ago" },
      { id: 2, author: "Rahul Verma", initials: "RV", text: "I found visualizing DFS vs BFS with animations on YouTube super helpful. Check 'Back to Back SWE'!", time: "45 min ago" },
    ],
  },
  {
    id: 2, author: "Arjun Singh", initials: "AS", role: "Student", color: "#7C3AED",
    title: "SQL vs NoSQL – which should I focus on for placements?", tag: "CS302", tagColor: "#0EA5E980",
    body: "Placement season is coming. Should I go deep on SQL or also learn MongoDB? What do companies prefer?",
    time: "5 hrs ago", likes: 22,
    replies: [
      { id: 1, author: "Prof. Wilson", initials: "PW", text: "For most software roles, strong SQL skills are must-have. NoSQL is a bonus. Master SQL first!", time: "4 hrs ago" },
    ],
  },
  {
    id: 3, author: "Sneha Reddy", initials: "SR", role: "Student", color: "#0EA5E9",
    title: "Study group for OS final exam – anyone interested?", tag: "CS303", tagColor: "#10B98180",
    body: "Looking for 3-4 people to form a study group for the OS exam. We can meet in the library on weekends.",
    time: "1 day ago", likes: 31,
    replies: [],
  },
  {
    id: 4, author: "Dr. Sarah Chen", initials: "SC", role: "Faculty", color: "#10B981",
    title: "📢 Assignment 3 deadline extended to July 8th", tag: "Announcement", tagColor: "#F59E0B80",
    body: "Due to server issues, I've extended the CS301 Assignment 3 deadline by 3 days. Please ensure you test your code before submission.",
    time: "2 days ago", likes: 48,
    replies: [
      { id: 1, author: "Arjun Singh", initials: "AS", text: "Thank you Dr. Chen! 🙏", time: "2 days ago" },
      { id: 2, author: "Priya Sharma", initials: "PS", text: "Much appreciated! Will make sure to submit a quality solution.", time: "2 days ago" },
    ],
  },
];

export default function Community() {
  const [threads, setThreads] = useState(initialThreads);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  const toggleLike = (id: number) => {
    setLikedIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
    setThreads((prev) => prev.map((t) => t.id === id ? { ...t, likes: t.likes + (likedIds.has(id) ? -1 : 1) } : t));
  };

  const sendReply = (threadId: number) => {
    const text = replyText[threadId]?.trim();
    if (!text) return;
    setThreads((prev) => prev.map((t) => t.id === threadId
      ? { ...t, replies: [...t.replies, { id: Date.now(), author: "Arjun Singh", initials: "AS", text, time: "just now" }] }
      : t));
    setReplyText((prev) => ({ ...prev, [threadId]: "" }));
  };

  const postThread = () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    setThreads((prev) => [{
      id: Date.now(), author: "Arjun Singh", initials: "AS", role: "Student", color: "#7C3AED",
      title: newTitle, body: newBody, time: "just now", tag: "General", tagColor: "#7C3AED80",
      likes: 0, replies: [],
    }, ...prev]);
    setNewTitle(""); setNewBody(""); setShowNewPost(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[860px] mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Community</h1>
          <p className="text-muted-foreground mt-1">Discuss, collaborate, and learn together.</p>
        </div>
        <Button onClick={() => setShowNewPost(!showNewPost)} className="gap-2 rounded-full font-bold">
          <PlusCircle className="h-4 w-4" /> New Post
        </Button>
      </div>

      <AnimatePresence>
        {showNewPost && (
          <motion.div initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="rounded-2xl border border-primary/20 bg-primary/5 p-5 mb-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-foreground mb-3">Create a new post</h3>
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Post title..." className="mb-3 bg-white" />
            <textarea value={newBody} onChange={(e) => setNewBody(e.target.value)} placeholder="Share your question or thoughts..."
              rows={3} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3" />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowNewPost(false)} className="rounded-lg font-bold">Cancel</Button>
              <Button size="sm" onClick={postThread} disabled={!newTitle.trim() || !newBody.trim()} className="rounded-lg font-bold gap-1.5">
                <Send className="h-3.5 w-3.5" /> Post
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4">
        {threads.map((thread, i) => {
          const isExpanded = expandedId === thread.id;
          const isLiked = likedIds.has(thread.id);
          return (
            <motion.div key={thread.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white shadow-sm" style={{ background: thread.color }}>
                    {thread.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{thread.author}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 capitalize">{thread.role}</span>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: thread.tagColor }}>{thread.tag}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{thread.time}</span>
                  </div>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-1.5">{thread.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{thread.body}</p>

                <div className="flex items-center gap-4 mt-4">
                  <button onClick={() => toggleLike(thread.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${isLiked ? "text-red-500" : "text-slate-400 hover:text-red-400"}`}>
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500" : ""}`} />
                    {thread.likes}
                  </button>
                  <button onClick={() => setExpandedId(isExpanded ? null : thread.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    {thread.replies.length} replies
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary transition-colors">
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                  {thread.id === 1 && <div className="flex items-center gap-1 text-xs font-bold text-orange-500"><Flame className="h-3.5 w-3.5 fill-orange-400" /> Trending</div>}
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-gray-50 bg-slate-50/50">
                    <div className="px-5 py-4 space-y-3">
                      {thread.replies.map((r) => (
                        <div key={r.id} className="flex items-start gap-3">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-extrabold text-slate-600">{r.initials}</div>
                          <div className="flex-1 rounded-xl bg-white border border-gray-100 px-3 py-2.5 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-extrabold text-slate-800">{r.author}</span>
                              <span className="text-[10px] text-slate-400">{r.time}</span>
                            </div>
                            <p className="text-xs text-slate-600">{r.text}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-white">AS</div>
                        <Input value={replyText[thread.id] ?? ""} onChange={(e) => setReplyText((p) => ({ ...p, [thread.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && sendReply(thread.id)}
                          placeholder="Write a reply..." className="flex-1 h-8 text-xs rounded-full bg-white" />
                        <button onClick={() => sendReply(thread.id)} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
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
  );
}
