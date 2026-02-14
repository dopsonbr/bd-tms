import { scoreMatch } from './dispatch-scoring'
import type { DispatchRecommendation } from '@/data/types'
import { useAppStore } from '@/store'

export function generateRecommendations(): Array<DispatchRecommendation> {
  const { loads, trucks, drivers } = useAppStore.getState()

  const unassigned = Object.values(loads).filter(
    (l) => ['tendered', 'accepted'].includes(l.status) && !l.assignedTruckId,
  )

  const available = Object.values(trucks).filter(
    (t) => t.status === 'empty' && t.driverId,
  )

  const recommendations: Array<DispatchRecommendation> = []

  for (const load of unassigned) {
    const scored = available
      .map((truck) => {
        const driver = drivers[truck.driverId!]
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!driver) return null
        const result = scoreMatch(load, truck, driver)
        return { truck, driver, ...result }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null && x.totalScore > 0)
      .sort((a, b) => b.totalScore - a.totalScore)

    const best = scored[0]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (best) {
      recommendations.push({
        id: `rec-${load.id}-${best.truck.id}`,
        loadId: load.id,
        truckId: best.truck.id,
        driverId: best.driver.id,
        score: best.totalScore,
        confidence: best.confidence,
        factors: best.factors,
        status: 'pending',
      })
    }
  }

  return recommendations.sort((a, b) => b.score - a.score)
}
