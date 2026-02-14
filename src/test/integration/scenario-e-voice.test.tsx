import { describe, expect, it } from 'vitest'

import { reduceAppState } from '@/state/actions'
import { createInitialState } from '@/state/app-store'

describe('scenario E voice flow', () => {
  it('activates voice call playback events', () => {
    let state = createInitialState()
    state = reduceAppState(state, { type: 'load-scenario', payload: 'E' })
    state = reduceAppState(state, { type: 'advance-time', payload: { minutes: 4 } })

    expect(state.voice.activeCallId).toBe('call-1')
  })
})
