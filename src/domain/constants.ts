import type { EquipmentType, ExceptionSeverity, LoadStatus, ScenarioId } from './types'

export const BASE_NOW_ISO = '2026-02-14T14:00:00.000Z'

export const LOAD_STATUS_ORDER: Array<LoadStatus> = [
  'tendered',
  'assigned',
  'in_transit',
  'at_risk',
  'delivered',
  'invoiced',
]

export const ACTIVE_LOAD_STATUSES: Array<LoadStatus> = ['assigned', 'in_transit', 'at_risk']

export const EQUIPMENT_LABELS: Record<EquipmentType, string> = {
  dry_van: 'Dry Van',
  reefer: 'Reefer',
  flatbed: 'Flatbed',
}

export const SEVERITY_CLASSES: Record<ExceptionSeverity, string> = {
  low: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40',
  medium: 'text-amber-300 bg-amber-500/20 border-amber-500/40',
  high: 'text-orange-300 bg-orange-500/20 border-orange-500/40',
  critical: 'text-rose-300 bg-rose-500/20 border-rose-500/40',
}

export const SCENARIO_NAMES: Record<ScenarioId, string> = {
  A: 'New Load Dispatch',
  B: 'Brokered Load Lifecycle',
  C: 'Exception Recovery',
  D: 'AI Planning Session',
  E: 'Voice Agent Demo',
}
