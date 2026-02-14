import type { AppAction, AppState, LoadStatus, SeedSnapshot, SimEvent } from '@/domain/types'
import { BASE_NOW_ISO } from '@/domain/constants'
import { simulateAssistantReply } from '@/ai/chat-simulator'
import { scoreBestAssignment } from '@/ai/recommendation-scorer'
import { applyScenario, getScenarioDefinitions } from '@/data/seed/scenarios'
import { validateLoadTransition } from '@/domain/guards'
import { buildInjectedEvent } from '@/sim/injectors'
import { dispatchDueEvents } from '@/sim/event-dispatcher'
import { sortQueue } from '@/sim/events'
import { nextSimTime } from '@/sim/time-advance'

export function cloneSeed(seed: SeedSnapshot): SeedSnapshot {
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

function withScenarioQueue(state: AppState, scenarioId: AppState['sim']['scenarioId']): AppState {
  const scenario = getScenarioDefinitions(BASE_NOW_ISO).find((item) => item.id === scenarioId)
  const nextEntities = applyScenario(state.baseline, scenarioId)

  return {
    ...state,
    entities: nextEntities,
    sim: {
      ...state.sim,
      nowIso: BASE_NOW_ISO,
      scenarioId,
      queue: scenario ? sortQueue(scenario.queue) : [],
      eventLog: [],
    },
    ui: {
      ...state.ui,
      selectedLoadId: undefined,
      selectedTruckId: undefined,
      guidedTourStep: 0,
    },
    voice: {
      ...state.voice,
      activeCallId: undefined,
      playbackSecond: 0,
      playing: false,
    },
  }
}

function assignLoad(
  state: AppState,
  payload: { loadId: string; truckId: string; driverId: string },
): AppState {
  const next: AppState = {
    ...state,
    entities: cloneSeed(state.entities),
    ai: {
      ...state.ai,
    },
  }

  const load = next.entities.loads.find((item) => item.id === payload.loadId)
  const truck = next.entities.trucks.find((item) => item.id === payload.truckId)
  const driver = next.entities.drivers.find((item) => item.id === payload.driverId)

  if (!load || !truck || !driver) {
    return state
  }

  load.truckId = truck.id
  load.driverId = driver.id
  load.status = load.status === 'tendered' ? 'assigned' : load.status

  truck.currentLoadId = load.id
  truck.status = 'assigned'
  truck.driverId = driver.id

  driver.truckId = truck.id
  driver.status = 'driving'

  next.ai.recommendation = scoreBestAssignment(next.entities, load.id)
  return next
}

function resolveTopException(state: AppState, exceptionId?: string): AppState {
  const next: AppState = {
    ...state,
    entities: cloneSeed(state.entities),
  }

  const target =
    (exceptionId && next.entities.exceptions.find((item) => item.id === exceptionId)) ||
    next.entities.exceptions.find((item) => item.status === 'open')

  if (!target) {
    return state
  }

  target.status = 'resolved'
  target.resolvedIso = next.sim.nowIso

  const load = next.entities.loads.find((item) => item.id === target.loadId)
  if (load && load.status === 'at_risk') {
    load.status = 'in_transit'
  }

  return next
}

function applyRate(state: AppState, payload: { loadId: string; revenueUsd: number }): AppState {
  const next: AppState = {
    ...state,
    entities: cloneSeed(state.entities),
  }

  const load = next.entities.loads.find((item) => item.id === payload.loadId)
  if (!load) {
    return state
  }

  load.revenueUsd = payload.revenueUsd
  load.marginUsd = load.revenueUsd - load.costUsd
  return next
}

function applyLoadStatus(state: AppState, payload: { loadId: string; status: LoadStatus }): AppState {
  const next: AppState = {
    ...state,
    entities: cloneSeed(state.entities),
  }
  const load = next.entities.loads.find((item) => item.id === payload.loadId)
  if (!load) {
    return state
  }

  if (!validateLoadTransition(load, payload.status)) {
    return state
  }

  load.status = payload.status
  return next
}

function handleChatAction(state: AppState, action: Extract<AppAction, { type: 'chat-run-action' }>['payload']): AppState {
  if (action === 'assign_best_truck') {
    const tendered = state.entities.loads.find((load) => load.status === 'tendered')
    if (!tendered) {
      return state
    }
    const recommendation = scoreBestAssignment(state.entities, tendered.id)
    if (!recommendation) {
      return state
    }
    return assignLoad(state, {
      loadId: recommendation.loadId,
      truckId: recommendation.truckId,
      driverId: recommendation.driverId,
    })
  }

  if (action === 'resolve_top_exception') {
    return resolveTopException(state)
  }

  return withScenarioQueue(state, 'D')
}

function advanceTime(state: AppState, minutes: number): AppState {
  let next: AppState = {
    ...state,
    sim: {
      ...state.sim,
      nowIso: nextSimTime(state.sim.nowIso, minutes),
    },
  }

  if (next.voice.playing && next.voice.activeCallId) {
    const call = next.entities.voiceCalls.find((item) => item.id === next.voice.activeCallId)
    const increment = minutes * 60 * next.voice.speed
    const max = call?.durationSec ?? 0
    next = {
      ...next,
      voice: {
        ...next.voice,
        playbackSecond: Math.min(max, next.voice.playbackSecond + increment),
      },
    }
  }

  return dispatchDueEvents(next)
}

function appendQueue(queue: Array<SimEvent>, event: SimEvent): Array<SimEvent> {
  return sortQueue([...queue, event])
}

export function reduceAppState(state: AppState, action: AppAction): AppState {
  if (action.type === 'set-load-segment') {
    return { ...state, ui: { ...state.ui, loadSegment: action.payload } }
  }

  if (action.type === 'select-load') {
    return { ...state, ui: { ...state.ui, selectedLoadId: action.payload } }
  }

  if (action.type === 'select-truck') {
    return { ...state, ui: { ...state.ui, selectedTruckId: action.payload } }
  }

  if (action.type === 'toggle-search') {
    return { ...state, ui: { ...state.ui, searchOpen: !state.ui.searchOpen } }
  }

  if (action.type === 'toggle-notifications') {
    return { ...state, ui: { ...state.ui, notificationsOpen: !state.ui.notificationsOpen } }
  }

  if (action.type === 'mark-notification-read') {
    return {
      ...state,
      entities: {
        ...state.entities,
        notifications: state.entities.notifications.map((item) =>
          item.id === action.payload ? { ...item, read: true } : item,
        ),
      },
    }
  }

  if (action.type === 'assign-load') {
    return assignLoad(state, action.payload)
  }

  if (action.type === 'set-load-status') {
    return applyLoadStatus(state, action.payload)
  }

  if (action.type === 'resolve-exception') {
    return resolveTopException(state, action.payload)
  }

  if (action.type === 'advance-time') {
    return advanceTime(state, action.payload.minutes)
  }

  if (action.type === 'load-scenario') {
    return withScenarioQueue(state, action.payload)
  }

  if (action.type === 'reset-demo') {
    return withScenarioQueue(
      {
        ...state,
        entities: cloneSeed(state.baseline),
      },
      'A',
    )
  }

  if (action.type === 'apply-rate') {
    return applyRate(state, action.payload)
  }

  if (action.type === 'chat-user-message') {
    const userMessage = {
      id: `chat-user-${state.ai.messages.length + 1}`,
      role: 'user' as const,
      text: action.payload,
      createdIso: state.sim.nowIso,
    }
    const assistant = simulateAssistantReply(action.payload, state.entities, state.sim.nowIso)
    return {
      ...state,
      ai: {
        ...state.ai,
        messages: [...state.ai.messages, userMessage, assistant],
      },
    }
  }

  if (action.type === 'chat-run-action') {
    return handleChatAction(state, action.payload)
  }

  if (action.type === 'set-report-range') {
    return { ...state, ui: { ...state.ui, reportRange: action.payload } }
  }

  if (action.type === 'voice-play') {
    return { ...state, voice: { ...state.voice, playing: true } }
  }

  if (action.type === 'voice-pause') {
    return { ...state, voice: { ...state.voice, playing: false } }
  }

  if (action.type === 'voice-seek') {
    return { ...state, voice: { ...state.voice, playbackSecond: Math.max(0, action.payload) } }
  }

  if (action.type === 'voice-speed') {
    return { ...state, voice: { ...state.voice, speed: action.payload } }
  }

  if (action.type === 'inject-event') {
    const event = buildInjectedEvent(state.sim.nowIso, action.payload, state.sim.queue.length + 1)
    return {
      ...state,
      sim: {
        ...state.sim,
        queue: appendQueue(state.sim.queue, event),
      },
    }
  }

  if (action.type === 'set-guided-tour-step') {
    return { ...state, ui: { ...state.ui, guidedTourStep: action.payload } }
  }

  if (action.type === 'approve-plan') {
    return { ...state, ai: { ...state.ai, planningApproved: true } }
  }

  return state
}
