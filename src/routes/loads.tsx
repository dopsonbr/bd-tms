'use client'

import * as React from 'react'

import { createFileRoute } from '@tanstack/react-router'

import type { Driver, Load, Truck } from '@/domain/types'
import { AppShell } from '@/components/freightos/app-shell'
import { LoadCard } from '@/components/freightos/load-card'
import {
  LoadLifecycle,
  getLifecycleLabel,
  loadLifecycleOrder,
} from '@/components/freightos/load-lifecycle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/state/app-store'

export const Route = createFileRoute('/loads')({
  component: LoadsPage,
})

type SegmentId = 'active' | 'available' | 'completed'

function filterBySegment(loads: Array<Load>, segment: SegmentId): Array<Load> {
  if (segment === 'available') {
    return loads.filter((load) =>
      ['tendered', 'pending_dispatch'].includes(load.status),
    )
  }

  if (segment === 'completed') {
    return loads.filter((load) =>
      ['delivered', 'invoiced'].includes(load.status),
    )
  }

  return loads.filter((load) =>
    ['dispatched', 'at_pickup', 'in_transit', 'at_delivery'].includes(
      load.status,
    ),
  )
}

function getRecommendedTruckId(
  load: Load,
  allTrucks: Array<Truck>,
): string | undefined {
  const compatible = allTrucks.find(
    (truck) =>
      truck.status === 'available' && truck.equipment === load.equipment,
  )

  if (compatible) {
    return compatible.id
  }

  return allTrucks.find((truck) => truck.status === 'available')?.id
}

function buildLifecycleBlockers(
  status: Load['status'],
  loadTruckId: string | undefined,
  loadDriverId: string | undefined,
  loadEquipment: Load['equipment'],
  trucks: Array<Truck>,
  drivers: Array<Driver>,
): Array<string> {
  const blockers: Array<string> = []
  const assignedTruck = trucks.find((truck) => truck.id === loadTruckId)
  const assignedDriver = drivers.find((driver) => driver.id === loadDriverId)

  if (status === 'pending_dispatch') {
    const compatibleTrucks = trucks.filter(
      (truck) =>
        truck.status === 'available' && truck.equipment === loadEquipment,
    )
    if (compatibleTrucks.length === 0) {
      blockers.push('No available compatible truck')
      return blockers
    }

    const availableDrivers = drivers.some(
      (driver) => driver.status === 'available' && !driver.truckId,
    )
    if (!availableDrivers) {
      blockers.push('No available driver')
    }

    return blockers
  }

  if (!loadTruckId) {
    blockers.push('Truck missing')
  }

  if (!loadDriverId) {
    blockers.push('Driver missing')
  }

  if (assignedTruck && assignedTruck.status === 'maintenance') {
    blockers.push('Assigned truck in maintenance')
  }

  if (assignedTruck && assignedTruck.status === 'rest') {
    blockers.push('Truck is in rest state')
  }

  if (assignedDriver && assignedDriver.status === 'off_duty') {
    blockers.push('Assigned driver off duty')
  }

  return blockers
}

