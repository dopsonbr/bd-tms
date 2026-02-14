export function ErrorState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4">
      <p className="text-sm font-semibold text-rose-200">{title}</p>
      <p className="mt-1 text-xs text-rose-100/80">{detail}</p>
    </div>
  )
}

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm font-semibold text-slate-200">{title}</p>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </div>
  )
}
