# FreightOS Implementation Plan — Part 3: AI Agents, Analytics & Demo Controls

> **Stage 3** adds the AI dispatch chat, voice agent demo system, reporting/analytics
> with Recharts, demo controls (scenarios, time simulator, event injector), guided
> tour, safety & compliance dashboard, and UI polish (animations, skeletons, haptics).
> Prerequisite: Parts 1 and 2 complete.

---

## Table of Contents

1. [Dependencies](#1-dependencies)
2. [AI Dispatch Chat Interface](#2-ai-dispatch-chat-interface)
3. [AI Chat Engine](#3-ai-chat-engine)
4. [Voice Agent Demo System](#4-voice-agent-demo-system)
5. [Voice Playback Engine](#5-voice-playback-engine)
6. [Voice Call Dashboard](#6-voice-call-dashboard)
7. [Voice Agent Configuration](#7-voice-agent-configuration)
8. [Reporting & Analytics](#8-reporting--analytics)
9. [Demo Controls](#9-demo-controls)
10. [Guided Tour System](#10-guided-tour-system)
11. [Safety & Compliance](#11-safety--compliance)
12. [UI Polish & Animations](#12-ui-polish--animations)
13. [Store Additions](#13-store-additions)
14. [File Creation Order](#14-file-creation-order)

---

## 1. Dependencies

### 1.1 Install Runtime Dependencies

```bash
bun add recharts
```

| Package | Purpose |
|---------|---------|
| `recharts` | Charting library (line, bar, area, pie, gauge) for analytics |

**Optional** (for real Claude API integration):

```bash
bun add @anthropic-ai/sdk
```

The AI chat works in two modes:
1. **Simulated** (default): pattern-matching engine with pre-built responses
2. **Live Claude API**: real API calls with system prompt containing demo state

The simulated mode is the default so the prototype works without an API key.

---

## 2. AI Dispatch Chat Interface

### Route: `src/routes/_app/ai.tsx` (replace Part 1 placeholder)

### ASCII Wireframe

```
┌─────────────────────────────┐
│ ✨ Dispatch AI      ● Active│  ← header
│    Viewing all operations    │
│─────────────────────────────│
│                             │
│       ┌─────────────────┐   │
│       │ What's the      │   │  ← user message (right)
│       │ situation for   │   │
│       │ tomorrow?       │   │
│       └─────────────────┘   │
│                             │
│  ┌──────────────────────┐   │
│  │ Here's tomorrow's    │   │  ← AI message (left, purple tint)
│  │ outlook:             │   │
│  │ 📦 23 loads scheduled│   │
│  │ 🚛 4 trucks empty    │   │
│  │ ⚠️ 2 loads at risk   │   │
│  │                      │   │
│  │ I've prepared assign-│   │
│  │ ments for the 4 empty│   │
│  │ trucks. Review them? │   │
│  │                      │   │
│  │ [Show assignments]   │   │  ← action button
│  │ [View at-risk loads] │   │
│  └──────────────────────┘   │
│                             │
│  ┌──────────────────────┐   │
│  │ ● ● ●               │   │  ← typing indicator
│  └──────────────────────┘   │
│                             │
│─────────────────────────────│
│ [Empty trucks] [Plan] [Loads]│ ← suggestion chips
│ ┌──────────────────── 🎙 ┐  │
│ │ Ask anything...    →  │  │  ← input bar
│ └────────────────────────┘  │
└─────────────────────────────┘
```

### Component Breakdown

```tsx
function AiScreen() {
  const [activeTab, setActiveTab] = useState<'chat' | 'voice' | 'planning'>('chat')

  return (
    <div className="flex h-full flex-col">
      <AiHeader activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'chat' && <ChatInterface />}
      {activeTab === 'voice' && <VoiceAgentDashboard />}
      {activeTab === 'planning' && <PlanningAssistant />}
    </div>
  )
}
```

#### 2.1 `AiHeader` — `src/components/ai/ai-header.tsx`

- Title "Dispatch AI" with sparkle icon
- Status indicator: green dot + "Active"
- Context chip below: "Viewing all operations" (or specific entity if entered from detail)
- Sub-tabs: Chat | Voice | Planning

#### 2.2 `ChatInterface` — `src/components/ai/chat-interface.tsx`

Main chat component managing the conversation flow:

```tsx
function ChatInterface() {
  const messages = useAppStore((s) => s.chatMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  return (
    <div className="flex flex-1 flex-col">
      <ChatMessageList messages={messages} isTyping={isTyping} />
      <SuggestionChips onSelect={handleSuggestion} />
      <ChatInputBar
        value={input}
        onChange={setInput}
        onSend={handleSend}
      />
    </div>
  )
}
```

#### 2.3 `ChatMessageList` — `src/components/ai/chat-message-list.tsx`

Scrollable area (auto-scrolls to bottom on new messages). Renders `ChatBubble`
for each message.

#### 2.4 `ChatBubble` — `src/components/ai/chat-bubble.tsx`

```tsx
interface ChatBubbleProps {
  message: ChatMessage
}
```

Rendering by role:
- **user**: right-aligned, blue background (`bg-freight-accent`), white text,
  rounded corners with sharp top-right
- **assistant**: left-aligned, purple-tinted background (`bg-freight-ai/5`),
  dark text, rounded corners with sharp top-left, sparkle icon in header
- **system**: centered, gray background, small text, full width

Rich content rendering within assistant bubbles:
- `truck_comparison`: table with truck/driver data columns
- `load_detail`: mini load card with key fields
- `recommendation_cards`: list of dispatch recommendations (reuse `RecommendationCard` from Part 2)
- `mini_map`: small Leaflet map instance showing relevant locations

Action buttons within bubbles:
```tsx
{message.actions.map((action) => (
  <Button
    key={action.label}
    variant="outline"
    size="sm"
    onClick={() => handleAction(action)}
    className="border-freight-ai text-freight-ai"
  >
    {action.label}
  </Button>
))}
```

#### 2.5 `TypingIndicator` — `src/components/ai/typing-indicator.tsx`

Three pulsing dots:
```tsx
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2 rounded-full bg-freight-ai animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
```

#### 2.6 `SuggestionChips` — `src/components/ai/suggestion-chips.tsx`

Context-aware chips above the input. Content depends on conversation state:

**Default (no messages):**
- "Show empty trucks"
- "Tomorrow's plan"
- "Unmatched loads"
- "Exception summary"

**After load context:**
- "Assign this load"
- "Find alternatives"
- "Check lane rates"

**After truck context:**
- "Next load for this truck"
- "Driver HOS status"
- "Schedule overview"

Implementation: compute suggestions from the last assistant message's context.

#### 2.7 `ChatInputBar` — `src/components/ai/chat-input-bar.tsx`

- Text input field with placeholder "Ask anything..."
- Send button (arrow icon) on right — disabled when empty
- Microphone button — simulated voice input (shows waveform animation,
  after 2 seconds inserts a pre-built transcript)

---

## 3. AI Chat Engine

### 3.1 Simulated Engine — `src/services/ai-chat-simulated.ts`

Pattern-matching engine that responds to common dispatch queries using live
store data. No API calls needed.

```ts
import { useAppStore } from '@/store'
import type { ChatMessage, RichContent, ChatAction } from '@/data/types'

interface ChatResponse {
  content: string
  richContent: RichContent | null
  actions: ChatAction[]
  delay: number  // ms to simulate "thinking"
}

export function getSimulatedResponse(userMessage: string): ChatResponse {
  const state = useAppStore.getState()
  const msg = userMessage.toLowerCase()

  // Pattern: status/situation/overview
  if (msg.includes('situation') || msg.includes('overview') || msg.includes('status')) {
    return buildOverviewResponse(state)
  }

  // Pattern: empty trucks / available trucks
  if (msg.includes('empty') || msg.includes('available truck')) {
    return buildEmptyTrucksResponse(state)
  }

  // Pattern: tomorrow / plan / forecast
  if (msg.includes('tomorrow') || msg.includes('plan') || msg.includes('forecast')) {
    return buildTomorrowPlanResponse(state)
  }

  // Pattern: specific load (LD-XXXX or load XXXX or #XXXX)
  const loadMatch = msg.match(/(?:ld-?|load\s*#?|#)(\d{4})/i)
  if (loadMatch) {
    return buildLoadDetailResponse(state, `LD-${loadMatch[1]}`)
  }

  // Pattern: specific truck (T-XXX)
  const truckMatch = msg.match(/t-(\d{3})/i)
  if (truckMatch) {
    return buildTruckDetailResponse(state, `T-${truckMatch[1]}`)
  }

  // Pattern: exception / problem / issue
  if (msg.includes('exception') || msg.includes('problem') || msg.includes('issue')) {
    return buildExceptionResponse(state)
  }

  // Pattern: find truck for / need a truck / assign
  if (msg.includes('find') || msg.includes('need a truck') || msg.includes('assign')) {
    return buildFindTruckResponse(state, msg)
  }

  // Pattern: rate / cost / lane rate
  if (msg.includes('rate') || msg.includes('cost') || msg.includes('lane')) {
    return buildRateResponse(state, msg)
  }

  // Pattern: unmatched / unassigned
  if (msg.includes('unmatched') || msg.includes('unassigned')) {
    return buildUnmatchedResponse(state)
  }

  // Default: helpful fallback
  return {
    content: `I can help you with dispatch operations. Try asking me about:\n\n` +
      `- **"What's the situation?"** — operations overview\n` +
      `- **"Show empty trucks"** — available capacity\n` +
      `- **"Tomorrow's plan"** — upcoming schedule\n` +
      `- **"Load #4521"** — specific load details\n` +
      `- **"Find a truck for Dallas to Memphis"** — capacity search\n` +
      `- **"Exceptions"** — current issues`,
    richContent: null,
    actions: [],
    delay: 800,
  }
}
```

Each builder function (e.g. `buildOverviewResponse`) queries live store state
and formats a response with real numbers. Example:

```ts
function buildOverviewResponse(state: StoreState): ChatResponse {
  const loads = Object.values(state.loads)
  const trucks = Object.values(state.trucks)
  const exceptions = Object.values(state.exceptions)

  const inTransit = loads.filter((l) => l.status === 'in_transit').length
  const atPickup = loads.filter((l) => l.status === 'at_pickup').length
  const empty = trucks.filter((t) => t.status === 'empty').length
  const activeExceptions = exceptions.filter((e) => e.status === 'active').length

  return {
    content: `Here's the current operations overview:\n\n` +
      `📦 **${loads.length}** total loads (${inTransit} in transit, ${atPickup} at pickup)\n` +
      `🚛 **${trucks.length}** trucks (${empty} available)\n` +
      `⚠️ **${activeExceptions}** active exceptions\n\n` +
      `Want me to dig into any of these?`,
    richContent: null,
    actions: [
      { label: 'Show empty trucks', action: 'empty_trucks', entityId: null },
      { label: 'View exceptions', action: 'exceptions', entityId: null },
      { label: 'Dispatch suggestions', action: 'recommendations', entityId: null },
    ],
    delay: 1200,
  }
}
```

### 3.2 Claude API Engine — `src/services/ai-chat-claude.ts`

Optional real API integration. Only used when `VITE_ANTHROPIC_API_KEY` env var is set.

```ts
import Anthropic from '@anthropic-ai/sdk'
import { useAppStore } from '@/store'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,  // client-side demo only
})

const SYSTEM_PROMPT = `You are the FreightOS AI Dispatch Assistant. You help dispatchers
manage their trucking fleet and loads.

CURRENT STATE:
{stateJson}

You have access to the following data:
- Trucks: fleet with status, position, driver assignments
- Loads: active/pending loads with routes, rates, status
- Drivers: roster with HOS status, performance scores
- Exceptions: active issues needing attention

When recommending actions, include specific truck IDs, load IDs, and driver names.
Provide confidence scores for recommendations.
Be concise and data-driven. Use bullet points.
Reference specific entity IDs (e.g., T-208, LD-4521, Driver: James Wright).`

export async function getClaudeResponse(
  messages: Array<{ role: 'user' | 'assistant', content: string }>,
): Promise<string> {
  const state = useAppStore.getState()

  // Build condensed state summary (not full state — too large)
  const stateSummary = buildStateSummary(state)

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    system: SYSTEM_PROMPT.replace('{stateJson}', JSON.stringify(stateSummary)),
    messages,
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}

function buildStateSummary(state: StoreState) {
  // Return a compact version of the state with:
  // - truck count by status
  // - top 5 exceptions
  // - unassigned loads summary
  // - driver HOS summary
  // Keep under ~2000 tokens
  return { /* ... */ }
}
```

### 3.3 Chat Service Router — `src/services/ai-chat.ts`

```ts
import { getSimulatedResponse } from './ai-chat-simulated'
import { getClaudeResponse } from './ai-chat-claude'

const USE_CLAUDE = !!import.meta.env.VITE_ANTHROPIC_API_KEY

export async function sendChatMessage(
  userMessage: string,
  history: Array<{ role: 'user' | 'assistant', content: string }>,
): Promise<ChatResponse> {
  if (USE_CLAUDE) {
    const text = await getClaudeResponse([...history, { role: 'user', content: userMessage }])
    return { content: text, richContent: null, actions: [], delay: 0 }
  }
  return getSimulatedResponse(userMessage)
}
```

### 3.4 Planning Assistant — `src/components/ai/planning-assistant.tsx`

A focused view for tomorrow's planning. Shows:
- Demand forecast card (loads expected by hour)
- Empty truck list with AI repositioning suggestions
- Recommended spot loads to accept
- "Approve Plan" button → bulk-dispatches approved suggestions

This is a static/card-based view (not chat), sourced from store state.

---

## 4. Voice Agent Demo System

### 4.1 Pre-Scripted Scenarios — `src/data/voice-scenarios.ts`

Five complete call scenarios as data objects:

```ts
import type { VoiceCall, TranscriptLine, SystemAction } from './types'

export interface VoiceScenario {
  id: string
  name: string
  description: string
  direction: 'inbound' | 'outbound'
  callerName: string
  callerCompany: string
  callerPhone: string
  topic: string
  transcript: TranscriptLine[]
  systemActions: SystemAction[]
  summary: string
  relatedLoadId: string | null
  totalDuration: number      // seconds
}

export const VOICE_SCENARIOS: VoiceScenario[] = [
  {
    id: 'scenario-1',
    name: 'Where\'s My Truck?',
    description: 'Shipper calls asking about load status',
    direction: 'inbound',
    callerName: 'Sarah Mitchell',
    callerCompany: 'Southeast Distributors',
    callerPhone: '(404) 555-0188',
    topic: 'Load status inquiry',
    transcript: [
      { speaker: 'agent', text: 'Good afternoon, FreightOS dispatch. This is the AI assistant speaking. How can I help you today?', timestamp: 0 },
      { speaker: 'caller', text: 'Hi, this is Sarah from Southeast Distributors. I\'m calling about a shipment we\'re expecting.', timestamp: 5 },
      { speaker: 'agent', text: 'Of course, Sarah. I can look that up for you right away. Do you have a load number or PO number?', timestamp: 11 },
      { speaker: 'caller', text: 'Yes, it should be load number forty-five twenty-one.', timestamp: 17 },
      { speaker: 'agent', text: 'I found load four-five-two-one. It\'s currently in transit from Atlanta to Memphis. Let me get you the latest position and ETA.', timestamp: 22 },
      { speaker: 'caller', text: 'Great, we were expecting it by four PM today. Is that still on track?', timestamp: 30 },
      { speaker: 'agent', text: 'The truck is currently about 45 miles west of Birmingham on I-20. Based on current conditions, the estimated arrival is four-thirty PM, which is about 30 minutes later than your original appointment window.', timestamp: 36 },
      { speaker: 'caller', text: 'Oh, that\'s a little late. Is there any traffic or issues causing the delay?', timestamp: 48 },
      { speaker: 'agent', text: 'There was some congestion near the Birmingham interchange earlier, but traffic has cleared. The driver, Mike Torres, is making good time now. Would you like me to send you a tracking link so you can monitor the arrival in real time?', timestamp: 54 },
      { speaker: 'caller', text: 'Yes, that would be helpful. Can you also let our receiving team know about the updated time?', timestamp: 66 },
      { speaker: 'agent', text: 'Absolutely. I\'ll send a tracking link to your email on file and notify your receiving dock about the four-thirty ETA. Is there anything else I can help with?', timestamp: 72 },
      { speaker: 'caller', text: 'No, that\'s everything. Thank you!', timestamp: 80 },
      { speaker: 'agent', text: 'You\'re welcome, Sarah. Have a great afternoon.', timestamp: 84 },
    ],
    systemActions: [
      { timestamp: 22, action: 'Searching for Load #4521...', result: 'Found: ATL→MEM, In Transit' },
      { timestamp: 36, action: 'Calculating ETA from current position...', result: 'ETA: 4:30 PM (30 min late)' },
      { timestamp: 54, action: 'Checking driver status for T-217...', result: 'Driver: Mike Torres, 8.2h HOS remaining' },
      { timestamp: 72, action: 'Generating tracking link...', result: 'Link created: track.freightos.com/4521' },
      { timestamp: 74, action: 'Sending email to sarah@southeast-dist.com', result: 'Email queued' },
      { timestamp: 76, action: 'Updating delivery ETA to 4:30 PM', result: 'Load #4521 ETA updated' },
    ],
    summary: 'Shipper inquired about Load #4521 status. Provided current location (west of Birmingham), updated ETA (4:30 PM, 30 min late), and sent tracking link. Notified receiving dock of updated arrival time.',
    relatedLoadId: 'LD-4521',
    totalDuration: 88,
  },

  // Scenario 2: New load tender
  {
    id: 'scenario-2',
    name: 'New Load Tender',
    description: 'Shipper calls to tender a new load',
    direction: 'inbound',
    // ... full transcript for "I need a truck in Charlotte tomorrow
    //     for a full load going to Jacksonville" flow
    // 15-20 transcript lines covering: greeting, capturing details,
    // checking capacity, providing rate quote, confirming the tender
    // system actions: capacity check, rate lookup, load creation
    callerName: 'David Chen',
    callerCompany: 'Carolina Chemical Supply',
    callerPhone: '(704) 555-0234',
    topic: 'New load tender',
    transcript: [/* ... 15-20 lines ... */],
    systemActions: [/* ... 6-8 actions ... */],
    summary: 'Shipper tendered new load CLT→JAX. Captured: 42,000 lbs chemical products, reefer at 55°F, pickup Feb 14 8AM. Rate quoted at $3.10/mi. Load created as LD-4580.',
    relatedLoadId: null,
    totalDuration: 120,
  },

  // Scenario 3: Outbound carrier offer
  {
    id: 'scenario-3',
    name: 'Carrier Load Offer',
    description: 'AI calls partner carrier to offer a load',
    direction: 'outbound',
    callerName: 'Bill Patterson',
    callerCompany: 'J&R Trucking',
    callerPhone: '(615) 555-0167',
    topic: 'Load offer and negotiation',
    transcript: [/* ... 18-22 lines covering offer, rate discussion,
                     counteroffer, acceptance */],
    systemActions: [/* ... 5-7 actions ... */],
    summary: 'Offered Load #4535 (ATL→MEM, $2.40/mi) to J&R Trucking. Carrier countered at $2.55/mi. Agreed at $2.50/mi. Load assigned to carrier.',
    relatedLoadId: 'LD-4535',
    totalDuration: 135,
  },

  // Scenario 4: Driver breakdown report
  {
    id: 'scenario-4',
    name: 'Driver Breakdown',
    description: 'Driver calls to report a breakdown',
    direction: 'inbound',
    callerName: 'Mike Torres',
    callerCompany: 'FreightOS Driver',
    callerPhone: '(404) 555-0123',
    topic: 'Breakdown report',
    transcript: [/* ... 12-15 lines ... */],
    systemActions: [/* ... 8-10 actions: create incident, check nearby trucks,
                     initiate roadside, notify shipper, suggest reassignment */],
    summary: 'Driver reported flat tire on I-20 at mile marker 223. Created breakdown event. Initiated roadside assistance (ETA 45 min). Notified shipper of delay. Recommended reassigning load to T-302 (28 miles away).',
    relatedLoadId: 'LD-4521',
    totalDuration: 105,
  },

  // Scenario 5: Appointment reschedule
  {
    id: 'scenario-5',
    name: 'Reschedule Appointment',
    description: 'Shipper requests delivery reschedule',
    direction: 'inbound',
    callerName: 'Lisa Wong',
    callerCompany: 'Peach State Logistics',
    callerPhone: '(770) 555-0145',
    topic: 'Appointment reschedule',
    transcript: [/* ... 10-12 lines ... */],
    systemActions: [/* ... 4-5 actions: check feasibility, check driver HOS impact,
                     update appointment, confirm */],
    summary: 'Shipper requested moving delivery from Thursday 2PM to Thursday 4PM. Checked driver HOS — feasible with 2h buffer. Updated appointment window. Confirmed with shipper.',
    relatedLoadId: 'LD-4525',
    totalDuration: 75,
  },
]
```

**Note:** For scenarios 2-5, provide abbreviated transcript stubs in the plan.
The implementer fills in realistic dialogue following the pattern of scenario 1.

---

## 5. Voice Playback Engine

### Component: `src/components/voice/voice-call-demo.tsx`

Full-screen immersive call experience with timed transcript playback.

### ASCII Wireframe

```
┌─────────────────────────────┐
│          ■ dark bg ■        │
│                             │
│   📞  ACTIVE CALL  3:42    │
│                             │
│   Inbound from:            │
│   Sarah Mitchell            │
│   Southeast Distributors    │
│   (404) 555-0188           │
│                             │
│─────────────────────────────│
│                             │
│  CALLER                AI   │  ← dual transcript
│  ─────               ────  │
│  "Hi, this is        "Good │
│  Sarah from          after-│
│  Southeast           noon, │
│  Distributors.       Freig-│
│  I'm calling         htOS  │
│  about a ship-       disp- │
│  ment we're          atch."│
│  expecting."                │
│           ▓▓▓▓▓▓▓▓▓▓       │  ← waveform
│                             │
│─────────────────────────────│
│  SYSTEM ACTIONS             │
│  ┌──────────────────────┐   │
│  │ 🔍 Searching Load    │   │
│  │    #4521...          │   │
│  │ ✓ Found: ATL→MEM    │   │
│  │ 📊 Calculating ETA...│   │
│  │ ✓ ETA: 4:30 PM      │   │
│  └──────────────────────┘   │
│                             │
│─────────────────────────────│
│  ◀◀  ▶/⏸  ▶▶  1x  ⏹     │  ← controls
│  ─────●──────────────────   │  ← scrub bar
└─────────────────────────────┘
```

### Implementation

```tsx
function VoiceCallDemo({ scenario }: { scenario: VoiceScenario }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)  // seconds
  const [speed, setSpeed] = useState(1)               // 1x, 1.5x, 2x
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  // Tick every 100ms when playing
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((t) => {
          const next = t + 0.1 * speed
          if (next >= scenario.totalDuration) {
            setIsPlaying(false)
            return scenario.totalDuration
          }
          return next
        })
      }, 100)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, speed])

  // Get visible transcript lines (all with timestamp <= currentTime)
  const visibleTranscript = scenario.transcript.filter(
    (line) => line.timestamp <= currentTime,
  )

  // Get visible system actions
  const visibleActions = scenario.systemActions.filter(
    (action) => action.timestamp <= currentTime,
  )

  // Current word reveal: for the last visible line, reveal words
  // progressively based on elapsed time since line started
  const currentLine = visibleTranscript[visibleTranscript.length - 1]
  // ...word-by-word reveal logic

  return (
    <div className="flex h-full flex-col bg-freight-navy text-white">
      <CallHeader scenario={scenario} currentTime={currentTime} />
      <TranscriptArea
        transcript={visibleTranscript}
        currentLine={currentLine}
        currentTime={currentTime}
      />
      <SystemActionFeed actions={visibleActions} />
      <PlaybackControls
        isPlaying={isPlaying}
        speed={speed}
        currentTime={currentTime}
        totalDuration={scenario.totalDuration}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onSpeedChange={setSpeed}
        onSeek={setCurrentTime}
        onSkip={() => skipToNextKeyMoment(currentTime, scenario)}
        onEnd={() => setCurrentTime(scenario.totalDuration)}
      />
    </div>
  )
}
```

#### 5.1 `CallHeader` — `src/components/voice/call-header.tsx`

Dark header showing:
- "ACTIVE CALL" badge with pulsing dot (while playing)
- Duration counter (formatted as M:SS)
- Direction badge (Inbound / Outbound)
- Caller info: name, company, phone number

#### 5.2 `TranscriptArea` — `src/components/voice/transcript-area.tsx`

Split view layout:
- Left column: caller's words (white text)
- Right column: AI agent's words (purple-accented text)
- New lines appear with fade-in animation
- **Word-by-word reveal**: for the currently "speaking" line, words appear
  one at a time with ~150ms spacing. Calculate visible word count from:
  ```ts
  const lineStartTime = currentLine.timestamp
  const elapsed = currentTime - lineStartTime
  const words = currentLine.text.split(' ')
  const wordsPerSecond = 2.5  // natural speaking pace
  const visibleWordCount = Math.min(words.length, Math.floor(elapsed * wordsPerSecond))
  ```
- Highlighted keywords: certain words are marked (load numbers, locations, rates)
  with a subtle background highlight to show what the AI is "reacting to"
- Auto-scrolls to newest content

#### 5.3 `SystemActionFeed` — `src/components/voice/system-action-feed.tsx`

Bottom panel showing AI's "thinking" during the call:
- Each action shows as a log entry with icon:
  - 🔍 for searches
  - 📊 for calculations
  - ✓ for results
  - 📧 for notifications
  - ⚡ for status updates
- Actions appear with a typewriter effect
- Results appear after a brief delay (200ms)

#### 5.4 `PlaybackControls` — `src/components/voice/playback-controls.tsx`

- Play/Pause toggle (large center button)
- Skip back (<<) — jump back 10 seconds
- Skip forward (>>) — skip to next key moment (next system action timestamp)
- Speed toggle: 1x → 1.5x → 2x (cycles on tap)
- Scrub bar: horizontal slider showing progress through the call
- End Call button — stops playback, shows post-call summary

#### 5.5 `PostCallSummary` — `src/components/voice/post-call-summary.tsx`

Shown when call ends (either naturally or via End Call):

```
┌─────────────────────────────┐
│       CALL COMPLETE          │
│       Duration: 1:28         │
│─────────────────────────────│
│ 📝 Summary                   │
│ Shipper inquired about Load │
│ #4521 status. Provided      │
│ current location, updated   │
│ ETA (4:30 PM), and sent     │
│ tracking link. Notified     │
│ receiving dock.             │
│─────────────────────────────│
│ ⚡ Actions Taken             │
│ • Updated ETA → 4:30 PM    │
│ • Sent tracking link        │
│ • Notified receiving dock   │
│─────────────────────────────│
│ 📊 Call Quality              │
│ Sentiment: 😊 Positive      │
│ Confidence: 92%             │
│ Resolution: ✅ Resolved      │
│─────────────────────────────│
│ [Replay]  [Try Another]     │
│      [Return to Dashboard]   │
└─────────────────────────────┘
```

---

## 6. Voice Call Dashboard

### Route: within `src/routes/_app/ai.tsx` (voice tab)

### Component: `src/components/voice/voice-dashboard.tsx`

Sub-tabs: Live Calls | History | Performance | Settings

#### 6.1 `LiveCallsView` — `src/components/voice/live-calls-view.tsx`

Shows active call cards (from `voiceCalls` where `outcome === 'in_progress'`).
If no active calls, shows a summary card with today's stats and a "Start Demo Call"
button.

Each live call card:
- Pulsing green dot + "ACTIVE" + duration
- Caller info
- Topic badge
- Sentiment emoji
- Confidence percentage
- Live transcript snippet (last 2 lines)
- Buttons: [Listen In] [Take Over] [View Load]

#### 6.2 `CallHistoryView` — `src/components/voice/call-history-view.tsx`

Scrollable list of completed calls. Each entry:
- Direction icon (↙ inbound / ↗ outbound)
- Caller name + company
- Duration
- Outcome badge (Resolved ✅ / Transferred 🔄 / Failed ❌)
- Timestamp
- Tap → expands to full transcript with summary

#### 6.3 `CallPerformanceView` — `src/components/voice/call-performance-view.tsx`

Metrics and charts (using Recharts):
- Top metrics: calls today (12), avg duration (1:45), resolution rate (87%), transferred (2)
- Bar chart: calls by hour
- Line chart: resolution rate trend (7-day)
- Horizontal bar: top call topics
- Comparison card: AI-handled vs human-handled

#### 6.4 `VoicePerformanceMetrics` — `src/components/voice/voice-performance-metrics.tsx`

Row of `MetricCard` components with voice-specific KPIs.

---

## 7. Voice Agent Configuration

### Component: `src/components/voice/voice-settings.tsx`

Settings panel for the AI voice agent persona and business rules.

```
┌─────────────────────────────┐
│ Voice Agent Settings        │
│─────────────────────────────│
│ Agent Name                  │
│ ┌───────────────────────┐   │
│ │ Alex                  │   │
│ └───────────────────────┘   │
│ Voice Style                 │
│ ┌───────────────────────┐   │
│ │ Professional       ▾  │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ 📋 Business Rules           │
│                             │
│ Rate Quotation Authority    │
│ ┌──┐ Enabled                │
│ │✓ │ Max discount: 5%      │
│ └──┘ Margin floor: 10%     │
│                             │
│ Load Acceptance Authority   │
│ ┌──┐ Enabled                │
│ │  │ Max rate: $3.50/mi    │
│ └──┘                        │
│                             │
│ Escalation Triggers         │
│ ☑ Rate below floor          │
│ ☑ Hazmat loads              │
│ ☑ New shipper (no history)  │
│ ☑ Caller requests human     │
│ ☐ Multi-stop loads          │
│─────────────────────────────│
│ ⏰ Operating Hours           │
│ Mon-Fri: 6:00 AM - 8:00 PM │
│ Sat: 8:00 AM - 2:00 PM     │
│ Sun: Closed                 │
│─────────────────────────────│
│ 💬 Greeting                  │
│ ┌───────────────────────┐   │
│ │ Good [time], FreightOS│   │
│ │ dispatch. This is the │   │
│ │ AI assistant speaking.│   │
│ │ How can I help you?   │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ [Test Call]                 │  ← triggers voice demo
└─────────────────────────────┘
```

Uses shadcn `Switch`, `Select`, `Input`, `Textarea` components. All values
stored in a `voiceConfig` slice of the store. "Test Call" button navigates
to the voice call demo with scenario-1.

---

## 8. Reporting & Analytics

### Route: `src/routes/_app/more/reports.tsx`

### Dependencies: `recharts`

### ASCII Wireframe

```
┌─────────────────────────────┐
│ Reports & Analytics         │
│ [Today] [Week] [Month] [Cst]│ ← date range
│─────────────────────────────│
│ KPI Strip (scroll-x)       │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐│
│ │96% │ │93% │ │$47K│ │18% ││
│ │OT  │ │OT  │ │Rev/│ │Avg ││
│ │PU ↑│ │DEL↓│ │Trk │ │Mrgn││
│ └────┘ └────┘ └────┘ └────┘│
│─────────────────────────────│
│ Revenue & Margin            │
│ ┌───────────────────────┐   │
│ │ $│ ██                 │   │  ← bar + line combo
│ │  │ ██ ██              │   │
│ │  │ ██ ██ ██  ── margin│   │
│ │  │ ██ ██ ██ ██        │   │
│ │  └──────────────── wk │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ Load Volume                 │
│ ┌───────────────────────┐   │
│ │ ██ ██ ██ ██ ██ ██ ██  │   │  ← stacked bar
│ │ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓  │   │
│ │ M  T  W  T  F  S  S  │   │
│ │ ■ Carrier  ▓ Brokered │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ Lane Heat Map               │
│ ┌───────────────────────┐   │
│ │  🗺  (map with colored    │   │
│ │     lane lines)        │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ On-Time Performance         │
│ ┌───────────────────────┐   │
│ │   ╭───╮    ╭───╮      │   │  ← gauge charts
│ │  ╱ 96% ╲  ╱ 93% ╲    │   │
│ │ │ PU OT │ │ DEL OT│   │   │
│ │  ╲     ╱  ╲     ╱    │   │
│ │   ╰───╯    ╰───╯      │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ Top Customers               │
│ ┌───────────────────────┐   │
│ │ Piedmont    ████████  │   │  ← horizontal bar
│ │ Southeast   ██████    │   │
│ │ Carolina    █████     │   │
│ │ Golden      ████      │   │
│ │ Blue Ridge  ███       │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ Driver Scorecards           │
│ ┌───────────────────────┐   │
│ │ 1. Mike Torres     98 │   │  ← ranked list
│ │ 2. Sarah Chen      95 │   │
│ │ 3. James Wright    91 │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ ✨ AI Impact                │
│ ┌───────────────────────┐   │
│ │ Dispatches assisted: 34│  │
│ │ Voice calls handled: 12│  │
│ │ Exceptions resolved: 8 │  │
│ │ Est. time saved: 4.2 hr│  │
│ └───────────────────────────│
└─────────────────────────────┘
```

### Component Breakdown

#### 8.1 `ReportsScreen` — `src/routes/_app/more/reports.tsx`

```tsx
function ReportsScreen() {
  const [range, setRange] = useState<'today' | 'week' | 'month' | 'custom'>('week')

  return (
    <div className="flex flex-col gap-4 overflow-y-auto p-4">
      <DateRangeSelector value={range} onChange={setRange} />
      <KpiStrip range={range} />
      <RevenueMarginChart range={range} />
      <LoadVolumeChart range={range} />
      <LaneHeatMap />
      <OnTimeGauges />
      <TopCustomersChart />
      <DriverScorecardList />
      <AiImpactCard />
    </div>
  )
}
```

#### 8.2 `KpiStrip` — `src/components/reports/kpi-strip.tsx`

Horizontal scroll of `MetricCard` instances:
- On-time Pickup % (with trend arrow)
- On-time Delivery %
- Revenue per truck per week
- Average margin %
- Deadhead %
- Claims ratio

Values computed from store data.

#### 8.3 `RevenueMarginChart` — `src/components/reports/revenue-margin-chart.tsx`

Recharts `ComposedChart` with:
- `Bar` for weekly revenue
- `Line` for margin percentage (secondary Y-axis)
- Responsive container
- Tooltip on tap

```tsx
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'
```

Data: generate 7 weekly data points from store (or hardcoded demo data).

#### 8.4 `LoadVolumeChart` — `src/components/reports/load-volume-chart.tsx`

Recharts stacked `BarChart`:
- Blue bars for carrier loads
- Purple bars for brokered loads
- Daily for past 7 days

#### 8.5 `LaneHeatMap` — `src/components/reports/lane-heat-map.tsx`

Leaflet map showing lanes as lines colored by profitability:
- Line width: proportional to load count
- Line color: green (profitable) to red (low margin)
- Tap a lane → popup with stats (load count, avg rate, avg margin)

#### 8.6 `OnTimeGauges` — `src/components/reports/on-time-gauges.tsx`

Two semicircular gauge charts (Recharts `PieChart` with custom `startAngle`/`endAngle`):
- Pickup on-time %
- Delivery on-time %
- Target line at 95%
- Green above target, red below

#### 8.7 `TopCustomersChart` — `src/components/reports/top-customers-chart.tsx`

Recharts horizontal `BarChart` showing top 10 shippers by revenue.

#### 8.8 `DriverScorecardList` — `src/components/reports/driver-scorecard-list.tsx`

Ranked list of drivers by composite score. Each row:
- Rank number, driver name, score (colored), mini bar showing score visually
- Tap → navigate to driver detail

#### 8.9 `AiImpactCard` — `src/components/reports/ai-impact-card.tsx`

Card with AI-specific metrics:
- Dispatches assisted by AI: count with percentage of total
- Voice calls handled: count
- Exceptions auto-resolved: count
- Estimated time saved: hours
- All values computed from store data

---

## 9. Demo Controls

### Route: `src/routes/_app/more/demo.tsx`

### ASCII Wireframe

```
┌─────────────────────────────┐
│ Demo Controls          🔄   │
│─────────────────────────────│
│ 🎬 SCENARIOS                │
│ ┌───────────────────────┐   │
│ │ ● Normal Operations   │   │  ← selected
│ │   Smooth sailing      │   │
│ ├───────────────────────┤   │
│ │ ○ Monday Morning Rush │   │
│ │   High volume         │   │
│ ├───────────────────────┤   │
│ │ ○ Weather Disruption  │   │
│ │   Storm in SE         │   │
│ ├───────────────────────┤   │
│ │ ○ Capacity Crunch     │   │
│ │   More loads than trks│   │
│ ├───────────────────────┤   │
│ │ ○ New Customer        │   │
│ │   First load tender   │   │
│ ├───────────────────────┤   │
│ │ ○ End of Day          │   │
│ │   Wrapping up ops     │   │
│ └───────────────────────┘   │
│ [Load Scenario]             │
│─────────────────────────────│
│ ⏱ TIME SIMULATOR            │
│ ┌───────────────────────┐   │
│ │ Current: 2:30 PM      │   │
│ │ Elapsed: 2h 30m       │   │
│ │                       │   │
│ │ [+15m] [+1h] [+4h]   │   │  ← advance buttons
│ │                       │   │
│ │ Speed: [1x] [2x] [5x]│   │
│ │ [▶ Play] [⏸ Pause]   │   │
│ └───────────────────────┘   │
│                             │
│ 📋 EVENTS QUEUE             │
│ ┌───────────────────────┐   │
│ │ +30m  T-217 traffic   │   │
│ │ +1h   New load tender │   │
│ │ +2h   HOS expiry DRV12│  │
│ │ +4h   Weather alert   │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ ⚡ EVENT INJECTOR            │
│ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │ 🔧  │ │ ❌  │ │ 🌧  │   │
│ │Brkdn│ │Cancl│ │Wthr │   │
│ ├─────┤ ├─────┤ ├─────┤   │
│ │ 💰  │ │ 📦  │ │ ⏰  │   │
│ │Rate │ │NewLd│ │HOS  │   │
│ ├─────┤ ├─────┤ ├─────┤   │
│ │ 🏭  │ │ 📞  │ │     │   │
│ │Detn │ │Call │ │     │   │
│ └─────┘ └─────┘ └─────┘   │
│─────────────────────────────│
│ [Reset to Default]          │
│ [Reset Current Scenario]    │
│ [Start Guided Tour]         │
└─────────────────────────────┘
```

### 9.1 Scenario Selector — `src/components/demo/scenario-selector.tsx`

```ts
const SCENARIOS = [
  {
    id: 'normal',
    name: 'Normal Operations',
    description: 'Everything running smoothly — good baseline demo',
    icon: '☀️',
  },
  {
    id: 'monday_rush',
    name: 'Monday Morning Rush',
    description: 'High volume, multiple assignments needed, busy dashboard',
    icon: '🔥',
  },
  {
    id: 'weather',
    name: 'Weather Disruption',
    description: 'Storm affecting Southeast routes, rerouting needed',
    icon: '🌧',
  },
  {
    id: 'capacity_crunch',
    name: 'Capacity Crunch',
    description: 'More loads than trucks — prioritization required',
    icon: '📈',
  },
  {
    id: 'new_customer',
    name: 'New Customer Onboarding',
    description: 'Shipper calling to tender first load via voice agent',
    icon: '🤝',
  },
  {
    id: 'end_of_day',
    name: 'End of Day',
    description: 'Wrapping up operations, reviewing tomorrow\'s plan',
    icon: '🌙',
  },
]
```

Each scenario, when loaded, replaces the store state with a pre-built snapshot.
The snapshot is generated by `createSeedState()` with modified parameters
(e.g., Monday rush has more loads in `tendered` status, weather has exceptions).

### 9.2 Time Simulator — `src/components/demo/time-simulator.tsx`

Controls for the simulation clock (from `TimeSlice`):
- Clock display: current simulated time
- Elapsed: time since simulation start
- Advance buttons: +15m, +1h, +4h (call `advanceTime()`)
- Speed selector: 1x, 2x, 5x, 10x
- Play/Pause toggle

Events queue: shows the next 4–5 `timeEvents` that will trigger,
with their relative trigger time. As time advances, triggered events
disappear and their effects are visible in the app.

### 9.3 Event Injector — `src/components/demo/event-injector.tsx`

Grid of 8 buttons, each triggering an immediate event:

| Button | Action |
|--------|--------|
| Breakdown | Opens entity picker → creates exception for selected truck |
| Cancellation | Opens entity picker → cancels selected load |
| Weather | Opens region picker → creates weather exception for region |
| Rate Spike | Opens lane picker → adjusts rates for selected lane |
| New Load | Auto-generates a realistic new load in `tendered` status |
| HOS Expiry | Opens driver picker → sets drive remaining to 0 |
| Detention | Opens facility picker → creates detention exception |
| Incoming Call | Opens scenario picker → navigates to voice demo |

Each injection:
1. Shows a picker (if entity selection needed)
2. Creates the event/exception in the store
3. Shows a confirmation toast
4. Optionally navigates to the affected screen

### 9.4 Reset Controls — `src/components/demo/reset-controls.tsx`

- "Reset to Default" → `AlertDialog` confirmation → calls `createSeedState()` and replaces entire store
- "Reset Current Scenario" → reloads the currently selected scenario's snapshot

---

## 10. Guided Tour System

### Component: `src/components/tour/guided-tour.tsx`

Overlay system that walks the user through the app with highlighted
elements and explanatory tooltips.

### Implementation

```tsx
interface TourStep {
  target: string              // CSS selector or data-slot value
  title: string
  description: string
  position: 'top' | 'bottom' | 'left' | 'right'
  action?: () => void        // navigation or state change to show target
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-slot="bottom-tab-bar"]',
    title: 'Navigation',
    description: 'Five tabs give you quick access to all operations. Dashboard is your home base.',
    position: 'top',
  },
  {
    target: '[data-slot="metric-card"]:first-child',
    title: 'KPI Dashboard',
    description: 'Real-time metrics at a glance. Tap any card to drill into details.',
    position: 'bottom',
  },
  {
    target: '[data-slot="ai-suggestion"]',
    title: 'AI Suggestions',
    description: 'Purple-highlighted items are AI recommendations. The sparkle icon marks AI-generated content throughout the app.',
    position: 'bottom',
  },
  // ... 12 more steps covering:
  // - Mini map interaction
  // - Exception feed
  // - Load list & filtering
  // - Load detail lifecycle
  // - Fleet map
  // - Dispatch board
  // - AI chat
  // - Voice agent demo
  // - Reports
  // - Demo controls
  // - FAB quick actions
  // - Notification center
]
```

### Rendering

```tsx
function GuidedTour() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)

  if (!isActive) return null

  const step = TOUR_STEPS[currentStep]

  return (
    <>
      {/* Dark overlay with cutout for target element */}
      <div className="fixed inset-0 z-50">
        <SpotlightOverlay target={step.target} />
      </div>

      {/* Tooltip positioned near target */}
      <div
        className="fixed z-50 max-w-[300px] rounded-xl bg-card p-4 shadow-xl"
        style={computeTooltipPosition(step.target, step.position)}
      >
        <div className="text-sm font-semibold">{step.title}</div>
        <div className="mt-1 text-xs text-muted-foreground">{step.description}</div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {currentStep + 1} of {TOUR_STEPS.length}
          </span>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button size="xs" variant="ghost" onClick={() => setCurrentStep((s) => s - 1)}>
                Back
              </Button>
            )}
            <Button size="xs" variant="ghost" onClick={() => setIsActive(false)}>
              Skip
            </Button>
            <Button
              size="xs"
              onClick={() => {
                if (currentStep < TOUR_STEPS.length - 1) {
                  const nextStep = TOUR_STEPS[currentStep + 1]
                  if (nextStep.action) nextStep.action()
                  setCurrentStep((s) => s + 1)
                } else {
                  setIsActive(false)
                }
              }}
            >
              {currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
```

### `SpotlightOverlay` — `src/components/tour/spotlight-overlay.tsx`

Uses CSS `clip-path` or SVG mask to create a dark overlay with a transparent
cutout around the target element. The cutout is a rounded rectangle matching
the target's bounding rect + 8px padding.

```tsx
function SpotlightOverlay({ target }: { target: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    const el = document.querySelector(target)
    if (el) setRect(el.getBoundingClientRect())
  }, [target])

  if (!rect) return <div className="fixed inset-0 bg-black/60" />

  const padding = 8
  return (
    <svg className="fixed inset-0 h-full w-full">
      <defs>
        <mask id="spotlight-mask">
          <rect width="100%" height="100%" fill="white" />
          <rect
            x={rect.left - padding}
            y={rect.top - padding}
            width={rect.width + padding * 2}
            height={rect.height + padding * 2}
            rx={12}
            fill="black"
          />
        </mask>
      </defs>
      <rect
        width="100%" height="100%"
        fill="rgba(0,0,0,0.6)"
        mask="url(#spotlight-mask)"
      />
    </svg>
  )
}
```

---

## 11. Safety & Compliance

### Route: `src/routes/_app/more/safety.tsx`

### ASCII Wireframe

```
┌─────────────────────────────┐
│ Safety & Compliance         │
│─────────────────────────────│
│ ⚠️ HOS Violations Risk      │
│ ┌───────────────────────┐   │
│ │ 🔴 DRV-012  45m left  │   │
│ │    On LD-4525  BHM→JAX│   │
│ │    ✨AI: Plan relay     │   │
│ ├───────────────────────┤   │
│ │ 🟡 DRV-007  1.5h left │   │
│ │    On LD-4519  MEM→NSH│   │
│ │    OK if no delays     │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ 📊 CSA Scores (Simulated)   │
│ ┌───────────────────────┐   │
│ │ Unsafe Driving:    12 │   │
│ │ HOS Compliance:    18 │   │
│ │ Vehicle Maint:      8 │   │
│ │ Controlled Sub:     0 │   │
│ │ Driver Fitness:     5 │   │
│ │ Crash Indicator:    3 │   │
│ └───────────────────────┘   │
│─────────────────────────────│
│ 🔍 Recent Inspections       │
│ (simulated list)            │
│─────────────────────────────│
│ 📋 Pre-Trip Inspection Forms│
│ [Start New Inspection]      │
│ Recent: 3 completed today   │
└─────────────────────────────┘
```

### Components

- `HosViolationRiskList` — drivers approaching HOS limits, sorted by urgency
- `CsaScorecard` — simulated FMCSA CSA BASIC scores
- `InspectionHistory` — simulated list of recent inspections
- `PreTripForm` — simplified digital pre-trip inspection form (checkboxes)

---

## 12. UI Polish & Animations

### 12.1 CSS Animations — add to `src/styles.css`

```css
/* Card press effect */
[data-slot="card"],
[data-slot="metric-card"] {
  transition: transform 100ms ease-out;
}
[data-slot="card"]:active,
[data-slot="metric-card"]:active {
  transform: scale(0.98);
}

/* Pulse animation for active/current items */
@keyframes freight-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-freight-pulse {
  animation: freight-pulse 2s ease-in-out infinite;
}

/* Skeleton shimmer */
@keyframes freight-shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

/* Bottom sheet spring animation */
[data-slot="sheet-content"] {
  transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1);
}

