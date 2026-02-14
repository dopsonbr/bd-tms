# FreightOS — Design Document

## Design Philosophy

This prototype is designed to feel like a real product, not a wireframe. Every screen is interactive, data-rich, and optimized for one-handed phone use. The design language is utilitarian and information-dense — dispatchers don't want pretty, they want fast. The AI layer is woven into every workflow, not bolted on as a separate feature.

---

## 1. Information Architecture

```
FreightOS App
│
├── Dashboard (Tab 1)
│   ├── Operations Summary Cards
│   ├── Live Map (mini, expandable)
│   ├── Exception Feed
│   ├── Today's Numbers (KPIs)
│   └── Quick Actions Strip
│
├── Loads (Tab 2)
│   ├── Active Loads List
│   │   ├── Load Detail → Lifecycle Tracker
│   │   ├── Load Detail → Documents
│   │   ├── Load Detail → Communications
│   │   └── Load Detail → Financials
│   ├── Load Board (Brokerage)
│   ├── New Load Entry (Bottom Sheet)
│   └── Filters / Search
│
├── Fleet (Tab 3)
│   ├── Truck Map View (Full)
│   ├── Truck List View
│   │   ├── Truck Detail → Current Load
│   │   ├── Truck Detail → Schedule (72hr)
│   │   ├── Truck Detail → Driver Info
│   │   └── Truck Detail → Maintenance
│   ├── Driver Roster
│   │   ├── Driver Detail → HOS Clock
│   │   ├── Driver Detail → Performance
│   │   └── Driver Detail → Documents
│   └── Equipment Pool
│
├── AI Agent (Tab 4)
│   ├── Chat Interface (Dispatch AI)
│   ├── Recommendations Feed
│   ├── Voice Agent Dashboard
│   │   ├── Live Calls Monitor
│   │   ├── Call History & Transcripts
│   │   ├── Performance Metrics
│   │   └── Voice Agent Settings
│   └── Planning Assistant
│       ├── Demand Forecast
│       ├── Repositioning Suggestions
│       └── Tomorrow's Plan Review
│
├── More (Tab 5)
│   ├── Shippers Directory
│   ├── Carriers Directory
│   ├── Reports & Analytics
│   │   ├── KPI Dashboard
│   │   ├── Lane Analysis
│   │   ├── Financial Summary
│   │   └── Driver Scorecards
│   ├── Rate Management
│   ├── Settings & Configuration
│   └── Demo Controls
│       ├── Scenario Selector
│       ├── Time Simulator
│       ├── Event Injector
│       └── Reset / Guided Tour
│
└── Global Elements
    ├── Search (Overlay)
    ├── Notification Center (Overlay)
    └── Floating Action Button
```

---

## 2. Visual Design System

### 2.1 Color Palette

**Primary**: Deep Navy `#0F1B2D` — used for headers, primary text, and navigation bar background. Conveys authority and seriousness appropriate for logistics operations.

**Accent**: Electric Blue `#2D7FF9` — used for interactive elements, selected states, AI agent indicators, and primary CTA buttons. Visually distinct on dark and light backgrounds.

**Status Colors**:
- Active / En Route: `#2D7FF9` (blue)
- Success / Delivered: `#00B67A` (green)
- Warning / At Risk: `#F5A623` (amber)
- Critical / Exception: `#E74C3C` (red)
- Idle / Empty: `#8E99A4` (gray)
- AI Suggestion: `#7C5CFC` (purple) — all AI-generated content gets this treatment to be immediately distinguishable

**Surfaces**:
- Background: `#F5F7FA` (cool gray)
- Card: `#FFFFFF` (white)
- Elevated Card: white with `0 2px 8px rgba(0,0,0,0.08)` shadow
- Bottom Sheet: white with `0 -4px 16px rgba(0,0,0,0.12)` shadow
- Dark Overlay: `rgba(15,27,45,0.6)`

### 2.2 Typography

Font family: Inter (system fallback: SF Pro / Roboto)

- Page Title: 24px / 700 weight / `#0F1B2D`
- Section Header: 18px / 600 weight / `#0F1B2D`
- Card Title: 16px / 600 weight / `#0F1B2D`
- Body: 14px / 400 weight / `#374151`
- Secondary: 13px / 400 weight / `#6B7280`
- Caption: 12px / 500 weight / `#8E99A4`
- Metric Value: 28px / 700 weight / contextual color
- Tab Label: 11px / 500 weight / `#8E99A4` (inactive) / `#2D7FF9` (active)

