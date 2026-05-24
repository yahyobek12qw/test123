'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AreaChart } from '@/components/charts/AreaChart'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { staggerContainer, fadeUpItem } from '@/lib/animations'
import { formatCurrency } from '@/lib/utils'

interface UZData {
  usdUzs: { rate: number; change24h: number; updatedAt: string }
  allRates: Array<{ currency: string; rate: number; diff: number; date: string }>
  indicators: {
    inflation: { value: number; unit: string; period: string; source: string }
    cbRate: { value: number; unit: string; period: string; source: string }
    avgSalary: { value: number; unit: string; period: string; source: string }
  }
}

async function fetchUzbekistanData(): Promise<UZData> {
  const res = await fetch('/api/uzbekistan')
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

// Demo 30-day USD/UZS chart
const UZS_CHART = Array.from({ length: 30 }, (_, i) => ({
  date: `May ${i + 1}`,
  value: 12600 + i * 5 + Math.round(Math.random() * 80 - 40),
}))

const UZ_NEWS = [
  {
    title: "O'zbekiston Markaziy Banki kalit stavkani 13.5% da saqlab qoldi",
    source: 'CBU.uz',
    date: '2026-05-23',
    category: "Pul siyosati",
  },
  {
    title: "Aprel oyida inflyatsiya 8.7% ga tushdi — Statistika agentligi",
    source: 'stat.uz',
    date: '2026-05-22',
    category: 'Statistika',
  },
  {
    title: 'Toshkent ko\'chmas mulk bozorida narxlar 4.2% oshdi',
    source: "Ko'chmas mulk portali",
    date: '2026-05-20',
    category: "Ko'chmas mulk",
  },
  {
    title: "2026 yil I choragida o'rtacha ish haqi 5.42 mln so'mga yetdi",
    source: 'stat.uz',
    date: '2026-05-18',
    category: 'Mehnat bozori',
  },
]

const BANK_RATES = [
  { bank: 'Kapitalbank', deposit: 23, credit: 28 },
  { bank: 'Ipoteka Bank', deposit: 20, credit: 25 },
  { bank: 'Asaka Bank', deposit: 21, credit: 26 },
  { bank: "Xalq Banki", deposit: 19, credit: 24 },
]

export default function UzbekistanPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['uzbekistan'],
    queryFn: fetchUzbekistanData,
    refetchInterval: 60 * 60 * 1000,
    staleTime: 60 * 60 * 1000,
  })

  const usdRate = data?.usdUzs.rate ?? 12748
  const usdDiff = data?.usdUzs.change24h ?? 15
  const isUp = usdDiff >= 0

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="font-display text-display-sm font-semibold text-dark-secondary">
          🇺🇿 O&apos;zbekiston Iqtisodiyoti
        </h1>
        <p className="font-body text-sm text-muted mt-1">
          Rasmiy ma&apos;lumotlar: CBU.uz va Statistika agentligi
        </p>
      </div>

      {/* Hero: USD/UZS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card variant="dark" padding="lg" className="relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-white/40">
                    Rasmiy kurs (CBU.uz)
                  </p>
                  <p className="font-display text-lg font-medium text-white/80 mt-0.5">
                    USD / O&apos;zbek so&apos;mi
                  </p>
                </div>
                <Badge variant={isUp ? 'negative' : 'positive'} className="text-sm px-3 py-1">
                  {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {isUp ? '+' : ''}{usdDiff.toFixed(2)} so&apos;m
                </Badge>
              </div>

              <p className="font-mono text-5xl font-bold text-white mb-1">
                <AnimatedNumber value={usdRate} formatter={(v) => Math.round(v).toLocaleString('uz-UZ')} />
              </p>
              <p className="font-body text-xs text-white/40 mb-6">
                So&apos;m (UZS) — {data?.usdUzs.updatedAt ? new Date(data.usdUzs.updatedAt).toLocaleDateString('uz-UZ') : '2026-05-24'}
              </p>

              <AreaChart data={UZS_CHART} color="#ffffff" height={100} showAxes={false} />
            </div>
          </Card>
        </div>

        {/* Key indicators */}
        <div className="space-y-4">
          {[
            {
              label: 'Inflyatsiya',
              value: data?.indicators.inflation.value ?? 8.7,
              unit: '%',
              period: data?.indicators.inflation.period ?? '2026-Q1',
              source: 'stat.uz',
              color: 'text-negative',
            },
            {
              label: 'CBU Kalit stavkasi',
              value: data?.indicators.cbRate.value ?? 13.5,
              unit: '%',
              period: data?.indicators.cbRate.period ?? '2026-05',
              source: 'cbu.uz',
              color: 'text-primary',
            },
            {
              label: "O'rtacha ish haqi",
              value: data?.indicators.avgSalary.value ?? 5_420_000,
              unit: 'so\'m',
              period: data?.indicators.avgSalary.period ?? '2026-04',
              source: 'stat.uz',
              color: 'text-positive',
            },
          ].map((ind) => (
            <Card key={ind.label} variant="elevated">
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted mb-2">
                {ind.label}
              </p>
              <p className={`font-mono text-2xl font-bold ${ind.color}`}>
                {ind.unit === 'so\'m'
                  ? formatCurrency(ind.value as number, 'UZS', true)
                  : `${ind.value}${ind.unit}`}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-mono text-xs text-muted">{ind.period}</span>
                <a
                  href={`https://${ind.source}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-muted hover:text-primary transition-colors"
                >
                  {ind.source} <ExternalLink size={9} />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bank rates + News */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Bank rates */}
        <Card variant="elevated">
          <Card.Header>
            <Card.Title>Bank foiz stavkalari</Card.Title>
          </Card.Header>
          <div>
            <div className="grid grid-cols-3 gap-2 pb-2 border-b border-border mb-1">
              <p className="font-body text-xs text-muted">Bank</p>
              <p className="font-body text-xs text-muted text-center">Depozit</p>
              <p className="font-body text-xs text-muted text-center">Kredit</p>
            </div>
            {BANK_RATES.map((b) => (
              <div key={b.bank} className="grid grid-cols-3 gap-2 py-2.5 border-b border-border/40 last:border-0">
                <p className="font-body text-sm text-dark-secondary">{b.bank}</p>
                <p className="font-mono text-sm text-positive text-center">{b.deposit}%</p>
                <p className="font-mono text-sm text-negative text-center">{b.credit}%</p>
              </div>
            ))}
          </div>
        </Card>

        {/* News */}
        <Card variant="elevated">
          <Card.Header>
            <Card.Title>Iqtisodiy yangiliklar</Card.Title>
          </Card.Header>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            {UZ_NEWS.map((news, i) => (
              <motion.div key={i} variants={fadeUpItem} className="flex gap-3">
                <div className="shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                </div>
                <div className="min-w-0">
                  <p className="font-body text-sm text-dark-secondary leading-snug mb-1.5">
                    {news.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{news.category}</Badge>
                    <span className="font-mono text-[10px] text-muted">{news.source}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </div>

      {/* All CBU rates */}
      {(data?.allRates?.length ?? 0) > 0 && (
        <Card variant="elevated">
          <Card.Header>
            <Card.Title>CBU rasmiy valyuta kurslari</Card.Title>
          </Card.Header>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {(data?.allRates ?? []).map((rate) => (
              <div key={rate.currency} className="p-3 bg-background rounded-xl">
                <p className="font-mono text-xs text-muted uppercase">{rate.currency}</p>
                <p className="font-mono text-base font-semibold text-dark-secondary mt-0.5">
                  {rate.rate.toLocaleString('uz-UZ', { maximumFractionDigits: 2 })}
                </p>
                <p className={`font-mono text-[10px] mt-0.5 ${rate.diff >= 0 ? 'text-negative' : 'text-positive'}`}>
                  {rate.diff >= 0 ? '+' : ''}{rate.diff.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
