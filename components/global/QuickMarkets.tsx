'use client'

import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn, formatPercent } from '@/lib/utils'
import type { MarketQuote } from '@/types'

interface MarketData {
  indices: MarketQuote[]
  crypto: MarketQuote[]
  commodities: MarketQuote[]
}

async function fetchMarkets(): Promise<MarketData> {
  const res = await fetch('/api/markets')
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

function MarketRow({ item }: { item: MarketQuote }) {
  const isUp = item.changePercent >= 0
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/60 last:border-0">
      <div className="min-w-0">
        <p className="font-mono text-sm font-semibold text-dark-secondary">{item.symbol}</p>
        <p className="font-body text-xs text-muted truncate">{item.name}</p>
      </div>
      <div className="text-right ml-3 shrink-0">
        <p className="font-mono text-sm font-medium text-dark-secondary">
          {item.price >= 1000
            ? item.price.toLocaleString('en-US', { maximumFractionDigits: 0 })
            : item.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </p>
        <Badge variant={isUp ? 'positive' : 'negative'} className="mt-0.5">
          {isUp ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
          {formatPercent(item.changePercent)}
        </Badge>
      </div>
    </div>
  )
}

export function QuickMarkets() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['markets-quick'],
    queryFn: fetchMarkets,
    refetchInterval: 60_000,
    staleTime: 60_000,
  })

  const allItems = [
    ...(data?.indices ?? []).slice(0, 2),
    ...(data?.crypto ?? []).slice(0, 2),
    ...(data?.commodities ?? []).slice(0, 2),
  ]

  return (
    <Card variant="elevated" className="h-full">
      <Card.Header>
        <Card.Title>Tezkor bozorlar</Card.Title>
        <button
          onClick={() => refetch()}
          className={cn(
            'p-1.5 rounded-lg text-muted hover:text-dark-secondary hover:bg-background transition-all',
            isFetching && 'animate-spin',
          )}
        >
          <RefreshCw size={13} />
        </button>
      </Card.Header>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex justify-between py-2.5 border-b border-border/60">
              <div className="space-y-1">
                <div className="h-3.5 w-16 bg-border rounded animate-pulse" />
                <div className="h-3 w-24 bg-border/60 rounded animate-pulse" />
              </div>
              <div className="space-y-1 text-right">
                <div className="h-3.5 w-20 bg-border rounded animate-pulse" />
                <div className="h-4 w-14 bg-border/60 rounded-full animate-pulse ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {allItems.map((item, i) => (
            <MarketRow key={`${item.symbol}-${i}`} item={item} />
          ))}
        </div>
      )}
    </Card>
  )
}