### 2.3 Iconography

Lucide icon set, 20px default size, 1.5px stroke weight. Status indicators use filled circles (8px) with status colors. AI-related features use a distinct sparkle/brain icon to signal intelligence.

### 2.4 Spacing & Grid

Base unit: 4px. Standard padding: 16px horizontal, 12px vertical on cards. Card gap: 8px. Screen margin: 16px. Bottom tab bar height: 56px + safe area. Status bar: system default.

### 2.5 Motion

Transitions: 200ms ease-out for screen changes, 150ms for micro-interactions. Bottom sheets: spring animation (damping 0.85). Pull-to-refresh: rubber band physics. Card press: scale to 0.98 with 100ms duration. Loading: skeleton screens, never spinners (except on AI chat responses where a typing indicator is used).

---

## 3. Screen-by-Screen Design

### 3.1 Dashboard

**Layout**: Single scrollable column.

**Section 1 — Greeting & Status Bar** (top, sticky below status bar)
- "Good morning, [Name]" with current date
- Two pill-shaped status chips: "12 trucks rolling" / "3 exceptions"
- Notification bell icon (right) with unread badge

**Section 2 — Quick Actions Strip** (horizontal scroll)
- Pill-shaped buttons: "New Load" / "Dispatch AI" / "Voice Agent" / "Find Truck"
- Each opens the relevant flow directly

**Section 3 — Operations Summary** (2×2 card grid)
- Card 1: Active Loads (count, split by carrier/brokered)
- Card 2: Available Trucks (count, with mini bar chart by region)
- Card 3: Today's Revenue (running total, % of daily target)
- Card 4: Exceptions (count, most urgent type)
- Each card is tappable, navigating to the relevant detail view

**Section 4 — Mini Map** (full width, 200px height)
- Shows all active trucks as dots with status colors
- Tap to expand to full-screen fleet map
- Cluster pins in dense areas with count badges

**Section 5 — Exception Feed** (scrollable cards)
- Chronological list of active exceptions requiring attention
- Each card shows: severity icon, load number, description, time since detection, suggested action
- AI-generated suggestions are marked with purple accent and sparkle icon
- Swipe right to dismiss / acknowledge, swipe left to open detail
- Card format example:
  ```
  🔴  LATE PICKUP — Load #4521
  Truck 217 is 45 min behind schedule for pickup at
  Atlanta Distribution Center (appt: 2:00 PM)
  ✨ AI: Notify shipper, extend window to 3:00 PM
  ── 12 min ago ──────────────── [View] [Act]
  ```

**Section 6 — Today's Schedule** (timeline)
- Vertical timeline showing upcoming events for the next 12 hours
- Pickups, deliveries, driver shift changes, appointments
- Tap any event to navigate to the relevant load or driver

---

### 3.2 Load List Screen

**Header**: "Loads" with segment control: Active / Available / Completed
- Active: loads currently assigned and in progress
- Available: unmatched loads needing dispatch (broker view)
- Completed: last 7 days of delivered loads

**Filter Bar** (horizontal scroll, below header):
- Pill filters: Status, Origin, Destination, Equipment, Customer, Date Range
- Active filters show with X to remove
- Filter count badge on the filter icon

**Load Cards** (scrollable list):
Each card is a horizontal layout optimized for scanning:
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

- Status indicator is color-coded dot + text
- Margin shows as colored text (green above target, red below)
- AI suggestions appear inline when relevant, highlighted in purple
- Tap card to open Load Detail
- Long-press for quick action menu: Call Driver, View on Map, Reassign, Share Status Link

**Floating Action Button**: "+" icon → opens New Load bottom sheet

---

### 3.3 Load Detail Screen

**Layout**: Full-screen view with sticky header and scrollable content sections.

**Sticky Header**:
- Back arrow, load number, status badge
- Three action buttons: Call, Navigate, More (...)

**Section 1 — Route**
- Mini map showing origin → destination with current truck position
- Origin block: facility name, address, appointment window, actual arrival/departure
- Destination block: same format
- For multi-stop: vertical stepper showing each stop with status
- Distance and estimated drive time between points

