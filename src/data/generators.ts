import { HUBS } from './constants'
import type {
  Accessorial,
  Carrier,
  CommunicationEntry,
  Driver,
  DriverHosPhase,
  EntityId,
  EquipmentType,
  Exception,
  ExceptionSeverity,
  ExceptionType,
  Facility,
  FacilityStop,
  LaneHistory,
  LatLng,
  LifecycleEvent,
  Load,
  LoadDocument,
  LoadStatus,
  LoadType,
  Shipper,
  TimeEvent,
  Trailer,
  Truck,
  TruckStatus,
} from './types'

/* ─── Pseudo-random seeded generator (simple LCG) ──────────────── */

function createRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

/* ─── Helper functions ────────────────────────────────────────── */

function pick<T>(rng: () => number, arr: Array<T>): T {
  return arr[Math.floor(rng() * arr.length)]
}

function pickWeighted<T>(rng: () => number, items: Array<[T, number]>): T {
  const total = items.reduce((sum, [, weight]) => sum + weight, 0)
  let rand = rng() * total
  for (const [item, weight] of items) {
    if (rand < weight) return item
    rand -= weight
  }
  return items[items.length - 1][0]
}

function randomRange(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min)
}

function randomInt(rng: () => number, min: number, max: number): number {
  return Math.floor(randomRange(rng, min, max + 1))
}

/* ─── Route Polyline Generator ────────────────────────────────── */

export function generateRoutePolyline(
  from: LatLng,
  to: LatLng,
  points = 25,
): Array<LatLng> {
  const rng = createRng(Math.floor(from.lat * 1000 + to.lng * 1000))
  const result: Array<LatLng> = []

  for (let i = 0; i <= points; i++) {
    const t = i / points
    const lat = from.lat + (to.lat - from.lat) * t
    const lng = from.lng + (to.lng - from.lng) * t

    // Add slight arc and random offset for road-like appearance
    const arcOffset = Math.sin(t * Math.PI) * 0.15
    const randomOffsetLat = (rng() - 0.5) * 0.1
    const randomOffsetLng = (rng() - 0.5) * 0.1

    result.push({
      lat: lat + arcOffset + randomOffsetLat,
      lng: lng + randomOffsetLng,
    })
  }

  return result
}

/* ─── Truck Generator ─────────────────────────────────────────── */

export function generateTrucks(): Record<string, Truck> {
  const rng = createRng(1001)
  const trucks: Record<string, Truck> = {}
  const hubKeys = Object.keys(HUBS)

  // T-201..T-230 (dry_van)
  for (let i = 201; i <= 230; i++) {
    const id = `T-${i}`
    const hubKey = hubKeys[(i - 201) % hubKeys.length]
    const hub = HUBS[hubKey]

    trucks[id] = {
      id,
      truckNumber: id,
      vin: `1HGBH${randomInt(rng, 10000, 99999)}${i}`,
      equipmentType: 'dry_van',
      status: pickWeighted<TruckStatus>(rng, [
        ['en_route', 40],
        ['at_pickup', 15],
        ['at_delivery', 10],
        ['empty', 30],
        ['out_of_service', 5],
      ]),
      position: {
        lat: hub.position.lat + (rng() - 0.5) * 0.6,
        lng: hub.position.lng + (rng() - 0.5) * 0.6,
      },
      heading: randomInt(rng, 0, 360),
      currentLoadId: null,
      driverId: null,
      trailerId: null,
      mileage: randomInt(rng, 50000, 350000),
      nextMaintenanceMiles: 0,
      homeHub: hubKey,
      speed: 0,
    }
    trucks[id].nextMaintenanceMiles =
      trucks[id].mileage + randomInt(rng, 5000, 25000)
    trucks[id].speed =
      trucks[id].status === 'en_route' ? randomInt(rng, 35, 65) : 0
  }

  // T-301..T-310 (reefer)
  for (let i = 301; i <= 310; i++) {
    const id = `T-${i}`
    const hubKey = hubKeys[(i - 301) % hubKeys.length]
    const hub = HUBS[hubKey]

    trucks[id] = {
      id,
      truckNumber: id,
      vin: `2FMDK${randomInt(rng, 10000, 99999)}${i}`,
      equipmentType: 'reefer',
      status: pickWeighted<TruckStatus>(rng, [
        ['en_route', 40],
        ['at_pickup', 15],
        ['at_delivery', 10],
        ['empty', 30],
        ['out_of_service', 5],
      ]),
      position: {
        lat: hub.position.lat + (rng() - 0.5) * 0.6,
        lng: hub.position.lng + (rng() - 0.5) * 0.6,
      },
      heading: randomInt(rng, 0, 360),
      currentLoadId: null,
      driverId: null,
      trailerId: null,
      mileage: randomInt(rng, 50000, 350000),
      nextMaintenanceMiles: 0,
      homeHub: hubKey,
      speed: 0,
    }
    trucks[id].nextMaintenanceMiles =
      trucks[id].mileage + randomInt(rng, 5000, 25000)
    trucks[id].speed =
      trucks[id].status === 'en_route' ? randomInt(rng, 35, 65) : 0
  }

  // T-401..T-405 (flatbed)
  for (let i = 401; i <= 405; i++) {
    const id = `T-${i}`
    const hubKey = hubKeys[(i - 401) % hubKeys.length]
    const hub = HUBS[hubKey]

    trucks[id] = {
      id,
      truckNumber: id,
      vin: `3GCPK${randomInt(rng, 10000, 99999)}${i}`,
      equipmentType: 'flatbed',
      status: pickWeighted<TruckStatus>(rng, [
        ['en_route', 40],
        ['at_pickup', 15],
        ['at_delivery', 10],
        ['empty', 30],
        ['out_of_service', 5],
      ]),
      position: {
        lat: hub.position.lat + (rng() - 0.5) * 0.6,
        lng: hub.position.lng + (rng() - 0.5) * 0.6,
      },
      heading: randomInt(rng, 0, 360),
      currentLoadId: null,
      driverId: null,
      trailerId: null,
      mileage: randomInt(rng, 50000, 350000),
      nextMaintenanceMiles: 0,
      homeHub: hubKey,
      speed: 0,
    }
    trucks[id].nextMaintenanceMiles =
      trucks[id].mileage + randomInt(rng, 5000, 25000)
    trucks[id].speed =
      trucks[id].status === 'en_route' ? randomInt(rng, 35, 65) : 0
  }

  return trucks
}

