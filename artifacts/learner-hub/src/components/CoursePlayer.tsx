import { CheckCircle2, Clock, FileText, Play, PlayCircle, StickyNote } from "lucide-react";

export interface CoursePlayerVideo {
  id: string;
  title: string;
  duration: string;
  description: string;
}

interface CoursePlayerProps {
  courseTitle: string;
  courseCode: string;
  teacher: string;
  image?: string;
  playlist: CoursePlayerVideo[];
  activeVideoId: string;
  completedVideoIds: Set<string>;
  onSelectVideo: (video: CoursePlayerVideo) => void;
  onMarkComplete: () => void;
}

export default function CoursePlayer({
  courseTitle,
  courseCode,
  teacher,
  image,
  playlist,
  activeVideoId,
  completedVideoIds,
  onSelectVideo,
  onMarkComplete,
}: CoursePlayerProps) {
  const activeVideo = playlist.find((video) => video.id === activeVideoId) ?? playlist[0];
  const progress = Math.round((completedVideoIds.size / playlist.length) * 100);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
      <div className="mb-6 flex flex-col gap-5 rounded-[1.5rem] bg-[#34428c] p-6 text-white lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ff7a21]">{courseCode}</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">{courseTitle}</h1>
          <p className="mt-2 text-sm font-bold text-white/70">Instructor: {teacher}</p>
        </div>
        <div className="w-full max-w-sm">
          <div className="mb-2 flex items-center justify-between text-xs font-black text-white/70">
            <span>Course Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-[#ff7a21] transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="min-w-0">
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-950 shadow-lg">
            <div className="relative aspect-video">
              {image && <img src={image} alt={activeVideo.title} className="h-full w-full object-cover opacity-35" />}
              <div className="absolute inset-0 bg-gradient-to-br from-[#34428c]/75 via-slate-950/70 to-slate-950/90" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <button
                  type="button"
                  className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#7b35ad] shadow-2xl transition-transform hover:scale-105"
                  aria-label={`Play ${activeVideo.title}`}
                >
                  <Play className="ml-1 h-9 w-9" />
                </button>
                <h2 className="text-3xl font-black text-white">{activeVideo.title}</h2>
                <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/70">{activeVideo.description}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-black text-slate-950">{activeVideo.title}</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{activeVideo.description}</p>
              <button
                type="button"
                onClick={onMarkComplete}
                className="mt-5 flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#34428c] px-5 text-sm font-black text-white transition hover:bg-[#7b35ad]"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark Complete
              </button>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <FileText className="mb-3 h-5 w-5 text-[#ff7a21]" />
                <p className="text-sm font-black text-slate-950">Lesson Notes</p>
                <p className="mt-1 text-xs font-bold text-slate-500">Download concise notes and practice prompts.</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <StickyNote className="mb-3 h-5 w-5 text-[#7b35ad]" />
                <p className="text-sm font-black text-slate-950">Quick Revision</p>
                <p className="mt-1 text-xs font-bold text-slate-500">Key points are saved after each video.</p>
              </div>
            </div>
          </div>
        </section>

        <aside className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4 rounded-2xl bg-white p-4">
            <h2 className="text-xl font-black text-slate-950">Video Playlist</h2>
            <p className="mt-1 text-sm font-bold text-slate-500">{playlist.length} lessons in this course</p>
          </div>

          <div className="max-h-[680px] space-y-3 overflow-y-auto pr-1">
            {playlist.map((video, index) => {
              const isActive = video.id === activeVideoId;
              const isComplete = completedVideoIds.has(video.id);
              return (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => onSelectVideo(video)}
                  className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                    isActive ? "border-[#7b35ad]/30 bg-white shadow-md" : "border-slate-200 bg-white/70 hover:bg-white"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${
                      isActive ? "bg-[#7b35ad] text-white" : isComplete ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isComplete ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-black text-slate-950">{video.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-500">{video.description}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-black text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      {video.duration}
                    </p>
                  </div>
                  {isActive && <PlayCircle className="mt-1 h-4 w-4 shrink-0 text-[#7b35ad]" />}
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
