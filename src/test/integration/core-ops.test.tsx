import { describe, expect, it } from 'vitest'

import { reduceAppState } from '@/state/actions'
import { createInitialState } from '@/state/app-store'

describe('core ops integration', () => {
  it('advancing time applies due events', () => {
    let state = createInitialState()
    state = reduceAppState(state, { type: 'load-scenario', payload: 'A' })
    const next = reduceAppState(state, { type: 'advance-time', payload: { minutes: 20 } })
    expect(next.sim.eventLog.length).toBeGreaterThanOrEqual(1)
  })
})
