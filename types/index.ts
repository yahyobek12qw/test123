// ─── Personal Finance ─────────────────────────────────────────────────────
export type TransactionType = 'income' | 'expense' | 'transfer'
export type AccountType = 'checking' | 'savings' | 'cash' | 'investment' | 'credit'
export type AssetType = 'stock' | 'crypto' | 'gold' | 'real_estate' | 'bond'
export type AlertType = 'warning' | 'info' | 'success' | 'danger'
export type Currency = 'UZS' | 'USD' | 'EUR' | 'RUB'

export interface Profile {
  id: string
  name: string | null
  currency_preference: Currency
  created_at: string
}

export interface Account {
  id: string
  user_id: string
  name: string
  type: AccountType
  balance: number
  currency: Currency
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  account_id: string | null
  type: TransactionType
  amount: number
  category: string
  description: string | null
  date: string
  currency: Currency
  tags: string[]
  created_at: string
}

export interface Debt {
  id: string
  user_id: string
  creditor: string
  amount: number
  interest_rate: number
  monthly_payment: number | null
  due_date: string | null
  currency: Currency
  created_at: string
}

export interface Investment {
  id: string
  user_id: string
  asset_type: AssetType
  symbol: string
  name: string
  quantity: number
  purchase_price: number
  currency: Currency
  purchased_at: string
  created_at: string
}

export interface Goal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string | null
  currency: Currency
  icon: string | null
  created_at: string
}

export interface Alert {
  id: string
  user_id: string
  type: AlertType
  message: string
  is_read: boolean
  created_at: string
}

// ─── Market / Economic Data ───────────────────────────────────────────────
export interface MarketQuote {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  currency: string
  timestamp?: string
}

export interface CurrencyRate {
  base: string
  target: string
  rate: number
  change24h: number
  updatedAt: string
}

export interface EconomicIndicator {
  id: string
  name: string
  value: number | string
  unit: string
  period: string
  source: string
  updatedAt: string
}

export interface MarketData {
  indices: MarketQuote[]
  currencies: CurrencyRate[]
  commodities: MarketQuote[]
  crypto: MarketQuote[]
}

export interface UzbekistanData {
  usdUzs: CurrencyRate
  allRates: Array<{ currency: string; rate: number; diff: number; date: string }>
}

export interface EconomicNews {
  id: string
  title: string
  source: string
  url: string
  summary: string
  publishedAt: string
  category: 'uzbekistan' | 'global' | 'markets'
}

// ─── AI / Analysis ────────────────────────────────────────────────────────
export interface AIImpactItem {
  event: string
  impact: string
  direction: 'positive' | 'negative' | 'neutral'
  magnitude: 'high' | 'medium' | 'low'
  amountAffected?: number
  currency?: string
}

export interface AIAnalysisResult {
  summary: string
  impacts: AIImpactItem[]
  recommendations: string[]
  riskScore: number
  generatedAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

// ─── UI / Dashboard ───────────────────────────────────────────────────────
export interface DashboardStats {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  netWorth: number
  currency: Currency
}

export const EXPENSE_CATEGORIES = [
  'Oziq-ovqat',
  'Transport',
  'Uy-joy',
  'Kommunal xizmatlar',
  'Sog\'liq',
  'Ko\'ngilochar',
  'Xarid',
  'Ta\'lim',
  'Jamg\'arma',
  'Qarz to\'lovi',
  'Boshqa',
] as const

export const INCOME_CATEGORIES = [
  'Ish haqi',
  'Frilanser',
  'Biznes',
  'Investitsiya daromadi',
  'Ijara',
  'Boshqa',
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number]
