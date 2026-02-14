export function ChartCard({ title, bars }: { title: string; bars: Array<number> }) {
  const max = Math.max(...bars, 1)

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      <div className="mt-3 flex h-24 items-end gap-2">
        {bars.map((value, idx) => (
          <div
            key={`${title}-${idx}`}
            className="w-4 rounded-t bg-cyan-400/70"
            style={{ height: `${Math.max(8, (value / max) * 100)}%` }}
            title={String(value)}
          />
        ))}
      </div>
    </article>
  )
}
