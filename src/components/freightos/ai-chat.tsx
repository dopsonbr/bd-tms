'use client'

import * as React from 'react'

import { useNavigate } from '@tanstack/react-router'

import { StatusBadge } from './status-badge'
import type { Driver, Load, Truck } from '@/domain/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/state/app-store'

const defaultPrompts = ['Tomorrow plan', 'Exception triage', 'Dispatch recommendation']

function getAvailableDriverForTruck(truck: Truck, drivers: Array<Driver>): Driver | undefined {
  if (truck.driverId) {
    const assigned = drivers.find((driver) => driver.id === truck.driverId)

    if (assigned && assigned.status === 'available' && !assigned.truckId) {
      return assigned
    }
  }

  return drivers.find((driver) => driver.status === 'available' && !driver.truckId)
}

function pickRecommendedPair(
  loads: Array<Load>,
  trucks: Array<Truck>,
  drivers: Array<Driver>
): { loadId: string; truckId: string } | null {
  const candidateLoads = loads.filter((load) => load.status === 'pending_dispatch')

  if (candidateLoads.length === 0) {
    return null
  }

  const readyCandidate = candidateLoads.find((load) =>
    trucks.some((truck) => truck.status === 'available' && truck.equipment === load.equipment && getAvailableDriverForTruck(truck, drivers))
  )

  if (readyCandidate) {
    const match = trucks.find(
      (truck) =>
        truck.status === 'available' &&
        truck.equipment === readyCandidate.equipment &&
        getAvailableDriverForTruck(truck, drivers)
    )

    if (match) {
      return {
        loadId: readyCandidate.id,
        truckId: match.id,
      }
    }
  }

  const fallbackLoad = candidateLoads[0]
  const fallbackTruck = trucks.find((truck) => truck.status === 'available' && getAvailableDriverForTruck(truck, drivers))

  if (!fallbackTruck) {
    return null
  }

  return {
    loadId: fallbackLoad.id,
    truckId: fallbackTruck.id,
  }
}

function normalizeAction(raw: string): string {
  return raw.trim().toLowerCase()
}

function buildQuickActionReply(quickAction: string): string {
  return `Action requested: ${quickAction}`
}

