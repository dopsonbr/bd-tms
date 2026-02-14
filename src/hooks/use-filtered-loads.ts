import { useMemo } from 'react'
import type { Load, LoadStatus } from '@/data/types'
import { useAppStore } from '@/store'

export function useFilteredLoads(
  statusFilter: LoadStatus | 'all' = 'all',
  search = '',
): Array<Load> {
  const loads = useAppStore((s) => s.loads)

  return useMemo(() => {
    let filtered = Object.values(loads)

    if (statusFilter !== 'all') {
      filtered = filtered.filter((l) => l.status === statusFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (l) =>
          l.id.toLowerCase().includes(q) ||
          l.origin.city.toLowerCase().includes(q) ||
          l.destination.city.toLowerCase().includes(q) ||
          l.commodity.toLowerCase().includes(q),
      )
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  }, [loads, statusFilter, search])
}
