import type { SeedSnapshot } from '@/domain/types'

export function buildRepositionSuggestions(entities: SeedSnapshot): Array<{ truckId: string; lane: string }> {
  return entities.trucks
    .filter((truck) => truck.status === 'available')
    .slice(0, 3)
    .map((truck, idx) => ({
      truckId: truck.id,
      lane: idx % 2 === 0 ? 'Chicago -> Dallas' : 'Atlanta -> Orlando',
    }))
}
