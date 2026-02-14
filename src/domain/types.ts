export type EquipmentType = 'dry_van' | 'reefer' | 'flatbed'

export type LoadStatus =
  | 'tendered'
  | 'assigned'
  | 'in_transit'
  | 'at_risk'
  | 'delivered'
  | 'invoiced'

export type TruckStatus = 'available' | 'assigned' | 'maintenance'
export type DriverStatus = 'available' | 'driving' | 'off_duty'

export type ExceptionSeverity = 'low' | 'medium' | 'high' | 'critical'
export type ExceptionStatus = 'open' | 'resolved'

export type ScenarioId = 'A' | 'B' | 'C' | 'D' | 'E'

export interface Shipper {
  id: string
  name: string
  tier: 'enterprise' | 'mid_market'
}

export interface Carrier {
  id: string
  name: string
  rating: number
}

export interface Truck {
  id: string
  unitNumber: string
  equipment: EquipmentType
  status: TruckStatus
  location: string
  etaMinutes: number
  hosRemainingHours: number
  driverId?: string
  currentLoadId?: string
}

export interface Driver {
  id: string
  name: string
  status: DriverStatus
  hosRemainingHours: number
  homeTerminal: string
  phone: string
  truckId?: string
}

export interface LoadStop {
  id: string
  type: 'pickup' | 'dropoff'
  location: string
  windowStartIso: string
  windowEndIso: string
  actualIso?: string
}

export interface Load {
  id: string
  reference: string
  shipperId: string
  carrierId: string
  equipment: EquipmentType
  status: LoadStatus
  origin: string
  destination: string
  miles: number
  pickupIso: string
  deliveryIso: string
  revenueUsd: number
  costUsd: number
  marginUsd: number
  truckId?: string
  driverId?: string
  stops: Array<LoadStop>
  tags: Array<string>
}

export interface ExceptionEvent {
  id: string
  loadId: string
  severity: ExceptionSeverity
  status: ExceptionStatus
  type: 'weather' | 'breakdown' | 'delay' | 'docs'
  title: string
  detail: string
  createdIso: string
  resolvedIso?: string
}

export interface TranscriptFrame {
  atSec: number
  speaker: 'caller' | 'agent' | 'system'
  text: string
  systemAction?: string
}

export interface VoiceCall {
  id: string
  loadId?: string
  direction: 'inbound' | 'outbound'
  contact: string
  startedIso: string
  durationSec: number
  status: 'live' | 'completed'
  frames: Array<TranscriptFrame>
}

export interface NotificationItem {
  id: string
  title: string
  body: string
  createdIso: string
  read: boolean
  severity: ExceptionSeverity
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  text: string
  createdIso: string
  actions?: Array<{
    id: string
    label: string
    action: 'assign_best_truck' | 'resolve_top_exception' | 'run_scenario_d'
  }>
}

export interface Recommendation {
  loadId: string
  truckId: string
  driverId: string
  confidence: number
  reason: string
  alternatives: Array<{
    truckId: string
    score: number
    reason: string
  }>
}

export interface SimEvent {
  id: string
  atIso: string
  type:
    | 'load_status'
    | 'exception_open'
    | 'exception_resolve'
    | 'voice_call_start'
    | 'voice_call_complete'
  payload: Record<string, string>
}

export interface SeedSnapshot {
  trucks: Array<Truck>
  drivers: Array<Driver>
  loads: Array<Load>
  shippers: Array<Shipper>
  carriers: Array<Carrier>
  exceptions: Array<ExceptionEvent>
  voiceCalls: Array<VoiceCall>
  notifications: Array<NotificationItem>
}

export interface ScenarioDefinition {
  id: ScenarioId
  name: string
  description: string
  queue: Array<SimEvent>
}

export interface AppState {
  baseline: SeedSnapshot
  entities: SeedSnapshot
  sim: {
    nowIso: string
    queue: Array<SimEvent>
    speed: 1 | 2 | 4
    eventLog: Array<string>
    scenarioId: ScenarioId
  }
  ui: {
    loadSegment: 'active' | 'available' | 'completed'
    selectedLoadId?: string
    selectedTruckId?: string
    searchOpen: boolean
    notificationsOpen: boolean
    reportRange: '24h' | '7d'
    guidedTourStep: number
  }
  ai: {
    messages: Array<ChatMessage>
    recommendation?: Recommendation
    planningApproved: boolean
  }
  voice: {
    activeCallId?: string
    playbackSecond: number
    playing: boolean
    speed: 1 | 2
  }
}

export type AppAction =
  | { type: 'set-load-segment'; payload: AppState['ui']['loadSegment'] }
  | { type: 'select-load'; payload?: string }
  | { type: 'select-truck'; payload?: string }
  | { type: 'toggle-search' }
  | { type: 'toggle-notifications' }
  | { type: 'mark-notification-read'; payload: string }
  | { type: 'assign-load'; payload: { loadId: string; truckId: string; driverId: string } }
  | { type: 'set-load-status'; payload: { loadId: string; status: LoadStatus } }
  | { type: 'resolve-exception'; payload: string }
  | { type: 'advance-time'; payload: { minutes: number } }
  | { type: 'load-scenario'; payload: ScenarioId }
  | { type: 'reset-demo' }
  | { type: 'apply-rate'; payload: { loadId: string; revenueUsd: number } }
  | { type: 'chat-user-message'; payload: string }
  | {
      type: 'chat-run-action'
      payload: 'assign_best_truck' | 'resolve_top_exception' | 'run_scenario_d'
    }
  | { type: 'set-report-range'; payload: AppState['ui']['reportRange'] }
  | { type: 'voice-play' }
  | { type: 'voice-pause' }
  | { type: 'voice-seek'; payload: number }
  | { type: 'voice-speed'; payload: 1 | 2 }
  | { type: 'inject-event'; payload: 'weather' | 'breakdown' | 'tender' | 'call' }
  | { type: 'set-guided-tour-step'; payload: number }
  | { type: 'approve-plan' }

export type EntityRecord<T extends { id: string }> = Record<string, T>
