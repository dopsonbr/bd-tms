export function TimelineStep({
  title,
  time,
  active,
}: {
  title: string
  time: string
  active: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.7)]' : 'bg-slate-600'}`}
      />
      <div className="flex-1">
        <p className={`text-sm ${active ? 'text-slate-100' : 'text-slate-400'}`}>{title}</p>
        <p className="text-xs text-slate-500">{time}</p>
      </div>
    </div>
  )
}