function LoadsPage() {
  const [segment, setSegment] = React.useState<SegmentId>('active')
  const [selectedLoadId, setSelectedLoadId] = React.useState<string | null>(
    null,
  )

  const {
    state: { loads, trucks, drivers },
    derived: { availableTrucks },
    actions,
  } = useAppStore()

  const filteredLoads = React.useMemo(
    () => filterBySegment(loads, segment),
    [loads, segment],
  )
  const activeCount = React.useMemo(
    () =>
      loads.filter((load) =>
        ['dispatched', 'at_pickup', 'in_transit', 'at_delivery'].includes(
          load.status,
        ),
      ).length,
    [loads],
  )
  const availableCount = React.useMemo(
    () =>
      loads.filter((load) =>
        ['tendered', 'pending_dispatch'].includes(load.status),
      ).length,
    [loads],
  )
  const completedCount = React.useMemo(
    () =>
      loads.filter((load) => ['delivered', 'invoiced'].includes(load.status))
        .length,
    [loads],
  )
  const selectedLoad =
    filteredLoads.find((load) => load.id === selectedLoadId) ??
    (filteredLoads.length > 0 ? filteredLoads[0] : undefined)

  const selectedLoadProgress = React.useMemo(() => {
    if (!selectedLoad) {
      return null
    }

    const stageIndex = loadLifecycleOrder.indexOf(selectedLoad.status)
    const blockers = buildLifecycleBlockers(
      selectedLoad.status,
      selectedLoad.assignedTruckId,
      selectedLoad.assignedDriverId,
      selectedLoad.equipment,
      trucks,
      drivers,
    )

    return {
      stageLabel: getLifecycleLabel(selectedLoad.status),
      stageIndex: stageIndex + 1,
      totalStages: loadLifecycleOrder.length,
      blockers,
      isBlocked: blockers.length > 0,
      percent: Math.max(
        0,
        Math.min(
          100,
          Math.round(((stageIndex + 1) / loadLifecycleOrder.length) * 100),
        ),
      ),
    }
  }, [selectedLoad, drivers, trucks])

  const nextActionLabel = (status: string) => {
    if (status === 'dispatched') {
      return 'Mark at pickup'
    }

    if (status === 'at_pickup') {
      return 'Depart to transit'
    }

    if (status === 'in_transit') {
      return 'Arrive at delivery'
    }

    if (status === 'at_delivery') {
      return 'Mark delivered'
    }

    if (status === 'tendered') {
      return 'Move to dispatch queue'
    }

    return 'Advance lifecycle'
  }

  return (
    <AppShell title="Loads" motion="snappy">
      <Card
        className="freight-panel freight-stagger-item"
        style={{ animationDelay: '40ms' }}
      >
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-900">
            Load Queue Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={segment === 'active' ? 'default' : 'outline'}
              onClick={() => setSegment('active')}
            >
              Active ({activeCount})
            </Button>
            <Button
              size="sm"
              variant={segment === 'available' ? 'default' : 'outline'}
              onClick={() => setSegment('available')}
            >
              Available ({availableCount})
            </Button>
            <Button
              size="sm"
              variant={segment === 'completed' ? 'default' : 'outline'}
              onClick={() => setSegment('completed')}
            >
              Completed ({completedCount})
            </Button>
          </div>

          <div className="space-y-2">
            {filteredLoads.slice(0, 10).map((load, index) => (
              <div
                className="freight-stagger-item"
                style={{ animationDelay: `${40 + index * 35}ms` }}
                key={load.id}
              >
                <LoadCard
                  load={load}
                  onOpen={() => setSelectedLoadId(load.id)}
                  onAssign={
                    load.status === 'pending_dispatch' && availableTrucks[0]
                      ? () => {
                          const recommendedTruckId = getRecommendedTruckId(
                            load,
                            availableTrucks,
                          )
                          if (recommendedTruckId) {
                            actions.assignLoad(load.id, recommendedTruckId)
                          }
                        }
                      : undefined
                  }
                />
              </div>
            ))}
            {filteredLoads.length === 0 ? (
              <p className="text-xs text-slate-500">
                No loads in this segment.
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {selectedLoad ? (
        <Card
          className="freight-panel freight-stagger-item"
          style={{ animationDelay: '190ms' }}
        >
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Lifecycle: {selectedLoad.reference}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedLoadProgress ? (
              <div className="rounded-lg border border-sky-200 bg-sky-50 p-2">
                <p className="text-[11px] font-semibold text-sky-700">
                  Progress {selectedLoadProgress.stageIndex}/
                  {selectedLoadProgress.totalStages} ·{' '}
                  {selectedLoadProgress.stageLabel}
                </p>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-sky-500"
                    style={{ width: `${selectedLoadProgress.percent}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-600">
                  {selectedLoadProgress.isBlocked
                    ? `Blocked: ${selectedLoadProgress.blockers.join('; ')}`
                    : 'Next step can advance'}
                </p>
              </div>
            ) : null}
            <LoadLifecycle
              status={selectedLoad.status}
              onAdvance={() => actions.advanceLoadLifecycle(selectedLoad.id)}
              canAdvance={
                selectedLoadProgress
                  ? !selectedLoadProgress.isBlocked &&
                    selectedLoad.status !== 'invoiced'
                  : false
              }
            />
            <p className="text-xs text-slate-600">
              {selectedLoad.origin.city}, {selectedLoad.origin.state} {'->'}{' '}
              {selectedLoad.destination.city}, {selectedLoad.destination.state}
            </p>
            <p className="text-[11px] text-slate-500">
              {nextActionLabel(selectedLoad.status)}
            </p>
          </CardContent>
        </Card>
      ) : null}
    </AppShell>
  )
}
