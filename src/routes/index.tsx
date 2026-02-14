import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { Load, Truck } from '@/domain/types'

import { AppShell } from '@/components/freightos/app-shell'
import { ExceptionFeed } from '@/components/freightos/exception-feed'
import { FleetMapPanel } from '@/components/freightos/fleet-map-panel'
import { KpiStrip } from '@/components/freightos/kpi-strip'
import { LoadCard } from '@/components/freightos/load-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useAppStore } from '@/state/app-store'

function pickCompatibleTruckForLoad(
  load: Load,
  trucks: Array<Truck>,
): string | undefined {
  const compatible = trucks.find((truck) => truck.equipment === load.equipment)

  if (compatible) {
    return compatible.id
  }

  return trucks[0]?.id
}

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

function DashboardPage() {
  const navigate = useNavigate()
  const {
    state: { nowIso },
    derived: { activeLoads, pendingLoads, upcomingEvents, availableTrucks },
    actions,
  } = useAppStore()

  const priorityLoads = [...pendingLoads, ...activeLoads].slice(0, 4)

  return (
    <AppShell title="Operations Dashboard" motion="cinematic">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => navigate({ to: '/loads' })}>
          Open Loads
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate({ to: '/ai-agent' })}
        >
          Run Dispatch AI
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate({ to: '/fleet' })}
        >
          View Fleet
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate({ to: '/more' })}
        >
          Report & Controls
        </Button>
      </div>

      <KpiStrip />
      <FleetMapPanel compact />
      <div style={{ animationDelay: '120ms' }} className="freight-stagger-item">
        <ExceptionFeed />
      </div>

      <Card
        className="freight-panel freight-stagger-item"
        style={{ animationDelay: '160ms' }}
      >
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-900">
            Upcoming Simulation Window
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {upcomingEvents.slice(0, 4).map((event, index) => (
            <div
              key={event.id}
              className="freight-stagger-item rounded-lg border border-slate-200 bg-white px-3 py-2"
              style={{ animationDelay: `${160 + index * 45}ms` }}
            >
              <p className="text-xs font-semibold text-slate-800">
                {event.title}
              </p>
              <p className="text-xs text-slate-600">{event.detail}</p>
              <p className="text-[11px] text-slate-500">
                Scheduled{' '}
                {new Date(event.atIso).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ))}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => actions.advanceTime(1)}
            >
              +1 hour
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => actions.advanceTime(4)}
            >
              +4 hours
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card
        className="freight-panel freight-stagger-item"
        style={{ animationDelay: '260ms' }}
      >
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-900">
            Priority Queue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {priorityLoads.map((load) => {
            const recommendedTruckId = pickCompatibleTruckForLoad(
              load,
              availableTrucks,
            )

            return (
              <LoadCard
                key={load.id}
                load={load}
                onOpen={() => navigate({ to: '/loads' })}
                onAssign={
                  load.status === 'pending_dispatch' && recommendedTruckId
                    ? () => actions.assignLoad(load.id, recommendedTruckId)
                    : undefined
                }
              />
            )
          })}
          {priorityLoads.length === 0 ? (
            <p className="text-xs text-slate-500">
              No priority loads in current scenario.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <p className="text-[11px] text-slate-500">
        Ops clock:{' '}
        {new Date(nowIso).toLocaleString(undefined, {
          dateStyle: 'short',
          timeStyle: 'short',
        })}
      </p>
    </AppShell>
  )
}
