import { create } from 'zustand'
import type {
  Carrier,
  ChatMessage,
  CommunicationEntry,
  DispatchRecommendation,
  Driver,
  EntityId,
  Exception,
  Facility,
  Load,
  LoadStatus,
  Notification,
  Shipper,
  TimeEvent,
  Trailer,
  Truck,
  TruckStatus,
  VoiceCall,
} from '@/data/types'
import { createSeedState } from '@/data/seed'

export interface AppStore {
  // ─── Fleet slice ─────────────────────────────────────────────
  trucks: Record<string, Truck>
  updateTruckPosition: (id: EntityId, lat: number, lng: number) => void
  updateTruckStatus: (id: EntityId, status: TruckStatus) => void

  // ─── Driver slice ────────────────────────────────────────────
  drivers: Record<string, Driver>

  // ─── Load slice ──────────────────────────────────────────────
  loads: Record<string, Load>
  updateLoadStatus: (id: EntityId, status: LoadStatus) => void
  assignLoad: (loadId: EntityId, truckId: EntityId, driverId: EntityId) => void
  addLoadCommunication: (
    loadId: EntityId,
    entry: Omit<CommunicationEntry, 'id' | 'timestamp'>,
  ) => void

  // ─── Shipper/Carrier/Facility/Trailer ────────────────────────
  shippers: Record<string, Shipper>
  carriers: Record<string, Carrier>
  facilities: Record<string, Facility>
  trailers: Record<string, Trailer>

  // ─── Exceptions ──────────────────────────────────────────────
  exceptions: Record<string, Exception>
  resolveException: (id: EntityId) => void

  // ─── Notifications ───────────────────────────────────────────
  notifications: Array<Notification>
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markNotificationRead: (id: EntityId) => void
  clearNotifications: () => void

  // ─── Dispatch recommendations ────────────────────────────────
  recommendations: Array<DispatchRecommendation>
  setRecommendations: (recs: Array<DispatchRecommendation>) => void
  acceptRecommendation: (id: EntityId) => void
  rejectRecommendation: (id: EntityId) => void

  // ─── Chat ────────────────────────────────────────────────────
  chatMessages: Array<ChatMessage>
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  clearChat: () => void

  // ─── Voice ───────────────────────────────────────────────────
  voiceCalls: Array<VoiceCall>
  activeCallId: EntityId | null
  setActiveCall: (id: EntityId | null) => void
  addVoiceCall: (call: VoiceCall) => void

  // ─── Time simulation ────────────────────────────────────────
  simulatedTime: string
  isPlaying: boolean
  playbackSpeed: number
  timeEvents: Array<TimeEvent>
  firedEventIndices: Array<number>
  setPlaying: (playing: boolean) => void
  setPlaybackSpeed: (speed: number) => void
  advanceTime: (minutes: number) => void

  // ─── UI state ────────────────────────────────────────────────
  selectedLoadId: EntityId | null
  selectedTruckId: EntityId | null
  activeTab: string
  setSelectedLoad: (id: EntityId | null) => void
  setSelectedTruck: (id: EntityId | null) => void
  setActiveTab: (tab: string) => void

  // ─── Tour ────────────────────────────────────────────────────
  isTourActive: boolean
  tourStep: number
  startTour: () => void
  endTour: () => void
  nextTourStep: () => void

  // ─── Reset ───────────────────────────────────────────────────
  resetStore: () => void
}

let counter = 0
const uid = () => `id-${++counter}-${Date.now()}`

const seed = createSeedState()

