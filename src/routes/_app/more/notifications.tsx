'use client'

import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Bell, CheckCheck, Trash2 } from 'lucide-react'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/more/notifications')({
  component: NotificationsScreen,
})

function NotificationsScreen() {
  const notifications = useAppStore((s) => s.notifications)
  const markNotificationRead = useAppStore((s) => s.markNotificationRead)
  const clearNotifications = useAppStore((s) => s.clearNotifications)

  const unread = notifications.filter((n) => !n.read).length

  const priorityStyle = {
    urgent: 'border-l-freight-critical',
    info: 'border-l-freight-accent',
    success: 'border-l-freight-success',
  }

  const priorityIcon = {
    urgent: 'bg-freight-critical/10 text-freight-critical',
    info: 'bg-freight-accent/10 text-freight-accent',
    success: 'bg-freight-success/10 text-freight-success',
  }

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="sticky top-0 z-10 bg-freight-bg px-4 pb-2 pt-4">
        <div className="flex items-center gap-3">
          <Link
            to="/more"
            className="rounded-full p-1.5 hover:bg-muted active:bg-muted/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold">Notifications</h1>
          <span className="ml-auto text-xs text-muted-foreground">
            {unread} unread
          </span>
        </div>
        {notifications.length > 0 && (
          <div className="mt-2 flex gap-2">
            <button
              onClick={() =>
                notifications.forEach(
                  (n) => !n.read && markNotificationRead(n.id),
                )
              }
              className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/80"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
            <button
              onClick={clearNotifications}
              className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-freight-critical hover:bg-freight-critical/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 px-4">
        {notifications.length === 0 && (
          <div className="py-12 text-center">
            <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              No notifications
            </p>
          </div>
        )}

        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => !n.read && markNotificationRead(n.id)}
            className={cn(
              'rounded-xl border-l-4 bg-white p-4 text-left shadow-sm ring-1 ring-border transition-colors',
              priorityStyle[n.priority],
              !n.read && 'bg-freight-accent/5',
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  priorityIcon[n.priority],
                )}
              >
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      !n.read && 'font-semibold',
                    )}
                  >
                    {n.title}
                  </p>
                  {!n.read && (
                    <div className="h-2 w-2 rounded-full bg-freight-accent" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                  {n.body}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {new Date(n.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
