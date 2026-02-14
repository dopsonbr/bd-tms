import type { AppState } from '@/domain/types'

export interface ChatReply {
  content: string
  confidence: number
  reasoning: Array<string>
  quickActions: Array<string>
}

export function simulateChatReply(input: string, state: AppState): ChatReply {
  const normalized = input.trim().toLowerCase()

  const activeLoads = state.loads.filter((load) =>
    ['pending_dispatch', 'dispatched', 'at_pickup', 'in_transit', 'at_delivery'].includes(load.status)
  ).length
  const availableTrucks = state.trucks.filter((truck) => truck.status === 'available').length
  const unresolved = state.exceptions.filter((item) => !item.resolved).length

  if (normalized.includes('tomorrow') || normalized.includes('plan')) {
    return {
      content:
        `Tomorrow outlook: ${activeLoads} active loads, ${availableTrucks} trucks immediately available, ` +
        `${unresolved} unresolved exceptions. I recommend pre-assigning reefers on ATL->NSH before 6 PM.`,
      confidence: 92,
      reasoning: [
        'Lane demand trend is front-loaded in first shift',
        'Reefer capacity is tighter than dry van capacity',
        'Unresolved exceptions increase late-shift assignment risk',
      ],
      quickActions: ['Show empty trucks', 'Prioritize high margin loads'],
    }
  }

  if (normalized.includes('exception') || normalized.includes('risk')) {
    return {
      content:
        'Top risk is a late pickup chain on two loads in Alabama. Recommend proactive customer notification and one relay candidate.',
      confidence: 88,
      reasoning: [
        'ETA slip exceeds 35 minutes on two linked appointments',
        'One alternate truck can recover both windows with minimal deadhead',
        'Proactive notification historically reduces escalation risk',
      ],
      quickActions: ['Open exception feed', 'Inject weather event'],
    }
  }

  if (normalized.includes('assign') || normalized.includes('dispatch')) {
    const candidateLoad = state.loads.find((load) => load.status === 'pending_dispatch')
    const candidateTruck = state.trucks.find((truck) => truck.status === 'available')

    if (candidateLoad && candidateTruck) {
      return {
        content: `Recommended dispatch: ${candidateLoad.reference} -> ${candidateTruck.unit}. Deadhead is low and HOS profile is safe.`,
        confidence: 94,
        reasoning: [
          'Closest compatible truck to pickup window',
          'Driver has enough HOS to complete lane safely',
          'Assignment keeps tomorrow capacity balanced',
        ],
        quickActions: ['Assign recommended pair', 'Show alternatives'],
      }
    }
  }

  return {
    content:
      'Current operations are stable. Ask for tomorrow planning, dispatch recommendations, or exception triage to drill down.',
    confidence: 79,
    reasoning: [
      'No critical blockers are currently unresolved',
      'Capacity is available in multiple regions',
      'Scenario controls can stress test this state quickly',
    ],
    quickActions: ['Tomorrow plan', 'Exception triage', 'Voice demo'],
  }
}
