'use client'

import { motion } from 'framer-motion'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { AlertBanner } from '@/components/dashboard/AlertBanner'
import { QuickMarkets } from '@/components/global/QuickMarkets'
import { AIInsightCard } from '@/components/ai/AIInsightCard'
import { RecentTransactions } from '@/components/personal/RecentTransactions'
import { staggerContainer } from '@/lib/animations'
import { formatCurrency } from '@/lib/utils'
import { Wallet, TrendingUp, ShoppingCart, PiggyBank } from 'lucide-react'
import type { Alert } from '@/types'
import { useState } from 'react'

// Demo alerts for display
const DEMO_ALERTS: Alert[] = [
  {
    id: '1',
    user_id: 'demo',
    type: 'warning',
    message: "Transport xarajatlari bu oy normadan 23% yuqori — 680,000 so'm ortiqcha sarflandi.",
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'demo',
    type: 'info',
    message: "Dollar kursi oxirgi haftada 2.1% oshdi. Sizning oylik import xarajatlaringizga taxminiy ta'sir: +115,000 so'm.",
    is_read: false,
    created_at: new Date().toISOString(),
  },
]

const DEMO_METRICS = [
  {
    label: 'Jami balans',
    value: 47_850_000,
    formatter: (v: number) => formatCurrency(v, 'UZS', true),
    changePercent: 3.2,
    subtitle: 'Barcha hisoblar',
    icon: <Wallet size={16} />,
  },
  {
    label: 'Oylik daromad',
    value: 12_500_000,
    formatter: (v: number) => formatCurrency(v, 'UZS', true),
    changePercent: 8.5,
    subtitle: 'May 2026',
    icon: <TrendingUp size={16} />,
  },
  {
    label: 'Oylik xarajat',
    value: 7_840_000,
    formatter: (v: number) => formatCurrency(v, 'UZS', true),
    changePercent: -5.1,
    subtitle: 'May 2026',
    icon: <ShoppingCart size={16} />,
  },
  {
    label: 'Sof kapital',
    value: 124_200_000,
    formatter: (v: number) => formatCurrency(v, 'UZS', true),
    changePercent: 1.8,
    subtitle: 'Barcha aktivlar',
    icon: <PiggyBank size={16} />,
  },
]

export default function DashboardPage() {
  const [alerts, setAlerts] = useState(DEMO_ALERTS)

  function dismissAlert(id: string) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, is_read: true } : a)))
  }

  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 12 ? 'Xayrli tong' : hour < 17 ? 'Xayrli kun' : 'Xayrli kech'

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Alerts */}
      <AlertBanner alerts={alerts} onDismiss={dismissAlert} />

      {/* Greeting + Metrics */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h1 className="font-display text-display-sm font-semibold text-dark-secondary">
            {greeting} 👋
          </h1>
          <p className="font-mono text-xs text-muted">
            {now.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {DEMO_METRICS.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </motion.div>
      </section>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Transactions (2/3 width) */}
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>

        {/* Quick Markets (1/3 width) */}
        <div>
          <QuickMarkets />
        </div>
      </div>

      {/* AI Insight — full width */}
      <AIInsightCard />
    </div>
  )
}
