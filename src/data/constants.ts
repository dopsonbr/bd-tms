import type {
  EquipmentType,
  ExceptionSeverity,
  LatLng,
  LoadStatus,
  TruckStatus,
} from './types'

export const TRUCK_STATUS_COLOR: Record<TruckStatus, string> = {
  en_route: 'bg-freight-accent text-white',
  at_pickup: 'bg-freight-warning text-black',
  at_delivery: 'bg-freight-success text-white',
  empty: 'bg-freight-idle text-white',
  out_of_service: 'bg-freight-critical text-white',
  maintenance: 'bg-muted text-muted-foreground',
}

export const TRUCK_STATUS_LABEL: Record<TruckStatus, string> = {
  en_route: 'En Route',
  at_pickup: 'At Pickup',
  at_delivery: 'At Delivery',
  empty: 'Empty',
  out_of_service: 'Out of Service',
  maintenance: 'Maintenance',
}

export const LOAD_STATUS_COLOR: Record<LoadStatus, string> = {
  tendered: 'bg-muted text-muted-foreground',
  accepted: 'bg-freight-accent/15 text-freight-accent',
  dispatched: 'bg-freight-accent text-white',
  en_route_pickup: 'bg-freight-warning text-black',
  at_pickup: 'bg-freight-warning text-black',
  in_transit: 'bg-freight-accent text-white',
  at_delivery: 'bg-freight-success text-white',
  delivered: 'bg-freight-success text-white',
  invoiced: 'bg-freight-ai text-white',
  paid: 'bg-freight-success text-white',
  cancelled: 'bg-freight-critical text-white',
}

export const LOAD_STATUS_LABEL: Record<LoadStatus, string> = {
  tendered: 'Tendered',
  accepted: 'Accepted',
  dispatched: 'Dispatched',
  en_route_pickup: 'En Route Pickup',
  at_pickup: 'At Pickup',
  in_transit: 'In Transit',
  at_delivery: 'At Delivery',
  delivered: 'Delivered',
  invoiced: 'Invoiced',
  paid: 'Paid',
  cancelled: 'Cancelled',
}

export const LOAD_LIFECYCLE_ORDER: Array<LoadStatus> = [
  'tendered',
  'accepted',
  'dispatched',
  'en_route_pickup',
  'at_pickup',
  'in_transit',
  'at_delivery',
  'delivered',
  'invoiced',
  'paid',
]

export const SEVERITY_COLOR: Record<ExceptionSeverity, string> = {
  critical: 'bg-freight-critical text-white',
  warning: 'bg-freight-warning text-black',
  info: 'bg-freight-accent/15 text-freight-accent',
}

export const EQUIPMENT_LABEL: Record<EquipmentType, string> = {
  dry_van: 'Dry Van',
  reefer: 'Reefer',
  flatbed: 'Flatbed',
  power_only: 'Power Only',
}

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

export const NAV_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  { id: 'loads', label: 'Loads', icon: 'Package', path: '/loads' },
  { id: 'fleet', label: 'Fleet', icon: 'Truck', path: '/fleet' },
  { id: 'ai', label: 'AI', icon: 'Sparkles', path: '/ai' },
  { id: 'more', label: 'More', icon: 'Menu', path: '/more' },
] as const

export const QUICK_ACTIONS = [
  { id: 'new_load', label: 'New Load', icon: 'Plus', color: 'freight-accent' },
  {
    id: 'dispatch_ai',
    label: 'AI Dispatch',
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
    icon: 'Search',
    color: 'freight-warning',
  },
] as const

export const MARGIN_THRESHOLDS = { good: 15, warning: 8 } as const
