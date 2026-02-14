import { describe, expect, it } from 'vitest'

import { reduceAppState } from '@/state/actions'
import { createInitialState } from '@/state/app-store'

describe('scenario D planning flow', () => {
  it('supports plan approval action', () => {
    let state = createInitialState()
    state = reduceAppState(state, { type: 'load-scenario', payload: 'D' })
    state = reduceAppState(state, { type: 'approve-plan' })
    expect(state.ai.planningApproved).toBe(true)
  })
})
