import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CalendarWidget() {
  const schedule = [
    { id: 1, title: "Database Systems Class", time: "9:00 AM", color: "bg-blue-500" },
    { id: 2, title: "Operating Systems Lab", time: "11:00 AM", color: "bg-green-500" },
    { id: 3, title: "Data Structures Quiz", time: "2:00 PM", color: "bg-orange-500" },
  ];

  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  
  // Dummy May 2025 calendar data
  const dates = [
    28, 29, 30, 1, 2, 3, 4,
    5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25,
    26, 27, 28, 29, 30, 31, 1
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col rounded-2xl bg-white p-6 shadow-lg shadow-primary/5 border border-primary/5 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          May 2025
        </h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-4">
        {days.map(day => (
          <div key={day} className="text-xs font-semibold text-muted-foreground py-1">
            {day}
          </div>
        ))}
        {dates.map((date, i) => {
          const isToday = date === 15 && i > 10 && i < 20; // Just making 15th the today
          const isOtherMonth = i < 3 || i > 33;
          return (
            <div 
              key={i} 
              className={`flex h-8 items-center justify-center rounded-full text-sm font-medium transition-colors cursor-pointer
                ${isOtherMonth ? 'text-muted/40' : 'text-foreground hover:bg-muted'}
                ${isToday ? 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/30' : ''}
              `}
            >
              {date}
            </div>
          );
        })}
      </div>

      <div className="mt-auto space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Today's Schedule</h3>
        <div className="space-y-3">
          {schedule.map(item => (
            <div key={item.id} className="flex items-start gap-3 group">
              <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.color}`} />
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button variant="ghost" className="mt-4 w-full text-primary hover:text-primary hover:bg-primary/5" asChild>
        <Link href="/calendar">View Full Calendar</Link>
      </Button>
    </motion.div>
  );
}
