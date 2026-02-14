import type { Driver, Truck } from '@/domain/types'

export function DriverPanel({ driver, truck }: { driver?: Driver; truck?: Truck }) {
  if (!driver || !truck) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-400">
        Driver information unavailable.
      </div>
    )
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <h3 className="text-sm font-semibold">Driver Profile</h3>
      <dl className="mt-3 space-y-2 text-sm text-slate-300">
        <div className="flex justify-between">
          <dt>Name</dt>
          <dd>{driver.name}</dd>
        </div>
        <div className="flex justify-between">
          <dt>HOS Remaining</dt>
          <dd>{driver.hosRemainingHours}h</dd>
        </div>
        <div className="flex justify-between">
          <dt>Terminal</dt>
          <dd>{driver.homeTerminal}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Unit</dt>
          <dd>{truck.unitNumber}</dd>
        </div>
      </dl>
    </section>
  )
}
