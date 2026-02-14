import { createFileRoute } from '@tanstack/react-router'

import { voiceScripts } from '@/ai/voice-simulator'
import { AiChat } from '@/components/freightos/ai-chat'
import { AppShell } from '@/components/freightos/app-shell'
import { VoiceCallDemo } from '@/components/freightos/voice-call-demo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/state/app-store'

export const Route = createFileRoute('/ai-agent')({
  component: AiAgentPage,
})

function AiAgentPage() {
  const {
    derived: { availableTrucks, pendingLoads },
    actions,
  } = useAppStore()

  const topReposition = availableTrucks.slice(0, 3)

  return (
    <AppShell
      title="AI Agent"
      subtitle="Scenario-aware planning and dispatch reasoning"
      motion="standard"
    >
      <AiChat />

      <Card className="freight-panel freight-stagger-item">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-900">
            Tomorrow Planning Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-slate-700">
          <p>
            Tomorrow preview: {pendingLoads.length} pending loads and{' '}
            {availableTrucks.length} immediately available trucks.
          </p>
          <div className="space-y-1">
            {topReposition.map((truck) => (
              <p
                key={truck.id}
                className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-2"
              >
                Reposition {truck.unit} from {truck.city}, {truck.state} to
                Atlanta morning relay lane.
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="freight-panel freight-stagger-item">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-900">
            Voice Script Library
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {Object.values(voiceScripts).map((script) => (
            <Button
              key={script.id}
              size="sm"
              variant="outline"
              onClick={() => actions.setVoiceScript(script.id)}
            >
              {script.title}
            </Button>
          ))}
        </CardContent>
      </Card>

      <VoiceCallDemo />
    </AppShell>
  )
}
