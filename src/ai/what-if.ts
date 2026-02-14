import type { Recommendation } from '@/domain/types'

export function explainRejectedOptions(recommendation: Recommendation | undefined): Array<string> {
  if (!recommendation) {
    return ['No recommendation available yet.']
  }

  if (recommendation.alternatives.length === 0) {
    return ['No alternatives were ranked for this load.']
  }

  return recommendation.alternatives.map(
    (alt) => `${alt.truckId} rejected at score ${alt.score}: ${alt.reason}`,
  )
}
