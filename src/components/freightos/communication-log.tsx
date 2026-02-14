import type { Load } from '@/domain/types'

export function CommunicationLog({ load }: { load: Load }) {
  const entries = [
    `Driver check-in for ${load.reference}`,
    `Shipper update sent for ${load.origin}`,
    `System ETA refresh for ${load.destination}`,
  ]

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h3 className="mb-3 text-sm font-semibold">Communication Log</h3>
      <div className="space-y-2">
        {entries.map((entry, idx) => (
          <div key={entry} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300">
            <span className="mr-2 text-slate-500">{idx + 1}.</span>
            {entry}
          </div>
        ))}
      </div>
    </section>
  )
}
