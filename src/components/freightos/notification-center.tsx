import { BottomSheet } from './bottom-sheet'
import { SeverityBadge } from './status-badge'
import { useAppStore } from '@/state/app-store'

export function NotificationCenter() {
  const { state, dispatch } = useAppStore()

  return (
    <BottomSheet
      open={state.ui.notificationsOpen}
      title="Notifications"
      onClose={() => dispatch({ type: 'toggle-notifications' })}
    >
      <div className="space-y-2">
        {state.entities.notifications.map((note) => (
          <button
            key={note.id}
            type="button"
            onClick={() => dispatch({ type: 'mark-notification-read', payload: note.id })}
            className={`w-full rounded-xl border px-3 py-2 text-left ${
              note.read ? 'border-white/10 bg-white/[0.02]' : 'border-cyan-500/40 bg-cyan-500/10'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-100">{note.title}</p>
              <SeverityBadge severity={note.severity} />
            </div>
            <p className="mt-1 text-xs text-slate-300">{note.body}</p>
          </button>
        ))}
      </div>
    </BottomSheet>
  )
}
