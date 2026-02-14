import { TimelineStep } from './timeline-step'
import type { Load } from '@/domain/types'

const STEPS = ['tendered', 'assigned', 'in_transit', 'delivered', 'invoiced'] as const

export function LoadLifecycle({ load }: { load: Load }) {
  const activeIndex = STEPS.indexOf(load.status === 'at_risk' ? 'in_transit' : load.status)

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h3 className="mb-3 text-sm font-semibold">Lifecycle</h3>
      <div className="space-y-2">
        {STEPS.map((step, idx) => (
          <TimelineStep key={step} title={step.replace('_', ' ')} time={idx <= activeIndex ? 'Complete' : 'Pending'} active={idx <= activeIndex} />
        ))}
      </div>
    </section>
  )
}
