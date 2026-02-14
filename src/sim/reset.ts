import type { AppAction, ScenarioId } from '@/domain/types'

export function resetAction(): AppAction {
  return { type: 'reset-demo' }
}

export function loadScenarioAction(scenarioId: ScenarioId): AppAction {
  return { type: 'load-scenario', payload: scenarioId }
}
