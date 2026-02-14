export function MetricCard({
  label,
  value,
  trend,
  tone = 'neutral',
}: {
  label: string
  value: string
  trend: string
  tone?: 'neutral' | 'good' | 'warn'
}) {
  const toneClass =
    tone === 'good'
      ? 'text-emerald-200 bg-emerald-500/10'
      : tone === 'warn'
        ? 'text-orange-200 bg-orange-500/10'
        : 'text-slate-200 bg-slate-500/10'

  return (
    <article className={`rounded-2xl border border-white/10 p-3 ${toneClass}`}>
      <p className="text-xs uppercase tracking-wide text-slate-300">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-slate-300">{trend}</p>
    </article>
  )
}
