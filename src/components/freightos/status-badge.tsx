import type { ExceptionSeverity, LoadStatus } from '@/domain/types'
import { SEVERITY_CLASSES } from '@/domain/constants'

const LOAD_STATUS_CLASSES: Record<LoadStatus, string> = {
  tendered: 'text-blue-200 bg-blue-500/20 border-blue-500/40',
  assigned: 'text-cyan-200 bg-cyan-500/20 border-cyan-500/40',
  in_transit: 'text-teal-200 bg-teal-500/20 border-teal-500/40',
  at_risk: 'text-orange-200 bg-orange-500/20 border-orange-500/40',
  delivered: 'text-emerald-200 bg-emerald-500/20 border-emerald-500/40',
  invoiced: 'text-fuchsia-200 bg-fuchsia-500/20 border-fuchsia-500/40',
}

export function StatusBadge({ status }: { status: LoadStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${LOAD_STATUS_CLASSES[status]}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: ExceptionSeverity }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${SEVERITY_CLASSES[severity]}`}>
      {severity}
    </span>
  )
}