**Section 2 — Assignment**
- Driver card: photo placeholder, name, phone (tap to call), HOS remaining
- Truck card: unit number, equipment type, current mileage
- Trailer card: trailer number, status
- "Reassign" button if load is pre-dispatch

**Section 3 — Lifecycle Tracker**
- Horizontal stepper with all lifecycle stages
- Current stage highlighted and pulsing
- Tap any stage to see timestamp and details
- Completed stages show green checkmarks with timestamps

**Section 4 — Financials**
- Rate breakdown: line haul, fuel surcharge, accessorials
- Total revenue, carrier cost (if brokered), margin amount and %
- Rate per mile calculation
- Editable fields for adding accessorials (detention, lumper)

**Section 5 — Documents**
- Grid of document thumbnails: BOL, POD, rate confirmation, scale ticket
- Tap to view full-screen with zoom
- "Add Document" button → camera capture or file upload simulation
- Missing document indicators with red badges

**Section 6 — Communication Log**
- Chronological feed of all communications related to this load
- Includes: dispatcher notes, driver check-ins, voice agent transcripts, system events, customer notifications
- Each entry shows: timestamp, source (human/AI), content
- AI-generated entries are purple-accented
- Text input at bottom for adding notes

---

### 3.4 Dispatch Board

**Layout**: Two-view toggle — List View and Timeline View.

**List View**:
Two-panel layout (top/bottom split on mobile):
- Top panel: Unassigned loads (scrollable horizontal cards)
- Bottom panel: Available trucks (scrollable list)
- Tap a load, then tap a truck to see AI compatibility analysis
- Confirm button to dispatch

**Timeline View** (primary):
- Horizontal scrolling timeline (24-hour segments, swipeable)
- Each row is a truck, showing scheduled loads as colored blocks
- Empty gaps are highlighted as available windows
- Tap a gap to see AI-suggested loads that fit
- Load blocks show: load number, destination, time window
- Color-coded by status: assigned (blue), in transit (green), at facility (amber)

**AI Recommendation Panel** (bottom sheet, auto-appears):
- Heading: "✨ Dispatch Suggestions"
- List of recommended assignments with reasoning:
  ```
  Assign Load #4529 → Truck T-208 (Driver: James Wright)
  Score: 94/100
  ├── 18 mi deadhead (shortest option)
  ├── 9.2 hrs HOS remaining (sufficient)
  ├── Driver has run this lane 12 times
  └── Pickup window starts in 2.5 hrs (on time)
  [Accept]  [Modify]  [Skip]
  ```
- "Accept All" button for batch dispatch (with confirmation)

---

### 3.5 Fleet Map (Full Screen)

**Layout**: Full-screen map with overlay controls.

**Map Elements**:
- Truck pins with directional indicators (pointing in direction of travel)
- Pin color matches truck status
- Tap pin → popup card with: truck number, driver, current load, ETA
- Tap popup → navigate to truck detail
- Facility markers for frequently used shippers/receivers
- Route lines for active loads (color matches status)
- Traffic overlay toggle

**Overlay Controls** (top):
- Search bar (find truck, driver, or load on map)
- Filter chips: Show All, En Route, Empty, At Facility, Out of Service

**Bottom Panel** (peek-up sheet):
- Shows list of visible trucks with key stats
- Drag up to see full list, drag down to minimize
- Tap any truck in list to center map on it

---

### 3.6 AI Chat Interface

**Layout**: Full-screen chat with input area at bottom.

**Chat Header**:
- "Dispatch AI" title with sparkle icon
- Status indicator: "Active" with green dot
- Context chip: "Viewing all operations" (or specific load/truck context if entered from detail screen)

**Chat Area**:
- Message bubbles, left-aligned for AI, right-aligned for user
- AI messages use a subtle purple-tinted background
- Rich content in AI messages:
  - Inline data tables (truck comparisons, load details)
  - Mini maps showing relevant locations
  - Action buttons within messages ("Assign this truck", "Call driver", "Show alternatives")
  - Expandable reasoning sections ("Why this recommendation? ▸")
- Typing indicator with three pulsing dots when AI is "thinking"

**Input Area**:
- Text field with microphone button for voice input
- Send button (arrow icon)
- Quick suggestion chips above input: context-aware prompts like "Show empty trucks", "Tomorrow's plan", "Unmatched loads"
- When voice input is active: waveform animation, transcript appears in real-time

