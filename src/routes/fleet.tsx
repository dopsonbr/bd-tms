import { createFileRoute } from '@tanstack/react-router'

import { AppShell } from '@/components/freightos/app-shell'
import { FleetMapPanel } from '@/components/freightos/fleet-map-panel'
import { StatusBadge } from '@/components/freightos/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/state/app-store'

export const Route = createFileRoute('/fleet')({
  component: FleetPage,
})

function FleetPage() {
  const {
    state: { trucks, drivers },
  } = useAppStore()

  const utilization = Math.round(
    (1 -
      trucks.filter((truck) => truck.status === 'available').length /
        Math.max(1, trucks.length)) *
      100,
  )

  return (
    <AppShell title="Fleet" motion="snappy">
      <FleetMapPanel />

      <Card className="freight-panel freight-stagger-item">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-900">
            Driver Roster
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {drivers.slice(0, 12).map((driver) => (
            <div
              key={driver.id}
              className="freight-stagger-item rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {driver.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    HOS {driver.hosRemainingHours.toFixed(1)}h | Score{' '}
                    {driver.performanceScore}
                  </p>
                </div>
                <StatusBadge status={driver.status} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="freight-panel freight-stagger-item">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-900">
            Truck Snapshot
          </CardTitle>
          <p className="text-xs text-slate-500">
            Fleet utilization: {utilization}% · {trucks.length} total assets
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {trucks.slice(0, 8).map((truck) => (
            <div
              key={truck.id}
              className="freight-stagger-item rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <p className="text-xs font-semibold text-slate-800">
                {truck.unit}
              </p>
              <p className="text-[11px] text-slate-500">
                {truck.city}, {truck.state} | ETA {truck.etaMinutes}m
              </p>
              <div className="mt-1">
                <StatusBadge status={truck.status} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  )
}
