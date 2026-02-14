'use client'

import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/more')({
  component: MoreLayout,
})

function MoreLayout() {
  return <Outlet />
}
