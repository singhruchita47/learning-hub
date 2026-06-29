import { motion } from "framer-motion";
import { Bell, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { announcements } from "@/data/announcements";

export default function Announcements() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col rounded-2xl bg-white p-6 shadow-lg shadow-primary/5 border border-primary/5"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Announcements
        </h2>
        <Link href="/community" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          All Announcements <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {announcements.map((ann, i) => (
          <motion.div 
            key={ann.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col rounded-xl border border-border p-4 transition-all hover:shadow-md hover:-translate-y-1 bg-muted/10 relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${ann.color}`} />
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${ann.color}`} />
                <span className="text-xs font-medium text-muted-foreground">{ann.time}</span>
              </div>
            </div>
            
            <h3 className="text-sm font-bold text-foreground mb-1 leading-tight">{ann.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{ann.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
