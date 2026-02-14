import { EventInjector } from './event-injector'
import { GuidedTour } from './guided-tour'
import { ScenarioSelector } from './scenario-selector'
import { TimeSimulator } from './time-simulator'
import { useAppStore } from '@/state/app-store'

export function DemoControlsPanel() {
  const { state, dispatch } = useAppStore()

  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Demo Controls</h2>
        <button
          type="button"
          onClick={() => dispatch({ type: 'reset-demo' })}
          className="rounded-lg border border-white/10 px-2 py-1 text-xs"
        >
          Reset
        </button>
      </div>
      <p className="text-xs text-slate-400">Current scenario: {state.sim.scenarioId}</p>
      <ScenarioSelector />
      <TimeSimulator />
      <EventInjector />
      <GuidedTour />
    </section>
  )
}
