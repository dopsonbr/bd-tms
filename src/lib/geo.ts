import type { LatLng } from '@/data/types'

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/** Haversine distance in miles */
export function distanceMiles(a: LatLng, b: LatLng): number {
  const R = 3958.8
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const sinLat = Math.sin(dLat / 2)
  const sinLng = Math.sin(dLng / 2)
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng
  return 2 * R * Math.asin(Math.sqrt(h))
}

/** Interpolate position along a polyline at fraction t (0..1) */
export function interpolatePolyline(
  polyline: Array<LatLng>,
  t: number,
): LatLng {
  if (polyline.length === 0) return { lat: 0, lng: 0 }
  if (polyline.length === 1 || t <= 0) return polyline[0]
  if (t >= 1) return polyline[polyline.length - 1]

  const totalDist = polyline.reduce(
    (sum, p, i) => (i === 0 ? 0 : sum + distanceMiles(polyline[i - 1], p)),
    0,
  )
  const targetDist = totalDist * t
  let traveled = 0

  for (let i = 1; i < polyline.length; i++) {
    const segDist = distanceMiles(polyline[i - 1], polyline[i])
    if (traveled + segDist >= targetDist) {
      const segT = segDist === 0 ? 0 : (targetDist - traveled) / segDist
      return {
        lat:
          polyline[i - 1].lat + (polyline[i].lat - polyline[i - 1].lat) * segT,
        lng:
          polyline[i - 1].lng + (polyline[i].lng - polyline[i - 1].lng) * segT,
      }
    }
    traveled += segDist
  }

  return polyline[polyline.length - 1]
}

/** Bearing from a to b in degrees */
export function bearing(a: LatLng, b: LatLng): number {
  const dLng = toRad(b.lng - a.lng)
  const y = Math.sin(dLng) * Math.cos(toRad(b.lat))
  const x =
    Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) -
    Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(dLng)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}
