import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useAppStore } from '@/state/app-store'

export function DemoControlsPanel() {
  const { state, scenarioOptions, actions } = useAppStore()

  return (
    <Card className='freight-panel'>
      <CardHeader>
        <CardTitle className='text-sm font-semibold text-slate-900'>Demo Controls</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div>
          <p className='mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase'>Scenario selector</p>
          <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
            {scenarioOptions.map((scenario) => (
              <button
                key={scenario.id}
                type='button'
                className={
                  scenario.id === state.scenarioId
                    ? 'freight-stagger-item rounded-lg border border-sky-300 bg-sky-50 px-2.5 py-2 text-left text-xs'
                    : 'freight-stagger-item rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-left text-xs hover:border-slate-300'
                }
                style={{
                  animationDelay: scenario.id === state.scenarioId ? '80ms' : '120ms',
                }}
                onClick={() => actions.loadScenario(scenario.id)}
              >
                <p className='font-semibold text-slate-800'>{scenario.label}</p>
                <p className='mt-0.5 text-slate-600'>{scenario.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className='mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase'>Time simulator</p>
          <div className='flex flex-wrap gap-2'>
            <Button size='sm' variant='outline' onClick={() => actions.advanceTime(0.25)}>
              +15m
            </Button>
            <Button size='sm' variant='outline' onClick={() => actions.advanceTime(1)}>
              +1h
            </Button>
            <Button size='sm' variant='outline' onClick={() => actions.advanceTime(4)}>
              +4h
            </Button>
          </div>
        </div>

        <div>
          <p className='mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase'>Event injector</p>
          <div className='flex flex-wrap gap-2'>
            <Button size='sm' variant='outline' onClick={() => actions.injectEvent('breakdown')}>
              Breakdown
            </Button>
            <Button size='sm' variant='outline' onClick={() => actions.injectEvent('weather')}>
              Weather
            </Button>
            <Button size='sm' variant='outline' onClick={() => actions.injectEvent('tender')}>
              New Tender
            </Button>
            <Button size='sm' variant='outline' onClick={() => actions.injectEvent('incoming-call')}>
              Incoming Call
            </Button>
          </div>
        </div>

        <div className='pt-1'>
          <Button variant='destructive' onClick={actions.resetDemo}>
            Reset to baseline
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
