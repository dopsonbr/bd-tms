import type { EntityId } from '@/data/types'
import { useAppStore } from '@/store'
import { LOAD_LIFECYCLE_ORDER } from '@/data/constants'

export function advanceLoadStatus(loadId: EntityId) {
  const store = useAppStore.getState()
  const load = store.loads[loadId]
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!load) return

  const currentIndex = LOAD_LIFECYCLE_ORDER.indexOf(load.status)
  if (currentIndex < 0 || currentIndex >= LOAD_LIFECYCLE_ORDER.length - 1)
    return

  const nextStatus = LOAD_LIFECYCLE_ORDER[currentIndex + 1]
  store.updateLoadStatus(loadId, nextStatus)
}

export function acceptLoad(loadId: EntityId) {
  const store = useAppStore.getState()
  store.updateLoadStatus(loadId, 'accepted')
  store.addLoadCommunication(loadId, {
    source: 'system',
    type: 'system_event',
    content: 'Load accepted by dispatcher',
    isAi: false,
  })
}

export function rejectLoad(loadId: EntityId) {
  const store = useAppStore.getState()
  store.updateLoadStatus(loadId, 'cancelled')
  store.addLoadCommunication(loadId, {
    source: 'system',
    type: 'system_event',
    content: 'Load rejected by dispatcher',
    isAi: false,
  })
}

export function reassignLoad(
  loadId: EntityId,
  newTruckId: EntityId,
  newDriverId: EntityId,
) {
  const store = useAppStore.getState()
  store.assignLoad(loadId, newTruckId, newDriverId)
  store.addLoadCommunication(loadId, {
    source: 'dispatcher',
    type: 'system_event',
    content: `Load reassigned to ${newTruckId} / ${newDriverId}`,
    isAi: false,
  })
}

export function dispatchLoad(
  loadId: EntityId,
  truckId: EntityId,
  driverId: EntityId,
) {
  const store = useAppStore.getState()
  store.assignLoad(loadId, truckId, driverId)
  store.updateLoadStatus(loadId, 'dispatched')
  store.updateTruckStatus(truckId, 'en_route')
  store.addLoadCommunication(loadId, {
    source: 'system',
    type: 'system_event',
    content: `Dispatched to ${truckId}. Driver notified.`,
    isAi: false,
  })
  store.addNotification({
    priority: 'info',
    title: `Load ${loadId} dispatched`,
    body: `Assigned to ${truckId}. Driver en route to pickup.`,
    relatedEntityType: 'load',
    relatedEntityId: loadId,
  })
}
