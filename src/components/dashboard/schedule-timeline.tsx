'use client'

import { addHours, format, isAfter, isBefore } from 'date-fns'
import { CheckCircle, ChevronRight, Circle } from 'lucide-react'
import { useAppStore } from '@/store'

type TimelineEvent = {
  id: string
  time: Date
  description: string
  relatedEntity: {
    type: 'load' | 'truck'
    id: string
    label: string
  }
  status: 'completed' | 'current' | 'upcoming'
}

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

export function ScheduleTimeline() {
  const { loads, simulatedTime } = useAppStore()

  const now = new Date(simulatedTime)
  const endTime = addHours(now, 12)

  // Generate events from loads
  const events: Array<TimelineEvent> = []

  Object.values(loads).forEach((load) => {
    const pickupTime = new Date(load.origin.appointmentWindow.start)
    const deliveryTime = new Date(load.destination.appointmentWindow.start)

    // Pickup event
    if (isAfter(pickupTime, now) && isBefore(pickupTime, endTime)) {
      const status = isBefore(pickupTime, now)
        ? 'completed'
        : isBefore(pickupTime, addHours(now, 1))
          ? 'current'
          : 'upcoming'

      events.push({
        id: `${load.id}-pickup`,
        time: pickupTime,
        description: `Pickup at ${load.origin.city}, ${load.origin.state}`,
        relatedEntity: {
          type: 'load',
          id: load.id,
          label: `Load ${load.id}`,
        },
        status,
      })
    }

    // Delivery event
    if (isAfter(deliveryTime, now) && isBefore(deliveryTime, endTime)) {
      const status = isBefore(deliveryTime, now)
        ? 'completed'
        : isBefore(deliveryTime, addHours(now, 1))
          ? 'current'
          : 'upcoming'

      events.push({
        id: `${load.id}-delivery`,
        time: deliveryTime,
        description: `Delivery at ${load.destination.city}, ${load.destination.state}`,
        relatedEntity: {
          type: 'load',
          id: load.id,
          label: `Load ${load.id}`,
        },
        status,
      })
    }
  })

  // Sort by time
  events.sort((a, b) => a.time.getTime() - b.time.getTime())

  if (events.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <SectionHeader title="Today's Schedule" />
      <div className="space-y-4">
        {events.map((event, index) => {
          const isLast = index === events.length - 1
          return (
            <div key={event.id} className="relative flex gap-3">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-3 top-6 h-full w-0.5 bg-gray-200" />
              )}

              {/* Status indicator */}
              <div className="relative z-10">
                {event.status === 'completed' ? (
                  <CheckCircle
                    className="h-6 w-6 text-freight-success"
                    fill="currentColor"
                  />
                ) : event.status === 'current' ? (
                  <div className="relative">
                    <Circle
                      className="h-6 w-6 text-freight-accent"
                      fill="currentColor"
                    />
                    <div className="absolute inset-0 animate-ping">
                      <Circle
                        className="h-6 w-6 text-freight-accent"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                ) : (
                  <Circle className="h-6 w-6 text-gray-300" strokeWidth={2} />
                )}
              </div>

              {/* Event content */}
              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {format(event.time, 'h:mm a')}
                    </p>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-freight-accent">
                    {event.relatedEntity.label}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
