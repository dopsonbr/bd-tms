import { EntityCard } from './entity-card'
import { StatusBadge } from './status-badge'
import type { Load } from '@/domain/types'

export function LoadCard({ load, onClick }: { load: Load; onClick?: () => void }) {
  return (
    <EntityCard
      title={load.reference}
      subtitle={`${load.origin} -> ${load.destination}`}
      right={<StatusBadge status={load.status} />}
      onClick={onClick}
    >
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{load.equipment.replace('_', ' ')}</span>
        <span>${load.marginUsd.toLocaleString()} margin</span>
      </div>
    </EntityCard>
  )
}
