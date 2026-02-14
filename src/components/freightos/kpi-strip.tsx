import { MetricCard } from './metric-card'
import { useAppStore } from '@/state/app-store'
import { selectKpis } from '@/state/selectors'

export function KpiStrip() {
  const { state } = useAppStore()
  const kpi = selectKpis(state)

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <MetricCard label="Active" value={String(kpi.activeLoads)} trend="Across all fleets" />
      <MetricCard label="Tendered" value={String(kpi.tenderedLoads)} trend="Awaiting assignment" />
      <MetricCard label="Margin" value={`$${kpi.marginUsd.toLocaleString()}`} trend="Portfolio total" tone="good" />
      <MetricCard label="Risk" value={String(kpi.onTimeRisk)} trend="Open exceptions" tone={kpi.onTimeRisk > 0 ? 'warn' : 'good'} />
    </section>
  )
}
