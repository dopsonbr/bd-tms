import { ArrowDownRightIcon, ArrowUpRightIcon, MinusIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type BenchmarkDirection = 'higher-is-better' | 'lower-is-better'
type BenchmarkBand = 'critical' | 'warning' | 'good' | 'excellent'

type MetricBenchmark = {
  label: string
  value: string
  actual?: number
  target?: number
  direction?: BenchmarkDirection
}

interface MetricCardProps {
  label: string
  sublabel?: string
  value: string
  trend?: number
  benchmark?: MetricBenchmark
  tone?: 'default' | 'success' | 'warning' | 'danger'
}

function formatTrendValue(trendValue: number): string {
  return `${Math.abs(trendValue)}%`
}

function clampTrend(trendValue: number): number {
  return Math.max(-100, Math.min(100, trendValue))
}

function formatBenchmarkDelta(normalizedPercent: number): string {
  if (Math.abs(normalizedPercent) < 0.5) {
    return 'On target'
  }

  const prefix = normalizedPercent > 0 ? '+' : ''

  return `${prefix}${Math.round(normalizedPercent)}% vs target`
}

function getBenchmarkTrend(
  actual: number,
  target: number,
  direction: BenchmarkDirection,
): number {
  if (target <= 0) {
    return 0
  }

  const deltaPercent = ((actual - target) / target) * 100

  return direction === 'lower-is-better' ? -deltaPercent : deltaPercent
}

function getBenchmarkBand(normalizedPercent: number): BenchmarkBand {
  if (normalizedPercent >= 20) {
    return 'excellent'
  }

  if (normalizedPercent >= 0) {
    return 'good'
  }

  if (normalizedPercent >= -8) {
    return 'warning'
  }

  return 'critical'
}

function getBandMeta(
  benchmark: MetricBenchmark | undefined,
): { band: BenchmarkBand; percent: number } | null {
  if (
    !benchmark ||
    typeof benchmark.actual !== 'number' ||
    typeof benchmark.target !== 'number' ||
    !benchmark.direction
  ) {
    return null
  }

  const percent = getBenchmarkTrend(
    benchmark.actual,
    benchmark.target,
    benchmark.direction,
  )

  return {
    band: getBenchmarkBand(percent),
    percent,
  }
}

function getBandClassName(band: BenchmarkBand): string {
  if (band === 'excellent') {
    return 'freight-benchmark-chip-excellent'
  }

  if (band === 'good') {
    return 'freight-benchmark-chip-good'
  }

  if (band === 'warning') {
    return 'freight-benchmark-chip-warning'
  }

  return 'freight-benchmark-chip-critical'
}

function getBandLabel(band: BenchmarkBand): string {
  if (band === 'excellent') {
    return 'Excellent'
  }

  if (band === 'good') {
    return 'Good'
  }

  if (band === 'warning') {
    return 'Warning'
  }

  return 'Critical'
}

function getTrendTone(
  trendValue: number | null,
  benchmark: MetricBenchmark | undefined,
  tone: MetricCardProps['tone'],
): string {
  if (trendValue == null || trendValue === 0) {
    return 'text-muted-foreground'
  }

  const usesBenchmarkDirection =
    benchmark != null &&
    benchmark.actual != null &&
    benchmark.target != null &&
    benchmark.direction != null

  if (usesBenchmarkDirection) {
    const direction = benchmark.direction === 'higher-is-better'
    const isGood = direction ? trendValue > 0 : trendValue < 0
    return isGood ? 'text-emerald-600' : 'text-rose-600'
  }

  if (tone === 'warning') {
    return trendValue > 0 ? 'text-amber-600' : 'text-rose-600'
  }

  if (tone === 'danger') {
    return trendValue > 0 ? 'text-rose-600' : 'text-emerald-600'
  }

  if (tone === 'success') {
    return trendValue > 0 ? 'text-emerald-600' : 'text-rose-600'
  }

  return trendValue > 0 ? 'text-emerald-600' : 'text-rose-600'
}

export function MetricCard({
  label,
  sublabel,
  value,
  trend,
  benchmark,
  tone = 'default',
}: MetricCardProps) {
  const bandMeta = getBandMeta(benchmark)
  const resolvedTrend = trend ?? bandMeta?.percent
  const trendTone = getTrendTone(resolvedTrend ?? null, benchmark, tone)

  return (
    <Card className="freight-panel freight-stagger-item">
      <CardHeader className="pb-0">
        <CardTitle className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-end justify-between gap-2">
          <p className="text-xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
          <p
            className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold',
              trendTone,
            )}
          >
            {resolvedTrend == null ? (
              <MinusIcon className="size-3.5" />
            ) : resolvedTrend > 0 ? (
              <ArrowUpRightIcon className="size-3.5" />
            ) : resolvedTrend < 0 ? (
              <ArrowDownRightIcon className="size-3.5" />
            ) : (
              <MinusIcon className="size-3.5" />
            )}
            {resolvedTrend == null
              ? 'n/a'
              : formatTrendValue(clampTrend(resolvedTrend))}
          </p>
        </div>
        {sublabel ? (
          <p className="mt-0.5 text-[11px] text-slate-600">{sublabel}</p>
        ) : null}
        {benchmark ? (
          <div className="mt-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] text-slate-500">{`${benchmark.label}: ${benchmark.value}`}</p>
              {bandMeta ? (
                <span
                  className={cn(
                    'freight-benchmark-chip',
                    getBandClassName(bandMeta.band),
                  )}
                >
                  {getBandLabel(bandMeta.band)}
                </span>
              ) : null}
            </div>
            {bandMeta ? (
              <p className="text-[10px] text-slate-500">
                {formatBenchmarkDelta(bandMeta.percent)}
              </p>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
