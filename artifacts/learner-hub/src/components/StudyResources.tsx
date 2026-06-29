import { motion } from "framer-motion";
import { FileText, Download, ArrowRight, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { resources } from "@/data/resources";

export default function StudyResources() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col rounded-2xl bg-white p-5 shadow-lg border border-primary/5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-extrabold text-foreground flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Library className="h-4 w-4 text-primary" />
          </div>
          Study Resources
        </h2>
        <Link href="/resources" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
          Browse All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Compact list */}
      <div className="flex flex-col gap-2">
        {resources.slice(0, 5).map((resource, i) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group flex items-center justify-between rounded-xl border border-border/60 px-3 py-2.5 hover:border-primary/20 hover:bg-primary/[0.02] transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                <FileText className="h-4 w-4 text-red-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors leading-tight">
                  {resource.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                    {resource.format}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{resource.size}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
