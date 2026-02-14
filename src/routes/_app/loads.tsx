'use client'

import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/loads')({
  component: LoadsLayout,
})

function LoadsLayout() {
  return <Outlet />
}
