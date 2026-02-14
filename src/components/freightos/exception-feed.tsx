import { StatusBadge } from './status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useAppStore } from '@/state/app-store'


export function ExceptionFeed() {
  const {
    derived: { unresolvedExceptions },
    actions,
  } = useAppStore()

  return (
    <Card className='freight-panel'>
      <CardHeader>
        <CardTitle className='text-sm font-semibold text-slate-900'>Active Exception Feed</CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        {unresolvedExceptions.slice(0, 4).map((item, index) => (
          <div
            key={item.id}
            className='freight-stagger-item rounded-lg border border-slate-200 bg-white p-3'
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className='flex items-start justify-between gap-2'>
              <div>
                <p className='text-xs font-semibold text-slate-800'>{item.title}</p>
                <p className='text-xs text-slate-600'>{item.description}</p>
                <p className='mt-1 text-[11px] text-slate-500'>AI: {item.recommendedAction}</p>
              </div>
              <StatusBadge status={item.severity} />
            </div>
            <div className='mt-2 flex justify-end'>
              <Button size='xs' variant='outline' onClick={() => actions.resolveException(item.id)}>
                Resolve
              </Button>
            </div>
          </div>
        ))}
        {unresolvedExceptions.length === 0 ? (
          <p className='text-xs text-slate-500'>No unresolved exceptions.</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
