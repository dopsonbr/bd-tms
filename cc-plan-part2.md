# FreightOS Implementation Plan — Part 2: Operations

> **Stage 2** adds all operational screens: load detail, dispatch board, driver
> management, brokerage load board, carrier matching, shipper/carrier directories,
> communication hub, notification center, and document management.
> Prerequisite: Part 1 complete (data layer, store, shell, dashboard, fleet, loads).

---

## Table of Contents

1. [Load Detail Screen](#1-load-detail-screen)
2. [Load Actions & Lifecycle](#2-load-actions--lifecycle)
3. [New Load Form](#3-new-load-form)
4. [Dispatch Board](#4-dispatch-board)
5. [AI Dispatch Recommendations](#5-ai-dispatch-recommendations)
6. [Driver Management](#6-driver-management)
7. [Truck Detail Screen](#7-truck-detail-screen)
8. [Equipment Tracking](#8-equipment-tracking)
9. [Brokerage Load Board](#9-brokerage-load-board)
10. [Carrier Matching](#10-carrier-matching)
11. [Shipper Directory](#11-shipper-directory)
12. [Carrier Directory](#12-carrier-directory)
13. [Communication Hub](#13-communication-hub)
14. [Notification Center](#14-notification-center)
15. [Document Management](#15-document-management)
16. [Store Additions](#16-store-additions)
17. [File Creation Order](#17-file-creation-order)

---

## 1. Load Detail Screen

### Route: `src/routes/_app/loads/$loadId.tsx`

This is a **dynamic route**. TanStack Router generates the param `loadId` from the
filename `$loadId.tsx`. The route reads the load from the store.

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/loads/$loadId')({
  component: LoadDetailScreen,
})

function LoadDetailScreen() {
  const { loadId } = Route.useParams()
  const load = useAppStore((s) => s.loads[loadId])
  // ...
}
```

### ASCII Wireframe

```
┌─────────────────────────────┐
│ ← #4521    ● In Transit  ⋯ │  ← Sticky header
│─────────────────────────────│
│ ┌───────────────────────┐   │
│ │  🗺  Route Map          │   │  ← Section 1: Route
│ │  ATL ──── 🚛 ──── MEM  │   │
│ └───────────────────────┘   │
│                             │
│ 📍 Origin                   │
│ ┌───────────────────────┐   │
│ │ Piedmont Steel Works  │   │
│ │ 123 Industrial Blvd   │   │
│ │ Atlanta, GA 30301     │   │
│ │ Appt: 8:00-10:00 AM  │   │
│ │ Arrived: 8:22 AM ✓   │   │
│ └───────────────────────┘   │
│                             │
│ 📍 Destination              │
│ ┌───────────────────────┐   │
│ │ Memphis Distribution  │   │
│ │ 456 Warehouse Dr      │   │
│ │ Memphis, TN 38103     │   │
│ │ Appt: 2:00-4:00 PM   │   │
│ │ ETA: 4:30 PM ⚠ Late  │   │
│ └───────────────────────┘   │
│                             │
│ 📏 382 mi  ⏱ ~5.5 hrs      │
│─────────────────────────────│
│ 🚛 Assignment               │  ← Section 2
│ ┌───────────────────────┐   │
│ │ 👤 Mike Torres        │   │
│ │    📞 (404) 555-0123  │   │
│ │    HOS: 8.2h remain   │   │
│ │ 🚛 T-217  Dry Van     │   │
│ │    🔗 TRL-044         │   │
│ │    [Reassign]         │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ 📊 Lifecycle                │  ← Section 3
│ ✅ Tendered    Feb 12 6:00a │
│ ✅ Accepted    Feb 12 6:15a │
│ ✅ Dispatched  Feb 12 7:00a │
│ ✅ At Pickup   Feb 12 8:22a │
│ ✅ Loaded      Feb 12 9:10a │
│ ●● In Transit  Feb 12 9:30a │  ← pulsing
│ ○  At Delivery              │
│ ○  Delivered                │
│ ○  POD Received             │
│ ○  Invoiced                 │
│─────────────────────────────│
│ 💰 Financials               │  ← Section 4
│ ┌───────────────────────┐   │
│ │ Line haul      $2,650 │   │
│ │ Fuel surcharge   $150 │   │
│ │ Detention          $0 │   │
│ │ ─────────────────     │   │
│ │ Total Revenue  $2,850 │   │
│ │ Rate/mile      $7.46  │   │
│ │ Carrier cost   $2,200 │   │ ← brokered only
│ │ Margin     $650 22.8% │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ 📄 Documents                │  ← Section 5
│ ┌────┐ ┌────┐ ┌────┐ ┌──┐ │
│ │BOL │ │POD │ │Rate│ │+ │ │
│ │ ✓  │ │ ⚠  │ │ ✓  │ │  │ │
│ └────┘ └────┘ └────┘ └──┘ │
│─────────────────────────────│
│ 💬 Communication Log        │  ← Section 6
│ ┌───────────────────────┐   │
│ │ 9:30 AM  System       │   │
│ │ Load departed pickup  │   │
│ ├───────────────────────┤   │
│ │ 9:15 AM  Driver       │   │
│ │ "Loaded and sealed"   │   │
│ ├───────────────────────┤   │
│ │ 8:22 AM  System       │   │
│ │ Arrived at pickup     │   │
│ └───────────────────────┘   │
│ ┌──────────────────── 📎 ┐  │
│ │ Add a note...          │  │  ← Input bar
│ └────────────────────────┘  │
└─────────────────────────────┘
```

### Component Breakdown

```tsx
function LoadDetailScreen() {
  return (
    <div className="flex h-full flex-col">
      <LoadDetailHeader load={load} />
      <div className="flex-1 overflow-y-auto">
        <LoadRouteSection load={load} />
        <LoadAssignmentSection load={load} />
        <LoadLifecycleSection load={load} />
        <LoadFinancialsSection load={load} />
        <LoadDocumentsSection load={load} />
        <LoadCommunicationSection load={load} />
      </div>
    </div>
  )
}
```

#### 1.1 `LoadDetailHeader` — `src/components/load-detail/load-detail-header.tsx`

Sticky header with:

- Back arrow (navigates to `/loads`)
- Load ID (`#4521`)
- Status badge
- Three-dot menu (dropdown: Call Driver, View on Map, Share Status, Cancel Load)

Props: `{ load: Load }`

#### 1.2 `LoadRouteSection` — `src/components/load-detail/load-route-section.tsx`

- Mini Leaflet map (180px height) showing:
  - Origin marker (green circle)
  - Destination marker (red circle)
  - Route polyline (blue line from `load.routePolyline`)
  - Current truck position marker (blue dot with heading arrow)
- Origin facility card: name, address, appointment window, actual times
- Destination facility card: same format, with ETA if in transit
- Distance and estimated drive time between points

For multi-stop loads, render a vertical stepper showing each stop with status.

Props: `{ load: Load }`

#### 1.3 `LoadAssignmentSection` — `src/components/load-detail/load-assignment-section.tsx`

Card showing assigned driver, truck, and trailer info:

- Driver: avatar placeholder, name, phone (tap-to-call link), HOS remaining
- Truck: unit number, equipment type, mileage
- Trailer: trailer ID, status
- "Reassign" button (shown only if load is pre-dispatch status)

Props: `{ load: Load }`

#### 1.4 `LoadLifecycleSection` — `src/components/load-detail/load-lifecycle-section.tsx`

Horizontal stepper (scrollable if needed) showing all lifecycle stages from
`LOAD_LIFECYCLE_ORDER`. For each step:

```tsx
interface StepProps {
  status: LoadStatus
  isCompleted: boolean
  isCurrent: boolean
  timestamp: string | null
  note: string | null
}
```

Rendering:

- Completed: green circle with check + green connecting line, timestamp below
- Current: blue pulsing circle, current timestamp, bold label
- Future: gray outlined circle, gray dashed line

The component reads `load.lifecycle` to determine which stages have timestamps.

Props: `{ load: Load }`

#### 1.5 `LoadFinancialsSection` — `src/components/load-detail/load-financials-section.tsx`

Table-like layout within a Card:

- Line haul rate
- Fuel surcharge
- Each accessorial (dynamically from `load.accessorials`)
- Separator line
- Total Revenue (bold)
- Rate per mile
- For brokered loads only: Carrier Cost, Margin ($), Margin (%)
- Margin text colored: green (≥15%), yellow (8–15%), red (<8%)

Props: `{ load: Load }`

#### 1.6 `LoadDocumentsSection` — `src/components/load-detail/load-documents-section.tsx`

Grid of document thumbnails (2×2 or 3-column). Each document:

- Thumbnail image (placeholder gray rectangle with doc type icon)
- Type label below
- Status badge: ✓ (received/green), ⚠ (missing/red), ○ (pending/gray)
- Tap → opens document viewer (see Section 15)
- "Add Document" button at end → opens simulated camera/upload

Props: `{ load: Load }`

#### 1.7 `LoadCommunicationSection` — `src/components/load-detail/load-communication-section.tsx`

Chronological feed of all `load.communications`:

- Each entry: timestamp, source icon/label, content text
- AI-generated entries: purple accent border + sparkle icon
- System events: gray background, smaller text
- Driver messages: blue tint
- At bottom: text input with send button for adding dispatcher notes

Props: `{ load: Load }`

---

## 2. Load Actions & Lifecycle

### 2.1 Action Handlers — `src/lib/load-actions.ts`

```ts
import { useAppStore } from '@/store'
import type { EntityId, LoadStatus } from '@/data/types'

export function advanceLoadStatus(loadId: EntityId) {
  const store = useAppStore.getState()
  const load = store.loads[loadId]
  if (!load) return

  const currentIndex = LOAD_LIFECYCLE_ORDER.indexOf(load.status)
  if (currentIndex < 0 || currentIndex >= LOAD_LIFECYCLE_ORDER.length - 1)
    return

  const nextStatus = LOAD_LIFECYCLE_ORDER[currentIndex + 1]
  store.updateLoadStatus(loadId, nextStatus)
}

export function acceptLoad(loadId: EntityId) {
  const store = useAppStore.getState()
  store.updateLoadStatus(loadId, 'accepted')
  store.addLoadCommunication(loadId, {
    source: 'system',
    type: 'system_event',
    content: 'Load accepted by dispatcher',
    isAi: false,
  })
}

export function rejectLoad(loadId: EntityId) {
  const store = useAppStore.getState()
  store.updateLoadStatus(loadId, 'cancelled')
  store.addLoadCommunication(loadId, {
    source: 'system',
    type: 'system_event',
    content: 'Load rejected by dispatcher',
    isAi: false,
  })
}

export function reassignLoad(
  loadId: EntityId,
  newTruckId: EntityId,
  newDriverId: EntityId,
) {
  const store = useAppStore.getState()
  store.assignLoad(loadId, newTruckId, newDriverId)
  store.addLoadCommunication(loadId, {
    source: 'dispatcher',
    type: 'system_event',
    content: `Load reassigned to ${newTruckId} / ${newDriverId}`,
    isAi: false,
  })
}

export function dispatchLoad(
  loadId: EntityId,
  truckId: EntityId,
  driverId: EntityId,
) {
  const store = useAppStore.getState()
  store.assignLoad(loadId, truckId, driverId)
  store.updateLoadStatus(loadId, 'dispatched')
  store.updateTruckStatus(truckId, 'en_route')
  store.addLoadCommunication(loadId, {
    source: 'system',
    type: 'system_event',
    content: `Dispatched to ${truckId}. Driver notified.`,
    isAi: false,
  })
  store.addNotification({
    priority: 'info',
    title: `Load ${loadId} dispatched`,
    body: `Assigned to ${truckId}. Driver en route to pickup.`,
    relatedEntityType: 'load',
    relatedEntityId: loadId,
  })
}
```

### 2.2 Swipe Actions on Load Cards

Add touch gesture support to `LoadCard` from Part 1. On swipe right → accept.
On swipe left → reject. Implementation approach:

```tsx
// In LoadCard, add touch handlers:
const startX = useRef(0)
const deltaX = useRef(0)

function onTouchStart(e: React.TouchEvent) {
  startX.current = e.touches[0].clientX
}

function onTouchMove(e: React.TouchEvent) {
  deltaX.current = e.touches[0].clientX - startX.current
  // Apply translateX transform for visual feedback
}

function onTouchEnd() {
  if (deltaX.current > 80) {
    // Swipe right → accept
    acceptLoad(load.id)
  } else if (deltaX.current < -80) {
    // Swipe left → reject
    rejectLoad(load.id)
  }
  // Reset position with spring animation
}
```

Reveal colored backgrounds behind the card during swipe:

- Right swipe: green background with check icon
- Left swipe: red background with X icon

---

## 3. New Load Form

### Component: `src/components/loads/new-load-sheet.tsx`

Bottom sheet (shadcn `Sheet`) that slides up from the bottom.

### ASCII Wireframe

```
┌─────────────────────────────┐
│ ═══ drag handle ═══         │
│ New Load                    │
│─────────────────────────────│
│ Type: ○ Carrier  ○ Brokered │
│                             │
│ Origin *                    │
│ ┌───────────────────────┐   │
│ │ Select facility...    │   │
│ └───────────────────────┘   │
│ Destination *               │
│ ┌───────────────────────┐   │
│ │ Select facility...    │   │
│ └───────────────────────┘   │
│ Equipment *                 │
│ ┌───────────────────────┐   │
│ │ Dry Van            ▾  │   │
│ └───────────────────────┘   │
│ Commodity                   │
│ ┌───────────────────────┐   │
│ │ General freight       │   │
│ └───────────────────────┘   │
│ Weight (lbs)                │
│ ┌───────────────────────┐   │
│ │ 42000                 │   │
│ └───────────────────────┘   │
│ Rate ($)                    │
│ ┌───────────────────────┐   │
│ │ 2850                  │   │
│ └───────────────────────┘   │
│ Pickup Window               │
│ ┌───────────┐ ┌───────────┐ │
│ │ Date/Time │ │ Date/Time │ │
│ └───────────┘ └───────────┘ │
│ Delivery Window             │
│ ┌───────────┐ ┌───────────┐ │
│ │ Date/Time │ │ Date/Time │ │
│ └───────────┘ └───────────┘ │
│ Shipper *                   │
│ ┌───────────────────────┐   │
│ │ Select shipper...  ▾  │   │
│ └───────────────────────┘   │
│ Special Instructions        │
│ ┌───────────────────────┐   │
│ │                       │   │
│ │                       │   │
│ └───────────────────────┘   │
│                             │
│ [Cancel]        [Create Load]│
└─────────────────────────────┘
```

The form creates a new `Load` in the store with status `tendered`. After creation,
closes the sheet and navigates to the load detail screen.

Fields use existing shadcn components: `Input`, `Select`, `Textarea`, `Label`, `Field`.
Origin/destination use `Combobox` searching the facilities list.

Smart defaults: if the user selects a shipper, pre-fill origin with that shipper's
most common pickup facility and pre-fill rate with the average rate for the lane.

---

## 4. Dispatch Board

### Route: `src/routes/_app/dispatch.tsx`

Accessible from Dashboard quick action "Dispatch AI" or from the Loads tab as
a sub-navigation.

### ASCII Wireframe — Timeline View

```
┌─────────────────────────────┐
│ Dispatch Board    [List][TL]│  ← view toggle
│─────────────────────────────│
│ ← 6AM  8AM  10AM  12PM  2PM│  ← time axis (scroll-x)
│─────────────────────────────│
│ T-201 │████ LD-4521 ████│   │  ← truck row
│       │  ATL→MEM        │   │
│───────┼─────────────────────│
│ T-208 │    ░░ empty ░░  │   │  ← empty gap highlighted
│       │                 │   │
│───────┼─────────────────────│
│ T-212 │██ LD-4533 ██│▒▒▒│  │  ← load block + gap
│       │ CLT→ATL     │gap│  │
│───────┼─────────────────────│
│ T-217 │███ LD-4525 █████│   │
│       │ BHM→JAX         │   │
│─────────────────────────────│
│ ... (scrollable Y for 30+   │
│      active trucks)         │
│─────────────────────────────│
│ ═══ drag handle ═══        │
│ ✨ Dispatch Suggestions     │  ← AI panel (bottom sheet)
│ ┌───────────────────────┐   │
│ │ LD-4529 → T-208       │   │
│ │ Score: 94/100         │   │
│ │ ├ 18mi deadhead       │   │
│ │ ├ 9.2h HOS remaining  │   │
│ │ ├ Familiar lane ×12   │   │
│ │ └ On time for pickup  │   │
│ │ [Accept] [Modify] [Skip]│ │
│ └───────────────────────┘   │
└─────────────────────────────┘
```

### ASCII Wireframe — List View

```
┌─────────────────────────────┐
│ Dispatch Board    [List][TL]│
│─────────────────────────────│
│ UNASSIGNED LOADS (12)       │
│ ┌─────┐ ┌─────┐ ┌─────┐   │  ← horizontal scroll cards
│ │4529 │ │4530 │ │4531 │   │
│ │JAX→ │ │ATL→ │ │MEM→ │   │
│ │NSH  │ │CLT  │ │BHM  │   │
│ │$3200│ │$1850│ │$2100│   │
│ └─────┘ └─────┘ └─────┘   │
│─────────────────────────────│
│ AVAILABLE TRUCKS (18)       │
│ ┌───────────────────────┐   │
│ │ T-208  ○ Empty         │   │
│ │ James Wright | Nashville│  │
│ │ 9.5h HOS | Dry Van    │   │
│ │ [Assign LD-4529 94✨]  │   │
│ ├───────────────────────┤   │
│ │ T-225  ○ Empty         │   │
│ │ Robert Kim | Memphis   │   │
│ │ 3.2h HOS | Reefer     │   │
│ │ [Assign LD-4530 72✨]  │   │
│ └───────────────────────┘   │
└─────────────────────────────┘
```

### Component Structure

```tsx
function DispatchBoard() {
  const [view, setView] = useState<'timeline' | 'list'>('timeline')

  return (
    <div className="flex h-full flex-col">
      <DispatchHeader view={view} onViewChange={setView} />
      {view === 'timeline' ? <TimelineView /> : <DispatchListView />}
      <AiRecommendationPanel />
    </div>
  )
}
```

#### 4.1 `DispatchHeader` — `src/components/dispatch/dispatch-header.tsx`

Title + view toggle (two icon buttons: list and timeline).

#### 4.2 `TimelineView` — `src/components/dispatch/timeline-view.tsx`

Complex component. Structure:

- **Time axis**: horizontal header row showing hour markers from current time
  to +72 hours. Each hour is ~60px wide. Horizontal scroll via CSS `overflow-x: auto`.
- **Truck rows**: one row per active truck (has a driver). Each row:
  - Left column (fixed): truck ID + driver name (120px width)
  - Right area (scrolls with time): load blocks positioned by pickup/delivery times
  - Empty gaps highlighted in amber with dashed border
- **Load blocks**: colored rectangles spanning from pickup to delivery time.
  Color by load status. Shows load ID and destination inside.
  Tap → navigate to load detail.
- **Empty gap interaction**: tap an empty gap → triggers AI suggestion for that
  truck/time window.

Implementation notes:

- Use CSS grid with `grid-template-columns: 120px repeat(72, 60px)` for the timeline
- Each load block uses `grid-column` spanning the appropriate hours
- Horizontal scroll container wraps the grid
- Vertical scroll for the truck rows

#### 4.3 `DispatchListView` — `src/components/dispatch/dispatch-list-view.tsx`

Two-panel layout (top/bottom):

- Top panel (40% height): horizontal scroll of unassigned load mini-cards
- Bottom panel (60% height): scrollable list of available trucks with
  AI-matched load suggestion inline

The user taps a load card to "select" it (highlighted), then sees updated
match scores on available trucks. Tap "Assign" to confirm.

#### 4.4 `AiRecommendationPanel` — `src/components/dispatch/ai-recommendation-panel.tsx`

Bottom sheet (peek-up, ~35% screen height) that auto-appears when there are
pending recommendations.

Shows a list of `RecommendationCard` components:

```tsx
interface RecommendationCardProps {
  recommendation: DispatchRecommendation
  load: Load
  truck: Truck
  driver: Driver
  onAccept: () => void
  onModify: () => void
  onSkip: () => void
}
```

Each card:

- Header: "Assign LD-4529 → T-208 (James Wright)"
- Score badge: "94/100" with confidence color
- Factor list: each `MatchFactor` as a tree-branch line
- Three action buttons: Accept (green), Modify (blue), Skip (gray)

---

## 5. AI Dispatch Recommendations

### 5.1 Scoring Algorithm — `src/lib/dispatch-scoring.ts`

```ts
import type { Load, Truck, Driver, MatchFactor } from '@/data/types'
import { distanceMiles } from '@/lib/geo'

interface ScoreResult {
  totalScore: number
  confidence: 'high' | 'medium' | 'low'
  factors: MatchFactor[]
}

export function scoreMatch(
  load: Load,
  truck: Truck,
  driver: Driver,
): ScoreResult {
  const factors: MatchFactor[] = []

  // Factor 1: Deadhead distance (weight: 25%)
  const deadhead = distanceMiles(truck.position, load.origin.position)
  const deadheadScore = Math.max(0, 100 - deadhead * 1.5) // 0mi = 100, 67mi = 0
  factors.push({
    name: 'deadhead_miles',
    value: `${Math.round(deadhead)} mi`,
    score: deadheadScore,
    description:
      deadhead < 20
        ? 'Very close to pickup'
        : deadhead < 50
          ? 'Reasonable deadhead'
          : 'Long deadhead — consider closer trucks',
  })

  // Factor 2: HOS availability (weight: 25%)
  const driveMins = driver.hos.driveRemaining
  const loadDriveMins = (load.distance / 55) * 60 // assume 55mph avg
  const hosMargin = driveMins - loadDriveMins
  const hosScore =
    hosMargin > 120 ? 100 : hosMargin > 0 ? (hosMargin / 120) * 100 : 0
  factors.push({
    name: 'hos_remaining',
    value: `${(driveMins / 60).toFixed(1)} hrs`,
    score: hosScore,
    description:
      hosMargin > 120
        ? 'Plenty of drive time'
        : hosMargin > 0
          ? 'Tight but feasible'
          : 'Insufficient HOS — would need relay',
  })

  // Factor 3: Equipment compatibility (weight: 15%)
  const equipMatch = truck.equipmentType === load.equipmentRequired
  const equipScore = equipMatch ? 100 : 0
  factors.push({
    name: 'equipment_match',
    value: equipMatch ? 'Match' : 'Mismatch',
    score: equipScore,
    description: equipMatch
      ? `${truck.equipmentType} matches requirement`
      : `Truck is ${truck.equipmentType}, load needs ${load.equipmentRequired}`,
  })

  // Factor 4: Delivery window feasibility (weight: 15%)
  // Calculate ETA = now + deadhead drive + load drive
  // Compare to delivery appointment end
  const etaMinutes = (deadhead / 45) * 60 + loadDriveMins // 45mph for deadhead
  const windowMinutes = 480 // simplified: assume 8hr window
  const timeScore =
    etaMinutes < windowMinutes
      ? 100
      : Math.max(0, 100 - (etaMinutes - windowMinutes) * 2)
  factors.push({
    name: 'delivery_window',
    value: etaMinutes < windowMinutes ? 'On time' : 'At risk',
    score: timeScore,
    description: `Estimated ${(etaMinutes / 60).toFixed(1)}h total transit`,
  })

  // Factor 5: Driver lane familiarity (weight: 10%)
  const laneKey = `${load.origin.city.substring(0, 3).toUpperCase()}-${load.destination.city.substring(0, 3).toUpperCase()}`
  const familiar = driver.preferredLanes.includes(laneKey)
  const familiarScore = familiar ? 100 : 30
  factors.push({
    name: 'lane_familiarity',
    value: familiar ? 'Familiar' : 'New lane',
    score: familiarScore,
    description: familiar
      ? `Driver has run ${laneKey} before`
      : 'First time on this lane',
  })

  // Factor 6: Rate / profitability (weight: 10%)
  const rateScore = Math.min(100, (load.ratePerMile / 3.0) * 100)
  factors.push({
    name: 'profitability',
    value: `$${load.ratePerMile.toFixed(2)}/mi`,
    score: rateScore,
    description:
      load.ratePerMile >= 2.8 ? 'Above average rate' : 'Standard rate',
  })

  // Weighted total
  const weights = [0.25, 0.25, 0.15, 0.15, 0.1, 0.1]
  const totalScore = Math.round(
    factors.reduce((sum, f, i) => sum + f.score * weights[i], 0),
  )

  const confidence: ScoreResult['confidence'] =
    totalScore >= 85 ? 'high' : totalScore >= 60 ? 'medium' : 'low'

  return { totalScore, confidence, factors }
}
```

### 5.2 Recommendation Generator — `src/lib/dispatch-engine.ts`

```ts
import { scoreMatch } from './dispatch-scoring'
import type { DispatchRecommendation } from '@/data/types'
import { useAppStore } from '@/store'

export function generateRecommendations(): DispatchRecommendation[] {
  const { loads, trucks, drivers } = useAppStore.getState()

  // Find unassigned loads
  const unassigned = Object.values(loads).filter(
    (l) => ['tendered', 'accepted'].includes(l.status) && !l.assignedTruckId,
  )

  // Find available trucks (empty, has driver)
  const available = Object.values(trucks).filter(
    (t) => t.status === 'empty' && t.driverId,
  )

  const recommendations: DispatchRecommendation[] = []

  for (const load of unassigned) {
    const scored = available
      .map((truck) => {
        const driver = drivers[truck.driverId!]
        if (!driver) return null
        const result = scoreMatch(load, truck, driver)
        return { truck, driver, ...result }
      })
      .filter(Boolean)
      .sort((a, b) => b!.totalScore - a!.totalScore)

    const best = scored[0]
    if (best) {
      recommendations.push({
        id: `rec-${load.id}-${best.truck.id}`,
        loadId: load.id,
        truckId: best.truck.id,
        driverId: best.driver.id,
        score: best.totalScore,
        confidence: best.confidence,
        factors: best.factors,
        status: 'pending',
      })
    }
  }

  return recommendations.sort((a, b) => b.score - a.score)
}
```

### 5.3 Dispatch Confirmation Flow — `src/components/dispatch/dispatch-confirm-dialog.tsx`

When user taps "Accept" on a recommendation:

1. Show `AlertDialog` with summary:
   - "Dispatch LD-4529 to T-208?"
   - "Driver: James Wright"
   - "Score: 94/100"
   - [Cancel] [Confirm Dispatch]
2. On confirm: call `dispatchLoad()` from `load-actions.ts`
3. Show success toast: "Load #4529 dispatched to T-208. Driver notified."
4. Remove recommendation from list
5. Update truck status to `en_route`

---

## 6. Driver Management

### Route: `src/routes/_app/fleet/drivers.tsx` (nested under fleet)

### 6.1 Driver Roster — `src/components/drivers/driver-roster.tsx`

```
┌─────────────────────────────┐
│ Drivers              🔍     │
│ [All] [Available] [Driving] │
│ [Off Duty] [Reset]          │
│─────────────────────────────│
│ ┌───────────────────────┐   │
│ │ 👤 Mike Torres    98  │   │  ← performance score
│ │    T-217 | Driving    │   │
│ │    HOS: 8.2h | ATL    │   │
│ ├───────────────────────┤   │
│ │ 👤 James Wright   91  │   │
│ │    T-208 | Available  │   │
│ │    HOS: 9.5h | NSH    │   │
│ ├───────────────────────┤   │
│ │ 👤 Sarah Chen     87  │   │
│ │    T-212 | Driving    │   │
│ │    HOS: 3.1h | CLT    │   │
│ └───────────────────────┘   │
└─────────────────────────────┘
```

Each `DriverCard` shows: avatar, name, performance score (colored badge),
truck assignment, status, HOS remaining, home base. Tap → driver detail.

### 6.2 Driver Detail — `src/routes/_app/fleet/drivers/$driverId.tsx`

```
┌─────────────────────────────┐
│ ← Mike Torres          📞  │
│─────────────────────────────│
│ ┌───────────────────────┐   │
│ │ 👤  Mike Torres       │   │
│ │     Performance: 98   │   │  ← big score badge
│ │     CDL: GA-1234567   │   │
│ │     Exp: Dec 2026     │   │
│ │     Home: Atlanta     │   │
│ │     Endorsements: H,T │   │
│ │     Equipment: DV, RF │   │
│ │     Hired: Mar 2022   │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ ⏱ HOS Status               │
│ ┌───────────────────────┐   │
│ │     ╭─────────╮       │   │  ← SVG clock
│ │    ╱           ╲      │   │
│ │   │  8h 12m    │      │   │  ← drive remaining
│ │   │  remaining │      │   │
│ │    ╲           ╱      │   │
│ │     ╰─────────╯       │   │
│ │                       │   │
│ │ Drive:   8h 12m / 11h │   │
│ │ On-Duty: 9h 30m / 14h │   │
│ │ Cycle:  52h 15m / 70h │   │
│ │ Break due in: 2h 30m  │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ 📊 Performance              │
│ ┌───────────────────────┐   │
│ │ On-time pickup:   96% │   │
│ │ On-time delivery: 94% │   │
│ │ Safety score:     98  │   │
│ │ Communication:    95  │   │
│ │ Miles this week: 2840 │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ 📋 Current Assignment       │
│ ┌───────────────────────┐   │
│ │ LD-4521  ATL → MEM    │   │
│ │ T-217  Dry Van        │   │
│ │ ● In Transit          │   │
│ │ ETA: 4:30 PM          │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ 🛣 Preferred Lanes          │
│ ATL-MEM  ATL-NSH  MEM-BHM  │
└─────────────────────────────┘
```

#### 6.3 HOS Clock SVG — `src/components/drivers/hos-clock.tsx`

An SVG circular gauge visualizing the driver's HOS:

```tsx
interface HosClockProps {
  driveRemaining: number // minutes
  driveMax: number // 660 (11 hours)
  onDutyRemaining: number
  onDutyMax: number // 840 (14 hours)
  cycleRemaining: number
  cycleMax: number // 4200 (70 hours)
  nextBreakDue: number
}
```

Render as three concentric arcs:

- Outer ring: cycle time (70h) — gray track with blue fill
- Middle ring: on-duty time (14h) — gray track with amber fill
- Inner ring: drive time (11h) — gray track with green fill

Center text: remaining drive time in large bold.

Below the clock: four stat rows showing each value as `remaining / total`.

Implementation: SVG `<circle>` elements with `stroke-dasharray` and `stroke-dashoffset`
to create progress arcs. Use `transform: rotate(-90deg)` to start from 12 o'clock.

---

## 7. Truck Detail Screen

### Route: `src/routes/_app/fleet/$truckId.tsx`

```
┌─────────────────────────────┐
│ ← T-217  Dry Van  ● Route  │
│─────────────────────────────│
│ ┌───────────────────────┐   │
│ │ 🗺  Current Location    │   │
│ │     🚛 → heading E     │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ 📋 Truck Info               │
│ ┌───────────────────────┐   │
│ │ Equipment: Dry Van    │   │
│ │ Mileage:   234,567 mi │   │
│ │ Next PM:   240,000 mi │   │
│ │ Hub: Atlanta          │   │
│ │ Trailer: TRL-044      │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ 👤 Driver                   │
│ ┌───────────────────────┐   │
│ │ Mike Torres           │   │
│ │ HOS: 8.2h drive left  │   │
│ │ Score: 98  📞 Call     │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ 📦 Current Load             │
│ ┌───────────────────────┐   │
│ │ LD-4521  ATL → MEM    │   │
│ │ ● In Transit          │   │
│ │ ETA: 4:30 PM          │   │
│ │ [View Load Detail]    │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ 📅 Schedule (72h)           │
│ ┌───────────────────────┐   │
│ │ TODAY                 │   │
│ │ ██ LD-4521 ATL→MEM ██│   │
│ │ ░░ empty ░░░░░░░░░░░░│   │
│ │ TOMORROW              │   │
│ │ ██ LD-4540 MEM→NSH ██│   │
│ │ ░░ empty ░░░░░░░░░░░░│   │
│ │ DAY 3                 │   │
│ │ ░░ no assignments ░░░░│   │
│ └───────────────────────┘   │
└─────────────────────────────┘
```

### Component: `src/components/fleet/truck-schedule.tsx`

Horizontal mini-timeline per day showing load blocks and empty gaps for the
truck over 72 hours. Each load block is tappable → navigates to load detail.
Empty gaps show "No assignment" with an "AI Suggest" button.

---

## 8. Equipment Tracking

### Route: `src/routes/_app/fleet/equipment.tsx`

Simple list view of all trailers. Each `TrailerCard` shows:

- Trailer ID, type, status badge
- Position (city)
- Assigned truck/load if any
- Last inspection date

Filter by: type, status (loaded/empty/maintenance).

```
┌─────────────────────────────┐
│ Equipment            🔍     │
│ [All] [Loaded] [Empty] [PM]│
│─────────────────────────────│
│ ┌───────────────────────┐   │
│ │ TRL-044  Dry Van      │   │
│ │ ● Loaded  → T-217     │   │
│ │ LD-4521  Last insp: 2/1│  │
│ ├───────────────────────┤   │
│ │ TRL-018  Reefer       │   │
│ │ ○ Empty   Atlanta yard│   │
│ │ Last insp: 1/28      │   │
│ └───────────────────────┘   │
└─────────────────────────────┘
```

---

## 9. Brokerage Load Board

### Route: `src/routes/_app/loads/board.tsx`

### ASCII Wireframe

```
┌─────────────────────────────┐
│ Load Board           🔍     │
│─────────────────────────────│
│ ┌───────────────────────┐   │
│ │  🗺  Lane Map           │   │  ← top half
│ │  ATL──●──MEM  🟢 22%  │   │
│ │  JAX──●──NSH  🟡 11%  │   │
│ │  CLT──●──ATL  🔴  5%  │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ ═══ drag handle ═══        │  ← bottom half (drag up)
│ Sort: [Margin] [Date] [Dist]│
│ ┌───────────────────────┐   │
│ │ LD-4535  ATL→MEM      │   │
│ │ $2,850  🟢 22% margin │   │
│ │ Dry Van  PU: Feb 14   │   │
│ │ Age: 2h  SHP: Piedmont│   │
│ │           [Match →]   │   │
│ ├───────────────────────┤   │
│ │ LD-4540  JAX→NSH      │   │
│ │ $3,200  🟡 11% margin │   │
│ │ Reefer   PU: Feb 15   │   │
│ │ Age: 45m SHP: Golden  │   │
│ │           [Match →]   │   │
│ └───────────────────────┘   │
└─────────────────────────────┘
```

### Component Structure

- Top half: Leaflet map showing lanes as lines between origin/dest markers
  - Line color: green (≥15% margin), yellow (8–15%), red (<8%)
  - Origin markers as filled circles
  - Tap a lane → highlights and scrolls to matching loads below
- Bottom half: drag-up `Sheet` with load list
  - Sort options: margin, pickup date, distance, customer priority, age
  - Each card shows: load ID, lane, rate, margin%, equipment, pickup date, age, shipper
  - "Match" button → opens carrier matching sheet (Section 10)

---

## 10. Carrier Matching

### Component: `src/components/brokerage/carrier-match-sheet.tsx`

Bottom sheet that opens when user taps "Match" on a brokerage load.

### ASCII Wireframe

```
┌─────────────────────────────┐
│ ═══ drag handle ═══        │
│ Carrier Match — LD-4535     │
│ ATL → MEM  |  Dry Van      │
│─────────────────────────────│
│ ✨ AI-Ranked Carriers       │
│ ┌───────────────────────┐   │
│ │ #1  Southeast Express │   │
│ │ ⭐ 94 score | 97% OT  │   │
│ │ T-ext-12  15mi away   │   │
│ │ Expected: $2.40/mi    │   │
│ │ ├───────────────┤     │   │  ← rate slider
│ │ Offer: $2.35/mi       │   │
│ │ Your margin: $520 22% │   │  ← live calc
│ │ [Offer Load]          │   │
│ ├───────────────────────┤   │
│ │ #2  J&R Trucking      │   │
│ │ ⭐ 87 score | 91% OT  │   │
│ │ T-ext-05  32mi away   │   │
│ │ Expected: $2.55/mi    │   │
│ │ ├───────────────┤     │   │
│ │ Offer: $2.50/mi       │   │
│ │ Your margin: $342 14% │   │
│ │ [Offer Load]          │   │
│ └───────────────────────┘   │
└─────────────────────────────┘
```

### Features

- **AI-ranked list**: carriers sorted by a composite score combining:
  - Carrier scorecard (on-time, claims, communication)
  - Proximity to pickup
  - Equipment match
  - Lane familiarity
  - Rate expectation vs. budget

- **Rate slider**: for each carrier, a range slider adjusting the offered rate.
  As the user slides, the margin recalculates in real-time:

  ```
  margin = load.totalRevenue - (offeredRate * load.distance) - load.fuelSurcharge
  marginPercent = margin / load.totalRevenue * 100
  ```

- **Offer Load button**: triggers one of:
  - Simulated voice agent outbound call (navigates to voice call demo)
  - Digital offer notification (adds to carrier's offers)

- **Margin color coding**: green (≥15%), yellow (8–15%), red (<8%)

### Component: `src/components/brokerage/rate-slider.tsx`

Uses a native `<input type="range">` styled with Tailwind:

- Track: gray background
- Filled portion: colored by margin (green/yellow/red gradient)
- Thumb: accent blue circle
- Labels: min rate, max rate, current rate, margin display

---

## 11. Shipper Directory

### Route: `src/routes/_app/more/shippers.tsx`

Searchable list of all 15 shippers. Each card shows:

- Company name, industry badge
- Contact name, phone
- Active loads count
- Average volume (loads/week)
- Average rate per mile
- Tap → shipper detail

### Shipper Detail — `src/routes/_app/more/shippers/$shipperId.tsx`

```
┌─────────────────────────────┐
│ ← Piedmont Steel Works      │
│─────────────────────────────│
│ Industry: Manufacturing     │
│ Contact: John Doe           │
│ Phone: (404) 555-0100  📞  │
│ Email: john@piedmont.com    │
│ Address: 123 Industrial Blvd│
│          Atlanta, GA 30301  │
│─────────────────────────────│
│ 📊 Account Stats            │
│ Active Loads: 5             │
│ Avg Volume: 8 loads/wk     │
│ Avg Rate: $2.65/mi         │
│ Payment Terms: Net 30      │
│─────────────────────────────│
│ 🛣 Lane History              │
│ ┌───────────────────────┐   │
│ │ ATL → MEM  45 loads   │   │
│ │ Avg $2.70/mi  Last: 2d│   │
│ ├───────────────────────┤   │
│ │ ATL → NSH  23 loads   │   │
│ │ Avg $2.55/mi  Last: 5d│   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ 📦 Active Loads              │
│ [Load cards filtered to     │
│  this shipper]              │
└─────────────────────────────┘
```

---

## 12. Carrier Directory

### Route: `src/routes/_app/more/carriers.tsx`

### Carrier Detail — `src/routes/_app/more/carriers/$carrierId.tsx`

```
┌─────────────────────────────┐
│ ← Southeast Express         │
│─────────────────────────────│
│ MC: MC-123456               │
│ DOT: 1234567                │
│ Fleet Size: 8 trucks        │
│ Equipment: Dry Van, Reefer  │
│ Service Area: GA,TN,AL,SC   │
│ Payment: Standard 30        │
│ Insurance Exp: Jun 2026     │
│─────────────────────────────│
│ 📊 Scorecard                │
│ ┌───────────────────────┐   │
│ │ Overall:          94  │   │ ← big number, colored
│ │ ─────────────────     │   │
│ │ On-time PU:     97%   │   │
│ │ On-time DEL:    96%   │   │
│ │ Claims ratio:  0.8%   │   │
│ │ Communication:   92   │   │
│ │ Total loads:    156   │   │
│ │ Last load: Feb 12     │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ 🛣 Preferred Lanes           │
│ ATL-MEM  ATL-CLT  MEM-NSH  │
│─────────────────────────────│
│ 📦 Recent Loads              │
│ [Load cards for this carrier│
│  — last 10 brokered loads]  │
└─────────────────────────────┘
```

---

## 13. Communication Hub

### Component: `src/components/communication/communication-feed.tsx`

Reusable across load detail and standalone. Renders a chronological list of
`CommunicationEntry` items with visual differentiation by source:

| Source       | Style                                           |
| ------------ | ----------------------------------------------- |
| `dispatcher` | Blue-tinted bubble, right-aligned               |
| `driver`     | Green-tinted bubble, left-aligned               |
| `ai_agent`   | Purple-tinted bubble with sparkle, left-aligned |
| `system`     | Gray centered banner, small text                |
| `shipper`    | Orange-tinted bubble, left-aligned              |
| `carrier`    | Teal-tinted bubble, left-aligned                |

Each entry shows:

- Source icon + label
- Timestamp (relative or absolute based on age)
- Content text
- If AI: sparkle icon + "AI Agent" label

### Component: `src/components/communication/message-input.tsx`

Bottom-fixed input bar:

- Text input field
- Send button (right)
- Attachment icon (left) — opens simulated file picker
- On send: adds entry to `load.communications` via store

### Template Messages — `src/components/communication/template-picker.tsx`

A sheet with pre-built message templates:

- "Running approximately [X] minutes late"
- "Confirming appointment for [date/time]"
- "Load picked up, departing now"
- "Arrived at delivery, waiting for dock"
- "Rate offer: $[rate] for [lane]"

Tap a template → fills into the message input with placeholders.

---

## 14. Notification Center

### Component: `src/components/notifications/notification-center.tsx`

Slide-down overlay (or Sheet from top) showing all notifications.

```
┌─────────────────────────────┐
│ Notifications         Clear │
│─────────────────────────────│
│ NOW                         │
│ ┌───────────────────────┐   │
│ │🔴 Load #4521 late pickup│  │
│ │   T-217 behind schedule │  │
│ │   12 min ago            │  │
│ ├───────────────────────┤   │
│ │🟡 HOS warning DRV-012 │  │
│ │   45 min drive remaining│  │
│ │   18 min ago            │  │
│ └───────────────────────┘   │
│ EARLIER                     │
│ ┌───────────────────────┐   │
│ │🔵 Load #4519 delivered │  │
│ │   POD pending          │  │
│ │   2 hours ago          │  │
│ ├───────────────────────┤   │
│ │ℹ️ New load tender      │  │
│ │   From Piedmont Steel  │  │
│ │   3 hours ago          │  │
│ └───────────────────────┘   │
└─────────────────────────────┘
```

Features:

- Grouped by time (Now, Earlier, Yesterday)
- Unread items have a blue dot indicator
- Tap → navigates to related entity
- Swipe right → mark as read
- "Clear All" button
- Priority color stripe on left edge
- Accessed via bell icon in `GreetingBar` (dashboard header)

### Component: `src/components/notifications/notification-item.tsx`

Single notification row with:

- Priority color dot
- Title (bold if unread)
- Body text (1 line, truncated)
- Relative timestamp
- Unread indicator dot

---

## 15. Document Management

### Component: `src/components/documents/document-grid.tsx`

Grid layout of document thumbnails. Used in `LoadDocumentsSection` and
standalone document viewer.

```tsx
interface DocumentGridProps {
  documents: LoadDocument[]
  onView: (doc: LoadDocument) => void
  onAdd: () => void
}
```

Each document cell:

- 80×100px thumbnail area with gray background
- Document type icon centered (FileText for BOL, FileCheck for POD, etc.)
- Type label below
- Status indicator: green check (received), red badge (missing), gray dot (pending)

### Component: `src/components/documents/document-viewer.tsx`

Full-screen overlay for viewing a document:

```
┌─────────────────────────────┐
│ ← BOL — Load #4521    ⋯   │
│─────────────────────────────│
│                             │
│ ┌───────────────────────┐   │
│ │                       │   │
│ │   [Simulated document │   │
│ │    image / placeholder│   │
│ │    with realistic     │   │
│ │    BOL layout]        │   │
│ │                       │   │
│ │                       │   │
│ └───────────────────────┘   │
│                             │
│ Pinch to zoom  |  Rotate →  │
│─────────────────────────────│
│ Uploaded: Feb 12, 9:15 AM   │
│ Status: Received ✓          │
└─────────────────────────────┘
```

Features:

- Placeholder image (gray rectangle with document type text)
- Pinch-to-zoom via CSS `transform: scale()` + touch handlers
- Rotate button (90° increments)
- Document metadata at bottom

### Component: `src/components/documents/document-capture.tsx`

Simulated camera capture sheet:

```
┌─────────────────────────────┐
│ ═══ drag handle ═══        │
│ Add Document                │
│─────────────────────────────│
│ Document Type:              │
│ [BOL] [POD] [Scale] [Other]│
│                             │
│ ┌───────────────────────┐   │
│ │                       │   │
│ │   📷 Camera Preview   │   │
│ │      (simulated)      │   │
│ │                       │   │
│ └───────────────────────┘   │
│                             │
│ [📷 Capture]  [📁 Upload]  │
│                             │
│ On "capture": generates a   │
│ placeholder document and    │
│ adds it to the load.        │
└─────────────────────────────┘
```

---

## 16. Store Additions

### 16.1 Recommendation Slice — `src/store/recommendation-slice.ts`

```ts
export interface RecommendationSlice {
  recommendations: DispatchRecommendation[]
  generateRecommendations: () => void
  acceptRecommendation: (id: string) => void
  rejectRecommendation: (id: string) => void
  modifyRecommendation: (id: string, newTruckId: EntityId) => void
}
```

### 16.2 Voice Call Slice — `src/store/voice-slice.ts`

```ts
export interface VoiceSlice {
  voiceCalls: VoiceCall[]
  activeCallId: string | null
  addVoiceCall: (call: VoiceCall) => void
  updateCallOutcome: (id: string, outcome: CallOutcome) => void
  setActiveCall: (id: string | null) => void
}
```

### 16.3 Update Root Store

Add `RecommendationSlice` and `VoiceSlice` to the `AppStore` type and wire into
the `create()` call in `src/store/index.ts`.

### 16.4 New Store Actions for Load Slice

Add to `LoadSlice`:

- `assignLoad(loadId, truckId, driverId)` — sets assignedTruckId/driverId, adds lifecycle event
- `addLoadCommunication(loadId, entry)` — appends to communications array
- `addLoadDocument(loadId, doc)` — appends to documents array

### 16.5 Expand Notification Slice

Add:

- `addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'readAt' | 'snoozedUntil'>)` — auto-generates id and timestamps

---

## 17. File Creation Order

### Phase A — Store Additions

| #   | File                                | Action                        |
| --- | ----------------------------------- | ----------------------------- |
| 1   | `src/store/recommendation-slice.ts` | CREATE                        |
| 2   | `src/store/voice-slice.ts`          | CREATE                        |
| 3   | `src/store/index.ts`                | EDIT — add new slices         |
| 4   | `src/store/load-slice.ts`           | EDIT — add new actions        |
| 5   | `src/store/notification-slice.ts`   | EDIT — expand addNotification |

### Phase B — Action Libraries

| #   | File                          | Depends On              |
| --- | ----------------------------- | ----------------------- |
| 6   | `src/lib/load-actions.ts`     | store, types            |
| 7   | `src/lib/dispatch-scoring.ts` | types, geo              |
| 8   | `src/lib/dispatch-engine.ts`  | dispatch-scoring, store |

### Phase C — Load Detail Screen

| #   | File                                                        | Depends On                 |
| --- | ----------------------------------------------------------- | -------------------------- |
| 9   | `src/components/load-detail/load-detail-header.tsx`         | types, status-badge        |
| 10  | `src/components/load-detail/load-route-section.tsx`         | react-leaflet, types       |
| 11  | `src/components/load-detail/load-assignment-section.tsx`    | types, store               |
| 12  | `src/components/load-detail/load-lifecycle-section.tsx`     | types, constants           |
| 13  | `src/components/load-detail/load-financials-section.tsx`    | types, format              |
| 14  | `src/components/load-detail/load-documents-section.tsx`     | types                      |
| 15  | `src/components/load-detail/load-communication-section.tsx` | types, store               |
| 16  | `src/routes/_app/loads/$loadId.tsx`                         | all load-detail components |

### Phase D — Dispatch Board

| #   | File                                                  | Depends On                  |
| --- | ----------------------------------------------------- | --------------------------- |
| 17  | `src/components/dispatch/dispatch-header.tsx`         | —                           |
| 18  | `src/components/dispatch/timeline-view.tsx`           | store, types, constants     |
| 19  | `src/components/dispatch/dispatch-list-view.tsx`      | store, types                |
| 20  | `src/components/dispatch/recommendation-card.tsx`     | types, ai-suggestion-banner |
| 21  | `src/components/dispatch/ai-recommendation-panel.tsx` | recommendation-card, sheet  |
| 22  | `src/components/dispatch/dispatch-confirm-dialog.tsx` | alert-dialog, load-actions  |
| 23  | `src/routes/_app/dispatch.tsx`                        | all dispatch components     |

### Phase E — Driver Management

| #   | File                                            | Depends On                    |
| --- | ----------------------------------------------- | ----------------------------- |
| 24  | `src/components/drivers/driver-card.tsx`        | types, status-badge, avatar   |
| 25  | `src/components/drivers/driver-roster.tsx`      | driver-card, store            |
| 26  | `src/components/drivers/hos-clock.tsx`          | types (SVG component)         |
| 27  | `src/components/drivers/driver-performance.tsx` | types                         |
| 28  | `src/components/drivers/driver-detail-view.tsx` | hos-clock, performance, store |
| 29  | `src/routes/_app/fleet/drivers.tsx`             | driver-roster                 |
| 30  | `src/routes/_app/fleet/drivers/$driverId.tsx`   | driver-detail-view            |

### Phase F — Truck Detail & Equipment

| #   | File                                         | Depends On            |
| --- | -------------------------------------------- | --------------------- |
| 31  | `src/components/fleet/truck-schedule.tsx`    | types, store          |
| 32  | `src/components/fleet/truck-detail-view.tsx` | truck-schedule, store |
| 33  | `src/routes/_app/fleet/$truckId.tsx`         | truck-detail-view     |
| 34  | `src/components/fleet/trailer-card.tsx`      | types, status-badge   |
| 35  | `src/routes/_app/fleet/equipment.tsx`        | trailer-card, store   |

### Phase G — Brokerage

| #   | File                                               | Depends On                                     |
| --- | -------------------------------------------------- | ---------------------------------------------- |
| 36  | `src/components/brokerage/lane-map.tsx`            | react-leaflet, store                           |
| 37  | `src/components/brokerage/board-load-card.tsx`     | types, format                                  |
| 38  | `src/components/brokerage/rate-slider.tsx`         | —                                              |
| 39  | `src/components/brokerage/carrier-match-card.tsx`  | types, rate-slider                             |
| 40  | `src/components/brokerage/carrier-match-sheet.tsx` | carrier-match-card, sheet                      |
| 41  | `src/routes/_app/loads/board.tsx`                  | lane-map, board-load-card, carrier-match-sheet |

### Phase H — Directories

| #   | File                                              | Depends On               |
| --- | ------------------------------------------------- | ------------------------ |
| 42  | `src/components/shippers/shipper-card.tsx`        | types                    |
| 43  | `src/components/shippers/shipper-detail-view.tsx` | types, store             |
| 44  | `src/routes/_app/more/shippers.tsx`               | shipper-card             |
| 45  | `src/routes/_app/more/shippers/$shipperId.tsx`    | shipper-detail-view      |
| 46  | `src/components/carriers/carrier-card.tsx`        | types                    |
| 47  | `src/components/carriers/carrier-scorecard.tsx`   | types                    |
| 48  | `src/components/carriers/carrier-detail-view.tsx` | carrier-scorecard, store |
| 49  | `src/routes/_app/more/carriers.tsx`               | carrier-card             |
| 50  | `src/routes/_app/more/carriers/$carrierId.tsx`    | carrier-detail-view      |

### Phase I — Communication & Notifications

| #   | File                                                   | Depends On               |
| --- | ------------------------------------------------------ | ------------------------ |
| 51  | `src/components/communication/communication-feed.tsx`  | types                    |
| 52  | `src/components/communication/message-input.tsx`       | store                    |
| 53  | `src/components/communication/template-picker.tsx`     | sheet                    |
| 54  | `src/components/notifications/notification-item.tsx`   | types, format            |
| 55  | `src/components/notifications/notification-center.tsx` | notification-item, store |

### Phase J — Document Management

| #   | File                                            | Depends On    |
| --- | ----------------------------------------------- | ------------- |
| 56  | `src/components/documents/document-grid.tsx`    | types         |
| 57  | `src/components/documents/document-viewer.tsx`  | types, dialog |
| 58  | `src/components/documents/document-capture.tsx` | sheet, store  |

### Phase K — Load Card Swipe Enhancement

| #   | File                                 | Action                            |
| --- | ------------------------------------ | --------------------------------- |
| 59  | `src/components/loads/load-card.tsx` | EDIT — add swipe gesture handlers |

### Phase L — More Menu & Navigation Updates

| #   | File                        | Depends On                                                          |
| --- | --------------------------- | ------------------------------------------------------------------- |
| 60  | `src/routes/_app/more.tsx`  | EDIT — add menu links to shippers, carriers, reports, demo controls |
| 61  | `src/routes/_app/fleet.tsx` | EDIT — add sub-nav for drivers and equipment                        |

### Summary

**New files: ~55** (35 components, 8 routes, 3 library files, 2 store slices, plus edits to ~7 existing files)

### Verification Checklist

After completing Part 2, you should be able to:

- [ ] Tap any load card → full load detail screen with all 6 sections
- [ ] Load lifecycle stepper shows correct progression with timestamps
- [ ] Financials section shows correct rate breakdown and margin
- [ ] Document grid shows placeholder thumbnails with status indicators
- [ ] Communication log shows chronological entries with source differentiation
- [ ] New Load form opens as bottom sheet, creates a load in the store
- [ ] Dispatch board timeline view shows 72-hour truck schedules
- [ ] Dispatch board list view shows unassigned loads and available trucks
- [ ] AI recommendation panel shows scored suggestions with factor breakdown
- [ ] Accept recommendation → dispatches load, updates truck status, adds notification
- [ ] Driver roster shows all 30 drivers with status filters
- [ ] Driver detail shows HOS clock SVG with correct remaining time arcs
- [ ] Truck detail shows current location, assignment, and 72-hour schedule
- [ ] Equipment page lists all trailers with status filtering
- [ ] Brokerage load board shows lane map with margin-colored lines
- [ ] Carrier matching sheet shows AI-ranked carriers with rate slider
- [ ] Rate slider updates margin calculation in real-time
- [ ] Shipper directory lists all 15 shippers, detail shows lane history
- [ ] Carrier directory lists all 25 carriers, detail shows scorecard
- [ ] Notification center opens with grouped notifications
- [ ] All new routes are navigable via bottom tab bar and internal links
- [ ] `bun run build` succeeds with no TypeScript errors
- [ ] All screens usable at 390px width
