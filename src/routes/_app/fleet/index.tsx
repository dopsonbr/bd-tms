'use client'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { List, Map, Search } from 'lucide-react'
import type { TruckStatus } from '@/data/types'
import { FleetFilterBar } from '@/components/fleet/fleet-filter-bar'
import { FleetMapView } from '@/components/fleet/fleet-map-view'
import { TruckListPanel } from '@/components/fleet/truck-list-panel'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/fleet/')({
  component: FleetScreen,
})

function FleetScreen() {
  const navigate = useNavigate()
  const [view, setView] = useState<'map' | 'list'>('list')
  const [statusFilter, setStatusFilter] = useState<TruckStatus | null>(null)

  return (
    <div className="flex flex-col h-screen bg-freight-bg">
      {/* Header */}
      <div className="bg-white border-b border-freight-navy/10">
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-freight-navy">Fleet</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => setView('map')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  view === 'map'
                    ? 'bg-white text-freight-accent shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Map className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  view === 'list'
                    ? 'bg-white text-freight-accent shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <FleetFilterBar value={statusFilter} onChange={setStatusFilter} />
      </div>

      {/* Content */}
      {view === 'map' ? (
        <div className="flex-1">
          <FleetMapView statusFilter={statusFilter} />
        </div>
      ) : (
        <TruckListPanel
          statusFilter={statusFilter}
          onTruckClick={(truckId) =>
            navigate({ to: '/fleet/$truckId', params: { truckId } })
          }
        />
      )}
    </div>
  )
}
