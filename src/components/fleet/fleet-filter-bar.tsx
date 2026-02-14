'use client'

import type { TruckStatus } from '@/data/types'
import { cn } from '@/lib/utils'

interface FleetFilterBarProps {
  value: TruckStatus | null
  onChange: (value: TruckStatus | null) => void
}

const filters: Array<{ label: string; value: TruckStatus | null }> = [
  { label: 'All', value: null },
  { label: 'En Route', value: 'en_route' },
  { label: 'Empty', value: 'empty' },
  { label: 'At Pickup', value: 'at_pickup' },
  { label: 'At Delivery', value: 'at_delivery' },
  { label: 'Out of Service', value: 'out_of_service' },
]

export function FleetFilterBar({ value, onChange }: FleetFilterBarProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide border-b border-freight-navy/10">
      <div className="flex gap-2 px-4 py-3 min-w-max">
        {filters.map((filter) => (
          <button
            key={filter.label}
            onClick={() => onChange(filter.value)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
              value === filter.value
                ? 'bg-freight-accent text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}
