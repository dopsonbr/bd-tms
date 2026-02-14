'use client'

import { createFileRoute } from '@tanstack/react-router'
import { GreetingBar } from '@/components/dashboard/greeting-bar'
import { QuickActionsStrip } from '@/components/dashboard/quick-actions-strip'
import { KpiGrid } from '@/components/dashboard/kpi-grid'
import { MiniMap } from '@/components/dashboard/mini-map'
import { ExceptionFeed } from '@/components/dashboard/exception-feed'
import { ScheduleTimeline } from '@/components/dashboard/schedule-timeline'

export const Route = createFileRoute('/_app/')({
  component: DashboardScreen,
})

function DashboardScreen() {
  return (
    <div className="flex flex-col gap-3 p-4 pb-2">
      <GreetingBar />
      <QuickActionsStrip />
      <KpiGrid />
      <MiniMap />
      <ExceptionFeed />
      <ScheduleTimeline />
    </div>
  )
}
