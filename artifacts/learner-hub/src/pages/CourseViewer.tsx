import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, Volume2, Maximize, CheckCircle2, Lock, ChevronDown, ChevronRight, PlayCircle } from "lucide-react";
import { courses } from "@/data/courses";

interface VideoItem {
  id: string;
  title: string;
  duration: string;
  done: boolean;
}

interface Module {
  id: string;
  title: string;
  videos: VideoItem[];
}

const buildPlaylist = (courseTitle: string): Module[] => [
  {
    id: "m1",
    title: "Module 1: Introduction",
    videos: [
      { id: "v1", title: `Overview of ${courseTitle}`, duration: "5:24", done: true },
      { id: "v2", title: "Setup & Environment", duration: "8:11", done: true },
      { id: "v3", title: "Your First Program", duration: "12:43", done: false },
    ],
  },
  {
    id: "m2",
    title: "Module 2: Core Concepts",
    videos: [
      { id: "v4", title: "Variables & Data Types", duration: "7:30", done: false },
      { id: "v5", title: "Control Flow", duration: "9:15", done: false },
      { id: "v6", title: "Functions & Scope", duration: "14:20", done: false },
    ],
  },
  {
    id: "m3",
    title: "Module 3: Deep Dive",
    videos: [
      { id: "v7", title: "Data Structures", duration: "18:45", done: false },
      { id: "v8", title: "Algorithms & Complexity", duration: "22:10", done: false },
      { id: "v9", title: "Final Project", duration: "35:00", done: false },
    ],
  },
  {
    id: "m4",
    title: "Module 4: Practice & Assessment",
    videos: [
      { id: "v10", title: "Practice Problems", duration: "11:00", done: false },
      { id: "v11", title: "Mock Test Walkthrough", duration: "16:30", done: false },
      { id: "v12", title: "Exam Preparation", duration: "9:50", done: false },
    ],
  },
];

