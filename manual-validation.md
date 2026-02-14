# FreightOS — Manual Validation Procedures

> Step-by-step procedures to manually validate each feature.
> Run these after completing each stage to verify correctness.
> Use Chrome DevTools → Device Mode → iPhone 14 (390px) for all tests.

---

## Pre-Conditions (All Tests)

1. `bun run dev` is running on port 3000
2. Chrome DevTools open with device mode set to iPhone 14 (390×844)
3. `bun run build` succeeds without errors
4. No console errors on initial page load

---

## Stage 1 Validation

### V1.1 Navigation & Routing

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open `localhost:3000` | Dashboard screen loads with greeting bar |
| 2 | Tap "Loads" tab | URL changes to `/loads`, load list appears |
| 3 | Tap "Fleet" tab | URL changes to `/fleet`, map renders |
| 4 | Tap "AI" tab | URL changes to `/ai`, placeholder shown |
| 5 | Tap "More" tab | URL changes to `/more`, placeholder shown |
| 6 | Tap "Dashboard" tab | Returns to `/`, dashboard visible |
| 7 | Check active tab highlight | Active tab icon/text is blue, others are gray |
| 8 | Verify safe area | Tab bar has bottom padding on iOS viewports |

### V1.2 Dashboard Data

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Check greeting | Shows "Good morning/afternoon/evening" with date |
| 2 | Check status chips | Two pills show truck count and exception count |
| 3 | Check KPI grid | 4 cards with numeric values (not 0 or NaN) |
| 4 | Tap "Active Loads" KPI | Navigates to loads list |
| 5 | Navigate back to dashboard | Dashboard state preserved |
| 6 | Check exception feed | 3-12 exception cards sorted by severity |
| 7 | Check AI suggestion on exception | Purple text with sparkle icon visible |
| 8 | Check schedule timeline | At least 3 timeline events visible |
| 9 | Scroll dashboard | All sections scroll smoothly, no overflow issues |

### V1.3 Dashboard Map

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Locate mini map | Map renders at ~200px height below KPI grid |
| 2 | Check truck dots | Colored circle markers visible on map |
| 3 | Count visible markers | Multiple markers across Southeast US |
| 4 | Pinch/zoom map | Map responds to gesture (zoom in/out) |
| 5 | Tap map area | Navigates to Fleet tab full map |

### V1.4 Fleet Map

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tap Fleet tab | Full-screen map loads with truck markers |
| 2 | Count markers | ~30 visible markers (some may cluster) |
| 3 | Check marker colors | Blue (en route), gray (empty), amber (at facility), red (OOS) |
| 4 | Tap a truck marker | Popup card appears with truck info |
| 5 | Check popup content | Shows truck ID, driver name, status, current load |
| 6 | Tap "All" filter | All trucks visible |
| 7 | Tap "En Route" filter | Only blue markers remain, count ~18 |
| 8 | Tap "Empty" filter | Only gray markers remain, count ~9 |
| 9 | Tap "Out of Service" filter | Only red markers, count ~2 |
| 10 | Drag up truck list sheet | Scrollable truck list appears |
| 11 | Check truck card content | ID, equipment type, status badge, driver, HOS |

### V1.5 Load List

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tap Loads tab | Load list with segment control visible |
| 2 | Check "Active" segment | ~62 loads displayed |
| 3 | Tap "Available" segment | ~12 unmatched loads displayed |
| 4 | Tap "Completed" segment | ~8 recently delivered loads |
| 5 | Tap "Active" again | Returns to active loads |
| 6 | Tap "Status" filter pill | Dropdown shows all load statuses |
| 7 | Select "In Transit" | Only in-transit loads shown (~20) |
| 8 | Clear filter (tap X) | All active loads return |
| 9 | Tap "Equipment" filter | Select "Reefer" → ~10 loads shown |
| 10 | Check load card content | ID, route, rate, status badge, driver, ETA visible |
| 11 | Check margin on brokered loads | Green/yellow/red color based on margin % |
| 12 | Check AI suggestion row | Purple text visible on some cards |
| 13 | Tap FAB (+) button | Speed-dial expands with 3 options |
| 14 | Tap outside FAB | Speed-dial collapses |
| 15 | Scroll load list | Smooth scrolling, no janky reflows |

---

## Stage 2 Validation

