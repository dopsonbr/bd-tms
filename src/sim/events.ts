import type { SimEvent } from '@/domain/types'

export function sortQueue(queue: Array<SimEvent>): Array<SimEvent> {
  return [...queue].sort((a, b) => new Date(a.atIso).getTime() - new Date(b.atIso).getTime())
}

export function splitDueEvents(queue: Array<SimEvent>, nowIso: string): {
  due: Array<SimEvent>
  remaining: Array<SimEvent>
} {
  const now = new Date(nowIso).getTime()
  const due: Array<SimEvent> = []
  const remaining: Array<SimEvent> = []

  for (const event of queue) {
    if (new Date(event.atIso).getTime() <= now) {
      due.push(event)
    } else {
      remaining.push(event)
    }
  }

  return {
    due,
    remaining: sortQueue(remaining),
  }
}
