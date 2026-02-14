import {
  generateCarriers,
  generateDrivers,
  generateExceptions,
  generateFacilities,
  generateLoads,
  generateShippers,
  generateTimeEvents,
  generateTrailers,
  generateTrucks,
} from './generators'
import type { StoreState } from './types'

export function createSeedState(): StoreState {
  const trucks = generateTrucks()
  const drivers = generateDrivers(trucks)
  const shippers = generateShippers()
  const carriers = generateCarriers()
  const facilities = generateFacilities()
  const loads = generateLoads(trucks, drivers, shippers, facilities)
  const trailers = generateTrailers(trucks)
  const exceptions = generateExceptions(loads, trucks)
  const timeEvents = generateTimeEvents()

  return {
    trucks,
    drivers,
    loads,
    shippers,
    carriers,
    facilities,
    trailers,
    exceptions,
    notifications: [],
    voiceCalls: [],
    recommendations: [],
    chatMessages: [],
    timeEvents,
    simulatedTime: new Date().toISOString(),
    selectedScenario: null,
  }
}
