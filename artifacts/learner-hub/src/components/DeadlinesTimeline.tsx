import { motion } from "framer-motion";
import { AlertCircle, Clock, CheckCircle2, History } from "lucide-react";

export default function DeadlinesTimeline() {
  const deadlines = [
    { id: 1, title: "Data Structures Assignment", time: "Due in 2 days", type: "assignment", urgency: "high" },
    { id: 2, title: "Database Lab Report", time: "Due in 4 days", type: "lab", urgency: "medium" },
    { id: 3, title: "OS Quiz", time: "Due in 1 week", type: "quiz", urgency: "low" },
    { id: 4, title: "AI Project", time: "Due in 2 weeks", type: "project", urgency: "low" },
  ];

  const activity = [
    { id: 1, title: "Completed Chapter 5 of Data Structures", time: "1 hour ago", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: 2, title: "Submitted Database Lab", time: "3 hours ago", icon: History, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: 3, title: "Scored 85% on OS Quiz", time: "Yesterday", icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10" },
    { id: 4, title: "Enrolled in ML Course", time: "2 days ago", icon: History, color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: 5, title: "Downloaded Python Notes", time: "3 days ago", icon: History, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Deadlines */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl bg-white p-6 shadow-lg shadow-primary/5 border border-primary/5 flex flex-col"
      >
        <div className="flex items-center gap-2 mb-6">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-bold text-foreground">Upcoming Deadlines</h2>
        </div>
        
        <div className="flex flex-col gap-4">
          {deadlines.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-1 rounded-full ${
                  item.urgency === 'high' ? 'bg-red-500' : 
                  item.urgency === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div>
                  <p className="text-sm font-bold text-foreground">{item.title}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span className={item.urgency === 'high' ? 'text-red-500' : ''}>{item.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white p-6 shadow-lg shadow-primary/5 border border-primary/5 flex flex-col"
      >
        <div className="flex items-center gap-2 mb-6">
          <History className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
        </div>
        
        <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-[21px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:to-transparent">
          {activity.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
            >
              <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-white ${item.bg} ${item.color} shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute left-[-8px] md:left-1/2`}>
                <item.icon className="h-3 w-3" />
              </div>
              
              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] ml-6 md:ml-0 p-3 rounded-xl border border-border bg-white shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                <p className="text-sm font-semibold text-foreground leading-tight">{item.title}</p>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1 block">{item.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
