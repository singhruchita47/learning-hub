import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import CoursePlayer, { type CoursePlayerVideo } from "@/components/CoursePlayer";
import { courses } from "@/data/courses";

const buildPlaylist = (courseTitle: string): CoursePlayerVideo[] => [
  { id: "v1", title: `Introduction to ${courseTitle}`, duration: "08:20", description: "Course overview, outcomes, and learning path." },
  { id: "v2", title: "Core Concepts", duration: "14:45", description: "Foundational theory with practical examples." },
  { id: "v3", title: "Worked Examples", duration: "18:10", description: "Step-by-step problem solving session." },
  { id: "v4", title: "Implementation Walkthrough", duration: "22:35", description: "Build the concept in code and inspect edge cases." },
  { id: "v5", title: "Practice & Review", duration: "11:50", description: "Revision prompts, common mistakes, and next steps." },
];

export default function CourseViewer() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const course = courses.find((item) => item.id === id) ?? courses[0];
  const playlist = buildPlaylist(course.title);
  const [activeVideoId, setActiveVideoId] = useState(playlist[0].id);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set(["v1"]));

  function selectVideo(video: CoursePlayerVideo) {
    setActiveVideoId(video.id);
  }

  function markComplete() {
    setCompletedVideos((current) => new Set([...current, activeVideoId]));
  }

  return (
    <main className="min-h-screen bg-[#eef2fb]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 md:px-8">
        <button
          type="button"
          onClick={() => navigate("/courses")}
          className="mb-6 flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-black text-slate-600 shadow-sm transition-colors hover:text-[#7130a1]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </button>

        <CoursePlayer
          courseTitle={course.title}
          courseCode={course.code}
          teacher={course.teacher}
          image={course.image}
          playlist={playlist}
          activeVideoId={activeVideoId}
          completedVideoIds={completedVideos}
          onSelectVideo={selectVideo}
          onMarkComplete={markComplete}
        />
      </div>
    </main>
  );
}
