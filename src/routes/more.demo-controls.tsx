import { createFileRoute } from '@tanstack/react-router'

import { DemoControlsPanel } from '@/components/freightos/demo-controls-panel'

export const Route = createFileRoute('/more/demo-controls')({ component: DemoControlsRoute })

function DemoControlsRoute() {
  return <DemoControlsPanel />
}
