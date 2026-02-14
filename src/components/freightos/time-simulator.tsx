import { useAppStore } from '@/state/app-store'

export function TimeSimulator() {
  const { dispatch } = useAppStore()

  return (
    <div className="rounded-xl border border-white/10 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">Time Simulator</p>
      <div className="mt-2 flex gap-2">
        {[15, 60, 240].map((minutes) => (
          <button
            key={minutes}
            type="button"
            onClick={() => dispatch({ type: 'advance-time', payload: { minutes } })}
            className="rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-200"
          >
            +{minutes}m
          </button>
        ))}
      </div>
    </div>
  )
}
