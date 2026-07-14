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
        if (res.ok) {
          const data = await res.json();
          setSlots(data.timetable || []);
        }
      } catch {
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
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {daySlots.map(slot => (
            <div key={slot.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-violet-100 text-violet-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ml-0 md:ml-auto md:mr-auto">
                <Clock className="h-4 w-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-[1.5rem] border border-slate-200 bg-white shadow-sm hover:shadow-md transition ml-4 md:ml-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-black uppercase text-violet-600">{slot.courseCode}</span>
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${
                    slot.type === "Lecture" ? "bg-blue-50 text-blue-600" : 
                    slot.type === "Lab" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                  }`}>
                    {slot.type}
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-800 leading-tight mb-2">{slot.subject}</h3>
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {slot.startTime} - {slot.endTime}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {slot.location}</div>
                  <div className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {slot.facultyName}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