**Example Conversation Flow** (for demo):
```
User: "What's the situation for tomorrow?"

AI: "Here's tomorrow's outlook:
    📦 23 loads scheduled (18 carrier, 5 brokered)
    🚛 4 trucks finishing today with no next load
    ⚠️ 2 loads at risk — pickup windows may conflict
    with driver HOS resets

    I've prepared assignments for the 4 empty trucks.
    Want to review them?"

User: "Yes, show me"

AI: [Shows 4 recommendation cards with scores and reasoning]
    "Tap Accept on any assignment, or ask me to
    find alternatives."

User: "What about truck 208? Why isn't it on the list?"

AI: "Truck T-208 (Driver: James Wright) is scheduled
    for a 34-hour reset starting tonight at 8 PM.
    He'll be available again Thursday at 6 AM.
    Should I include him in Thursday's plan instead?"
```

---

### 3.7 Voice Agent Dashboard

**Layout**: Tab-based within the AI Agent section.

**Sub-tabs**: Live Calls / History / Performance / Settings

**Live Calls View**:
- Card per active call:
  ```
  ┌──────────────────────────────────────────┐
  │  📞 ACTIVE  ●  3:42 duration             │
  │  Inbound from: Southeast Distributors     │
  │  Topic: Load status inquiry               │
  │  Sentiment: 😊 Positive                   │
  │  Confidence: 92%                          │
  │  ──────────────────────────────────────  │
  │  Live transcript:                         │
  │  "...yes, that's load number 4521.        │
  │  Let me check that for you..."            │
  │  ──────────────────────────────────────  │
  │  [Listen In]  [Take Over]  [View Load]    │
  └──────────────────────────────────────────┘
  ```
- Cards auto-update with live transcript snippets
- "Take Over" button transfers call to human (simulated)
- If no live calls, show placeholder with today's stats

**Call History View**:
- Scrollable list of completed calls
- Each entry: caller name/number, direction (in/out), duration, outcome classification (resolved, transferred, failed), timestamp
- Tap to expand → full transcript with AI summary
- Filter by: direction, outcome, caller, date

**Call Detail (expanded)**:
- Full scrollable transcript with speaker labels
- AI-generated call summary at top (2-3 sentences)
- Outcome: what was resolved, what actions were taken
- System actions taken during call (e.g., "Updated ETA for Load #4521", "Created new load #4530")
- Audio playback bar (simulated) with play/pause and scrub
- Quality indicators: clarity score, sentiment arc, confidence throughout call

**Performance View**:
- Top metrics: calls handled today, avg duration, resolution rate, calls transferred
- Chart: calls by hour (bar chart)
- Chart: resolution rate trend (line chart, 7-day)
- Chart: top call topics (horizontal bar)
- Comparison: AI-handled vs human-handled (volume and satisfaction)

**Settings View** (Voice Agent Configuration):
- Agent name and persona: text field, dropdown for voice style (professional, friendly, regional)
- Business rules panel:
  - Rate quotation authority: toggle on/off, if on: max margin floor, max discount %
  - Load acceptance authority: toggle on/off, if on: max rate commitment
  - Escalation triggers: checklist of scenarios that force transfer to human
- Operating hours: time picker grid
- Greeting customization: editable text template
- Test call button: triggers a simulated call to demo the voice agent in action

---

### 3.8 Voice Agent Call Demo (Interactive)

**Layout**: Full-screen immersive experience simulating a phone call.

**Visual Design**: Dark background mimicking a phone call screen.

**Top Section**:
- Caller info: name, company, phone number
- Call direction indicator (inbound/outbound)
- Duration counter

**Middle Section — Dual Transcript**:
- Split view showing both sides of the conversation
- Left: Caller's words (white text)
- Right: AI Agent's words (purple-accented text)
- Words appear in real-time as "spoken" during demo playback
- Highlighted keywords that the AI is reacting to (e.g., load number, location, rate)

**Bottom Section — System Actions**:
- Real-time feed of actions the AI is taking during the call
- e.g., "Searching for Load #4521...", "Found: ATL→MEM, ETA 4:30 PM", "Updating caller with status"
- Shows the AI's "thinking" process alongside the conversation

