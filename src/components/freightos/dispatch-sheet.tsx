import { useMemo } from 'react'

import type { Load } from '@/domain/types'
import { scoreBestAssignment } from '@/ai/recommendation-scorer'
import { useAppStore } from '@/state/app-store'

export function DispatchSheet({ load }: { load: Load }) {
  const { state, dispatch } = useAppStore()

  const recommendation = useMemo(() => scoreBestAssignment(state.entities, load.id), [state.entities, load.id])

  if (!recommendation) {
    return null
  }

  return (
    <section className="rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-3">
      <h3 className="text-sm font-semibold text-cyan-100">Recommendation</h3>
      <p className="mt-1 text-xs text-cyan-50/90">{recommendation.reason}</p>
      <p className="mt-2 text-xs text-cyan-200">
        Truck {recommendation.truckId} · Driver {recommendation.driverId} · Confidence {recommendation.confidence}%
      </p>
      <button
        type="button"
        className="mt-3 rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950"
        onClick={() =>
          dispatch({
            type: 'assign-load',
            payload: {
              loadId: recommendation.loadId,
              truckId: recommendation.truckId,
              driverId: recommendation.driverId,
            },
          })
        }
      >
        Accept Recommendation
      </button>
    </section>
  )
}
