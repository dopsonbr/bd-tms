'use client'

import * as React from 'react'

import { voiceScripts } from '@/ai/voice-simulator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useAppStore } from '@/state/app-store'

const playbackSpeeds = [1, 1.5, 2] as const

export function VoiceCallDemo() {
  const {
    state: { activeVoiceScriptId },
  } = useAppStore()

  const script = voiceScripts[activeVoiceScriptId] ?? voiceScripts['shipper-status']

  const [playing, setPlaying] = React.useState(false)
  const [elapsed, setElapsed] = React.useState(0)
  const [speedIndex, setSpeedIndex] = React.useState(0)

  React.useEffect(() => {
    setElapsed(0)
    setPlaying(false)
  }, [script.id])

  React.useEffect(() => {
    if (!playing) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setElapsed((previous) => {
        const next = previous + 0.5 * playbackSpeeds[speedIndex]

        if (next >= script.durationSeconds) {
          window.clearInterval(timer)
          setPlaying(false)
          return script.durationSeconds
        }

        return next
      })
    }, 500)

    return () => {
      window.clearInterval(timer)
    }
  }, [playing, speedIndex, script.durationSeconds])

  const visibleFrames = script.frames.filter((frame) => frame.atSecond <= elapsed)
  const progressPercent = Math.min(100, (elapsed / script.durationSeconds) * 100)

  return (
    <Card className='overflow-hidden border-slate-700 bg-slate-900 text-slate-100'>
      <CardHeader>
        <CardTitle className='text-sm font-semibold text-slate-100'>{script.title}</CardTitle>
        <p className='text-xs text-slate-300'>
          {script.caller} | {script.topic}
        </p>
      </CardHeader>
      <CardContent className='space-y-3'>
        <p className='text-[11px] text-slate-300'>Live transcript replay with deterministic timing</p>
        <div className='rounded-lg border border-slate-700 bg-slate-950/70 p-2'>
          <div className='h-1.5 w-full rounded-full bg-slate-700'>
            <span
              className='block h-full rounded-full bg-sky-400 transition-all duration-300'
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className='mt-1 text-[11px] text-slate-400'>Call time {elapsed.toFixed(1)}s</p>
          <div className='mt-2 h-48 space-y-2 overflow-y-auto'>
            {visibleFrames.map((frame, index) => (
              <div
                key={`${frame.atSecond}-${index}`}
                className={
                  frame.speaker === 'caller'
                    ? 'rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-2 text-xs'
                    : frame.speaker === 'agent'
                      ? 'rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-2.5 py-2 text-xs'
                      : 'rounded-lg border border-cyan-600/30 bg-cyan-500/10 px-2.5 py-2 text-xs text-cyan-200'
                }
              >
                <p className='mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300'>
                  {frame.speaker}
                </p>
                <p>{frame.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Button variant='outline' onClick={() => setPlaying((previous) => !previous)}>
            {playing ? 'Pause' : 'Play'}
          </Button>
          <Button
            variant='outline'
            onClick={() => setSpeedIndex((previous) => (previous + 1) % playbackSpeeds.length)}
          >
            Speed {playbackSpeeds[speedIndex]}x
          </Button>
          <Button
            variant='outline'
            onClick={() => setElapsed((previous) => Math.min(script.durationSeconds, previous + 6))}
          >
            Skip +6s
          </Button>
          <Button
            variant='outline'
            onClick={() => {
              setElapsed(script.durationSeconds)
              setPlaying(false)
            }}
          >
            End Call
          </Button>
          <Button
            variant='outline'
            onClick={() => {
              setElapsed(0)
              setPlaying(false)
            }}
          >
            Reset
          </Button>
        </div>

        {elapsed >= script.durationSeconds ? (
          <div className='rounded-lg border border-emerald-600/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200'>
            Summary: {script.outcome}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
