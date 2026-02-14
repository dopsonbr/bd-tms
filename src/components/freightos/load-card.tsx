import { EntityCard } from './entity-card'
import type { Load } from '@/domain/types'
import { Button } from '@/components/ui/button'


function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

interface LoadCardProps {
  load: Load
  onAssign?: () => void
  onOpen?: () => void
}

export function LoadCard({ load, onAssign, onOpen }: LoadCardProps) {
  return (
    <EntityCard
      id={load.reference}
      title={`${load.origin.city}, ${load.origin.state} -> ${load.destination.city}, ${load.destination.state}`}
      subtitle={`${load.shipper} | ${load.equipment.replace('_', ' ')}`}
      status={load.status}
      details={[
        {
          label: 'Revenue',
          value: formatCurrency(load.financials.revenue),
        },
        {
          label: 'Margin',
          value: `${formatCurrency(load.financials.margin)} (${load.financials.marginPercent}%)`,
        },
        {
          label: 'Mode',
          value: load.brokered ? 'Brokered' : 'Carrier',
        },
      ]}
      suggestion={load.aiRecommendation}
      onClick={onOpen}
      action={
        onAssign ? (
          <Button
            size='sm'
            onClick={(event) => {
              event.stopPropagation()
              onAssign()
            }}
          >
            Assign
          </Button>
        ) : null
      }
    />
  )
}
