'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AreaChart } from '@/components/charts/AreaChart'
import { staggerContainer, fadeUpItem } from '@/lib/animations'
import { formatPercent, cn } from '@/lib/utils'
import type { MarketQuote, CurrencyRate } from '@/types'

interface MarketData {
  indices: MarketQuote[]
  crypto: MarketQuote[]
  commodities: MarketQuote[]
  currencies: CurrencyRate[]
}

async function fetchMarkets(): Promise<MarketData> {
  const res = await fetch('/api/markets')
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

// Demo chart data
function generateChartData(base: number, points = 30) {
  return Array.from({ length: points }, (_, i) => ({
    date: `May ${i + 1}`,
    value: Math.round(base * (0.95 + Math.random() * 0.1 + i * 0.001)),
  }))
}

function MarketCard({ item, chartData }: { item: MarketQuote; chartData: Array<{ date: string; value: number }> }) {
  const isUp = item.changePercent >= 0

  return (
    <Card variant="elevated" className="overflow-hidden">
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="font-mono text-xs text-muted uppercase tracking-wide">{item.symbol}</p>
          <p className="font-display text-lg font-semibold text-dark-secondary mt-0.5">
            {item.name}
          </p>
        </div>
        <Badge variant={isUp ? 'positive' : 'negative'}>
          {isUp ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
          {formatPercent(item.changePercent)}
        </Badge>
      </div>

      <p className="font-mono text-3xl font-bold text-dark-secondary mb-4">
        {item.price >= 1000
          ? item.price.toLocaleString('en-US', { maximumFractionDigits: 0 })
          : item.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        <span className="text-sm text-muted font-normal ml-1">{item.currency}</span>
      </p>

      <AreaChart
        data={chartData}
        color={isUp ? '#10B981' : '#EF4444'}
        height={80}
        showAxes={false}
      />
    </Card>
  )
}

function CurrencyRow({ rate }: { rate: CurrencyRate }) {
  const isUp = rate.change24h >= 0

  const flags: Record<string, string> = {
    UZS: '🇺🇿', EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵',
    RUB: '🇷🇺', CNY: '🇨🇳', KZT: '🇰🇿', TRY: '🇹🇷',
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-border/60 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-xl">{flags[rate.target] ?? '🌐'}</span>
        <div>
          <p className="font-mono text-sm font-semibold text-dark-secondary">
            USD / {rate.target}
          </p>
          <p className="font-body text-xs text-muted">US Dollar</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-mono text-sm font-medium text-dark-secondary">
          {rate.rate.toLocaleString('en-US', { maximumFractionDigits: rate.rate >= 100 ? 0 : 4 })}
        </p>
        <Badge variant={isUp ? 'positive' : 'negative'} className="mt-0.5">
          {isUp ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
          {Math.abs(rate.change24h).toFixed(2)}
        </Badge>
      </div>
    </div>
  )
}

export default function GlobalPage() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['markets-full'],
    queryFn: fetchMarkets,
    refetchInterval: 60_000,
    staleTime: 60_000,
  })

  const btcChart = generateChartData(68000)
  const sp500Chart = generateChartData(5300)
  const goldChart = generateChartData(2300)

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display-sm font-semibold text-dark-secondary">
            Global Bozorlar
          </h1>
          <p className="font-body text-sm text-muted mt-1">
            Jahon moliya bozorlarining real-time ko&apos;rsatkichlari
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className={cn(
            'p-2 rounded-lg border border-border text-muted hover:text-dark-secondary hover:bg-background transition-all',
            isFetching && 'animate-spin',
          )}
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Major Indices */}
      <section>
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted mb-4">
          Asosiy Indekslar
        </p>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {(data?.indices ?? [
            { symbol: 'SPY', name: 'S&P 500', price: 5342, change: 12.3, changePercent: 0.23, currency: 'USD' },
            { symbol: 'QQQ', name: 'NASDAQ', price: 16820, change: -45.2, changePercent: -0.27, currency: 'USD' },
            { symbol: 'FTSE', name: 'FTSE 100', price: 8320, change: 22.4, changePercent: 0.27, currency: 'GBP' },
            { symbol: 'NKY', name: 'Nikkei 225', price: 38900, change: -120, changePercent: -0.31, currency: 'JPY' },
          ]).map((item, i) => (
            <motion.div key={item.symbol} variants={fadeUpItem}>
              <MarketCard item={item} chartData={i === 0 ? sp500Chart : generateChartData(item.price)} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Crypto + Gold */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <section className="md:col-span-2">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted mb-4">
            Kripto bozori
          </p>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {(data?.crypto ?? [
              { symbol: 'BTC', name: 'Bitcoin', price: 68420, change: 1200, changePercent: 1.78, currency: 'USD' },
              { symbol: 'ETH', name: 'Ethereum', price: 3840, change: -25, changePercent: -0.65, currency: 'USD' },
            ]).map((item, i) => (
              <motion.div key={item.symbol} variants={fadeUpItem}>
                <MarketCard item={item} chartData={i === 0 ? btcChart : generateChartData(item.price)} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section>
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted mb-4">
            Tovarlar
          </p>
          <div className="space-y-4">
            {(data?.commodities ?? [
              { symbol: 'GOLD', name: 'Oltin (oz)', price: 2340.5, change: 8.2, changePercent: 0.35, currency: 'USD' },
              { symbol: 'WTI', name: 'Neft WTI', price: 78.42, change: -0.85, changePercent: -1.07, currency: 'USD' },
            ]).map((item, i) => (
              <MarketCard key={item.symbol} item={item} chartData={i === 0 ? goldChart : generateChartData(item.price)} />
            ))}
          </div>
        </section>
      </div>

      {/* Currency Table */}
      <section>
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted mb-4">
          Valyuta kurslari (1 USD)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="elevated">
            {(data?.currencies ?? [
              { base: 'USD', target: 'UZS', rate: 12748, change24h: 15, updatedAt: '' },
              { base: 'USD', target: 'EUR', rate: 0.923, change24h: -0.002, updatedAt: '' },
              { base: 'USD', target: 'RUB', rate: 89.5, change24h: 0.3, updatedAt: '' },
              { base: 'USD', target: 'GBP', rate: 0.789, change24h: 0.001, updatedAt: '' },
            ]).slice(0, 4).map((rate) => (
              <CurrencyRow key={rate.target} rate={rate} />
            ))}
          </Card>
          <Card variant="elevated">
            {(data?.currencies ?? [
              { base: 'USD', target: 'JPY', rate: 156.8, change24h: -0.5, updatedAt: '' },
              { base: 'USD', target: 'CNY', rate: 7.24, change24h: 0.01, updatedAt: '' },
              { base: 'USD', target: 'KZT', rate: 451, change24h: 1.2, updatedAt: '' },
              { base: 'USD', target: 'TRY', rate: 32.4, change24h: 0.08, updatedAt: '' },
            ]).slice(4, 8).concat(
              [
                { base: 'USD', target: 'JPY', rate: 156.8, change24h: -0.5, updatedAt: '' },
                { base: 'USD', target: 'CNY', rate: 7.24, change24h: 0.01, updatedAt: '' },
                { base: 'USD', target: 'KZT', rate: 451, change24h: 1.2, updatedAt: '' },
                { base: 'USD', target: 'TRY', rate: 32.4, change24h: 0.08, updatedAt: '' },
              ].slice(0, Math.max(0, 4 - (data?.currencies?.length ?? 0)))
            ).slice(0, 4).map((rate) => (
              <CurrencyRow key={rate.target} rate={rate} />
            ))}
          </Card>
        </div>
      </section>
    </div>
  )
}
