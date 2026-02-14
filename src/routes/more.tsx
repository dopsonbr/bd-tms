import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

import { BrokerLoadBoard } from '@/components/freightos/broker-load-board'
import { CarrierMatchSheet } from '@/components/freightos/carrier-match-sheet'
import { ChartCard } from '@/components/freightos/chart-card'
import { RateControls } from '@/components/freightos/rate-controls'

export const Route = createFileRoute('/more')({ component: MoreRoute })

function MoreRoute() {
  return (
    <div className="space-y-3">
      <BrokerLoadBoard />
      <CarrierMatchSheet />
      <RateControls />
      <section className="grid grid-cols-2 gap-3">
        <ChartCard title="Revenue Trend" bars={[32, 45, 39, 52, 50, 58]} />
        <ChartCard title="Load Volume" bars={[20, 22, 18, 24, 28, 30]} />
      </section>
      <Link to="/more/demo-controls" className="inline-flex rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-200">
        Open Demo Controls
      </Link>
      <Outlet />
    </div>
  )
}
