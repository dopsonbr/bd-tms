'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

type MetricCardProps = {
  value: string | number
  label: string
  trend?: {
    direction: 'up' | 'down'
    value: string
  }
  trendPositive?: 'up' | 'down'
  onClick?: () => void
  className?: string
}

export function MetricCard({
  value,
  label,
  trend,
  trendPositive = 'up',
  onClick,
  className,
}: MetricCardProps) {
  const isTrendPositive = trend && trend.direction === trendPositive
  const Icon = trend?.direction === 'up' ? TrendingUp : TrendingDown

  return (
    <Card
      className={cn(
        'cursor-pointer transition-colors hover:bg-accent/50',
        onClick && 'active:scale-[0.98]',
        className,
      )}
      onClick={onClick}
      data-slot="metric-card"
    >
      <CardContent className="flex flex-col gap-1 p-4">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              isTrendPositive ? 'text-green-600' : 'text-red-600',
            )}
          >
            <Icon className="size-3" />
            <span>{trend.value}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
