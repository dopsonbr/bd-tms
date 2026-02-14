import type { AppState } from '@/domain/types'

export function selectBrokerLoads(state: AppState) {
  return state.entities.loads.filter((load) => load.tags.includes('brokered') || load.tags.includes('high_margin'))
}

export function selectFleetAvailability(state: AppState) {
  return {
    available: state.entities.trucks.filter((truck) => truck.status === 'available').length,
    assigned: state.entities.trucks.filter((truck) => truck.status === 'assigned').length,
    maintenance: state.entities.trucks.filter((truck) => truck.status === 'maintenance').length,
  }
}

export function selectTimelineEvents(state: AppState) {
  return state.sim.eventLog.slice(-8).reverse()
}