**Controls**:
- Play/Pause button (controls demo playback)
- Speed control: 1x, 1.5x, 2x
- Skip to next key moment (for faster demo)
- "End Call" button → shows call summary

**Post-Call Summary Screen**:
- AI-generated summary of the call
- Actions taken (with links to affected loads/records)
- Sentiment analysis
- Call quality score
- "Replay" and "Try Another Scenario" buttons

**Demo Scenarios Available**:
1. Shipper calls asking "Where's my truck?" — AI resolves with live tracking
2. Shipper calls to tender a new load — AI captures details and creates load
3. AI calls partner carrier to offer a load — handles negotiation
4. Driver calls to report a breakdown — AI initiates recovery workflow
5. Shipper calls to reschedule appointment — AI checks feasibility

---

### 3.9 Brokerage Load Board

**Layout**: Map + list hybrid.

**Top Half — Lane Map**:
- Map showing available loads as origin markers with lines to destinations
- Color-coded by margin potential (green/yellow/red)
- Cluster view when zoomed out
- Tap a lane to see load details and available capacity

**Bottom Half — Load List** (drag-up to full screen):
- Each card shows: origin-destination, rate, margin %, equipment, pickup date, age (time since posted)
- Sort options: margin, distance, pickup date, customer priority
- "Match" button on each card → opens carrier matching bottom sheet

**Carrier Matching Bottom Sheet**:
- AI-ranked list of available carriers/trucks for the selected load
- Each option shows: carrier name, truck/driver, deadhead miles, rate expectation, scorecard summary, match score
- "Offer Load" button → triggers voice agent outbound call or sends digital offer
- Rate negotiation slider: adjust offered rate, see margin impact in real-time

---

### 3.10 Reports & Analytics

**Layout**: Scrollable dashboard with chart cards.

**Header**: Date range selector (today, this week, this month, custom)

**KPI Strip** (horizontal scroll):
- On-time pickup %
- On-time delivery %
- Revenue per truck per week
- Average margin %
- Deadhead %
- Claims ratio

Each KPI shows: current value, trend arrow (up/down), comparison to last period

**Charts Section** (scrollable cards):

Card 1 — Revenue & Margin Trend:
Line chart with dual Y-axis (revenue bars, margin line), weekly view

Card 2 — Load Volume:
Stacked bar chart: carrier loads vs brokered loads, daily for past 30 days

Card 3 — Lane Heat Map:
Geographic heat map showing lane density and profitability. Darker = more profitable. Tap a lane for details.

Card 4 — On-Time Performance:
Gauge chart showing pickup and delivery on-time rates with targets

Card 5 — Top Customers by Revenue:
Horizontal bar chart, top 10 customers

Card 6 — Driver Scorecard Summary:
Ranked list of drivers with composite scores, tap for detail

Card 7 — AI Agent Impact:
Split metrics: dispatches assisted by AI, voice calls handled, exceptions auto-resolved, estimated time saved

---

### 3.11 Demo Controls Panel

**Access**: Via "More" tab or secret gesture (triple-tap on logo)

**Layout**: Utility screen, not designed for end-user aesthetics.

**Scenario Selector**:
- List of pre-built scenarios with descriptions
- "Load Scenario" button replaces current demo state with scenario data
- Scenarios:
  1. Normal Operations — everything running smoothly
  2. Monday Morning Rush — high volume, multiple assignments needed
  3. Weather Disruption — storm affecting Southeast routes
  4. Capacity Crunch — more loads than trucks
  5. New Customer Onboarding — shipper calling to tender first load
  6. End of Day — wrapping up operations, reviewing tomorrow

**Time Simulator**:
- Clock display showing current simulated time
- Fast-forward button: advance 15 min, 1 hr, 4 hr increments
- Events queue: shows what will trigger at each time advance
- Current state indicator

**Event Injector**:
- Button grid for triggering events on demand:
  - "Truck Breakdown" → select which truck
  - "Shipper Cancellation" → select which load
  - "Weather Alert" → select region
  - "Rate Spike" → select lane
  - "New Load Tender" → auto-generate with realistic data
  - "Driver HOS Expiry" → select driver
  - "Detention Alert" → select facility
  - "Incoming Call" → trigger voice agent demo
- Each injection shows a confirmation and then navigates to the relevant screen to see the impact

