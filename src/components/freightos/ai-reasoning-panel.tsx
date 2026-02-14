import { ConfidenceBadge } from './confidence-badge'
import { buildReasoningSummary } from '@/ai/reasoning'
import { useAppStore } from '@/state/app-store'

export function AiReasoningPanel() {
  const { state } = useAppStore()
  const reasoning = buildReasoningSummary(state.ai.recommendation, state.entities)

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Reasoning</h2>
        {state.ai.recommendation ? <ConfidenceBadge score={state.ai.recommendation.confidence} /> : null}
      </div>
      <p className="text-xs text-slate-300">{reasoning}</p>
    </section>
  )
}
