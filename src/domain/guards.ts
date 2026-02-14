import { ACTIVE_LOAD_STATUSES, LOAD_STATUS_ORDER } from './constants'
import type { Load, LoadStatus, SeedSnapshot } from './types'

export function canTransitionLoad(current: LoadStatus, next: LoadStatus): boolean {
  return LOAD_STATUS_ORDER.indexOf(next) >= LOAD_STATUS_ORDER.indexOf(current)
}

export function validateLoadTransition(load: Load, next: LoadStatus): boolean {
  return canTransitionLoad(load.status, next)
}

export function validateSeedIntegrity(seed: SeedSnapshot): Array<string> {
  const issues: Array<string> = []

  const activeAssignments = new Map<string, string>()

  for (const load of seed.loads) {
    if (ACTIVE_LOAD_STATUSES.includes(load.status) && load.truckId) {
      const prior = activeAssignments.get(load.truckId)
      if (prior) {
        issues.push(`Truck ${load.truckId} assigned to active loads ${prior} and ${load.id}`)
      }
      activeAssignments.set(load.truckId, load.id)
    }

    if (load.driverId && !seed.drivers.some((driver) => driver.id === load.driverId)) {
      issues.push(`Load ${load.id} references missing driver ${load.driverId}`)
    }

    if (load.truckId && !seed.trucks.some((truck) => truck.id === load.truckId)) {
      issues.push(`Load ${load.id} references missing truck ${load.truckId}`)
    }
  }

  for (const driver of seed.drivers) {
    if (driver.hosRemainingHours < 0 || driver.hosRemainingHours > 14) {
      issues.push(`Driver ${driver.id} has invalid HOS ${driver.hosRemainingHours}`)
    }
  }

  return issues
}
