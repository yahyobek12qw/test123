'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Wallet, TrendingUp, Target, CreditCard } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PieChart } from '@/components/charts/PieChart'
import { AreaChart } from '@/components/charts/AreaChart'
import { staggerContainer, fadeUpItem } from '@/lib/animations'
import { formatCurrency, calcProgress, daysUntil } from '@/lib/utils'

// Demo data
const ACCOUNTS = [
  { id: '1', name: 'Asosiy hisob', type: 'checking', balance: 28_400_000, currency: 'UZS' },
  { id: '2', name: "Jamg'arma", type: 'savings', balance: 15_200_000, currency: 'UZS' },
  { id: '3', name: 'USD hisobi', type: 'savings', balance: 1_240, currency: 'USD' },
  { id: '4', name: 'Naqd pul', type: 'cash', balance: 3_050_000, currency: 'UZS' },
]

const EXPENSE_BREAKDOWN = [
  { name: 'Oziq-ovqat', value: 2_100_000, color: '#F59E0B' },
  { name: 'Transport', value: 960_000, color: '#6366F1' },
  { name: 'Uy-joy', value: 2_500_000, color: '#1a1a2e' },
  { name: 'Kommunal', value: 480_000, color: '#8B5CF6' },
  { name: "Ko'ngilochar", value: 350_000, color: '#EC4899' },
  { name: 'Boshqa', value: 450_000, color: '#6B7280' },
]

const GOALS = [
  { id: '1', name: 'Yangi avtomobil', target_amount: 120_000_000, current_amount: 42_000_000, deadline: '2027-06-01', icon: '🚗', currency: 'UZS' },
  { id: '2', name: "Ta'til safari", target_amount: 15_000_000, current_amount: 8_500_000, deadline: '2026-08-01', icon: '✈️', currency: 'UZS' },
  { id: '3', name: 'Favqulodda fond', target_amount: 30_000_000, current_amount: 15_200_000, deadline: '2026-12-31', icon: '🛡️', currency: 'UZS' },
]

const INVESTMENTS = [
  { symbol: 'BTC', name: 'Bitcoin', quantity: 0.05, purchasePrice: 65000, currentPrice: 68420, currency: 'USD' },
  { symbol: 'GOLD', name: 'Oltin (g)', quantity: 50, purchasePrice: 72, currentPrice: 75.2, currency: 'USD' },
  { symbol: 'UZCARD', name: 'Fond portfeli', quantity: 1, purchasePrice: 5_000_000, currentPrice: 5_420_000, currency: 'UZS' },
]

const MONTHLY_TREND = Array.from({ length: 6 }, (_, i) => ({
  date: ['Dek', 'Yan', 'Feb', 'Mar', 'Apr', 'May'][i],
  value: 4_500_000 + Math.round(Math.random() * 2_000_000 - 1_000_000) + i * 200_000,
}))

