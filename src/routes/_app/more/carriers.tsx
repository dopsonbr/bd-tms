'use client'

import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { ArrowLeft, Search, Truck } from 'lucide-react'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'
import { EQUIPMENT_LABEL } from '@/data/constants'

export const Route = createFileRoute('/_app/more/carriers')({
  component: CarriersScreen,
})

function CarriersScreen() {
  const carriers = useAppStore((s) => s.carriers)
  const [search, setSearch] = useState('')

  const carrierList = useMemo(() => {
    const all = Object.values(carriers)
    if (!search) return all
    return all.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.mcNumber.toLowerCase().includes(search.toLowerCase()),
    )
  }, [carriers, search])

  const statusColor = {
    active: 'bg-freight-success/10 text-freight-success',
    pending: 'bg-freight-warning/10 text-freight-warning',
    suspended: 'bg-freight-critical/10 text-freight-critical',
  }

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
          <h1 className="text-lg font-semibold">Carriers</h1>
          <span className="ml-auto text-xs text-muted-foreground">
            {carrierList.length} carriers
          </span>
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search carriers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-freight-accent/40"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4">
        {carrierList.map((carrier) => (
          <div
            key={carrier.id}
            className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-freight-accent/10">
                <Truck className="h-5 w-5 text-freight-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate">
                    {carrier.name}
                  </p>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      statusColor[carrier.status],
                    )}
                  >
                    {carrier.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  MC#{carrier.mcNumber} • DOT#{carrier.dotNumber} •{' '}
                  {carrier.fleetSize} trucks
                </p>

                {/* Scorecard */}
                <div className="mt-2 grid grid-cols-4 gap-1">
                  <div className="text-center">
                    <p className="text-xs font-bold">
                      {Math.round(carrier.scorecard.overallScore)}
                    </p>
                    <p className="text-[9px] text-muted-foreground">Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-freight-success">
                      {carrier.scorecard.onTimeDelivery.toFixed(0)}%
                    </p>
                    <p className="text-[9px] text-muted-foreground">On-Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold">
                      {Math.round(carrier.scorecard.totalLoads)}
                    </p>
                    <p className="text-[9px] text-muted-foreground">Loads</p>
                  </div>
                  <div className="text-center">
                    <p
                      className={cn(
                        'text-xs font-bold',
                        carrier.scorecard.claimsRatio < 2
                          ? 'text-freight-success'
                          : 'text-freight-critical',
                      )}
                    >
                      {carrier.scorecard.claimsRatio.toFixed(1)}%
                    </p>
                    <p className="text-[9px] text-muted-foreground">Claims</p>
                  </div>
                </div>

                {/* Equipment */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {carrier.equipmentTypes.map((eq) => (
                    <span
                      key={eq}
                      className="rounded bg-muted px-1.5 py-0.5 text-[10px]"
                    >
                      {EQUIPMENT_LABEL[eq]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
