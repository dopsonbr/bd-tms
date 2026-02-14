import { MapAdapter } from './map-adapter'
import { useAppStore } from '@/state/app-store'

export function MiniMap() {
  const { state } = useAppStore()
  const activeTrucks = state.entities.trucks.filter((truck) => truck.status === 'assigned').length

  return <MapAdapter title={`${activeTrucks} active trucks in motion`} detail="Clustered by lane demand and ETA risk" />
}
