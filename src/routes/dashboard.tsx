import { createFileRoute } from '@tanstack/react-router'

import { ExceptionFeed } from '@/components/freightos/exception-feed'
import { KpiStrip } from '@/components/freightos/kpi-strip'
import { MiniMap } from '@/components/freightos/mini-map'
import { QuickActions } from '@/components/freightos/quick-actions'
import { TodayTimeline } from '@/components/freightos/today-timeline'

export const Route = createFileRoute('/dashboard')({ component: DashboardRoute })

function DashboardRoute() {
  return (
    <div className="space-y-3">
      <KpiStrip />
      <QuickActions />
      <MiniMap />
      <ExceptionFeed />
      <TodayTimeline />
    </div>
  )
}
