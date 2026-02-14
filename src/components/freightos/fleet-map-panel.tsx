import { Link } from '@tanstack/react-router'

import { MapAdapter } from './map-adapter'
import { useAppStore } from '@/state/app-store'

export function FleetMapPanel() {
  const { state } = useAppStore()
  const assigned = state.entities.trucks.filter((truck) => truck.status === 'assigned').slice(0, 6)

  return (
    <section className="space-y-3">
      <MapAdapter title="Fleet live map" detail="Select a unit to inspect assignment, HOS, and ETA" />
      <div className="grid gap-2">
        {assigned.map((truck) => (
          <Link
            key={truck.id}
            to="/fleet/$truckId"
            params={{ truckId: truck.id }}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm"
          >
            {truck.unitNumber} · {truck.location} · ETA {truck.etaMinutes}m
          </Link>
        ))}
      </div>
    </section>
  )
}
