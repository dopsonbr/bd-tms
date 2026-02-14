# FreightOS — Product Requirements Document

## Vision

A mobile-first trucking management platform for regional carriers and brokerages that replaces fragmented spreadsheets, phone calls, and legacy TMS systems with a unified interface powered by AI agents. The prototype must be fully demoable on a phone screen, with every feature interactive and explorable without backend infrastructure.

---

## 1. User Roles & Personas

### 1.1 Dispatcher (Carrier Side)
Primary user. Manages a fleet of 20–150 trucks across a regional network. Juggles driver availability, load assignments, HOS compliance, and real-time exceptions. Currently lives on phone calls, whiteboards, and spreadsheets. Needs to work from a phone while walking the yard or at home after hours.

### 1.2 Broker / Load Planner (Brokerage Side)
Sources loads from shippers, matches them to carriers (internal fleet or partner carriers), negotiates rates, and tracks delivery. Manages a book of business with 50–200 active shipper relationships. Needs instant access to capacity, margin analysis, and carrier scorecards.

### 1.3 Driver
Interacts primarily through voice or a simplified mobile view. Receives dispatch assignments, confirms pickups/deliveries, reports exceptions, and submits documents (BOL photos, POD). Needs zero-friction interaction — ideally hands-free while driving.

### 1.4 Operations Manager
Oversees both carrier and brokerage operations. Needs dashboards, P&L visibility, KPI tracking, and the ability to drill into any load or lane. Reviews AI agent decisions and sets operational policies.

### 1.5 Shipper Contact (External)
Does not log in. Interacts via AI voice agent for load tenders, status checks, and appointment scheduling. The system must handle their calls seamlessly as if they're talking to a human dispatcher.

### 1.6 Partner Carrier (External)
Small carriers or owner-operators who receive load offers via phone (AI voice agent), text, or a simplified portal. May never touch the app directly.

---

## 2. Carrier Operations Module

### 2.1 Fleet Dashboard
- Real-time map view of all trucks with status indicators (en route, loading, empty, out of service, at rest)
- Tap any truck to see: current load, driver info, ETA, HOS remaining, next planned load
- Filter/sort by status, region, driver, equipment type
- Empty truck highlight with "time until next load" countdown
- Exception badges (late, HOS violation risk, maintenance due, detention alert)

### 2.2 Load Management
- Load list view with swipe actions (accept, reject, reassign, call driver)
- Load detail screen: origin/destination, commodity, weight, rate, pickup/delivery windows, special instructions, reference numbers
- Load lifecycle tracker: tendered → accepted → dispatched → in transit → at pickup → loaded → in transit → at delivery → delivered → POD received → invoiced
- Multi-stop load support with individual stop status tracking
- Load board integration placeholder (simulated DAT/Truckstop feed)

### 2.3 Dispatch Board
- Drag-and-drop style assignment (adapted for touch: tap truck, tap load, confirm)
- Timeline view showing each truck's schedule for the next 72 hours
- Conflict detection: HOS violations, equipment mismatch, geographic impossibility, overlapping appointments
- Suggested assignments from AI dispatch agent (see Section 5)
- Batch dispatch capability for recurring lanes

### 2.4 Driver Management
- Driver roster with availability status, current location, HOS summary
- Driver profile: CDL info, endorsements, equipment certified, preferred lanes, home base, performance score
- HOS clock visualization showing drive time remaining, on-duty time, 34-hour reset status
- Communication hub: tap to call, send text, push notification, or trigger AI voice callback
- Document viewer for CDL, medical card, MVR (simulated)

### 2.5 Equipment Tracking
- Trailer pool management: location, status (loaded, empty, in maintenance), assigned driver/load
- Equipment type catalog: dry van, reefer, flatbed, step deck, tanker
- Maintenance schedule alerts and out-of-service tracking
- Trailer interchange tracking for drop-and-hook operations

### 2.6 Safety & Compliance
- HOS violation prediction (flags drivers approaching limits before they hit them)
- FMCSA compliance dashboard (simulated CSA scores, inspection history)
- Pre/post-trip inspection digital forms
- Incident reporting with photo capture and GPS stamp
- Drug testing schedule tracker

---

## 3. Brokerage Operations Module

### 3.1 Load Sourcing & Shipper Management
- Shipper directory with contact info, lane history, volume trends, average rates
- Incoming load tender queue (simulating EDI 204 / API tenders)
- Manual load entry form with smart defaults based on lane history
- Rate calculator: historical lane rates, market rate comparison, margin target
- RFP management: track quoted lanes, win rates, contract vs spot mix

