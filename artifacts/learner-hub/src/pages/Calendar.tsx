export default function Calendar() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Calendar & Schedule</h1>
        <p className="text-muted-foreground mt-1">Manage your time, classes, and deadlines.</p>
      </div>
      <div className="rounded-2xl border border-border bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Master Schedule</h2>
        <p className="text-muted-foreground max-w-md mx-auto">Sync your university calendar with Learner Hub to get timely reminders for all your important academic events.</p>
      </div>
    </div>
  );
}
