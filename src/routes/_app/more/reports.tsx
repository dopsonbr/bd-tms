'use client'

import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  DollarSign,
  Package,
  TrendingUp,
  Truck,
} from 'lucide-react'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/more/reports')({
  component: ReportsScreen,
})

function ReportsScreen() {
  const loads = useAppStore((s) => s.loads)
  const trucks = useAppStore((s) => s.trucks)
  const drivers = useAppStore((s) => s.drivers)
  const exceptions = useAppStore((s) => s.exceptions)

  const metrics = useMemo(() => {
    const allLoads = Object.values(loads)
    const allTrucks = Object.values(trucks)
    const allDrivers = Object.values(drivers)
    const allExceptions = Object.values(exceptions)

    const delivered = allLoads.filter(
      (l) =>
        l.status === 'delivered' ||
        l.status === 'invoiced' ||
        l.status === 'paid',
    )
    const inTransit = allLoads.filter(
      (l) => l.status === 'in_transit' || l.status === 'en_route_pickup',
    )
    const totalRevenue = allLoads.reduce((sum, l) => sum + l.totalRevenue, 0)
    const avgMargin =
      delivered.length > 0
        ? delivered.reduce((sum, l) => sum + (l.marginPercent ?? 0), 0) /
          delivered.length
        : 0

    const emptyTrucks = allTrucks.filter((t) => t.status === 'empty').length
    const activeTrucks = allTrucks.filter(
      (t) =>
        t.status === 'en_route' ||
        t.status === 'at_pickup' ||
        t.status === 'at_delivery',
    ).length
    const activeDrivers = allDrivers.filter((d) => d.status === 'active').length
    const activeExceptions = allExceptions.filter(
      (e) => e.status === 'active',
    ).length

    const avgRatePerMile =
      allLoads.length > 0
        ? allLoads.reduce((sum, l) => sum + l.ratePerMile, 0) / allLoads.length
        : 0

    return {
      totalLoads: allLoads.length,
      delivered: delivered.length,
      inTransit: inTransit.length,
      totalRevenue,
      avgMargin,
      emptyTrucks,
      activeTrucks,
      totalTrucks: allTrucks.length,
      activeDrivers,
      totalDrivers: allDrivers.length,
      activeExceptions,
      avgRatePerMile,
    }
  }, [loads, trucks, drivers, exceptions])

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
          <h1 className="text-lg font-semibold">Reports & Analytics</h1>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4">
        {/* Revenue Overview */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Revenue Overview
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              icon={DollarSign}
              label="Total Revenue"
              value={`$${(metrics.totalRevenue / 1000).toFixed(0)}K`}
              color="text-freight-success"
            />
            <MetricCard
              icon={TrendingUp}
              label="Avg Margin"
              value={`${metrics.avgMargin.toFixed(1)}%`}
              color={
                metrics.avgMargin >= 15
                  ? 'text-freight-success'
                  : 'text-freight-warning'
              }
            />
            <MetricCard
              icon={DollarSign}
              label="Avg Rate/Mile"
              value={`$${metrics.avgRatePerMile.toFixed(2)}`}
              color="text-freight-accent"
            />
            <MetricCard
              icon={Package}
              label="Total Loads"
              value={String(metrics.totalLoads)}
              color="text-foreground"
            />
          </div>
        </div>

        {/* Operations Summary */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Operations
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              icon={Package}
              label="Delivered"
              value={String(metrics.delivered)}
              color="text-freight-success"
            />
            <MetricCard
              icon={Truck}
              label="In Transit"
              value={String(metrics.inTransit)}
              color="text-freight-accent"
            />
            <MetricCard
              icon={Truck}
              label="Active Trucks"
              value={`${metrics.activeTrucks}/${metrics.totalTrucks}`}
              color="text-freight-accent"
            />
            <MetricCard
              icon={Truck}
              label="Empty Trucks"
              value={String(metrics.emptyTrucks)}
              color="text-freight-idle"
            />
          </div>
        </div>

        {/* Fleet Health */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Fleet Health
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              icon={CheckCircle}
              label="Active Drivers"
              value={`${metrics.activeDrivers}/${metrics.totalDrivers}`}
              color="text-freight-success"
            />
            <MetricCard
              icon={AlertTriangle}
              label="Active Exceptions"
              value={String(metrics.activeExceptions)}
              color={
                metrics.activeExceptions > 0
                  ? 'text-freight-critical'
                  : 'text-freight-success'
              }
            />
          </div>
        </div>

        {/* Utilization bar */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Fleet Utilization
          </h3>
          <div className="space-y-3">
            <UtilBar
              label="Truck Utilization"
              value={metrics.activeTrucks}
              total={metrics.totalTrucks}
            />
            <UtilBar
              label="Driver Utilization"
              value={metrics.activeDrivers}
              total={metrics.totalDrivers}
            />
          </div>
        </div>

        {/* Top Lanes placeholder */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Top Performing Lanes
          </h3>
          <div className="space-y-2">
            {[
              'ATL → MEM',
              'NSH → CLT',
              'JAX → ATL',
              'BHM → NSH',
              'CLT → JAX',
            ].map((lane, i) => (
              <div
                key={lane}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-freight-accent/10 text-[10px] font-bold text-freight-accent">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium">{lane}</span>
                </div>
                <span
                  className={cn(
                    'text-xs font-semibold',
                    i < 2 ? 'text-freight-success' : 'text-muted-foreground',
                  )}
                >
                  {(95 - i * 7).toFixed(0)}% on-time
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className={cn('h-5 w-5', color)} />
      </div>
      <div>
        <p className={cn('text-lg font-bold', color)}>{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function UtilBar({
  label,
  value,
  total,
}: {
  label: string
  value: number
  total: number
}) {
  const pct = total > 0 ? (value / total) * 100 : 0
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {value}/{total} ({pct.toFixed(0)}%)
        </span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full',
            pct > 70
              ? 'bg-freight-success'
              : pct > 40
                ? 'bg-freight-warning'
                : 'bg-freight-critical',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
