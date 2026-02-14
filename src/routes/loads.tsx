import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'

import { DispatchBoard } from '@/components/freightos/dispatch-board'
import { LoadCard } from '@/components/freightos/load-card'
import { LoadFilters } from '@/components/freightos/load-filters'
import { EmptyState } from '@/components/freightos/error-state'
import { useAppStore } from '@/state/app-store'
import { selectLoadsBySegment } from '@/state/selectors'

export const Route = createFileRoute('/loads')({ component: LoadsRoute })

function LoadsRoute() {
  const navigate = useNavigate()
  const { state, dispatch } = useAppStore()
  const loads = selectLoadsBySegment(state)

  return (
    <div className="space-y-3">
      <LoadFilters />
      <DispatchBoard />
      {loads.length === 0 ? (
        <EmptyState title="No loads in this segment" detail="Try changing filters or scenario." />
      ) : (
        <div className="space-y-2">
          {loads.slice(0, 20).map((load) => (
            <LoadCard
              key={load.id}
              load={load}
              onClick={() => {
                dispatch({ type: 'select-load', payload: load.id })
                navigate({ to: '/loads/$loadId', params: { loadId: load.id } })
              }}
            />
          ))}
        </div>
      )}
      <Outlet />
    </div>
  )
}
