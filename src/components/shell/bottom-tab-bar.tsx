'use client'

import { useMatches, useRouter } from '@tanstack/react-router'
import { LayoutDashboard, Menu, Package, Sparkles, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_TABS } from '@/data/constants'

const icons: Record<string, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  loads: Package,
  fleet: Truck,
  ai: Sparkles,
  more: Menu,
}

export function BottomTabBar() {
  const router = useRouter()
  const matches = useMatches()
  const currentPath = matches[matches.length - 1]?.pathname || '/'

  const handleTabClick = (path: string) => {
    router.navigate({ to: path })
  }

  return (
    <nav
      className="grid grid-cols-5 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]"
      style={{ height: 'var(--freight-tab-height)' }}
      role="navigation"
      aria-label="Main navigation"
    >
      {NAV_TABS.map((tab) => {
        const Icon = icons[tab.id]
        const isActive =
          tab.path === '/'
            ? currentPath === '/'
            : currentPath.startsWith(tab.path)

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.path)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 transition-colors',
              isActive ? 'text-freight-accent' : 'text-muted-foreground',
            )}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="size-5" />
            <span className="text-[11px] font-medium">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
