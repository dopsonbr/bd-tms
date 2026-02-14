import type { Driver, Load, MatchFactor, Truck } from '@/data/types'
import { distanceMiles } from '@/lib/geo'

interface ScoreResult {
  totalScore: number
  confidence: 'high' | 'medium' | 'low'
  factors: Array<MatchFactor>
}

export function scoreMatch(
  load: Load,
  truck: Truck,
  driver: Driver,
): ScoreResult {
  const factors: Array<MatchFactor> = []

  // Factor 1: Deadhead distance (weight: 25%)
  const deadhead = distanceMiles(truck.position, load.origin.position)
  const deadheadScore = Math.max(0, 100 - deadhead * 1.5)
  factors.push({
    name: 'deadhead_miles',
    value: `${Math.round(deadhead)} mi`,
    score: deadheadScore,
    description:
      deadhead < 20
        ? 'Very close to pickup'
        : deadhead < 50
          ? 'Reasonable deadhead'
          : 'Long deadhead — consider closer trucks',
  })

  // Factor 2: HOS availability (weight: 25%)
  const driveMins = driver.hos.driveRemaining
  const loadDriveMins = (load.distance / 55) * 60
  const hosMargin = driveMins - loadDriveMins
  const hosScore =
    hosMargin > 120 ? 100 : hosMargin > 0 ? (hosMargin / 120) * 100 : 0
  factors.push({
    name: 'hos_remaining',
    value: `${(driveMins / 60).toFixed(1)} hrs`,
    score: hosScore,
    description:
      hosMargin > 120
        ? 'Plenty of drive time'
        : hosMargin > 0
          ? 'Tight but feasible'
          : 'Insufficient HOS — would need relay',
  })

  // Factor 3: Equipment compatibility (weight: 15%)
  const equipMatch = truck.equipmentType === load.equipmentRequired
  const equipScore = equipMatch ? 100 : 0
  factors.push({
    name: 'equipment_match',
    value: equipMatch ? 'Match' : 'Mismatch',
    score: equipScore,
    description: equipMatch
      ? `${truck.equipmentType} matches requirement`
      : `Truck is ${truck.equipmentType}, load needs ${load.equipmentRequired}`,
  })

  // Factor 4: Delivery window feasibility (weight: 15%)
  const etaMinutes = (deadhead / 45) * 60 + loadDriveMins
  const windowMinutes = 480
  const timeScore =
    etaMinutes < windowMinutes
      ? 100
      : Math.max(0, 100 - (etaMinutes - windowMinutes) * 2)
  factors.push({
    name: 'delivery_window',
    value: etaMinutes < windowMinutes ? 'On time' : 'At risk',
    score: timeScore,
    description: `Estimated ${(etaMinutes / 60).toFixed(1)}h total transit`,
  })

  // Factor 5: Driver lane familiarity (weight: 10%)
  const originCode = load.origin.city.substring(0, 3).toUpperCase()
  const destCode = load.destination.city.substring(0, 3).toUpperCase()
  const laneKey = `${originCode}-${destCode}`
  const familiar = driver.preferredLanes.some(
    (l) => l === laneKey || l === `${destCode}-${originCode}`,
  )
  const familiarScore = familiar ? 100 : 30
  factors.push({
    name: 'lane_familiarity',
    value: familiar ? 'Familiar' : 'New lane',
    score: familiarScore,
    description: familiar
      ? `Driver has run ${laneKey} before`
      : 'First time on this lane',
  })

  // Factor 6: Rate / profitability (weight: 10%)
  const rateScore = Math.min(100, (load.ratePerMile / 3.0) * 100)
  factors.push({
    name: 'profitability',
    value: `$${load.ratePerMile.toFixed(2)}/mi`,
    score: rateScore,
    description:
      load.ratePerMile >= 2.8 ? 'Above average rate' : 'Standard rate',
  })

  // Weighted total
  const weights = [0.25, 0.25, 0.15, 0.15, 0.1, 0.1]
  const totalScore = Math.round(
    factors.reduce((sum, f, i) => sum + f.score * weights[i], 0),
  )

  const confidence: ScoreResult['confidence'] =
    totalScore >= 85 ? 'high' : totalScore >= 60 ? 'medium' : 'low'

  return { totalScore, confidence, factors }
}
