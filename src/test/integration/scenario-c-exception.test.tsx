import { describe, expect, it } from 'vitest'

import { reduceAppState } from '@/state/actions'
import { createInitialState } from '@/state/app-store'

describe('scenario C exception flow', () => {
  it('opens then resolves injected exception events', () => {
    let state = createInitialState()
    state = reduceAppState(state, { type: 'load-scenario', payload: 'C' })
    state = reduceAppState(state, { type: 'advance-time', payload: { minutes: 180 } })

    const resolved = state.entities.exceptions.some((item) => item.status === 'resolved')
    expect(resolved).toBe(true)
  })
})
