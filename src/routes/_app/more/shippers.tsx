'use client'

import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Building2,
  DollarSign,
  Search,
  TrendingUp,
} from 'lucide-react'
import { useAppStore } from '@/store'

export const Route = createFileRoute('/_app/more/shippers')({
  component: ShippersScreen,
})

function ShippersScreen() {
  const shippers = useAppStore((s) => s.shippers)
  const [search, setSearch] = useState('')

  const shipperList = useMemo(() => {
    const all = Object.values(shippers)
    if (!search) return all
    return all.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.contactName.toLowerCase().includes(search.toLowerCase()),
    )
  }, [shippers, search])

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
          <h1 className="text-lg font-semibold">Shippers</h1>
          <span className="ml-auto text-xs text-muted-foreground">
            {shipperList.length} accounts
          </span>
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search shippers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-freight-accent/40"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4">
        {shipperList.map((shipper) => (
          <div
            key={shipper.id}
            className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-freight-accent/10">
                <Building2 className="h-5 w-5 text-freight-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{shipper.name}</p>
                <p className="text-xs text-muted-foreground">
                  {shipper.contactName} • {shipper.industry}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    {shipper.activeLoadCount} active
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <DollarSign className="h-3 w-3" />$
                    {shipper.averageRate.toLocaleString()}/load
                  </span>
                </div>
                {shipper.lanes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {shipper.lanes.slice(0, 3).map((lane) => (
                      <span
                        key={`${lane.origin}-${lane.destination}`}
                        className="rounded bg-muted px-1.5 py-0.5 text-[10px]"
                      >
                        {lane.origin} → {lane.destination}
                      </span>
                    ))}
                    {shipper.lanes.length > 3 && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        +{shipper.lanes.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
