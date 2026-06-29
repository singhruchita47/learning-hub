export default function Leaderboard() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Global Leaderboard</h1>
        <p className="text-muted-foreground mt-1">See how you stack up against other learners.</p>
      </div>
      <div className="rounded-2xl border border-border bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Full Rankings</h2>
        <p className="text-muted-foreground max-w-md mx-auto">Keep completing courses, taking quizzes, and participating in the community to earn more XP and climb the ranks!</p>
      </div>
    </div>
  );
}
