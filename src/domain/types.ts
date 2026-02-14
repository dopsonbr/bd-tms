export type EquipmentType = 'dry_van' | 'reefer' | 'flatbed'

export type TruckStatus =
  | 'available'
  | 'en_route'
  | 'loading'
  | 'maintenance'
  | 'rest'

export type DriverStatus = 'available' | 'driving' | 'rest' | 'off_duty'

export type LoadStatus =
  | 'tendered'
  | 'pending_dispatch'
  | 'dispatched'
  | 'at_pickup'
  | 'in_transit'
  | 'at_delivery'
  | 'delivered'
  | 'invoiced'

export type ExceptionSeverity = 'critical' | 'warning' | 'info'

export type ScenarioId =
  | 'baseline'
  | 'scenario-a'
  | 'scenario-b'
  | 'scenario-c'
  | 'scenario-d'
  | 'scenario-e'

export type InjectedEventType =
  | 'breakdown'
  | 'weather'
  | 'tender'
  | 'incoming-call'

export interface CityNode {
  id: string
  city: string
  state: string
  lat: number
  lng: number
}

export interface Truck {
  id: string
  unit: string
  equipment: EquipmentType
  status: TruckStatus
  city: string
  state: string
  lat: number
  lng: number
  driverId?: string
  loadId?: string
  etaMinutes: number
}

export interface Driver {
  id: string
  name: string
  status: DriverStatus
  homeCity: string
  homeState: string
  hosRemainingHours: number
  performanceScore: number
  truckId?: string
}

export interface LoadStop {
  sequence: number
  city: string
  state: string
  windowStartIso: string
  windowEndIso: string
}

export interface LoadFinancials {
  revenue: number
  carrierCost: number
  accessorials: number
  margin: number
  marginPercent: number
}

export interface Load {
  id: string
  reference: string
  shipper: string
  equipment: EquipmentType
  status: LoadStatus
  brokered: boolean
  origin: LoadStop
  destination: LoadStop
  assignedTruckId?: string
  assignedDriverId?: string
  aiRecommendation?: string
  financials: LoadFinancials
}

export interface ExceptionEvent {
  id: string
  loadId: string
  severity: ExceptionSeverity
  title: string
  description: string
  createdAtIso: string
  resolved: boolean
  recommendedAction: string
}

export interface NotificationItem {
  id: string
  title: string
  level: ExceptionSeverity
  createdAtIso: string
  read: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAtIso: string
  confidence?: number
  reasoning?: Array<string>
  quickActions?: Array<string>
}

export interface SimEvent {
  id: string
  title: string
  detail: string
  kind: 'eta-slip' | 'new-tender' | 'hos-warning' | 'weather'
  atIso: string
  applied: boolean
}

export interface VoiceFrame {
  atSecond: number
  speaker: 'caller' | 'agent' | 'system'
  text: string
}

export interface VoiceScript {
  id: string
  title: string
  caller: string
  topic: string
  durationSeconds: number
  outcome: string
  frames: Array<VoiceFrame>
}

export interface AppState {
  nowIso: string
  scenarioId: ScenarioId
  trucks: Array<Truck>
  drivers: Array<Driver>
  loads: Array<Load>
  exceptions: Array<ExceptionEvent>
  notifications: Array<NotificationItem>
  chatMessages: Array<ChatMessage>
  eventQueue: Array<SimEvent>
  activeVoiceScriptId: string
}

export interface ScenarioMeta {
  id: ScenarioId
  label: string
  description: string
}
