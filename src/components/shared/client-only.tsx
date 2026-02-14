'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export function ClientOnly({
  children,
  fallback,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return fallback ?? null
  return <>{children}</>
}
