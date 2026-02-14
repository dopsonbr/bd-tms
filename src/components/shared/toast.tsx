'use client'

import { create } from 'zustand'
import { CheckCircle, Info, X, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

type Toast = {
  id: string
  message: string
  type: ToastType
}

type ToastStore = {
  toasts: Array<Toast>
  addToast: (message: string, type: ToastType) => void
  removeToast: (id: string) => void
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type) => {
    const id = Math.random().toString(36).slice(2, 11)
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }))
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }))
    }, 3000)
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}))

export function showToast(message: string, type: ToastType = 'info') {
  useToastStore.getState().addToast(message, type)
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-50 text-green-900 border-green-200',
    iconClassName: 'text-green-600',
  },
  error: {
    icon: XCircle,
    className: 'bg-red-50 text-red-900 border-red-200',
    iconClassName: 'text-red-600',
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 text-blue-900 border-blue-200',
    iconClassName: 'text-blue-600',
  },
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--freight-tab-height)+1rem)] z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => {
        const config = toastConfig[toast.type]
        const Icon = config.icon

        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg',
              config.className,
            )}
            role="alert"
            data-slot="toast"
          >
            <Icon className={cn('size-5 shrink-0', config.iconClassName)} />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
