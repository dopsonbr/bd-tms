import type { TranscriptFrame, VoiceCall } from '@/domain/types'

export function getFrameForSecond(call: VoiceCall | undefined, second: number): TranscriptFrame | undefined {
  if (!call) {
    return undefined
  }

  let current: TranscriptFrame | undefined
  for (const frame of call.frames) {
    if (frame.atSec <= second) {
      current = frame
    }
  }

  return current
}

export function callProgress(call: VoiceCall | undefined, second: number): number {
  if (!call || call.durationSec <= 0) {
    return 0
  }
  return Math.min(100, Math.round((second / call.durationSec) * 100))
}
