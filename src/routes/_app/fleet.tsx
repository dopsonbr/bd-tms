'use client'

import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/fleet')({
  component: FleetLayout,
})

function FleetLayout() {
  return <Outlet />
}
