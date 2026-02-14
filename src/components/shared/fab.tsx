'use client'

import { useState } from 'react'
import { Package, Phone, Plus, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

type FabAction = 'new-load' | 'ask-ai' | 'demo-call'

type FloatingActionButtonProps = {
  onAction: (actionId: FabAction) => void
}

const actions = [
  { id: 'new-load' as const, label: 'New Load', icon: Package },
  { id: 'ask-ai' as const, label: 'Ask AI', icon: Sparkles },
  { id: 'demo-call' as const, label: 'Demo Call', icon: Phone },
]

export function FloatingActionButton({ onAction }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleAction = (actionId: FabAction) => {
    setIsOpen(false)
    onAction(actionId)
  }

  return (
    <div className="fixed bottom-[calc(var(--freight-tab-height)+1rem)] right-4 z-50">
      {/* Speed dial options */}
      <div
        className={cn(
          'mb-3 flex flex-col gap-3 transition-all duration-300',
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        )}
      >
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <div
              key={action.id}
              className="flex items-center justify-end gap-3"
              style={{
                transform: isOpen
                  ? 'translateY(0) scale(1)'
                  : 'translateY(20px) scale(0.8)',
                transition: `all 300ms cubic-bezier(0.4, 0, 0.2, 1) ${index * 50}ms`,
              }}
            >
              <span className="rounded bg-card px-3 py-1.5 text-sm font-medium shadow-lg">
                {action.label}
              </span>
              <button
                onClick={() => handleAction(action.id)}
                className="flex size-12 items-center justify-center rounded-full bg-freight-accent text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
                aria-label={action.label}
              >
                <Icon className="size-5" />
              </button>
            </div>
          )
        })}
      </div>

      {/* Main FAB button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex size-14 items-center justify-center rounded-full bg-freight-navy text-white shadow-lg transition-all hover:scale-110 active:scale-95"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <Plus
          className={cn(
            'size-6 transition-transform duration-300',
            isOpen && 'rotate-45',
          )}
        />
      </button>
    </div>
  )
}