/* ─── Driver Generator ────────────────────────────────────────── */

export function generateDrivers(
  trucks: Record<string, Truck>,
): Record<string, Driver> {
  const rng = createRng(2001)
  const drivers: Record<string, Driver> = {}

  const names = [
    'Mike Torres',
    'James Wright',
    'Sarah Chen',
    'Robert Kim',
    'Maria Garcia',
    'David Johnson',
    'Lisa Wong',
    'Marcus Brown',
    'Jennifer Davis',
    'Carlos Rodriguez',
    'Amanda White',
    'Kevin Williams',
    'Stephanie Taylor',
    'Brian Anderson',
    'Nicole Martinez',
    'Christopher Lee',
    'Ashley Thomas',
    'Daniel Moore',
    'Rachel Jackson',
    'Anthony Harris',
    'Laura Thompson',
    'Jason Clark',
    'Megan Robinson',
    'Eric Lewis',
    'Samantha Walker',
    'Timothy Hall',
    'Jessica Young',
    'Ryan Allen',
    'Katherine King',
    'Brandon Scott',
  ]

  const states = ['GA', 'TN', 'AL', 'NC', 'FL']
  const truckIds = Object.keys(trucks).slice(0, 30)

  for (let i = 0; i < 30; i++) {
    const id = `DRV-${String(i + 1).padStart(3, '0')}`
    const truckId = truckIds[i]

    // HOS distribution
    let hosPhase: DriverHosPhase
    let driveRemaining: number
    let driverStatus: 'active' | 'off_duty' | 'on_leave'

    if (i < 8) {
      hosPhase = 'driving'
      driveRemaining = randomInt(rng, 480, 660)
      driverStatus = 'active'
    } else if (i < 18) {
      hosPhase = 'on_duty'
      driveRemaining = randomInt(rng, 240, 480)
      driverStatus = 'active'
    } else if (i < 25) {
      hosPhase = 'driving'
      driveRemaining = randomInt(rng, 60, 240)
      driverStatus = 'active'
    } else {
      hosPhase = 'off_duty'
      driveRemaining = 0
      driverStatus = 'off_duty'
    }

    const hubKeys = Object.keys(HUBS)
    const homeBase = pick(rng, hubKeys)

    // Generate 2-4 preferred lanes
    const preferredLanes: Array<string> = []
    const laneCount = randomInt(rng, 2, 4)
    for (let j = 0; j < laneCount; j++) {
      const from = pick(rng, hubKeys)
      const to = pick(
        rng,
        hubKeys.filter((k) => k !== from),
      )
      preferredLanes.push(`${from}-${to}`)
    }

    // Certified equipment
    const certifiedEquipment: Array<EquipmentType> = ['dry_van']
    if (rng() > 0.5) certifiedEquipment.push('reefer')
    if (rng() > 0.7) certifiedEquipment.push('flatbed')

    const now = new Date()
    const hireDate = new Date(
      now.getFullYear() - randomInt(rng, 1, 10),
      randomInt(rng, 0, 11),
      randomInt(rng, 1, 28),
    )

    drivers[id] = {
      id,
      name: names[i],
      phone: `+1${randomInt(rng, 2000000000, 9999999999)}`,
      photoUrl: '',
      cdlNumber: `${pick(rng, states)}${randomInt(rng, 1000000, 9999999)}`,
      cdlExpiry: new Date(
        now.getFullYear() + randomInt(rng, 1, 5),
        randomInt(rng, 0, 11),
        randomInt(rng, 1, 28),
      )
        .toISOString()
        .split('T')[0],
      endorsements: ['H', 'N'].filter(() => rng() > 0.5),
      homeBase,
      truckId,
      hos: {
        phase: hosPhase,
        driveRemaining,
        onDutyRemaining: randomInt(rng, driveRemaining, 840),
        cycleRemaining: randomInt(rng, 1000, 4200),
        nextBreakDue: driveRemaining > 0 ? randomInt(rng, 60, 480) : 0,
        resetStartedAt:
          hosPhase === 'off_duty' && driverStatus === 'off_duty'
            ? new Date(
                now.getTime() - randomInt(rng, 0, 20) * 60 * 60 * 1000,
              ).toISOString()
            : null,
        lastUpdated: now.toISOString(),
      },
      performanceScore: randomInt(rng, 72, 98),
      preferredLanes,
      status: driverStatus,
      certifiedEquipment,
      hireDate: hireDate.toISOString().split('T')[0],
    }

    // Wire up driver to truck
    trucks[truckId].driverId = id
  }

  return drivers
}

/* ─── Shipper Generator ───────────────────────────────────────── */

