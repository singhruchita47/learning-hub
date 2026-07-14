import { useMemo, useState, useEffect } from "react";
import {
  Calendar as CalendarIcon, CalendarDays, Clock, FileText, Radio, Video,
  ChevronLeft, ChevronRight, Flame, Target, Star, Zap
} from "lucide-react";
import { useAcademic } from "@/context/AcademicContext";
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

interface CalendarEvent {
  date: string;
  title: string;
  time: string;
  type: "Assignment" | "Live Class" | "Quiz";
  color: string;
  dotColor: string;
  icon: any;
}

function formatDateKey(date: Date) {
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
  return adjustedDate.toISOString().slice(0, 10);
}

function formatLongDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });
}

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function Calendar() {
  const { assignments } = useAcademic();
  const [liveClasses, setLiveClasses] = useState<LiveClassItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date());

  useEffect(() => {
    fetch(`${ACADEMIC_API_BASE}/live-classes`)
      .then((r) => r.json())
      .then((d: { liveClasses?: LiveClassItem[] }) => setLiveClasses(d.liveClasses || []))
      .catch(() => {});
  }, []);

  const scheduleItems = useMemo<CalendarEvent[]>(() => {
    const list: CalendarEvent[] = [];
    assignments.forEach((asg) => {
      if (!asg.dueDate) return;
      list.push({
        date: asg.dueDate.slice(0, 10),
        title: `${asg.title} Deadline`,
        time: "11:59 PM",
        type: "Assignment",
        color: "#F43F5E",
        dotColor: "#F43F5E",
        icon: FileText,
      });
    });
    liveClasses.forEach((lc) => {
      if (!lc.startsAt) return;
      list.push({
        date: lc.startsAt.slice(0, 10),
        title: lc.title,
        time: new Date(lc.startsAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        type: "Live Class",
        color: "#3B82F6",
        dotColor: "#3B82F6",
        icon: Radio,
      });
    });
    const baseDate = new Date();
    const quizDate = new Date(baseDate.setDate(baseDate.getDate() + 1)).toISOString().slice(0, 10);
    list.push({
      date: quizDate,
      title: "Data Structures Aptitude Checkpoint",
      time: "10:30 AM",
      type: "Quiz",
      color: "#F59E0B",
      dotColor: "#F59E0B",
      icon: Video,
    });
    return list;
  }, [assignments, liveClasses]);

  const selectedEvents = useMemo(() => {
    const key = formatDateKey(selectedDate);
    return scheduleItems.filter((e) => e.date === key);
  }, [selectedDate, scheduleItems]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    scheduleItems.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [scheduleItems]);

  // Calendar grid
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayKey = formatDateKey(today);
  const selectedKey = formatDateKey(selectedDate);

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }
  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }
  function selectDay(day: number) {
    setSelectedDate(new Date(year, month, day));
  }

  const liveClassesCount = scheduleItems.filter((e) => e.type === "Live Class").length;
  const assignmentsCount = scheduleItems.filter((e) => e.type === "Assignment").length;
  const quizCount = scheduleItems.filter((e) => e.type === "Quiz").length;

  // upcoming (next 5)
  const upcomingEvents = [...scheduleItems]
    .filter((e) => e.date >= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <main className="px-4 py-6 md:px-8 animate-in fade-in duration-500">
      <div className="mx-auto max-w-[1400px] space-y-6">

        {/* ── Title and Alert Row ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Calendar &amp; Schedule</h1>
            <p className="text-xs font-semibold text-slate-400 mt-1">Track live classes, assignments, quizzes and all deadlines in one place.</p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-2xl bg-violet-50 border border-violet-200 px-4 py-2.5 text-xs font-bold text-violet-850 shadow-sm shrink-0">
            <span>📅</span>
            <span>{scheduleItems.length} Events Scheduled</span>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Total Events",  value: scheduleItems.length, txt: "text-[#6c5ce7]" },
            { label: "Live Classes",  value: liveClassesCount,     txt: "text-blue-600" },
            { label: "Assignments",   value: assignmentsCount,     txt: "text-rose-500" },
            { label: "Quizzes",       value: quizCount,            txt: "text-amber-500" },
          ].map(({ label, value, txt }) => (
            <div key={label} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col justify-center min-h-[100px]">
              <span className={`text-4xl font-black ${txt}`}>{value}</span>
              <span className="text-xs font-bold text-slate-400 mt-1">{label}</span>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

          {/* ── Left: Custom Calendar ── */}
          <section className="rounded-[2rem] border border-slate-100/50 bg-white p-6 shadow-sm">
            {/* Month nav */}
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="text-center">
                <h2 className="text-xl font-black text-slate-900">
                  {MONTH_NAMES[month]} {year}
                </h2>
                <p className="text-xs font-bold text-slate-400">
                  {daysInMonth} days • {scheduleItems.filter(e => e.date.startsWith(`${year}-${String(month+1).padStart(2,"0")}`)).length} events
                </p>
              </div>
              <button
                onClick={nextMonth}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Day headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {DAY_NAMES.map((d) => (
                <div key={d} className="py-1 text-center text-[11px] font-black uppercase tracking-wider text-slate-400">
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells before month start */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const events = eventsByDate[key] || [];
                const isToday = key === todayKey;
                const isSelected = key === selectedKey;
                const hasBig = events.length > 0;

                return (
                  <button
                    key={day}
                    onClick={() => selectDay(day)}
                    className={`relative flex flex-col items-center gap-0.5 rounded-xl py-2 px-1 transition-all focus:outline-none ${
                      isSelected
                        ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30"
                        : isToday
                        ? "bg-violet-100 text-violet-700 font-black"
                        : hasBig
                        ? "bg-slate-50 hover:bg-violet-50 text-slate-700"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span className={`text-sm font-black leading-none ${isToday && !isSelected ? "text-violet-600" : ""}`}>
                      {day}
                    </span>
                    {/* Event dots */}
                    {events.length > 0 && (
                      <div className="flex gap-0.5 flex-wrap justify-center max-w-[30px]">
                        {events.slice(0, 3).map((e, ei) => (
                          <span
                            key={ei}
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: isSelected ? "rgba(255,255,255,0.8)" : e.dotColor }}
                          />
                        ))}
                        {events.length > 3 && (
                          <span className={`text-[8px] font-black ${isSelected ? "text-white/80" : "text-slate-400"}`}>+{events.length - 3}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-100 pt-5 text-xs font-black text-slate-500">
              {[
                { color: "#F43F5E", label: "Assignment Deadline" },
                { color: "#3B82F6", label: "Live Class" },
                { color: "#F59E0B", label: "Quiz / Exam" },
              ].map(({ color, label }) => (
                <span key={label} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                  {label}
                </span>
              ))}
            </div>
          </section>

          {/* ── Right sidebar ── */}
          <aside className="space-y-5">
            {/* Selected day events */}
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
              <p className="text-xs font-black uppercase tracking-wider text-violet-600">
                {formatLongDate(selectedDate)}
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-900">Day Events</h2>

              <div className="mt-4 space-y-3">
                {selectedEvents.length > 0 ? (
                  selectedEvents.map((event) => {
                    const Icon = event.icon;
                    return (
                      <div
                        key={`${event.date}-${event.title}`}
                        className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-50 to-white p-4 hover:shadow-md transition-all"
                        style={{ borderLeftColor: event.dotColor, borderLeftWidth: 3 }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                            style={{ backgroundColor: `${event.dotColor}15` }}
                          >
                            <Icon className="h-4 w-4" style={{ color: event.dotColor }} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-black text-slate-900 leading-tight">{event.title}</h3>
                            <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-400">
                              <Clock className="h-3.5 w-3.5" /> {event.time}
                            </p>
                          </div>
                          <span
                            className="shrink-0 self-start rounded-full px-2 py-0.5 text-[10px] font-black text-white"
                            style={{ backgroundColor: event.dotColor }}
                          >
                            {event.type}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                    <CalendarIcon className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-3 text-sm font-black text-slate-500">No events today</p>
                    <p className="mt-1 text-xs font-bold text-slate-400">This day is free!</p>
                  </div>
                )}
              </div>
            </section>

            {/* Upcoming events */}
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
              <div className="mb-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-[#ff7a21]" />
                <h2 className="text-base font-black text-slate-900">Upcoming Events</h2>
              </div>
              <div className="space-y-3">
                {upcomingEvents.length === 0 ? (
                  <p className="text-xs font-bold text-slate-400 text-center py-4">No upcoming events.</p>
                ) : upcomingEvents.map((event, idx) => {
                  const Icon = event.icon;
                  const daysAway = Math.round(
                    (new Date(event.date).getTime() - new Date(todayKey).getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <button
                      key={`${event.date}-${idx}`}
                      onClick={() => {
                        const [y, m, d] = event.date.split("-").map(Number);
                        setSelectedDate(new Date(y, m - 1, d));
                        setViewDate(new Date(y, m - 1, 1));
                      }}
                      className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-3 text-left transition hover:bg-[#6c5ce7]/5 hover:shadow-sm"
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${event.dotColor}15` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: event.dotColor }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-black text-slate-900">{event.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{event.date} · {event.time}</p>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black text-white"
                        style={{ backgroundColor: event.dotColor }}
                      >
                        {daysAway === 0 ? "Today" : daysAway === 1 ? "Tomorrow" : `${daysAway}d`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Mini stats */}
            <section className="grid grid-cols-2 gap-3">
              {[
                { icon: Target, label: "Active Days", val: "20", color: "from-violet-600 to-indigo-600" },
                { icon: Flame,  label: "This Month",  val: scheduleItems.filter(e => e.date.startsWith(`${year}-${String(month+1).padStart(2,"0")}`)).length.toString(), color: "from-amber-500 to-orange-500" },
              ].map(({ icon: Icon, label, val, color }) => (
                <div key={label} className={`rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-lg`}>
                  <Icon className="h-5 w-5 text-white/70 mb-2" />
                  <p className="text-2xl font-black">{val}</p>
                  <p className="text-[11px] font-black text-white/60 uppercase tracking-wider mt-0.5">{label}</p>
                </div>
              ))}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
