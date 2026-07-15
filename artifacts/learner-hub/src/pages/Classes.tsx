import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarClock, CheckCircle2, PlayCircle, Radio, Users, Video, Loader } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

interface LiveClassItem {
  _id: string;
  title: string;
  courseCode: string;
  facultyId: string;
  startsAt: string;
  meetingUrl?: string;
  status: "scheduled" | "live" | "completed";
}

const completedClassesFallback = [
  ["Engineering Math", "Odd days and calendar problems", "Recorded"],
  ["Computer Networks", "TCP/IP layers recap", "Recorded"],
  ["Python Practice", "Loops and functions drill", "Recorded"],
];

export default function Classes() {
  const [liveClasses, setLiveClasses] = useState<LiveClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch(`${ACADEMIC_API_BASE}/live-classes`);
        if (!res.ok) throw new Error("API Offline");
        const data = await res.json() as { liveClasses: LiveClassItem[] };
        setLiveClasses(data.liveClasses || []);
      } catch {
        // Fallback static list
        const dateNow = new Date();
        const fallbackData: any[] = [
          {
            _id: "lc1",
            title: "Data Structures Lab",
            courseCode: "B.Tech CSE - Sem 4",
            facultyId: "Dr. Meera Rao",
            startsAt: dateNow.toISOString(),
            meetingUrl: "https://meet.google.com/abc-defg-hij",
            status: "live",
          },
          {
            _id: "lc2",
            title: "Database Normalization",
            courseCode: "Database Systems",
            facultyId: "Prof. Iyer",
            startsAt: new Date(Date.now() + 3600000).toISOString(),
            meetingUrl: "https://zoom.us/j/123456789",
            status: "scheduled",
          },
          {
            _id: "lc3",
            title: "Operating System Revision",
            courseCode: "Operating Systems",
            facultyId: "Dr. Kapoor",
            startsAt: new Date(Date.now() + 7200000).toISOString(),
            meetingUrl: "https://meet.google.com/xyz-uvwx-yz",
            status: "scheduled",
          }
        ];
        const local = JSON.parse(localStorage.getItem('local_live_classes') || '[]');
        if (local.length > 0) {
          setLiveClasses(local);
        } else {
          setLiveClasses(fallbackData);
        }
      } finally {
        setLoading(false);
      }
    }
    void fetchClasses();
  }, []);

  const activeClass = liveClasses.find((c) => c.status === "live");
  const liveCount = liveClasses.filter(c => c.status === "live").length;
  const scheduledCount = liveClasses.filter(c => c.status === "scheduled").length;
  const completedCount = liveClasses.filter(c => c.status === "completed" || c.status === "ended").length;

  function handleJoinClass(meetingUrl?: string) {
    const url = meetingUrl || "#";
    if (url !== "#") {
      window.open(url, "_blank");
    } else {
      alert("No meeting link provided for this class.");
    }
  }

  return (
    <main className="px-4 py-6 md:px-8 animate-in fade-in duration-500">
      <div className="mx-auto max-w-[1400px] space-y-6">

        {/* ── Title and Live Status Row ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Live Classes</h1>
            <p className="text-xs font-semibold text-slate-400 mt-1">Track live sessions, upcoming classes, and completed recordings — join with one click.</p>
          </div>
          {activeClass ? (
            <button
              onClick={() => handleJoinClass(activeClass.meetingUrl)}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 text-white px-4 py-2.5 text-xs font-black shadow-lg shadow-emerald-400/25 hover:bg-emerald-600 transition shrink-0"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span>Join Active Session Now</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-500 shadow-sm shrink-0">
              <span>🔕</span>
              <span>No Active Live Class</span>
            </div>
          )}
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Total Sessions", value: liveClasses.length },
            { label: "Live Now",       value: liveCount },
            { label: "Scheduled",      value: scheduledCount },
            { label: "Completed",      value: completedCount },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col justify-center min-h-[100px]">
              <span className="text-4xl font-black text-slate-900">{value}</span>
              <span className="text-xs font-bold text-slate-400 mt-1">{label}</span>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader className="h-8 w-8 animate-spin text-[#6c5ce7]" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">

            {/* Live & Scheduled classes list */}
            <section className="grid gap-5">
              {liveClasses.map((item, index) => {
                const isLive = item.status === "live";
                const isCompleted = item.status === "completed" || item.status === "ended";
                const startTimeStr = new Date(item.startsAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit"
                });

                // Status Badge Color
                const badgeColor =
                  isLive ? "bg-green-50 text-green-700 border-green-100" :
                  isCompleted ? "bg-slate-50/70 text-slate-500 border-slate-100" :
                  "bg-blue-50 text-blue-700 border-blue-100";

                return (
                  <motion.article
                    key={item._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-100/50 flex flex-col justify-between gap-5 transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shrink-0 ${
                          isLive
                            ? "bg-green-500 text-white"
                            : isCompleted
                            ? "bg-slate-100 text-slate-500"
                            : "bg-blue-50 text-blue-600"
                        }`}>
                          {isLive
                            ? <Radio className="h-6 w-6 animate-pulse" />
                            : isCompleted
                            ? <CheckCircle2 className="h-6 w-6" />
                            : <Video className="h-6 w-6" />
                          }
                        </div>
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${badgeColor}`}>
                              {item.status}
                            </span>
                            <span className="rounded-full bg-slate-50 border border-slate-100 px-2.5 py-0.5 text-[10px] font-black text-slate-500">
                              {item.courseCode}
                            </span>
                          </div>
                          <h2 className="text-xl font-black text-slate-800 leading-snug">{item.title}</h2>
                          <p className="mt-1 text-xs font-bold text-slate-400">Instructor: {item.facultyId}</p>
                          <p className="mt-3 flex items-center gap-2 text-xs font-black text-violet-600">
                            <CalendarClock className="h-4 w-4 text-violet-500" />
                            Starts at: {startTimeStr}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleJoinClass(item.meetingUrl)}
                        disabled={isCompleted}
                        className={`h-11 rounded-2xl px-6 text-xs font-black transition-all shrink-0 ${
                          isLive
                            ? "bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-200"
                            : isCompleted
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                        }`}
                      >
                        {isLive ? "Join Now" : isCompleted ? "Class Ended" : "Open link"}
                      </button>
                    </div>
                  </motion.article>
                );
              })}

              {liveClasses.length === 0 && (
                <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-12 text-center">
                  <p className="text-slate-400 font-extrabold text-sm">No active or scheduled classes found.</p>
                </div>
              )}
            </section>

            {/* Attendance sidebar */}
            <aside className="space-y-6">
              <section className="rounded-[2rem] border border-slate-100/50 bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-base font-black text-slate-800">
                  <Users className="h-5 w-5 text-[#6c5ce7]" />
                  Attendance
                </h2>
                <div className="rounded-2xl bg-[#6c5ce7]/5 p-5 border border-purple-100/10">
                  <p className="text-4xl font-black text-slate-900">94%</p>
                  <p className="mt-1 text-xs font-bold text-slate-400 leading-normal">Current semester live class attendance</p>
                </div>
              </section>

              {/* Completed classes (fallback display) */}
              <section className="rounded-[2rem] border border-slate-100/50 bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-base font-black text-slate-800">
                  <PlayCircle className="h-5 w-5 text-slate-500" />
                  Past Recordings
                </h2>
                <div className="space-y-3">
                  {completedClassesFallback.map(([subject, topic, badge]) => (
                    <div key={topic} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-100/50">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-500">
                        <PlayCircle className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-slate-700 truncate leading-snug">{subject}</p>
                        <p className="text-[10px] font-bold text-slate-400 truncate mt-0.5">{topic}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black text-slate-500">
                        {badge}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </aside>

          </div>
        )}
      </div>
    </main>
  );
}
