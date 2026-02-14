import { useMemo } from 'react'
import type { Truck, TruckStatus } from '@/data/types'
import { useAppStore } from '@/store'

export function useFilteredTrucks(
  statusFilter: TruckStatus | 'all' = 'all',
  search = '',
): Array<Truck> {
  const trucks = useAppStore((s) => s.trucks)

  return useMemo(() => {
    let filtered = Object.values(trucks)

    if (statusFilter !== 'all') {
      filtered = filtered.filter((t) => t.status === statusFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.truckNumber.toLowerCase().includes(q) ||
          t.homeHub.toLowerCase().includes(q),
      )
    }

    return filtered.sort((a, b) => a.truckNumber.localeCompare(b.truckNumber))
  }, [trucks, statusFilter, search])
}
