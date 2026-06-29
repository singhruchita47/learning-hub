export default function Resources() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Study Resources</h1>
        <p className="text-muted-foreground mt-1">Access all your course materials, notes, and guides.</p>
      </div>
      <div className="rounded-2xl border border-border bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Resource Library</h2>
        <p className="text-muted-foreground max-w-md mx-auto">Browse through hundreds of PDF notes, lecture slides, and video recordings. Use the search to find specific materials.</p>
      </div>
    </div>
  );
}
