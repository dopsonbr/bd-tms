import { StatusBadge } from './status-badge'
import { useAppStore } from '@/state/app-store'
import { selectBrokerLoads } from '@/state/selectors/ops-selectors'

export function BrokerLoadBoard() {
  const { state } = useAppStore()
  const loads = selectBrokerLoads(state).slice(0, 6)

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h3 className="mb-3 text-sm font-semibold">Broker Load Board</h3>
      <div className="space-y-2">
        {loads.map((load) => (
          <article key={load.id} className="rounded-xl border border-white/10 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm">{load.reference}</p>
              <StatusBadge status={load.status} />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Margin ${load.marginUsd.toLocaleString()} · {load.origin} {'->'} {load.destination}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
