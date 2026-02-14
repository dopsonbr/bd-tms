'use client'

import {
  AlertTriangle,
  Calendar,
  DollarSign,
  Package,
  Plus,
  Truck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type QuickAction = {
  id: string
  label: string
  icon: LucideIcon
  color: string
}

const QUICK_ACTIONS: Array<QuickAction> = [
  {
    id: 'new-load',
    label: 'New Load',
    icon: Plus,
    color: 'text-freight-accent',
  },
  {
    id: 'dispatch',
    label: 'Dispatch',
    icon: Truck,
    color: 'text-freight-navy',
  },
  {
    id: 'track',
    label: 'Track',
    icon: Package,
    color: 'text-freight-success',
  },
  {
    id: 'exceptions',
    label: 'Exceptions',
    icon: AlertTriangle,
    color: 'text-freight-warning',
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: Calendar,
    color: 'text-freight-accent',
  },
  {
    id: 'invoicing',
    label: 'Invoicing',
    icon: DollarSign,
    color: 'text-freight-success',
  },
]

type QuickActionsStripProps = {
  onAction?: (actionId: string) => void
}

export function QuickActionsStrip({ onAction }: QuickActionsStripProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {QUICK_ACTIONS.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.id}
            onClick={() => onAction?.(action.id)}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 active:bg-gray-100"
          >
            <Icon className={cn('h-4 w-4', action.color)} />
            <span className="text-gray-900">{action.label}</span>
          </button>
        )
      })}
    </div>
  )
}
