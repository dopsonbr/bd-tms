# FreightOS Implementation Plan — Part 1: Foundation

> **Stage 1** covers the data layer, app shell, navigation, dashboard, fleet map, load list,
> and all shared components. When complete the app has real navigation, live demo data,
> and three interactive screens (Dashboard, Fleet, Loads).

---

## Table of Contents

1. [Dependencies](#1-dependencies)
2. [Theme Tokens](#2-theme-tokens)
3. [Data Model — TypeScript Interfaces](#3-data-model)
4. [Constants](#4-constants)
5. [Mock Data Generators](#5-mock-data-generators)
6. [Zustand Store](#6-zustand-store)
7. [Custom Hooks](#7-custom-hooks)
8. [Utility Libraries](#8-utility-libraries)
9. [App Shell & Navigation](#9-app-shell--navigation)
10. [Dashboard Screen](#10-dashboard-screen)
11. [Fleet Screen](#11-fleet-screen)
12. [Load List Screen](#12-load-list-screen)
13. [Shared Components](#13-shared-components)
14. [File Creation Order](#14-file-creation-order)

---

## 1. Dependencies

### 1.1 Install Runtime Dependencies

```bash
bun add zustand leaflet react-leaflet @types/leaflet date-fns
```

| Package          | Purpose                                                   |
| ---------------- | --------------------------------------------------------- |
| `zustand`        | Lightweight state management with slices pattern          |
| `leaflet`        | Map rendering engine (lighter than Mapbox, no API key)    |
| `react-leaflet`  | React bindings for Leaflet                                |
| `@types/leaflet` | TypeScript definitions for Leaflet                        |
| `date-fns`       | Date formatting/math (tree-shakeable, no moment.js bloat) |

### 1.2 Add shadcn Components

Run each command from the project root:

```bash
npx shadcn@latest add tabs
npx shadcn@latest add skeleton
npx shadcn@latest add scroll-area
npx shadcn@latest add sheet
npx shadcn@latest add avatar
npx shadcn@latest add progress
npx shadcn@latest add tooltip
npx shadcn@latest add toggle
npx shadcn@latest add switch
npx shadcn@latest add dialog
```

These go into `src/components/ui/` and follow the existing base-nova + CVA pattern.

---

## 2. Theme Tokens

### 2.1 FreightOS Color Tokens — `src/styles.css`

Add these custom properties inside the existing `:root` block, **after** the current
shadcn tokens. These are the design-doc colors converted to OKLCh.

```css
/* --- FreightOS Status Colors --- */
--freight-navy: oklch(0.18 0.04 255); /* #0F1B2D */
--freight-accent: oklch(0.58 0.18 250); /* #2D7FF9 */
--freight-success: oklch(0.68 0.17 163); /* #00B67A */
--freight-warning: oklch(0.76 0.14 75); /* #F5A623 */
--freight-critical: oklch(0.57 0.22 27); /* #E74C3C */
--freight-idle: oklch(0.66 0.02 250); /* #8E99A4 */
--freight-ai: oklch(0.53 0.22 285); /* #7C5CFC */

/* --- FreightOS Surfaces --- */
--freight-bg: oklch(0.97 0.005 250); /* #F5F7FA */
--freight-card: oklch(1 0 0); /* #FFFFFF */
--freight-overlay: oklch(0.18 0.04 255 / 60%); /* navy 60% */

/* --- Spacing shortcuts --- */
--freight-tab-height: 56px;
--freight-safe-bottom: env(safe-area-inset-bottom, 0px);
```

### 2.2 Map-Specific Styles

Add to `src/styles.css` at the bottom, outside `@layer base`:

```css
/* Leaflet overrides for mobile */
.leaflet-container {
  width: 100%;
  height: 100%;
  z-index: 0;
  font-family: var(--font-sans);
}
.leaflet-control-zoom {
  border: none !important;
}
.leaflet-popup-content-wrapper {
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px oklch(0 0 0 / 8%);
}
```

---

## 3. Data Model

### File: `src/data/types.ts`

Every interface is fully specified below. Copy the entire block.

```ts
/* ─── Primitives ─────────────────────────────────────────────── */

export type LatLng = { lat: number; lng: number }

export type EntityId = string // e.g. 'T-201', 'DRV-001', 'LD-4521'

export type EquipmentType =
  | 'dry_van'
  | 'reefer'
  | 'flatbed'
  | 'step_deck'
  | 'tanker'

export type TruckStatus =
  | 'en_route'
  | 'at_pickup'
  | 'at_delivery'
  | 'empty'
  | 'out_of_service'
  | 'at_rest'
  | 'loading'
  | 'unloading'

export type LoadStatus =
  | 'tendered'
  | 'accepted'
  | 'dispatched'
  | 'in_transit'
  | 'at_pickup'
  | 'loaded'
  | 'at_delivery'
  | 'delivered'
  | 'pod_received'
  | 'invoiced'
  | 'cancelled'

export type LoadType = 'carrier' | 'brokered'

export type DriverHosPhase =
  | 'driving'
  | 'on_duty'
  | 'sleeper_berth'
  | 'off_duty'
  | 'reset_34h'

export type ExceptionSeverity = 'critical' | 'warning' | 'info'

export type ExceptionType =
  | 'late_pickup'
  | 'late_delivery'
  | 'hos_violation_risk'
  | 'maintenance_due'
  | 'detention'
  | 'weather'
  | 'breakdown'
  | 'shipper_cancel'
  | 'rate_change'

export type CallDirection = 'inbound' | 'outbound'
export type CallOutcome = 'resolved' | 'transferred' | 'failed' | 'in_progress'
export type Sentiment = 'positive' | 'neutral' | 'negative'

/* ─── Core Entities ──────────────────────────────────────────── */

export interface Truck {
  id: EntityId // 'T-201'
  equipmentType: EquipmentType
  status: TruckStatus
  position: LatLng
  heading: number // degrees 0-360
  currentLoadId: EntityId | null
  driverId: EntityId | null
  trailerId: EntityId | null
  mileage: number
  nextMaintenanceMiles: number
  hub: string // 'ATL', 'MEM', etc.
  speed: number // mph, 0 when stopped
}

export interface Driver {
  id: EntityId // 'DRV-001'
  name: string
  phone: string
  photoUrl: string | null
  cdlNumber: string
  cdlExpiry: string // ISO date
  endorsements: string[] // 'H', 'T', 'N', etc.
  homeBase: string // city code
  truckId: EntityId | null
  hos: HosStatus
  performanceScore: number // 0-100
  preferredLanes: string[] // 'ATL-MEM', 'MEM-NSH'
  status: 'available' | 'driving' | 'on_duty' | 'off_duty' | 'reset'
  certifiedEquipment: EquipmentType[]
  hireDate: string // ISO date
}

export interface HosStatus {
  phase: DriverHosPhase
  driveRemaining: number // minutes
  onDutyRemaining: number // minutes
  cycleRemaining: number // minutes (70-hr / 8-day)
  nextBreakDue: number // minutes until 30-min break required
  resetStartedAt: string | null // ISO datetime
  lastUpdated: string // ISO datetime
}

export interface Load {
  id: EntityId // 'LD-4521'
  type: LoadType
  status: LoadStatus
  origin: FacilityStop
  destination: FacilityStop
  stops: FacilityStop[] // for multi-stop; includes origin & dest
  commodity: string
  weight: number // lbs
  equipmentRequired: EquipmentType
  temperature: number | null // for reefer, fahrenheit
  rate: number // dollars
  ratePerMile: number
  distance: number // miles
  fuelSurcharge: number
  accessorials: Accessorial[]
  totalRevenue: number
  carrierCost: number | null // for brokered loads
  margin: number | null // for brokered loads
  marginPercent: number | null
  assignedTruckId: EntityId | null
  assignedDriverId: EntityId | null
  assignedCarrierId: EntityId | null // for brokered
  shipperId: EntityId
  referenceNumbers: string[]
  specialInstructions: string
  lifecycle: LifecycleEvent[]
  documents: LoadDocument[]
  communications: CommunicationEntry[]
  routePolyline: LatLng[] // array of points for map line
  currentPosition: LatLng | null // truck position on route
  createdAt: string // ISO datetime
  updatedAt: string
}

export interface FacilityStop {
  facilityId: EntityId
  facilityName: string
  address: string
  city: string
  state: string
  position: LatLng
  appointmentWindow: { start: string; end: string } // ISO datetimes
  actualArrival: string | null
  actualDeparture: string | null
  stopType: 'pickup' | 'delivery' | 'stop'
  status: 'pending' | 'arrived' | 'loading' | 'completed'
  sequence: number
}

export interface Accessorial {
  type: 'detention' | 'layover' | 'lumper' | 'tonu' | 'fuel_surcharge' | 'other'
  description: string
  amount: number
}

export interface LifecycleEvent {
  status: LoadStatus
  timestamp: string // ISO datetime
  actor: string // 'system', 'dispatcher', 'driver', 'ai'
  note: string
}

export interface LoadDocument {
  id: string
  type:
    | 'bol'
    | 'pod'
    | 'rate_confirmation'
    | 'scale_ticket'
    | 'lumper_receipt'
    | 'other'
  name: string
  thumbnailUrl: string // placeholder image
  uploadedAt: string
  status: 'received' | 'pending' | 'missing'
}

export interface CommunicationEntry {
  id: string
  timestamp: string
  source:
    | 'dispatcher'
    | 'driver'
    | 'ai_agent'
    | 'system'
    | 'shipper'
    | 'carrier'
  type: 'note' | 'call' | 'text' | 'voice_transcript' | 'system_event'
  content: string
  isAi: boolean
}

/* ─── Brokerage Entities ─────────────────────────────────────── */

export interface Shipper {
  id: EntityId // 'SHP-001'
  name: string
  contactName: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  industry: string // 'manufacturing', 'distribution', etc.
  activeLoadCount: number
  averageVolume: number // loads per week
  averageRate: number // per mile
  paymentTerms: number // days
  lanes: LaneHistory[]
}

export interface LaneHistory {
  origin: string // city code
  destination: string
  loadCount: number
  averageRate: number
  lastShipped: string // ISO date
}

export interface Carrier {
  id: EntityId // 'CAR-001'
  name: string
  contactName: string
  phone: string
  email: string
  mcNumber: string
  dotNumber: string
  fleetSize: number
  equipmentTypes: EquipmentType[]
  serviceArea: string[] // state codes
  scorecard: CarrierScorecard
  status: 'active' | 'pending' | 'suspended'
  preferredLanes: string[]
  insuranceExpiry: string // ISO date
  paymentTerms: 'standard_30' | 'quick_pay'
}

export interface CarrierScorecard {
  onTimePickup: number // percentage
  onTimeDelivery: number
  claimsRatio: number // percentage
  communicationScore: number // 0-100
  overallScore: number // 0-100
  totalLoads: number
  lastLoadDate: string // ISO date
}

/* ─── Facilities ─────────────────────────────────────────────── */

export interface Facility {
  id: EntityId // 'FAC-001'
  name: string
  address: string
  city: string
  state: string
  position: LatLng
  type:
    | 'shipper_warehouse'
    | 'receiver_warehouse'
    | 'distribution_center'
    | 'port'
    | 'rail_yard'
    | 'truck_stop'
  operatingHours: { open: string; close: string } // 'HH:MM'
  averageDwellTime: number // minutes
  hasDropTrailer: boolean
  dockCount: number
}

/* ─── Trailer ────────────────────────────────────────────────── */

export interface Trailer {
  id: EntityId // 'TRL-001'
  type: EquipmentType
  status: 'loaded' | 'empty' | 'in_maintenance'
  position: LatLng
  assignedTruckId: EntityId | null
  assignedLoadId: EntityId | null
  lastInspection: string // ISO date
}

/* ─── Exceptions / Notifications ─────────────────────────────── */

export interface Exception {
  id: string
  type: ExceptionType
  severity: ExceptionSeverity
  loadId: EntityId | null
  truckId: EntityId | null
  driverId: EntityId | null
  title: string
  description: string
  detectedAt: string // ISO datetime
  resolvedAt: string | null
  aiSuggestion: string | null
  status: 'active' | 'acknowledged' | 'resolved'
}

export interface Notification {
  id: string
  priority: 'critical' | 'warning' | 'info'
  title: string
  body: string
  relatedEntityType: 'load' | 'truck' | 'driver' | 'carrier' | 'system'
  relatedEntityId: EntityId | null
  createdAt: string
  readAt: string | null
  snoozedUntil: string | null
}

/* ─── Voice Agent ────────────────────────────────────────────── */

export interface VoiceCall {
  id: string
  direction: CallDirection
  callerName: string
  callerCompany: string
  callerPhone: string
  topic: string
  startedAt: string
  endedAt: string | null
  duration: number // seconds
  outcome: CallOutcome
  sentiment: Sentiment
  confidence: number // 0-100
  transcript: TranscriptLine[]
  systemActions: SystemAction[]
  summary: string | null
  relatedLoadId: EntityId | null
}

export interface TranscriptLine {
  speaker: 'caller' | 'agent'
  text: string
  timestamp: number // seconds from call start
}

export interface SystemAction {
  timestamp: number // seconds from call start
  action: string // 'Searching for Load #4521...'
  result: string | null // 'Found: ATL→MEM, ETA 4:30 PM'
}

/* ─── AI Dispatch ────────────────────────────────────────────── */

export interface DispatchRecommendation {
  id: string
  loadId: EntityId
  truckId: EntityId
  driverId: EntityId
  score: number // 0-100
  confidence: 'high' | 'medium' | 'low'
  factors: MatchFactor[]
  status: 'pending' | 'accepted' | 'rejected' | 'modified'
}

export interface MatchFactor {
  name: string // 'deadhead_miles', 'hos_remaining', etc.
  value: string // '18 mi', '9.2 hrs'
  score: number // 0-100 contribution
  description: string
}

/* ─── Chat ───────────────────────────────────────────────────── */

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  richContent: RichContent | null
  actions: ChatAction[]
}

export interface RichContent {
  type: 'truck_comparison' | 'load_detail' | 'recommendation_cards' | 'mini_map'
  data: Record<string, unknown>
}

export interface ChatAction {
  label: string
  action: string // handler key
  entityId: EntityId | null
}

/* ─── Demo / Time ────────────────────────────────────────────── */

export interface TimeEvent {
  triggerMinute: number // minutes from sim start
  type:
    | ExceptionType
    | 'load_tender'
    | 'delivery_complete'
    | 'pickup_complete'
    | 'hos_expiry'
  targetEntityId: EntityId
  description: string
  data: Record<string, unknown>
}

export interface DemoScenario {
  id: string
  name: string
  description: string
  icon: string
  initialState: Partial<StoreState>
}

export interface StoreState {
  trucks: Record<EntityId, Truck>
  drivers: Record<EntityId, Driver>
  loads: Record<EntityId, Load>
  shippers: Record<EntityId, Shipper>
  carriers: Record<EntityId, Carrier>
  facilities: Record<EntityId, Facility>
  trailers: Record<EntityId, Trailer>
  exceptions: Record<string, Exception>
  notifications: Notification[]
  voiceCalls: VoiceCall[]
  recommendations: DispatchRecommendation[]
  chatMessages: ChatMessage[]
  timeEvents: TimeEvent[]
  simulatedTime: string // ISO datetime
  selectedScenario: string | null
}
```

**Line count:** ~280 lines. Every entity the app needs is defined here.

---

## 4. Constants

### File: `src/data/constants.ts`

```ts
import type {
  EquipmentType,
  ExceptionSeverity,
  LoadStatus,
  TruckStatus,
  LatLng,
} from './types'

/* ─── Status → Color mapping (Tailwind classes) ──────────────── */

export const TRUCK_STATUS_COLOR: Record<TruckStatus, string> = {
  en_route: 'bg-freight-accent text-white',
  at_pickup: 'bg-freight-warning text-freight-navy',
  at_delivery: 'bg-freight-warning text-freight-navy',
  empty: 'bg-freight-idle text-white',
  out_of_service: 'bg-freight-critical text-white',
  at_rest: 'bg-muted text-muted-foreground',
  loading: 'bg-freight-warning text-freight-navy',
  unloading: 'bg-freight-warning text-freight-navy',
}

export const LOAD_STATUS_COLOR: Record<LoadStatus, string> = {
  tendered: 'bg-muted text-muted-foreground',
  accepted: 'bg-freight-accent/15 text-freight-accent',
  dispatched: 'bg-freight-accent/15 text-freight-accent',
  in_transit: 'bg-freight-accent text-white',
  at_pickup: 'bg-freight-warning/15 text-freight-warning',
  loaded: 'bg-freight-accent text-white',
  at_delivery: 'bg-freight-warning/15 text-freight-warning',
  delivered: 'bg-freight-success/15 text-freight-success',
  pod_received: 'bg-freight-success text-white',
  invoiced: 'bg-freight-success text-white',
  cancelled: 'bg-freight-critical/15 text-freight-critical',
}

export const LOAD_STATUS_LABEL: Record<LoadStatus, string> = {
  tendered: 'Tendered',
  accepted: 'Accepted',
  dispatched: 'Dispatched',
  in_transit: 'In Transit',
  at_pickup: 'At Pickup',
  loaded: 'Loaded',
  at_delivery: 'At Delivery',
  delivered: 'Delivered',
  pod_received: 'POD Received',
  invoiced: 'Invoiced',
  cancelled: 'Cancelled',
}

export const SEVERITY_COLOR: Record<ExceptionSeverity, string> = {
  critical: 'bg-freight-critical text-white',
  warning: 'bg-freight-warning text-freight-navy',
  info: 'bg-freight-accent/15 text-freight-accent',
}

export const EQUIPMENT_LABEL: Record<EquipmentType, string> = {
  dry_van: 'Dry Van',
  reefer: 'Reefer',
  flatbed: 'Flatbed',
  step_deck: 'Step Deck',
  tanker: 'Tanker',
}

/* ─── Load lifecycle order (for stepper) ─────────────────────── */

export const LOAD_LIFECYCLE_ORDER: LoadStatus[] = [
  'tendered',
  'accepted',
  'dispatched',
  'in_transit',
  'at_pickup',
  'loaded',
  'at_delivery',
  'delivered',
  'pod_received',
  'invoiced',
]

/* ─── Hub coordinates ────────────────────────────────────────── */

export const HUBS: Record<string, { label: string; position: LatLng }> = {
  ATL: { label: 'Atlanta, GA', position: { lat: 33.749, lng: -84.388 } },
  MEM: { label: 'Memphis, TN', position: { lat: 35.1495, lng: -90.049 } },
  NSH: { label: 'Nashville, TN', position: { lat: 36.1627, lng: -86.7816 } },
  CLT: { label: 'Charlotte, NC', position: { lat: 35.2271, lng: -80.8431 } },
  JAX: { label: 'Jacksonville, FL', position: { lat: 30.3322, lng: -81.6557 } },
  BHM: { label: 'Birmingham, AL', position: { lat: 33.5207, lng: -86.8025 } },
}

export const MAP_CENTER: LatLng = { lat: 33.5, lng: -84.5 }
export const MAP_DEFAULT_ZOOM = 7

/* ─── Tab navigation ─────────────────────────────────────────── */

export const NAV_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  { id: 'loads', label: 'Loads', icon: 'Package', path: '/loads' },
  { id: 'fleet', label: 'Fleet', icon: 'Truck', path: '/fleet' },
  { id: 'ai', label: 'AI', icon: 'Sparkles', path: '/ai' },
  { id: 'more', label: 'More', icon: 'Menu', path: '/more' },
] as const

/* ─── Quick Actions ──────────────────────────────────────────── */

export const QUICK_ACTIONS = [
  { id: 'new_load', label: 'New Load', icon: 'Plus', color: 'freight-accent' },
  {
    id: 'dispatch_ai',
    label: 'Dispatch AI',
    icon: 'Sparkles',
    color: 'freight-ai',
  },
  {
    id: 'voice_agent',
    label: 'Voice Agent',
    icon: 'Phone',
    color: 'freight-success',
  },
  {
    id: 'find_truck',
    label: 'Find Truck',
    icon: 'MapPin',
    color: 'freight-warning',
  },
] as const

/* ─── Margin thresholds (for color-coding) ───────────────────── */

export const MARGIN_THRESHOLDS = {
  good: 15, // >= 15% → green
  warning: 8, // >= 8% → yellow
  // below 8% → red
}
```

---

## 5. Mock Data Generators

### File: `src/data/generators.ts`

This file exports factory functions that produce the full seed dataset. Each function
is self-contained and deterministic (seeded via simple counter, no `Math.random()`
in hot paths so data is stable across reloads).

```ts
import type { ... } from './types'   // import every type
import { HUBS } from './constants'

// Pseudo-random seeded generator (simple LCG)
function createRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

export function generateTrucks(): Record<string, Truck> { ... }
export function generateDrivers(trucks: ...): Record<string, Driver> { ... }
export function generateShippers(): Record<string, Shipper> { ... }
export function generateCarriers(): Record<string, Carrier> { ... }
export function generateFacilities(): Record<string, Facility> { ... }
export function generateLoads(trucks, drivers, shippers, facilities): Record<string, Load> { ... }
export function generateTrailers(trucks): Record<string, Trailer> { ... }
export function generateExceptions(loads, trucks): Record<string, Exception> { ... }
export function generateTimeEvents(): TimeEvent[] { ... }
export function generateRoutePolyline(from: LatLng, to: LatLng, points?: number): LatLng[] { ... }
```

#### 5.1 `generateTrucks()` — 45 trucks

```
IDs:  T-201..T-230 (dry_van), T-301..T-310 (reefer), T-401..T-405 (flatbed)
```

For each truck, distribute across hubs using round-robin:

```ts
const hubKeys = Object.keys(HUBS) // ATL, MEM, NSH, CLT, JAX, BHM
// truck index % hubKeys.length → hub assignment
```

Fields:

- `position`: hub position + small random offset (±0.3 degrees)
- `heading`: random 0–360
- `status`: weighted distribution — 40% en_route, 15% at_pickup, 10% at_delivery, 20% empty, 10% at_rest, 5% out_of_service
- `mileage`: 50,000–350,000
- `nextMaintenanceMiles`: mileage + 5,000–25,000
- `speed`: 0 if not en_route, 35–65 if en_route
- `currentLoadId` / `driverId`: set to `null` initially; wired up after drivers & loads are generated

#### 5.2 `generateDrivers()` — 30 drivers

```
IDs:  DRV-001..DRV-030
```

Use realistic Southeast US names. Distribute HOS:

- 8 drivers with 480+ min drive remaining (8+ hrs)
- 10 drivers with 240–480 min (4–8 hrs)
- 7 drivers with < 240 min (< 4 hrs)
- 5 drivers on 34-hour reset (`phase: 'reset_34h'`)

Assign 30 drivers to 30 trucks (the remaining 15 trucks are spare / in maintenance).

Performance scores: range 72–98, normally distributed around 86.

#### 5.3 `generateShippers()` — 15 shippers

```
IDs:  SHP-001..SHP-015
```

Use realistic company names by industry:

- Manufacturing: "Piedmont Steel Works", "Carolina Chemical Supply", etc.
- Distribution: "Southeast Distribution Co", "Peach State Logistics", etc.
- Retail: "Dixie Home Furnishings", "SunBelt Auto Parts", etc.
- Food/Bev: "Golden Harvest Foods", "Blue Ridge Beverages", etc.

Each shipper gets 3–8 `activeLoadCount` and 2–5 lane histories covering the primary
hub-to-hub routes.

#### 5.4 `generateCarriers()` — 25 partner carriers

```
IDs:  CAR-001..CAR-025
```

Fleet sizes: 1–10 trucks. Scorecards:

- `onTimePickup`: 78–99%
- `onTimeDelivery`: 80–99%
- `claimsRatio`: 0.2–4.5%
- `communicationScore`: 60–98
- `overallScore`: weighted composite

#### 5.5 `generateFacilities()` — 40 facilities

Distribute across Southeast US. Types:

- 15 shipper warehouses
- 12 receiver warehouses
- 8 distribution centers
- 3 truck stops
- 2 rail yards

Each has GPS coordinates within the regional network.

#### 5.6 `generateLoads()` — 80 loads

```
IDs:  LD-4500..LD-4579
```

Status distribution per requirements:

- 20 in_transit
- 15 at_pickup
- 10 at_delivery
- 12 dispatched (pending pickup)
- 8 delivered (today)
- 15 tendered/accepted (planned for tomorrow)

Type split: 55 carrier, 25 brokered.

Rate ranges:

- Local (< 200mi): $1.80–$2.50/mi
- Regional (200–500mi): $2.20–$3.00/mi
- Long-haul (500+mi): $2.50–$3.50/mi

For brokered loads, `carrierCost` = rate × (1 - margin), where margin is 8–22%.

Each load gets a `routePolyline` generated via `generateRoutePolyline()` with 20–40
intermediate points following a great-circle-ish arc between origin/dest.

#### 5.7 `generateExceptions()` — 8–12 active exceptions

Distribute across the exception types. Each references a real load/truck from the
generated data. AI suggestions are realistic strings.

#### 5.8 `generateTimeEvents()` — 12 events

Follows the design doc timeline:

- Minutes 0–120: 2 pickup complete, 1 delivery complete
- Minutes 120–240: truck T-217 traffic delay → late exception
- Minutes 240–360: 2 new load tenders
- Minutes 360–480: driver HOS expiry on T-225
- Minutes 480–600: weather alert affecting 3 loads
- Minutes 600–720: end-of-day wrap-up events

### File: `src/data/seed.ts`

```ts
import { generateTrucks, generateDrivers, ... } from './generators'
import type { StoreState } from './types'

export function createSeedState(): StoreState {
  const trucks = generateTrucks()
  const drivers = generateDrivers(trucks)
  const shippers = generateShippers()
  const carriers = generateCarriers()
  const facilities = generateFacilities()
  const loads = generateLoads(trucks, drivers, shippers, facilities)
  const trailers = generateTrailers(trucks)
  const exceptions = generateExceptions(loads, trucks)
  const timeEvents = generateTimeEvents()

  // Wire up cross-references
  // - assign driverId to trucks, truckId to drivers
  // - assign loadId to trucks that are en_route/at_pickup/at_delivery
  // - set currentPosition on in-transit loads

  return {
    trucks,
    drivers,
    loads,
    shippers,
    carriers,
    facilities,
    trailers,
    exceptions,
    notifications: [],
    voiceCalls: [],
    recommendations: [],
    chatMessages: [],
    timeEvents,
    simulatedTime: new Date().toISOString(),
    selectedScenario: null,
  }
}
```

---

## 6. Zustand Store

### Architecture: Sliced Store Pattern

The store uses Zustand's sliced pattern. Each slice is a separate file that exports
a creator function. The root store combines them.

### File: `src/store/index.ts`

```ts
import { create } from 'zustand'
import { createFleetSlice, type FleetSlice } from './fleet-slice'
import { createDriverSlice, type DriverSlice } from './driver-slice'
import { createLoadSlice, type LoadSlice } from './load-slice'
import { createShipperSlice, type ShipperSlice } from './shipper-slice'
import { createCarrierSlice, type CarrierSlice } from './carrier-slice'
import { createTimeSlice, type TimeSlice } from './time-slice'
import { createUiSlice, type UiSlice } from './ui-slice'
import {
  createNotificationSlice,
  type NotificationSlice,
} from './notification-slice'
import { createSeedState } from '@/data/seed'

export type AppStore = FleetSlice &
  DriverSlice &
  LoadSlice &
  ShipperSlice &
  CarrierSlice &
  TimeSlice &
  UiSlice &
  NotificationSlice

export const useAppStore = create<AppStore>()((...args) => ({
  ...createFleetSlice(...args),
  ...createDriverSlice(...args),
  ...createLoadSlice(...args),
  ...createShipperSlice(...args),
  ...createCarrierSlice(...args),
  ...createTimeSlice(...args),
  ...createUiSlice(...args),
  ...createNotificationSlice(...args),
}))

// Initialize with seed data on first import
const seed = createSeedState()
useAppStore.setState(seed)
```

### 6.1 Fleet Slice — `src/store/fleet-slice.ts`

```ts
import type { StateCreator } from 'zustand'
import type { Truck, EntityId, TruckStatus } from '@/data/types'

export interface FleetSlice {
  trucks: Record<EntityId, Truck>
  updateTruckPosition: (id: EntityId, lat: number, lng: number) => void
  updateTruckStatus: (id: EntityId, status: TruckStatus) => void
  assignDriverToTruck: (truckId: EntityId, driverId: EntityId) => void
  getTrucksByStatus: (status: TruckStatus) => Truck[]
  getTrucksByHub: (hub: string) => Truck[]
}

export const createFleetSlice: StateCreator<FleetSlice, [], [], FleetSlice> = (
  set,
  get,
) => ({
  trucks: {},
  updateTruckPosition: (id, lat, lng) =>
    set((state) => ({
      trucks: {
        ...state.trucks,
        [id]: { ...state.trucks[id], position: { lat, lng } },
      },
    })),
  updateTruckStatus: (id, status) =>
    set((state) => ({
      trucks: {
        ...state.trucks,
        [id]: { ...state.trucks[id], status },
      },
    })),
  assignDriverToTruck: (truckId, driverId) =>
    set((state) => ({
      trucks: {
        ...state.trucks,
        [truckId]: { ...state.trucks[truckId], driverId },
      },
    })),
  getTrucksByStatus: (status) =>
    Object.values(get().trucks).filter((t) => t.status === status),
  getTrucksByHub: (hub) =>
    Object.values(get().trucks).filter((t) => t.hub === hub),
})
```

### 6.2 Driver Slice — `src/store/driver-slice.ts`

Actions: `updateDriverHos`, `updateDriverStatus`, `getDriversByStatus`, `getDriverForTruck`.

### 6.3 Load Slice — `src/store/load-slice.ts`

Actions: `updateLoadStatus`, `assignLoad`, `addLoadCommunication`, `addLoadDocument`,
`getLoadsByStatus`, `getLoadsByType`, `getLoadsForShipper`, `getUnassignedLoads`.

### 6.4 Shipper Slice — `src/store/shipper-slice.ts`

Actions: `getShipperById`, `getShipperLoads`.

### 6.5 Carrier Slice — `src/store/carrier-slice.ts`

Actions: `getCarrierById`, `updateCarrierScorecard`, `getCarriersByEquipment`.

### 6.6 Time Slice — `src/store/time-slice.ts`

```ts
export interface TimeSlice {
  simulatedTime: string
  timeEvents: TimeEvent[]
  isPlaying: boolean
  playbackSpeed: number // 1, 2, 5, 10
  advanceTime: (minutes: number) => void
  setPlaybackSpeed: (speed: number) => void
  togglePlayback: () => void
  processEventsUpTo: (time: string) => void
  resetTime: () => void
}
```

`advanceTime` checks `timeEvents` for any events whose `triggerMinute` falls between
old and new time, and dispatches them (e.g., creates an exception, updates a load status).

### 6.7 UI Slice — `src/store/ui-slice.ts`

```ts
export interface UiSlice {
  activeTab: string
  isSheetOpen: boolean
  sheetContent: string | null
  searchQuery: string
  filterStatus: string | null
  selectedTruckId: EntityId | null
  selectedLoadId: EntityId | null
  selectedDriverId: EntityId | null
  setActiveTab: (tab: string) => void
  openSheet: (content: string) => void
  closeSheet: () => void
  setSearchQuery: (q: string) => void
  setFilterStatus: (s: string | null) => void
  selectTruck: (id: EntityId | null) => void
  selectLoad: (id: EntityId | null) => void
  selectDriver: (id: EntityId | null) => void
}
```

### 6.8 Notification Slice — `src/store/notification-slice.ts`

Actions: `addNotification`, `markAsRead`, `snoozeNotification`, `getUnreadCount`,
`clearAll`.

---

## 7. Custom Hooks

### File: `src/hooks/use-simulation.ts`

```ts
import { useEffect, useRef } from 'react'
import { useAppStore } from '@/store'

/**
 * Drives the time simulation forward.
 * When `isPlaying` is true, advances simulated time every real second
 * by `playbackSpeed` simulated minutes.
 */
export function useSimulation() {
  const isPlaying = useAppStore((s) => s.isPlaying)
  const speed = useAppStore((s) => s.playbackSpeed)
  const advance = useAppStore((s) => s.advanceTime)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => advance(speed), 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, speed, advance])
}
```

### File: `src/hooks/use-filtered-loads.ts`

```ts
import { useMemo } from 'react'
import { useAppStore } from '@/store'
import type { Load, LoadStatus, LoadType } from '@/data/types'

interface FilterOptions {
  status?: LoadStatus | null
  type?: LoadType | null
  search?: string
  shipperId?: string | null
}

export function useFilteredLoads(filters: FilterOptions): Load[] {
  const loads = useAppStore((s) => s.loads)

  return useMemo(() => {
    let result = Object.values(loads)

    if (filters.status) {
      result = result.filter((l) => l.status === filters.status)
    }
    if (filters.type) {
      result = result.filter((l) => l.type === filters.type)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (l) =>
          l.id.toLowerCase().includes(q) ||
          l.origin.city.toLowerCase().includes(q) ||
          l.destination.city.toLowerCase().includes(q) ||
          l.commodity.toLowerCase().includes(q),
      )
    }
    if (filters.shipperId) {
      result = result.filter((l) => l.shipperId === filters.shipperId)
    }

    return result.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  }, [loads, filters])
}
```

### File: `src/hooks/use-filtered-trucks.ts`

Same pattern. Filters by `status`, `hub`, `equipmentType`, `search` (id or driver name).

### File: `src/hooks/use-map.ts`

```ts
import { useCallback, useState } from 'react'
import type { LatLng } from '@/data/types'
import { MAP_CENTER, MAP_DEFAULT_ZOOM } from '@/data/constants'

export function useMap() {
  const [center, setCenter] = useState<LatLng>(MAP_CENTER)
  const [zoom, setZoom] = useState(MAP_DEFAULT_ZOOM)

  const flyTo = useCallback((position: LatLng, z?: number) => {
    setCenter(position)
    if (z) setZoom(z)
  }, [])

  const resetView = useCallback(() => {
    setCenter(MAP_CENTER)
    setZoom(MAP_DEFAULT_ZOOM)
  }, [])

  return { center, zoom, flyTo, resetView, setCenter, setZoom }
}
```

---

## 8. Utility Libraries

### File: `src/lib/geo.ts`

```ts
import type { LatLng } from '@/data/types'

/** Haversine distance in miles */
export function distanceMiles(a: LatLng, b: LatLng): number {
  const R = 3958.8 // Earth radius in miles
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const sinLat = Math.sin(dLat / 2)
  const sinLng = Math.sin(dLng / 2)
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng
  return 2 * R * Math.asin(Math.sqrt(h))
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/** Interpolate position along a polyline at fraction t (0..1) */
export function interpolatePolyline(polyline: LatLng[], t: number): LatLng {
  if (polyline.length === 0) return { lat: 0, lng: 0 }
  if (polyline.length === 1 || t <= 0) return polyline[0]
  if (t >= 1) return polyline[polyline.length - 1]

  const totalDist = polyline.reduce(
    (sum, p, i) => (i === 0 ? 0 : sum + distanceMiles(polyline[i - 1], p)),
    0,
  )
  const targetDist = totalDist * t
  let traveled = 0

  for (let i = 1; i < polyline.length; i++) {
    const segDist = distanceMiles(polyline[i - 1], polyline[i])
    if (traveled + segDist >= targetDist) {
      const segT = (targetDist - traveled) / segDist
      return {
        lat:
          polyline[i - 1].lat + (polyline[i].lat - polyline[i - 1].lat) * segT,
        lng:
          polyline[i - 1].lng + (polyline[i].lng - polyline[i - 1].lng) * segT,
      }
    }
    traveled += segDist
  }

  return polyline[polyline.length - 1]
}

/** Bearing from a to b in degrees */
export function bearing(a: LatLng, b: LatLng): number {
  const dLng = toRad(b.lng - a.lng)
  const y = Math.sin(dLng) * Math.cos(toRad(b.lat))
  const x =
    Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) -
    Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(dLng)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}
```

### File: `src/lib/format.ts`

```ts
import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatRate(ratePerMile: number): string {
  return `$${ratePerMile.toFixed(2)}/mi`
}

export function formatDistance(miles: number): string {
  return `${Math.round(miles)} mi`
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatTime(iso: string): string {
  return format(parseISO(iso), 'h:mm a')
}

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'MMM d')
}

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), 'MMM d, h:mm a')
}

export function formatRelative(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true })
}

export function formatMinutesToHours(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

export function formatMargin(
  margin: number | null,
  percent: number | null,
): string {
  if (margin === null || percent === null) return '—'
  return `${formatCurrency(margin)} (${formatPercent(percent)})`
}
```

---

## 9. App Shell & Navigation

### 9.1 Route Structure

TanStack Router uses file-based routing. We use a **pathless layout route** `_app.tsx`
to wrap all app screens with the bottom tab bar, while keeping the root layout clean.

```
src/routes/
├── __root.tsx          ← existing, keep as-is
├── _app.tsx            ← NEW pathless layout (tab bar wrapper)
├── _app/
│   ├── index.tsx       ← Dashboard (Tab 1) at /
│   ├── loads.tsx       ← Load list (Tab 2) at /loads
│   ├── fleet.tsx       ← Fleet map/list (Tab 3) at /fleet
│   ├── ai.tsx          ← AI agent hub (Tab 4) at /ai
│   └── more.tsx        ← More menu (Tab 5) at /more
```

### 9.2 Pathless Layout — `src/routes/_app.tsx`

```tsx
'use client'

import { createFileRoute, Outlet } from '@tanstack/react-router'
import { BottomTabBar } from '@/components/shell/bottom-tab-bar'
import { useSimulation } from '@/hooks/use-simulation'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

function AppLayout() {
  useSimulation()

  return (
    <div className="flex h-dvh w-full flex-col bg-freight-bg">
      {/* Main scrollable content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>

      {/* Fixed bottom tab bar */}
      <BottomTabBar />
    </div>
  )
}
```

ASCII wireframe of the app shell:

```
┌─────────────────────────────┐
│  ┌───────────────────────┐  │
│  │                       │  │
│  │   Screen Content      │  │
│  │   (scrollable)        │  │
│  │                       │  │
│  │                       │  │
│  │                       │  │
│  │                       │  │
│  │                       │  │
│  │                       │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ 📊  📦  🚛  ✨  ☰  │  │  ← Bottom Tab Bar (56px)
│  │ Dash Load Fleet AI More│  │
│  └───────────────────────┘  │
│  ░░░░ safe area inset ░░░░  │
└─────────────────────────────┘
        390px width
```

### 9.3 Bottom Tab Bar — `src/components/shell/bottom-tab-bar.tsx`

```tsx
'use client'

import { useRouter, useMatches } from '@tanstack/react-router'
import { LayoutDashboard, Package, Truck, Sparkles, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_TABS } from '@/data/constants'

const ICONS = {
  LayoutDashboard,
  Package,
  Truck,
  Sparkles,
  Menu,
} as const

export function BottomTabBar() {
  const router = useRouter()
  const matches = useMatches()
  const currentPath = matches[matches.length - 1]?.pathname ?? '/'

  return (
    <nav
      data-slot="bottom-tab-bar"
      className={cn(
        'grid grid-cols-5 border-t border-border bg-card',
        'pb-[var(--freight-safe-bottom)]',
      )}
      style={{
        height: `calc(var(--freight-tab-height) + var(--freight-safe-bottom))`,
      }}
    >
      {NAV_TABS.map((tab) => {
        const Icon = ICONS[tab.icon as keyof typeof ICONS]
        const isActive = currentPath === tab.path

        return (
          <button
            key={tab.id}
            onClick={() => router.navigate({ to: tab.path })}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5',
              'text-[11px] font-medium transition-colors',
              isActive ? 'text-freight-accent' : 'text-muted-foreground',
            )}
          >
            <Icon className="size-5" strokeWidth={isActive ? 2 : 1.5} />
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
```

### 9.4 Update `__root.tsx`

No changes needed to `__root.tsx` — it already provides the HTML shell. The `_app.tsx`
pathless layout adds the tab bar for all child routes.

---

## 10. Dashboard Screen

### File: `src/routes/_app/index.tsx`

```
Route path: /  (within _app layout)
```

### ASCII Wireframe

```
┌─────────────────────────────┐
│ Good morning, Dispatcher     │
│ Mon Feb 13  ○ 12 rolling  ○3│  ← Greeting bar
│─────────────────────────────│
│ [New Load] [AI] [Voice] [🔍]│  ← Quick actions (scroll-x)
│─────────────────────────────│
│ ┌──────┐ ┌──────┐           │
│ │  42  │ │  18  │           │  ← KPI grid (2×2)
│ │Active│ │Avail │           │
│ │Loads │ │Trucks│           │
│ ├──────┤ ├──────┤           │
│ │$47.2K│ │  3   │           │
│ │Rev   │ │Excep │           │
│ └──────┘ └──────┘           │
│─────────────────────────────│
│ ┌───────────────────────┐   │
│ │  🗺  Mini Map          │   │  ← Map (200px)
│ │  •  •   •  •          │   │
│ │     •      •   •      │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ ⚠ EXCEPTIONS                │
│ ┌───────────────────────┐   │
│ │🔴 LATE PICKUP LD-4521 │   │  ← Exception cards
│ │ T-217 45min behind    │   │
│ │ ✨AI: Extend window   │   │
│ │ 12 min ago  [View]    │   │
│ └───────────────────────┘   │
│ ┌───────────────────────┐   │
│ │🟡 HOS WARNING DRV-012│   │
│ │ 45 min drive left     │   │
│ │ ✨AI: Plan relay      │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ 📅 TODAY'S SCHEDULE         │
│  ● 2:00 PM  Pickup LD-4525 │  ← Timeline
│  ○ 3:30 PM  Delivery LD-45 │
│  ○ 5:00 PM  Shift end x3   │
└─────────────────────────────┘
```

### Component Breakdown

```tsx
function DashboardScreen() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <GreetingBar />
      <QuickActionsStrip />
      <KpiGrid />
      <MiniMap />
      <ExceptionFeed />
      <ScheduleTimeline />
    </div>
  )
}
```

#### 10.1 `GreetingBar` — `src/components/dashboard/greeting-bar.tsx`

Props: none (reads from store/date).

```
"Good morning, Dispatcher" (or afternoon/evening based on simulated time)
Current date formatted: "Mon Feb 13"
Two pill chips:
  - "12 trucks rolling" (count of en_route trucks)
  - "3 exceptions" (count of active exceptions)
Right side: Bell icon with unread notification count badge
```

#### 10.2 `QuickActionsStrip` — `src/components/dashboard/quick-actions-strip.tsx`

Horizontal scroll of pill buttons. Maps over `QUICK_ACTIONS` constant.
Each button has an icon + label. On tap, navigates to the relevant screen
or opens a sheet.

#### 10.3 `KpiGrid` — `src/components/dashboard/kpi-grid.tsx`

2x2 grid using `MetricCard` component (see Section 13.2). Cards:

| Card             | Value source                                                                                        | Label              | Navigation               |
| ---------------- | --------------------------------------------------------------------------------------------------- | ------------------ | ------------------------ |
| Active Loads     | `Object.values(loads).filter(l => !['delivered','invoiced','cancelled'].includes(l.status)).length` | "Active Loads"     | `/loads`                 |
| Available Trucks | `getTrucksByStatus('empty').length`                                                                 | "Available Trucks" | `/fleet`                 |
| Today's Revenue  | Sum of `totalRevenue` for loads delivered today                                                     | "Today's Revenue"  | `/more/reports`          |
| Exceptions       | `Object.values(exceptions).filter(e => e.status === 'active').length`                               | "Exceptions"       | scroll to exception feed |

Each `MetricCard` shows the value, label, and a trend indicator (hardcoded for demo).

#### 10.4 `MiniMap` — `src/components/dashboard/mini-map.tsx`

Renders a Leaflet map at 200px height, full width. Shows all trucks as colored circle
markers. Uses `react-leaflet` components:

```tsx
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
```

- Tile layer: OpenStreetMap (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`)
- Each truck → `CircleMarker` with fill color based on `TRUCK_STATUS_COLOR`
- `center`: `MAP_CENTER`, `zoom`: `MAP_DEFAULT_ZOOM`
- Tap map → navigate to `/fleet` for full-screen view
- No zoom controls on mini map (saves space)

#### 10.5 `ExceptionFeed` — `src/components/dashboard/exception-feed.tsx`

Scrollable list of `ExceptionCard` components. Sorted by severity (critical first),
then by `detectedAt` (newest first). Max 5 visible, "View All" link at bottom.

`ExceptionCard` sub-component:

- Left: severity color stripe (4px)
- Severity icon (circle with color)
- Title: `"LATE PICKUP — Load #4521"`
- Description: 1-2 line summary
- AI suggestion row: purple text with sparkle icon (if `aiSuggestion` is set)
- Timestamp: relative ("12 min ago")
- Actions: [View] [Act] buttons

#### 10.6 `ScheduleTimeline` — `src/components/dashboard/schedule-timeline.tsx`

Vertical timeline showing next 12 hours of events. Uses the `TimelineStep` component
pattern from the design doc:

- Filled green circle + line for completed events
- Pulsing blue circle for current/next event
- Gray outlined circles for future events
- Each step shows: time, event type icon, description, related load/driver link

---

## 11. Fleet Screen

### File: `src/routes/_app/fleet.tsx`

### ASCII Wireframe

```
┌─────────────────────────────┐
│ Fleet                   🔍  │  ← Header
│─────────────────────────────│
│ [All] [Route] [Empty] [OOS]│  ← Filter chips (scroll-x)
│─────────────────────────────│
│ ┌───────────────────────┐   │
│ │                       │   │
│ │    🗺  Full Map        │   │  ← Leaflet map (top half)
│ │   🔵 🔵  🟡           │   │
│ │      🔵    ⚪  🔵      │   │
│ │  🔴          🔵       │   │
│ │                       │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ ═══════ drag handle ════════│  ← Peek-up truck list
│ ┌───────────────────────┐   │
│ │ T-201  DRY VAN  ● Route│  │
│ │ Mike Torres  ATL→MEM   │  │
│ │ ETA: 4:30 PM  8.2h HOS│  │
│ ├───────────────────────┤   │
│ │ T-208  DRY VAN  ○ Empty│  │
│ │ James Wright  Nashville│  │
│ │ Available  9.5h HOS    │  │
│ └───────────────────────┘   │
└─────────────────────────────┘
```

### Component Structure

```tsx
function FleetScreen() {
  const [view, setView] = useState<'map' | 'list'>('map')
  const [statusFilter, setStatusFilter] = useState<TruckStatus | null>(null)

  return (
    <div className="flex h-full flex-col">
      <FleetHeader onToggleView={setView} />
      <FleetFilterBar value={statusFilter} onChange={setStatusFilter} />
      {view === 'map' ? (
        <FleetMapView statusFilter={statusFilter} />
      ) : (
        <FleetListView statusFilter={statusFilter} />
      )}
    </div>
  )
}
```

#### 11.1 `FleetHeader` — `src/components/fleet/fleet-header.tsx`

- Title "Fleet" left-aligned
- Search icon (right) — opens search overlay
- Map/List toggle button (right)

#### 11.2 `FleetFilterBar` — `src/components/fleet/fleet-filter-bar.tsx`

Horizontal scroll of pill-shaped toggle buttons:

- "All" (default, null filter)
- "En Route" → `en_route`
- "Empty" → `empty`
- "At Facility" → filters `at_pickup | at_delivery | loading | unloading`
- "Out of Service" → `out_of_service`

Active filter gets `bg-freight-accent text-white`. Inactive gets `bg-muted text-muted-foreground`.

#### 11.3 `FleetMapView` — `src/components/fleet/fleet-map-view.tsx`

Full Leaflet map (takes remaining height via `flex-1`). Shows:

- Truck markers as custom divIcon arrows pointing in `heading` direction
- Color coded by status
- Tap marker → popup with truck summary card
- Tap popup → navigate to truck detail (Part 2)
- Route lines for trucks with active loads (polyline from load data)
- Facility markers as small gray circles

Below the map: a peek-up `Sheet` (drag handle) with `TruckListPanel`.

#### 11.4 `TruckListPanel` — `src/components/fleet/truck-list-panel.tsx`

Scrollable list of `TruckCard` components. Each card:

```
┌──────────────────────────────────────────┐
│ ● T-201     DRY VAN      ● En Route     │
│   Mike Torres  |  ATL → MEM             │
│   ETA: Today 4:30 PM  |  8.2h HOS      │
└──────────────────────────────────────────┘
```

- Left accent stripe in status color
- Truck ID bold, equipment type tag, status badge
- Driver name, route (origin → destination city codes)
- ETA, HOS remaining
- Tap → centers map on truck (in map view) or navigates to detail (in list view)

---

## 12. Load List Screen

### File: `src/routes/_app/loads.tsx`

### ASCII Wireframe

```
┌─────────────────────────────┐
│ Loads                       │
│ [Active] [Available] [Done] │  ← Segment control
│─────────────────────────────│
│ [Status▾] [Origin] [Equip] │  ← Filter pills (scroll-x)
│─────────────────────────────│
│ ┌───────────────────────┐   │
│ │ #4521    DRY VAN $2850│   │  ← Load cards
│ │ ATL→MEM ● In Transit  │   │
│ │ Mike Torres | T-217   │   │
│ │ ETA: 4:30 PM ⏱ OnTime│   │
│ │ ✨AI: Relay at BHM    │   │
│ ├───────────────────────┤   │
│ │ #4529    REEFER  $3200│   │
│ │ JAX→NSH ○ Dispatched  │   │
│ │ James Wright | T-301  │   │
│ │ PU: Tomorrow 8:00 AM  │   │
│ ├───────────────────────┤   │
│ │ #4533    DRY VAN $1850│   │
│ │ CLT→ATL ● At Pickup   │   │
│ │ Sarah Chen  | T-212   │   │
│ │ Loading... 2.1 margin │   │
│ └───────────────────────┘   │
│                         (+) │  ← FAB
└─────────────────────────────┘
```

### Component Structure

```tsx
function LoadListScreen() {
  const [segment, setSegment] = useState<'active' | 'available' | 'completed'>(
    'active',
  )
  const [filters, setFilters] = useState<FilterOptions>({})

  return (
    <div className="flex h-full flex-col">
      <LoadListHeader />
      <SegmentControl value={segment} onChange={setSegment} />
      <LoadFilterBar value={filters} onChange={setFilters} />
      <LoadList segment={segment} filters={filters} />
      <FloatingActionButton />
    </div>
  )
}
```

#### 12.1 `SegmentControl` — `src/components/loads/segment-control.tsx`

Three-way toggle built on shadcn `Tabs`:

- **Active**: loads with status not in [delivered, invoiced, cancelled, tendered]
- **Available**: unmatched loads (status = tendered | accepted, no assignedTruckId) — broker view
- **Completed**: delivered + invoiced loads from last 7 days

#### 12.2 `LoadFilterBar` — `src/components/loads/load-filter-bar.tsx`

Horizontal scroll of dropdown pills:

- Status: dropdown with all LoadStatus values
- Origin: dropdown with hub city codes
- Destination: dropdown with hub city codes
- Equipment: dropdown with equipment types
- Customer: dropdown with shipper names

Active filters show with an "×" to clear. Filter count badge on the filter icon.

#### 12.3 `LoadList` — `src/components/loads/load-list.tsx`

Uses `useFilteredLoads` hook. Renders a scrollable list of `LoadCard` components.
Shows empty state when no matches.

#### 12.4 `LoadCard` — `src/components/loads/load-card.tsx`

Props: `load: Load`

Layout per design doc:

```
┌──────────────────────────────────────────┐
│  #4521        DRY VAN        $2,850      │
│  ATL → MEM    ● In Transit   2.4 margin  │
│  Driver: Mike Torres  |  Truck: T-217    │
│  ETA: Today 4:30 PM   ⏱ On Time         │
│  ──────────────────────────────────────  │
│  ✨ AI: Consider relay at Birmingham     │
└──────────────────────────────────────────┘
```

- Uses `Card` component from shadcn
- Left border stripe in load status color
- Load ID bold, equipment badge, rate (right-aligned)
- Origin → Destination with status badge
- Margin colored: green (≥15%), yellow (8-15%), red (<8%) — brokered loads only
- Driver name + truck ID row
- ETA row with on-time indicator
- Conditional AI suggestion row (purple highlight, sparkle icon)
- Tap → navigate to load detail (Part 2)

#### 12.5 `FloatingActionButton` — `src/components/shared/fab.tsx`

See Section 13.5.

---

## 13. Shared Components

### 13.1 StatusBadge — `src/components/shared/status-badge.tsx`

```tsx
'use client'

import { cn } from '@/lib/utils'
import {
  LOAD_STATUS_COLOR,
  LOAD_STATUS_LABEL,
  TRUCK_STATUS_COLOR,
} from '@/data/constants'
import type { LoadStatus, TruckStatus } from '@/data/types'

interface StatusBadgeProps {
  status: LoadStatus | TruckStatus
  type?: 'load' | 'truck'
  className?: string
}

export function StatusBadge({
  status,
  type = 'load',
  className,
}: StatusBadgeProps) {
  const colorMap = type === 'load' ? LOAD_STATUS_COLOR : TRUCK_STATUS_COLOR
  const label =
    type === 'load'
      ? LOAD_STATUS_LABEL[status as LoadStatus]
      : status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <span
      data-slot="status-badge"
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5',
        'text-xs font-semibold',
        colorMap[status as keyof typeof colorMap],
        className,
      )}
    >
      {label}
    </span>
  )
}
```

### 13.2 MetricCard — `src/components/shared/metric-card.tsx`

```tsx
'use client'

import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface MetricCardProps {
  value: string | number
  label: string
  trend?: { direction: 'up' | 'down'; value: string }
  trendPositive?: 'up' | 'down' // which direction is "good"
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
  const isPositive = trend ? trend.direction === trendPositive : null

  return (
    <Card
      data-slot="metric-card"
      className={cn(
        'cursor-pointer p-3 transition-transform active:scale-[0.98]',
        className,
      )}
      onClick={onClick}
    >
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      {trend && (
        <div
          className={cn(
            'mt-1 flex items-center gap-1 text-xs font-medium',
            isPositive ? 'text-freight-success' : 'text-freight-critical',
          )}
        >
          {trend.direction === 'up' ? (
            <TrendingUp className="size-3" />
          ) : (
            <TrendingDown className="size-3" />
          )}
          {trend.value}
        </div>
      )}
    </Card>
  )
}
```

### 13.3 SkeletonCard — `src/components/shared/skeleton-card.tsx`

```tsx
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export function SkeletonCard() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </Card>
  )
}
```

### 13.4 PullToRefresh — `src/components/shared/pull-to-refresh.tsx`

Simple CSS-based pull indicator. Wraps children; on overscroll shows a spinning
indicator at top. Uses `onTouchStart`/`onTouchMove`/`onTouchEnd` to detect pull
gesture. On release, calls `onRefresh` callback which should reset/reload data
from the store.

### 13.5 FloatingActionButton (FAB) — `src/components/shared/fab.tsx`

```tsx
'use client'

import { useState } from 'react'
import { Plus, X, Package, Sparkles, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAB_ACTIONS = [
  { id: 'new_load', label: 'New Load', icon: Package },
  { id: 'dispatch_ai', label: 'Ask AI', icon: Sparkles },
  { id: 'voice_call', label: 'Demo Call', icon: Phone },
]

interface FabProps {
  onAction: (actionId: string) => void
}

export function FloatingActionButton({ onAction }: FabProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-[calc(var(--freight-tab-height)+var(--freight-safe-bottom)+16px)] right-4 z-40">
      {/* Speed-dial options */}
      <div
        className={cn(
          'mb-3 flex flex-col items-end gap-2 transition-all',
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none',
        )}
      >
        {FAB_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => {
              onAction(action.id)
              setIsOpen(false)
            }}
            className="flex items-center gap-2 rounded-full bg-card px-3 py-2 text-sm font-medium shadow-lg ring-1 ring-border"
          >
            <action.icon className="size-4" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Main FAB button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex size-14 items-center justify-center rounded-full',
          'bg-freight-accent text-white shadow-lg',
          'transition-transform active:scale-95',
          isOpen && 'rotate-45',
        )}
      >
        {isOpen ? <X className="size-6" /> : <Plus className="size-6" />}
      </button>
    </div>
  )
}
```

### 13.6 SectionHeader — `src/components/shared/section-header.tsx`

```tsx
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  action?: { label: string; onClick: () => void }
  className?: string
}

export function SectionHeader({
  title,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm font-medium text-freight-accent"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
```

### 13.7 EmptyState — `src/components/shared/empty-state.tsx`

```tsx
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12',
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-6 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
```

### 13.8 AiSuggestionBanner — `src/components/shared/ai-suggestion-banner.tsx`

A purple-accented banner used inside cards when there's an AI recommendation:

```tsx
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AiSuggestionBannerProps {
  text: string
  className?: string
}

export function AiSuggestionBanner({
  text,
  className,
}: AiSuggestionBannerProps) {
  return (
    <div
      data-slot="ai-suggestion"
      className={cn(
        'flex items-start gap-2 rounded-lg bg-freight-ai/10 px-3 py-2',
        className,
      )}
    >
      <Sparkles className="mt-0.5 size-3.5 shrink-0 text-freight-ai" />
      <span className="text-xs font-medium text-freight-ai">{text}</span>
    </div>
  )
}
```

---

## 14. File Creation Order

Create files in this exact order to avoid import errors. Each file's dependencies
are listed so you know what must exist first.

### Phase A — Data Layer (no UI dependencies)

| #   | File                     | Depends On                     |
| --- | ------------------------ | ------------------------------ |
| 1   | `src/data/types.ts`      | nothing                        |
| 2   | `src/data/constants.ts`  | types.ts                       |
| 3   | `src/lib/geo.ts`         | types.ts                       |
| 4   | `src/lib/format.ts`      | nothing (date-fns)             |
| 5   | `src/data/generators.ts` | types.ts, constants.ts, geo.ts |
| 6   | `src/data/seed.ts`       | generators.ts, types.ts        |

### Phase B — Store (depends on data layer)

| #   | File                              | Depends On          |
| --- | --------------------------------- | ------------------- |
| 7   | `src/store/fleet-slice.ts`        | types.ts            |
| 8   | `src/store/driver-slice.ts`       | types.ts            |
| 9   | `src/store/load-slice.ts`         | types.ts            |
| 10  | `src/store/shipper-slice.ts`      | types.ts            |
| 11  | `src/store/carrier-slice.ts`      | types.ts            |
| 12  | `src/store/time-slice.ts`         | types.ts            |
| 13  | `src/store/ui-slice.ts`           | types.ts            |
| 14  | `src/store/notification-slice.ts` | types.ts            |
| 15  | `src/store/index.ts`              | all slices, seed.ts |

### Phase C — Hooks (depends on store)

| #   | File                               | Depends On             |
| --- | ---------------------------------- | ---------------------- |
| 16  | `src/hooks/use-simulation.ts`      | store                  |
| 17  | `src/hooks/use-filtered-loads.ts`  | store, types.ts        |
| 18  | `src/hooks/use-filtered-trucks.ts` | store, types.ts        |
| 19  | `src/hooks/use-map.ts`             | types.ts, constants.ts |

### Phase D — shadcn Components (run CLI)

| #   | Component   | Command                             |
| --- | ----------- | ----------------------------------- |
| 20  | tabs        | `npx shadcn@latest add tabs`        |
| 21  | skeleton    | `npx shadcn@latest add skeleton`    |
| 22  | scroll-area | `npx shadcn@latest add scroll-area` |
| 23  | sheet       | `npx shadcn@latest add sheet`       |
| 24  | avatar      | `npx shadcn@latest add avatar`      |
| 25  | progress    | `npx shadcn@latest add progress`    |
| 26  | tooltip     | `npx shadcn@latest add tooltip`     |
| 27  | toggle      | `npx shadcn@latest add toggle`      |
| 28  | switch      | `npx shadcn@latest add switch`      |
| 29  | dialog      | `npx shadcn@latest add dialog`      |

### Phase E — Theme Tokens

| #   | File             | Action                                                     |
| --- | ---------------- | ---------------------------------------------------------- |
| 30  | `src/styles.css` | EDIT — add FreightOS custom properties + Leaflet overrides |

### Phase F — Shared Components

| #   | File                                             | Depends On             |
| --- | ------------------------------------------------ | ---------------------- |
| 31  | `src/components/shared/status-badge.tsx`         | constants.ts, types.ts |
| 32  | `src/components/shared/metric-card.tsx`          | card, utils            |
| 33  | `src/components/shared/skeleton-card.tsx`        | skeleton, card         |
| 34  | `src/components/shared/pull-to-refresh.tsx`      | nothing                |
| 35  | `src/components/shared/fab.tsx`                  | lucide-react           |
| 36  | `src/components/shared/section-header.tsx`       | utils                  |
| 37  | `src/components/shared/empty-state.tsx`          | lucide-react           |
| 38  | `src/components/shared/ai-suggestion-banner.tsx` | lucide-react           |

### Phase G — App Shell

| #   | File                                      | Depends On                     |
| --- | ----------------------------------------- | ------------------------------ |
| 39  | `src/components/shell/bottom-tab-bar.tsx` | constants.ts, router           |
| 40  | `src/routes/_app.tsx`                     | bottom-tab-bar, use-simulation |

### Phase H — Dashboard Screen

| #   | File                                               | Depends On                                |
| --- | -------------------------------------------------- | ----------------------------------------- |
| 41  | `src/components/dashboard/greeting-bar.tsx`        | store, format.ts                          |
| 42  | `src/components/dashboard/quick-actions-strip.tsx` | constants.ts                              |
| 43  | `src/components/dashboard/kpi-grid.tsx`            | metric-card, store                        |
| 44  | `src/components/dashboard/mini-map.tsx`            | react-leaflet, store, constants.ts        |
| 45  | `src/components/dashboard/exception-card.tsx`      | status-badge, ai-suggestion-banner, store |
| 46  | `src/components/dashboard/exception-feed.tsx`      | exception-card, section-header, store     |
| 47  | `src/components/dashboard/schedule-event.tsx`      | format.ts                                 |
| 48  | `src/components/dashboard/schedule-timeline.tsx`   | schedule-event, section-header            |
| 49  | `src/routes/_app/index.tsx`                        | all dashboard components                  |

### Phase I — Fleet Screen

| #   | File                                        | Depends On                             |
| --- | ------------------------------------------- | -------------------------------------- |
| 50  | `src/components/fleet/fleet-header.tsx`     | utils                                  |
| 51  | `src/components/fleet/fleet-filter-bar.tsx` | constants.ts                           |
| 52  | `src/components/fleet/truck-card.tsx`       | status-badge, format.ts, store         |
| 53  | `src/components/fleet/truck-map-marker.tsx` | types.ts, constants.ts                 |
| 54  | `src/components/fleet/fleet-map-view.tsx`   | react-leaflet, truck-map-marker, store |
| 55  | `src/components/fleet/truck-list-panel.tsx` | truck-card, sheet                      |
| 56  | `src/routes/_app/fleet.tsx`                 | all fleet components                   |

### Phase J — Load List Screen

| #   | File                                       | Depends On                                          |
| --- | ------------------------------------------ | --------------------------------------------------- |
| 57  | `src/components/loads/segment-control.tsx` | tabs                                                |
| 58  | `src/components/loads/load-filter-bar.tsx` | constants.ts, select                                |
| 59  | `src/components/loads/load-card.tsx`       | card, status-badge, ai-suggestion-banner, format.ts |
| 60  | `src/components/loads/load-list.tsx`       | load-card, use-filtered-loads, empty-state          |
| 61  | `src/routes/_app/loads.tsx`                | all loads components, fab                           |

### Phase K — Placeholder Screens

| #   | File                       | Purpose                                    |
| --- | -------------------------- | ------------------------------------------ |
| 62  | `src/routes/_app/ai.tsx`   | Placeholder: "AI Agent — Coming in Part 3" |
| 63  | `src/routes/_app/more.tsx` | Placeholder: "More — Coming in Part 2"     |

### Summary

**Total new files: 63**

- Data layer: 6 files
- Store: 9 files
- Hooks: 4 files
- shadcn: 10 components (CLI-generated)
- Theme: 1 file edit
- Shared components: 8 files
- Shell: 2 files
- Dashboard: 9 files
- Fleet: 7 files
- Loads: 5 files
- Placeholders: 2 files

### Verification Checklist

After completing Part 1, you should be able to:

- [ ] `bun run dev` starts without errors on port 3000
- [ ] Bottom tab bar shows 5 tabs; tapping each navigates correctly
- [ ] Dashboard shows greeting, KPIs with real numbers, mini map with truck dots, exception feed, schedule timeline
- [ ] Fleet tab shows full-screen Leaflet map with 45 truck markers color-coded by status
- [ ] Fleet filter chips work (En Route shows ~18 trucks, Empty shows ~9, etc.)
- [ ] Fleet truck list shows scrollable cards with driver, route, HOS info
- [ ] Loads tab shows segmented list with 80 loads distributed across segments
- [ ] Load filter pills narrow results correctly
- [ ] Load cards show route, rate, status badge, driver, and AI suggestions where present
- [ ] FAB expands to show 3 quick actions
- [ ] `bun run build` succeeds with no TypeScript errors
- [ ] All Tailwind classes resolve (no missing custom properties)
- [ ] App is usable at 390px width (Chrome DevTools device mode → iPhone 14)
