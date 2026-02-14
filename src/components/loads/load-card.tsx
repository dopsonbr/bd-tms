'use client'

import { ArrowRight, Minus, TrendingDown, TrendingUp } from 'lucide-react'
import type { Load } from '@/data/types'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'
import { AiSuggestionBanner } from '@/components/shared/ai-suggestion-banner'
import { useAppStore } from '@/store'
import { EQUIPMENT_LABEL, LOAD_STATUS_COLOR } from '@/data/constants'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

interface LoadCardProps {
  load: Load
  onClick?: () => void
}

export function LoadCard({ load, onClick }: LoadCardProps) {
  const trucks = useAppStore((state) => state.trucks)
  const drivers = useAppStore((state) => state.drivers)
  const exceptions = useAppStore((state) => state.exceptions)

  const truck = load.assignedTruckId ? trucks[load.assignedTruckId] : undefined

  const driver = truck && truck.driverId ? drivers[truck.driverId] : undefined

  const relatedExceptions = Object.values(exceptions).filter(
    (e) => e.loadId === load.id && e.aiSuggestion,
  )

  const statusColor = LOAD_STATUS_COLOR[load.status]
  const equipmentLabel = EQUIPMENT_LABEL[load.equipmentRequired]

  // Calculate margin percentage
  const cost = load.carrierCost ?? 0
  const marginPercent =
    load.marginPercent ?? ((load.rate - cost) / load.rate) * 100

  const getMarginColor = (percent: number) => {
    if (percent >= 15) return 'text-freight-success'
    if (percent >= 8) return 'text-freight-warning'
    return 'text-freight-critical'
  }

  const getMarginIcon = (percent: number) => {
    if (percent >= 15) return TrendingUp
    if (percent >= 8) return Minus
    return TrendingDown
  }

  const MarginIcon = getMarginIcon(marginPercent)

  return (
    <div className="space-y-2">
      <Card
        data-slot="card"
        onClick={onClick}
        className={cn(
          'cursor-pointer transition-all active:scale-[0.98]',
          'border-l-4',
        )}
        style={{ borderLeftColor: `var(--color-${statusColor})` }}
      >
        <CardContent className="p-4 space-y-2">
          {/* Row 1: Load ID + Equipment + Rate */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">#{load.id}</span>
            <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-md">
              {equipmentLabel}
            </span>
            <span className="ml-auto font-bold text-freight-navy">
              {formatCurrency(load.rate)}
            </span>
          </div>

          {/* Row 2: Route + Status + Margin */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{load.origin.city}</span>
            <ArrowRight className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
            <span className="font-medium flex-1 truncate">
              {load.destination.city}
            </span>
            <StatusBadge status={load.status} type="load" />
            <div
              className={cn(
                'flex items-center gap-1 font-medium',
                getMarginColor(marginPercent),
              )}
            >
              <MarginIcon className="w-3 h-3" />
              <span>{marginPercent.toFixed(0)}%</span>
            </div>
          </div>

          {/* Row 3: Driver + Truck */}
          {(driver || truck) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {driver && <span>{driver.name}</span>}
              {driver && truck && <span>&bull;</span>}
              {truck && <span>{truck.truckNumber}</span>}
            </div>
          )}

          {/* Row 4: Distance + Equipment */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-freight-accent font-medium">
              {load.distance} mi
            </span>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestion Banner */}
      {relatedExceptions.length > 0 && relatedExceptions[0].aiSuggestion && (
        <AiSuggestionBanner text={relatedExceptions[0].aiSuggestion} />
      )}
    </div>
  )
}
