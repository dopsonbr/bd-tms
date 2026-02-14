import { createFileRoute } from '@tanstack/react-router'

import { AppShell } from '@/components/freightos/app-shell'
import { DemoControlsPanel } from '@/components/freightos/demo-controls-panel'
import { MetricCard } from '@/components/freightos/metric-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/state/app-store'

export const Route = createFileRoute('/more')({
  component: MorePage,
})

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function MorePage() {
  const {
    state: { notifications, trucks },
    derived: { kpis },
  } = useAppStore()

  const safeActiveLoads = Math.max(1, kpis.activeLoads)
  const safeRevenueBase = Math.max(1, kpis.todayRevenue)
  const margin = Math.round((kpis.todayMargin / safeRevenueBase) * 100)
  const loadDensity = Math.round(
    (kpis.activeBrokeredLoads / safeActiveLoads) * 100,
  )
  const utilization = Math.round(
    (1 - kpis.availableTrucks / Math.max(1, trucks.length)) * 100,
  )
  const activeRevenuePerTruck = Math.round(
    kpis.todayRevenue / Math.max(1, kpis.activeLoads),
  )
  const revenueIntensity = Math.round(
    kpis.todayRevenue / Math.max(1, kpis.availableTrucks || 1),
  )

  return (
    <AppShell
      title="Reports & Controls"
      subtitle="Benchmark-driven operations review and scenario controls"
      motion="cinematic"
    >
      <div className="grid grid-cols-2 gap-2">
        <MetricCard
          label="Revenue Intensity"
          sublabel="Across active fleet"
          value={formatCurrency(revenueIntensity)}
          benchmark={{
            label: 'Benchmark',
            value: '$4,100',
            actual: revenueIntensity,
            target: 4100,
            direction: 'higher-is-better',
          }}
        />
        <MetricCard
          label="Brokered Pipeline"
          sublabel="Carrier-mediated volume currently open"
          value={String(kpis.activeBrokeredLoads)}
          benchmark={{
            label: 'Benchmark',
            value: '2',
            actual: kpis.activeBrokeredLoads,
            target: 2,
            direction: 'higher-is-better',
          }}
        />
        <MetricCard
          label="Margin vs Baseline"
          sublabel="Active load contribution"
          value={`${margin.toFixed(0)}%`}
          benchmark={{
            label: 'Goal',
            value: '22%',
            actual: margin,
            target: 22,
            direction: 'higher-is-better',
          }}
        />
        <MetricCard
          label="Brokered Mix"
          sublabel="Brokered share of active board"
          value={`${loadDensity}%`}
          benchmark={{
            label: 'Target',
            value: '18%',
            actual: loadDensity,
            target: 18,
            direction: 'higher-is-better',
          }}
        />
        <MetricCard
          label="Fleet Utilization"
          sublabel="In-load fleet share now"
          value={`${utilization}%`}
          benchmark={{
            label: 'Shift Target',
            value: '82%',
            actual: utilization,
            target: 82,
            direction: 'higher-is-better',
          }}
        />
        <MetricCard
          label="Revenue per Active Load"
          sublabel="Current operating velocity"
          value={formatCurrency(activeRevenuePerTruck)}
          benchmark={{
            label: 'Benchmark',
            value: '$2,600',
            actual: activeRevenuePerTruck,
            target: 2600,
            direction: 'higher-is-better',
          }}
        />
      </div>

      <Card className="freight-panel">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-900">
            Notification Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {notifications.slice(0, 8).map((notification) => (
            <div
              key={notification.id}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <p className="text-xs font-semibold text-slate-800">
                {notification.title}
              </p>
              <p className="text-[11px] text-slate-500">
                {new Date(notification.createdAtIso).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <DemoControlsPanel />
    </AppShell>
  )
}
