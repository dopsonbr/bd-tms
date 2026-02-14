'use client'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { SegmentControl } from '@/components/loads/segment-control'
import { LoadList } from '@/components/loads/load-list'
import { FloatingActionButton } from '@/components/shared/fab'

export const Route = createFileRoute('/_app/loads/')({
  component: LoadsScreen,
})

type Segment = 'active' | 'available' | 'completed'

function LoadsScreen() {
  const navigate = useNavigate()
  const [segment, setSegment] = useState<Segment>('active')

  return (
    <div className="flex flex-col h-screen bg-freight-bg">
      {/* Header */}
      <div className="bg-white border-b border-freight-navy/10 px-4 py-4 space-y-4">
        <h1 className="text-2xl font-bold text-freight-navy">Loads</h1>
        <div className="flex justify-center">
          <SegmentControl value={segment} onChange={setSegment} />
        </div>
      </div>

      {/* Content */}
      <LoadList
        segment={segment}
        onLoadClick={(loadId) =>
          navigate({ to: '/loads/$loadId', params: { loadId } })
        }
      />

      {/* FAB */}
      <FloatingActionButton
        onAction={(actionId) => console.log('FAB action:', actionId)}
      />
    </div>
  )
}
