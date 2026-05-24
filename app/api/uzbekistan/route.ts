import { NextResponse } from 'next/server'
import { fetchCBURates } from '@/lib/api'

export const runtime = 'nodejs'

const MOCK_UZS_RATE = 12_748.19
const MOCK_DIFF = 15.23

export async function GET() {
  try {
    const rates = await fetchCBURates()

    const usdRate = rates.find((r) => r.Ccy === 'USD')

    const allRates = rates
      .filter((r) => ['USD', 'EUR', 'RUB', 'GBP', 'CNY', 'KZT', 'TRY'].includes(r.Ccy))
      .map((r) => ({
        currency: r.Ccy,
        rate: parseFloat(r.Rate),
        diff: parseFloat(r.Diff),
        date: r.Date,
      }))

    return NextResponse.json(
      {
        usdUzs: {
          base: 'USD',
          target: 'UZS',
          rate: parseFloat(usdRate?.Rate ?? String(MOCK_UZS_RATE)),
          change24h: parseFloat(usdRate?.Diff ?? String(MOCK_DIFF)),
          updatedAt: usdRate?.Date ?? new Date().toISOString(),
        },
        allRates,
        indicators: {
          inflation: { value: 8.7, unit: '%', period: '2026-Q1', source: 'stat.uz' },
          cbRate: { value: 13.5, unit: '%', period: '2026-05', source: 'cbu.uz' },
          avgSalary: { value: 5_420_000, unit: 'UZS', period: '2026-04', source: 'stat.uz' },
        },
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      },
    )
  } catch (error) {
    console.error('Uzbekistan API error:', error)
    return NextResponse.json(
      {
        usdUzs: {
          base: 'USD',
          target: 'UZS',
          rate: MOCK_UZS_RATE,
          change24h: MOCK_DIFF,
          updatedAt: new Date().toISOString(),
        },
        allRates: [
          { currency: 'USD', rate: MOCK_UZS_RATE, diff: MOCK_DIFF, date: new Date().toISOString() },
          { currency: 'EUR', rate: 13_820, diff: -25, date: new Date().toISOString() },
          { currency: 'RUB', rate: 143.5, diff: 0.8, date: new Date().toISOString() },
        ],
        indicators: {
          inflation: { value: 8.7, unit: '%', period: '2026-Q1', source: 'stat.uz' },
          cbRate: { value: 13.5, unit: '%', period: '2026-05', source: 'cbu.uz' },
          avgSalary: { value: 5_420_000, unit: 'UZS', period: '2026-04', source: 'stat.uz' },
        },
        updatedAt: new Date().toISOString(),
      },
      { status: 200 },
    )
  }
}
