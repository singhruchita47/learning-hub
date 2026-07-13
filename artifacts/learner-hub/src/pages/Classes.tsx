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
        setLiveClasses([
          {
            _id: "lc1",
            title: "Data Structures Lab",
            courseCode: "B.Tech CSE - Sem 4",
            facultyId: "Dr. Meera Rao",
            startsAt: dateNow.toISOString(),
            meetingUrl: "https://meet.jit.si/sgsu-ds-lab",
            status: "live",
          },
          {
            _id: "lc2",
            title: "Database Normalization",
            courseCode: "Database Systems",
            facultyId: "Prof. Iyer",
            startsAt: new Date(Date.now() + 3600000).toISOString(),
            meetingUrl: "https://meet.jit.si/sgsu-db-normalization",
            status: "scheduled",
          },
          {
            _id: "lc3",
            title: "Operating System Revision",
            courseCode: "Operating Systems",
            facultyId: "Dr. Kapoor",
            startsAt: new Date(Date.now() + 7200000).toISOString(),
            meetingUrl: "https://meet.jit.si/sgsu-os-revision",
            status: "scheduled",
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    void fetchClasses();
  }, []);

  const activeClass = liveClasses.find((c) => c.status === "live");
  const liveCount = liveClasses.filter(c => c.status === "live").length;
  const scheduledCount = liveClasses.filter(c => c.status === "scheduled").length;
  const completedCount = liveClasses.filter(c => c.status === "completed").length;

  function handleJoinClass(meetingUrl?: string) {
    const url = meetingUrl || "https://meet.jit.si/sgsu-virtual-classroom";
    window.open(url, "_blank");
  }

  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8 animate-in fade-in duration-500">
      <div className="mx-auto max-w-[1540px] space-y-6">

        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#e0f2fe] via-[#ede9fe] to-[#fdf4ff] p-8 shadow-lg">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-blue-400/10" />
          <div className="pointer-events-none absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-[#6c5ce7]/10" />
          <div className="pointer-events-none absolute -bottom-4 right-1/3 h-36 w-36 rounded-full bg-pink-400/10" />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1.5">
                <Radio className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-black text-blue-600">Live Learning Module</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 md:text-5xl">
                Live <span className="text-blue-600">Classes</span>
              </h1>
              <p className="mt-2 max-w-xl text-sm font-semibold text-slate-500">
                Track live sessions, upcoming classes, and completed recordings — join with one click.
              </p>

              {/* Join Live button */}
              <button
                onClick={() => handleJoinClass(activeClass?.meetingUrl)}
                disabled={!activeClass}
                className={`mt-5 flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black transition-all ${
                  activeClass
                    ? "bg-green-500 text-white shadow-md shadow-green-200 hover:bg-green-600"
                    : "bg-white/85 text-slate-400 border border-slate-200 cursor-not-allowed"
                }`}
              >
                {activeClass && (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                  </span>
                )}
                <Radio className={`h-4 w-4 ${activeClass ? "text-white" : "text-slate-400"}`} />
                {activeClass ? "Join Live Class Now" : "No active live class"}
              </button>
            </div>

            {/* Stats mini cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-green-50 p-4 text-center">
                <Radio className="mx-auto mb-1 h-5 w-5 text-green-600" />
                <p className="text-xl font-black text-green-600">{liveCount}</p>
                <p className="text-[10px] font-bold text-slate-400">Live Now</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-4 text-center">
                <CalendarClock className="mx-auto mb-1 h-5 w-5 text-blue-600" />
                <p className="text-xl font-black text-blue-600">{scheduledCount}</p>
                <p className="text-[10px] font-bold text-slate-400">Scheduled</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4 text-center">
                <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-slate-500" />
                <p className="text-xl font-black text-slate-500">{completedCount}</p>
                <p className="text-[10px] font-bold text-slate-400">Completed</p>
              </div>
            </div>
          </div>
        </section>

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
                const isCompleted = item.status === "completed";
                const startTimeStr = new Date(item.startsAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <motion.article
                    key={item._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className={`rounded-[1.75rem] border-l-4 bg-white p-5 shadow-lg ${
                      isLive
                        ? "border-l-green-500 shadow-green-50/40 ring-1 ring-green-100"
                        : isCompleted
                        ? "border-l-slate-300 shadow-slate-100/60"
                        : "border-l-blue-500 shadow-blue-50/40"
                    }`}
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                          isLive
                            ? "bg-green-500 text-white"
                            : isCompleted
                            ? "bg-slate-100 text-slate-500"
                            : "bg-blue-500/10 text-blue-600"
                        }`}>
                          {isLive
                            ? <Radio className="h-7 w-7 animate-pulse" />
                            : isCompleted
                            ? <CheckCircle2 className="h-7 w-7" />
                            : <Video className="h-7 w-7" />
                          }
                        </div>
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            {isLive ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                                </span>
                                LIVE
                              </span>
                            ) : isCompleted ? (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                                Recorded
                              </span>
                            ) : (
                              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
                                Scheduled
                              </span>
                            )}
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
                              {item.courseCode}
                            </span>
                          </div>
                          <h2 className="text-2xl font-black text-slate-950">{item.title}</h2>
                          <p className="mt-1 text-sm font-bold text-slate-500">Instructor ID: {item.facultyId}</p>
                          <p className="mt-3 flex items-center gap-2 text-sm font-black text-[#34428c]">
                            <CalendarClock className="h-4 w-4" />
                            Starts at: {startTimeStr}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleJoinClass(item.meetingUrl)}
                        disabled={isCompleted}
                        className={`h-12 rounded-2xl px-6 text-sm font-black transition-all ${
                          isLive
                            ? "bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-200"
                            : isCompleted
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                        }`}
                      >
                        {isLive ? "Join Now" : isCompleted ? "Completed" : "Open link"}
                      </button>
                    </div>
                  </motion.article>
                );
              })}

              {liveClasses.length === 0 && (
                <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-white p-12 text-center">
                  <p className="text-slate-550 font-black text-base">No active or scheduled classes found</p>
                  <p className="text-xs text-slate-400 font-bold mt-1">Please check back later.</p>
                </div>
              )}
            </section>

            {/* Attendance sidebar */}
            <aside className="space-y-6">
              <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-950">
                  <Users className="h-5 w-5 text-[#6c5ce7]" />
                  Attendance
                </h2>
                <div className="rounded-2xl bg-[#6c5ce7]/5 p-5">
                  <p className="text-4xl font-black text-[#6c5ce7]">94%</p>
                  <p className="mt-1 text-sm font-bold text-slate-500">Current semester live class attendance</p>
                </div>
              </section>

              {/* Completed classes (fallback display) */}
              <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-950">
                  <PlayCircle className="h-5 w-5 text-slate-500" />
                  Past Recordings
                </h2>
                <div className="space-y-3">
                  {completedClassesFallback.map(([subject, topic, badge]) => (
                    <div key={topic} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200">
                        <PlayCircle className="h-4 w-4 text-slate-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-slate-700 truncate">{subject}</p>
                        <p className="text-[10px] font-bold text-slate-400 truncate">{topic}</p>
                      </div>
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-black text-slate-500">
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
