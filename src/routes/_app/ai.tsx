'use client'

import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { ChatInterface } from '@/components/ai/chat-interface'
import { useAppStore } from '@/store'
import { getInitialMessages } from '@/services/ai-chat'

export const Route = createFileRoute('/_app/ai')({
  component: AiScreen,
})

function AiScreen() {
  const chatMessages = useAppStore((s) => s.chatMessages)
  const addChatMessage = useAppStore((s) => s.addChatMessage)
  const initialized = useRef(false)

  useEffect(() => {
    if (chatMessages.length === 0 && !initialized.current) {
      initialized.current = true
      const initMsgs = getInitialMessages()
      for (const msg of initMsgs) {
        addChatMessage({ role: msg.role, content: msg.content })
      }
    }
  }, [])

  return (
    <div className="flex h-full flex-col">
      <ChatInterface />
    </div>
  )
}
