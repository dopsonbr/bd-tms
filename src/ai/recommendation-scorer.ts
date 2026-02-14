import type { Recommendation, SeedSnapshot } from '@/domain/types'

export function scoreBestAssignment(entities: SeedSnapshot, loadId: string): Recommendation | undefined {
  const load = entities.loads.find((item) => item.id === loadId)
  if (!load) {
    return undefined
  }

  const candidates = entities.trucks
    .filter((truck) => truck.status !== 'maintenance' && !truck.currentLoadId)
    .map((truck) => {
      const driver = entities.drivers.find((item) => item.id === truck.driverId)
      const hosScore = Math.max(0, (driver?.hosRemainingHours ?? 0) / 14)
      const equipmentScore = truck.equipment === load.equipment ? 1 : 0.4
      const etaScore = Math.max(0, 1 - truck.etaMinutes / 360)
      const score = Number((hosScore * 0.35 + equipmentScore * 0.4 + etaScore * 0.25).toFixed(3))
      return {
        truck,
        driver,
        score,
      }
    })
    .sort((a, b) => b.score - a.score)

  const best = candidates[0]
  if (!best || !best.driver) {
    return undefined
  }

  return {
    loadId,
    truckId: best.truck.id,
    driverId: best.driver.id,
    confidence: Math.round(best.score * 100),
    reason: `${best.truck.unitNumber} is nearest compatible unit with strong HOS buffer.`,
    alternatives: candidates.slice(1, 4).map((item) => ({
      truckId: item.truck.id,
      score: Math.round(item.score * 100),
      reason: `${item.truck.unitNumber} has weaker fit due to ETA/HOS blend.`,
    })),
  }
}
