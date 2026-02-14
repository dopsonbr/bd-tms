'use client'

import { CircleMarker, MapContainer, TileLayer } from 'react-leaflet'
import type { TruckStatus } from '@/data/types'
import { useAppStore } from '@/store'
import 'leaflet/dist/leaflet.css'

const MAP_CENTER: [number, number] = [33.5, -84.5]
const MAP_DEFAULT_ZOOM = 6

const STATUS_COLORS: Record<TruckStatus, string> = {
  en_route: '#2D7FF9',
  empty: '#8E99A4',
  at_pickup: '#F5A623',
  at_delivery: '#00B67A',
  out_of_service: '#E74C3C',
  maintenance: '#9CA3AF',
}

export default function MiniMapInner() {
  const { trucks } = useAppStore()

  return (
    <div className="overflow-hidden rounded-xl" style={{ height: '200px' }}>
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_DEFAULT_ZOOM}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Object.values(trucks).map((truck) => (
          <CircleMarker
            key={truck.id}
            center={[truck.position.lat, truck.position.lng]}
            radius={6}
            fillColor={STATUS_COLORS[truck.status]}
            fillOpacity={0.8}
            color="#fff"
            weight={2}
          />
        ))}
      </MapContainer>
    </div>
  )
}
