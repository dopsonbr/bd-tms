import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

import { AiChat } from '@/components/freightos/ai-chat'
import { AiReasoningPanel } from '@/components/freightos/ai-reasoning-panel'
import { PlanningAssistant } from '@/components/freightos/planning-assistant'
import { TomorrowPlan } from '@/components/freightos/tomorrow-plan'

export const Route = createFileRoute('/ai-agent')({ component: AiAgentRoute })

function AiAgentRoute() {
  return (
    <div className="space-y-3">
      <AiChat />
      <AiReasoningPanel />
      <PlanningAssistant />
      <TomorrowPlan />
      <Link to="/ai-agent/voice" className="inline-flex rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-200">
        Open Voice Dashboard
      </Link>
      <Outlet />
    </div>
  )
}
