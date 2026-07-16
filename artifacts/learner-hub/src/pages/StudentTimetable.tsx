import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, User, Loader } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface TimetableSlot {
  id: string;
  courseCode: string;
  subject: string;
  facultyId: string;
  facultyName: string;
  day: string;
  startTime: string;
  endTime: string;
  type: string;
  location: string;
}

function getUser() {
  try {
    const saved = localStorage.getItem("learningHubUser");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export default function StudentTimetable() {
  const user = getUser();
  const studentId = user?.email ?? user?.id ?? "student-demo";

  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("Monday");

  useEffect(() => {
    // Current day logic (0 = Sunday, 1 = Monday)
    const todayNum = new Date().getDay();
    if (todayNum >= 1 && todayNum <= 6) {
      setSelectedDay(DAYS[todayNum - 1]);
    }
  }, []);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await fetch(`${ACADEMIC_API_BASE}/timetable/student/${encodeURIComponent(studentId)}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const apiSlots = data.timetable || [];
        setSlots(apiSlots);
      } catch {
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, [studentId]);

  const daySlots = slots.filter(s => s.day === selectedDay).sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="px-4 py-6 md:px-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto space-y-6">
      
      {/* ── Title Row ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Timetable</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">Your weekly schedule for lectures, labs, and tutorials.</p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-2xl bg-violet-50 border border-violet-200 px-4 py-2.5 text-xs font-bold text-violet-850 shadow-sm shrink-0">
          <CalendarIcon className="h-4 w-4 text-violet-600" />
          <span>{selectedDay} Schedule</span>
        </div>
      </div>

      {/* Days Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-6 [scrollbar-width:none] mt-6">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`pb-3 text-sm font-black transition-all border-b-2 whitespace-nowrap ${selectedDay === day ? "border-violet-600 text-violet-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
          >
            {day}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      ) : daySlots.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-12 text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 text-sm font-black text-slate-500">Free day! No classes scheduled for {selectedDay}.</p>
        </div>
      ) : (
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
          {daySlots.map(slot => (
            <div key={slot.id} className="relative flex items-start gap-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-violet-100 text-violet-600 shrink-0 shadow-sm z-10">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex-1 max-w-3xl p-6 rounded-[1.5rem] border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded-md bg-violet-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-violet-600">{slot.courseCode}</span>
                  <span className={`rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                    slot.type === "Lecture" ? "bg-blue-50 text-blue-600" : 
                    slot.type === "Lab" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                  }`}>
                    {slot.type}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-800 leading-tight mb-3">{slot.subject}</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-slate-400" /> {slot.startTime} - {slot.endTime}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-slate-400" /> {slot.location}</div>
                  <div className="flex items-center gap-1.5"><User className="h-4 w-4 text-slate-400" /> {slot.facultyName}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
