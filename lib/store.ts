'use client'

import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  alertPanelOpen: boolean
  setSidebarOpen: (v: boolean) => void
  toggleSidebar: () => void
  setAlertPanelOpen: (v: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  alertPanelOpen: false,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setAlertPanelOpen: (v) => set({ alertPanelOpen: v }),
}))