**Reset**:
- "Reset to Default" button with confirmation dialog
- "Reset Current Scenario" to restart the active scenario from its beginning state

**Guided Tour**:
- "Start Tour" button launches an overlay walkthrough
- Sequential tooltips highlighting key features with descriptions
- Progress indicator (step X of Y)
- Skip and back buttons

---

## 4. AI Agent Visual Language

All AI-generated content follows a consistent visual pattern so users always know when they're seeing AI output vs human/system data.

### 4.1 AI Content Indicators
- Purple accent color `#7C5CFC` for borders, icons, and highlights
- Sparkle icon (✨) prefix on AI-generated text and suggestions
- "AI" badge on recommendation cards
- Subtle purple gradient on chat message backgrounds
- Pulsing animation on AI "thinking" states

### 4.2 Confidence Visualization
- High confidence (85-100%): solid purple accent, full sparkle icon, bold recommendation
- Medium confidence (60-84%): lighter purple, half-filled sparkle, "Consider" language
- Low confidence (below 60%): gray with purple outline, empty sparkle, "Possible" language, stronger nudge toward human review

### 4.3 Reasoning Transparency
Every AI recommendation includes an expandable reasoning section:
- Default: collapsed, showing only the recommendation and score
- Expanded: bullet-point list of factors with individual scores/values
- "Why not X?" link: shows why the AI didn't recommend alternatives the user might expect
- Feedback buttons: thumbs up/down on each recommendation for the simulated learning loop

---

## 5. Component Library

### 5.1 Status Badge
- Rounded pill shape, 24px height
- Background: status color at 15% opacity
- Text: status color at 100%, 12px semibold
- Variants: En Route, Loading, Empty, Delivered, Exception, Cancelled, Pending

### 5.2 Metric Card
- White card, 8px border radius
- Value: 28px bold, contextual color
- Label: 12px gray, below value
- Trend: small arrow icon + percentage, green (up-good) or red (up-bad) depending on metric context
- Tap target: entire card

### 5.3 Entity Card (Load, Truck, Driver)
- White card, 12px border radius, 16px padding
- Left accent stripe (4px) in status color
- Title row: entity ID + status badge
- Detail rows: key-value pairs in 14px
- Action row: icon buttons (call, navigate, assign)
- AI suggestion row (optional): purple background strip at bottom

### 5.4 Timeline Step
- Vertical line with circular nodes
- Active node: filled circle with pulse animation
- Completed node: green circle with check
- Future node: gray outline circle
- Between nodes: timestamp and description text

### 5.5 Chat Bubble
- User: right-aligned, blue background, white text, rounded corners (top-left sharp)
- AI: left-aligned, purple-tinted white background, dark text, rounded corners (top-right sharp)
- System: centered, gray background, small text
- Max width: 85% of screen width
- Rich content: tables, mini maps, and action buttons render inline within bubbles

### 5.6 Bottom Sheet
- Drag handle: 40px wide, 4px tall, centered, gray
- Peek height: content-dependent (usually 30-40% of screen)
- Full height: 90% of screen (maintains status bar visibility)
- Background: white with top border radius 16px
- Overlay: dark scrim on content behind

### 5.7 Floating Action Button
- 56px circle, accent blue, white icon
- Bottom-right position, 16px from edges, above tab bar
- Shadow: `0 4px 12px rgba(45,127,249,0.3)`
- Tap: expand to show 3-4 quick action options (speed dial pattern)
- Options fan out vertically with labels

### 5.8 Voice Call Card
- Dark background (`#1A1A2E`)
- Caller info in white, large text
- Waveform animation during active speech (green for caller, purple for AI)
- Transcript area with auto-scroll
- Action buttons: large, circular, high contrast (red for end, blue for actions)

---

## 6. Interaction Patterns

### 6.1 Dispatch Assignment Flow
1. User sees unassigned load (red badge on Loads tab or exception in dashboard)
2. Taps load → Load Detail screen
3. AI recommendation auto-appears in a bottom sheet: "Suggested: Truck T-208, Score 94"
4. User taps "View Details" → sees full reasoning
5. User taps "Accept" → confirmation haptic + success animation
6. System updates: load status changes, driver notified, timeline updated
7. Toast notification: "Load #4521 dispatched to T-208. Driver notified."

