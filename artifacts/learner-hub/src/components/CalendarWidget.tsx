import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CalendarWidget() {
  const schedule = [
    { id: 1, title: "Database Systems", subtitle: "Class • Room 203", time: "9:00 AM", color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    { id: 2, title: "OS Lab", subtitle: "Lab • Computer Lab 1", time: "11:00 AM", color: "bg-emerald-500", textColor: "text-emerald-700", bgColor: "bg-emerald-50", borderColor: "border-emerald-200" },
    { id: 3, title: "Data Structures Quiz", subtitle: "Quiz • Online", time: "2:00 PM", color: "bg-orange-500", textColor: "text-orange-700", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
  ];

  const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // May 2025: starts on Thursday (index 4)
  const firstDayOfWeek = 4; // Thursday
  const daysInMonth = 31;
  const calendarCells: (number | null)[] = [];

  for (let i = 0; i < firstDayOfWeek; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  const today = 20;
  const hasEvent = [3, 8, 15, 20, 22, 27, 29];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col rounded-2xl bg-white shadow-xl border border-primary/5 h-full overflow-hidden"
    >
      {/* Month header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
            <CalendarIcon className="h-4 w-4 text-primary" />
          </div>
          May 2025
        </h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-primary/10">
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-primary/10">
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 px-4 mb-1">
        {dayLabels.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1 px-4 pb-3">
        {calendarCells.map((date, i) => {
          const isToday = date === today;
          const isEventDay = date !== null && hasEvent.includes(date);
          return (
            <div key={i} className="flex flex-col items-center gap-0.5 py-0.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer
                  ${date === null ? '' : isToday
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-foreground hover:bg-primary/10'
                  }`}
              >
                {date}
              </div>
              {isEventDay && !isToday && (
                <div className="h-1 w-1 rounded-full bg-primary/50" />
              )}
              {isToday && (
                <div className="h-1 w-1 rounded-full bg-primary opacity-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-gray-100 mb-4" />

      {/* Today's schedule */}
      <div className="flex-1 px-5 space-y-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-extrabold text-foreground uppercase tracking-widest">Today's Schedule</h3>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">3 classes</span>
        </div>
        {schedule.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${item.bgColor} ${item.borderColor}`}
          >
            <div className={`h-8 w-1 rounded-full ${item.color} shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-extrabold ${item.textColor} truncate leading-tight`}>{item.title}</p>
              <p className="text-[10px] text-muted-foreground font-medium">{item.subtitle}</p>
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold ${item.textColor} shrink-0`}>
              <Clock className="h-3 w-3" />
              {item.time}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="px-4 pt-3 pb-4">
        <Button variant="outline" className="w-full text-primary border-primary/20 hover:bg-primary/5 font-bold rounded-xl mt-1" asChild>
          <Link href="/calendar">View Full Calendar →</Link>
        </Button>
      </div>
    </motion.div>
  );
}