### 3.2 Carrier Matching & Capacity
- Carrier database with scorecards: on-time %, claims ratio, communication score, lane coverage, equipment types
- Capacity search: find available trucks by origin, destination, equipment type, and date
- Rate negotiation tracker: offer, counter, accepted rate, margin
- Preferred carrier lists per lane with auto-offer sequencing
- Partner carrier onboarding checklist (authority, insurance, W-9 — simulated)

### 3.3 Load Board (Internal)
- All available loads in a searchable, filterable list
- Lane visualization on map with origin/destination markers and available capacity overlay
- Margin indicator per load (green/yellow/red based on target)
- Age tracking: how long a load has been unmatched, with escalation indicators

### 3.4 Rate Management
- Lane rate database with historical trends (chart view)
- Customer-specific rate agreements
- Spot vs contract rate comparison
- Fuel surcharge calculator
- Accessorial charge management (detention, layover, lumper, TONU)
- Margin analysis per load, per customer, per lane, per time period

### 3.5 Accounts Receivable / Payable (Simplified)
- Invoice generation from delivered loads (auto-populated from load data)
- Aging report: 30/60/90 day buckets per customer
- Carrier pay status tracking
- Quick-pay vs standard pay terms per carrier
- Factoring integration placeholder
- Simple P&L view per load showing revenue, carrier cost, accessorials, net margin

---

## 4. Shared Operations Features

### 4.1 Real-Time Tracking & Visibility
- Live map with all active loads (carrier and brokered)
- Geofence-based auto check-in/check-out at facilities
- ETA calculation with traffic-aware routing
- Customer-facing tracking links (simulated — shows what shipper would see)
- Breadcrumb trail showing historical route for any load
- Detention timer: auto-starts when truck arrives at facility, alerts at threshold

### 4.2 Document Management
- Photo capture for BOL, POD, scale tickets, lumper receipts
- Document association to loads with auto-categorization
- Document viewer with zoom, rotate, annotate
- Missing document alerts tied to invoicing workflow

### 4.3 Communication Hub
- Unified inbox: all messages (text, voice transcripts, system notifications) per load
- Quick actions: call, text, email, push notification
- Template messages for common scenarios (running late, appointment confirmation, rate offer)
- Communication log with timestamps for dispute resolution

### 4.4 Notifications & Alerts
- Push notification system with priority levels (critical, warning, info)
- Configurable alert rules: late pickup, detention threshold, HOS warning, rate below floor, unassigned load aging
- Notification center with history and read/unread status
- Snooze and escalation paths

### 4.5 Reporting & Analytics
- KPI dashboard: on-time pickup %, on-time delivery %, revenue per truck per week, deadhead %, average margin, claims ratio
- Trend charts: weekly/monthly views of key metrics
- Lane performance analysis with heat map
- Driver scorecard summaries
- Customer profitability ranking
- Exportable report placeholder (tap to "generate PDF")

---

## 5. AI Dispatch & Planning Agent

### 5.1 Automated Load-Truck Matching
The AI agent continuously evaluates available loads against available trucks and recommends optimal assignments. Matching factors include:
- Geographic proximity (minimize deadhead miles)
- Driver HOS availability (enough hours to complete the load)
- Equipment compatibility (type, size, reefer temp capability)
- Delivery window feasibility (ETA vs appointment)
- Driver preference and history (familiar lanes, home time proximity)
- Lane profitability (prioritize higher-margin loads)
- Relay and team driver opportunities

The agent presents a ranked list of recommendations with a confidence score and reasoning summary for each. The dispatcher can accept, modify, or reject with one tap.

### 5.2 Route Optimization
- Multi-stop route sequencing to minimize total miles and maximize on-time performance
- Fuel stop recommendations based on price and route
- Rest stop planning aligned with HOS requirements
- Weather and traffic-aware rerouting suggestions
- Toll vs non-toll route comparison with cost/time tradeoff

### 5.3 Predictive Planning
- 48-hour demand forecast based on historical patterns, shipper commitments, and market signals
- Empty truck repositioning suggestions (move trucks to where loads will be)
- Driver home-time optimization (plan loads that bring drivers closer to home)
- Maintenance window recommendations (when a truck can be pulled for PM without impacting coverage)
- Seasonal surge detection and capacity pre-positioning

