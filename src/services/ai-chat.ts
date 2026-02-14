import type { ChatMessage } from '@/data/types'
import { useAppStore } from '@/store'

const RESPONSES: Record<string, string> = {
  load: 'I found several loads matching your criteria. The highest-priority is LD-4512, a dry van load from Atlanta to Memphis with a $2.85/mi rate. It needs pickup by 14:00 today.',
  truck:
    'There are 12 available trucks in the network. T-215 is closest to Atlanta hub with 8.2 hours of drive time remaining. T-223 and T-228 are also available nearby.',
  dispatch:
    'Based on my analysis, I recommend dispatching T-215 to LD-4512. The deadhead is only 18 miles, the driver has plenty of HOS, and the equipment matches. Confidence: 92%.',
  driver:
    'Driver Mike Torres (DRV-001) has a 95 performance score, 7.8 hours of drive time remaining, and is certified for dry van and reefer. He prefers the ATL-MEM lane.',
  exception:
    'There are 4 active exceptions requiring attention. The most critical is a late pickup risk for T-217 on I-75 — I suggest extending the pickup window by 1 hour.',
  revenue:
    "Today's revenue is $42.3K across 8 delivered loads. Average margin is 14.2%. Brokered loads are performing 3% above target at 16.1% margin.",
  weather:
    'Winter storm warning along the I-40 corridor from Nashville to Memphis. 3 loads may be affected. I recommend rerouting via I-65 South to I-22 for loads LD-4525 and LD-4530.',
  help: 'I can help you with: finding loads, checking truck availability, dispatch recommendations, driver HOS status, exception management, revenue analysis, and weather impacts. What would you like to know?',
}

function findResponse(input: string): string {
  const lower = input.toLowerCase()

  for (const [key, response] of Object.entries(RESPONSES)) {
    if (lower.includes(key)) return response
  }

  if (
    lower.includes('how') ||
    lower.includes('what') ||
    lower.includes('status')
  ) {
    return 'Currently monitoring 45 trucks, 80 loads, and 30 drivers across the Southeast network. 4 exceptions need attention. Would you like me to drill into any specific area?'
  }

  return 'I understand your question. Let me analyze the current fleet data. Based on the Southeast network status, here are my recommendations: focus on the 4 active exceptions first, then review the 7 unassigned loads for dispatch optimization. Shall I prioritize any specific area?'
}

export function processUserMessage(content: string) {
  const store = useAppStore.getState()

  store.addChatMessage({ role: 'user', content })

  // Simulate AI thinking delay
  setTimeout(
    () => {
      const response = findResponse(content)
      store.addChatMessage({
        role: 'assistant',
        content: response,
      })
    },
    800 + Math.random() * 700,
  )
}

export function getInitialMessages(): Array<ChatMessage> {
  return [
    {
      id: 'init-1',
      role: 'assistant',
      content:
        "Good morning! I'm your FreightOS AI assistant. I'm monitoring 45 trucks and 80 loads across the Southeast. 4 exceptions need your attention. How can I help?",
      timestamp: new Date().toISOString(),
    },
  ]
}
