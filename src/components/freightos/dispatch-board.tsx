import { Link } from '@tanstack/react-router'
import { useAppStore } from '@/state/app-store'

export function DispatchBoard() {
  const { state } = useAppStore()
  const tendered = state.entities.loads.filter((load) => load.status === 'tendered').slice(0, 5)

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h3 className="mb-3 text-sm font-semibold">Dispatch Board</h3>
      <div className="space-y-2">
        {tendered.map((load) => (
          <Link key={load.id} to="/loads/$loadId" params={{ loadId: load.id }} className="block rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200">
            {load.reference} - {load.origin} {'->'} {load.destination}
          </Link>
        ))}
      </div>
    </section>
  )
}
