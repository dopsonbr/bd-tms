import type { ChatMessage, SeedSnapshot } from '@/domain/types'

function makeMessage(id: string, text: string, createdIso: string, withActions = false): ChatMessage {
  return {
    id,
    role: 'assistant',
    text,
    createdIso,
    actions: withActions
      ? [
          { id: `${id}-a1`, label: 'Assign Best Truck', action: 'assign_best_truck' },
          { id: `${id}-a2`, label: 'Resolve Top Exception', action: 'resolve_top_exception' },
        ]
      : undefined,
  }
}

export function simulateAssistantReply(
  prompt: string,
  entities: SeedSnapshot,
  createdIso: string,
): ChatMessage {
  const lower = prompt.toLowerCase()

  if (lower.includes('tomorrow') || lower.includes('plan')) {
    const tendered = entities.loads.filter((load) => load.status === 'tendered').length
    const atRisk = entities.loads.filter((load) => load.status === 'at_risk').length
    return makeMessage(
      `chat-${createdIso}-plan`,
      `Tomorrow outlook: ${tendered} tenders, ${atRisk} at-risk loads, and 11 high-confidence assignment candidates.`,
      createdIso,
      true,
    )
  }

  if (lower.includes('exception')) {
    const open = entities.exceptions.filter((exception) => exception.status === 'open')
    const top = open[0]
    return makeMessage(
      `chat-${createdIso}-exc`,
      top
        ? `Top exception: ${top.title}. Suggested action: reassign ${top.loadId} and notify shipper.`
        : 'No open exceptions. Fleet risk posture is stable.',
      createdIso,
      true,
    )
  }

  return makeMessage(
    `chat-${createdIso}-default`,
    'I can run scenario flows, assign best-fit trucks, or summarize risk and margin impacts.',
    createdIso,
    true,
  )
}
