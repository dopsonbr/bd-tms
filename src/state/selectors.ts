import type { AppState, ExceptionEvent, Load } from '@/domain/types'
import { ACTIVE_LOAD_STATUSES } from '@/domain/constants'

export function selectLoadsBySegment(state: AppState): Array<Load> {
  if (state.ui.loadSegment === 'active') {
    return state.entities.loads.filter((load) => ACTIVE_LOAD_STATUSES.includes(load.status))
  }
  if (state.ui.loadSegment === 'available') {
    return state.entities.loads.filter((load) => load.status === 'tendered')
  }
  return state.entities.loads.filter((load) => load.status === 'delivered' || load.status === 'invoiced')
}

export function selectOpenExceptions(state: AppState): Array<ExceptionEvent> {
  return state.entities.exceptions
    .filter((item) => item.status === 'open')
    .sort((a, b) => new Date(b.createdIso).getTime() - new Date(a.createdIso).getTime())
}

export function selectKpis(state: AppState) {
  const loads = state.entities.loads
  const activeLoads = loads.filter((load) => ACTIVE_LOAD_STATUSES.includes(load.status)).length
  const tenderedLoads = loads.filter((load) => load.status === 'tendered').length
  const marginUsd = loads.reduce((sum, load) => sum + load.marginUsd, 0)
  const onTimeRisk = selectOpenExceptions(state).length

  return {
    activeLoads,
    tenderedLoads,
    marginUsd,
    onTimeRisk,
  }
}

export function selectLoadById(state: AppState, loadId: string | undefined) {
  if (!loadId) {
    return undefined
  }
  return state.entities.loads.find((load) => load.id === loadId)
}

export function selectTruckById(state: AppState, truckId: string | undefined) {
  if (!truckId) {
    return undefined
  }
  return state.entities.trucks.find((truck) => truck.id === truckId)
}
