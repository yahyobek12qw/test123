import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Currency formatting ──────────────────────────────────────────────────
export function formatCurrency(
  amount: number,
  currency: string = 'UZS',
  compact: boolean = false,
): string {
  if (currency === 'UZS') {
    if (compact) {
      if (Math.abs(amount) >= 1_000_000_000)
        return (amount / 1_000_000_000).toFixed(1) + 'mlrd so\'m'
      if (Math.abs(amount) >= 1_000_000)
        return (amount / 1_000_000).toFixed(1) + 'mln so\'m'
      return new Intl.NumberFormat('uz-UZ').format(Math.round(amount)) + ' so\'m'
    }
    return new Intl.NumberFormat('uz-UZ').format(Math.round(amount)) + ' so\'m'
  }
  if (currency === 'USD') {
    if (compact) {
      if (Math.abs(amount) >= 1_000_000) return '$' + (amount / 1_000_000).toFixed(1) + 'M'
      if (Math.abs(amount) >= 1_000) return '$' + (amount / 1_000).toFixed(1) + 'K'
      return '$' + amount.toFixed(2)
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

// ─── Percentage formatting ────────────────────────────────────────────────
export function formatPercent(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

// ─── Large number formatting ──────────────────────────────────────────────
export function formatLargeNumber(value: number): string {
  if (Math.abs(value) >= 1_000_000_000_000) return (value / 1_000_000_000_000).toFixed(2) + 'T'
  if (Math.abs(value) >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + 'B'
  if (Math.abs(value) >= 1_000_000) return (value / 1_000_000).toFixed(2) + 'M'
  if (Math.abs(value) >= 1_000) return (value / 1_000).toFixed(2) + 'K'
  return value.toFixed(2)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

// ─── Change direction colors ──────────────────────────────────────────────
export function getChangeColor(value: number): string {
  if (value > 0) return 'text-positive'
  if (value < 0) return 'text-negative'
  return 'text-muted'
}

export function getChangeBg(value: number): string {
  if (value > 0) return 'bg-positive/10 text-positive'
  if (value < 0) return 'bg-negative/10 text-negative'
  return 'bg-muted/10 text-muted'
}

export function getChangeBorder(value: number): string {
  if (value > 0) return 'border-positive/20'
  if (value < 0) return 'border-negative/20'
  return 'border-border'
}

// ─── Date formatting ──────────────────────────────────────────────────────
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'Hozir'
  if (minutes < 60) return `${minutes} daq oldin`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} soat oldin`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} kun oldin`
  return formatDate(dateStr)
}

export function formatDateShort(dateStr: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(dateStr))
}

// ─── Progress calculation ─────────────────────────────────────────────────
export function calcProgress(current: number, target: number): number {
  if (target === 0) return 0
  return Math.min(100, Math.round((current / target) * 100))
}

// ─── Days remaining ───────────────────────────────────────────────────────
export function daysUntil(dateStr: string): number {
  const now = new Date()
  const target = new Date(dateStr)
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