Alternative: User disagrees with AI suggestion
5a. User taps "Show Alternatives" → list of other options with scores
5b. User selects different truck
5c. AI shows compatibility note: "⚠️ This truck is 45 mi farther. ETA may be tight."
5d. User confirms anyway → same success flow

### 6.2 Voice Agent Trigger Flow
1. From any screen: tap the FAB → "Trigger Call Demo"
2. Or from Voice Agent Dashboard → "Test Call" button
3. Or from Demo Controls → "Incoming Call" injector
4. Screen transitions to call demo view (dark, immersive)
5. Simulated ring animation → call connects
6. Transcript begins appearing in real-time
7. System actions appear in bottom panel as AI processes the call
8. Call ends → summary screen with outcomes
9. "Return to Dashboard" → sees the changes the voice agent made (new load, updated status, etc.)

### 6.3 Exception Resolution Flow
1. Exception appears in dashboard feed with red indicator
2. User taps exception card → slides to detail view
3. AI analysis at top: "This delay was caused by traffic on I-20. Current impact: 45 min late to delivery."
4. Suggested actions presented as tappable cards:
   - Option A: "Notify customer, request 1-hour extension" (AI confidence: 88%)
   - Option B: "Reassign to closer truck T-302" (AI confidence: 72%)
   - Option C: "No action — delay may recover" (AI confidence: 41%)
5. User selects Option A
6. Confirmation: "Should the AI voice agent call Southeast Distributors to request an extension?"
7. User confirms → voice agent initiates call → live transcript available
8. Call completes → exception status updated → card turns amber (monitoring) or green (resolved)

### 6.4 Natural Language Dispatch
1. User taps AI Agent tab → chat interface
2. Types or speaks: "I need a reefer for a load from Jacksonville to Nashville, picking up Wednesday"
3. AI processes and responds:
   - "I found 3 available reefer trucks that could make that pickup:"
   - [Shows 3 truck cards with match scores]
   - "Want me to check for loads on the return lane to reduce deadhead?"
4. User: "Yes, and what's the going rate for that lane?"
5. AI: "Average rate JAX→NSH last 30 days: $2.85/mi. Your last 5 loads averaged $2.92/mi. Market is softening slightly."
6. Multi-turn continues until dispatch is confirmed or user moves on

---

## 7. Data Model (Demo State)

### 7.1 Seed Data Structure

The prototype is initialized with the following interconnected demo data:

**Trucks (45 units)**:
- 30 dry vans (T-201 through T-230)
- 10 reefers (T-301 through T-310)
- 5 flatbeds (T-401 through T-405)
- Distributed across: Atlanta (hub), Memphis, Nashville, Charlotte, Jacksonville, Birmingham

**Drivers (30 active)**:
- Each assigned to a truck (15 trucks are spare/in maintenance)
- HOS status varies: 8 with 8+ hours, 10 with 4-8 hours, 7 with less than 4 hours, 5 on 34-hour reset
- Home bases distributed across the Southeast
- Performance scores range from 72 to 98

**Active Loads (80)**:
- 55 carrier loads (company trucks)
- 25 brokered loads (partner carriers)
- Status distribution: 20 in transit, 15 at pickup, 10 at delivery, 12 pending dispatch, 8 delivered today, 15 planned for tomorrow
- Mix of local (under 200mi), regional (200-500mi), and long-haul (500+mi)

**Shippers (15 accounts)**:
- Mix of manufacturing, distribution, retail, food/beverage
- Named realistically for demo credibility
- Each with 3-8 active loads and lane history

**Partner Carriers (25)**:
- Small fleets (1-10 trucks) and owner-operators
- Scorecard data: on-time ranges from 78% to 99%
- Equipment types and lane preferences defined

### 7.2 Geographic Network
Hub: Atlanta, GA
Primary lanes: ATL↔MEM, ATL↔NSH, ATL↔CLT, ATL↔JAX, ATL↔BHM
Secondary lanes: MEM↔NSH, CLT↔JAX, BHM↔MEM, NSH↔CLT
Facilities: 40 pickup/delivery locations distributed across these lanes

