export default function Quizzes() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Quizzes</h1>
        <p className="text-muted-foreground mt-1">Test your knowledge with these practice quizzes.</p>
      </div>
      <div className="rounded-2xl border border-border bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Quiz Center</h2>
        <p className="text-muted-foreground max-w-md mx-auto">Prepare for your upcoming exams by taking practice quizzes. Your scores will be recorded in your progress tracker.</p>
      </div>
    </div>
  );
}
