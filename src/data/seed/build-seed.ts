import type {
  AppState,
  CityNode,
  Driver,
  EquipmentType,
  ExceptionEvent,
  Load,
  LoadStatus,
  ScenarioId,
  ScenarioMeta,
  SimEvent,
  Truck,
} from '@/domain/types'
import { defaultVoiceScriptId } from '@/ai/voice-simulator'

const BASE_TIME = '2026-02-14T13:00:00.000Z'

const network: Array<CityNode> = [
  { id: 'atl', city: 'Atlanta', state: 'GA', lat: 33.749, lng: -84.388 },
  { id: 'mem', city: 'Memphis', state: 'TN', lat: 35.1495, lng: -90.049 },
  { id: 'nsh', city: 'Nashville', state: 'TN', lat: 36.1627, lng: -86.7816 },
  { id: 'clt', city: 'Charlotte', state: 'NC', lat: 35.2271, lng: -80.8431 },
  { id: 'jax', city: 'Jacksonville', state: 'FL', lat: 30.3322, lng: -81.6557 },
  { id: 'bhm', city: 'Birmingham', state: 'AL', lat: 33.5186, lng: -86.8104 },
  { id: 'sav', city: 'Savannah', state: 'GA', lat: 32.0809, lng: -81.0912 },
]

const shippers = [
  'Southeast Distributors',
  'Peachtree Foods',
  'Magnolia Manufacturing',
  'Blue Ridge Retail',
  'Sunbelt Packaging',
  'TriStar Cold Chain',
  'Riverbend Wholesale',
  'Carolina Home Goods',
  'Delta Parts Supply',
  'Gulf Coast Imports',
  'Cumberland Beverage',
  'Appalachian Metals',
  'Palmetto Textiles',
  'Interstate Medical',
  'Volunteer Logistics Co-op',
]

const scenarioMeta: Array<ScenarioMeta> = [
  {
    id: 'baseline',
    label: 'Baseline Operations',
    description: 'Steady state operations with balanced capacity and known exceptions.',
  },
  {
    id: 'scenario-a',
    label: 'Scenario A: New Load Dispatch',
    description: 'A high-priority pending load needs assignment and driver notification.',
  },
  {
    id: 'scenario-b',
    label: 'Scenario B: Brokered Lifecycle',
    description: 'Brokered load flow from tender to in-transit with margin tracking.',
  },
  {
    id: 'scenario-c',
    label: 'Scenario C: Exception Recovery',
    description: 'Mechanical breakdown requires customer communication and recovery plan.',
  },
  {
    id: 'scenario-d',
    label: 'Scenario D: AI Planning Session',
    description: 'Tomorrow planning with repositioning and spot-load recommendations.',
  },
  {
    id: 'scenario-e',
    label: 'Scenario E: Voice Agent Demo',
    description: 'Inbound shipper status call with deterministic transcript playback.',
  },
]

function equipmentForTruck(index: number): EquipmentType {
  if (index < 30) {
    return 'dry_van'
  }

  if (index < 40) {
    return 'reefer'
  }

  return 'flatbed'
}

function buildTrucks(): Array<Truck> {
  return Array.from({ length: 45 }, (_, index) => {
    const location = network[index % network.length]

    return {
      id: `truck-${index + 1}`,
      unit: `T-${201 + index}`,
      equipment: equipmentForTruck(index),
      status: index % 11 === 0 ? 'maintenance' : index % 7 === 0 ? 'rest' : 'available',
      city: location.city,
      state: location.state,
      lat: location.lat + (index % 3) * 0.11,
      lng: location.lng - (index % 4) * 0.09,
      etaMinutes: 20 + (index % 9) * 17,
    }
  })
}

function buildDrivers(): Array<Driver> {
  return Array.from({ length: 30 }, (_, index) => {
    const home = network[index % network.length]
    const hosRemaining = 9 - (index % 8)

    return {
      id: `driver-${index + 1}`,
      name: `Driver ${index + 1}`,
      status: hosRemaining < 3 ? 'rest' : 'available',
      homeCity: home.city,
      homeState: home.state,
      hosRemainingHours: hosRemaining,
      performanceScore: 72 + (index % 27),
    }
  })
}

function statusForLoad(index: number): LoadStatus {
  if (index < 20) {
    return 'in_transit'
  }

  if (index < 35) {
    return 'at_pickup'
  }

  if (index < 45) {
    return 'at_delivery'
  }

  if (index < 57) {
    return 'pending_dispatch'
  }

  if (index < 65) {
    return 'delivered'
  }

  return 'tendered'
}

