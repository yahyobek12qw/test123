'use client'

import { motion } from 'framer-motion'
import { staggerContainer, fadeUpItem } from '@/lib/animations'

const STATS = [
  { number: '12+', label: "Ma'lumot manbasi", sub: 'CBU, CoinGecko, NewsAPI va boshqalar' },
  { number: '∞', label: 'Real-time yangilanish', sub: "Har 60 soniyada ma'lumotlar yangilanadi" },
  { number: 'AI', label: 'Shaxsiy tahlil', sub: "Iqtisodiy o'zgarishlarning sizga ta'siri" },
]

export function StatsStrip() {
  return (
    <section className="border-y border-border bg-surface py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-0"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUpItem}
              className="text-center px-8 py-4 relative"
            >
              {/* Vertical divider (except last) */}
              {i < STATS.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-border" />
              )}

              <p className="font-display text-5xl font-bold text-primary mb-2 leading-none">
                {stat.number}
              </p>
              <p className="font-display text-base font-medium text-dark-secondary mb-1 italic">
                {stat.label}
              </p>
              <p className="font-body text-xs text-muted max-w-[200px] mx-auto leading-relaxed">
                {stat.sub}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
