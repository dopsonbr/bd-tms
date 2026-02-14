// ─── Primitives ──────────────────────────────────────────────────

export interface LatLng {
  lat: number
  lng: number
}

export type EntityId = string

export type EquipmentType = 'dry_van' | 'reefer' | 'flatbed' | 'power_only'

export type TruckStatus =
  | 'en_route'
  | 'at_pickup'
  | 'at_delivery'
  | 'empty'
  | 'out_of_service'
  | 'maintenance'

export type LoadStatus =
  | 'tendered'
  | 'accepted'
  | 'dispatched'
  | 'en_route_pickup'
  | 'at_pickup'
  | 'in_transit'
  | 'at_delivery'
  | 'delivered'
  | 'invoiced'
  | 'paid'
  | 'cancelled'

export type LoadType = 'carrier' | 'brokered'

export type DriverHosPhase = 'driving' | 'on_duty' | 'sleeper' | 'off_duty'

export type ExceptionSeverity = 'critical' | 'warning' | 'info'

export type ExceptionType =
  | 'late_pickup'
  | 'late_delivery'
  | 'hos_violation_risk'
  | 'maintenance_due'
  | 'detention'
  | 'weather'
  | 'breakdown'

export type CallDirection = 'inbound' | 'outbound'
export type CallOutcome = 'completed' | 'no_answer' | 'voicemail' | 'busy'
export type Sentiment = 'positive' | 'neutral' | 'negative'

// ─── Core Entities ───────────────────────────────────────────────

export interface Truck {
  id: EntityId
  truckNumber: string
  vin: string
  equipmentType: EquipmentType
  status: TruckStatus
  position: LatLng
  heading: number
  currentLoadId: EntityId | null
  driverId: EntityId | null
  trailerId: EntityId | null
  mileage: number
  nextMaintenanceMiles: number
  homeHub: string
  speed: number
}

export interface HosStatus {
  phase: DriverHosPhase
  driveRemaining: number
  onDutyRemaining: number
  cycleRemaining: number
  nextBreakDue: number
  resetStartedAt: string | null
  lastUpdated: string
}

export interface Driver {
  id: EntityId
  name: string
  phone: string
  photoUrl: string
  cdlNumber: string
  cdlExpiry: string
  endorsements: Array<string>
  homeBase: string
  truckId: EntityId | null
  hos: HosStatus
  performanceScore: number
  preferredLanes: Array<string>
  status: 'active' | 'off_duty' | 'on_leave'
  certifiedEquipment: Array<EquipmentType>
  hireDate: string
}

export interface FacilityStop {
  facilityId: EntityId
  facilityName: string
  address: string
  city: string
  state: string
  position: LatLng
  appointmentWindow: { start: string; end: string }
  actualArrival: string | null
  actualDeparture: string | null
  stopType: 'pickup' | 'delivery' | 'stop'
  status: 'pending' | 'arrived' | 'loading' | 'completed'
  sequence: number
}

export interface Accessorial {
  type: string
  description: string
  amount: number
}

export interface LifecycleEvent {
  status: LoadStatus
  timestamp: string
  actor: string
  note: string | null
}

export interface LoadDocument {
  id: EntityId
  type:
    | 'bol'
    | 'pod'
    | 'rate_confirmation'
    | 'scale_ticket'
    | 'lumper_receipt'
    | 'other'
  name: string
  thumbnailUrl: string
  uploadedAt: string
  status: 'received' | 'pending'
}

export interface CommunicationEntry {
  id: EntityId
  timestamp: string
  source: string
  type: 'note' | 'call' | 'text' | 'system_event'
  content: string
  isAi: boolean
}

export interface Load {
  id: EntityId
  type: LoadType
  status: LoadStatus
  origin: FacilityStop
  destination: FacilityStop
  stops: Array<FacilityStop>
  commodity: string
  weight: number
  equipmentRequired: EquipmentType
  temperature: number | null
  rate: number
  ratePerMile: number
  distance: number
  fuelSurcharge: number
  accessorials: Array<Accessorial>
  totalRevenue: number
  carrierCost: number | null
  margin: number | null
  marginPercent: number | null
  assignedTruckId: EntityId | null
  assignedDriverId: EntityId | null
  assignedCarrierId: EntityId | null
  shipperId: EntityId
  referenceNumbers: Array<string>
  specialInstructions: string
  lifecycle: Array<LifecycleEvent>
  documents: Array<LoadDocument>
  communications: Array<CommunicationEntry>
  routePolyline: Array<LatLng>
  currentPosition: LatLng | null
  createdAt: string
  updatedAt: string
}

