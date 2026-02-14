'use client'

import {
  AlertTriangle,
  DollarSign,
  Package,
  TrendingDown,
  TrendingUp,
  Truck,
} from 'lucide-react'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

type MetricCardProps = {
  label: string
  value: string
  icon: React.ReactNode
  trend?: {
    direction: 'up' | 'down'
    value: string
  }
  onClick?: () => void
}

function MetricCard({ label, value, icon, trend, onClick }: MetricCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-2 rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 active:bg-gray-100"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <div className="text-freight-accent">{icon}</div>
      </div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      {trend && (
        <div className="flex items-center gap-1">
          {trend.direction === 'up' ? (
            <TrendingUp className="h-3 w-3 text-freight-success" />
          ) : (
            <TrendingDown className="h-3 w-3 text-freight-critical" />
          )}
          <span
            className={cn(
              'text-xs font-medium',
              trend.direction === 'up'
                ? 'text-freight-success'
                : 'text-freight-critical',
            )}
          >
            {trend.value}
          </span>
        </div>
      )}
    </button>
  )
}

export function KpiGrid() {
  const { loads, trucks, exceptions } = useAppStore()

  // Active Loads: not delivered/invoiced/cancelled
  const activeLoads = Object.values(loads).filter(
    (l) => !['delivered', 'invoiced', 'cancelled'].includes(l.status),
  ).length

  // Available Trucks: status = 'empty'
  const availableTrucks = Object.values(trucks).filter(
    (t) => t.status === 'empty',
  ).length

  // Today's Revenue: sum of totalRevenue for delivered loads
  const todaysRevenue = Object.values(loads)
    .filter((l) => l.status === 'delivered')
    .reduce((sum, load) => sum + load.totalRevenue, 0)
  const revenueFormatted = `$${(todaysRevenue / 1000).toFixed(1)}K`

  // Active Exceptions
  const activeExceptions = Object.values(exceptions).filter(
    (e) => e.status === 'active',
  ).length

  return (
    <div className="grid grid-cols-2 gap-3">
      <MetricCard
        label="Active Loads"
        value={activeLoads.toString()}
        icon={<Package className="h-5 w-5" />}
        trend={{ direction: 'up', value: '+12%' }}
      />
      <MetricCard
        label="Available Trucks"
        value={availableTrucks.toString()}
        icon={<Truck className="h-5 w-5" />}
        trend={{ direction: 'down', value: '-3%' }}
      />
      <MetricCard
        label="Today's Revenue"
        value={revenueFormatted}
        icon={<DollarSign className="h-5 w-5" />}
        trend={{ direction: 'up', value: '+8%' }}
      />
      <MetricCard
        label="Exceptions"
        value={activeExceptions.toString()}
        icon={<AlertTriangle className="h-5 w-5" />}
        trend={
          activeExceptions > 0 ? { direction: 'up', value: '+2' } : undefined
        }
      />
    </div>
  )
}
