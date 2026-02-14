'use client'

import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Check, Package, Sparkles, Truck, X } from 'lucide-react'
import { useEffect } from 'react'
import { useAppStore } from '@/store'
import { generateRecommendations } from '@/lib/dispatch-engine'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/more/dispatch')({
  component: DispatchScreen,
})

function DispatchScreen() {
  const recommendations = useAppStore((s) => s.recommendations)
  const setRecommendations = useAppStore((s) => s.setRecommendations)
  const acceptRecommendation = useAppStore((s) => s.acceptRecommendation)
  const rejectRecommendation = useAppStore((s) => s.rejectRecommendation)
  const loads = useAppStore((s) => s.loads)
  const trucks = useAppStore((s) => s.trucks)
  const drivers = useAppStore((s) => s.drivers)

  useEffect(() => {
    if (recommendations.length === 0) {
      const recs = generateRecommendations()
      setRecommendations(recs)
    }
  }, [])

  const pendingRecs = recommendations.filter((r) => r.status === 'pending')
  const acceptedRecs = recommendations.filter((r) => r.status === 'accepted')

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
          <h1 className="text-lg font-semibold">AI Dispatch Board</h1>
        </div>
        <p className="ml-10 text-xs text-muted-foreground">
          {pendingRecs.length} recommendations • {acceptedRecs.length} accepted
        </p>
      </div>

      <div className="flex flex-col gap-3 px-4">
        {/* Generate button */}
        <button
          onClick={() => {
            const recs = generateRecommendations()
            setRecommendations(recs)
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-freight-ai/10 py-3 text-sm font-semibold text-freight-ai transition-colors hover:bg-freight-ai/20"
        >
          <Sparkles className="h-4 w-4" />
          Refresh Recommendations
        </button>

        {pendingRecs.length === 0 && (
          <div className="py-8 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              No pending recommendations. All loads are assigned or no matches
              found.
            </p>
          </div>
        )}

        {pendingRecs.map((rec) => {
          const load = loads[rec.loadId]
          const truck = trucks[rec.truckId]
          const driver = drivers[rec.driverId]

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (!load || !truck || !driver) return null

          return (
            <div
              key={rec.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-border"
            >
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-semibold',
                        rec.confidence === 'high'
                          ? 'bg-freight-success/10 text-freight-success'
                          : rec.confidence === 'medium'
                            ? 'bg-freight-warning/10 text-freight-warning'
                            : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {rec.score}% match
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {rec.confidence} confidence
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-freight-accent" />
                    <span className="text-sm font-medium">{load.id}</span>
                    <span className="text-xs text-muted-foreground">
                      {load.origin.city} → {load.destination.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-freight-accent" />
                    <span className="text-sm">{truck.truckNumber}</span>
                    <span className="text-xs text-muted-foreground">
                      • {driver.name}
                    </span>
                  </div>
                </div>

                {/* Factors */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {rec.factors.map((f) => (
                    <span
                      key={f.name}
                      className={cn(
                        'rounded-md px-2 py-0.5 text-[10px]',
                        f.score >= 70
                          ? 'bg-freight-success/10 text-freight-success'
                          : f.score >= 40
                            ? 'bg-freight-warning/10 text-freight-warning'
                            : 'bg-freight-critical/10 text-freight-critical',
                      )}
                    >
                      {f.name.replace('_', ' ')}: {f.value}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex border-t border-border">
                <button
                  onClick={() => rejectRecommendation(rec.id)}
                  className="flex flex-1 items-center justify-center gap-1.5 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                  Reject
                </button>
                <div className="w-px bg-border" />
                <button
                  onClick={() => acceptRecommendation(rec.id)}
                  className="flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-semibold text-freight-success transition-colors hover:bg-freight-success/5"
                >
                  <Check className="h-4 w-4" />
                  Accept
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