### 7.3 Time-Based Events
The demo data includes a timeline of events that trigger when the time simulator advances:
- Hour 0-2: Normal operations, 2 pickups complete, 1 delivery
- Hour 2-4: Truck T-217 hits traffic, ETA slips → exception triggers
- Hour 4-6: New load tenders arrive from 2 shippers
- Hour 6-8: Driver HOS expires on T-225, load needs reassignment
- Hour 8-10: Weather alert for central Alabama affects 3 loads
- Hour 10-12: End of day — 5 trucks complete runs, tomorrow's plan needed

---

## 8. Prototype Technology Notes

### 8.1 Implementation Approach
The prototype is built as a single-page React application with simulated data. No backend is required. All data lives in client-side state, and all AI interactions are either pre-scripted (voice agent demos) or powered by a live LLM API call (dispatch chat).

### 8.2 AI Integration Points
- **Dispatch Chat**: Real API calls to Claude with system prompt containing the full demo data context. Each message sends the current state of loads, trucks, and drivers so the AI can reason over live data.
- **Recommendations**: Pre-computed on demo data load, updated when state changes (e.g., after a dispatch action). Uses a scoring algorithm that weights the matching factors defined in requirements.
- **Voice Agent Demos**: Pre-recorded scenario scripts with timed transcript playback. No live speech synthesis needed — the demo simulates the experience visually with text transcripts and system action feeds.

### 8.3 State Management
- All demo data stored in a central state store (React context or Zustand)
- Actions (dispatch, status update, exception resolution) modify state in real-time
- Time simulator advances the clock and triggers pre-defined events
- Scenario loader replaces the entire state with a pre-built snapshot
- Reset restores the original seed data

### 8.4 Map Implementation
- Use Mapbox GL JS or Leaflet with OpenStreetMap tiles
- Truck positions are interpolated between waypoints based on simulated time
- Geofences defined as circles around facility coordinates
- Route lines pre-computed for active loads

---

## 9. Screen Flow Map

```
App Launch
    │
    ▼
Dashboard ──────────────────────────────────────────────
    │           │            │           │              │
    ▼           ▼            ▼           ▼              ▼
Exception   Quick Action  Mini Map   KPI Card      Schedule
  Card      (New Load)   (expand)   (drill)        Event
    │           │            │           │              │
    ▼           ▼            ▼           ▼              ▼
Exception   New Load     Fleet Map   Reports      Load Detail
 Detail     Form (BS)    (full)     Dashboard
    │           │            │
    ▼           ▼            ▼
AI Suggest  AI Match     Truck Detail
 Actions    (auto)           │
    │           │            ▼
    ▼           ▼        Driver Detail
Voice Call  Dispatch         │
  Demo      Confirm          ▼
                          HOS Clock

Loads Tab ──────────────────────────────────────────────
    │              │               │
    ▼              ▼               ▼
Active List    Available       Completed
    │          (Broker)            │
    ▼              │               ▼
Load Detail    Load Board      Load Detail
    │              │           (read-only)
    ▼              ▼
Documents    Carrier Match
    │          (Bottom Sheet)
    ▼              │
Camera         Voice Agent
Capture        Offer Call

AI Agent Tab ───────────────────────────────────────────
    │              │                │
    ▼              ▼                ▼
Chat          Voice Dash        Planning
Interface     ┌────┬────┐       Assistant
    │         │    │    │           │
    ▼         ▼    ▼    ▼           ▼
Multi-turn  Live  Hist  Perf    Forecast
 Convo      Calls  ory  Stats    View
              │                     │
              ▼                     ▼
           Call Demo           Reposition
           (Immersive)         Suggestions
```

---

## 10. Responsive Behavior

### Phone (390px) — Primary Target
- Single column layout throughout
- Bottom tab navigation
- Bottom sheets for secondary content
- Full-screen modals for focused tasks
- Cards stack vertically
- Map takes full width
- Charts are single-column, swipeable

### Tablet (768px) — Secondary
- Two-column layouts where appropriate (dispatch board shows loads + trucks side by side)
- Map gets a persistent side panel instead of bottom sheet
- Dashboard shows 3-column KPI grid
- Chat interface gets a persistent sidebar with context
- Bottom navigation moves to side rail

### Large Screen (1024px+) — Optional
- Three-column dispatch board (loads / timeline / recommendations)
- Dashboard shows all sections simultaneously
- Voice agent dashboard shows all sub-tabs simultaneously
- Full reporting dashboard without card scrolling
