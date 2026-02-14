import { describe, expect, it } from 'vitest'

import { reduceAppState } from '@/state/actions'
import { createInitialState } from '@/state/app-store'

describe('scenario A dispatch flow', () => {
  it('progresses to assigned after time advancement', () => {
    let state = createInitialState()
    state = reduceAppState(state, { type: 'load-scenario', payload: 'A' })
    state = reduceAppState(state, { type: 'advance-time', payload: { minutes: 20 } })
    const load = state.entities.loads.find((item) => item.id === 'load-26')
    expect(load?.status).toBe('assigned')
  })
})
