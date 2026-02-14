import type { ChatMessage as ChatMessageType } from '@/domain/types'

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const roleClass =
    message.role === 'user'
      ? 'ml-10 bg-cyan-500/20 border-cyan-500/30'
      : message.role === 'system'
        ? 'bg-violet-500/20 border-violet-500/30'
        : 'mr-10 bg-white/[0.04] border-white/10'

  return (
    <article className={`rounded-xl border p-3 text-sm ${roleClass}`}>
      <p className="text-xs uppercase tracking-wide text-slate-400">{message.role}</p>
      <p className="mt-1 text-slate-100">{message.text}</p>
    </article>
  )
}
