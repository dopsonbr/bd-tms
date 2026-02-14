'use client'

import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { ArrowLeft, Clock, Phone, Search, Star, User } from 'lucide-react'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/more/drivers/')({
  component: DriversScreen,
})

function DriversScreen() {
  const drivers = useAppStore((s) => s.drivers)
  const trucks = useAppStore((s) => s.trucks)
  const [search, setSearch] = useState('')

  const driverList = useMemo(() => {
    const all = Object.values(drivers)
    if (!search) return all
    return all.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase()),
    )
  }, [drivers, search])

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

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="sticky top-0 z-10 bg-freight-bg px-4 pb-2 pt-4">
        <div className="flex items-center gap-3">
          <Link
            to="/more"
            className="rounded-full p-1.5 hover:bg-muted active:bg-muted/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold">Drivers</h1>
          <span className="ml-auto text-xs text-muted-foreground">
            {driverList.length} drivers
          </span>
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search drivers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-freight-accent/40"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4">
        {driverList.map((driver) => {
          const truck = driver.truckId ? trucks[driver.truckId] : null
          return (
            <Link
              key={driver.id}
              to="/more/drivers/$driverId"
              params={{ driverId: driver.id }}
              className="overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-border active:bg-muted/50"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-freight-accent/10">
                  <User className="h-5 w-5 text-freight-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate">
                      {driver.name}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        statusColor[driver.status],
                      )}
                    >
                      {statusLabel[driver.status]}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {driver.phone}
                    </span>
                    {truck && <span>Truck {truck.truckNumber}</span>}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
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
                    <span className="text-[10px] text-muted-foreground">
                      {(driver.hos.driveRemaining / 60).toFixed(1)}h
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-freight-warning" />
                  <span className="text-xs font-semibold">
                    {driver.performanceScore}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
