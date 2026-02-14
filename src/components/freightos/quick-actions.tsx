import { Link } from '@tanstack/react-router'

export function QuickActions() {
  const actions = [
    { label: 'Dispatch Board', to: '/loads' },
    { label: 'Fleet Health', to: '/fleet' },
    { label: 'AI Plan', to: '/ai-agent' },
    { label: 'Demo Controls', to: '/more/demo-controls' },
  ]

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Quick Actions</p>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-200"
          >
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
