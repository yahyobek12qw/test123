import { NextResponse } from 'next/server'
import { fetchCryptoPrices, fetchCurrencyRates } from '@/lib/api'
import type { MarketQuote, CurrencyRate } from '@/types'

export const runtime = 'nodejs'

// Mock data for when API keys are not configured
const MOCK_INDICES: MarketQuote[] = [
  { symbol: 'S&P 500', name: 'S&P 500 Index', price: 5_342.5, change: 12.3, changePercent: 0.23, currency: 'USD' },
  { symbol: 'NASDAQ', name: 'NASDAQ Composite', price: 16_820.4, change: -45.2, changePercent: -0.27, currency: 'USD' },
  { symbol: 'FTSE 100', name: 'FTSE 100', price: 8_320.1, change: 22.4, changePercent: 0.27, currency: 'GBP' },
  { symbol: 'Nikkei', name: 'Nikkei 225', price: 38_900.3, change: -120.5, changePercent: -0.31, currency: 'JPY' },
]

const MOCK_COMMODITIES: MarketQuote[] = [
  { symbol: 'GOLD', name: 'Gold (oz)', price: 2_340.5, change: 8.2, changePercent: 0.35, currency: 'USD' },
  { symbol: 'OIL WTI', name: 'Crude Oil WTI', price: 78.42, change: -0.85, changePercent: -1.07, currency: 'USD' },
  { symbol: 'OIL BRENT', name: 'Crude Oil Brent', price: 82.15, change: -0.92, changePercent: -1.11, currency: 'USD' },
]

export async function GET() {
  try {
    const [cryptoResult, fxResult] = await Promise.allSettled([
      fetchCryptoPrices(),
      fetchCurrencyRates(),
    ])

    let crypto: MarketQuote[] = [
      { symbol: 'BTC', name: 'Bitcoin', price: 68_420, change: 1200, changePercent: 1.78, currency: 'USD' },
      { symbol: 'ETH', name: 'Ethereum', price: 3_840, change: -25, changePercent: -0.65, currency: 'USD' },
    ]

    if (cryptoResult.status === 'fulfilled') {
      const data = cryptoResult.value
      crypto = [
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          price: data.bitcoin?.usd ?? 68420,
          change: 0,
          changePercent: data.bitcoin?.usd_24h_change ?? 0,
          currency: 'USD',
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          price: data.ethereum?.usd ?? 3840,
          change: 0,
          changePercent: data.ethereum?.usd_24h_change ?? 0,
          currency: 'USD',
        },
      ]
    }

    let currencies: CurrencyRate[] = [
      { base: 'USD', target: 'UZS', rate: 12_750, change24h: 15, updatedAt: new Date().toISOString() },
      { base: 'USD', target: 'EUR', rate: 0.923, change24h: -0.002, updatedAt: new Date().toISOString() },
      { base: 'USD', target: 'RUB', rate: 89.5, change24h: 0.3, updatedAt: new Date().toISOString() },
    ]

    if (fxResult.status === 'fulfilled') {
      const rates = fxResult.value.conversion_rates
      const TARGETS = ['UZS', 'EUR', 'GBP', 'RUB', 'JPY', 'CNY', 'KZT']
      currencies = TARGETS.filter((t) => rates[t]).map((target) => ({
        base: 'USD',
        target,
        rate: rates[target] as number,
        change24h: 0,
        updatedAt: new Date().toISOString(),
      }))
    }

    return NextResponse.json(
      {
        indices: MOCK_INDICES,
        commodities: MOCK_COMMODITIES,
        crypto,
        currencies,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      },
    )
  } catch (error) {
    console.error('Markets API error:', error)
    return NextResponse.json(
      {
        indices: MOCK_INDICES,
        commodities: MOCK_COMMODITIES,
        crypto: [
          { symbol: 'BTC', name: 'Bitcoin', price: 68420, change: 0, changePercent: 1.78, currency: 'USD' },
        ],
        currencies: [
          { base: 'USD', target: 'UZS', rate: 12750, change24h: 0, updatedAt: new Date().toISOString() },
        ],
        updatedAt: new Date().toISOString(),
      },
      { status: 200 },
    )
  }
}
