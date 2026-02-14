import { describe, expect, it } from 'vitest'

import { reduceAppState } from '@/state/actions'
import { createInitialState } from '@/state/app-store'

describe('scenario B broker flow', () => {
  it('starts with broker tags and updates status', () => {
    let state = createInitialState()
    state = reduceAppState(state, { type: 'load-scenario', payload: 'B' })
    const load = state.entities.loads.find((item) => item.id === 'load-31')
    expect(load?.tags).toContain('brokered')

    state = reduceAppState(state, { type: 'advance-time', payload: { minutes: 120 } })
    expect(state.sim.eventLog.length).toBeGreaterThan(0)
  })
})
