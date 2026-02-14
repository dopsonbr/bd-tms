import { TabBar } from './tab-bar'

import { Card, CardContent } from '@/components/ui/card'
import { useAppStore } from '@/state/app-store'
import { cn } from '@/lib/utils'

type MotionMode = 'standard' | 'snappy' | 'cinematic'

function formatNow(nowIso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(nowIso))
}

export function AppShell({
  title,
  subtitle,
  motion = 'standard',
  children,
}: {
  title: string
  subtitle?: string
  motion?: MotionMode
  children: React.ReactNode
}) {
  const {
    state: { nowIso },
    derived: { activeScenarioMeta },
  } = useAppStore()

  return (
    <div className="freight-background min-h-screen pb-20">
      <div className="mx-auto max-w-[1024px]">
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 px-4 py-3 backdrop-blur">
          <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
            FreightOS
          </p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-base font-semibold tracking-tight text-slate-900">
                {title}
              </h1>
              <p className="text-xs text-slate-500">
                {subtitle ?? formatNow(nowIso)}
              </p>
            </div>
            <Card className="border-sky-200 bg-sky-50 px-2 py-1">
              <CardContent className="p-0 text-right">
                <p className="text-[10px] font-semibold tracking-wide text-sky-700 uppercase">
                  Scenario
                </p>
                <p className="text-xs font-semibold text-slate-800">
                  {activeScenarioMeta.label}
                </p>
              </CardContent>
            </Card>
          </div>
        </header>

        <main
          className={cn(
            'freight-shell-enter',
            `freight-motion-${motion}`,
            'space-y-4 px-4 py-4',
          )}
        >
          {children}
        </main>
      </div>

      <TabBar />
    </div>
  )
}