export interface LaneHistory {
  origin: string
  destination: string
  loadCount: number
  averageRate: number
  lastShipped: string
}

export interface Shipper {
  id: EntityId
  name: string
  contactName: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  industry: string
  activeLoadCount: number
  averageVolume: number
  averageRate: number
  paymentTerms: number
  lanes: Array<LaneHistory>
}

export interface CarrierScorecard {
  onTimePickup: number
  onTimeDelivery: number
  claimsRatio: number
  communicationScore: number
  overallScore: number
  totalLoads: number
  lastLoadDate: string
}

export interface Carrier {
  id: EntityId
  name: string
  contactName: string
  phone: string
  email: string
  mcNumber: string
  dotNumber: string
  fleetSize: number
  equipmentTypes: Array<EquipmentType>
  serviceArea: Array<string>
  scorecard: CarrierScorecard
  status: 'active' | 'pending' | 'suspended'
  preferredLanes: Array<string>
  insuranceExpiry: string
  paymentTerms: string
}

export interface Facility {
  id: EntityId
  name: string
  address: string
  city: string
  state: string
  position: LatLng
  type:
    | 'shipper_warehouse'
    | 'receiver_warehouse'
    | 'distribution_center'
    | 'truck_stop'
    | 'rail_yard'
  operatingHours: { open: string; close: string }
  averageDwellTime: number
  hasDropTrailer: boolean
  dockCount: number
}

export interface Trailer {
  id: EntityId
  type: EquipmentType
  status: 'loaded' | 'empty' | 'in_maintenance'
  position: LatLng
  assignedTruckId: EntityId | null
  assignedLoadId: EntityId | null
  lastInspection: string
}

export interface Exception {
  id: EntityId
  type: ExceptionType
  severity: ExceptionSeverity
  loadId: EntityId | null
  truckId: EntityId | null
  driverId: EntityId | null
  title: string
  description: string
  detectedAt: string
  resolvedAt: string | null
  aiSuggestion: string
  status: 'active' | 'acknowledged' | 'resolved'
}

export interface Notification {
  id: EntityId
  priority: 'urgent' | 'info' | 'success'
  title: string
  body: string
  timestamp: string
  read: boolean
  relatedEntityType: string | null
  relatedEntityId: EntityId | null
}

export interface TranscriptLine {
  speaker: 'agent' | 'caller' | 'system'
  timestamp: string
  text: string
  sentiment: Sentiment | null
}

export interface SystemAction {
  action: string
  timestamp: string
  result: string
  data: Record<string, unknown>
}

export interface VoiceCall {
  id: EntityId
  direction: CallDirection
  callerName: string
  callerNumber: string
  startTime: string
  endTime: string | null
  duration: number
  outcome: CallOutcome
  transcript: Array<TranscriptLine>
  actions: Array<SystemAction>
  summary: string | null
  relatedLoadId: EntityId | null
  relatedDriverId: EntityId | null
}

export interface MatchFactor {
  name: string
  value: string
  score: number
  description: string
}

export interface DispatchRecommendation {
  id: EntityId
  loadId: EntityId
  truckId: EntityId
  driverId: EntityId
  score: number
  confidence: 'high' | 'medium' | 'low'
  factors: Array<MatchFactor>
  status: 'pending' | 'accepted' | 'rejected'
}

export interface ChatMessage {
  id: EntityId
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  richContent?: {
    type: 'load_card' | 'truck_card' | 'chart' | 'exception'
    data: Record<string, unknown>
  } | null
  actions?: Array<{
    id: string
    label: string
    action: string
  }>
}

export interface TimeEvent {
  triggerMinute: number
  type: string
  targetEntityId: EntityId
  description: string
  data: Record<string, unknown>
}

export interface DemoScenario {
  id: EntityId
  name: string
  description: string
  events: Array<TimeEvent>
}

// ─── Store State ─────────────────────────────────────────────────

export interface StoreState {
  trucks: Record<string, Truck>
  drivers: Record<string, Driver>
  loads: Record<string, Load>
  shippers: Record<string, Shipper>
  carriers: Record<string, Carrier>
  facilities: Record<string, Facility>
  trailers: Record<string, Trailer>
  exceptions: Record<string, Exception>
  notifications: Array<Notification>
  voiceCalls: Array<VoiceCall>
  recommendations: Array<DispatchRecommendation>
  chatMessages: Array<ChatMessage>
  timeEvents: Array<TimeEvent>
  simulatedTime: string
  selectedScenario: EntityId | null
}
