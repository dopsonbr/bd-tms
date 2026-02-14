'use client'

import { cn } from '@/lib/utils'

type Segment = 'active' | 'available' | 'completed'

interface SegmentControlProps {
  value: Segment
  onChange: (value: Segment) => void
}

const segments: Array<{ label: string; value: Segment }> = [
  { label: 'Active', value: 'active' },
  { label: 'Available', value: 'available' },
  { label: 'Completed', value: 'completed' },
]

export function SegmentControl({ value, onChange }: SegmentControlProps) {
  return (
    <div className="bg-muted p-1 rounded-full inline-flex">
      {segments.map((segment) => (
        <button
          key={segment.value}
          onClick={() => onChange(segment.value)}
          className={cn(
            'px-6 py-2 rounded-full text-sm font-medium transition-all',
            value === segment.value
              ? 'bg-freight-accent text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {segment.label}
        </button>
      ))}
    </div>
  )
}
