import type { ScenarioId } from '@/domain/types'
import { useAppStore } from '@/state/app-store'

const SCENARIOS: Array<ScenarioId> = ['A', 'B', 'C', 'D', 'E']

export function ScenarioSelector() {
  const { state, dispatch } = useAppStore()

  return (
    <div className="rounded-xl border border-white/10 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">Scenario</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {SCENARIOS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => dispatch({ type: 'load-scenario', payload: id })}
            className={`rounded-lg px-2 py-1 text-xs ${
              state.sim.scenarioId === id ? 'bg-cyan-500/20 text-cyan-100' : 'bg-white/[0.04] text-slate-300'
            }`}
          >
            {id}
          </button>
        ))}
      </div>
    </div>
  )
}
