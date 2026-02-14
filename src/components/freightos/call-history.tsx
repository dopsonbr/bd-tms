import { useAppStore } from '@/state/app-store'

export function CallHistory() {
  const { state } = useAppStore()

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h3 className="mb-2 text-sm font-semibold">Call History</h3>
      <div className="space-y-2">
        {state.entities.voiceCalls.map((call) => (
          <div key={call.id} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300">
            {call.contact} · {call.status} · {call.durationSec}s
          </div>
        ))}
      </div>
    </section>
  )
}
