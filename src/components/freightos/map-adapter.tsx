export function MapAdapter({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 p-4">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-500/20 blur-2xl" />
      <p className="text-xs uppercase tracking-wide text-cyan-200">Map Adapter</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{title}</p>
      <p className="mt-1 text-xs text-slate-300">{detail}</p>
    </div>
  )
}