### V2.1 Load Detail

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | From load list, tap any load card | Load detail screen opens |
| 2 | Check sticky header | Load ID + status badge visible at top |
| 3 | Check route map | Mini map shows origin/destination markers + route line |
| 4 | Check origin card | Facility name, address, appointment window |
| 5 | Check destination card | Same fields + ETA if in transit |
| 6 | Check distance | Shows miles and estimated drive time |
| 7 | Scroll to Assignment | Driver card with name, phone, HOS |
| 8 | Tap phone number | Should attempt to call (or show tel: link) |
| 9 | Scroll to Lifecycle | Stepper with correct current stage highlighted |
| 10 | Check completed stages | Green checks with timestamps |
| 11 | Check current stage | Blue pulsing indicator |
| 12 | Scroll to Financials | Rate breakdown with correct math |
| 13 | Verify: line haul + surcharge + accessorials = total | Math is correct |
| 14 | For brokered: verify margin | Revenue - carrier cost = margin amount |
| 15 | Scroll to Documents | Grid of 3-4 document thumbnails |
| 16 | Check document statuses | Mix of received (green), missing (red), pending (gray) |
| 17 | Scroll to Communication | Chronological entries with timestamps |
| 18 | Check AI entries | Purple accent with sparkle icon |
| 19 | Type in note input | Text appears, send button enables |
| 20 | Tap send | New entry appears at bottom of communication log |
| 21 | Tap back arrow | Returns to load list |

### V2.2 Dispatch Board

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to dispatch board | Timeline view loads by default |
| 2 | Check time axis | Hour markers from current time, scrollable horizontally |
| 3 | Scroll timeline horizontally | See 24-72 hours of schedule |
| 4 | Check truck rows | Each row shows truck ID + load blocks |
| 5 | Identify empty gaps | Amber/dashed areas between load blocks |
| 6 | Tap a load block | Navigates to load detail |
| 7 | Switch to List View | Toggle button changes view |
| 8 | Check unassigned loads | Horizontal scroll of mini cards at top |
| 9 | Check available trucks | Scrollable list below |
| 10 | Check AI recommendation panel | Bottom sheet with scored suggestions |
| 11 | Read a recommendation | Score, 6 factors with values, 3 action buttons |
| 12 | Tap "Accept" on recommendation | Confirmation dialog appears |
| 13 | Confirm dispatch | Toast: "Load dispatched to T-XXX" |
| 14 | Check load status updated | Load now shows "dispatched" in load list |
| 15 | Tap "Skip" on recommendation | Card removed from list |

### V2.3 AI Dispatch Scoring

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open a recommendation card | View all 6 scoring factors |
| 2 | Check deadhead miles | Reasonable value (5-60 mi) with score |
| 3 | Check HOS remaining | Shows hours, score reflects sufficiency |
| 4 | Check equipment match | "Match" or "Mismatch" with 100 or 0 score |
| 5 | Check delivery window | "On time" or "At risk" |
| 6 | Check lane familiarity | "Familiar" or "New lane" |
| 7 | Check profitability | Rate per mile with score |
| 8 | Verify total score | Weighted average seems reasonable (60-98) |
| 9 | Verify confidence label | High (85+), Medium (60-84), Low (<60) |

### V2.4 Driver Management

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to driver roster | List of 30 drivers visible |
| 2 | Check filter buttons | All, Available, Driving, Off Duty, Reset |
| 3 | Tap "Available" | Shows ~8 drivers |
| 4 | Tap "Reset" | Shows ~5 drivers on 34-hour reset |
| 5 | Tap a driver card | Driver detail screen opens |
| 6 | Check HOS clock SVG | Three concentric arcs visible |
| 7 | Verify drive time remaining | Matches the driver's HOS data |
| 8 | Check performance section | On-time %, safety score, etc. |
| 9 | Check current assignment | Shows assigned truck and load |
| 10 | Check preferred lanes | Lane codes displayed |

### V2.5 Brokerage & Carrier Matching

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to load board | Map + list hybrid view |
| 2 | Check lane map | Lines between origin/dest with margin colors |
| 3 | Check margin colors | Green (≥15%), yellow (8-15%), red (<8%) |
| 4 | Drag up load list | Scrollable list of brokered loads |
| 5 | Tap "Match" on a load | Carrier matching sheet opens |
| 6 | Check carrier ranking | AI-ranked with scores |
| 7 | Check rate slider | Slider adjustable between min/max rate |
| 8 | Move rate slider | Margin amount and percentage update in real-time |
| 9 | Check margin color changes | Goes from green to yellow to red as rate increases |
| 10 | Tap "Offer Load" | Confirmation or navigation to voice demo |

