export default function PlaceholderPage({ title }) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-ink/10">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-stone mb-1">Module / Overview</div>
          <h1 className="font-serif text-3xl font-normal text-ink tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-transparent border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-paper transition-all">
            Export
          </button>
          <button className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-ink text-paper hover:bg-ink/85 transition-all">
            + New Record
          </button>
        </div>
      </div>

      {/* Overview Cards Mock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 border border-ink/15 rounded-lg bg-paper/50">
          <div className="text-xs font-mono uppercase tracking-wider text-stone mb-1">Total {title}</div>
          <div className="text-2xl font-serif font-medium text-ink">0</div>
          <div className="text-[11px] text-stone mt-2">No records ingested yet</div>
        </div>
        <div className="p-5 border border-ink/15 rounded-lg bg-paper/50">
          <div className="text-xs font-mono uppercase tracking-wider text-stone mb-1">Active Pipeline</div>
          <div className="text-2xl font-serif font-medium text-ink">—</div>
          <div className="text-[11px] text-stone mt-2">Sync pending</div>
        </div>
        <div className="p-5 border border-ink/15 rounded-lg bg-paper/50">
          <div className="text-xs font-mono uppercase tracking-wider text-stone mb-1">Last Sync</div>
          <div className="text-xs font-mono text-ink mt-2">Up to date</div>
          <div className="text-[11px] text-stone mt-1">Direct API stream</div>
        </div>
      </div>

      {/* Main Empty State Panel */}
      <div className="border border-dashed border-ink/20 rounded-xl p-12 text-center bg-paper/40 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-12 h-12 rounded-full bg-ink/5 flex items-center justify-center text-stone mb-4 font-mono text-sm">
          ⌘
        </div>
        <h3 className="font-serif text-xl text-ink mb-1">{title} Workspace</h3>
        <p className="text-stone text-sm max-w-sm mx-auto mb-6">
          This section is connected to the workspace navigation. Ingested records and workflows will populate here.
        </p>
        <button className="px-5 py-2.5 text-xs font-mono uppercase tracking-wider bg-ink text-paper rounded hover:bg-ink/80 transition-all">
          Connect Data Source
        </button>
      </div>
    </div>
  );
}