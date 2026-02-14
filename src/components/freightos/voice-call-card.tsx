import type { VoiceCall } from '@/domain/types'

export function VoiceCallCard({ call }: { call: VoiceCall }) {
  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-200">
      {call.contact} · {call.direction} · {call.status}
    </article>
  )
}
