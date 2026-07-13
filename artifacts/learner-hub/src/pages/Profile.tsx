export default function Profile() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">User Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and preferences.</p>
      </div>
      <div className="rounded-2xl border border-border bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-500/10 text-slate-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Arjun Singh</h2>
        <p className="text-muted-foreground max-w-md mx-auto">Computer Science • Year 3<br/>arjun.singh@university.edu</p>
      </div>
    </div>
  );
}
