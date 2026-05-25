'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardTopBar } from '@/components/layout/DashboardTopBar'
import { useUIStore } from '@/lib/store'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      {/* Main content — margin adjusts with sidebar width */}
      <div
        className="flex flex-col flex-1 min-w-0 transition-[margin-left] duration-300"
        style={{ marginLeft: sidebarOpen ? 240 : 64 }}
      >
        <DashboardTopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
