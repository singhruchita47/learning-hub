import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, User, BookOpen, Plus, Trash2, Loader, Save, X } from "lucide-react";
import { ACADEMIC_API_BASE } from "@/lib/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TYPES = ["Lecture", "Lab", "Tutorial", "Seminar"];

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

const BLANK_FORM = {
  courseCode: "",
  subject: "",
  facultyId: "",
  facultyName: "",
  day: "Monday",
  startTime: "09:00",
  endTime: "10:00",
  type: "Lecture",
  location: ""
};

export default function AdminTimetable() {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Monday");

  const fetchTimetable = async () => {
    try {
      const res = await fetch(`${ACADEMIC_API_BASE}/timetable`);
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

  useEffect(() => {
    fetchTimetable();
  }, []);

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${ACADEMIC_API_BASE}/timetable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        await fetchTimetable();
      } else {
        throw new Error();
      }
    } catch {
      // Offline fallback removed
    } finally {
      setShowForm(false);
      setForm(BLANK_FORM);
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slot?")) return;
    try {
      const res = await fetch(`${ACADEMIC_API_BASE}/timetable/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSlots(prev => prev.filter(s => s.id !== id));
      }
    } catch {}
  };

  const daySlots = slots.filter(s => s.day === selectedDay).sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1540px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Master Timetable</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">Manage global class schedules for all courses and faculty.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-black text-white hover:bg-violet-700 transition shadow-sm"
        >
          <Plus className="h-4.5 w-4.5" /> Add New Slot
        </button>
      </div>

      {showForm && (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-slate-800">Add Timetable Slot</h2>
            <button onClick={() => setShowForm(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleAddSlot} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Course Code</label>
              <input required value={form.courseCode} onChange={e => setForm({...form, courseCode: e.target.value})} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-violet-400" placeholder="e.g. CS301" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Subject Name</label>
              <input required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-violet-400" placeholder="Data Structures" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Faculty ID / Email</label>
              <input required value={form.facultyId} onChange={e => setForm({...form, facultyId: e.target.value})} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-violet-400" placeholder="faculty@sgsu.edu" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Faculty Name</label>
              <input required value={form.facultyName} onChange={e => setForm({...form, facultyName: e.target.value})} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-violet-400" placeholder="Dr. Sharma" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Day</label>
              <select required value={form.day} onChange={e => setForm({...form, day: e.target.value})} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-violet-400">
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Type</label>
              <select required value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-violet-400">
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Start Time</label>
              <input type="time" required value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-violet-400" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">End Time</label>
              <input type="time" required value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-violet-400" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Location / Room</label>
              <input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-violet-400" placeholder="Room 402, Block B" />
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex justify-end">
              <button disabled={saving} type="submit" className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-black text-white hover:bg-violet-700 transition disabled:opacity-50">
                {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Slot
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Days Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-6 [scrollbar-width:none]">
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
          <p className="mt-4 text-sm font-black text-slate-500">No classes scheduled for {selectedDay}.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {daySlots.map(slot => (
            <div key={slot.id} className="relative rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="absolute right-4 top-4">
                <button onClick={() => handleDelete(slot.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-black uppercase text-violet-600">{slot.courseCode}</span>
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${
                  slot.type === "Lecture" ? "bg-blue-50 text-blue-600" : 
                  slot.type === "Lab" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                }`}>
                  {slot.type}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-800 pr-8 leading-tight">{slot.subject}</h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <User className="h-3.5 w-3.5" /> {slot.facultyName}
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Clock className="h-3.5 w-3.5" /> {slot.startTime} - {slot.endTime}
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <MapPin className="h-3.5 w-3.5" /> {slot.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
