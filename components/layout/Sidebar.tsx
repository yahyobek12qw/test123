'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/lib/store'
import {
  LayoutDashboard,
  Wallet,
  Globe,
  MapPin,
  Bot,
  Bell,
  Settings,
  ChevronLeft,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Umumiy' },
  { href: '/dashboard/personal', icon: Wallet, label: 'Shaxsiy Moliya' },
  { href: '/dashboard/global', icon: Globe, label: 'Global Bozorlar' },
  { href: '/dashboard/uzbekistan', icon: MapPin, label: "O'zbekiston" },
  { href: '/dashboard/ai-advisor', icon: Bot, label: 'AI Maslahat' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  const w = sidebarOpen ? 240 : 64

  return (
    <motion.aside
      animate={{ width: w }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="fixed left-0 top-0 h-full bg-surface border-r border-border z-40 flex flex-col overflow-hidden shrink-0"
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-border shrink-0 gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
          <TrendingUp size={15} className="text-white" strokeWidth={2.5} />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-display font-bold text-lg text-primary overflow-hidden whitespace-nowrap"
            >
              FIP
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className={cn(
            'p-1.5 rounded-lg hover:bg-background text-muted hover:text-dark-secondary transition-colors',
            sidebarOpen ? 'ml-auto' : 'mx-auto',
          )}
        >
          <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }} transition={{ duration: 0.25 }}>
            <ChevronLeft size={17} />
          </motion.div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2.5 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              title={!sidebarOpen ? label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-dark-secondary hover:bg-background',
              )}
            >
              <Icon size={17} className="shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="truncate font-body"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-2.5 border-t border-border space-y-0.5 shrink-0">
        {[
          { icon: Bell, label: 'Bildirishnomalar' },
          { icon: Settings, label: 'Sozlamalar' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            title={!sidebarOpen ? label : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-dark-secondary hover:bg-background transition-all duration-150"
          >
            <Icon size={17} className="shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="font-body"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>
    </motion.aside>
  )
}