export function generateShippers(): Record<string, Shipper> {
  const rng = createRng(3001)
  const shippers: Record<string, Shipper> = {}

  const shipperData = [
    {
      name: 'Piedmont Steel Works',
      industry: 'manufacturing',
      city: 'Atlanta',
      state: 'GA',
    },
    {
      name: 'Carolina Chemical Supply',
      industry: 'manufacturing',
      city: 'Charlotte',
      state: 'NC',
    },
    {
      name: 'Southeast Distribution Co',
      industry: 'distribution',
      city: 'Memphis',
      state: 'TN',
    },
    {
      name: 'Peach State Logistics',
      industry: 'distribution',
      city: 'Atlanta',
      state: 'GA',
    },
    {
      name: 'Dixie Home Furnishings',
      industry: 'retail',
      city: 'Birmingham',
      state: 'AL',
    },
    {
      name: 'SunBelt Auto Parts',
      industry: 'retail',
      city: 'Jacksonville',
      state: 'FL',
    },
    {
      name: 'Golden Harvest Foods',
      industry: 'food_beverage',
      city: 'Nashville',
      state: 'TN',
    },
    {
      name: 'Blue Ridge Beverages',
      industry: 'food_beverage',
      city: 'Charlotte',
      state: 'NC',
    },
    {
      name: 'Magnolia Paper Products',
      industry: 'manufacturing',
      city: 'Memphis',
      state: 'TN',
    },
    {
      name: 'Tennessee Valley Electronics',
      industry: 'manufacturing',
      city: 'Nashville',
      state: 'TN',
    },
    {
      name: 'Gulf Coast Plastics',
      industry: 'industrial',
      city: 'Jacksonville',
      state: 'FL',
    },
    {
      name: 'Appalachian Timber Co',
      industry: 'industrial',
      city: 'Birmingham',
      state: 'AL',
    },
    {
      name: 'Savannah Cotton Exchange',
      industry: 'distribution',
      city: 'Atlanta',
      state: 'GA',
    },
    {
      name: 'Delta Agricultural Supply',
      industry: 'distribution',
      city: 'Memphis',
      state: 'TN',
    },
    {
      name: 'Coastal Seafood Distributors',
      industry: 'food_beverage',
      city: 'Jacksonville',
      state: 'FL',
    },
  ]

  const hubKeys = Object.keys(HUBS)

  for (let i = 0; i < 15; i++) {
    const id = `SHP-${String(i + 1).padStart(3, '0')}`
    const data = shipperData[i]

    const lanes: Array<LaneHistory> = []
    const laneCount = randomInt(rng, 2, 5)
    for (let j = 0; j < laneCount; j++) {
      const origin = pick(rng, hubKeys)
      const destination = pick(
        rng,
        hubKeys.filter((k) => k !== origin),
      )
      lanes.push({
        origin,
        destination,
        loadCount: randomInt(rng, 5, 50),
        averageRate: randomRange(rng, 2.2, 3.2),
        lastShipped: new Date(
          Date.now() - randomInt(rng, 1, 90) * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split('T')[0],
      })
    }

    shippers[id] = {
      id,
      name: data.name,
      contactName: pick(rng, [
        'John Smith',
        'Sarah Johnson',
        'Mike Williams',
        'Emily Davis',
        'Chris Brown',
      ]),
      phone: `+1${randomInt(rng, 2000000000, 9999999999)}`,
      email: `contact@${data.name.toLowerCase().replace(/\s+/g, '')}.com`,
      address: `${randomInt(rng, 100, 9999)} Industrial Blvd`,
      city: data.city,
      state: data.state,
      industry: data.industry,
      activeLoadCount: randomInt(rng, 3, 8),
      averageVolume: randomInt(rng, 5, 20),
      averageRate: randomRange(rng, 2.2, 3.2),
      paymentTerms: pick(rng, [30, 45]),
      lanes,
    }
  }

  return shippers
}

/* ─── Carrier Generator ───────────────────────────────────────── */

export function generateCarriers(): Record<string, Carrier> {
  const rng = createRng(4001)
  const carriers: Record<string, Carrier> = {}

  const carrierNames = [
    'Southeast Express',
    'J&R Trucking',
    'Blue Line Transport',
    'Peachtree Hauling',
    'Volunteer Transport',
    'Magnolia Freight',
    'Dixie Logistics',
    'Atlantic Coast Carriers',
    'Piedmont Transport',
    'Gulf States Trucking',
    'Appalachian Express',
    'Smoky Mountain Freight',
    'Delta Transport Services',
    'Carolina Carriers',
    'Sunbelt Logistics',
    'River City Transport',
    'Coastal Freight Lines',
    'Southern Star Trucking',
    'Heritage Transport',
    'Liberty Logistics',
    'Eagle Eye Freight',
    'Thunder Road Transport',
    'Heartland Carriers',
    'Summit Logistics',
    'Horizon Freight',
  ]

  const states = ['GA', 'TN', 'AL', 'NC', 'FL', 'SC', 'MS']

  for (let i = 0; i < 25; i++) {
    const id = `CAR-${String(i + 1).padStart(3, '0')}`
    const fleetSize = randomInt(rng, 1, 10)

    const equipmentTypes: Array<EquipmentType> = ['dry_van']
    if (rng() > 0.5) equipmentTypes.push('reefer')
    if (rng() > 0.7) equipmentTypes.push('flatbed')

    const serviceAreaCount = randomInt(rng, 3, 6)
    const serviceArea = Array.from({ length: serviceAreaCount }, () =>
      pick(rng, states),
    )

    const onTimePickup = randomRange(rng, 78, 99)
    const onTimeDelivery = randomRange(rng, 80, 99)
    const claimsRatio = randomRange(rng, 0.2, 4.5)
    const communicationScore = randomInt(rng, 60, 98)
    const overallScore = Math.round(
      onTimePickup * 0.3 +
        onTimeDelivery * 0.3 +
        (100 - claimsRatio * 10) * 0.2 +
        communicationScore * 0.2,
    )

    const hubKeys = Object.keys(HUBS)
    const preferredLanes: Array<string> = []
    const laneCount = randomInt(rng, 2, 4)
    for (let j = 0; j < laneCount; j++) {
      const from = pick(rng, hubKeys)
      const to = pick(
        rng,
        hubKeys.filter((k) => k !== from),
      )
      preferredLanes.push(`${from}-${to}`)
    }

    const now = new Date()
    const totalLoads = randomInt(rng, 10, 200)
    const lastLoadDate = new Date(
      now.getTime() - randomInt(rng, 1, 60) * 24 * 60 * 60 * 1000,
    )
      .toISOString()
      .split('T')[0]

    carriers[id] = {
      id,
      name: carrierNames[i],
      contactName: pick(rng, [
        'Bob Wilson',
        'Mary Taylor',
        'Tom Anderson',
        'Lisa Martin',
        'Dave Thompson',
      ]),
      phone: `+1${randomInt(rng, 2000000000, 9999999999)}`,
      email: `dispatch@${carrierNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
      mcNumber: `MC-${randomInt(rng, 100000, 999999)}`,
      dotNumber: `${randomInt(rng, 1000000, 9999999)}`,
      fleetSize,
      equipmentTypes,
      serviceArea,
      scorecard: {
        onTimePickup,
        onTimeDelivery,
        claimsRatio,
        communicationScore,
        overallScore,
        totalLoads,
        lastLoadDate,
      },
      status: i < 23 ? 'active' : 'pending',
      preferredLanes,
      insuranceExpiry: new Date(
        now.getFullYear() + 1,
        randomInt(rng, 0, 11),
        randomInt(rng, 1, 28),
      )
        .toISOString()
        .split('T')[0],
      paymentTerms: pick(rng, ['standard_30', 'quick_pay']),
    }
  }

  return carriers
}

/* ─── Facility Generator ──────────────────────────────────────── */

export function generateFacilities(): Record<string, Facility> {
  const rng = createRng(5001)
  const facilities: Record<string, Facility> = {}

  const facilityNames = [
    // Shipper warehouses
    {
      name: 'Atlanta Industrial Park',
      type: 'shipper_warehouse' as const,
      hub: 'ATL',
    },
    {
      name: 'Memphis Logistics Center',
      type: 'shipper_warehouse' as const,
      hub: 'MEM',
    },
    {
      name: 'Nashville Manufacturing Hub',
      type: 'shipper_warehouse' as const,
      hub: 'NSH',
    },
    {
      name: 'Charlotte Distribution Facility',
      type: 'shipper_warehouse' as const,
      hub: 'CLT',
    },
    {
      name: 'Jacksonville Port Warehouse',
      type: 'shipper_warehouse' as const,
      hub: 'JAX',
    },
    {
      name: 'Birmingham Steel Complex',
      type: 'shipper_warehouse' as const,
      hub: 'BHM',
    },
    {
      name: 'Peachtree Food Processing',
      type: 'shipper_warehouse' as const,
      hub: 'ATL',
    },
    {
      name: 'Delta Chemical Plant',
      type: 'shipper_warehouse' as const,
      hub: 'MEM',
    },
    {
      name: 'Music City Warehouse',
      type: 'shipper_warehouse' as const,
      hub: 'NSH',
    },
    {
      name: 'Queen City Auto Parts',
      type: 'shipper_warehouse' as const,
      hub: 'CLT',
    },
    {
      name: 'Gulf Coast Plastics Plant',
      type: 'shipper_warehouse' as const,
      hub: 'JAX',
    },
    {
      name: 'Vulcan Materials Depot',
      type: 'shipper_warehouse' as const,
      hub: 'BHM',
    },
    {
      name: 'Midtown Storage Facility',
      type: 'shipper_warehouse' as const,
      hub: 'ATL',
    },
    {
      name: 'River Bend Warehouse',
      type: 'shipper_warehouse' as const,
      hub: 'MEM',
    },
    {
      name: 'Opryland Distribution',
      type: 'shipper_warehouse' as const,
      hub: 'NSH',
    },
    // Receiver warehouses
    {
      name: 'Target Distribution Atlanta',
      type: 'receiver_warehouse' as const,
      hub: 'ATL',
    },
    {
      name: 'Walmart Supercenter MEM',
      type: 'receiver_warehouse' as const,
      hub: 'MEM',
    },
    {
      name: 'Home Depot Nashville',
      type: 'receiver_warehouse' as const,
      hub: 'NSH',
    },
    {
      name: 'Lowes Charlotte DC',
      type: 'receiver_warehouse' as const,
      hub: 'CLT',
    },
    {
      name: 'Costco Jacksonville',
      type: 'receiver_warehouse' as const,
      hub: 'JAX',
    },
    {
      name: 'Best Buy Birmingham',
      type: 'receiver_warehouse' as const,
      hub: 'BHM',
    },
    {
      name: 'Kroger Regional DC',
      type: 'receiver_warehouse' as const,
      hub: 'ATL',
    },
    {
      name: 'Publix Distribution',
      type: 'receiver_warehouse' as const,
      hub: 'JAX',
    },
    {
      name: 'AutoZone Memphis Hub',
      type: 'receiver_warehouse' as const,
      hub: 'MEM',
    },
    {
      name: 'Dollar General DC',
      type: 'receiver_warehouse' as const,
      hub: 'NSH',
    },
    {
      name: 'Food Lion Charlotte',
      type: 'receiver_warehouse' as const,
      hub: 'CLT',
    },
    {
      name: 'CVS Distribution',
      type: 'receiver_warehouse' as const,
      hub: 'BHM',
    },
    // Distribution centers
    {
      name: 'Amazon ATL Fulfillment',
      type: 'distribution_center' as const,
      hub: 'ATL',
    },
    {
      name: 'FedEx Memphis Superhub',
      type: 'distribution_center' as const,
      hub: 'MEM',
    },
    {
      name: 'UPS Nashville Hub',
      type: 'distribution_center' as const,
      hub: 'NSH',
    },
    {
      name: 'XPO Charlotte Terminal',
      type: 'distribution_center' as const,
      hub: 'CLT',
    },
    {
      name: 'Old Dominion JAX',
      type: 'distribution_center' as const,
      hub: 'JAX',
    },
    {
      name: 'Estes Birmingham',
      type: 'distribution_center' as const,
      hub: 'BHM',
    },
    {
      name: 'YRC Regional Center',
      type: 'distribution_center' as const,
      hub: 'ATL',
    },
    {
      name: 'Southeastern Freight',
      type: 'distribution_center' as const,
      hub: 'MEM',
    },
    // Truck stops
    { name: 'TA Travel Center I-75', type: 'truck_stop' as const, hub: 'ATL' },
    { name: 'Pilot Flying J I-40', type: 'truck_stop' as const, hub: 'MEM' },
    {
      name: "Love's Travel Stop I-24",
      type: 'truck_stop' as const,
      hub: 'NSH',
    },
    // Rail yards
    {
      name: 'Norfolk Southern Inman Yard',
      type: 'rail_yard' as const,
      hub: 'ATL',
    },
    { name: 'CSX Tennessee Yard', type: 'rail_yard' as const, hub: 'MEM' },
  ]

  for (let i = 0; i < 40; i++) {
    const id = `FAC-${String(i + 1).padStart(3, '0')}`
    const data = facilityNames[i]
    const hub = HUBS[data.hub]

    const position: LatLng = {
      lat: hub.position.lat + (rng() - 0.5) * 0.4,
      lng: hub.position.lng + (rng() - 0.5) * 0.4,
    }

    const openHour = data.type === 'truck_stop' ? 0 : randomInt(rng, 6, 8)
    const closeHour = data.type === 'truck_stop' ? 23 : randomInt(rng, 16, 20)

    facilities[id] = {
      id,
      name: data.name,
      address: `${randomInt(rng, 100, 9999)} ${pick(rng, ['Industrial', 'Commerce', 'Warehouse', 'Logistics'])} ${pick(rng, ['Blvd', 'Pkwy', 'Dr', 'Way'])}`,
      city: hub.label.split(',')[0],
      state:
        data.hub === 'ATL'
          ? 'GA'
          : data.hub === 'MEM'
            ? 'TN'
            : data.hub === 'NSH'
              ? 'TN'
              : data.hub === 'CLT'
                ? 'NC'
                : data.hub === 'JAX'
                  ? 'FL'
                  : 'AL',
      position,
      type: data.type,
      operatingHours: {
        open: `${String(openHour).padStart(2, '0')}:00`,
        close: `${String(closeHour).padStart(2, '0')}:00`,
      },
      averageDwellTime: randomInt(rng, 30, 180),
      hasDropTrailer: data.type !== 'truck_stop' && rng() > 0.4,
      dockCount: data.type === 'truck_stop' ? 0 : randomInt(rng, 4, 24),
    }
  }

  return facilities
}

/* ─── Trailer Generator ───────────────────────────────────────── */

export function generateTrailers(
  trucks: Record<string, Truck>,
): Record<string, Trailer> {
  const rng = createRng(6001)
  const trailers: Record<string, Trailer> = {}

  const truckIds = Object.keys(trucks)

  for (let i = 1; i <= 60; i++) {
    const id = `TRL-${String(i).padStart(3, '0')}`

    const type: EquipmentType =
      i <= 40 ? 'dry_van' : i <= 50 ? 'reefer' : 'flatbed'

    // Assign some trailers to trucks
    const assignedTruckId = i <= 30 && truckIds[i - 1] ? truckIds[i - 1] : null
    const truck = assignedTruckId ? trucks[assignedTruckId] : null

    const position = truck
      ? truck.position
      : {
          lat: randomRange(rng, 33, 36),
          lng: randomRange(rng, -90, -80),
        }

    trailers[id] = {
      id,
      type,
      status: pick(rng, ['loaded', 'empty', 'in_maintenance']),
      position,
      assignedTruckId,
      assignedLoadId: null,
      lastInspection: new Date(
        Date.now() - randomInt(rng, 1, 90) * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .split('T')[0],
    }

    // Wire up trailer to truck
    if (assignedTruckId && truck) {
      truck.trailerId = id
    }
  }

  return trailers
}

/* ─── Load Generator ──────────────────────────────────────────── */

export function generateLoads(
  trucks: Record<string, Truck>,
  drivers: Record<string, Driver>,
  shippers: Record<string, Shipper>,
  facilities: Record<string, Facility>,
): Record<string, Load> {
  const rng = createRng(7001)
  const loads: Record<string, Load> = {}

  const commodities = [
    'Steel coils',
    'Chemicals',
    'Auto parts',
    'Furniture',
    'Frozen foods',
    'Beverages',
    'Paper products',
    'Electronics',
    'Lumber',
    'Cotton bales',
    'Seafood',
    'Farm equipment',
    'General freight',
  ]

  const hubKeys = Object.keys(HUBS)
  const facilityIds = Object.keys(facilities)
  const shipperIds = Object.keys(shippers)
  const truckIds = Object.keys(trucks).filter(
    (id) => trucks[id].driverId !== null,
  )

  let truckAssignmentIndex = 0

  const statusDistribution: Array<[LoadStatus, number]> = [
    ['in_transit', 20],
    ['at_pickup', 15],
    ['at_delivery', 10],
    ['dispatched', 12],
    ['delivered', 8],
    ['tendered', 8],
    ['accepted', 7],
  ]

  for (let i = 4500; i < 4580; i++) {
    const id = `LD-${i}`
    const status = pickWeighted<LoadStatus>(rng, statusDistribution)
    const type: LoadType = i < 4555 ? 'carrier' : 'brokered'

    const equipmentRequired: EquipmentType = pickWeighted<EquipmentType>(rng, [
      ['dry_van', 60],
      ['reefer', 25],
      ['flatbed', 15],
    ])

    // Pick origin and destination
    const originHub = pick(rng, hubKeys)
    pick(
      rng,
      hubKeys.filter((k) => k !== originHub),
    ) // consume rng for dest hub

    const originFacility = pick(
      rng,
      facilityIds.filter((fid) => facilities[fid].type === 'shipper_warehouse'),
    )
    const destFacility = pick(
      rng,
      facilityIds.filter(
        (fid) => facilities[fid].type === 'receiver_warehouse',
      ),
    )

    const origin = facilities[originFacility]
    const destination = facilities[destFacility]

    // Calculate distance (simplified)
    const distance = randomInt(rng, 100, 600)

    // Rate per mile based on distance
    let ratePerMile: number
    if (distance < 200) {
      ratePerMile = randomRange(rng, 1.8, 2.5)
    } else if (distance < 500) {
      ratePerMile = randomRange(rng, 2.2, 3.0)
    } else {
      ratePerMile = randomRange(rng, 2.5, 3.5)
    }

    const rate = distance * ratePerMile
    const fuelSurcharge = rate * 0.15

    const accessorials: Array<Accessorial> = []
    if (rng() > 0.7) {
      accessorials.push({
        type: 'detention',
        description: 'Detention at pickup',
        amount: randomInt(rng, 50, 150),
      })
    }

    const totalRevenue =
      rate + fuelSurcharge + accessorials.reduce((sum, a) => sum + a.amount, 0)

    let carrierCost: number | null = null
    let margin: number | null = null
    let marginPercent: number | null = null

    if (type === 'brokered') {
      marginPercent = randomRange(rng, 8, 22)
      margin = totalRevenue * (marginPercent / 100)
      carrierCost = totalRevenue - margin
    }

    // Assign truck and driver for active loads
    let assignedTruckId: EntityId | null = null
    let assignedDriverId: EntityId | null = null

    if (
      ['in_transit', 'at_pickup', 'at_delivery', 'dispatched'].includes(status)
    ) {
      if (truckAssignmentIndex < truckIds.length) {
        assignedTruckId = truckIds[truckAssignmentIndex]
        const truck = trucks[assignedTruckId]
        assignedDriverId = truck.driverId
        truck.currentLoadId = id
        truckAssignmentIndex++
      }
    }

    const now = new Date()
    const pickupStart = new Date(
      now.getTime() + randomInt(rng, -2, 8) * 60 * 60 * 1000,
    )
    const pickupEnd = new Date(pickupStart.getTime() + 2 * 60 * 60 * 1000)
    const deliveryStart = new Date(
      pickupEnd.getTime() + randomInt(rng, 4, 12) * 60 * 60 * 1000,
    )
    const deliveryEnd = new Date(deliveryStart.getTime() + 2 * 60 * 60 * 1000)

    const originStop: FacilityStop = {
      facilityId: originFacility,
      facilityName: origin.name,
      address: origin.address,
      city: origin.city,
      state: origin.state,
      position: origin.position,
      appointmentWindow: {
        start: pickupStart.toISOString(),
        end: pickupEnd.toISOString(),
      },
      actualArrival:
        status === 'at_pickup' ||
        status === 'in_transit' ||
        status === 'delivered'
          ? pickupStart.toISOString()
          : null,
      actualDeparture:
        status === 'in_transit' || status === 'delivered'
          ? pickupEnd.toISOString()
          : null,
      stopType: 'pickup',
      status:
        status === 'at_pickup'
          ? 'loading'
          : status === 'in_transit' || status === 'delivered'
            ? 'completed'
            : 'pending',
      sequence: 1,
    }

    const destStop: FacilityStop = {
      facilityId: destFacility,
      facilityName: destination.name,
      address: destination.address,
      city: destination.city,
      state: destination.state,
      position: destination.position,
      appointmentWindow: {
        start: deliveryStart.toISOString(),
        end: deliveryEnd.toISOString(),
      },
      actualArrival:
        status === 'at_delivery' || status === 'delivered'
          ? deliveryStart.toISOString()
          : null,
      actualDeparture:
        status === 'delivered' ? deliveryEnd.toISOString() : null,
      stopType: 'delivery',
      status:
        status === 'at_delivery'
          ? 'loading'
          : status === 'delivered'
            ? 'completed'
            : 'pending',
      sequence: 2,
    }

    // Lifecycle events
    const lifecycle: Array<LifecycleEvent> = []
    const createdAt = new Date(
      now.getTime() - randomInt(rng, 1, 48) * 60 * 60 * 1000,
    )

    lifecycle.push({
      status: 'tendered',
      timestamp: createdAt.toISOString(),
      actor: 'system',
      note: 'Load tendered to carrier',
    })

    if (
      [
        'accepted',
        'dispatched',
        'in_transit',
        'at_pickup',
        'at_delivery',
        'delivered',
      ].includes(status)
    ) {
      lifecycle.push({
        status: 'accepted',
        timestamp: new Date(createdAt.getTime() + 30 * 60 * 1000).toISOString(),
        actor: 'dispatcher',
        note: 'Load accepted',
      })
    }

    if (
      [
        'dispatched',
        'in_transit',
        'at_pickup',
        'at_delivery',
        'delivered',
      ].includes(status)
    ) {
      lifecycle.push({
        status: 'dispatched',
        timestamp: new Date(createdAt.getTime() + 60 * 60 * 1000).toISOString(),
        actor: 'dispatcher',
        note: `Dispatched to ${assignedTruckId}`,
      })
    }

    if (['in_transit', 'at_delivery', 'delivered'].includes(status)) {
      lifecycle.push({
        status: 'in_transit',
        timestamp: pickupEnd.toISOString(),
        actor: 'driver',
        note: 'Departed pickup location',
      })
    }

    if (status === 'delivered') {
      lifecycle.push({
        status: 'delivered',
        timestamp: deliveryEnd.toISOString(),
        actor: 'driver',
        note: 'Delivery completed',
      })
    }

    // Communications
    const communications: Array<CommunicationEntry> = []
    const commCount = randomInt(rng, 1, 3)
    for (let c = 0; c < commCount; c++) {
      communications.push({
        id: `comm-${id}-${c}`,
        timestamp: new Date(
          createdAt.getTime() + randomInt(rng, 0, 24) * 60 * 60 * 1000,
        ).toISOString(),
        source: pick(rng, ['dispatcher', 'driver', 'ai_agent', 'shipper']),
        type: pick(rng, ['note', 'call', 'text']),
        content: pick(rng, [
          'Driver confirmed pickup time',
          'ETA updated',
          'Delay due to traffic',
          'Shipper requested earlier pickup',
          'Load secured and ready',
        ]),
        isAi: rng() > 0.7,
      })
    }

    // Documents
    const documents: Array<LoadDocument> = []
    const docCount = randomInt(rng, 0, 3)
    const docTypes: Array<
      | 'bol'
      | 'pod'
      | 'rate_confirmation'
      | 'scale_ticket'
      | 'lumper_receipt'
      | 'other'
    > = ['bol', 'rate_confirmation', 'pod']
    for (let d = 0; d < docCount; d++) {
      const docType = pick(rng, docTypes)
      documents.push({
        id: `doc-${id}-${d}`,
        type: docType,
        name: `${docType.toUpperCase()}_${id}.pdf`,
        thumbnailUrl: '/placeholder-doc.png',
        uploadedAt: new Date(
          createdAt.getTime() + randomInt(rng, 1, 24) * 60 * 60 * 1000,
        ).toISOString(),
        status: pick(rng, ['received', 'pending']),
      })
    }

    // Route polyline
    const routePolyline = generateRoutePolyline(
      origin.position,
      destination.position,
      randomInt(rng, 20, 40),
    )

    // Current position (for in-transit loads)
    let currentPosition: LatLng | null = null
    if (status === 'in_transit' && assignedTruckId) {
      const progress = rng()
      const idx = Math.floor(progress * routePolyline.length)
      currentPosition = routePolyline[idx]
      trucks[assignedTruckId].position = currentPosition
    }

    loads[id] = {
      id,
      type,
      status,
      origin: originStop,
      destination: destStop,
      stops: [originStop, destStop],
      commodity: pick(rng, commodities),
      weight: randomInt(rng, 10000, 45000),
      equipmentRequired,
      temperature:
        equipmentRequired === 'reefer' ? randomInt(rng, -10, 40) : null,
      rate,
      ratePerMile,
      distance,
      fuelSurcharge,
      accessorials,
      totalRevenue,
      carrierCost,
      margin,
      marginPercent,
      assignedTruckId,
      assignedDriverId,
      assignedCarrierId:
        type === 'brokered'
          ? `CAR-${String(randomInt(rng, 1, 25)).padStart(3, '0')}`
          : null,
      shipperId: pick(rng, shipperIds),
      referenceNumbers: [`REF-${randomInt(rng, 10000, 99999)}`],
      specialInstructions:
        rng() > 0.5
          ? pick(rng, [
              'Call before arrival',
              'Tailgate delivery required',
              'Inside delivery',
              '',
            ])
          : '',
      lifecycle,
      documents,
      communications,
      routePolyline,
      currentPosition,
      createdAt: createdAt.toISOString(),
      updatedAt: now.toISOString(),
    }
  }

  return loads
}

/* ─── Exception Generator ─────────────────────────────────────── */

export function generateExceptions(
  loads: Record<string, Load>,
  trucks: Record<string, Truck>,
): Record<string, Exception> {
  const rng = createRng(8001)
  const exceptions: Record<string, Exception> = {}

  const loadIds = Object.keys(loads)
  const truckIds = Object.keys(trucks)

  const exceptionTypes: Array<
    [ExceptionType, ExceptionSeverity, string, string]
  > = [
    [
      'late_pickup',
      'critical',
      'Late Pickup Risk',
      'Truck T-217 is 45 minutes behind schedule due to traffic on I-75',
    ],
    [
      'late_delivery',
      'warning',
      'Late Delivery Risk',
      'Load LD-4521 may arrive 30 minutes past appointment window',
    ],
    [
      'hos_violation_risk',
      'warning',
      'HOS Violation Risk',
      'Driver has only 45 minutes of drive time remaining',
    ],
    [
      'maintenance_due',
      'info',
      'Maintenance Due Soon',
      'Truck T-301 is within 1,000 miles of scheduled maintenance',
    ],
    [
      'detention',
      'warning',
      'Detention at Facility',
      'Driver waiting 2+ hours at pickup location',
    ],
    [
      'weather',
      'warning',
      'Weather Delay',
      'Winter storm warning along I-40 corridor affecting 3 loads',
    ],
    [
      'breakdown',
      'critical',
      'Equipment Breakdown',
      'Truck T-405 reported mechanical issue, awaiting roadside assistance',
    ],
    [
      'late_pickup',
      'critical',
      'Late Pickup',
      'Missed pickup window by 2 hours',
    ],
    [
      'hos_violation_risk',
      'critical',
      'HOS Violation Imminent',
      'Driver will exceed 11-hour limit in 15 minutes',
    ],
    [
      'late_delivery',
      'critical',
      'Late Delivery',
      'Missed delivery appointment, receiver closed',
    ],
  ]

  for (let i = 0; i < 10; i++) {
    const id = `EXC-${String(i + 1).padStart(3, '0')}`
    const [type, severity, title, description] =
      exceptionTypes[i % exceptionTypes.length]

    const loadId = i < 7 ? pick(rng, loadIds) : null
    const truckId = i < 8 ? pick(rng, truckIds) : null
    const driverId = truckId ? trucks[truckId].driverId : null

    const aiSuggestions = [
      'Extend pickup window by 1 hour and notify shipper',
      'Consider relay at Birmingham hub to meet delivery window',
      'Suggest driver take 30-minute break now to avoid violation',
      'Schedule maintenance for next empty backhaul',
      'Request detention pay after 2 hours',
      'Reroute via I-65 to avoid weather delay',
      'Dispatch roadside assistance, estimated 90 min arrival',
      'Reassign load to available truck T-225',
    ]

    exceptions[id] = {
      id,
      type,
      severity,
      loadId,
      truckId,
      driverId,
      title,
      description,
      detectedAt: new Date(
        Date.now() - randomInt(rng, 5, 120) * 60 * 1000,
      ).toISOString(),
      resolvedAt: null,
      aiSuggestion: pick(rng, aiSuggestions),
      status: 'active',
    }
  }

  return exceptions
}

/* ─── Time Event Generator ────────────────────────────────────── */

export function generateTimeEvents(): Array<TimeEvent> {
  const events: Array<TimeEvent> = []

  // Minutes 0-120: pickup_complete (2), delivery_complete (1)
  events.push({
    triggerMinute: 30,
    type: 'pickup_complete',
    targetEntityId: 'LD-4510',
    description: 'Pickup completed for LD-4510',
    data: { location: 'ATL' },
  })

  events.push({
    triggerMinute: 75,
    type: 'pickup_complete',
    targetEntityId: 'LD-4515',
    description: 'Pickup completed for LD-4515',
    data: { location: 'MEM' },
  })

  events.push({
    triggerMinute: 110,
    type: 'delivery_complete',
    targetEntityId: 'LD-4502',
    description: 'Delivery completed for LD-4502',
    data: { location: 'NSH' },
  })

  // Minutes 120-240: late_delivery for T-217
  events.push({
    triggerMinute: 150,
    type: 'late_delivery',
    targetEntityId: 'T-217',
    description: 'T-217 experiencing traffic delay on I-75',
    data: { delay: 45, reason: 'traffic' },
  })

  // Minutes 240-360: load_tender (2)
  events.push({
    triggerMinute: 270,
    type: 'load_tender',
    targetEntityId: 'LD-4580',
    description: 'New load tender LD-4580 from Piedmont Steel',
    data: { shipper: 'SHP-001', route: 'ATL-MEM' },
  })

  events.push({
    triggerMinute: 320,
    type: 'load_tender',
    targetEntityId: 'LD-4581',
    description: 'New load tender LD-4581 from Carolina Chemical',
    data: { shipper: 'SHP-002', route: 'CLT-JAX' },
  })

  // Minutes 360-480: hos_expiry for a driver
  events.push({
    triggerMinute: 420,
    type: 'hos_expiry',
    targetEntityId: 'DRV-012',
    description: 'DRV-012 approaching HOS limit',
    data: { remainingMinutes: 30 },
  })

  // Minutes 480-600: weather affecting 3 loads
  events.push({
    triggerMinute: 520,
    type: 'weather',
    targetEntityId: 'LD-4525',
    description: 'Winter storm warning affecting LD-4525',
    data: {
      severity: 'moderate',
      affectedLoads: ['LD-4525', 'LD-4530', 'LD-4535'],
    },
  })

  events.push({
    triggerMinute: 530,
    type: 'weather',
    targetEntityId: 'LD-4530',
    description: 'Winter storm warning affecting LD-4530',
    data: { severity: 'moderate' },
  })

  events.push({
    triggerMinute: 540,
    type: 'weather',
    targetEntityId: 'LD-4535',
    description: 'Winter storm warning affecting LD-4535',
    data: { severity: 'moderate' },
  })

  // Minutes 600-720: end-of-day events
  events.push({
    triggerMinute: 650,
    type: 'delivery_complete',
    targetEntityId: 'LD-4540',
    description: 'End-of-day delivery completed LD-4540',
    data: { location: 'BHM' },
  })

  events.push({
    triggerMinute: 700,
    type: 'pickup_complete',
    targetEntityId: 'LD-4545',
    description: 'Late pickup completed LD-4545',
    data: { location: 'CLT' },
  })

  return events
}
