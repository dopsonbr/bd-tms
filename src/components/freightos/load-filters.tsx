import { useMemo } from 'react'
import { useAppStore } from '@/state/app-store'

export function LoadFilters() {
  const { state, dispatch } = useAppStore()
  const counts = useMemo(
    () => ({
      active: state.entities.loads.filter((load) => ['assigned', 'in_transit', 'at_risk'].includes(load.status)).length,
      available: state.entities.loads.filter((load) => load.status === 'tendered').length,
      completed: state.entities.loads.filter((load) => ['delivered', 'invoiced'].includes(load.status)).length,
    }),
    [state.entities.loads],
  )

  return (
    <div className="mb-3 flex gap-2">
      {(['active', 'available', 'completed'] as const).map((segment) => (
        <button
          key={segment}
          type="button"
          onClick={() => dispatch({ type: 'set-load-segment', payload: segment })}
          className={`rounded-xl border px-3 py-1.5 text-xs ${
            state.ui.loadSegment === segment
              ? 'border-cyan-400 bg-cyan-500/15 text-cyan-100'
              : 'border-white/10 text-slate-400'
          }`}
        >
          {segment} ({counts[segment]})
        </button>
      ))}
    </div>
  )
}
