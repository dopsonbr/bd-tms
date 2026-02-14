import { useAppStore } from '@/state/app-store'

export function CallPlaybackControls() {
  const { state, dispatch } = useAppStore()

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 p-2">
      <button
        type="button"
        className="rounded-lg border border-white/10 px-2 py-1 text-xs"
        onClick={() => dispatch({ type: state.voice.playing ? 'voice-pause' : 'voice-play' })}
      >
        {state.voice.playing ? 'Pause' : 'Play'}
      </button>
      <button
        type="button"
        className="rounded-lg border border-white/10 px-2 py-1 text-xs"
        onClick={() => dispatch({ type: 'voice-seek', payload: Math.max(0, state.voice.playbackSecond - 10) })}
      >
        -10s
      </button>
      <button
        type="button"
        className="rounded-lg border border-white/10 px-2 py-1 text-xs"
        onClick={() => dispatch({ type: 'voice-seek', payload: state.voice.playbackSecond + 10 })}
      >
        +10s
      </button>
      <button
        type="button"
        className="rounded-lg border border-white/10 px-2 py-1 text-xs"
        onClick={() => dispatch({ type: 'voice-speed', payload: state.voice.speed === 1 ? 2 : 1 })}
      >
        {state.voice.speed}x
      </button>
    </div>
  )
}
