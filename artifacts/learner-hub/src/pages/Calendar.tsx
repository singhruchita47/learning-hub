import { useMemo, useState } from "react";
import { Calendar as CalendarIcon, Clock, FileText, Radio, Video } from "lucide-react";
import { Calendar as InteractiveCalendar } from "@/components/ui/calendar";

const scheduleItems = [
  { date: "2026-07-08", title: "Operating Systems quiz", time: "11:30 AM", type: "Quiz", color: "bg-red-50 text-red-700", icon: FileText },
  { date: "2026-07-08", title: "Data Structures live lab", time: "02:00 PM", type: "Live Class", color: "bg-emerald-50 text-emerald-700", icon: Radio },
  { date: "2026-07-09", title: "Database assignment checkpoint", time: "04:30 PM", type: "Assignment", color: "bg-[#7b35ad]/10 text-[#7b35ad]", icon: FileText },
  { date: "2026-07-12", title: "AI Fundamentals live class", time: "04:00 PM", type: "Live Class", color: "bg-orange-50 text-orange-700", icon: Video },
];

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatLongDate(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date("2026-07-08"));

  const selectedEvents = useMemo(() => {
    if (!selectedDate) return [];
    return scheduleItems.filter((item) => item.date === formatDateKey(selectedDate));
  }, [selectedDate]);

  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1540px]">
        <section className="mb-6 rounded-[2rem] border border-[#d8c8ff] bg-gradient-to-br from-[#f7f2ff]/95 via-[#eee7ff]/90 to-white p-7 text-slate-950 shadow-xl shadow-[#7b35ad]/10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff7a21]">Academic planner</p>
              <h1 className="mt-2 text-4xl font-black">Calendar & Schedule</h1>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
                Track live classes, assignments, quizzes, and study sessions in one clean SGSU planner.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                ["4", "Events"],
                ["2", "Live"],
                ["1", "Quiz"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-white/85 px-5 py-3 text-center shadow-sm">
                  <p className="text-2xl font-black">{value}</p>
                  <p className="text-xs font-bold text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950">Academic Calendar</h2>
                <p className="mt-1 text-sm font-bold text-slate-500">Select a date to view planned work.</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7b35ad]/10 text-[#7b35ad]">
                <CalendarIcon className="h-6 w-6" />
              </div>
            </div>

            <InteractiveCalendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4 [--cell-size:3.25rem]"
              classNames={{
                root: "w-full",
                month: "w-full",
                table: "w-full border-collapse",
                weekdays: "grid grid-cols-7",
                week: "mt-2 grid grid-cols-7",
                weekday: "text-center text-xs font-black text-slate-400",
              }}
            />
          </section>

          <aside className="space-y-6">
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
              <p className="text-sm font-black text-[#7b35ad]">
                {selectedDate ? formatLongDate(selectedDate) : "No date selected"}
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-950">Scheduled Items</h2>

              <div className="mt-5 space-y-3">
                {selectedEvents.length > 0 ? (
                  selectedEvents.map((event) => {
                    const Icon = event.icon;
                    return (
                      <div key={`${event.date}-${event.title}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#34428c]">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="text-sm font-black text-slate-950">{event.title}</h3>
                              <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                <Clock className="h-3.5 w-3.5" />
                                {event.time}
                              </p>
                            </div>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ${event.color}`}>
                            {event.type}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                    <p className="text-sm font-black text-slate-700">No events scheduled</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">Choose another date.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
              <h2 className="mb-4 text-xl font-black text-slate-950">This Week</h2>
              <div className="space-y-3">
                {scheduleItems.map((event) => (
                  <div key={`${event.date}-${event.title}-week`} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff7a21]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-slate-900">{event.title}</p>
                      <p className="text-xs font-bold text-slate-500">{event.date} - {event.time}</p>
                    </div>
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
