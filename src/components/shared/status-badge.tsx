'use client'

import type { LoadStatus, TruckStatus } from '@/data/types'
import { cn } from '@/lib/utils'
import {
  LOAD_STATUS_COLOR,
  LOAD_STATUS_LABEL,
  TRUCK_STATUS_COLOR,
} from '@/data/constants'

type StatusBadgeProps = {
  status: LoadStatus | TruckStatus
  type: 'load' | 'truck'
  className?: string
}

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const colorClass =
    type === 'load'
      ? LOAD_STATUS_COLOR[status as LoadStatus]
      : TRUCK_STATUS_COLOR[status as TruckStatus]

  const label =
    type === 'load'
      ? LOAD_STATUS_LABEL[status as LoadStatus]
      : status
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        colorClass,
        className,
      )}
      data-slot="status-badge"
    >
      {label}
    </span>
  )
}
