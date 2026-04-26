export default function Loading() {
  return (
    <main className="page-shell py-12">
      <div className="animate-pulse space-y-6">
        <div className="h-12 w-1/3 rounded-2xl bg-slate-800/70" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-3xl border border-border bg-panel">
              <div className="aspect-[2/3] bg-slate-800/60" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-2/3 rounded bg-slate-800/60" />
                <div className="h-3 w-full rounded bg-slate-800/40" />
                <div className="h-3 w-5/6 rounded bg-slate-800/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
