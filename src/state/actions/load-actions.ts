import type { AppAction, LoadStatus } from '@/domain/types'

export function setLoadStatusAction(loadId: string, status: LoadStatus): AppAction {
  return { type: 'set-load-status', payload: { loadId, status } }
}

export function applyRateAction(loadId: string, revenueUsd: number): AppAction {
  return { type: 'apply-rate', payload: { loadId, revenueUsd } }
}
