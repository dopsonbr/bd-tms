'use client'

import { Link, createFileRoute } from '@tanstack/react-router'
import {
  BarChart3,
  Bell,
  Building2,
  ChevronRight,
  Phone,
  Play,
  RefreshCw,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/more/')({
  component: MoreScreen,
})

type MenuItem = {
  icon: React.ReactNode
  label: string
  description: string
  to: string
  badge?: string
}

function MenuSection({
  title,
  items,
}: {
  title: string
  items: Array<MenuItem>
}) {
  return (
    <div>
      <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-border">
        {items.map((item, i) => (
          <Link
            key={item.label}
            to={item.to}
            className={cn(
              'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 active:bg-muted',
              i > 0 && 'border-t border-border',
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
            {item.badge && (
              <span className="rounded-full bg-freight-critical px-2 py-0.5 text-[10px] font-semibold text-white">
                {item.badge}
              </span>
            )}
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  )
}

function MoreScreen() {
  const notifications = useAppStore((s) => s.notifications)
  const resetStore = useAppStore((s) => s.resetStore)
  const isPlaying = useAppStore((s) => s.isPlaying)
  const setPlaying = useAppStore((s) => s.setPlaying)
  const playbackSpeed = useAppStore((s) => s.playbackSpeed)
  const setPlaybackSpeed = useAppStore((s) => s.setPlaybackSpeed)

  const unread = notifications.filter((n) => !n.read).length

  const operationsItems: Array<MenuItem> = [
    {
      icon: <BarChart3 className="h-5 w-5 text-freight-accent" />,
      label: 'Dispatch Board',
      description: 'AI recommendations',
      to: '/more/dispatch',
    },
    {
      icon: <Users className="h-5 w-5 text-freight-accent" />,
      label: 'Drivers',
      description: '30 active drivers',
      to: '/more/drivers',
    },
    {
      icon: <Phone className="h-5 w-5 text-freight-success" />,
      label: 'Voice Agent',
      description: 'AI voice call demo',
      to: '/more/voice',
    },
    {
      icon: <Bell className="h-5 w-5 text-freight-warning" />,
      label: 'Notifications',
      description: 'Alerts & updates',
      to: '/more/notifications',
      badge: unread > 0 ? String(unread) : undefined,
    },
  ]

  const directoryItems: Array<MenuItem> = [
    {
      icon: <Building2 className="h-5 w-5 text-freight-accent" />,
      label: 'Shippers',
      description: '15 active accounts',
      to: '/more/shippers',
    },
    {
      icon: <Truck className="h-5 w-5 text-freight-accent" />,
      label: 'Carriers',
      description: '25 partner carriers',
      to: '/more/carriers',
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-freight-accent" />,
      label: 'Reports & Analytics',
      description: 'KPIs, lanes, financials',
      to: '/more/reports',
    },
  ]

  return (
    <div className="flex flex-col gap-4 p-4 pb-2">
      <h1 className="text-xl font-semibold">More</h1>

      <MenuSection title="Operations" items={operationsItems} />
      <MenuSection title="Directory" items={directoryItems} />

      {/* Demo Controls */}
      <div>
        <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Demo Controls
        </h3>
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-border">
          {/* Play/Pause */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-freight-ai/10">
                <Play className="h-5 w-5 text-freight-ai" />
              </div>
              <div>
                <p className="text-sm font-medium">Time Simulation</p>
                <p className="text-xs text-muted-foreground">
                  {isPlaying ? `Playing at ${playbackSpeed}x` : 'Paused'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setPlaying(!isPlaying)}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-semibold',
                isPlaying
                  ? 'bg-freight-critical/10 text-freight-critical'
                  : 'bg-freight-success/10 text-freight-success',
              )}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>

          {/* Speed control */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <span className="text-sm text-muted-foreground">Speed</span>
            <div className="flex gap-1">
              {[1, 5, 15, 60].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={cn(
                    'rounded-md px-3 py-1 text-xs font-medium',
                    playbackSpeed === speed
                      ? 'bg-freight-accent text-white'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={resetStore}
            className="flex w-full items-center gap-3 border-t border-border px-4 py-3 text-left hover:bg-muted/50 active:bg-muted"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-freight-critical/10">
              <RefreshCw className="h-5 w-5 text-freight-critical" />
            </div>
            <div>
              <p className="text-sm font-medium text-freight-critical">
                Reset Demo
              </p>
              <p className="text-xs text-muted-foreground">
                Regenerate all seed data
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Version */}
      <p className="pb-4 text-center text-xs text-muted-foreground">
        FreightOS v0.1.0 — AI-Powered TMS Prototype
      </p>
    </div>
  )
}
