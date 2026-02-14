import type { ReactNode } from 'react'

export function EntityCard({
  title,
  subtitle,
  right,
  children,
  onClick,
}: {
  title: string
  subtitle: string
  right?: ReactNode
  children?: ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-white/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>
        {right}
      </div>
      {children ? <div className="mt-3">{children}</div> : null}
    </button>
  )
}
