import { describe, expect, it } from 'vitest'

import { reduceAppState } from '@/state/actions'
import { createInitialState } from '@/state/app-store'

describe('demo smoke', () => {
  it('can load each scenario and reset deterministically', () => {
    let state = createInitialState()
    ;(['A', 'B', 'C', 'D', 'E'] as const).forEach((scenarioId) => {
      state = reduceAppState(state, { type: 'load-scenario', payload: scenarioId })
      expect(state.sim.scenarioId).toBe(scenarioId)
    })

    state = reduceAppState(state, { type: 'reset-demo' })
    expect(state.sim.scenarioId).toBe('A')
  })
})
