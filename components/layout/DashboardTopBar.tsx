'use client'

import { Bell, Search } from 'lucide-react'
import { MarketTicker } from '@/components/dashboard/MarketTicker'

interface Props {
  userEmail?: string | null
  userName?: string | null
}

export function DashboardTopBar({ userEmail, userName }: Props) {
  const initial = (userName?.[0] ?? userEmail?.[0] ?? 'U').toUpperCase()

  return (
    <header className="h-14 border-b border-border bg-surface flex items-center px-5 gap-4 shrink-0">
      {/* Ticker strip */}
      <div className="flex-1 overflow-hidden min-w-0">
        <MarketTicker />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button className="p-2 rounded-lg hover:bg-background text-muted hover:text-dark-secondary transition-colors">
          <Search size={17} />
        </button>
        <button className="relative p-2 rounded-lg hover:bg-background text-muted hover:text-dark-secondary transition-colors">
          <Bell size={17} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-negative rounded-full animate-pulse-dot" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold font-body ml-1">
          {initial}
        </div>
      </div>
    </header>
  )
}
