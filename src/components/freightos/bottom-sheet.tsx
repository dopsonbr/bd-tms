import type { ReactNode } from 'react'

export function BottomSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 p-3" role="dialog" aria-modal="true">
      <div className="w-full rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
          <button type="button" className="text-xs text-slate-400" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
