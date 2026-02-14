'use client'

import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowLeft,
  Clock,
  MapPin,
  Navigation,
  Package,
  User,
} from 'lucide-react'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'
import {
  EQUIPMENT_LABEL,
  TRUCK_STATUS_COLOR,
  TRUCK_STATUS_LABEL,
} from '@/data/constants'

export const Route = createFileRoute('/_app/fleet/$truckId')({
  component: TruckDetailScreen,
})

function TruckDetailScreen() {
  const { truckId } = Route.useParams()
  const trucks = useAppStore((s) => s.trucks)
  const drivers = useAppStore((s) => s.drivers)
  const loads = useAppStore((s) => s.loads)

  const truck = trucks[truckId]
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!truck) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-muted-foreground">Truck not found</p>
      </div>
    )
  }

  const driver = truck.driverId ? drivers[truck.driverId] : null
  const currentLoad = truck.currentLoadId ? loads[truck.currentLoadId] : null
  const statusColor = TRUCK_STATUS_COLOR[truck.status]
  const statusLabel = TRUCK_STATUS_LABEL[truck.status]

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-freight-bg px-4 pb-2 pt-4">
        <div className="flex items-center gap-3">
          <Link
            to="/fleet"
            className="rounded-full p-1.5 hover:bg-muted active:bg-muted/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{truck.truckNumber}</h1>
            <p className="text-xs text-muted-foreground">
              {EQUIPMENT_LABEL[truck.equipmentType]}
            </p>
          </div>
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold',
              statusColor,
            )}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4">
        {/* Location Card */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Location
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-freight-accent" />
              <span className="text-sm">
                {truck.position.lat.toFixed(4)}, {truck.position.lng.toFixed(4)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Navigation className="h-4 w-4 text-freight-accent" />
              <span className="text-sm">
                Heading: {truck.heading}° • Speed: {truck.speed} mph
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Home Hub: {truck.homeHub}
              </span>
            </div>
          </div>
        </div>

        {/* Driver Card */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Driver
          </h3>
          {driver ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-freight-accent" />
                <span className="text-sm font-medium">{driver.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  Score: {driver.performanceScore}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Drive: {(driver.hos.driveRemaining / 60).toFixed(1)}h •
                  On-Duty: {(driver.hos.onDutyRemaining / 60).toFixed(1)}h •
                  Cycle: {(driver.hos.cycleRemaining / 60).toFixed(1)}h
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full',
                    driver.hos.driveRemaining > 360
                      ? 'bg-freight-success'
                      : driver.hos.driveRemaining > 120
                        ? 'bg-freight-warning'
                        : 'bg-freight-critical',
                  )}
                  style={{
                    width: `${Math.min(100, (driver.hos.driveRemaining / 660) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No driver assigned</p>
          )}
        </div>

        {/* Current Load Card */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Current Load
          </h3>
          {currentLoad ? (
            <Link
              to="/loads/$loadId"
              params={{ loadId: currentLoad.id }}
              className="block"
            >
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-freight-accent" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{currentLoad.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {currentLoad.origin.city} → {currentLoad.destination.city}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {currentLoad.distance} mi
                </span>
              </div>
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">No active load</p>
          )}
        </div>

        {/* Vehicle Info */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Vehicle Info
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Mileage</p>
              <p className="text-sm font-semibold">
                {truck.mileage.toLocaleString()} mi
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Next Maintenance</p>
              <p className="text-sm font-semibold">
                {truck.nextMaintenanceMiles.toLocaleString()} mi
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Miles Until Service
              </p>
              <p
                className={cn(
                  'text-sm font-semibold',
                  truck.nextMaintenanceMiles - truck.mileage < 5000
                    ? 'text-freight-warning'
                    : 'text-foreground',
                )}
              >
                {(truck.nextMaintenanceMiles - truck.mileage).toLocaleString()}{' '}
                mi
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">VIN</p>
              <p className="text-xs font-mono text-muted-foreground">
                {truck.vin}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
