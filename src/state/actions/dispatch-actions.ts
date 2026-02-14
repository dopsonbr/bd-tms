import type { AppAction } from '@/domain/types'

export function assignLoadAction(loadId: string, truckId: string, driverId: string): AppAction {
  return {
    type: 'assign-load',
    payload: { loadId, truckId, driverId },
  }
}
