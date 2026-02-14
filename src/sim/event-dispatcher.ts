import { splitDueEvents } from './events'
import type { AppState, ExceptionEvent, SimEvent } from '@/domain/types'

function cloneState(state: AppState): AppState {
  return {
    ...state,
    voice: {
      ...state.voice,
    },
    entities: {
      ...state.entities,
      trucks: state.entities.trucks.map((item) => ({ ...item })),
      drivers: state.entities.drivers.map((item) => ({ ...item })),
      loads: state.entities.loads.map((item) => ({ ...item, stops: item.stops.map((stop) => ({ ...stop })) })),
      shippers: state.entities.shippers.map((item) => ({ ...item })),
      carriers: state.entities.carriers.map((item) => ({ ...item })),
      exceptions: state.entities.exceptions.map((item) => ({ ...item })),
      voiceCalls: state.entities.voiceCalls.map((item) => ({ ...item, frames: item.frames.map((frame) => ({ ...frame })) })),
      notifications: state.entities.notifications.map((item) => ({ ...item })),
    },
    sim: {
      ...state.sim,
      eventLog: [...state.sim.eventLog],
      queue: [...state.sim.queue],
    },
  }
}

function applyEvent(next: AppState, event: SimEvent): void {
  if (event.type === 'load_status') {
    const load = next.entities.loads.find((item) => item.id === event.payload.loadId)
    const status = event.payload.status
    if (load && status) {
      load.status = status as typeof load.status
      next.sim.eventLog.push(`Load ${load.reference} -> ${status}`)
    }
    return
  }

  if (event.type === 'exception_open') {
    const load = next.entities.loads.find((item) => item.id === event.payload.loadId)
    if (load) {
      const created: ExceptionEvent = {
        id: `exc-auto-${next.entities.exceptions.length + 1}`,
        loadId: load.id,
        severity: (event.payload.severity as ExceptionEvent['severity']) || 'high',
        status: 'open',
        type: 'delay',
        title: `Auto exception for ${load.reference}`,
        detail: 'Injected scenario risk event',
        createdIso: next.sim.nowIso,
      }
      load.status = 'at_risk'
      next.entities.exceptions.unshift(created)
      next.sim.eventLog.push(`Exception opened for ${load.reference}`)
    }
    return
  }

  if (event.type === 'exception_resolve') {
    const openException = next.entities.exceptions.find(
      (item) => item.loadId === event.payload.loadId && item.status === 'open',
    )
    if (openException) {
      openException.status = 'resolved'
      openException.resolvedIso = next.sim.nowIso
      next.sim.eventLog.push(`Exception ${openException.id} resolved`)
    }
    return
  }

  if (event.type === 'voice_call_start') {
    const call = next.entities.voiceCalls.find((item) => item.id === event.payload.callId)
    if (call) {
      call.status = 'live'
      next.voice.activeCallId = call.id
      next.voice.playing = true
      next.voice.playbackSecond = 0
      next.sim.eventLog.push(`Voice call ${call.id} started`)
    }
    return
  }

  if (event.type === 'voice_call_complete') {
    const call = next.entities.voiceCalls.find((item) => item.id === event.payload.callId)
    if (call) {
      call.status = 'completed'
      next.voice.playing = false
      next.sim.eventLog.push(`Voice call ${call.id} completed`)
    }
  }
}

export function dispatchDueEvents(state: AppState): AppState {
  const next = cloneState(state)
  const { due, remaining } = splitDueEvents(next.sim.queue, next.sim.nowIso)

  next.sim.queue = remaining
  for (const event of due) {
    applyEvent(next, event)
  }

  return next
}
