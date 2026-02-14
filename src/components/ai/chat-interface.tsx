'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Mic, Send, Sparkles } from 'lucide-react'
import { useAppStore } from '@/store'
import { processUserMessage } from '@/services/ai-chat'
import { cn } from '@/lib/utils'

const SUGGESTIONS = [
  'Show active exceptions',
  'Find available trucks near ATL',
  'Recommend dispatch for unassigned loads',
  "What's today's revenue?",
]

export function ChatInterface() {
  const chatMessages = useAppStore((s) => s.chatMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [chatMessages])

  useEffect(() => {
    // Watch for new assistant messages to clear typing indicator
    const lastMsg = chatMessages.at(-1)
    if (lastMsg && lastMsg.role === 'assistant') {
      setIsTyping(false)
    }
  }, [chatMessages])

  const handleSend = (text?: string) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    setIsTyping(true)
    processUserMessage(msg)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-freight-ai/15">
          <Sparkles className="h-5 w-5 text-freight-ai" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">FreightOS AI</h2>
          <p className="text-xs text-muted-foreground">
            Planning &amp; Dispatch Assistant
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                msg.role === 'user'
                  ? 'ml-auto bg-freight-accent text-white'
                  : 'mr-auto bg-muted text-foreground',
              )}
            >
              {msg.content}
            </div>
          ))}
          {isTyping && (
            <div className="mr-auto flex items-center gap-2 rounded-2xl bg-muted px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-freight-ai" />
              <span className="text-xs text-muted-foreground">Thinking...</span>
            </div>
          )}
        </div>

        {/* Suggestion chips - show when no messages or few messages */}
        {chatMessages.length <= 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted active:bg-muted/80"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask FreightOS AI..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            className="text-muted-foreground hover:text-foreground"
            aria-label="Voice input"
          >
            <Mic className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
              input.trim()
                ? 'bg-freight-accent text-white'
                : 'bg-muted text-muted-foreground',
            )}
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