function buildLoads(nowIso: string): Array<Load> {
  return Array.from({ length: 80 }, (_, index) => {
    const origin = network[index % network.length]
    const destination = network[(index + 2) % network.length]
    const status = statusForLoad(index)
    const revenue = 2100 + (index % 11) * 180
    const carrierCost = 1400 + (index % 9) * 140
    const accessorials = (index % 4) * 75
    const margin = revenue - carrierCost + accessorials

    return {
      id: `load-${index + 1}`,
      reference: `L-${4500 + index}`,
      shipper: shippers[index % shippers.length],
      equipment: (['dry_van', 'reefer', 'flatbed'] as const)[index % 3],
      status,
      brokered: index >= 55,
      origin: {
        sequence: 1,
        city: origin.city,
        state: origin.state,
        windowStartIso: nowIso,
        windowEndIso: new Date(Date.parse(nowIso) + 2 * 60 * 60 * 1000).toISOString(),
      },
      destination: {
        sequence: 2,
        city: destination.city,
        state: destination.state,
        windowStartIso: new Date(Date.parse(nowIso) + 6 * 60 * 60 * 1000).toISOString(),
        windowEndIso: new Date(Date.parse(nowIso) + 9 * 60 * 60 * 1000).toISOString(),
      },
      financials: {
        revenue,
        carrierCost,
        accessorials,
        margin,
        marginPercent: Number(((margin / revenue) * 100).toFixed(1)),
      },
    }
  })
}

function applyAssignments(trucks: Array<Truck>, drivers: Array<Driver>, loads: Array<Load>): void {
  const assignable = loads.filter((load) =>
    ['in_transit', 'at_pickup', 'at_delivery', 'dispatched'].includes(load.status)
  )

  const maxAssignments = Math.min(24, assignable.length, trucks.length, drivers.length)

  for (let index = 0; index < maxAssignments; index += 1) {
    const load = assignable[index]
    const matchedTruck = trucks.find((item) => !item.loadId && item.equipment === load.equipment)
    const assignedTruck = matchedTruck ?? trucks.find((item) => !item.loadId)

    if (!assignedTruck) {
      continue
    }

    const assignedDriver = drivers.find(
      (item) =>
        !item.truckId &&
        (assignedTruck.driverId ? item.id === assignedTruck.driverId : true)
    ) ?? drivers.find((item) => !item.truckId)

    if (!assignedDriver) {
      continue
    }

    load.assignedTruckId = assignedTruck.id
    load.assignedDriverId = assignedDriver.id

    assignedTruck.driverId = assignedDriver.id
    assignedTruck.loadId = load.id
    assignedTruck.status = load.status === 'at_pickup' ? 'loading' : 'en_route'

    assignedDriver.truckId = assignedTruck.id
    assignedDriver.status = load.status === 'at_delivery' ? 'available' : 'driving'
  }
}

function buildExceptions(nowIso: string, loads: Array<Load>): Array<ExceptionEvent> {
  return [
    {
      id: 'exception-1',
      loadId: loads[3].id,
      severity: 'critical',
      title: 'Late pickup risk',
      description: 'Traffic delay may miss pickup window by 42 minutes.',
      createdAtIso: nowIso,
      resolved: false,
      recommendedAction: 'Notify customer and propose adjusted pickup window',
    },
    {
      id: 'exception-2',
      loadId: loads[7].id,
      severity: 'warning',
      title: 'HOS threshold approaching',
      description: 'Assigned driver projected under 1.2 hours remaining by delivery.',
      createdAtIso: nowIso,
      resolved: false,
      recommendedAction: 'Evaluate relay option at Birmingham',
    },
    {
      id: 'exception-3',
      loadId: loads[14].id,
      severity: 'info',
      title: 'Detention timer started',
      description: 'Truck checked in and waiting at receiver for 31 minutes.',
      createdAtIso: nowIso,
      resolved: false,
      recommendedAction: 'Track detention threshold and pre-tag documentation',
    },
  ]
}

function buildEventQueue(nowIso: string): Array<SimEvent> {
  const base = Date.parse(nowIso)

  return [
    {
      id: 'event-1',
      title: 'Traffic impact detected',
      detail: 'ETA slip projected on two northbound loads.',
      kind: 'eta-slip',
      atIso: new Date(base + 2 * 60 * 60 * 1000).toISOString(),
      applied: false,
    },
    {
      id: 'event-2',
      title: 'New tender wave',
      detail: 'Two shippers submitted short-haul tenders.',
      kind: 'new-tender',
      atIso: new Date(base + 4 * 60 * 60 * 1000).toISOString(),
      applied: false,
    },
    {
      id: 'event-3',
      title: 'HOS warning',
      detail: 'Driver near legal drive-time limit.',
      kind: 'hos-warning',
      atIso: new Date(base + 6 * 60 * 60 * 1000).toISOString(),
      applied: false,
    },
    {
      id: 'event-4',
      title: 'Weather alert',
      detail: 'Storm cell impacts central Alabama lanes.',
      kind: 'weather',
      atIso: new Date(base + 8 * 60 * 60 * 1000).toISOString(),
      applied: false,
    },
  ]
}

