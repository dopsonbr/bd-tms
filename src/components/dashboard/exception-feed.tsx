'use client'

import { ChevronRight } from 'lucide-react'
import { ExceptionCard } from './exception-card'
import { useAppStore } from '@/store'

type SectionHeaderProps = {
  title: string
  action?: {
    label: string
    onClick: () => void
  }
}

function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-1 text-sm font-medium text-freight-accent hover:text-freight-navy"
        >
          {action.label}
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

const SEVERITY_ORDER = {
  critical: 0,
  warning: 1,
  info: 2,
}

export function ExceptionFeed() {
  const { exceptions } = useAppStore()

  // Sort by severity (critical first), then by detectedAt (newest first)
  const sortedExceptions = [...Object.values(exceptions)]
    .filter((e) => e.status === 'active')
    .sort((a, b) => {
      const severityDiff =
        SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
      if (severityDiff !== 0) return severityDiff
      return new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    })

  // Take max 5
  const visibleExceptions = sortedExceptions.slice(0, 5)

  if (visibleExceptions.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <SectionHeader
        title="Exceptions"
        action={{
          label: 'View All',
          onClick: () => {
            // TODO: navigate to /exceptions when route is defined
          },
        }}
      />
      <div className="space-y-2">
        {visibleExceptions.map((exception) => (
          <ExceptionCard
            key={exception.id}
            exception={exception}
            onView={() => {
              // TODO: navigate to /exceptions/$exceptionId when route is defined
            }}
          />
        ))}
      </div>
    </div>
  )
}
