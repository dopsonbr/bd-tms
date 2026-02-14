'use client'

import { AlertTriangle, Info, Sparkles } from 'lucide-react'
import { formatRelative } from 'date-fns'
import type { Exception } from '@/data/types'
import { cn } from '@/lib/utils'

type ExceptionCardProps = {
  exception: Exception
  onView?: () => void
}

const SEVERITY_COLORS = {
  critical: 'border-freight-critical',
  warning: 'border-freight-warning',
  info: 'border-freight-accent',
}

const SEVERITY_BG_COLORS = {
  critical: 'bg-freight-critical/10 text-freight-critical',
  warning: 'bg-freight-warning/10 text-freight-warning',
  info: 'bg-freight-accent/10 text-freight-accent',
}

function formatExceptionType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function ExceptionCard({ exception, onView }: ExceptionCardProps) {
  const Icon = exception.severity === 'info' ? Info : AlertTriangle

  const title = `${formatExceptionType(exception.type)}${
    exception.loadId ? ` • Load ${exception.loadId}` : ''
  }${exception.truckId ? ` • Truck ${exception.truckId}` : ''}`

  return (
    <div
      className={cn(
        'rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-200',
        'border-l-4',
        SEVERITY_COLORS[exception.severity],
      )}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
            SEVERITY_BG_COLORS[exception.severity],
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">
              {exception.description}
            </p>
          </div>

          {exception.aiSuggestion && (
            <div className="flex items-start gap-2 rounded-md bg-freight-ai/5 p-2">
              <Sparkles className="h-4 w-4 shrink-0 text-freight-ai" />
              <p className="text-xs text-gray-700">{exception.aiSuggestion}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {formatRelative(new Date(exception.detectedAt), new Date())}
            </span>
            <button
              onClick={onView}
              className="text-xs font-medium text-freight-accent hover:text-freight-navy"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
