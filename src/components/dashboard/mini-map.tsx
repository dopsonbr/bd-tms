'use client'

import { Suspense, lazy } from 'react'
import { ClientOnly } from '@/components/shared/client-only'

const MiniMapInner = lazy(() => import('./mini-map-inner'))

export function MiniMap() {
  return (
    <ClientOnly
      fallback={
        <div className="h-[200px] overflow-hidden rounded-xl bg-muted animate-pulse" />
      }
    >
      <Suspense
        fallback={
          <div className="h-[200px] overflow-hidden rounded-xl bg-muted animate-pulse" />
        }
      >
        <MiniMapInner />
      </Suspense>
    </ClientOnly>
  )
}
