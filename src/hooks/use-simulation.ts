import { useEffect } from 'react'
import { useAppStore } from '@/store'

export function useSimulation() {
  const isPlaying = useAppStore((s) => s.isPlaying)
  const playbackSpeed = useAppStore((s) => s.playbackSpeed)
  const advanceTime = useAppStore((s) => s.advanceTime)

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      advanceTime(playbackSpeed)
    }, 1000)
    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed, advanceTime])
}
