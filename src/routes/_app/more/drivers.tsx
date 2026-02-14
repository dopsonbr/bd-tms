'use client'

import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/more/drivers')({
  component: DriversLayout,
})

function DriversLayout() {
  return <Outlet />
}