### V2.6 Notification Center

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tap bell icon on dashboard | Notification center opens |
| 2 | Check notification groups | "Now", "Earlier" sections |
| 3 | Check unread indicators | Blue dots on unread items |
| 4 | Tap a notification | Navigates to related entity |
| 5 | Check priority colors | Red (critical), yellow (warning), blue (info) |

---

## Stage 3 Validation

### V3.1 AI Chat Interface

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tap AI tab → Chat sub-tab | Chat interface loads with empty state |
| 2 | Check suggestion chips | Default chips visible (empty trucks, plan, etc.) |
| 3 | Type "What's the situation?" | Message appears right-aligned in blue |
| 4 | Wait for response | Typing indicator (3 dots) appears, then AI response |
| 5 | Check AI response | Purple-tinted bubble with real numbers (load counts, truck counts) |
| 6 | Check action buttons | Buttons like "Show empty trucks" visible in response |
| 7 | Tap an action button | New AI response with relevant data |
| 8 | Type "Load #4521" | AI responds with specific load details |
| 9 | Type "Show empty trucks" | AI lists available trucks with locations |
| 10 | Type "Find a truck for Atlanta to Memphis" | AI shows matching trucks with scores |
| 11 | Type gibberish | AI responds with helpful fallback listing available commands |
| 12 | Check suggestion chips update | Chips change based on last AI response context |

### V3.2 Voice Agent Demo

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to AI → Voice sub-tab | Voice dashboard loads |
| 2 | Tap "Start Demo Call" or test call | Voice call demo opens (dark screen) |
| 3 | Check caller info | Name, company, phone displayed |
| 4 | Tap play button | Transcript starts appearing |
| 5 | Check word-by-word reveal | Words appear one at a time, not all at once |
| 6 | Check speaker differentiation | Caller (white) vs AI (purple) text |
| 7 | Check system actions | Actions appear as AI processes the call |
| 8 | Tap speed button | Cycles through 1x, 1.5x, 2x |
| 9 | Verify speed change | Transcript advances faster at 2x |
| 10 | Tap skip forward | Jumps to next key moment (system action) |
| 11 | Use scrub bar | Drag to any point in call timeline |
| 12 | Let call finish (or tap End) | Post-call summary appears |
| 13 | Check summary content | AI-generated summary, actions taken, quality metrics |
| 14 | Tap "Try Another" | Returns to scenario selection |
| 15 | Play scenario 3 (outbound) | Outbound call demo works with carrier negotiation |

### V3.3 Voice Dashboard

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Check Live Calls tab | Shows active call card or "no active calls" state |
| 2 | Check History tab | List of completed demo calls |
| 3 | Tap a history entry | Expands to show full transcript and summary |
| 4 | Check Performance tab | Metrics and Recharts charts visible |
| 5 | Check calls-by-hour chart | Bar chart renders with data |
| 6 | Check Settings tab | Agent name, voice style, business rules visible |
| 7 | Toggle rate quotation | Switch changes state |
| 8 | Edit greeting text | Text field is editable |

### V3.4 Reports & Analytics

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to More → Reports | Reports screen loads |
| 2 | Check date range selector | Today, Week, Month, Custom tabs |
| 3 | Check KPI strip | 6 metric cards with values and trend arrows |
| 4 | Scroll KPI strip horizontally | All 6 metrics accessible |
| 5 | Check Revenue & Margin chart | Bars + line render in Recharts |
| 6 | Check Load Volume chart | Stacked bars (carrier + brokered) |
| 7 | Check Lane Heat Map | Leaflet map with colored lane lines |
| 8 | Tap a lane on heat map | Popup shows lane stats |
| 9 | Check On-Time Gauges | Two semicircular gauges with percentages |
| 10 | Check Top Customers | Horizontal bar chart with shipper names |
| 11 | Check Driver Scorecards | Ranked list with scores |
| 12 | Check AI Impact card | 4 metrics (dispatches, calls, exceptions, time saved) |
| 13 | Change date range to "Today" | Chart data updates |

### V3.5 Demo Controls — Scenarios

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to More → Demo Controls | Demo panel loads |
| 2 | Check scenario list | 6 scenarios with descriptions |
| 3 | Note current exception count | E.g., 3 exceptions on dashboard |
| 4 | Select "Weather Disruption" | Radio button selected |
| 5 | Tap "Load Scenario" | State replaces — may show loading |
| 6 | Navigate to Dashboard | Exception count changed, weather alerts visible |
| 7 | Return to Demo Controls | "Weather Disruption" still selected |
| 8 | Select "Normal Operations" | Tap "Load Scenario" |
| 9 | Check Dashboard | Returns to baseline state |