export function buildSeedState(nowIso: string = BASE_TIME): AppState {
  const trucks = buildTrucks()
  const drivers = buildDrivers()
  const loads = buildLoads(nowIso)

  applyAssignments(trucks, drivers, loads)

  return {
    nowIso,
    scenarioId: 'baseline',
    trucks,
    drivers,
    loads,
    exceptions: buildExceptions(nowIso, loads),
    notifications: [
      {
        id: 'note-1',
        title: '2 high-priority exceptions need action',
        level: 'critical',
        createdAtIso: nowIso,
        read: false,
      },
      {
        id: 'note-2',
        title: 'Demand forecast updated for tomorrow',
        level: 'info',
        createdAtIso: nowIso,
        read: false,
      },
    ],
    chatMessages: [
      {
        id: 'chat-1',
        role: 'assistant',
        content:
          'FreightOS AI is online. Ask for dispatch, exception triage, tomorrow planning, or voice demo prep.',
        createdAtIso: nowIso,
        confidence: 95,
      },
    ],
    eventQueue: buildEventQueue(nowIso),
    activeVoiceScriptId: defaultVoiceScriptId,
  }

}

export function getScenarioMeta(): Array<ScenarioMeta> {
  return scenarioMeta
}

export function createScenarioState(id: ScenarioId): AppState {
  const state = buildSeedState()
  state.scenarioId = id

  if (id === 'scenario-a') {
    const candidate = state.loads.find((load) => load.status === 'pending_dispatch')

    if (candidate) {
      candidate.aiRecommendation =
        'Recommended truck is 24 miles from pickup and can meet window with 2.1 hours buffer.'
    }
  }

  if (id === 'scenario-b') {
    const brokered = state.loads.find((load) => load.brokered && load.status === 'pending_dispatch')

    if (brokered) {
      brokered.status = 'at_pickup'
      brokered.aiRecommendation = 'Partner carrier ranked first on margin + on-time score blend.'

      const brokerTruck = state.trucks.find(
        (truck) =>
          truck.status === 'available' &&
          truck.equipment === brokered.equipment
      )
      const fallbackTruck = brokerTruck ?? state.trucks.find((truck) => truck.status === 'available')

      if (fallbackTruck) {
        const brokerDriver = state.drivers[0]

        if (brokerDriver.truckId) {
          const previousTruck = state.trucks.find((truck) => truck.id === brokerDriver.truckId)

          if (previousTruck) {
            previousTruck.driverId = undefined
            previousTruck.status = 'available'
          }

          const previousLoad = state.loads.find((load) => load.assignedDriverId === brokerDriver.id)

          if (previousLoad) {
            previousLoad.assignedDriverId = undefined
          }

          brokerDriver.truckId = undefined
        }

        brokered.assignedTruckId = fallbackTruck.id
        brokered.assignedDriverId = brokerDriver.id

        fallbackTruck.status = 'loading'
        fallbackTruck.loadId = brokered.id
        fallbackTruck.driverId = brokerDriver.id
        brokerDriver.status = 'driving'
        brokerDriver.truckId = fallbackTruck.id

      }
    }
  }

  if (id === 'scenario-c') {
    const targetLoad = state.loads.find((load) => load.status === 'in_transit')
    const targetTruck = targetLoad ? state.trucks.find((truck) => truck.loadId === targetLoad.id) : undefined

    if (targetLoad) {
      state.exceptions.unshift({
        id: 'exception-scenario-c',
        loadId: targetLoad.id,
        severity: 'critical',
        title: 'Breakdown reported',
        description: 'Driver reported tire blowout and shoulder stop on I-40.',
        createdAtIso: state.nowIso,
        resolved: false,
        recommendedAction: 'Dispatch roadside + notify customer with revised ETA',
      })

      if (targetTruck) {
        targetTruck.status = 'maintenance'
      }
    }
  }

  if (id === 'scenario-d') {
    state.chatMessages.push({
      id: 'chat-scenario-d',
      role: 'assistant',
      content:
        'Tomorrow planning summary: 5 empty trucks, 3 strong spot opportunities, and 2 reposition moves recommended.',
      createdAtIso: state.nowIso,
      confidence: 90,
      reasoning: [
        'Morning lane imbalance in Tennessee network',
        'High margin spot demand in ATL outbound lanes',
        'Two trucks positioned for low-deadhead coverage',
      ],
      quickActions: ['Review repositioning', 'Accept spot recommendations'],
    })
  }

  if (id === 'scenario-e') {
    state.activeVoiceScriptId = 'shipper-status'
    state.notifications.unshift({
      id: 'note-scenario-e',
      title: 'Voice demo ready: inbound shipper status call queued',
      level: 'info',
      createdAtIso: state.nowIso,
      read: false,
    })
  }

  return state
}
