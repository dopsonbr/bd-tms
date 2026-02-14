import { describe, expect, it } from 'vitest'

import { getScenarioDefinitions } from '@/data/seed/scenarios'
import { BASE_NOW_ISO } from '@/domain/constants'
import { reduceAppState } from '@/state/actions'
import { createInitialState } from '@/state/app-store'

describe('store reducer', () => {
  it('assigns load through explicit action', () => {
    const base = createInitialState()
    const next = reduceAppState(base, {
      type: 'assign-load',
      payload: {
        loadId: 'load-26',
        truckId: 'truck-30',
        driverId: 'driver-30',
      },
    })

    const load = next.entities.loads.find((item) => item.id === 'load-26')
    expect(load?.truckId).toBe('truck-30')
    expect(load?.status).toBe('assigned')
  })

  it('loads scenario and resets queue', () => {
    const base = createInitialState()
    const next = reduceAppState(base, { type: 'load-scenario', payload: 'C' })
    expect(next.sim.scenarioId).toBe('C')
    expect(next.sim.queue.length).toBeGreaterThan(0)
  })

  it('resets scenario timing to baseline after time advances', () => {
    const base = createInitialState()
    const advanced = reduceAppState(base, { type: 'advance-time', payload: { minutes: 120 } })
    const next = reduceAppState(advanced, { type: 'load-scenario', payload: 'B' })

    const expectedFirst = getScenarioDefinitions(BASE_NOW_ISO).find((item) => item.id === 'B')?.queue[0]?.atIso
    expect(next.sim.nowIso).toBe(BASE_NOW_ISO)
    expect(next.sim.queue[0]?.atIso).toBe(expectedFirst)
  })

  it('does not mutate previous state slices when assigning load', () => {
    const base = createInitialState()
    const next = reduceAppState(base, {
      type: 'assign-load',
      payload: {
        loadId: 'load-26',
        truckId: 'truck-30',
        driverId: 'driver-30',
      },
    })

    expect(base.ai.recommendation).toBeUndefined()
    expect(base.ai).not.toBe(next.ai)
  })

  it('does not mutate previous voice slice when due events run', () => {
    const base = reduceAppState(createInitialState(), { type: 'load-scenario', payload: 'E' })
    const next = reduceAppState(base, { type: 'advance-time', payload: { minutes: 3 } })

    expect(base.voice.activeCallId).toBeUndefined()
    expect(base.voice.playing).toBe(false)
    expect(base.voice).not.toBe(next.voice)
    expect(next.voice.activeCallId).toBe('call-1')
  })
})