### 5.4 Exception Handling
- Automatic detection of problems: late departures, slow progress, missed check calls, appointment conflicts
- Root cause classification: traffic, weather, mechanical, shipper delay, driver issue
- Suggested resolution actions: reassign load, notify customer, adjust appointment, dispatch recovery truck
- Escalation logic: AI handles routine exceptions autonomously (with notification), escalates complex ones to dispatcher with full context and recommended action

### 5.5 Natural Language Dispatch Interface
- Chat interface where dispatcher can type or speak commands: "Find me a truck for a load from Dallas to Memphis tomorrow morning" or "What's the status on load 4521?"
- The agent interprets intent, queries the system, and responds with actionable information
- Supports follow-up questions and multi-turn conversation
- Can execute actions on confirmation: "Assign that truck" → "Confirmed. Driver notified."

---

## 6. AI Voice Agent System

### 6.1 Inbound Call Handling (Shipper-Facing)
The voice agent answers calls from shippers and handles common interactions without human intervention:
- Load status inquiries: "Where's my truck?" → agent looks up load by reference number, PO, or shipper name and provides real-time status and ETA
- Load tenders: "I need a truck in Chicago tomorrow for a full truckload going to Atlanta" → agent captures details, checks capacity, provides rate quote or confirms availability, and creates the load in the system
- Appointment scheduling: "I need to move my delivery appointment to Thursday at 2pm" → agent checks feasibility, confirms or offers alternatives
- Claims and issues: "My delivery arrived damaged" → agent captures details, creates incident record, escalates to claims team
- Rate quotes: "What would you charge for a regular Dallas-Houston lane, 3 loads per week?" → agent pulls historical rates, applies margin rules, provides quote

The agent handles natural conversation flow including interruptions, corrections, holds, and transfers to human when confidence is low or the request is complex.

### 6.2 Outbound Call Automation (Carrier-Facing)
The voice agent proactively calls partner carriers and owner-operators to:
- Offer loads: "Hi, this is FreightOS calling on behalf of [broker]. We have a load from Memphis to Nashville, paying $2.50 per mile, picking up tomorrow at 8am. Are you interested?" → handles negotiation, captures acceptance or counteroffer
- Check call automation: "Hi, this is a check call for load 7823. Can you confirm your current location and ETA?" → updates system with reported status
- Appointment confirmations: "We're confirming your pickup appointment at XYZ Warehouse tomorrow at 10am. Will you be on time?" → flags issues
- Document reminders: "We still need the signed BOL for load 7801. Can you send a photo?" → triggers follow-up

### 6.3 Driver Voice Interface
Drivers can call in (or be called) for hands-free interaction:
- "I'm at the shipper but the dock isn't ready" → agent logs detention start, notifies dispatcher
- "I've got a flat tire on I-40 at mile marker 223" → agent creates breakdown event, initiates roadside assistance workflow, notifies dispatcher and customer
- "What's my next load?" → agent reads upcoming assignment details
- "I need to swap my 34-hour reset to start Saturday" → agent checks feasibility, updates schedule, confirms

### 6.4 Voice Agent Dashboard
- Live call monitor showing active AI voice calls with sentiment indicators
- Call history with full transcripts and outcome classification
- Confidence scoring per call (how sure the agent was in its handling)
- Human takeover queue: calls where the agent needs help or the caller requested a human
- Performance metrics: calls handled, average duration, resolution rate, customer satisfaction proxy
- Call recording playback with AI-generated summary

### 6.5 Voice Agent Configuration
- Persona settings: name, voice style, speaking pace, formality level
- Business rules: rate floors, authority limits (can the agent commit to a rate or only quote?), escalation thresholds
- Script templates for common scenarios with customizable responses
- Blacklist/whitelist for callers
- Operating hours and overflow routing

---

## 7. Mobile-Specific UX Requirements

### 7.1 Navigation
- Bottom tab bar with 5 primary sections: Dashboard, Loads, Fleet, AI Agent, More
- Swipe gestures for common actions (swipe to call, swipe to assign, swipe to dismiss)
- Pull-to-refresh on all list views
- Floating action button for quick-add actions (new load, new dispatch, trigger call)
- Search bar accessible from every screen with global search across loads, drivers, trucks, shippers, carriers

### 7.2 Interaction Patterns
- Single-hand operable: all critical actions reachable in thumb zone
- Large tap targets (minimum 44pt) for field use
- Haptic feedback on confirmations and destructive actions
- Long-press for contextual menus
- Double-tap to zoom on maps and documents
- Shake to undo last action

### 7.3 Offline Considerations (Simulated)
- Visual indicator showing connection status
- Queue indicator for pending actions
- Cached data display with "last updated" timestamps
- Graceful degradation messaging

