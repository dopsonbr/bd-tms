import {
  BotIcon,
  ChartNoAxesColumnIcon,
  LayoutDashboardIcon,
  MapPinnedIcon,
  PackageIcon,
} from 'lucide-react'
import { Link, useRouterState } from '@tanstack/react-router'

import { cn } from '@/lib/utils'

const tabs = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboardIcon },
  { to: '/loads', label: 'Loads', icon: PackageIcon },
  { to: '/fleet', label: 'Fleet', icon: MapPinnedIcon },
  { to: '/ai-agent', label: 'AI Agent', icon: BotIcon },
  { to: '/more', label: 'More', icon: ChartNoAxesColumnIcon },
]

export function TabBar() {
  const pathname = useRouterState({
    select: (routerState) => routerState.location.pathname,
  })

  return (
    <nav className='fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 backdrop-blur'>
      <div className='mx-auto grid max-w-[1024px] grid-cols-5'>
        {tabs.map((tab) => {
          const active = tab.to === '/' ? pathname === '/' : pathname.startsWith(tab.to)
          const Icon = tab.icon

          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                active ? 'text-sky-700' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              <Icon className={cn('size-4', active ? 'text-sky-600' : 'text-slate-400')} />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
