import { useAppStore } from '@/state/app-store'

export function VoicePerformance() {
  const { state } = useAppStore()
  const completed = state.entities.voiceCalls.filter((call) => call.status === 'completed').length
  const avgDuration =
    state.entities.voiceCalls.reduce((sum, call) => sum + call.durationSec, 0) /
    Math.max(1, state.entities.voiceCalls.length)

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h3 className="text-sm font-semibold">Voice Performance</h3>
      <p className="mt-2 text-xs text-slate-300">Completed calls: {completed}</p>
      <p className="text-xs text-slate-300">Avg duration: {Math.round(avgDuration)} sec</p>
    </section>
  )
}
