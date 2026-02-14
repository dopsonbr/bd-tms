import { useAppStore } from '@/state/app-store'

export function CarrierMatchSheet() {
  const { state } = useAppStore()

  const carrierRows = state.entities.carriers.slice(0, 4).map((carrier, idx) => ({
    ...carrier,
    score: 91 - idx * 7,
    deadhead: 24 + idx * 11,
  }))

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h3 className="mb-3 text-sm font-semibold">Carrier Match</h3>
      <div className="space-y-2 text-xs">
        {carrierRows.map((carrier) => (
          <div key={carrier.id} className="grid grid-cols-4 gap-2 rounded-lg border border-white/10 px-3 py-2">
            <span className="col-span-2 text-slate-200">{carrier.name}</span>
            <span className="text-slate-400">Score {carrier.score}</span>
            <span className="text-slate-400">{carrier.deadhead}mi</span>
          </div>
        ))}
      </div>
    </section>
  )
}