### V3.6 Demo Controls — Time Simulator

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Check current time display | Shows simulated time |
| 2 | Check events queue | 4-5 upcoming events listed |
| 3 | Tap "+15m" button | Time advances 15 minutes |
| 4 | Check events queue | Triggered events removed, new ones may appear |
| 5 | Tap "+1h" three times | Total +3 hours advanced |
| 6 | Navigate to Dashboard | New exceptions may have appeared |
| 7 | Tap "+4h" | Advance to trigger weather alert events |
| 8 | Check exception feed | Weather-related exceptions visible |
| 9 | Tap "Play" button | Time advances continuously |
| 10 | Change speed to 5x | Time advances 5 simulated minutes per real second |
| 11 | Tap "Pause" | Time stops advancing |

### V3.7 Demo Controls — Event Injector

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tap "Breakdown" button | Entity picker appears (select a truck) |
| 2 | Select a truck | Breakdown exception created |
| 3 | Check toast notification | "Breakdown created for T-XXX" |
| 4 | Navigate to Dashboard | New critical exception in feed |
| 5 | Tap "New Load" button | New load auto-generated |
| 6 | Navigate to Loads | New load visible in Available segment |
| 7 | Tap "Incoming Call" button | Voice demo launches |
| 8 | Return to Demo Controls | All buttons functional |
| 9 | Tap "Reset to Default" | Confirmation dialog appears |
| 10 | Confirm reset | All state returns to seed data |

### V3.8 Guided Tour

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tap "Start Guided Tour" | Overlay appears with spotlight |
| 2 | Check spotlight | Dark overlay with cutout around target element |
| 3 | Check tooltip | Title + description + step counter |
| 4 | Tap "Next" | Moves to step 2, spotlight shifts |
| 5 | Tap "Back" | Returns to step 1 |
| 6 | Tap "Next" through 5 steps | Each step highlights a different element |
| 7 | Check navigation between screens | Tour navigates to different tabs as needed |
| 8 | Tap "Skip" at any point | Tour closes, overlay removed |
| 9 | Restart tour | Start from step 1 again |
| 10 | Complete all 15 steps | Last step shows "Finish" button |
| 11 | Tap "Finish" | Tour closes cleanly |

### V3.9 End-to-End Scenario Walkthrough

This validates the complete user journey across all stages.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Start on Dashboard | Greeting, KPIs, map, exceptions visible |
| 2 | Tap Quick Action "New Load" | New load form opens as bottom sheet |
| 3 | Fill form: ATL→MEM, Dry Van, $2850 | All fields accept input |
| 4 | Submit form | New load created, navigates to detail |
| 5 | Check load status | "Tendered" |
| 6 | Navigate to Dispatch Board | Board shows the new load as unassigned |
| 7 | Check AI recommendation | Recommendation for the new load appears |
| 8 | Tap "Accept" on recommendation | Confirmation dialog |
| 9 | Confirm | Load dispatched, truck assigned |
| 10 | Check load detail | Status: "Dispatched", driver/truck assigned |
| 11 | Open Demo Controls → Time Sim | Advance time +2h |
| 12 | Check load status | May have progressed to "In Transit" |
| 13 | Open AI chat | Ask "What's the status of load [ID]?" |
| 14 | Verify AI response | Shows current load status with details |
| 15 | Navigate to Fleet → Map | Assigned truck visible on route |
| 16 | Navigate to Reports | Revenue reflects the new load |
| 17 | Open voice demo | Play "Where's my truck" scenario |
| 18 | Verify demo plays | Full transcript with system actions |

---

## Build & Lint Validation

| Check | Command | Expected Result |
|-------|---------|-----------------|
| TypeScript | `bun run build` | Exit code 0, no type errors |
| ESLint | `bun run lint` | No errors (warnings acceptable) |
| Prettier | `bun run format` | All files formatted |
| Dev server | `bun run dev` | Starts on port 3000, no crashes |
| Console | Check browser console | No runtime errors during normal use |
| Mobile layout | DevTools → iPhone 14 | All screens fit 390px, no horizontal overflow |
| Tap targets | Visual check | All buttons/links ≥44px touch target |
