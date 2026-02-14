import {
  CARRIER_NAMES,
  CITY_LANES,
  DRIVER_FIRST_NAMES,
  DRIVER_LAST_NAMES,
  SHIPPER_NAMES,
} from './base-seed'
import type {
  Carrier,
  Driver,
  ExceptionEvent,
  Load,
  LoadStatus,
  NotificationItem,
  SeedSnapshot,
  Shipper,
  Truck,
  VoiceCall,
} from '@/domain/types'
import { BASE_NOW_ISO } from '@/domain/constants'

function toIso(base: Date, minutesOffset: number): string {
  return new Date(base.getTime() + minutesOffset * 60_000).toISOString()
}

export function buildSeedSnapshot(): SeedSnapshot {
  const base = new Date(BASE_NOW_ISO)

  const shippers: Array<Shipper> = SHIPPER_NAMES.map((name, idx) => ({
    id: `shipper-${idx + 1}`,
    name,
    tier: idx % 3 === 0 ? 'enterprise' : 'mid_market',
  }))

  const carriers: Array<Carrier> = CARRIER_NAMES.map((name, idx) => ({
    id: `carrier-${idx + 1}`,
    name,
    rating: Number((3.8 + (idx % 6) * 0.2).toFixed(1)),
  }))

  const drivers: Array<Driver> = Array.from({ length: 30 }, (_, idx) => {
    const first = DRIVER_FIRST_NAMES[idx % DRIVER_FIRST_NAMES.length]
    const last = DRIVER_LAST_NAMES[Math.floor(idx / 3) % DRIVER_LAST_NAMES.length]
    return {
      id: `driver-${idx + 1}`,
      name: `${first} ${last}`,
      status: idx < 25 ? 'driving' : 'available',
      hosRemainingHours: Number((11 - (idx % 7) * 0.8).toFixed(1)),
      homeTerminal: CITY_LANES[idx % CITY_LANES.length][0],
      phone: `555-01${String(idx + 1).padStart(2, '0')}`,
    }
  })

  const trucks: Array<Truck> = Array.from({ length: 45 }, (_, idx) => {
    const equipment = idx % 3 === 0 ? 'reefer' : idx % 3 === 1 ? 'dry_van' : 'flatbed'
    const status = idx < 25 ? 'assigned' : idx < 38 ? 'available' : 'maintenance'
    return {
      id: `truck-${idx + 1}`,
      unitNumber: `FO-${2000 + idx}`,
      equipment,
      status,
      location: CITY_LANES[idx % CITY_LANES.length][0],
      etaMinutes: 30 + (idx % 12) * 15,
      hosRemainingHours: Number((10 - (idx % 8) * 0.7).toFixed(1)),
      driverId: idx < drivers.length ? `driver-${idx + 1}` : undefined,
    }
  })

  const loads: Array<Load> = Array.from({ length: 80 }, (_, idx) => {
    const lane = CITY_LANES[idx % CITY_LANES.length]
    const shipperId = `shipper-${(idx % shippers.length) + 1}`
    const carrierId = `carrier-${(idx % carriers.length) + 1}`
    const status: LoadStatus =
      idx < 8
        ? 'assigned'
        : idx < 18
          ? 'in_transit'
          : idx < 25
            ? 'at_risk'
            : idx < 50
              ? 'tendered'
              : idx < 65
                ? 'delivered'
                : 'invoiced'
    const assigned = idx < 25
    const revenueUsd = 2200 + (idx % 12) * 180
    const costUsd = Math.round(revenueUsd * (0.72 + (idx % 5) * 0.03))

    return {
      id: `load-${idx + 1}`,
      reference: `LD-${String(41000 + idx)}`,
      shipperId,
      carrierId,
      equipment: idx % 3 === 0 ? 'reefer' : idx % 3 === 1 ? 'dry_van' : 'flatbed',
      status,
      origin: lane[0],
      destination: lane[1],
      miles: 280 + (idx % 10) * 65,
      pickupIso: toIso(base, idx * 30 - 400),
      deliveryIso: toIso(base, idx * 30 + 420),
      revenueUsd,
      costUsd,
      marginUsd: revenueUsd - costUsd,
      truckId: assigned ? `truck-${idx + 1}` : undefined,
      driverId: assigned && idx < drivers.length ? `driver-${idx + 1}` : undefined,
      stops: [
        {
          id: `stop-p-${idx + 1}`,
          type: 'pickup',
          location: lane[0],
          windowStartIso: toIso(base, idx * 30 - 420),
          windowEndIso: toIso(base, idx * 30 - 360),
        },
        {
          id: `stop-d-${idx + 1}`,
          type: 'dropoff',
          location: lane[1],
          windowStartIso: toIso(base, idx * 30 + 360),
          windowEndIso: toIso(base, idx * 30 + 460),
        },
      ],
      tags: idx % 4 === 0 ? ['priority', 'retail'] : idx % 5 === 0 ? ['brokered'] : ['standard'],
    }
  })

  const exceptions: Array<ExceptionEvent> = [
    {
      id: 'exc-1',
      loadId: 'load-3',
      severity: 'critical',
      status: 'open',
      type: 'breakdown',
      title: 'Unit FO-2003 reported engine fault',
      detail: 'Tow requested. ETA impact +5h projected.',
      createdIso: toIso(base, -70),
    },
    {
      id: 'exc-2',
      loadId: 'load-11',
      severity: 'high',
      status: 'open',
      type: 'weather',
      title: 'Snow band on I-80 corridor',
      detail: 'Re-route candidate adds 58 miles.',
      createdIso: toIso(base, -45),
    },
    {
      id: 'exc-3',
      loadId: 'load-21',
      severity: 'medium',
      status: 'open',
      type: 'delay',
      title: 'Pickup dock congestion',
      detail: 'Facility pushed appointment by 75 minutes.',
      createdIso: toIso(base, -20),
    },
    {
      id: 'exc-4',
      loadId: 'load-46',
      severity: 'low',
      status: 'resolved',
      type: 'docs',
      title: 'BOL upload delay',
      detail: 'Document synced after mobile retry.',
      createdIso: toIso(base, -180),
      resolvedIso: toIso(base, -160),
    },
  ]

  const voiceCalls: Array<VoiceCall> = [
    {
      id: 'call-1',
      loadId: 'load-3',
      direction: 'inbound',
      contact: 'Big Box Receiver',
      startedIso: toIso(base, -25),
      durationSec: 98,
      status: 'completed',
      frames: [
        { atSec: 0, speaker: 'caller', text: 'Need ETA update for LD-41002.' },
        { atSec: 15, speaker: 'agent', text: 'Checking live truck telemetry now.' },
        {
          atSec: 36,
          speaker: 'system',
          text: 'Delay detected from breakdown event.',
          systemAction: 'Generate revised ETA +5h',
        },
        { atSec: 62, speaker: 'agent', text: 'Updated ETA is 7:30 PM local.' },
      ],
    },
    {
      id: 'call-2',
      loadId: 'load-11',
      direction: 'outbound',
      contact: 'Shipper Ops Desk',
      startedIso: toIso(base, -10),
      durationSec: 76,
      status: 'completed',
      frames: [
        { atSec: 0, speaker: 'agent', text: 'Proactive weather impact call for load eleven.' },
        { atSec: 28, speaker: 'caller', text: 'Approve reroute if margin impact is limited.' },
      ],
    },
  ]

  const notifications: Array<NotificationItem> = [
    {
      id: 'note-1',
      title: 'Critical exception opened',
      body: 'Load LD-41002 requires reassignment.',
      createdIso: toIso(base, -70),
      read: false,
      severity: 'critical',
    },
    {
      id: 'note-2',
      title: 'Scenario controls ready',
      body: 'Use More > Demo Controls to run full lifecycle.',
      createdIso: toIso(base, -15),
      read: false,
      severity: 'low',
    },
  ]

  return {
    trucks,
    drivers,
    loads,
    shippers,
    carriers,
    exceptions,
    voiceCalls,
    notifications,
  }
}
