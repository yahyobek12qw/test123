'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { staggerContainer, fadeUpItem } from '@/lib/animations'

export function DarkCTASection() {
  return (
    <section className="py-24 bg-dark relative overflow-hidden">
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, #1a1a2e 0%, transparent 100%)',
        }}
      />

      {/* Corner crosshairs */}
      <span className="crosshair absolute top-12 left-16 text-white" />
      <span className="crosshair absolute top-12 right-16 text-white" />
      <span className="crosshair absolute bottom-12 left-16 text-white/30" />
      <span className="crosshair absolute bottom-12 right-16 text-white/30" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Label */}
          <motion.p variants={fadeUpItem} className="font-mono text-xs uppercase tracking-widest text-white/40 mb-6">
            Moliyaviy inqilobga qo&apos;shiling
          </motion.p>

          {/* Headline */}
          <motion.h2
            variants={fadeUpItem}
            className="font-display text-display-lg sm:text-display-xl font-bold text-white text-balance mb-6 leading-tight"
          >
            Moliyaviy kelajagingizni{' '}
            <span className="text-gold italic">bugun</span> boshlang
          </motion.h2>

          {/* Subline */}
          <motion.p
            variants={fadeUpItem}
            className="font-body text-base text-white/50 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Bepul hisob oching va shaxsiy moliyangizni global iqtisodiy aql bilan birlashtirib, aqlli moliyaviy qarorlar qabul qiling.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUpItem} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white! text-primary! hover:bg-white/95! gap-2 font-semibold"
              >
                Bepul boshlash <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                Demo ko&apos;rish
              </Button>
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            variants={fadeUpItem}
            className="mt-10 flex flex-wrap justify-center gap-6"
          >
            {[
              'Bepul foydalanish',
              'Karta talab qilinmaydi',
              "Ma'lumotlar xavfsiz",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-xs text-white/40 font-body">
                <span className="w-1 h-1 rounded-full bg-positive" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
