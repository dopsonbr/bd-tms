'use client'

import { Suspense, lazy } from 'react'
import type { TruckStatus } from '@/data/types'
import { ClientOnly } from '@/components/shared/client-only'

const FleetMapInner = lazy(() => import('./fleet-map-inner'))

interface FleetMapViewProps {
  statusFilter: TruckStatus | null
}

export function FleetMapView({ statusFilter }: FleetMapViewProps) {
  return (
    <ClientOnly
      fallback={<div className="h-full w-full bg-muted animate-pulse" />}
    >
      <Suspense
        fallback={<div className="h-full w-full bg-muted animate-pulse" />}
      >
        <FleetMapInner statusFilter={statusFilter} />
      </Suspense>
    </ClientOnly>
  )
}
