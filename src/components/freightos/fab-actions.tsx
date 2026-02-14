import { useState } from 'react'

import { useAppStore } from '@/state/app-store'

export function FabActions() {
  const [open, setOpen] = useState(false)
  const { dispatch } = useAppStore()

  return (
    <div className="fixed bottom-24 right-4 z-40 md:bottom-28 md:right-8">
      {open ? (
        <div className="mb-2 space-y-2">
          <button
            type="button"
            onClick={() => dispatch({ type: 'toggle-search' })}
            className="block w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-100"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'load-scenario', payload: 'D' })}
            className="block w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-100"
          >
            Run AI Plan
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'load-scenario', payload: 'E' })}
            className="block w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-100"
          >
            Run Voice Demo
          </button>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="h-12 w-12 rounded-full bg-cyan-500 text-xl font-bold text-slate-950 shadow-lg shadow-cyan-500/40"
      >
        {open ? 'x' : '+'}
      </button>
    </div>
  )
}
