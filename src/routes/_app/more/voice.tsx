'use client'

import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowLeft,
  Clock,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
} from 'lucide-react'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/more/voice')({
  component: VoiceScreen,
})

function VoiceScreen() {
  const voiceCalls = useAppStore((s) => s.voiceCalls)

  const stats = {
    total: voiceCalls.length,
    completed: voiceCalls.filter((c) => c.outcome === 'completed').length,
    inbound: voiceCalls.filter((c) => c.direction === 'inbound').length,
    outbound: voiceCalls.filter((c) => c.direction === 'outbound').length,
  }

  const outcomeStyle = {
    completed: 'text-freight-success',
    no_answer: 'text-freight-warning',
    voicemail: 'text-freight-accent',
    busy: 'text-freight-critical',
  }

  const outcomeLabel = {
    completed: 'Completed',
    no_answer: 'No Answer',
    voicemail: 'Voicemail',
    busy: 'Busy',
  }

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="sticky top-0 z-10 bg-freight-bg px-4 pb-2 pt-4">
        <div className="flex items-center gap-3">
          <Link
            to="/more"
            className="rounded-full p-1.5 hover:bg-muted active:bg-muted/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold">Voice Agent</h1>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Total', value: stats.total, color: 'text-foreground' },
            {
              label: 'Done',
              value: stats.completed,
              color: 'text-freight-success',
            },
            { label: 'In', value: stats.inbound, color: 'text-freight-accent' },
            {
              label: 'Out',
              value: stats.outbound,
              color: 'text-freight-warning',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white p-3 text-center shadow-sm ring-1 ring-border"
            >
              <p className={cn('text-xl font-bold', stat.color)}>
                {stat.value}
              </p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Demo Call Button */}
        <button className="flex items-center justify-center gap-2 rounded-xl bg-freight-success/10 py-3 text-sm font-semibold text-freight-success transition-colors hover:bg-freight-success/20">
          <Phone className="h-4 w-4" />
          Start Demo Call
        </button>

        {/* Call History */}
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Call History
        </h3>

        {voiceCalls.length === 0 && (
          <div className="py-8 text-center">
            <Phone className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              No calls recorded yet
            </p>
          </div>
        )}

        {voiceCalls.map((call) => (
          <div
            key={call.id}
            className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border"
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full',
                  call.direction === 'inbound'
                    ? 'bg-freight-accent/10'
                    : 'bg-freight-warning/10',
                )}
              >
                {call.direction === 'inbound' ? (
                  <PhoneIncoming className="h-5 w-5 text-freight-accent" />
                ) : (
                  <PhoneOutgoing className="h-5 w-5 text-freight-warning" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold truncate">
                    {call.callerName}
                  </p>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      outcomeStyle[call.outcome],
                    )}
                  >
                    {outcomeLabel[call.outcome]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {call.callerNumber}
                </p>
                <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {Math.floor(call.duration / 60)}:
                    {String(call.duration % 60).padStart(2, '0')}
                  </span>
                  <span>{new Date(call.startTime).toLocaleString()}</span>
                </div>
                {call.summary && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                    {call.summary}
                  </p>
                )}
              </div>
            </div>

            {/* Transcript preview */}
            {call.transcript.length > 0 && (
              <div className="mt-3 rounded-lg bg-muted/50 p-3">
                <p className="text-[10px] font-semibold text-muted-foreground mb-1">
                  Transcript Preview
                </p>
                {call.transcript.slice(0, 3).map((line, i) => (
                  <p key={i} className="text-xs">
                    <span
                      className={cn(
                        'font-semibold',
                        line.speaker === 'agent'
                          ? 'text-freight-ai'
                          : 'text-foreground',
                      )}
                    >
                      {line.speaker === 'agent' ? 'AI' : 'Caller'}:
                    </span>{' '}
                    <span className="text-muted-foreground">{line.text}</span>
                  </p>
                ))}
                {call.transcript.length > 3 && (
                  <p className="mt-1 text-[10px] text-freight-accent">
                    +{call.transcript.length - 3} more lines
                  </p>
                )}
              </div>
            )}

            {/* Actions taken */}
            {call.actions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {call.actions.map((action, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-freight-ai/10 px-2 py-0.5 text-[10px] font-medium text-freight-ai"
                  >
                    {action.action}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
