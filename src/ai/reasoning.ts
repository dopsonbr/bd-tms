import type { Recommendation, SeedSnapshot } from '@/domain/types'

export function buildReasoningSummary(
  recommendation: Recommendation | undefined,
  entities: SeedSnapshot,
): string {
  if (!recommendation) {
    return 'No recommendation available. Select a load to score options.'
  }

  const load = entities.loads.find((item) => item.id === recommendation.loadId)
  const truck = entities.trucks.find((item) => item.id === recommendation.truckId)
  const driver = entities.drivers.find((item) => item.id === recommendation.driverId)

  return [
    `Load: ${load?.reference ?? recommendation.loadId}`,
    `Truck: ${truck?.unitNumber ?? recommendation.truckId}`,
    `Driver: ${driver?.name ?? recommendation.driverId}`,
    `Confidence: ${recommendation.confidence}%`,
    recommendation.reason,
  ].join(' | ')
}

export function explainAlternative(score: number): 'High fit' | 'Balanced fit' | 'Risky fit' {
  if (score >= 85) {
    return 'High fit'
  }
  if (score >= 65) {
    return 'Balanced fit'
  }
  return 'Risky fit'
}
