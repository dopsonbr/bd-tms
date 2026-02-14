import { useMemo, useState } from 'react'

import { BottomSheet } from './bottom-sheet'
import { useAppStore } from '@/state/app-store'

export function SearchOverlay() {
  const [query, setQuery] = useState('')
  const { state, dispatch } = useAppStore()

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) {
      return state.entities.loads.slice(0, 6)
    }
    return state.entities.loads.filter(
      (load) => load.reference.toLowerCase().includes(term) || load.destination.toLowerCase().includes(term),
    )
  }, [query, state.entities.loads])

  return (
    <BottomSheet
      open={state.ui.searchOpen}
      title="Global Search"
      onClose={() => dispatch({ type: 'toggle-search' })}
    >
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search load reference or destination"
        className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
      />
      <div className="mt-3 space-y-2">
        {results.slice(0, 8).map((load) => (
          <button
            key={load.id}
            type="button"
            onClick={() => {
              dispatch({ type: 'select-load', payload: load.id })
              dispatch({ type: 'toggle-search' })
            }}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-sm text-slate-200"
          >
            <div className="font-medium">{load.reference}</div>
            <div className="text-xs text-slate-400">
              {load.origin} {'->'} {load.destination}
            </div>
          </button>
        ))}
      </div>
    </BottomSheet>
  )
}
