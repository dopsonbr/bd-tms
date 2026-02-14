import { createContext, useContext, useMemo, useReducer } from 'react'
import { reduceAppState } from './actions'
import type { Dispatch, ReactNode } from 'react'

import type { AppAction, AppState } from '@/domain/types'
import { buildSeedSnapshot } from '@/data/seed/build-seed'
import { applyScenario, getScenarioDefinitions } from '@/data/seed/scenarios'
import { BASE_NOW_ISO } from '@/domain/constants'

const StoreContext = createContext<
  | {
      state: AppState
      dispatch: Dispatch<AppAction>
    }
  | undefined
>(undefined)

export function createInitialState(): AppState {
  const baseline = buildSeedSnapshot()
  const initialScenario = getScenarioDefinitions(BASE_NOW_ISO).find((scenario) => scenario.id === 'A')

  return {
    baseline,
    entities: applyScenario(baseline, 'A'),
    sim: {
      nowIso: BASE_NOW_ISO,
      queue: initialScenario ? initialScenario.queue : [],
      speed: 1,
      eventLog: [],
      scenarioId: 'A',
    },
    ui: {
      loadSegment: 'active',
      searchOpen: false,
      notificationsOpen: false,
      reportRange: '24h',
      guidedTourStep: 0,
    },
    ai: {
      messages: [
        {
          id: 'chat-system-1',
          role: 'system',
          text: 'FreightOS AI ready. Ask for dispatch recommendations, risk summaries, or tomorrow planning.',
          createdIso: BASE_NOW_ISO,
        },
      ],
      planningApproved: false,
    },
    voice: {
      playbackSecond: 0,
      playing: false,
      speed: 1,
    },
  }
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduceAppState, undefined, createInitialState)

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useAppStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useAppStore must be used inside AppStoreProvider')
  }
  return context
}
