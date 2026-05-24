'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { TrendingUp, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '#features', label: 'Imkoniyatlar' },
  { href: '#markets', label: 'Bozorlar' },
  { href: '#uzbekistan', label: "O'zbekiston" },
  { href: '#ai', label: 'AI Tahlil' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md"
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-bold text-xl text-primary tracking-tight">
              FIP
            </span>
            <span className="text-muted text-[10px] font-mono uppercase tracking-widest hidden sm:block">
              Finance
            </span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-muted hover:text-dark-secondary transition-colors duration-150 font-body font-medium"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Kirish
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">
              Boshlash →
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-muted hover:text-dark-secondary"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface px-6 py-4 space-y-3">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block text-sm font-medium text-muted hover:text-dark-secondary py-1.5"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className={cn('flex gap-2 pt-2')}>
            <Link href="/login" className="flex-1">
              <Button variant="secondary" size="sm" className="w-full">
                Kirish
              </Button>
            </Link>
            <Link href="/signup" className="flex-1">
              <Button variant="primary" size="sm" className="w-full">
                Boshlash
              </Button>
            </Link>
          </div>
        </div>
      )}
    </motion.header>
  )
}
