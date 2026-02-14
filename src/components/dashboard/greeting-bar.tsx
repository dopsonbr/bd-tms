'use client'

import { Bell } from 'lucide-react'
import { format } from 'date-fns'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

export function GreetingBar() {
  const { trucks, exceptions, notifications, simulatedTime } = useAppStore()

  // Get time-based greeting
  const hour = new Date(simulatedTime).getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  // Count trucks en route
  const trucksRolling = Object.values(trucks).filter(
    (t) => t.status === 'en_route',
  ).length

  // Count active exceptions
  const activeExceptions = Object.values(exceptions).filter(
    (e) => e.status === 'active',
  ).length

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  // Format date
  const dateStr = format(new Date(simulatedTime), 'EEE MMM d')

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-gray-900">
          {greeting}, Dispatcher
        </h1>
        <p className="text-sm text-gray-600">{dateStr}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <div className="rounded-full bg-freight-accent/10 px-3 py-1 text-xs font-medium text-freight-accent">
            {trucksRolling} trucks rolling
          </div>
          <div
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium',
              activeExceptions > 0
                ? 'bg-freight-critical/10 text-freight-critical'
                : 'bg-gray-100 text-gray-600',
            )}
          >
            {activeExceptions} exceptions
          </div>
        </div>
      </div>
      <button
        className="relative rounded-full p-2 hover:bg-gray-100 active:bg-gray-200"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-freight-critical px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  )
}
