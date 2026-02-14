'use client'

import { Package } from 'lucide-react'
import { LoadCard } from './load-card'
import type { LoadStatus } from '@/data/types'
import { EmptyState } from '@/components/shared/empty-state'
import { useAppStore } from '@/store'

type Segment = 'active' | 'available' | 'completed'

interface LoadListProps {
  segment: Segment
  onLoadClick?: (loadId: string) => void
}

const ACTIVE_STATUSES: Array<LoadStatus> = [
  'dispatched',
  'en_route_pickup',
  'at_pickup',
  'in_transit',
  'at_delivery',
]

const AVAILABLE_STATUSES: Array<LoadStatus> = ['tendered', 'accepted']

const COMPLETED_STATUSES: Array<LoadStatus> = ['delivered', 'invoiced', 'paid']

export function LoadList({ segment, onLoadClick }: LoadListProps) {
  const loads = useAppStore((state) => state.loads)

  const allLoads = Object.values(loads)
  const filteredLoads = allLoads.filter((load) => {
    if (segment === 'active') {
      return ACTIVE_STATUSES.includes(load.status)
    }
    if (segment === 'available') {
      return AVAILABLE_STATUSES.includes(load.status) && !load.assignedTruckId
    }
    return COMPLETED_STATUSES.includes(load.status)
  })

  const sortedLoads = [...filteredLoads].sort((a, b) => {
    // Sort by load ID descending (newest first)
    return b.id.localeCompare(a.id)
  })

  if (sortedLoads.length === 0) {
    const emptyMessages = {
      active: {
        title: 'No active loads',
        description: 'All loads are either available or completed',
      },
      available: {
        title: 'No available loads',
        description: 'All loads have been assigned',
      },
      completed: {
        title: 'No completed loads',
        description: 'Completed loads will appear here',
      },
    }

    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          icon={Package}
          title={emptyMessages[segment].title}
          description={emptyMessages[segment].description}
        />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 py-3 border-b border-freight-navy/10">
        <span className="text-sm font-medium text-muted-foreground">
          {sortedLoads.length} load{sortedLoads.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="p-4 space-y-3">
        {sortedLoads.map((load) => (
          <LoadCard
            key={load.id}
            load={load}
            onClick={() => onLoadClick?.(load.id)}
          />
        ))}
      </div>
    </div>
  )
}
