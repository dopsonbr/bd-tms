'use client'

import { ArrowRight } from 'lucide-react'
import type { Truck } from '@/data/types'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'
import { useAppStore } from '@/store'
import { EQUIPMENT_LABEL, TRUCK_STATUS_COLOR } from '@/data/constants'
import { formatMinutesToHours } from '@/lib/format'
import { cn } from '@/lib/utils'

interface TruckCardProps {
  truck: Truck
  onClick?: () => void
}

export function TruckCard({ truck, onClick }: TruckCardProps) {
  const drivers = useAppStore((state) => state.drivers)
  const loads = useAppStore((state) => state.loads)

  const driver = Object.values(drivers).find((d) => d.id === truck.driverId)
  const activeLoad = truck.currentLoadId
    ? loads[truck.currentLoadId]
    : undefined

  const statusColor = TRUCK_STATUS_COLOR[truck.status]
  const equipmentLabel = EQUIPMENT_LABEL[truck.equipmentType]

  const route = activeLoad
    ? `${activeLoad.origin.city} \u2192 ${activeLoad.destination.city}`
    : null

  const hosRemaining = driver
    ? formatMinutesToHours(driver.hos.driveRemaining)
    : null

  return (
    <Card
      data-slot="card"
      onClick={onClick}
      className={cn(
        'cursor-pointer transition-all active:scale-[0.98]',
        'border-l-4',
      )}
      style={{ borderLeftColor: `var(--color-${statusColor})` }}
    >
      <CardContent className="p-4 space-y-2">
        {/* Row 1: ID + Equipment + Status */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">{truck.truckNumber}</span>
          <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-md">
            {equipmentLabel}
          </span>
          <div className="ml-auto">
            <StatusBadge status={truck.status} type="truck" />
          </div>
        </div>

        {/* Row 2: Driver + Route */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            {driver?.name || 'Unassigned'}
          </span>
          {route && (
            <>
              <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
              <span className="text-foreground font-medium flex-1 truncate">
                {route}
              </span>
            </>
          )}
        </div>

        {/* Row 3: Speed + HOS */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-freight-accent font-medium">
            {truck.speed > 0 ? `${truck.speed} mph` : 'Stopped'}
          </span>
          {hosRemaining && (
            <span className="text-muted-foreground">{hosRemaining} HOS</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
