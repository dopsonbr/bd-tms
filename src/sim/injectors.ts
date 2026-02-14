import type { SimEvent } from '@/domain/types'

export function buildInjectedEvent(
  nowIso: string,
  type: 'weather' | 'breakdown' | 'tender' | 'call',
  ordinal: number,
): SimEvent {
  const atIso = new Date(new Date(nowIso).getTime() + 2 * 60_000).toISOString()

  if (type === 'call') {
    return {
      id: `inject-${ordinal}`,
      atIso,
      type: 'voice_call_start',
      payload: { callId: 'call-1' },
    }
  }

  if (type === 'tender') {
    return {
      id: `inject-${ordinal}`,
      atIso,
      type: 'load_status',
      payload: { loadId: 'load-50', status: 'assigned' },
    }
  }

  return {
    id: `inject-${ordinal}`,
    atIso,
    type: 'exception_open',
    payload: {
      loadId: type === 'breakdown' ? 'load-3' : 'load-11',
      severity: type === 'breakdown' ? 'critical' : 'high',
    },
  }
}
