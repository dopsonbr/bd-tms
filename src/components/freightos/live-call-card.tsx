import type { VoiceCall } from '@/domain/types'

export function LiveCallCard({ call }: { call: VoiceCall }) {
  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-sm font-semibold">{call.contact}</p>
      <p className="mt-1 text-xs text-slate-400">{call.direction} · {call.status}</p>
      <p className="mt-2 text-xs text-slate-300">{call.frames[0]?.text ?? 'No transcript yet'}</p>
    </article>
  )
}
