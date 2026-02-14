import { Outlet, createFileRoute } from '@tanstack/react-router'

import { FleetMapPanel } from '@/components/freightos/fleet-map-panel'
import { useAppStore } from '@/state/app-store'
import { selectFleetAvailability } from '@/state/selectors/ops-selectors'

export const Route = createFileRoute('/fleet')({ component: FleetRoute })

function FleetRoute() {
  const { state } = useAppStore()
  const availability = selectFleetAvailability(state)

  return (
    <div className="space-y-3">
      <section className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs">
        <div className="rounded-lg bg-white/[0.03] p-2 text-center">Avail {availability.available}</div>
        <div className="rounded-lg bg-white/[0.03] p-2 text-center">Assigned {availability.assigned}</div>
        <div className="rounded-lg bg-white/[0.03] p-2 text-center">Maint {availability.maintenance}</div>
      </section>
      <FleetMapPanel />
      <Outlet />
    </div>
  )
}
