import { SeverityBadge } from './status-badge'
import { useAppStore } from '@/state/app-store'
import { selectOpenExceptions } from '@/state/selectors'

export function ExceptionFeed() {
  const { state, dispatch } = useAppStore()
  const exceptions = selectOpenExceptions(state)

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Exception Feed</h2>
        <span className="text-xs text-slate-400">{exceptions.length} open</span>
      </div>
      <div className="space-y-2">
        {exceptions.slice(0, 5).map((exception) => (
          <div key={exception.id} className="rounded-xl border border-white/10 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-slate-100">{exception.title}</p>
              <SeverityBadge severity={exception.severity} />
            </div>
            <p className="mt-1 text-xs text-slate-400">{exception.detail}</p>
            <button
              type="button"
              onClick={() => dispatch({ type: 'resolve-exception', payload: exception.id })}
              className="mt-2 text-xs text-cyan-300"
            >
              Resolve
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
