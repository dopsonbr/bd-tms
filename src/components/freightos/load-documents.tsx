import type { Load } from '@/domain/types'

export function LoadDocuments({ load }: { load: Load }) {
  const docs = [
    { name: 'Rate Confirmation', status: 'ready' },
    { name: 'BOL', status: load.status === 'delivered' || load.status === 'invoiced' ? 'ready' : 'pending' },
    { name: 'POD', status: load.status === 'invoiced' ? 'ready' : 'pending' },
  ]

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h3 className="mb-3 text-sm font-semibold">Documents</h3>
      <ul className="space-y-2">
        {docs.map((doc) => (
          <li key={doc.name} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-xs">
            <span>{doc.name}</span>
            <span className={doc.status === 'ready' ? 'text-emerald-300' : 'text-amber-300'}>{doc.status}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
