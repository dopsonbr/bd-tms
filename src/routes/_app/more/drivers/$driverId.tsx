'use client'

import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Star, Truck } from 'lucide-react'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'
import { EQUIPMENT_LABEL } from '@/data/constants'

export const Route = createFileRoute('/_app/more/drivers/$driverId')({
  component: DriverDetailScreen,
})

function DriverDetailScreen() {
  const { driverId } = Route.useParams()
  const drivers = useAppStore((s) => s.drivers)
  const trucks = useAppStore((s) => s.trucks)

  const driver = drivers[driverId]
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!driver) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-muted-foreground">Driver not found</p>
      </div>
    )
  }

  const truck = driver.truckId ? trucks[driver.truckId] : null
  const statusColor = {
    active: 'bg-freight-success/10 text-freight-success',
    off_duty: 'bg-freight-idle/10 text-freight-idle',
    on_leave: 'bg-freight-warning/10 text-freight-warning',
  }
  const statusLabel = {
    active: 'Active',
    off_duty: 'Off Duty',
    on_leave: 'On Leave',
  }
  const phaseLabel: Record<string, string> = {
    driving: 'Driving',
    on_duty: 'On Duty',
    sleeper: 'Sleeper Berth',
    off_duty: 'Off Duty',
  }

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="sticky top-0 z-10 bg-freight-bg px-4 pb-2 pt-4">
        <div className="flex items-center gap-3">
          <Link
            to="/more/drivers"
            className="rounded-full p-1.5 hover:bg-muted active:bg-muted/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{driver.name}</h1>
            <p className="text-xs text-muted-foreground">{driver.phone}</p>
          </div>
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold',
              statusColor[driver.status],
            )}
          >
            {statusLabel[driver.status]}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4">
        {/* Profile Card */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Profile
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">CDL Number</p>
              <p className="text-sm font-semibold font-mono">
                {driver.cdlNumber}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">CDL Expiry</p>
              <p className="text-sm font-semibold">
                {new Date(driver.cdlExpiry).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Home Base</p>
              <p className="text-sm font-semibold">{driver.homeBase}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hire Date</p>
              <p className="text-sm font-semibold">
                {new Date(driver.hireDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          {driver.endorsements.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1">Endorsements</p>
              <div className="flex flex-wrap gap-1">
                {driver.endorsements.map((e) => (
                  <span
                    key={e}
                    className="rounded-md bg-freight-accent/10 px-2 py-0.5 text-[10px] font-semibold text-freight-accent"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1">
              Certified Equipment
            </p>
            <div className="flex flex-wrap gap-1">
              {driver.certifiedEquipment.map((eq) => (
                <span
                  key={eq}
                  className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium"
                >
                  {EQUIPMENT_LABEL[eq]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* HOS Card */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Hours of Service
            </h3>
            <span className="rounded-full bg-freight-accent/10 px-2 py-0.5 text-[10px] font-semibold text-freight-accent">
              {phaseLabel[driver.hos.phase] ?? driver.hos.phase}
            </span>
          </div>
          <div className="space-y-3">
            <HosBar
              label="Drive Time"
              remaining={driver.hos.driveRemaining}
              total={660}
            />
            <HosBar
              label="On-Duty Time"
              remaining={driver.hos.onDutyRemaining}
              total={840}
            />
            <HosBar
              label="Cycle (70h)"
              remaining={driver.hos.cycleRemaining}
              total={4200}
            />
          </div>
          {driver.hos.nextBreakDue > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Next break due in {(driver.hos.nextBreakDue / 60).toFixed(1)}{' '}
              hours
            </p>
          )}
        </div>

        {/* Performance Card */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Performance
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-freight-warning/10">
              <span className="text-lg font-bold text-freight-warning">
                {driver.performanceScore}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < Math.round(driver.performanceScore / 20)
                        ? 'fill-freight-warning text-freight-warning'
                        : 'text-muted',
                    )}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Performance score out of 100
              </p>
            </div>
          </div>
          {driver.preferredLanes.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1">
                Preferred Lanes
              </p>
              <div className="flex flex-wrap gap-1">
                {driver.preferredLanes.map((lane) => (
                  <span
                    key={lane}
                    className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium"
                  >
                    {lane}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Current Truck Card */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Assigned Truck
          </h3>
          {truck ? (
            <Link
              to="/fleet/$truckId"
              params={{ truckId: truck.id }}
              className="flex items-center gap-3"
            >
              <Truck className="h-5 w-5 text-freight-accent" />
              <div>
                <p className="text-sm font-semibold">{truck.truckNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {EQUIPMENT_LABEL[truck.equipmentType]}
                </p>
              </div>
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">No truck assigned</p>
          )}
        </div>
      </div>
    </div>
  )
}

function HosBar({
  label,
  remaining,
  total,
}: {
  label: string
  remaining: number
  total: number
}) {
  const pct = Math.min(100, (remaining / total) * 100)
  const hours = (remaining / 60).toFixed(1)
  const totalHours = (total / 60).toFixed(0)
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {hours}h / {totalHours}h
        </span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            pct > 50
              ? 'bg-freight-success'
              : pct > 20
                ? 'bg-freight-warning'
                : 'bg-freight-critical',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
