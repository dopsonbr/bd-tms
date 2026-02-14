'use client'

import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Clock,
  FileText,
  MapPin,
  MessageSquare,
  Truck,
  User,
} from 'lucide-react'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'
import {
  EQUIPMENT_LABEL,
  LOAD_STATUS_COLOR,
  LOAD_STATUS_LABEL,
} from '@/data/constants'
import { formatCurrency, formatRate } from '@/lib/format'

export const Route = createFileRoute('/_app/loads/$loadId')({
  component: LoadDetailScreen,
})

function LoadDetailScreen() {
  const { loadId } = Route.useParams()
  const loads = useAppStore((s) => s.loads)
  const trucks = useAppStore((s) => s.trucks)
  const drivers = useAppStore((s) => s.drivers)

  const load = loads[loadId]
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!load) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-muted-foreground">Load not found</p>
      </div>
    )
  }

  const truck = load.assignedTruckId ? trucks[load.assignedTruckId] : null
  const driver = load.assignedDriverId ? drivers[load.assignedDriverId] : null
  const statusColor = LOAD_STATUS_COLOR[load.status]
  const statusLabel = LOAD_STATUS_LABEL[load.status]
  const equipLabel = EQUIPMENT_LABEL[load.equipmentRequired]

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-freight-bg px-4 pb-2 pt-4">
        <div className="flex items-center gap-3">
          <Link
            to="/loads"
            className="rounded-full p-1.5 hover:bg-muted active:bg-muted/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{load.id}</h1>
            <p className="text-xs text-muted-foreground">{load.commodity}</p>
          </div>
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold',
              statusColor,
            )}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4">
        {/* Route Card */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex flex-col items-center gap-0.5">
                <Circle className="h-3 w-3 fill-freight-accent text-freight-accent" />
                <div className="h-6 w-px bg-border" />
                <MapPin className="h-3 w-3 text-freight-success" />
              </div>
              <div className="flex-1">
                <div className="mb-3">
                  <p className="text-sm font-medium">
                    {load.origin.city}, {load.origin.state}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {load.origin.facilityName}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    <Clock className="mr-1 inline h-3 w-3" />
                    {new Date(
                      load.origin.appointmentWindow.start,
                    ).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {' — '}
                    {new Date(
                      load.origin.appointmentWindow.end,
                    ).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {load.destination.city}, {load.destination.state}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {load.destination.facilityName}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    <Clock className="mr-1 inline h-3 w-3" />
                    {new Date(
                      load.destination.appointmentWindow.start,
                    ).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {' — '}
                    {new Date(
                      load.destination.appointmentWindow.end,
                    ).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 border-t border-border pt-3">
              <span className="rounded-md bg-muted px-2 py-1 text-xs">
                {load.distance} mi
              </span>
              <span className="rounded-md bg-muted px-2 py-1 text-xs">
                {equipLabel}
              </span>
              <span className="rounded-md bg-muted px-2 py-1 text-xs">
                {load.weight.toLocaleString()} lbs
              </span>
              {load.temperature !== null && (
                <span className="rounded-md bg-muted px-2 py-1 text-xs">
                  {load.temperature}°F
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Assignment Card */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Assignment
          </h3>
          {truck && driver ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-freight-accent" />
                <span className="text-sm">{truck.truckNumber}</span>
                <span className="text-xs text-muted-foreground">
                  {EQUIPMENT_LABEL[truck.equipmentType]}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-freight-accent" />
                <span className="text-sm">{driver.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(driver.hos.driveRemaining / 60).toFixed(1)}h drive remaining
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Not yet assigned</p>
          )}
        </div>

        {/* Financials Card */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Financials
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Rate</p>
              <p className="text-sm font-semibold">
                {formatCurrency(load.rate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rate/Mile</p>
              <p className="text-sm font-semibold">
                {formatRate(load.ratePerMile)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-sm font-semibold">
                {formatCurrency(load.totalRevenue)}
              </p>
            </div>
            {load.marginPercent !== null && (
              <div>
                <p className="text-xs text-muted-foreground">Margin</p>
                <p
                  className={cn(
                    'text-sm font-semibold',
                    load.marginPercent >= 15
                      ? 'text-freight-success'
                      : load.marginPercent >= 8
                        ? 'text-freight-warning'
                        : 'text-freight-critical',
                  )}
                >
                  {load.marginPercent.toFixed(1)}%
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lifecycle */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Lifecycle
          </h3>
          <div className="flex flex-col gap-2">
            {load.lifecycle.map((evt, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-freight-success" />
                <div>
                  <p className="text-sm font-medium">
                    {LOAD_STATUS_LABEL[evt.status]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(evt.timestamp).toLocaleString()} — {evt.actor}
                  </p>
                  {evt.note && (
                    <p className="text-xs text-muted-foreground">{evt.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        {load.documents.length > 0 && (
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Documents ({load.documents.length})
            </h3>
            <div className="flex flex-col gap-2">
              {load.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 rounded-lg bg-muted/50 p-2"
                >
                  <FileText className="h-4 w-4 text-freight-accent" />
                  <div className="flex-1">
                    <p className="text-xs font-medium">{doc.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {doc.type.toUpperCase()} • {doc.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Communications */}
        {load.communications.length > 0 && (
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Communications ({load.communications.length})
            </h3>
            <div className="flex flex-col gap-2">
              {load.communications.map((comm) => (
                <div key={comm.id} className="flex items-start gap-3">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm">{comm.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {comm.source} •{' '}
                      {new Date(comm.timestamp).toLocaleString()}
                      {comm.isAi && (
                        <span className="ml-1 text-freight-ai">AI</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Special Instructions */}
        {load.specialInstructions && (
          <div className="rounded-xl bg-freight-warning/10 p-4">
            <p className="text-xs font-semibold text-freight-warning">
              Special Instructions
            </p>
            <p className="mt-1 text-sm">{load.specialInstructions}</p>
          </div>
        )}
      </div>
    </div>
  )
}
