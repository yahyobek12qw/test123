'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { staggerContainer, fadeUpItem } from '@/lib/animations'
import { formatCurrency, formatDateShort } from '@/lib/utils'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
  currency: string
}

const DEMO_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'income', amount: 12_500_000, category: 'Ish haqi', description: 'Oylik maosh — May 2026', date: '2026-05-24', currency: 'UZS' },
  { id: '2', type: 'expense', amount: 450_000, category: 'Oziq-ovqat', description: 'Korzinka supermarket', date: '2026-05-23', currency: 'UZS' },
  { id: '3', type: 'expense', amount: 280_000, category: 'Transport', description: 'Taksometr xarajatlari', date: '2026-05-23', currency: 'UZS' },
  { id: '4', type: 'expense', amount: 1_200_000, category: 'Kommunal', description: 'Gaz, elektr, suv', date: '2026-05-22', currency: 'UZS' },
  { id: '5', type: 'income', amount: 800_000, category: 'Frilanser', description: 'Veb-sayt loyihasi', date: '2026-05-20', currency: 'UZS' },
  { id: '6', type: 'expense', amount: 95_000, category: "Ko'ngilochar", description: 'Kino bileti', date: '2026-05-19', currency: 'UZS' },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Ish haqi': '#10B981',
  'Frilanser': '#10B981',
  'Oziq-ovqat': '#F59E0B',
  'Transport': '#6366F1',
  'Kommunal': '#8B5CF6',
  "Ko'ngilochar": '#EC4899',
}

export function RecentTransactions() {
  return (
    <Card variant="elevated" className="h-full">
      <Card.Header>
        <Card.Title>So&apos;nggi tranzaksiyalar</Card.Title>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
          <Plus size={13} /> Qo&apos;shish
        </Button>
      </Card.Header>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-0.5"
      >
        {DEMO_TRANSACTIONS.map((tx) => (
          <motion.div
            key={tx.id}
            variants={fadeUpItem}
            className="flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-background transition-colors duration-100 group"
          >
            {/* Icon */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0`}
              style={{
                background: `${CATEGORY_COLORS[tx.category] ?? '#6B7280'}18`,
              }}
            >
              {tx.type === 'income' ? (
                <ArrowUpRight
                  size={16}
                  style={{ color: CATEGORY_COLORS[tx.category] ?? '#6B7280' }}
                />
              ) : (
                <ArrowDownRight
                  size={16}
                  style={{ color: CATEGORY_COLORS[tx.category] ?? '#6B7280' }}
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-medium text-dark-secondary truncate">
                {tx.description}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="default" className="text-[10px] py-0">
                  {tx.category}
                </Badge>
                <span className="font-mono text-[10px] text-muted">
                  {formatDateShort(tx.date)}
                </span>
              </div>
            </div>

            {/* Amount */}
            <p
              className={`font-mono text-sm font-semibold shrink-0 ${
                tx.type === 'income' ? 'text-positive' : 'text-dark-secondary'
              }`}
            >
              {tx.type === 'income' ? '+' : '−'}
              {formatCurrency(tx.amount, tx.currency, true)}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-4 pt-4 border-t border-border">
        <button className="w-full text-xs text-muted hover:text-primary font-body transition-colors">
          Barcha tranzaksiyalarni ko&apos;rish →
        </button>
      </div>
    </Card>
  )
}
