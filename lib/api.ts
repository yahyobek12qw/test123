// ─── External API helpers (server-side only) ──────────────────────────────
// All called from /app/api/* route handlers, never from the browser directly.

const CBU_BASE = 'https://cbu.uz/uz/arkhiv-kursov-valyut/json'

interface FetchOptions extends RequestInit {
  revalidate?: number
}

async function fetcher<T>(url: string, { revalidate = 60, ...options }: FetchOptions = {}): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${url}`)
  }
  return res.json() as Promise<T>
}

// ─── CBU.uz — Official Uzbekistan Central Bank ────────────────────────────
export async function fetchCBURates() {
  return fetcher<Array<{ Ccy: string; Rate: string; Diff: string; Date: string }>>(
    CBU_BASE,
    { revalidate: 3600 },
  )
}

// ─── CoinGecko — Bitcoin & Ethereum prices (free, no API key) ────────────
export async function fetchCryptoPrices() {
  const url =
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true'
  return fetcher<
    Record<string, { usd: number; usd_24h_change: number }>
  >(url, { revalidate: 60 })
}

// ─── ExchangeRate-API — Live currency rates ───────────────────────────────
export async function fetchCurrencyRates() {
  const key = process.env.EXCHANGE_RATE_API_KEY
  if (!key) throw new Error('EXCHANGE_RATE_API_KEY is not set')
  const url = `https://v6.exchangerate-api.com/v6/${key}/latest/USD`
  return fetcher<{ conversion_rates: Record<string, number> }>(url, { revalidate: 3600 })
}

// ─── Alpha Vantage — Stock index quotes ──────────────────────────────────
export async function fetchStockQuote(symbol: string) {
  const key = process.env.ALPHA_VANTAGE_API_KEY
  if (!key) throw new Error('ALPHA_VANTAGE_API_KEY is not set')
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`
  const data = await fetcher<{ 'Global Quote': Record<string, string> }>(url, { revalidate: 300 })
  const q = data['Global Quote']
  return {
    symbol,
    price: parseFloat(q['05. price'] ?? '0'),
    change: parseFloat(q['09. change'] ?? '0'),
    changePercent: parseFloat((q['10. change percent'] ?? '0%').replace('%', '')),
  }
}

// ─── NewsAPI — Economic news ──────────────────────────────────────────────
export async function fetchEconomicNews(query: string = 'economy finance market') {
  const key = process.env.NEWS_API_KEY
  if (!key) throw new Error('NEWS_API_KEY is not set')
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=8&apiKey=${key}`
  return fetcher<{
    articles: Array<{
      title: string
      source: { name: string }
      url: string
      description: string
      publishedAt: string
    }>
  }>(url, { revalidate: 1800 })
}
