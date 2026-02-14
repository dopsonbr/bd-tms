import type { VoiceCall } from '@/domain/types'
import { getFrameForSecond } from '@/ai/voice-simulator'

export function SystemActionFeed({ call, second }: { call?: VoiceCall; second: number }) {
  const frame = getFrameForSecond(call, second)

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h3 className="text-sm font-semibold">System Action Feed</h3>
      <p className="mt-2 text-xs text-slate-300">{frame?.systemAction ?? 'No automated action at this moment.'}</p>
    </section>
  )
}
