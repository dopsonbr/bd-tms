
import { NotificationCenter } from './notification-center'
import { SearchOverlay } from './search-overlay'
import { TabBar } from './tab-bar'
import { FabActions } from './fab-actions'
import type { ReactNode } from 'react'
import { useAppStore } from '@/state/app-store'

export function AppShell({ children }: { children: ReactNode }) {
  const { state, dispatch } = useAppStore()

  return (
    <div className="min-h-screen bg-app pb-24 text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">FreightOS</p>
            <h1 className="text-sm font-semibold">Scenario {state.sim.scenarioId}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-200"
              onClick={() => dispatch({ type: 'toggle-search' })}
            >
              Search
            </button>
            <button
              type="button"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-200"
              onClick={() => dispatch({ type: 'toggle-notifications' })}
            >
              Alerts
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-4">{children}</main>

      <SearchOverlay />
      <NotificationCenter />
      <FabActions />
      <TabBar />
    </div>
  )
}
