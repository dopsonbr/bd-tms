import type { SeedSnapshot } from '@/domain/types'

export function computeDemandForecast(entities: SeedSnapshot): {
  tomorrowLoads: number
  capacityGap: number
  hotLanes: Array<string>
} {
  const tomorrowLoads = entities.loads.filter((load) => load.status === 'tendered').length
  const activeTrucks = entities.trucks.filter((truck) => truck.status !== 'maintenance').length
  const capacityGap = Math.max(0, tomorrowLoads - activeTrucks)
  const hotLanes = entities.loads
    .slice(0, 3)
    .map((load) => `${load.origin} -> ${load.destination}`)

  return {
    tomorrowLoads,
    capacityGap,
    hotLanes,
  }
}
