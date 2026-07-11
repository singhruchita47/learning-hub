import { motion } from "framer-motion";
import { CalendarClock, CheckCircle2, PlayCircle, Radio, Users, Video } from "lucide-react";

const liveClasses = [
  {
    title: "Data Structures Lab",
    faculty: "Dr. Meera Rao",
    time: "09:30 AM - 10:30 AM",
    subject: "B.Tech CSE - Sem 4",
    status: "Live now",
    active: true,
  },
  {
    title: "Database Normalization",
    faculty: "Prof. Iyer",
    time: "12:00 PM - 01:00 PM",
    subject: "Database Systems",
    status: "Upcoming",
    active: false,
  },
  {
    title: "Operating System Revision",
    faculty: "Dr. Kapoor",
    time: "04:00 PM - 05:00 PM",
    subject: "Operating Systems",
    status: "Upcoming",
    active: false,
  },
];

const completedClasses = [
  ["Engineering Math", "Odd days and calendar problems", "Recorded"],
  ["Computer Networks", "TCP/IP layers recap", "Recorded"],
  ["Python Practice", "Loops and functions drill", "Recorded"],
];

export default function Classes() {
  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1540px]">
        <div className="mb-7 rounded-[2rem] border border-[#d8c8ff] bg-gradient-to-br from-[#f7f2ff]/95 via-[#eee7ff]/90 to-white p-7 text-slate-950 shadow-xl shadow-[#7b35ad]/10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ff7a21]">Live learning module</p>
              <h1 className="mt-2 text-4xl font-black">Classes</h1>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
                Track live sessions, upcoming classes, and completed recordings in one place.
              </p>
            </div>
            <button className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-white/85 px-5 text-sm font-black text-[#34428c] shadow-sm">
              <Radio className="h-4 w-4 text-red-500" />
              Join active class
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="grid gap-5">
            {liveClasses.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className={`rounded-[1.75rem] border bg-white p-5 shadow-lg shadow-slate-200/60 ${
                  item.active ? "border-emerald-200" : "border-slate-200"
                }`}
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      item.active ? "bg-emerald-600 text-white" : "bg-[#7b35ad]/10 text-[#7b35ad]"
                    }`}>
                      {item.active ? <Radio className="h-7 w-7" /> : <Video className="h-7 w-7" />}
                    </div>
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${
                          item.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {item.status}
                        </span>
                        <span className="rounded-full bg-[#ff7a21]/10 px-3 py-1 text-xs font-black text-[#c85519]">
                          {item.subject}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black text-slate-950">{item.title}</h2>
                      <p className="mt-1 text-sm font-bold text-slate-500">{item.faculty}</p>
                      <p className="mt-3 flex items-center gap-2 text-sm font-black text-[#34428c]">
                        <CalendarClock className="h-4 w-4" />
                        {item.time}
                      </p>
                    </div>
                  </div>
                  <button className={`h-12 rounded-2xl px-6 text-sm font-black ${
                    item.active ? "bg-emerald-600 text-white" : "bg-[#34428c] text-white"
                  }`}>
                    {item.active ? "Join now" : "Set reminder"}
                  </button>
                </div>
              </motion.article>
            ))}
          </section>

          <aside className="space-y-6">
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-950">
                <Users className="h-5 w-5 text-[#7b35ad]" />
                Attendance
              </h2>
              <div className="rounded-2xl bg-[#7b35ad]/5 p-5">
                <p className="text-4xl font-black text-[#7b35ad]">94%</p>
                <p className="mt-1 text-sm font-bold text-slate-500">Current semester live class attendance</p>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
              <h2 className="mb-4 text-lg font-black text-slate-950">Completed Classes</h2>
              <div className="space-y-3">
                {completedClasses.map(([subject, title, badge]) => (
                  <div key={title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-slate-500">{badge}</span>
                    </div>
                    <p className="text-sm font-black text-slate-900">{subject}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">{title}</p>
                    <button className="mt-3 flex items-center gap-2 text-xs font-black text-[#7b35ad]">
                      <PlayCircle className="h-4 w-4" />
                      Watch recording
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
