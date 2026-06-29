import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/data/courses";

export default function Courses() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Courses</h1>
          <p className="text-muted-foreground mt-1">Browse and manage your enrolled courses.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search courses..." className="w-full rounded-lg bg-white pl-8 shadow-sm" />
          </div>
          <Button variant="outline" className="bg-white gap-2 shadow-sm rounded-lg">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map(course => (
          <div key={course.id} className="w-full">
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  );
}
