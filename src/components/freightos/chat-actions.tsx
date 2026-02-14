import type { ChatMessage as ChatMessageType } from '@/domain/types'
import { useAppStore } from '@/state/app-store'

export function ChatActions({ message }: { message: ChatMessageType }) {
  const { dispatch } = useAppStore()

  if (!message.actions || message.actions.length === 0) {
    return null
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {message.actions.map((action) => (
        <button
          key={action.id}
          type="button"
          className="rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-2 py-1 text-xs text-cyan-100"
          onClick={() => dispatch({ type: 'chat-run-action', payload: action.action })}
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}