### 7.4 Responsive Layout
- Optimized for 390px width (iPhone 14 / comparable Android)
- Card-based layouts that stack vertically
- Collapsible sections for dense information screens
- Bottom sheets for detail views and forms (slide up from bottom)
- Full-screen modals for focused tasks (load entry, dispatch confirmation)

---

## 8. Demo & Prototype Requirements

### 8.1 Simulated Data
The prototype must include a rich, realistic dataset:
- 45 trucks across 3 equipment types (dry van, reefer, flatbed)
- 30 drivers with varied HOS status, locations, and performance profiles
- 80 active loads in various lifecycle stages
- 15 shipper accounts with lane history
- 25 partner carriers with scorecards
- 7 days of historical data for trends and charts
- Geographic distribution across a realistic regional network (Southeast US: GA, TN, AL, SC, NC, FL)

### 8.2 Interactive Scenarios
The prototype must support walking through these end-to-end scenarios:

**Scenario A — New Load Dispatch (Carrier)**
Receive new load → AI recommends truck/driver → dispatcher reviews and confirms → driver notified → track through delivery → POD captured → invoice generated

**Scenario B — Brokered Load Lifecycle**
Shipper tenders load (via voice agent call) → load enters system → AI matches to partner carrier → voice agent calls carrier with offer → carrier accepts → track through delivery → margin calculated → invoiced

**Scenario C — Exception Management**
Driver reports breakdown → AI detects impact on delivery window → suggests recovery options → dispatcher selects plan → customer notified via voice agent → recovery load dispatched → original load reassigned

**Scenario D — AI Planning Session**
Operations manager reviews tomorrow's plan → AI shows demand forecast → identifies 5 empty trucks needing loads → recommends repositioning 2 trucks → suggests accepting 3 spot loads from load board → manager approves with modifications

**Scenario E — Voice Agent Demo**
Simulated inbound call from shipper asking "Where's my truck?" → voice agent handles call → shows real-time transcript → resolves inquiry → call summary logged

### 8.3 Demo Controls
- Scenario selector: jump to any pre-configured scenario state
- Time simulator: advance time to trigger events (truck arrives, HOS expires, appointment window opens)
- Event injector: trigger exceptions on demand (breakdown, weather delay, shipper cancellation, rate change)
- Reset button: return to initial demo state
- Guided tour mode: step-by-step walkthrough with callouts explaining each feature

### 8.4 AI Interaction Demo
- The AI dispatch chat must respond contextually to typed or spoken queries using live demo data
- Voice agent demo must play simulated call audio with real-time transcript display
- All AI recommendations must include visible reasoning (not just "assign truck X" but "truck X is 23 miles from pickup, driver has 8.5 hours remaining, familiar with this lane, and available at pickup time")
- AI confidence indicators on all suggestions

---

## 9. Non-Functional Requirements (Prototype Scope)

### 9.1 Performance
- All screens must render within 300ms of navigation
- Map interactions must feel fluid (60fps panning/zooming)
- AI chat responses must appear within 2 seconds (simulated or real)
- Voice agent transcript must update in real-time during demo playback

### 9.2 Accessibility
- Minimum AA contrast ratios on all text
- Screen reader labels on all interactive elements
- Font size: minimum 14px body, 12px secondary
- Color is never the sole indicator of status (always paired with icon or text)

### 9.3 Data Integrity (Demo)
- All demo data must be internally consistent (a truck can't be in two places, a driver can't exceed HOS, delivered loads have PODs)
- Time-based events must follow logical sequencing
- Financial calculations must be arithmetically correct (rate × miles = revenue, revenue - cost = margin)

---

## 10. Feature Priority Matrix

### Must Have (MVP Demo)
- Fleet dashboard with live map
- Load management with lifecycle tracking
- AI dispatch recommendations with reasoning
- AI chat interface for natural language dispatch
- Voice agent demo (inbound shipper call simulation)
- Brokerage load matching
- Basic reporting dashboard
- Demo scenario controls
- Mobile-optimized navigation

### Should Have (Enhanced Demo)
- Voice agent outbound calling demo
- Driver voice interface demo
- Rate management with historical trends
- HOS prediction and compliance alerts
- Document capture simulation
- Multi-stop load support
- Carrier scorecard system

### Nice to Have (Stretch)
- Offline mode simulation
- Guided tour / onboarding flow
- Dark mode
- Notification simulation (push notification mockups)
- Export/share report mockups
- Customizable voice agent persona settings
