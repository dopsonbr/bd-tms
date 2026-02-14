import type { Load } from '@/domain/types'

export function LoadFinancials({ load }: { load: Load }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h3 className="mb-3 text-sm font-semibold">Financial Breakdown</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between text-slate-300">
          <dt>Revenue</dt>
          <dd>${load.revenueUsd.toLocaleString()}</dd>
        </div>
        <div className="flex justify-between text-slate-300">
          <dt>Cost</dt>
          <dd>${load.costUsd.toLocaleString()}</dd>
        </div>
        <div className="flex justify-between text-emerald-300">
          <dt>Margin</dt>
          <dd>${load.marginUsd.toLocaleString()}</dd>
        </div>
      </dl>
    </section>
  )
}
