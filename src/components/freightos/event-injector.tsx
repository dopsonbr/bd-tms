import { useAppStore } from '@/state/app-store'

const EVENTS = ['weather', 'breakdown', 'tender', 'call'] as const

export function EventInjector() {
  const { dispatch } = useAppStore()

  return (
    <div className="rounded-xl border border-white/10 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">Event Injector</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {EVENTS.map((eventName) => (
          <button
            key={eventName}
            type="button"
            onClick={() => dispatch({ type: 'inject-event', payload: eventName })}
            className="rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-200"
          >
            {eventName}
          </button>
        ))}
      </div>
    </div>
  )
}
