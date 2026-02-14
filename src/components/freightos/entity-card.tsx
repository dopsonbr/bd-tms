import { StatusBadge } from './status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'


interface DetailRow {
  label: string
  value: string
}

interface EntityCardProps {
  id: string
  title: string
  subtitle: string
  status: string
  details: Array<DetailRow>
  suggestion?: string
  onClick?: () => void
  action?: React.ReactNode
}

export function EntityCard({
  id,
  title,
  subtitle,
  status,
  details,
  suggestion,
  onClick,
  action,
}: EntityCardProps) {
  return (
    <Card
      className={cn(
        'freight-panel freight-stagger-item border-slate-200/70 bg-white/95 transition hover:border-sky-300/50 hover:shadow-md',
        onClick ? 'cursor-pointer' : ''
      )}
      onClick={onClick}
    >
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between gap-2'>
          <div>
            <p className='text-[11px] font-semibold tracking-wide text-slate-500 uppercase'>{id}</p>
            <CardTitle className='text-sm font-semibold text-slate-900'>{title}</CardTitle>
            <p className='text-xs text-slate-500'>{subtitle}</p>
          </div>
          <div className='flex items-center gap-2'>
            <StatusBadge status={status} />
            {action}
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-1.5 text-xs text-slate-600'>
        {details.map((item) => (
          <p key={`${id}-${item.label}`} className='flex items-center justify-between gap-3'>
            <span className='text-slate-500'>{item.label}</span>
            <span className='font-medium text-slate-800'>{item.value}</span>
          </p>
        ))}
        {suggestion ? (
          <div className='mt-2 rounded-lg border border-indigo-200/80 bg-indigo-50 px-2.5 py-2 text-[11px] text-indigo-700'>
            AI: {suggestion}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
