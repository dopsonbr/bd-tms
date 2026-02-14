import { useState } from 'react'

import { AiPromptChips } from './ai-prompt-chips'
import { ChatActions } from './chat-actions'
import { ChatMessage } from './chat-message'
import { useAppStore } from '@/state/app-store'

export function AiChat() {
  const [input, setInput] = useState('')
  const { state, dispatch } = useAppStore()

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h2 className="text-sm font-semibold">AI Chat</h2>
      <div className="mt-3">
        <AiPromptChips />
      </div>

      <div className="mt-3 space-y-2">
        {state.ai.messages.slice(-8).map((message) => (
          <div key={message.id}>
            <ChatMessage message={message} />
            <ChatActions message={message} />
          </div>
        ))}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          if (!input.trim()) {
            return
          }
          dispatch({ type: 'chat-user-message', payload: input })
          setInput('')
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask AI to plan, dispatch, or resolve..."
          className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-xl bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950">
          Send
        </button>
      </form>
    </section>
  )
}
