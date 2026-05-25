'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Globe, Bot } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { staggerContainer, fadeUpItem } from '@/lib/animations'

const FLOATING_STATS = [
  { label: 'S&P 500', value: '+0.23%', color: 'text-positive', x: 'left-8', y: 'top-32' },
  { label: 'BTC/USD', value: '$68,420', color: 'text-dark-secondary', x: 'right-8', y: 'top-44' },
  { label: 'USD/UZS', value: '12,748', color: 'text-primary', x: 'left-12', y: 'bottom-40' },
  { label: 'Oltin', value: '$2,340', color: 'text-gold', x: 'right-12', y: 'bottom-32' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-16">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(#1a1a2e 1px, transparent 1px), linear-gradient(90deg, #1a1a2e 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Corner crosshairs */}
      <span className="crosshair absolute top-24 left-16 text-primary" />
      <span className="crosshair absolute top-24 right-16 text-primary" />
      <span className="crosshair absolute bottom-24 left-16 text-muted" />
      <span className="crosshair absolute bottom-24 right-16 text-muted" />

      {/* Floating stat pills (desktop) */}
      {FLOATING_STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
          className={`absolute hidden lg:flex items-center gap-2 bg-surface border border-border rounded-full px-3.5 py-1.5 shadow-card ${stat.x} ${stat.y}`}
        >
          <span className="font-mono text-xs text-muted">{stat.label}</span>
          <span className={`font-mono text-xs font-semibold ${stat.color}`}>{stat.value}</span>
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 text-center max-w-4xl mx-auto px-6"
      >
        {/* Tag */}
        <motion.div variants={fadeUpItem} className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-1.5 bg-surface shadow-card">
            <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse-dot" />
            <span className="font-mono text-xs text-muted uppercase tracking-widest">
              Real-time moliyaviy razvedka
            </span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUpItem}
          className="font-display text-display-lg sm:text-display-xl lg:text-display-2xl font-bold text-dark-secondary text-balance mb-6 leading-tight"
        >
          Moliyangizni{' '}
          <span className="text-primary italic">aqlli</span>{' '}
          boshqaring
        </motion.h1>

        {/* Subline */}
        <motion.p
          variants={fadeUpItem}
          className="font-body text-lg text-muted max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Shaxsiy moliya + global iqtisodiy ko&apos;rsatkichlar + O&apos;zbekiston ma&apos;lumotlari
          — hammasini bitta platformada ko&apos;ring va AI tahlili oling.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUpItem} className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Bepul boshlash <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg">
              Demo ko&apos;rish
            </Button>
          </Link>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          variants={fadeUpItem}
          className="flex flex-wrap justify-center gap-3"
        >
          {[
            { icon: TrendingUp, text: 'Real-time bozor ma\'lumotlari' },
            { icon: Globe, text: 'Global iqtisodiy ko\'rsatkichlar' },
            { icon: Bot, text: 'AI shaxsiy tahlil' },
          ].map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="inline-flex items-center gap-1.5 text-xs text-muted font-body bg-surface border border-border rounded-lg px-3 py-1.5"
            >
              <Icon size={12} className="text-primary" />
              {text}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  )
}
