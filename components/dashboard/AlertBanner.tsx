'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'
import type { Alert, AlertType } from '@/types'
import { cn } from '@/lib/utils'

const STYLES: Record<AlertType, { bg: string; icon: React.ElementType; iconClass: string }> = {
  warning: {
    bg: 'bg-gold/8 border border-gold/25',
    icon: AlertTriangle,
    iconClass: 'text-gold',
  },
  info: {
    bg: 'bg-primary/8 border border-primary/20',
    icon: Info,
    iconClass: 'text-primary',
  },
  success: {
    bg: 'bg-positive/8 border border-positive/20',
    icon: CheckCircle,
    iconClass: 'text-positive',
  },
  danger: {
    bg: 'bg-negative/8 border border-negative/20',
    icon: XCircle,
    iconClass: 'text-negative',
  },
}

interface Props {
  alerts: Alert[]
  onDismiss?: (id: string) => void
}

export function AlertBanner({ alerts, onDismiss }: Props) {
  const unread = alerts.filter((a) => !a.is_read).slice(0, 3)
  if (unread.length === 0) return null

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {unread.map((alert) => {
          const style = STYLES[alert.type]
          const Icon = style.icon
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm overflow-hidden',
                style.bg,
              )}
            >
              <Icon size={15} className={cn('shrink-0', style.iconClass)} />
              <span className="flex-1 font-body text-sm text-dark-secondary leading-snug">
                {alert.message}
              </span>
              {onDismiss && (
                <button
                  onClick={() => onDismiss(alert.id)}
                  className="shrink-0 p-1 text-muted hover:text-dark-secondary rounded-md hover:bg-black/5 transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
