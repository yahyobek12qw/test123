'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { metricMountVariant } from '@/lib/animations'
import { formatPercent, cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: number
  formatter?: (v: number) => string
  changePercent?: number
  subtitle?: string
  icon?: React.ReactNode
  className?: string
}

export function MetricCard({
  label,
  value,
  formatter,
  changePercent,
  subtitle,
  icon,
  className,
}: MetricCardProps) {
  const isPositive = (changePercent ?? 0) > 0
  const isNegative = (changePercent ?? 0) < 0
  const TrendIcon = changePercent == null ? Minus : isPositive ? TrendingUp : TrendingDown
  const badgeVariant = changePercent == null ? 'default' : isPositive ? 'positive' : 'negative'

  return (
    <motion.div
      variants={metricMountVariant}
      initial="initial"
      animate="animate"
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card
        variant="elevated"
        className={cn('group transition-all duration-200 hover:shadow-card-hover', className)}
      >
        {/* Label row */}
        <div className="flex items-center justify-between mb-3">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted">
            {label}
          </p>
          {icon && <div className="text-muted/60">{icon}</div>}
        </div>

        {/* Value row */}
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="font-mono text-3xl font-semibold text-dark-secondary leading-none">
              <AnimatedNumber value={value} formatter={formatter} />
            </p>
            {subtitle && (
              <p className="font-body text-xs text-muted mt-1.5 truncate">{subtitle}</p>
            )}
          </div>

          {changePercent != null && (
            <Badge variant={badgeVariant} className="shrink-0 mb-0.5">
              <TrendIcon size={10} />
              {formatPercent(changePercent)}
            </Badge>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