export function AiChat() {
  const navigate = useNavigate()
  const {
    state: { chatMessages, loads, trucks, drivers },
    actions,
  } = useAppStore()

  const [draft, setDraft] = React.useState('')
  const [busyReplyFor, setBusyReplyFor] = React.useState<string | null>(null)
  const scrollerRef = React.useRef<HTMLDivElement>(null)

  const submitChat = React.useCallback((nextMessage: string) => {
    const trimmed = nextMessage.trim()

    if (!trimmed) {
      return
    }

    actions.sendChat(trimmed)
    setDraft('')
    setBusyReplyFor(trimmed)
    window.setTimeout(() => {
      setBusyReplyFor((pending) => (pending === trimmed ? null : pending))
    }, 250)
  }, [actions])

  const executeQuickAction = React.useCallback(
    (quickAction: string) => {
      const normalized = normalizeAction(quickAction)

      if (normalized === 'show empty trucks') {
        navigate({ to: '/fleet' })
        submitChat(buildQuickActionReply(quickAction))
        return
      }

      if (normalized === 'open exception feed' || normalized === 'open exceptions') {
        navigate({ to: '/' })
        submitChat(buildQuickActionReply(quickAction))
        return
      }

      if (normalized === 'exception triage') {
        navigate({ to: '/' })
        submitChat(buildQuickActionReply(quickAction))
        return
      }

      if (normalized === 'prioritize high margin loads') {
        navigate({ to: '/loads' })
        submitChat(buildQuickActionReply(quickAction))
        return
      }

      if (normalized === 'inject weather event' || normalized === 'inject weather') {
        actions.injectEvent('weather')
        submitChat(buildQuickActionReply(quickAction))
        return
      }

      if (normalized === 'show alternatives') {
        navigate({ to: '/loads' })
        submitChat(buildQuickActionReply(quickAction))
        return
      }

      if (normalized === 'review repositioning' || normalized === 'accept spot recommendations') {
        navigate({ to: '/ai-agent' })
        submitChat(buildQuickActionReply(quickAction))
        return
      }

      if (normalized === 'assign recommended pair' || normalized === 'assign recommendation pair') {
        const recommendation = pickRecommendedPair(loads, trucks, drivers)

        if (!recommendation) {
          submitChat(buildQuickActionReply(quickAction))
          return
        }

        actions.assignLoad(recommendation.loadId, recommendation.truckId)
        submitChat(buildQuickActionReply(quickAction))
        return
      }

      if (normalized === 'voice demo' || normalized === 'open voice demo') {
        navigate({ to: '/ai-agent' })
        submitChat(buildQuickActionReply(quickAction))
        return
      }

      submitChat(quickAction)
    },
    [actions, drivers, loads, navigate, submitChat, trucks]
  )

  React.useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight
    }
  }, [chatMessages])

  return (
    <Card className='freight-panel'>
      <CardHeader className='flex-row items-center justify-between gap-2'>
        <CardTitle className='text-sm font-semibold text-slate-900'>Dispatch AI</CardTitle>
        <StatusBadge status='info' label='Active' />
      </CardHeader>
      <CardContent className='space-y-3'>
        <div
          ref={scrollerRef}
          className='h-72 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/70 p-2'
        >
          {chatMessages.map((message, index) => (
            <div
              key={message.id}
              className={`freight-stagger-item ${
                message.role === 'user'
                  ? 'ml-auto max-w-[90%] rounded-xl rounded-tr-sm bg-sky-600 px-3 py-2 text-xs text-white'
                  : message.role === 'assistant'
                    ? 'max-w-[90%] rounded-xl rounded-tl-sm border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs text-slate-700'
                    : 'mx-auto max-w-[95%] rounded-lg bg-slate-200 px-3 py-1.5 text-center text-[11px] text-slate-600'
              }`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <p>{message.content}</p>
              {message.confidence ? (
                <p className='mt-1 text-[10px] font-semibold text-indigo-600'>Confidence {message.confidence}%</p>
              ) : null}
              {message.reasoning && message.reasoning.length > 0 ? (
                <details className='mt-1 text-[11px]'>
                  <summary className='cursor-pointer font-medium'>Reasoning</summary>
                  <ul className='mt-1 space-y-0.5'>
                    {message.reasoning.map((item) => (
                      <li key={`${message.id}-${item}`}>- {item}</li>
                    ))}
                  </ul>
                </details>
              ) : null}
              {message.quickActions && message.quickActions.length > 0 ? (
                <div className='mt-2 flex flex-wrap gap-1'>
                  {message.quickActions.map((quickAction) => (
                    <Button
                      key={`${message.id}-${quickAction}`}
                      size='xs'
                      variant='ghost'
                      className='h-6 rounded-full border border-sky-200 bg-sky-50 px-2 py-1 text-[10px] text-sky-700'
                      onClick={() => executeQuickAction(quickAction)}
                      disabled={busyReplyFor === quickAction}
                    >
                      {quickAction}
                    </Button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className='flex flex-wrap gap-1.5'>
          {defaultPrompts.map((prompt) => (
            <Button key={prompt} size='xs' variant='outline' onClick={() => submitChat(prompt)}>
              {prompt}
            </Button>
          ))}
        </div>

        <form
          className='flex items-center gap-2'
          onSubmit={(event) => {
            event.preventDefault()
            submitChat(draft)
          }}
        >
          <Input
            placeholder='Ask for dispatch, exceptions, or planning actions'
            value={draft}
            onChange={(event) => setDraft(event.currentTarget.value)}
          />
          <Button type='submit'>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
