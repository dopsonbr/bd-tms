import { CallHistory } from './call-history'
import { LiveCallCard } from './live-call-card'
import { VoicePerformance } from './voice-performance'
import { VoiceSettings } from './voice-settings'
import { useAppStore } from '@/state/app-store'

export function VoiceDashboard() {
  const { state } = useAppStore()
  const live = state.entities.voiceCalls.filter((call) => call.status === 'live')

  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h2 className="text-sm font-semibold">Voice Dashboard</h2>
      <div className="grid gap-2 md:grid-cols-2">
        {live.length === 0 ? (
          <div className="rounded-xl border border-white/10 p-3 text-xs text-slate-400">No live calls right now.</div>
        ) : (
          live.map((call) => <LiveCallCard key={call.id} call={call} />)
        )}
      </div>
      <CallHistory />
      <VoicePerformance />
      <VoiceSettings />
    </section>
  )
}
