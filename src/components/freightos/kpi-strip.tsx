import { MetricCard } from './metric-card'
import { useAppStore } from '@/state/app-store'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function KpiStrip() {
  const {
    derived: { kpis },
  } = useAppStore()

  const benchmarks = {
    activeLoads: 12,
    availableTrucks: 10,
    unresolvedExceptions: 2,
    todayRevenue: 22000,
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <MetricCard
        label="Loads in Motion"
        sublabel={`${kpis.activeLoads} loaded today`}
        value={String(kpis.activeLoads)}
        benchmark={{
          label: 'Target',
          value: String(benchmarks.activeLoads),
          actual: kpis.activeLoads,
          target: benchmarks.activeLoads,
          direction: 'higher-is-better',
        }}
      />
      <MetricCard
        label="Truck Availability"
        sublabel={`${kpis.availableTrucks} ready now`}
        value={String(kpis.availableTrucks)}
        benchmark={{
          label: 'Target',
          value: String(benchmarks.availableTrucks),
          actual: kpis.availableTrucks,
          target: benchmarks.availableTrucks,
          direction: 'higher-is-better',
        }}
      />
      <MetricCard
        label="Open Exceptions"
        sublabel="Criticality still unresolved"
        value={String(kpis.unresolvedExceptions)}
        benchmark={{
          label: 'Exception SLA',
          value: `≤ ${benchmarks.unresolvedExceptions}`,
          actual: kpis.unresolvedExceptions,
          target: benchmarks.unresolvedExceptions,
          direction: 'lower-is-better',
        }}
      />
      <MetricCard
        label="Revenue Today"
        sublabel={`${formatCurrency(kpis.todayRevenue)} earned`}
        value={formatCurrency(kpis.todayRevenue)}
        benchmark={{
          label: 'Benchmark',
          value: formatCurrency(benchmarks.todayRevenue),
          actual: kpis.todayRevenue,
          target: benchmarks.todayRevenue,
          direction: 'higher-is-better',
        }}
      />
    </div>
  )
}
