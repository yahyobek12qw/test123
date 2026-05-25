'use client'

import { motion } from 'framer-motion'
import { Wallet, Globe, MapPin, Bot, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { staggerContainer, fadeUpItem } from '@/lib/animations'

const FEATURES = [
  {
    icon: Wallet,
    title: 'Shaxsiy Moliya',
    description:
      "Balans, xarajatlar, daromad, qarzlar va investitsiyalarni kuzating. Maqsadlar qo'ying va progress ko'ring.",
    items: ['Hisob balansi', 'Xarajat tahlili', 'Investitsiya portfeli', "Moliyaviy maqsadlar"],
    color: 'bg-primary/8 text-primary border-primary/15',
    href: '/dashboard/personal',
  },
  {
    icon: Globe,
    title: 'Global Bozorlar',
    description:
      "Jahon bozorlarini kuzating: S&P 500, NASDAQ, Bitcoin, oltin narxi, valyuta kurslari va boshqalar.",
    items: ["Fond bozori indekslari", 'Kripto bozori', 'Tovar narxlari', 'Valyuta kurslari'],
    color: 'bg-positive/8 text-positive border-positive/15',
    href: '/dashboard/global',
  },
  {
    icon: MapPin,
    title: "O'zbekiston Iqtisodiyoti",
    description:
      "CBU rasmiy kurslari, inflyatsiya, bank stavkalari, ko'chmas mulk narxlari va iqtisodiy yangiliklar.",
    items: ['USD/UZS rasmiy kurs', 'CBU stavkasi', 'Inflyatsiya ko\'rsatkichi', 'Iqtisodiy yangiliklar'],
    color: 'bg-gold/8 text-gold border-gold/15',
    href: '/dashboard/uzbekistan',
  },
  {
    icon: Bot,
    title: 'AI Moliya Maslahat',
    description:
      "Iqtisodiy o'zgarishlar sizning shaxsiy moliyangizga qanday ta'sir qilishini bilip oling. AI suhbat orqali savol bering.",
    items: ["Shaxsiy ta'sir tahlili", 'Xavf baholash', 'Aqlli ogohlantirishlar', 'AI chatbot'],
    color: 'bg-negative/8 text-negative border-negative/15',
    href: '/dashboard/ai-advisor',
  },
]

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
            Imkoniyatlar
          </p>
          <h2 className="font-display text-display-md font-bold text-dark-secondary text-balance">
            Moliyaviy aql — bitta joyda
          </h2>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={fadeUpItem}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="group bg-surface border border-border rounded-2xl p-8 hover:shadow-card-hover transition-all duration-200"
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${feature.color}`}
                >
                  <Icon size={20} />
                </div>

                {/* Title & desc */}
                <h3 className="font-display text-xl font-semibold text-dark-secondary mb-3">
                  {feature.title}
                </h3>
                <p className="font-body text-sm text-muted leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Feature list */}
                <ul className="space-y-2 mb-6">
                  {feature.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span className="w-1 h-1 rounded-full bg-muted/50 shrink-0" />
                      <span className="font-body text-xs text-muted">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={feature.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all duration-150 font-body"
                >
                  Ko&apos;proq <ArrowRight size={14} />
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