/* Voice waveform animation */
@keyframes waveform-bar {
  0%, 100% { height: 4px; }
  50% { height: 20px; }
}
.waveform-bar {
  animation: waveform-bar 0.6s ease-in-out infinite;
}

/* Typing indicator */
@keyframes typing-dot {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

/* Fade in for new content */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 200ms ease-out;
}

/* Notification bell shake */
@keyframes bell-shake {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(15deg); }
  75% { transform: rotate(-15deg); }
}
```

### 12.2 Skeleton Loading States

Every screen should show skeletons while data initializes (first render).
Since data is client-side, this is mainly for the "loading feel":

```tsx
function LoadListScreen() {
  const loads = useAppStore((s) => s.loads)
  const isReady = Object.keys(loads).length > 0

  if (!isReady) {
    return (
      <div className="flex flex-col gap-3 p-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  return <LoadList ... />
}
```

### 12.3 Haptic Feedback — `src/lib/haptics.ts`

```ts
export function hapticLight() {
  if ('vibrate' in navigator) navigator.vibrate(10)
}

export function hapticMedium() {
  if ('vibrate' in navigator) navigator.vibrate(25)
}

export function hapticHeavy() {
  if ('vibrate' in navigator) navigator.vibrate([30, 10, 30])
}
```

Call `hapticLight()` on button taps, `hapticMedium()` on confirmations,
`hapticHeavy()` on destructive actions (reject load, cancel).

### 12.4 Voice Waveform Animation — `src/components/voice/waveform.tsx`

```tsx
export function Waveform({ isActive, color = 'freight-ai' }: { isActive: boolean, color?: string }) {
  return (
    <div className="flex items-end gap-0.5">
      {Array.from({ length: 20 }, (_, i) => (
        <span
          key={i}
          className={cn(
            'w-1 rounded-full',
            `bg-${color}`,
            isActive ? 'waveform-bar' : 'h-1',
          )}
          style={{
            animationDelay: `${i * 0.05}s`,
            animationDuration: `${0.4 + Math.random() * 0.4}s`,
          }}
        />
      ))}
    </div>
  )
}
```

### 12.5 Toast Notifications — `src/components/shared/toast.tsx`

Simple toast system for action confirmations:

```tsx
import { useState, useCallback } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

// Global toast state (simple approach — could use zustand)
let toasts: Toast[] = []
let setToasts: ((t: Toast[]) => void) | null = null

export function showToast(message: string, type: Toast['type'] = 'success') {
  const toast: Toast = { id: crypto.randomUUID(), message, type }
  toasts = [...toasts, toast]
  setToasts?.(toasts)

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== toast.id)
    setToasts?.(toasts)
  }, 3000)
}

