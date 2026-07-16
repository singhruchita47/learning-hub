import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, User, Loader, Plus, Trash2, X } from "lucide-react";
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

export default function FacultyTimetable() {
  const user = getUser();
  const facultyId = user?.email ?? user?.id ?? "faculty-demo";

  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    courseCode: "", subject: "", day: "Monday", startTime: "09:00", endTime: "10:00", type: "Lecture", location: ""
  });

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
        const res = await fetch(`${ACADEMIC_API_BASE}/timetable/faculty/${encodeURIComponent(facultyId)}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const apiSlots = data.timetable || [];
        const existing = JSON.parse(localStorage.getItem('local_timetable') || '[]');
        const mySlots = existing.filter((s: any) => s.facultyId === facultyId || s.facultyId === "faculty-demo");
        setSlots([...apiSlots, ...mySlots]);
      } catch {
        const existing = JSON.parse(localStorage.getItem('local_timetable') || '[]');
        const mySlots = existing.filter((s: any) => s.facultyId === facultyId || s.facultyId === "faculty-demo");
        setSlots(mySlots);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, [facultyId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this class slot?")) return;
    try {
      const res = await fetch(`${ACADEMIC_API_BASE}/timetable/${id}`, { method: "DELETE" });
      if (res.ok) setSlots(slots.filter(s => s.id !== id));
    } catch {}
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${ACADEMIC_API_BASE}/timetable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          facultyId: user?.id || user?.email || "faculty-demo",
          facultyName: user?.name || "Faculty",
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSlots([...slots, data.slot]);
      } else {
        throw new Error();
      }
    } catch {
      const newSlot = {
        id: "local-" + Date.now(),
        ...formData,
        facultyId: user?.id || user?.email || "faculty-demo",
        facultyName: user?.name || "Faculty",
      };
      setSlots([...slots, newSlot as TimetableSlot]);
      const existing = JSON.parse(localStorage.getItem('local_timetable') || '[]');
      localStorage.setItem('local_timetable', JSON.stringify([...existing, newSlot]));
    }
    setIsCreating(false);
    setFormData({ courseCode: "", subject: "", day: "Monday", startTime: "09:00", endTime: "10:00", type: "Lecture", location: "" });
  };

  const daySlots = slots.filter(s => s.day === selectedDay).sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1540px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Teaching Schedule</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">View your assigned classes and locations for the week.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700"
        >
          {isCreating ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isCreating ? "Cancel" : "Add Class Slot"}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="rounded-[2rem] border border-violet-100 bg-violet-50/50 p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-800">New Class Slot</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-slate-500">Course Code</label>
              <input required value={formData.courseCode} onChange={e => setFormData({...formData, courseCode: e.target.value})} placeholder="e.g. CS101" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-slate-500">Subject</label>
              <input required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="e.g. Data Structures" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-slate-500">Day</label>
              <select value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none">
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-slate-500">Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none">
                <option value="Lecture">Lecture</option>
                <option value="Lab">Lab</option>
                <option value="Tutorial">Tutorial</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-slate-500">Start Time</label>
              <input required type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-slate-500">End Time</label>
              <input required type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-slate-500">Location</label>
              <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Room 302, Building A" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none" />
            </div>
          </div>
          <button type="submit" className="mt-2 rounded-xl bg-violet-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-violet-700">
            Save Class
          </button>
        </form>
      )}

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
          <p className="mt-4 text-sm font-black text-slate-500">No classes assigned for {selectedDay}.</p>
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
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {slot.startTime} - {slot.endTime}</div>
                    <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {slot.location}</div>
                  </div>
                  <button onClick={() => handleDelete(slot.id)} className="text-slate-300 hover:text-red-500 transition" title="Delete Slot">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
