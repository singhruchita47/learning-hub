import { HelpCircle } from "lucide-react";
import FacultyTestCreator from "@/components/FacultyTestCreator";

export default function FacultyCreateTest() {
  return (
    <main className="min-h-screen bg-[#eef2fb] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <section className="mb-6 rounded-[2rem] border border-[#d8c8ff] bg-gradient-to-br from-[#f7f2ff]/95 via-[#eee7ff]/90 to-white p-7 shadow-xl shadow-violet-200/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-600">Faculty test module</p>
              <h1 className="mt-2 text-4xl font-black text-slate-950">Create Test</h1>
              <p className="mt-2 text-sm font-bold text-slate-600">
                Select subject questions, set schedule, and publish the test for students.
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
              <HelpCircle className="h-7 w-7" />
            </div>
          </div>
        </section>

        <FacultyTestCreator />
      </div>
    </main>
  );
}
