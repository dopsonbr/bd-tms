import { AlertTriangleIcon, CheckCircle2Icon, CircleIcon, TruckIcon, WrenchIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const statusTone: Record<string, string> = {
  available: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  tendered: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  en_route: 'border-sky-200 bg-sky-50 text-sky-700',
  loading: 'border-amber-200 bg-amber-50 text-amber-700',
  maintenance: 'border-zinc-300 bg-zinc-100 text-zinc-700',
  rest: 'border-violet-200 bg-violet-50 text-violet-700',
  pending_dispatch: 'border-orange-200 bg-orange-50 text-orange-700',
  at_pickup: 'border-amber-200 bg-amber-50 text-amber-700',
  in_transit: 'border-sky-200 bg-sky-50 text-sky-700',
  at_delivery: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  delivered: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  invoiced: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  off_duty: 'border-zinc-200 bg-zinc-100 text-zinc-500',
  critical: 'border-red-200 bg-red-50 text-red-700',
  warning: 'border-orange-200 bg-orange-50 text-orange-700',
  info: 'border-sky-200 bg-sky-50 text-sky-700',
}

const statusIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  available: CheckCircle2Icon,
  en_route: TruckIcon,
  loading: CircleIcon,
  maintenance: WrenchIcon,
  rest: CircleIcon,
  pending_dispatch: AlertTriangleIcon,
  at_pickup: CircleIcon,
  in_transit: TruckIcon,
  at_delivery: CircleIcon,
  delivered: CheckCircle2Icon,
  invoiced: CheckCircle2Icon,
  critical: AlertTriangleIcon,
  warning: AlertTriangleIcon,
  info: CircleIcon,
}

function toLabel(status: string): string {
  return status.replace(/_/g, ' ')
}

export function StatusBadge({ status, label, className }: { status: string; label?: string; className?: string }) {
  const normalized = status.toLowerCase()
  const Icon = statusIcon[normalized] ?? CircleIcon
  const tone = statusTone[normalized] ?? 'border-slate-200 bg-slate-50 text-slate-700'

  return (
    <Badge
      variant='outline'
      className={cn('gap-1 border px-2 py-0.5 text-[11px] font-semibold capitalize', tone, className)}
    >
      <Icon className='size-3' />
      {label ?? toLabel(normalized)}
    </Badge>
  )
}
