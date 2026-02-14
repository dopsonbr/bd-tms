'use client'

import * as React from 'react'

import type {
  AppState,
  ExceptionEvent,
  InjectedEventType,
  LoadStatus,
  ScenarioId,
  ScenarioMeta,
  SimEvent,
} from '@/domain/types'
import { simulateChatReply } from '@/ai/chat-simulator'
import { defaultVoiceScriptId } from '@/ai/voice-simulator'
import { buildSeedState, createScenarioState, getScenarioMeta } from '@/data/seed/build-seed'

interface DerivedState {
  activeLoads: AppState['loads']
  pendingLoads: AppState['loads']
  completedLoads: AppState['loads']
  brokeredLoads: AppState['loads']
  availableTrucks: AppState['trucks']
  unresolvedExceptions: AppState['exceptions']
  upcomingEvents: AppState['eventQueue']
  activeScenarioMeta: ScenarioMeta
  kpis: {
    activeLoads: number
    availableTrucks: number
    unresolvedExceptions: number
    todayRevenue: number
    todayMargin: number
    activeBrokeredLoads: number
  }
}

interface StoreActions {
  assignLoad: (loadId: string, truckId: string) => void
  resolveException: (exceptionId: string) => void
  loadScenario: (scenarioId: ScenarioId) => void
  advanceTime: (hours: number) => void
  injectEvent: (eventType: InjectedEventType) => void
  resetDemo: () => void
  sendChat: (message: string) => void
  setVoiceScript: (scriptId: string) => void
  advanceLoadLifecycle: (loadId: string) => void
}

interface AppStoreValue {
  state: AppState
  derived: DerivedState
  scenarioOptions: Array<ScenarioMeta>
  actions: StoreActions
}

const AppStoreContext = React.createContext<AppStoreValue | null>(null)

const scenarioOptions = getScenarioMeta()

const loadLifecycle: Array<LoadStatus> = [
  'tendered',
  'pending_dispatch',
  'dispatched',
  'at_pickup',
  'in_transit',
  'at_delivery',
  'delivered',
  'invoiced',
]

function nextLoadStatus(status: LoadStatus): LoadStatus | null {
  const index = loadLifecycle.indexOf(status)

  if (index < 0 || index === loadLifecycle.length - 1) {
    return null
  }

  return loadLifecycle[index + 1]
}

function pickAvailableTruck(
  state: AppState,
  requestedEquipment?: string,
  requireEquipmentMatch = false
): AppState['trucks'][number] | undefined {
  const available = state.trucks.filter((truck) => truck.status === 'available')

  if (!requestedEquipment) {
    return available[0]
  }

  const compatible = available.find((truck) => truck.equipment === requestedEquipment)

  if (compatible) {
    return compatible
  }

  return requireEquipmentMatch ? undefined : available[0]
}

function findAvailableDriverForTruck(
  state: AppState,
  preferredDriverId?: string
): AppState['drivers'][number] | undefined {
  if (preferredDriverId) {
    const preferred = state.drivers.find((driver) => driver.id === preferredDriverId)

    if (
      preferred &&
      preferred.status === 'available' &&
      !preferred.truckId
    ) {
      return preferred
    }
  }

  return state.drivers.find((driver) => driver.status === 'available' && !driver.truckId)
}

function patchLoad(state: AppState, loadId: string, patch: Partial<AppState['loads'][number]>) {
  return state.loads.map((load) => (load.id === loadId ? { ...load, ...patch } : load))
}

function stableHash(input: string): number {
  let hash = 0

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) % 100000
  }

  return hash
}

function createNotification(
  title: string,
  nowIso: string,
  level: ExceptionEvent['severity']
): AppState['notifications'][number] {
  return {
    id: `note-${Date.parse(nowIso)}-${stableHash(title)}`,
    title,
    level,
    createdAtIso: nowIso,
    read: false,
  }
}

