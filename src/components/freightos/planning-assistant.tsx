import { computeDemandForecast } from '@/ai/forecast'
import { buildRepositionSuggestions } from '@/ai/repositioning'
import { useAppStore } from '@/state/app-store'

export function PlanningAssistant() {
  const { state } = useAppStore()
  const forecast = computeDemandForecast(state.entities)
  const suggestions = buildRepositionSuggestions(state.entities)

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h2 className="text-sm font-semibold">Planning Assistant</h2>
      <p className="mt-2 text-xs text-slate-300">
        Tomorrow: {forecast.tomorrowLoads} tendered loads · Capacity gap {forecast.capacityGap}
      </p>
      <ul className="mt-3 space-y-2 text-xs text-slate-200">
        {suggestions.map((suggestion) => (
          <li key={suggestion.truckId} className="rounded-lg border border-white/10 px-3 py-2">
            {suggestion.truckId} {'->'} {suggestion.lane}
          </li>
        ))}
      </ul>
    </section>
  )
}
