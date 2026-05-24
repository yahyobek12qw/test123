'use client'

import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MarketQuote, CurrencyRate } from '@/types'

interface TickerData {
  indices: MarketQuote[]
  crypto: MarketQuote[]
  currencies: CurrencyRate[]
}

async function fetchTickerData(): Promise<TickerData> {
  const res = await fetch('/api/markets')
  if (!res.ok) throw new Error('Failed to fetch market data')
  return res.json()
}

function TickerItem({ symbol, price, changePercent }: { symbol: string; price: number; changePercent: number }) {
  const isUp = changePercent >= 0
  return (
    <span className="inline-flex items-center gap-2 px-4">
      <span className="font-mono text-xs font-semibold text-dark-secondary">{symbol}</span>
      <span className="font-mono text-xs text-muted">
        {price >= 1000
          ? price.toLocaleString('en-US', { maximumFractionDigits: 0 })
          : price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
      </span>
      <span
        className={cn(
          'font-mono text-xs flex items-center gap-0.5',
          isUp ? 'text-positive' : 'text-negative',
        )}
      >
        {isUp ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
        {Math.abs(changePercent).toFixed(2)}%
      </span>
      <span className="text-border mx-1">·</span>
    </span>
  )
}

export function MarketTicker() {
  const { data } = useQuery({
    queryKey: ['market-ticker'],
    queryFn: fetchTickerData,
    refetchInterval: 30_000,
    staleTime: 30_000,
  })

  const allItems = [
    ...(data?.indices ?? []),
    ...(data?.crypto ?? []),
  ]

  if (allItems.length === 0) {
    return (
      <div className="flex items-center gap-3 overflow-hidden">
        {['S&P 500', 'NASDAQ', 'BTC', 'ETH', 'USD/UZS'].map((s) => (
          <span key={s} className="inline-flex items-center gap-2 px-3">
            <span className="font-mono text-xs font-semibold text-dark-secondary">{s}</span>
            <span className="w-12 h-3 bg-border rounded animate-pulse" />
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="ticker-pause overflow-hidden select-none">
      <div className="ticker-inner flex animate-ticker whitespace-nowrap w-max">
        {/* Duplicate for seamless loop */}
        {[...allItems, ...allItems].map((item, i) => (
          <TickerItem
            key={i}
            symbol={item.symbol}
            price={item.price}
            changePercent={item.changePercent}
          />
        ))}
      </div>
    </div>
  )
}
