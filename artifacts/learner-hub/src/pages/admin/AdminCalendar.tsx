import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Plus, Clock, MapPin, Search } from "lucide-react";
import { API_ROOT } from "@/lib/api";

export default function AdminCalendar() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_ROOT}/admin/events`);
      const data = await res.json();
      if (data.events) setEvents(data.events);
    } catch {}
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "", type: "Event", location: "" });

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) return;

    // Smart defaults for time and venue/location (especially for Holiday types)
    const eventPayload = {
      ...newEvent,
      time: newEvent.time.trim() || (newEvent.type === "Holiday" ? "All Day" : "N/A"),
      location: newEvent.location.trim() || (newEvent.type === "Holiday" ? "Campus Wide" : "N/A"),
    };

    try {
      const res = await fetch(`${API_ROOT}/admin/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventPayload)
      });
      if (res.ok) {
        fetchEvents();
      }
    } catch {}
    setShowAddForm(false);
    setNewEvent({ title: "", date: "", time: "", type: "Event", location: "" });
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1540px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic Calendar</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">Schedule exams, holidays, and campus events.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-black text-white hover:bg-violet-700 transition shadow-md shadow-violet-200"
        >
          <Plus className="h-4.5 w-4.5" /> Add New Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Simple visual calendar mock for admin */}
        <div className="md:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4">Event Types</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-violet-500" />
                <span className="text-sm font-bold text-slate-600">Events</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm font-bold text-slate-600">Exams</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-sm font-bold text-slate-600">Holidays</span>
              </div>
            </div>
          </div>

          {/* Mini Calendar Widget */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-900">August 2026</h3>
              <div className="flex gap-1">
                <button className="h-6 w-6 rounded hover:bg-slate-100 flex items-center justify-center text-slate-400 font-bold">&lt;</button>
                <button className="h-6 w-6 rounded hover:bg-slate-100 flex items-center justify-center text-slate-400 font-bold">&gt;</button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['S','M','T','W','T','F','S'].map((d,i) => (
                <div key={i} className="text-[10px] font-black text-slate-400">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {[...Array(31)].map((_, i) => {
                const isEvent = i + 1 === 20;
                const isExam = i + 1 === 15;
                const isHoliday = i + 1 === 12;
                
                let bgClass = "hover:bg-slate-50 text-slate-700";
                if (isEvent) bgClass = "bg-violet-100 text-violet-700 font-black";
                if (isExam) bgClass = "bg-red-100 text-red-700 font-black";
                if (isHoliday) bgClass = "bg-emerald-100 text-emerald-700 font-black";

                return (
                  <div 
                    key={i} 
                    className={`h-8 w-full flex items-center justify-center rounded-lg text-xs font-semibold cursor-pointer transition ${bgClass}`}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="md:col-span-3 space-y-4">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search upcoming events..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-bold shadow-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <div className="grid gap-4">
            {events.map(event => (
                <div key={event._id || event.id} className="flex gap-4 p-4 hover:bg-slate-50/50 transition border border-transparent hover:border-slate-100 rounded-2xl">
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 shrink-0">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-xl font-black text-slate-800">
                      {new Date(event.date).getDate() || event.date.split("-")[2]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        event.type === 'Event' ? 'bg-violet-500' : 
                        event.type === 'Exam' ? 'bg-red-500' : 'bg-emerald-500'
                      }`} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {event.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900">{event.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                      <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {event.time}</div>
                      <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {event.location}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <h2 className="mb-1 text-xl font-black text-slate-900">Add New Event</h2>
            <p className="mb-6 text-xs font-semibold text-slate-500">Schedule a new item on the academic calendar.</p>
            
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 outline-none focus:border-violet-400 focus:bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 outline-none focus:border-violet-400 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 outline-none focus:border-violet-400 focus:bg-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 outline-none focus:border-violet-400 focus:bg-white"
                  >
                    <option>Event</option>
                    <option>Exam</option>
                    <option>Holiday</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Location</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-900 outline-none focus:border-violet-400 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-black text-slate-600 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-black text-white hover:bg-violet-700 transition"
              >
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
