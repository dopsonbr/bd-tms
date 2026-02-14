import { useAppStore } from '@/state/app-store'

export function TomorrowPlan() {
  const { state, dispatch } = useAppStore()

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h2 className="text-sm font-semibold">Tomorrow Plan Review</h2>
      <p className="mt-2 text-xs text-slate-300">Approve planning recommendations for morning dispatch.</p>
      <button
        type="button"
        onClick={() => dispatch({ type: 'approve-plan' })}
        className="mt-3 rounded-lg bg-emerald-400 px-3 py-2 text-xs font-semibold text-slate-950"
      >
        {state.ai.planningApproved ? 'Approved' : 'Approve Plan'}
      </button>
    </section>
  )
}
