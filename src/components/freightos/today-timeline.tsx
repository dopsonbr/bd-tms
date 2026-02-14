import { TimelineStep } from './timeline-step'
import { useAppStore } from '@/state/app-store'
import { selectTimelineEvents } from '@/state/selectors/ops-selectors'

export function TodayTimeline() {
  const { state } = useAppStore()
  const events = selectTimelineEvents(state)

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h2 className="mb-3 text-sm font-semibold">Today Timeline</h2>
      <div className="space-y-3">
        {events.length === 0 ? (
          <p className="text-xs text-slate-400">No timeline events yet. Advance time to process queue.</p>
        ) : (
          events.map((event, idx) => (
            <TimelineStep key={event} title={event} time={`T-${idx + 1}`} active={idx === 0} />
          ))
        )}
      </div>
    </section>
  )
}
