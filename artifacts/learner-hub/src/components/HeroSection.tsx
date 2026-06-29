import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImage from "@assets/Gemini_Generated_Image_grufpggrufpggruf_1782754112282.png";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12 shadow-sm border border-primary/10">
      <div className="absolute right-0 top-0 -z-10 h-[300px] w-[300px] translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/20 blur-[80px]" />
      <div className="absolute bottom-0 right-[20%] -z-10 h-[200px] w-[200px] translate-y-1/3 rounded-full bg-secondary/20 blur-[60px]" />

      <div className="flex flex-col-reverse md:flex-row items-center gap-8 justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 space-y-6"
        >
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Welcome Back, Arjun <span className="inline-block origin-[70%_70%] animate-wave">👋</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Keep learning and achieve your goals today. You have 2 upcoming deadlines this week.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" className="rounded-full shadow-lg shadow-primary/25">
              Continue Learning
            </Button>
            <Button size="lg" variant="outline" className="rounded-full bg-white/50 backdrop-blur-sm" asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 max-w-sm"
        >
          <img 
            src={heroImage} 
            alt="Student learning" 
            className="w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </motion.div>
      </div>
    </div>
  );
}
