'use client'

import { TruckCard } from './truck-card'
import type { TruckStatus } from '@/data/types'
import { useAppStore } from '@/store'

interface TruckListPanelProps {
  statusFilter: TruckStatus | null
  onTruckClick?: (truckId: string) => void
}

export function TruckListPanel({
  statusFilter,
  onTruckClick,
}: TruckListPanelProps) {
  const trucks = useAppStore((state) => state.trucks)

  const allTrucks = Object.values(trucks)
  const filteredTrucks = statusFilter
    ? allTrucks.filter((t) => t.status === statusFilter)
    : allTrucks

  const sortedTrucks = [...filteredTrucks].sort((a, b) =>
    a.id.localeCompare(b.id),
  )

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 py-3 border-b border-freight-navy/10">
        <span className="text-sm font-medium text-muted-foreground">
          {sortedTrucks.length} truck{sortedTrucks.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="p-4 space-y-3">
        {sortedTrucks.map((truck) => (
          <TruckCard
            key={truck.id}
            truck={truck}
            onClick={() => onTruckClick?.(truck.id)}
          />
        ))}
      </div>
    </div>
  )
}
