import { useAppStore } from '@/state/app-store'

const STEPS = [
  'Dashboard KPI pulse',
  'Loads + dispatch board',
  'Fleet map and truck detail',
  'AI planning workflow',
  'Voice call playback demo',
]

export function GuidedTour() {
  const { state, dispatch } = useAppStore()
  const step = state.ui.guidedTourStep

  return (
    <div className="rounded-xl border border-white/10 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">Guided Tour</p>
      <p className="mt-2 text-sm text-slate-100">{STEPS[step] ?? 'Tour complete'}</p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'set-guided-tour-step', payload: Math.max(0, step - 1) })}
          className="rounded-lg border border-white/10 px-2 py-1 text-xs"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'set-guided-tour-step', payload: Math.min(STEPS.length, step + 1) })}
          className="rounded-lg border border-white/10 px-2 py-1 text-xs"
        >
          Next
        </button>
      </div>
    </div>
  )
}