export const useAppStore = create<AppStore>()((set, _get) => ({
  // ─── Initial data from seed ──────────────────────────────────
  trucks: seed.trucks,
  drivers: seed.drivers,
  loads: seed.loads,
  shippers: seed.shippers,
  carriers: seed.carriers,
  facilities: seed.facilities,
  trailers: seed.trailers,
  exceptions: seed.exceptions,
  notifications: seed.notifications,
  voiceCalls: seed.voiceCalls,
  recommendations: seed.recommendations,
  chatMessages: seed.chatMessages,
  timeEvents: seed.timeEvents,
  simulatedTime: seed.simulatedTime,
  selectedScenario: seed.selectedScenario,

  // ─── Fleet actions ───────────────────────────────────────────
  updateTruckPosition: (id, lat, lng) =>
    set((s) => ({
      trucks: {
        ...s.trucks,
        [id]: { ...s.trucks[id], position: { lat, lng } },
      },
    })),
  updateTruckStatus: (id, status) =>
    set((s) => ({
      trucks: {
        ...s.trucks,
        [id]: { ...s.trucks[id], status },
      },
    })),

  // ─── Load actions ────────────────────────────────────────────
  updateLoadStatus: (id, status) =>
    set((s) => ({
      loads: {
        ...s.loads,
        [id]: {
          ...s.loads[id],
          status,
          lifecycle: [
            ...s.loads[id].lifecycle,
            {
              status,
              timestamp: new Date().toISOString(),
              actor: 'system',
              note: null,
            },
          ],
        },
      },
    })),
  assignLoad: (loadId, truckId, driverId) =>
    set((s) => ({
      loads: {
        ...s.loads,
        [loadId]: {
          ...s.loads[loadId],
          assignedTruckId: truckId,
          assignedDriverId: driverId,
        },
      },
      trucks: {
        ...s.trucks,
        [truckId]: { ...s.trucks[truckId], currentLoadId: loadId },
      },
    })),
  addLoadCommunication: (loadId, entry) =>
    set((s) => ({
      loads: {
        ...s.loads,
        [loadId]: {
          ...s.loads[loadId],
          communications: [
            ...s.loads[loadId].communications,
            { ...entry, id: uid(), timestamp: new Date().toISOString() },
          ],
        },
      },
    })),

  // ─── Exceptions ──────────────────────────────────────────────
  resolveException: (id) =>
    set((s) => ({
      exceptions: {
        ...s.exceptions,
        [id]: {
          ...s.exceptions[id],
          status: 'resolved',
          resolvedAt: new Date().toISOString(),
        },
      },
    })),

  // ─── Notifications ───────────────────────────────────────────
  addNotification: (n) =>
    set((s) => ({
      notifications: [
        {
          ...n,
          id: uid(),
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...s.notifications,
      ],
    })),
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    })),
  clearNotifications: () => set({ notifications: [] }),

  // ─── Recommendations ────────────────────────────────────────
  setRecommendations: (recs) => set({ recommendations: recs }),
  acceptRecommendation: (id) =>
    set((s) => ({
      recommendations: s.recommendations.map((r) =>
        r.id === id ? { ...r, status: 'accepted' as const } : r,
      ),
    })),
  rejectRecommendation: (id) =>
    set((s) => ({
      recommendations: s.recommendations.map((r) =>
        r.id === id ? { ...r, status: 'rejected' as const } : r,
      ),
    })),

  // ─── Chat ────────────────────────────────────────────────────
  addChatMessage: (msg) =>
    set((s) => ({
      chatMessages: [
        ...s.chatMessages,
        { ...msg, id: uid(), timestamp: new Date().toISOString() },
      ],
    })),
  clearChat: () => set({ chatMessages: [] }),

  // ─── Voice ───────────────────────────────────────────────────
  activeCallId: null,
  setActiveCall: (id) => set({ activeCallId: id }),
  addVoiceCall: (call) => set((s) => ({ voiceCalls: [...s.voiceCalls, call] })),

  // ─── Time simulation ────────────────────────────────────────
  isPlaying: false,
  playbackSpeed: 1,
  firedEventIndices: [],
  setPlaying: (playing) => set({ isPlaying: playing }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  advanceTime: (minutes) =>
    set((s) => {
      const current = new Date(s.simulatedTime)
      current.setMinutes(current.getMinutes() + minutes)
      const newTime = current.toISOString()
      const elapsedMinutes =
        (current.getTime() - new Date(seed.simulatedTime).getTime()) / 60000

      // Fire any time events that should trigger
      const newFired = [...s.firedEventIndices]
      s.timeEvents.forEach((evt, idx) => {
        if (!newFired.includes(idx) && elapsedMinutes >= evt.triggerMinute) {
          newFired.push(idx)
        }
      })

      return { simulatedTime: newTime, firedEventIndices: newFired }
    }),

  // ─── UI state ────────────────────────────────────────────────
  selectedLoadId: null,
  selectedTruckId: null,
  activeTab: 'dashboard',
  setSelectedLoad: (id) => set({ selectedLoadId: id }),
  setSelectedTruck: (id) => set({ selectedTruckId: id }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  // ─── Tour ────────────────────────────────────────────────────
  isTourActive: false,
  tourStep: 0,
  startTour: () => set({ isTourActive: true, tourStep: 0 }),
  endTour: () => set({ isTourActive: false, tourStep: 0 }),
  nextTourStep: () => set((s) => ({ tourStep: s.tourStep + 1 })),

  // ─── Reset ───────────────────────────────────────────────────
  resetStore: () => {
    const fresh = createSeedState()
    set({
      ...fresh,
      isPlaying: false,
      playbackSpeed: 1,
      firedEventIndices: [],
      selectedLoadId: null,
      selectedTruckId: null,
      activeTab: 'dashboard',
      isTourActive: false,
      tourStep: 0,
      chatMessages: [],
      notifications: [],
      recommendations: [],
      activeCallId: null,
    })
  },
}))
