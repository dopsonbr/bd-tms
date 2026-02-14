import { StatusBadge } from './status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useAppStore } from '@/state/app-store'


function project(lat: number, lng: number): { left: string; top: string } {
  const minLat = 29
  const maxLat = 37
  const minLng = -91
  const maxLng = -79

  const x = ((lng - minLng) / (maxLng - minLng)) * 100
  const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100

  return {
    left: `${Math.max(4, Math.min(96, x))}%`,
    top: `${Math.max(6, Math.min(94, y))}%`,
  }
}

export function FleetMapPanel({ compact = false }: { compact?: boolean }) {
  const {
    state: { trucks },
  } = useAppStore()

  const visible = trucks.slice(0, compact ? 18 : 30)
  const statusBuckets = trucks.reduce(
    (acc, truck) => {
      acc[truck.status] += 1
      return acc
    },
    {
      available: 0,
      en_route: 0,
      loading: 0,
      maintenance: 0,
      rest: 0,
      driving: 0,
    }
  )

  const summaryItems = [
    { label: 'Available', value: statusBuckets.available },
    { label: 'En Route', value: statusBuckets.en_route },
    { label: 'Loading', value: statusBuckets.loading },
    { label: 'Maintenance', value: statusBuckets.maintenance },
  ]
  const utilization = Math.round((1 - statusBuckets.available / Math.max(1, trucks.length)) * 100)

  return (
    <Card className='freight-panel'>
      <CardHeader>
        <CardTitle className='text-sm font-semibold text-slate-900'>Fleet Visibility</CardTitle>
        <p className='text-xs text-slate-500'>Utilization {utilization}% with {trucks.length} active assets</p>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
          {summaryItems.map((item) => (
            <div key={item.label} className='rounded-lg border border-slate-200 bg-white px-2 py-1 text-center'>
              <p className='text-[11px] font-semibold text-slate-500'>{item.label}</p>
              <p className='text-sm font-semibold text-slate-900'>{item.value}</p>
            </div>
          ))}
        </div>
        <div className={compact ? 'h-40 rounded-xl border border-slate-200' : 'h-56 rounded-xl border border-slate-200'}>
          <div className='fleet-map relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100'>
            {visible.map((truck) => {
              const position = project(truck.lat, truck.lng)

              return (
                <span
                  key={truck.id}
                  className='freight-stagger-item absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-600 ring-2 ring-white'
                  style={{
                    ...position,
                    animationDelay: `${Math.min(
                      480,
                      parseInt(truck.id.replace('truck-', ''), 10) % 4
                    ) * 65}ms`,
                  }}
                  title={`${truck.unit} - ${truck.city}`}
                />
              )
            })}
          </div>
        </div>

        <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
          {trucks.slice(0, compact ? 4 : 6).map((truck) => (
            <div key={truck.id} className='freight-stagger-item rounded-lg border border-slate-200 bg-white px-2.5 py-2'>
              <p className='text-xs font-semibold text-slate-800'>{truck.unit}</p>
              <p className='text-[11px] text-slate-500'>
                {truck.city}, {truck.state}
              </p>
              <div className='mt-1'>
                <StatusBadge status={truck.status} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
