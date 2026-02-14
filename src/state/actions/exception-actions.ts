import type { AppAction } from '@/domain/types'

export function resolveExceptionAction(exceptionId: string): AppAction {
  return { type: 'resolve-exception', payload: exceptionId }
}
