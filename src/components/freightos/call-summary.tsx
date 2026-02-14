import type { VoiceCall } from '@/domain/types'

export function CallSummary({ call }: { call?: VoiceCall }) {
  if (!call) {
    return null
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h3 className="text-sm font-semibold">Post Call Summary</h3>
      <p className="mt-2 text-xs text-slate-300">Contact: {call.contact}</p>
      <p className="text-xs text-slate-300">Duration: {call.durationSec}s</p>
      <p className="text-xs text-slate-300">Frames: {call.frames.length}</p>
    </section>
  )
}
