import { createFileRoute } from '@tanstack/react-router'

import { CommunicationLog } from '@/components/freightos/communication-log'
import { DispatchSheet } from '@/components/freightos/dispatch-sheet'
import { ErrorState } from '@/components/freightos/error-state'
import { LoadDocuments } from '@/components/freightos/load-documents'
import { LoadFinancials } from '@/components/freightos/load-financials'
import { LoadLifecycle } from '@/components/freightos/load-lifecycle'
import { StatusBadge } from '@/components/freightos/status-badge'
import { useAppStore } from '@/state/app-store'

export const Route = createFileRoute('/loads/$loadId')({ component: LoadDetailRoute })

function LoadDetailRoute() {
  const { loadId } = Route.useParams()
  const { state } = useAppStore()
  const load = state.entities.loads.find((item) => item.id === loadId)

  if (!load) {
    return <ErrorState title="Load not found" detail={`No record for ${loadId}.`} />
  }

  return (
    <div className="space-y-3">
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">{load.reference}</h2>
          <StatusBadge status={load.status} />
        </div>
        <p className="mt-1 text-xs text-slate-400">
          {load.origin} {'->'} {load.destination}
        </p>
      </section>
      <DispatchSheet load={load} />
      <LoadLifecycle load={load} />
      <LoadFinancials load={load} />
      <LoadDocuments load={load} />
      <CommunicationLog load={load} />
    </div>
  )
}
