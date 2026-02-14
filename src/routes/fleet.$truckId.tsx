import { createFileRoute } from '@tanstack/react-router'

import { DriverPanel } from '@/components/freightos/driver-panel'
import { ErrorState } from '@/components/freightos/error-state'
import { useAppStore } from '@/state/app-store'

export const Route = createFileRoute('/fleet/$truckId')({ component: TruckDetailRoute })

function TruckDetailRoute() {
  const { truckId } = Route.useParams()
  const { state } = useAppStore()
  const truck = state.entities.trucks.find((item) => item.id === truckId)
  const driver = state.entities.drivers.find((item) => item.id === truck?.driverId)

  if (!truck) {
    return <ErrorState title="Truck not found" detail={`No unit for ${truckId}.`} />
  }

  return (
    <div className="space-y-3">
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <h2 className="text-sm font-semibold">{truck.unitNumber}</h2>
        <p className="mt-1 text-xs text-slate-400">
          {truck.equipment} · {truck.status} · ETA {truck.etaMinutes}m
        </p>
      </section>
      <DriverPanel driver={driver} truck={truck} />
    </div>
  )
}
