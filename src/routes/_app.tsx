import { Outlet, createFileRoute } from '@tanstack/react-router'
import { BottomTabBar } from '@/components/shell/bottom-tab-bar'
import { ToastContainer } from '@/components/shared/toast'
import { useSimulation } from '@/hooks/use-simulation'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

function AppLayout() {
  useSimulation()
  return (
    <div className="flex h-dvh w-full flex-col bg-freight-bg">
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>
      <BottomTabBar />
      <ToastContainer />
    </div>
  )
}