export default function PersonalPage() {
  const [activeTab, setActiveTab] = useState<'xarajat' | 'daromad' | 'jamgarma'>('xarajat')

  const totalBalance = ACCOUNTS.reduce((sum, a) => {
    if (a.currency === 'USD') return sum + a.balance * 12748
    return sum + a.balance
  }, 0)

  const totalInvestments = INVESTMENTS.reduce((sum, inv) => {
    const value = inv.quantity * inv.currentPrice
    if (inv.currency === 'USD') return sum + value * 12748
    return sum + value
  }, 0)

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-display-sm font-semibold text-dark-secondary">
          Shaxsiy Moliya
        </h1>
        <Button size="sm" className="gap-1.5">
          <Plus size={14} /> Tranzaksiya qo&apos;shish
        </Button>
      </div>

      {/* Accounts row */}
      <section>
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted mb-4">
          Hisoblar
        </p>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {ACCOUNTS.map((acc) => (
            <motion.div key={acc.id} variants={fadeUpItem}>
              <Card variant="elevated" className="hover:shadow-card-hover transition-all duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Wallet size={14} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-xs font-medium text-dark-secondary truncate">{acc.name}</p>
                    <Badge variant="default" className="mt-0.5 text-[9px]">{acc.type}</Badge>
                  </div>
                </div>
                <p className="font-mono text-lg font-bold text-dark-secondary">
                  {formatCurrency(acc.balance, acc.currency, true)}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Total */}
        <div className="mt-3 text-right">
          <span className="font-body text-xs text-muted">Jami (UZS da): </span>
          <span className="font-mono text-sm font-semibold text-primary">
            {formatCurrency(totalBalance, 'UZS', true)}
          </span>
        </div>
      </section>

      {/* Expense chart + Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card variant="elevated">
            <Card.Header>
              <Card.Title>Oylik xarajat trendi</Card.Title>
              <div className="flex gap-1">
                {(['xarajat', 'daromad', 'jamgarma'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-2.5 py-1 rounded-md text-xs font-body font-medium transition-all ${
                      activeTab === t
                        ? 'bg-primary text-white'
                        : 'text-muted hover:text-dark-secondary hover:bg-background'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </Card.Header>
            <AreaChart
              data={MONTHLY_TREND}
              color="#1a1a2e"
              height={200}
              showAxes
            />
          </Card>
        </div>

        <Card variant="elevated">
          <Card.Header>
            <Card.Title>Xarajat taqsimoti</Card.Title>
          </Card.Header>
          <PieChart data={EXPENSE_BREAKDOWN} height={180} showLegend />
          <div className="mt-3 space-y-1.5">
            {EXPENSE_BREAKDOWN.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="font-body text-xs text-muted">{item.name}</span>
                </div>
                <span className="font-mono text-xs text-dark-secondary">
                  {formatCurrency(item.value, 'UZS', true)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Goals */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted">
            Moliyaviy maqsadlar
          </p>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <Target size={12} /> Maqsad qo&apos;shish
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GOALS.map((goal) => {
            const progress = calcProgress(goal.current_amount, goal.target_amount)
            const days = goal.deadline ? daysUntil(goal.deadline) : null
            return (
              <Card key={goal.id} variant="elevated">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="text-2xl">{goal.icon}</span>
                  <div className="min-w-0">
                    <p className="font-body text-sm font-semibold text-dark-secondary truncate">
                      {goal.name}
                    </p>
                    {days != null && (
                      <p className="font-mono text-xs text-muted">{days} kun qoldi</p>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-background rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm font-semibold text-dark-secondary">
                      {formatCurrency(goal.current_amount, goal.currency as 'UZS', true)}
                    </p>
                    <p className="font-body text-xs text-muted">
                      / {formatCurrency(goal.target_amount, goal.currency as 'UZS', true)}
                    </p>
                  </div>
                  <Badge variant="primary" className="text-sm px-2.5 py-1">
                    {progress}%
                  </Badge>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Investments */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted">
            Investitsiya portfeli
          </p>
          <span className="font-mono text-sm font-semibold text-primary">
            {formatCurrency(totalInvestments, 'UZS', true)}
          </span>
        </div>
        <Card variant="elevated">
          <div className="space-y-0">
            {INVESTMENTS.map((inv) => {
              const currentValue = inv.quantity * inv.currentPrice
              const purchaseValue = inv.quantity * inv.purchasePrice
              const pnl = currentValue - purchaseValue
              const pnlPercent = ((pnl / purchaseValue) * 100).toFixed(2)
              const isProfit = pnl >= 0

              return (
                <div
                  key={inv.symbol}
                  className="flex items-center justify-between py-3.5 border-b border-border/60 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <TrendingUp size={15} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-semibold text-dark-secondary">{inv.symbol}</p>
                      <p className="font-body text-xs text-muted">{inv.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-medium text-dark-secondary">
                      {formatCurrency(currentValue, inv.currency as 'USD', false)}
                    </p>
                    <p className={`font-mono text-xs ${isProfit ? 'text-positive' : 'text-negative'}`}>
                      {isProfit ? '+' : ''}{pnlPercent}%
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </section>
    </div>
  )
}
