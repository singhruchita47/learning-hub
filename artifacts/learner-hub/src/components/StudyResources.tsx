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
      className="flex flex-col rounded-2xl bg-white p-6 shadow-lg shadow-primary/5 border border-primary/5 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Library className="h-5 w-5 text-primary" />
          Study Resources
        </h2>
        <Link href="/resources" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Browse All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resources.map((resource, i) => (
          <motion.div 
            key={resource.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group flex items-center justify-between rounded-xl border border-border p-3 transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 bg-muted/20"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{resource.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">{resource.format}</span>
                  <span className="text-xs text-muted-foreground">{resource.size}</span>
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 shrink-0">
              <Download className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