function applyDueEvents(state: AppState, dueEvents: Array<SimEvent>): AppState {
  let next = state

  dueEvents.forEach((event) => {
    if (event.kind === 'eta-slip') {
      const impactedLoad = next.loads.find((load) => load.status === 'in_transit')

      if (impactedLoad) {
        next = {
          ...next,
          exceptions: [
            {
              id: `exception-${event.id}`,
              loadId: impactedLoad.id,
              severity: 'warning',
              title: 'ETA slip detected',
              description: 'Traffic conditions caused a 35-minute ETA slip.',
              createdAtIso: next.nowIso,
              resolved: false,
              recommendedAction: 'Notify customer and monitor lane congestion',
            },
            ...next.exceptions,
          ],
        }
      }
    }

    if (event.kind === 'new-tender') {
      const tendered = next.loads.find((load) => load.status === 'tendered')

      if (tendered) {
        next = {
          ...next,
          loads: next.loads.map((load) =>
            load.id === tendered.id
              ? {
                  ...load,
                  status: 'pending_dispatch',
                  aiRecommendation: 'High-priority tender. Recommend dispatch within 20 minutes.',
                }
              : load
          ),
          notifications: [
            createNotification('New tender promoted to pending dispatch queue', next.nowIso, 'info'),
            ...next.notifications,
          ],
        }
      }
    }

    if (event.kind === 'hos-warning') {
      const driver = next.drivers.find((item) => item.hosRemainingHours < 3)

      if (driver) {
        next = {
          ...next,
          exceptions: [
            {
              id: `exception-${event.id}`,
              loadId: next.loads[0]?.id ?? 'load-1',
              severity: 'warning',
              title: 'Driver HOS approaching limit',
              description: `${driver.name} is projected below legal threshold before next stop.`,
              createdAtIso: next.nowIso,
              resolved: false,
              recommendedAction: 'Evaluate relay or reschedule stop window',
            },
            ...next.exceptions,
          ],
        }
      }
    }

    if (event.kind === 'weather') {
      next = {
        ...next,
        exceptions: [
          {
            id: `exception-${event.id}`,
            loadId: next.loads[1]?.id ?? 'load-2',
            severity: 'critical',
            title: 'Weather disruption',
            description: 'Storm system in central Alabama impacts three active routes.',
            createdAtIso: next.nowIso,
            resolved: false,
            recommendedAction: 'Trigger customer advisory and evaluate reroute options',
          },
          ...next.exceptions,
        ],
        notifications: [
          createNotification('Weather alert injected into active network', next.nowIso, 'critical'),
          ...next.notifications,
        ],
      }
    }
  })

  return next
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AppState>(() => buildSeedState())

  const assignLoad = React.useCallback((loadId: string, truckId: string) => {
    setState((previous) => {
      const truck = previous.trucks.find((item) => item.id === truckId)
      const load = previous.loads.find((item) => item.id === loadId)

      if (!truck || !load || truck.status !== 'available' || load.status !== 'pending_dispatch') {
        return previous
      }

      if (truck.equipment !== load.equipment) {
        return previous
      }

      const assignedDriver = findAvailableDriverForTruck(previous, truck.driverId)

      if (!assignedDriver) {
        return previous
      }

      const updatedTruck: AppState['trucks'][number] = {
        ...truck,
        status: 'en_route',
        loadId: load.id,
        driverId: assignedDriver.id,
      }

      const updatedLoad: AppState['loads'][number] = {
        ...load,
        status: 'dispatched',
        assignedTruckId: truck.id,
        assignedDriverId: assignedDriver.id,
        aiRecommendation: undefined,
      }

      return {
        ...previous,
        loads: previous.loads.map((item) =>
          item.id === loadId
            ? updatedLoad
            : item
        ),
        trucks: previous.trucks.map((item) =>
          item.id === truck.id
            ? updatedTruck
            : item
        ),
        drivers: previous.drivers.map((item) =>
          item.id === assignedDriver.id
            ? {
                ...item,
                status: 'driving',
                truckId: truck.id,
              }
            : item
        ),
        notifications: [
          createNotification(`${load.reference} assigned to ${truck.unit}`, previous.nowIso, 'info'),
          ...previous.notifications,
        ],
      }
    })
  }, [])

  const advanceLoadLifecycle = React.useCallback((loadId: string) => {
    setState((previous) => {
      const load = previous.loads.find((item) => item.id === loadId)

      if (!load) {
        return previous
      }

      const nextStatus = nextLoadStatus(load.status)

      if (!nextStatus) {
        return previous
      }

      const truckId = load.assignedTruckId
      const currentTruck =
        previous.trucks.find((truck) => truck.id === truckId) ??
        pickAvailableTruck(previous, load.equipment, true)
      const currentLoad: AppState['loads'][number] = { ...load }
      let fallbackDriverId: string | undefined = undefined

      if (!currentTruck) {
        return previous
      }

      const assignedDriver = previous.drivers.find((driver) => driver.id === currentLoad.assignedDriverId)

      if (
        nextStatus === 'dispatched' &&
        (!currentTruck.driverId || !assignedDriver || assignedDriver.status !== 'available')
      ) {
        const fallbackDriver = previous.drivers.find((item) => item.status === 'available' && !item.truckId)

        if (!fallbackDriver) {
          return previous
        }

        fallbackDriverId = fallbackDriver.id
        currentLoad.assignedDriverId = fallbackDriver.id
      }

      if (!currentLoad.assignedDriverId && currentTruck.driverId) {
        currentLoad.assignedDriverId = currentTruck.driverId
      }

      if (!currentLoad.assignedDriverId && nextStatus !== 'dispatched') {
        const fallbackDriver = previous.drivers.find((item) => item.status === 'available' && !item.truckId)

        if (!fallbackDriver) {
          return previous
        }

        fallbackDriverId = fallbackDriver.id
        currentLoad.assignedDriverId = fallbackDriver.id
      }

      if (!currentLoad.assignedTruckId) {
        currentLoad.assignedTruckId = currentTruck.id
      }

      const statusAwareLoad: AppState['loads'][number] = {
        ...currentLoad,
        status: nextStatus,
        aiRecommendation: undefined,
      }

      const nextTrucks: Array<AppState['trucks'][number]> = previous.trucks.map((truck) => {
        if (truck.id !== currentTruck.id) {
          return truck
        }

        if (nextStatus === 'dispatched') {
          return {
            ...truck,
            status: 'loading',
            loadId: load.id,
            driverId: fallbackDriverId ?? truck.driverId,
          }
        }

        if (nextStatus === 'at_pickup') {
          return {
            ...truck,
            status: 'loading',
            loadId: load.id,
            driverId: fallbackDriverId ?? truck.driverId,
          }
        }

        if (nextStatus === 'in_transit') {
          return {
            ...truck,
            status: 'en_route',
            driverId: fallbackDriverId ?? truck.driverId,
          }
        }

        if (nextStatus === 'at_delivery') {
          return {
            ...truck,
            status: 'loading',
            driverId: fallbackDriverId ?? truck.driverId,
          }
        }

        if (nextStatus === 'delivered') {
          return {
            ...truck,
            status: 'available',
            loadId: undefined,
          }
        }

        if (nextStatus === 'invoiced') {
          return {
            ...truck,
            loadId: undefined,
          }
        }

        return truck
      })

      const nextDrivers: Array<AppState['drivers'][number]> = previous.drivers.map((driver) => {
        if (driver.id !== statusAwareLoad.assignedDriverId) {
          return driver
        }

        if (nextStatus === 'dispatched' || nextStatus === 'at_pickup' || nextStatus === 'in_transit') {
          return {
            ...driver,
            status: 'driving',
            truckId: currentTruck.id,
          }
        }

        if (nextStatus === 'delivered' || nextStatus === 'invoiced') {
          return {
            ...driver,
            status: 'available',
            truckId: undefined,
          }
        }

        return driver
      })

      return {
        ...previous,
        loads: patchLoad(previous, load.id, statusAwareLoad),
        trucks: nextTrucks,
        drivers: nextDrivers,
        notifications: [
          createNotification(
            `${load.reference} moved to ${nextStatus.replace(/_/g, ' ')}`,
            previous.nowIso,
            'info'
          ),
          ...previous.notifications,
        ],
      }
    })
  }, [])

  const resolveException = React.useCallback((exceptionId: string) => {
    setState((previous) => ({
      ...previous,
      exceptions: previous.exceptions.map((item) =>
        item.id === exceptionId
          ? {
              ...item,
              resolved: true,
            }
          : item
      ),
    }))
  }, [])

  const loadScenario = React.useCallback((scenarioId: ScenarioId) => {
    setState(() => createScenarioState(scenarioId))
  }, [])

  const advanceTime = React.useCallback((hours: number) => {
    setState((previous) => {
      const nextNow = new Date(Date.parse(previous.nowIso) + hours * 60 * 60 * 1000).toISOString()
      const dueEvents = previous.eventQueue.filter(
        (event) => !event.applied && Date.parse(event.atIso) <= Date.parse(nextNow)
      )

      const withTime = {
        ...previous,
        nowIso: nextNow,
        eventQueue: previous.eventQueue.map((event) =>
          dueEvents.some((due) => due.id === event.id)
            ? {
                ...event,
                applied: true,
              }
            : event
        ),
      }

      return applyDueEvents(withTime, dueEvents)
    })
  }, [])

  const injectEvent = React.useCallback((eventType: InjectedEventType) => {
    setState((previous) => {
      if (eventType === 'incoming-call') {
        return {
          ...previous,
          activeVoiceScriptId: defaultVoiceScriptId,
          notifications: [
            createNotification('Voice call demo queued in AI Agent tab', previous.nowIso, 'info'),
            ...previous.notifications,
          ],
        }
      }

      if (eventType === 'tender') {
        const target = previous.loads.find((load) => load.status === 'tendered')

        if (!target) {
          return previous
        }

        return {
          ...previous,
          loads: previous.loads.map((load) =>
            load.id === target.id
              ? {
                  ...load,
                  status: 'pending_dispatch',
                  aiRecommendation: 'Fresh tender from event injector. Dispatch now for margin protection.',
                }
              : load
          ),
          notifications: [
            createNotification('Injected event: new tender is pending dispatch', previous.nowIso, 'info'),
            ...previous.notifications,
          ],
        }
      }

      const exception = {
        id: `exception-injected-${previous.exceptions.length + 1}`,
        loadId: previous.loads[0]?.id ?? 'load-1',
        severity: eventType === 'breakdown' ? 'critical' : 'warning',
        title: eventType === 'breakdown' ? 'Breakdown injected' : 'Weather event injected',
        description:
          eventType === 'breakdown'
            ? 'Injected breakdown event requires reassignment and customer update.'
            : 'Injected weather alert impacts route confidence and ETA.',
        createdAtIso: previous.nowIso,
        resolved: false,
        recommendedAction:
          eventType === 'breakdown'
            ? 'Dispatch roadside support and evaluate relay option'
            : 'Notify customers and evaluate alternate routing',
      } satisfies ExceptionEvent

      return {
        ...previous,
        exceptions: [exception, ...previous.exceptions],
        notifications: [
          createNotification(`Injected event: ${exception.title}`, previous.nowIso, exception.severity),
          ...previous.notifications,
        ],
      }
    })
  }, [])

  const resetDemo = React.useCallback(() => {
    setState(() => buildSeedState())
  }, [])

  const sendChat = React.useCallback((message: string) => {
    const trimmed = message.trim()

    if (!trimmed) {
      return
    }

    setState((previous) => {
      const now = previous.nowIso
      const userMessage = {
        id: `chat-user-${previous.chatMessages.length + 1}`,
        role: 'user' as const,
        content: trimmed,
        createdAtIso: now,
      }

      const simulated = simulateChatReply(trimmed, previous)

      const assistantMessage = {
        id: `chat-assistant-${previous.chatMessages.length + 2}`,
        role: 'assistant' as const,
        content: simulated.content,
        createdAtIso: now,
        confidence: simulated.confidence,
        reasoning: simulated.reasoning,
        quickActions: simulated.quickActions,
      }

      return {
        ...previous,
        chatMessages: [...previous.chatMessages, userMessage, assistantMessage],
      }
    })
  }, [])

  const setVoiceScript = React.useCallback((scriptId: string) => {
    setState((previous) => ({
      ...previous,
      activeVoiceScriptId: scriptId,
    }))
  }, [])

  const derived = React.useMemo<DerivedState>(() => {
    const activeLoads = state.loads.filter((load) =>
      ['pending_dispatch', 'dispatched', 'at_pickup', 'in_transit', 'at_delivery'].includes(load.status)
    )
    const pendingLoads = state.loads.filter((load) => load.status === 'pending_dispatch')
    const completedLoads = state.loads.filter((load) => ['delivered', 'invoiced'].includes(load.status))
    const brokeredLoads = state.loads.filter((load) => load.brokered)
    const availableTrucks = state.trucks.filter((truck) => truck.status === 'available')
    const unresolvedExceptions = state.exceptions.filter((item) => !item.resolved)
    const upcomingEvents = state.eventQueue.filter((event) => !event.applied)

    const todayRevenue = activeLoads.reduce((sum, load) => sum + load.financials.revenue, 0)
    const todayMargin = activeLoads.reduce((sum, load) => sum + load.financials.margin, 0)
    const activeBrokeredLoads = state.loads.filter(
      (load) => load.brokered && !['delivered', 'invoiced'].includes(load.status)
    ).length

    return {
      activeLoads,
      pendingLoads,
      completedLoads,
      brokeredLoads,
      availableTrucks,
      unresolvedExceptions,
      upcomingEvents,
      activeScenarioMeta:
        scenarioOptions.find((option) => option.id === state.scenarioId) ?? scenarioOptions[0],
      kpis: {
        activeLoads: activeLoads.length,
        availableTrucks: availableTrucks.length,
        unresolvedExceptions: unresolvedExceptions.length,
        todayRevenue,
        todayMargin,
        activeBrokeredLoads,
      },
    }
  }, [state])

  const value = React.useMemo<AppStoreValue>(
    () => ({
      state,
      derived,
      scenarioOptions,
      actions: {
        assignLoad,
        resolveException,
        loadScenario,
        advanceTime,
        injectEvent,
        resetDemo,
        sendChat,
        setVoiceScript,
        advanceLoadLifecycle,
      },
    }),
    [
      state,
      derived,
      assignLoad,
      resolveException,
      loadScenario,
      advanceTime,
      injectEvent,
      resetDemo,
      sendChat,
      setVoiceScript,
      advanceLoadLifecycle,
    ]
  )

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}

export function useAppStore(): AppStoreValue {
  const context = React.useContext(AppStoreContext)

  if (!context) {
    throw new Error('useAppStore must be used within AppProvider')
  }

  return context
}
