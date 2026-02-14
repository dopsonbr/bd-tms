import { cn } from '@/lib/utils'

type SectionHeaderProps = {
  title: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function SectionHeader({
  title,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn('flex items-center justify-between', className)}
      data-slot="section-header"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm font-medium text-freight-accent hover:underline"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
