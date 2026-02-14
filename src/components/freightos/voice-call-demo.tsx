import { CallPlaybackControls } from './call-playback-controls'
import { CallSummary } from './call-summary'
import { SystemActionFeed } from './system-action-feed'
import { useAppStore } from '@/state/app-store'
import { callProgress, getFrameForSecond } from '@/ai/voice-simulator'

export function VoiceCallDemo() {
  const { state } = useAppStore()
  const call = state.entities.voiceCalls.find((item) => item.id === (state.voice.activeCallId ?? 'call-1'))
  const frame = getFrameForSecond(call, state.voice.playbackSecond)
  const progress = callProgress(call, state.voice.playbackSecond)

  return (
    <section className="space-y-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-3">
      <h3 className="text-sm font-semibold">Voice Call Demo</h3>
      <p className="text-xs text-slate-100">{frame?.speaker ?? 'system'}: {frame?.text ?? 'Awaiting playback'}</p>
      <div className="h-2 rounded bg-white/10">
        <div className="h-full rounded bg-cyan-300" style={{ width: `${progress}%` }} />
      </div>
      <CallPlaybackControls />
      <SystemActionFeed call={call} second={state.voice.playbackSecond} />
      <CallSummary call={call} />
    </section>
  )
}
