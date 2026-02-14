import type { ScenarioDefinition, ScenarioId, SeedSnapshot, SimEvent } from '@/domain/types'
import { BASE_NOW_ISO, SCENARIO_NAMES } from '@/domain/constants'

function cloneSeed(seed: SeedSnapshot): SeedSnapshot {
  return {
    trucks: seed.trucks.map((item) => ({ ...item })),
    drivers: seed.drivers.map((item) => ({ ...item })),
    loads: seed.loads.map((item) => ({ ...item, stops: item.stops.map((stop) => ({ ...stop })) })),
    shippers: seed.shippers.map((item) => ({ ...item })),
    carriers: seed.carriers.map((item) => ({ ...item })),
    exceptions: seed.exceptions.map((item) => ({ ...item })),
    voiceCalls: seed.voiceCalls.map((item) => ({ ...item, frames: item.frames.map((frame) => ({ ...frame })) })),
    notifications: seed.notifications.map((item) => ({ ...item })),
  }
}

function minutesFrom(baseIso: string, minutes: number): string {
  return new Date(new Date(baseIso).getTime() + minutes * 60_000).toISOString()
}

export function getScenarioDefinitions(baseIso: string = BASE_NOW_ISO): Array<ScenarioDefinition> {
  const queue = (id: string, minute: number, type: SimEvent['type'], payload: Record<string, string>): SimEvent => ({
    id,
    atIso: minutesFrom(baseIso, minute),
    type,
    payload,
  })

  return [
    {
      id: 'A',
      name: SCENARIO_NAMES.A,
      description: 'Tender to assigned to delivered flow with deterministic dispatch recommendation.',
      queue: [
        queue('ev-a-1', 15, 'load_status', { loadId: 'load-26', status: 'assigned' }),
        queue('ev-a-2', 90, 'load_status', { loadId: 'load-26', status: 'in_transit' }),
        queue('ev-a-3', 230, 'load_status', { loadId: 'load-26', status: 'delivered' }),
        queue('ev-a-4', 310, 'load_status', { loadId: 'load-26', status: 'invoiced' }),
      ],
    },
    {
      id: 'B',
      name: SCENARIO_NAMES.B,
      description: 'Brokered load flow with carrier match and margin shift.',
      queue: [
        queue('ev-b-1', 20, 'load_status', { loadId: 'load-31', status: 'assigned' }),
        queue('ev-b-2', 100, 'load_status', { loadId: 'load-31', status: 'in_transit' }),
        queue('ev-b-3', 200, 'load_status', { loadId: 'load-31', status: 'delivered' }),
      ],
    },
    {
      id: 'C',
      name: SCENARIO_NAMES.C,
      description: 'Exception opens and resolves with tracked risk timeline.',
      queue: [
        queue('ev-c-1', 5, 'exception_open', { loadId: 'load-8', severity: 'high' }),
        queue('ev-c-2', 60, 'load_status', { loadId: 'load-8', status: 'at_risk' }),
        queue('ev-c-3', 160, 'exception_resolve', { loadId: 'load-8' }),
      ],
    },
    {
      id: 'D',
      name: SCENARIO_NAMES.D,
      description: 'Planning session scenario with recommendation-first AI workflow.',
      queue: [
        queue('ev-d-1', 30, 'load_status', { loadId: 'load-42', status: 'assigned' }),
        queue('ev-d-2', 120, 'load_status', { loadId: 'load-42', status: 'in_transit' }),
      ],
    },
    {
      id: 'E',
      name: SCENARIO_NAMES.E,
      description: 'Inbound voice call sequence and coordinated system action feed.',
      queue: [
        queue('ev-e-1', 2, 'voice_call_start', { callId: 'call-1' }),
        queue('ev-e-2', 8, 'voice_call_complete', { callId: 'call-1' }),
      ],
    },
  ]
}

export function applyScenario(seed: SeedSnapshot, scenarioId: ScenarioId): SeedSnapshot {
  const next = cloneSeed(seed)

  if (scenarioId === 'A') {
    const target = next.loads.find((load) => load.id === 'load-26')
    if (target) {
      target.status = 'tendered'
      target.truckId = undefined
      target.driverId = undefined
    }
  }

  if (scenarioId === 'B') {
    const target = next.loads.find((load) => load.id === 'load-31')
    if (target) {
      target.status = 'tendered'
      target.revenueUsd += 220
      target.marginUsd += 220
      target.tags = ['brokered', 'high_margin']
    }
  }

  if (scenarioId === 'C') {
    const target = next.loads.find((load) => load.id === 'load-8')
    if (target) {
      target.status = 'in_transit'
    }
  }

  if (scenarioId === 'D') {
    next.notifications.unshift({
      id: 'note-d-1',
      title: 'Planning window opened',
      body: 'AI planning session is ready for tomorrow allocation review.',
      createdIso: BASE_NOW_ISO,
      read: false,
      severity: 'medium',
    })
  }

  if (scenarioId === 'E') {
    const call = next.voiceCalls.find((item) => item.id === 'call-1')
    if (call) {
      call.status = 'live'
    }
  }

  return next
}
