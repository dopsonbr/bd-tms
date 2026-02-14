import { useMemo } from 'react'
import { useAppStore } from '@/state/app-store'

export function RateControls() {
  const { state, dispatch } = useAppStore()
  const targetLoad = useMemo(() => state.entities.loads.find((load) => load.tags.includes('brokered')), [state.entities.loads])

  if (!targetLoad) {
    return null
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h3 className="text-sm font-semibold">Rate Controls</h3>
      <p className="mt-1 text-xs text-slate-400">Adjust revenue to preview margin impact for {targetLoad.reference}.</p>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'apply-rate', payload: { loadId: targetLoad.id, revenueUsd: targetLoad.revenueUsd - 100 } })}
          className="rounded-lg border border-white/10 px-2 py-1 text-xs"
        >
          -$100
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'apply-rate', payload: { loadId: targetLoad.id, revenueUsd: targetLoad.revenueUsd + 100 } })}
          className="rounded-lg border border-white/10 px-2 py-1 text-xs"
        >
          +$100
        </button>
      </div>
      <p className="mt-2 text-xs text-emerald-300">Current margin: ${targetLoad.marginUsd.toLocaleString()}</p>
    </section>
  )
}