export default function CourseViewer() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const course = courses.find((c) => c.id === id) ?? courses[0];
  const playlist = buildPlaylist(course.title);

  const allVideos = playlist.flatMap((m) => m.videos);
  const [currentVideoId, setCurrentVideoId] = useState(allVideos[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [openModules, setOpenModules] = useState<Set<string>>(new Set(["m1", "m2"]));
  const [watched, setWatched] = useState<Set<string>>(
    new Set(allVideos.filter((v) => v.done).map((v) => v.id))
  );

  const currentVideo = allVideos.find((v) => v.id === currentVideoId) ?? allVideos[0];
  const currentModule = playlist.find((m) => m.videos.some((v) => v.id === currentVideoId));
  const currentIndex = allVideos.findIndex((v) => v.id === currentVideoId);

  const selectVideo = (videoId: string) => {
    setCurrentVideoId(videoId);
    setIsPlaying(true);
  };

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId);
      return next;
    });
  };

  const handlePrev = () => {
    if (currentIndex > 0) selectVideo(allVideos[currentIndex - 1].id);
  };

  const handleNext = () => {
    if (currentIndex < allVideos.length - 1) {
      setWatched((prev) => new Set([...prev, currentVideoId]));
      selectVideo(allVideos[currentIndex + 1].id);
    }
  };

  const totalWatched = watched.size;
  const totalVideos = allVideos.length;
  const progressPct = Math.round((totalWatched / totalVideos) * 100);

  const progressColor = (c: string) => {
    if (c.includes('indigo')) return '#4F46E5';
    if (c.includes('emerald') || c.includes('green')) return '#10B981';
    if (c.includes('violet') || c.includes('purple')) return '#7C3AED';
    if (c.includes('amber') || c.includes('yellow')) return '#F59E0B';
    if (c.includes('red') || c.includes('rose')) return '#EF4444';
    if (c.includes('blue')) return '#3B82F6';
    if (c.includes('orange')) return '#F97316';
    if (c.includes('cyan')) return '#06B6D4';
    return '#4F46E5';
  };
  const pc = progressColor(course.color);

  return (
    <div className="flex flex-col h-full min-h-screen bg-slate-950">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-800 bg-slate-900">
        <button
          onClick={() => navigate("/courses")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </button>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-1.5 w-32 rounded-full bg-slate-700 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${progressPct}%`, backgroundColor: pc }} />
            </div>
            <span className="text-xs font-bold text-slate-400">{progressPct}% complete</span>
          </div>
          <span className="text-xs font-mono font-bold rounded-full px-2.5 py-1 bg-slate-800 text-slate-300">
            {course.code}
          </span>
        </div>
      </div>

      {/* ── Main split ── */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

        {/* ── LEFT: Video Player ── */}
        <div className="flex-1 flex flex-col overflow-y-auto lg:overflow-hidden">

          {/* Video area */}
          <div className="relative bg-black" style={{ aspectRatio: "16/9", maxHeight: "calc(100vh - 240px)" }}>
            {/* Placeholder video screen */}
            {course.image ? (
              <img
                src={course.image}
                alt={currentVideo.title}
                className="w-full h-full object-cover opacity-40"
              />
            ) : (
              <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${pc}22 0%, #0f172a 100%)` }} />
            )}

            {/* Big play button overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 transition-colors hover:bg-white/30"
              >
                <AnimatePresence mode="wait">
                  {isPlaying ? (
                    <motion.div key="pause" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Pause className="h-7 w-7 text-white" />
                    </motion.div>
                  ) : (
                    <motion.div key="play" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Play className="h-7 w-7 text-white ml-1" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              <div className="text-center px-4">
                <p className="text-white font-bold text-lg md:text-xl drop-shadow-lg">{currentVideo.title}</p>
                <p className="text-white/60 text-sm mt-1">{currentModule?.title}</p>
              </div>
            </div>

            {/* Progress bar (fake) */}
            <div className="absolute bottom-12 left-0 right-0 px-4">
              <div className="h-1 w-full rounded-full bg-white/20 overflow-hidden cursor-pointer">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: pc }}
                  initial={{ width: "0%" }}
                  animate={{ width: isPlaying ? "65%" : "0%" }}
                  transition={{ duration: isPlaying ? 8 : 0.3, ease: "linear" }}
                />
              </div>
            </div>

            {/* Controls bar */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-2">
                <button onClick={handlePrev} disabled={currentIndex === 0}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-colors">
                  <SkipBack className="h-3.5 w-3.5 text-white" />
                </button>
                <button onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  {isPlaying ? <Pause className="h-3.5 w-3.5 text-white" /> : <Play className="h-3.5 w-3.5 text-white ml-0.5" />}
                </button>
                <button onClick={handleNext} disabled={currentIndex === allVideos.length - 1}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-colors">
                  <SkipForward className="h-3.5 w-3.5 text-white" />
                </button>
                <span className="text-white/70 text-xs ml-2">{currentVideo.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-white/60" />
                <Maximize className="h-4 w-4 text-white/60" />
              </div>
            </div>
          </div>

          {/* Course info below video */}
          <div className="p-5 md:p-6 bg-slate-900 border-t border-slate-800">
            <h2 className="text-white font-extrabold text-xl mb-1">{currentVideo.title}</h2>
            <p className="text-slate-400 text-sm mb-4">{course.title} · {currentModule?.title}</p>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">👨‍🏫 {course.teacher}</span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">⏱ {currentVideo.duration}</span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                {totalWatched}/{totalVideos} videos watched
              </span>
              <button
                onClick={() => setWatched((prev) => new Set([...prev, currentVideoId]))}
                className="rounded-full px-3 py-1 text-xs font-bold transition-all"
                style={{ background: watched.has(currentVideoId) ? "#10B98120" : `${pc}20`, color: watched.has(currentVideoId) ? "#10B981" : pc }}
              >
                {watched.has(currentVideoId) ? "✓ Watched" : "Mark as Watched"}
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Playlist Sidebar ── */}
        <div className="w-full lg:w-[340px] shrink-0 flex flex-col bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 overflow-y-auto">
          <div className="px-4 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
            <h3 className="text-white font-extrabold text-sm">Course Playlist</h3>
            <p className="text-slate-500 text-xs mt-0.5">{totalVideos} videos · {totalWatched} completed</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {playlist.map((module) => {
              const isOpen = openModules.has(module.id);
              const moduleWatched = module.videos.filter((v) => watched.has(v.id)).length;
              return (
                <div key={module.id}>
                  {/* Module header */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold"
                        style={{ background: `${pc}25`, color: pc }}>
                        {playlist.indexOf(module) + 1}
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-xs font-extrabold text-slate-200 truncate">{module.title}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{moduleWatched}/{module.videos.length} done</p>
                      </div>
                    </div>
                    {isOpen ? <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" /> : <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />}
                  </button>

                  {/* Video list */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        {module.videos.map((video) => {
                          const isCurrent = video.id === currentVideoId;
                          const isDone = watched.has(video.id);
                          return (
                            <motion.button
                              key={video.id}
                              onClick={() => selectVideo(video.id)}
                              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                isCurrent ? "bg-slate-800" : ""
                              }`}
                            >
                              {/* Status icon */}
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                                style={isCurrent ? { outline: `2px solid ${pc}`, outlineOffset: "1px" } : {}}>
                                {isDone ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                ) : isCurrent ? (
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: pc }}>
                                    <Play className="h-3 w-3 text-white ml-0.5" />
                                  </div>
                                ) : (
                                  <PlayCircle className="h-5 w-5 text-slate-600" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-semibold truncate ${isCurrent ? "text-white" : isDone ? "text-slate-400" : "text-slate-300"}`}>
                                  {video.title}
                                </p>
                                <p className="text-[10px] text-slate-600 font-medium">{video.duration}</p>
                              </div>

                              {isCurrent && isPlaying && (
                                <div className="flex gap-0.5 shrink-0">
                                  {[0, 1, 2].map((i) => (
                                    <motion.div
                                      key={i}
                                      className="w-0.5 rounded-full"
                                      style={{ backgroundColor: pc }}
                                      animate={{ height: ["4px", "12px", "4px"] }}
                                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                                    />
                                  ))}
                                </div>
                              )}
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
