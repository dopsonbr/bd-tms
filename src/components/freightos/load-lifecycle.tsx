import type { LoadStatus } from '@/domain/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const loadLifecycleOrder: Array<LoadStatus> = [
  'tendered',
  'pending_dispatch',
  'dispatched',
  'at_pickup',
  'in_transit',
  'at_delivery',
  'delivered',
  'invoiced',
]

export const lifecycleIndexByStatus: Record<LoadStatus, number> = {
  tendered: 0,
  pending_dispatch: 1,
  dispatched: 2,
  at_pickup: 3,
  in_transit: 4,
  at_delivery: 5,
  delivered: 6,
  invoiced: 7,
}

export function getLifecycleLabel(status: LoadStatus): string {
  return status.replace(/_/g, ' ')
}

function labelize(status: LoadStatus): string {
  return getLifecycleLabel(status)
}

export function LoadLifecycle({ status, onAdvance, canAdvance = true }: { status: LoadStatus; onAdvance?: () => void; canAdvance?: boolean }) {
  const activeIndex = lifecycleIndexByStatus[status]
  const actionLabel =
    status === 'pending_dispatch'
      ? 'Queue for dispatch'
      : status === 'dispatched'
        ? 'Confirm pickup complete'
        : status === 'at_pickup'
          ? 'Depart'
          : status === 'in_transit'
            ? 'Confirm delivery arrival'
            : status === 'at_delivery'
              ? 'Mark delivered'
              : status === 'delivered'
                ? 'Generate invoice'
                : 'Advance stage'

  return (
    <div className='overflow-x-auto pb-1'>
      <div className='flex min-w-max items-start gap-2'>
        {loadLifecycleOrder.map((step, index) => {
          const isComplete = index < activeIndex
          const isActive = index === activeIndex

          return (
            <div key={step} className='flex items-center gap-2'>
              <div className='flex flex-col items-center gap-1'>
                <span
                  className={cn(
                    'h-2.5 w-2.5 rounded-full border',
                    isComplete && 'border-emerald-600 bg-emerald-500',
                    isActive && 'border-sky-600 bg-sky-500 ring-2 ring-sky-200',
                    !isComplete && !isActive && 'border-slate-300 bg-slate-200'
                  )}
                />
                <span
                  className={cn(
                    'max-w-[90px] text-center text-[10px] font-medium capitalize',
                    isActive ? 'text-sky-700' : isComplete ? 'text-emerald-700' : 'text-slate-500'
                  )}
                >
                  {labelize(step)}
                </span>
              </div>
              {index < loadLifecycleOrder.length - 1 ? (
                <span className={cn('mb-4 h-px w-6', isComplete ? 'bg-emerald-400' : 'bg-slate-300')} />
              ) : null}
            </div>
          )
        })}
      </div>
      {onAdvance ? (
        <Button
          size='sm'
          variant='outline'
          className='mt-3'
          onClick={onAdvance}
          disabled={!canAdvance}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
