'use client'

import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
} from 'react-leaflet'
import type { TruckStatus } from '@/data/types'
import { useAppStore } from '@/store'
import { EQUIPMENT_LABEL } from '@/data/constants'
import 'leaflet/dist/leaflet.css'

interface FleetMapInnerProps {
  statusFilter: TruckStatus | null
}

export default function FleetMapInner({ statusFilter }: FleetMapInnerProps) {
  const trucks = useAppStore((state) => state.trucks)
  const loads = useAppStore((state) => state.loads)
  const drivers = useAppStore((state) => state.drivers)

  const allTrucks = Object.values(trucks)
  const filteredTrucks = statusFilter
    ? allTrucks.filter((t) => t.status === statusFilter)
    : allTrucks

  const center: [number, number] =
    filteredTrucks.length > 0
      ? [
          filteredTrucks.reduce((sum, t) => sum + t.position.lat, 0) /
            filteredTrucks.length,
          filteredTrucks.reduce((sum, t) => sum + t.position.lng, 0) /
            filteredTrucks.length,
        ]
      : [33.5, -84.5]

  return (
    <MapContainer
      center={center}
      zoom={6}
      className="h-full w-full"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {filteredTrucks.map((truck) => {
        const driver = Object.values(drivers).find(
          (d) => d.id === truck.driverId,
        )
        const activeLoad = truck.currentLoadId
          ? loads[truck.currentLoadId]
          : undefined

        return (
          <div key={truck.id}>
            <CircleMarker
              center={[truck.position.lat, truck.position.lng]}
              radius={8}
              fillColor="#3b82f6"
              color="#fff"
              weight={2}
              fillOpacity={0.8}
            >
              <Popup>
                <div className="space-y-1 min-w-[200px]">
                  <div className="font-bold text-base">{truck.truckNumber}</div>
                  <div className="text-sm text-muted-foreground">
                    {EQUIPMENT_LABEL[truck.equipmentType]}
                  </div>
                  <div className="text-sm">{driver?.name || 'Unassigned'}</div>
                  {activeLoad && (
                    <div className="text-sm font-medium">
                      {activeLoad.origin.city} &rarr;{' '}
                      {activeLoad.destination.city}
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>

            {activeLoad && truck.status === 'en_route' && (
              <Polyline
                positions={[
                  [
                    activeLoad.origin.position.lat,
                    activeLoad.origin.position.lng,
                  ],
                  [truck.position.lat, truck.position.lng],
                  [
                    activeLoad.destination.position.lat,
                    activeLoad.destination.position.lng,
                  ],
                ]}
                color="#3b82f6"
                weight={2}
                opacity={0.6}
                dashArray="5, 10"
              />
            )}
          </div>
        )
      })}
    </MapContainer>
  )
}
