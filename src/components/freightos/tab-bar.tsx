import { Link, useRouterState } from '@tanstack/react-router'

const TABS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/loads', label: 'Loads' },
  { to: '/fleet', label: 'Fleet' },
  { to: '/ai-agent', label: 'AI Agent' },
  { to: '/more', label: 'More' },
] as const

export function TabBar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/90 px-2 py-2 backdrop-blur md:left-auto md:right-6 md:bottom-6 md:w-[540px] md:rounded-2xl md:border">
      <ul className="grid grid-cols-5 gap-1">
        {TABS.map((tab) => {
          const active = pathname === tab.to || pathname.startsWith(`${tab.to}/`)
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                className={`flex items-center justify-center rounded-xl px-2 py-2 text-xs font-medium transition ${
                  active ? 'bg-cyan-500/20 text-cyan-100' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