export function ToastContainer() {
  const [items, setItems] = useState<Toast[]>([])
  setToasts = setItems

  return (
    <div className="fixed bottom-[calc(var(--freight-tab-height)+var(--freight-safe-bottom)+72px)] left-4 right-4 z-50 flex flex-col gap-2">
      {items.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'rounded-lg px-4 py-3 text-sm font-medium shadow-lg animate-fade-in-up',
            toast.type === 'success' && 'bg-freight-success text-white',
            toast.type === 'error' && 'bg-freight-critical text-white',
            toast.type === 'info' && 'bg-freight-accent text-white',
          )}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
```

Add `<ToastContainer />` to the `_app.tsx` layout.

---

## 13. Store Additions

### 13.1 Chat Slice — `src/store/chat-slice.ts`

```ts
export interface ChatSlice {
  chatMessages: ChatMessage[]
  addUserMessage: (content: string) => void
  addAssistantMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp' | 'role'>) => void
  clearChat: () => void
}
```

### 13.2 Voice Config Slice — `src/store/voice-config-slice.ts`

```ts
export interface VoiceConfigSlice {
  voiceConfig: {
    agentName: string
    voiceStyle: 'professional' | 'friendly' | 'regional'
    rateQuotationEnabled: boolean
    maxDiscount: number
    marginFloor: number
    loadAcceptanceEnabled: boolean
    maxRateCommitment: number
    escalationTriggers: string[]
    operatingHours: Record<string, { open: string, close: string } | null>
    greeting: string
  }
  updateVoiceConfig: (updates: Partial<VoiceConfigSlice['voiceConfig']>) => void
}
```

### 13.3 Tour Slice — `src/store/tour-slice.ts`

```ts
export interface TourSlice {
  isTourActive: boolean
  tourStep: number
  startTour: () => void
  nextTourStep: () => void
  prevTourStep: () => void
  endTour: () => void
}
```

### 13.4 Update Root Store

Add `ChatSlice`, `VoiceConfigSlice`, and `TourSlice` to `AppStore` and wire
into `src/store/index.ts`.

---

## 14. File Creation Order

### Phase A — Dependencies & Store

| # | File | Action |
|---|------|--------|
| 1 | `bun add recharts` | RUN |
| 2 | `src/store/chat-slice.ts` | CREATE |
| 3 | `src/store/voice-config-slice.ts` | CREATE |
| 4 | `src/store/tour-slice.ts` | CREATE |
| 5 | `src/store/index.ts` | EDIT — add new slices |

### Phase B — AI Chat Engine

| # | File | Depends On |
|---|------|-----------|
| 6 | `src/services/ai-chat-simulated.ts` | store, types |
| 7 | `src/services/ai-chat-claude.ts` | store, types (optional) |
| 8 | `src/services/ai-chat.ts` | simulated, claude |

### Phase C — AI Chat Interface

| # | File | Depends On |
|---|------|-----------|
| 9 | `src/components/ai/ai-header.tsx` | — |
| 10 | `src/components/ai/chat-bubble.tsx` | types, recommendation-card |
| 11 | `src/components/ai/typing-indicator.tsx` | — |
| 12 | `src/components/ai/suggestion-chips.tsx` | store |
| 13 | `src/components/ai/chat-input-bar.tsx` | — |
| 14 | `src/components/ai/chat-message-list.tsx` | chat-bubble, typing-indicator |
| 15 | `src/components/ai/chat-interface.tsx` | message-list, suggestion-chips, input-bar, service |
| 16 | `src/components/ai/planning-assistant.tsx` | store, metric-card |
| 17 | `src/routes/_app/ai.tsx` | REPLACE — add chat, voice, planning tabs |

### Phase D — Voice Agent Scenarios & Engine

| # | File | Depends On |
|---|------|-----------|
| 18 | `src/data/voice-scenarios.ts` | types |
| 19 | `src/components/voice/call-header.tsx` | types |
| 20 | `src/components/voice/transcript-area.tsx` | types |
| 21 | `src/components/voice/system-action-feed.tsx` | types |
| 22 | `src/components/voice/playback-controls.tsx` | — |
| 23 | `src/components/voice/waveform.tsx` | — |
| 24 | `src/components/voice/post-call-summary.tsx` | types |
| 25 | `src/components/voice/voice-call-demo.tsx` | all voice sub-components |

### Phase E — Voice Dashboard

| # | File | Depends On |
|---|------|-----------|
| 26 | `src/components/voice/live-calls-view.tsx` | store, types |
| 27 | `src/components/voice/call-history-view.tsx` | store, types |
| 28 | `src/components/voice/call-performance-view.tsx` | recharts, store |
| 29 | `src/components/voice/voice-performance-metrics.tsx` | metric-card |
| 30 | `src/components/voice/voice-settings.tsx` | store, shadcn components |
| 31 | `src/components/voice/voice-dashboard.tsx` | all voice dashboard views |

### Phase F — Analytics / Reports

| # | File | Depends On |
|---|------|-----------|
| 32 | `src/components/reports/date-range-selector.tsx` | tabs |
| 33 | `src/components/reports/kpi-strip.tsx` | metric-card, store |
| 34 | `src/components/reports/revenue-margin-chart.tsx` | recharts |
| 35 | `src/components/reports/load-volume-chart.tsx` | recharts |
| 36 | `src/components/reports/lane-heat-map.tsx` | react-leaflet, store |
| 37 | `src/components/reports/on-time-gauges.tsx` | recharts |
| 38 | `src/components/reports/top-customers-chart.tsx` | recharts |
| 39 | `src/components/reports/driver-scorecard-list.tsx` | store |
| 40 | `src/components/reports/ai-impact-card.tsx` | store, metric-card |
| 41 | `src/routes/_app/more/reports.tsx` | all report components |

### Phase G — Demo Controls

| # | File | Depends On |
|---|------|-----------|
| 42 | `src/data/demo-scenarios.ts` | types, seed |
| 43 | `src/components/demo/scenario-selector.tsx` | demo-scenarios, store |
| 44 | `src/components/demo/time-simulator.tsx` | store |
| 45 | `src/components/demo/event-injector.tsx` | store, types |
| 46 | `src/components/demo/reset-controls.tsx` | store, seed, alert-dialog |
| 47 | `src/routes/_app/more/demo.tsx` | all demo components |

### Phase H — Guided Tour

| # | File | Depends On |
|---|------|-----------|
| 48 | `src/data/tour-steps.ts` | — |
| 49 | `src/components/tour/spotlight-overlay.tsx` | — |
| 50 | `src/components/tour/guided-tour.tsx` | spotlight, tour-steps, store |
| 51 | `src/routes/_app.tsx` | EDIT — add GuidedTour + ToastContainer |

### Phase I — Safety & Compliance

| # | File | Depends On |
|---|------|-----------|
| 52 | `src/components/safety/hos-violation-risk.tsx` | store, types |
| 53 | `src/components/safety/csa-scorecard.tsx` | — |
| 54 | `src/components/safety/inspection-history.tsx` | — |
| 55 | `src/routes/_app/more/safety.tsx` | safety components |

### Phase J — Polish & Utilities

| # | File | Depends On |
|---|------|-----------|
| 56 | `src/lib/haptics.ts` | — |
| 57 | `src/components/shared/toast.tsx` | — |
| 58 | `src/styles.css` | EDIT — add all animation keyframes |

### Phase K — More Menu Updates

| # | File | Action |
|---|------|--------|
| 59 | `src/routes/_app/more.tsx` | EDIT — add links to reports, safety, demo |

### Summary

**New files: ~50** (3 services, 3 data files, 3 store slices, ~35 components, ~5 routes, 2 utility files)
**Edited files: ~5** (store/index.ts, _app.tsx, more.tsx, ai.tsx, styles.css)

### Verification Checklist

After completing Part 3, the full prototype should support:

- [ ] AI chat responds to natural language queries with live data
- [ ] Chat shows rich content (data tables, action buttons, mini maps)
- [ ] Suggestion chips update based on conversation context
- [ ] Voice demo plays full call transcript with word-by-word reveal
- [ ] System actions appear in real-time during voice playback
- [ ] Playback controls work (play/pause, speed, skip, scrub)
- [ ] Post-call summary shows after call ends
- [ ] Voice dashboard shows call history, performance charts
- [ ] Voice settings allow configuring agent persona and business rules
- [ ] Reports screen shows 7 chart/metric cards with Recharts
- [ ] Date range selector filters report data
- [ ] Lane heat map renders on Leaflet with profitability colors
- [ ] Demo controls: all 6 scenarios load correctly
- [ ] Time simulator advances time and triggers events
- [ ] Event injector creates exceptions/events on demand
- [ ] Reset buttons restore initial state
- [ ] Guided tour highlights elements with spotlight overlay
- [ ] Tour steps advance through 15 screens
- [ ] Safety dashboard shows HOS risks and CSA scores
- [ ] Card press animations work on all tappable cards
- [ ] Skeleton loading states show on initial render
- [ ] Toast notifications appear on dispatch/assign actions
- [ ] Voice waveform animates during playback
- [ ] `bun run build` succeeds
- [ ] All screens render correctly at 390px width
- [ ] Full end-to-end scenarios are walkable (new load → dispatch → delivery → invoice)
