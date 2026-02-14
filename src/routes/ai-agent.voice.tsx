import { createFileRoute } from '@tanstack/react-router'

import { VoiceCallDemo } from '@/components/freightos/voice-call-demo'
import { VoiceDashboard } from '@/components/freightos/voice-dashboard'

export const Route = createFileRoute('/ai-agent/voice')({ component: VoiceRoute })

function VoiceRoute() {
  return (
    <div className="space-y-3">
      <VoiceDashboard />
      <VoiceCallDemo />
    </div>
  )
}
