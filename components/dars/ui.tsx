'use client'

import { forwardRef, useEffect, useId, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Sahifa sarlavhasi ────────────────────────────────────────────────────
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:hidden">
      <div>
        <h1 className="font-display text-display-sm font-bold text-primary">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

// ─── Forma elementlari ────────────────────────────────────────────────────
const fieldBase =
  'w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-dark-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 transition-all duration-150'

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: (id: string) => React.ReactNode
  className?: string
}) {
  const id = useId()
  return (
    <div className={cn('w-full', className)}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-dark-secondary">
        {label}
      </label>
      {children(id)}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  )
}

export const TextInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(fieldBase, className)} {...props} />,
)
TextInput.displayName = 'TextInput'

export const TextArea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, rows = 3, ...props }, ref) => (
    <textarea ref={ref} rows={rows} className={cn(fieldBase, 'resize-y leading-relaxed', className)} {...props} />
  ),
)
TextArea.displayName = 'TextArea'

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(fieldBase, 'cursor-pointer pr-8', className)} {...props}>
      {children}
    </select>
  ),
)
Select.displayName = 'Select'

// ─── Tablar ───────────────────────────────────────────────────────────────
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { value: T; label: string; icon?: React.ComponentType<{ size?: number }>; count?: number }[]
  value: T
  onChange: (v: T) => void
  className?: string
}) {
  return (
    <div
      role="tablist"
      className={cn(
        '-mx-1 mb-6 flex gap-1 overflow-x-auto border-b border-border px-1 print:hidden',
        className,
      )}
    >
      {tabs.map(({ value: v, label, icon: Icon, count }) => {
        const active = v === value
        return (
          <button
            key={v}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(v)}
            className={cn(
              '-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-dark-secondary',
            )}
          >
            {Icon && <Icon size={16} />}
            {label}
            {count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 font-mono text-[11px] leading-none',
                  active ? 'bg-primary text-white' : 'bg-border text-muted',
                )}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ─── Boʻsh holat ──────────────────────────────────────────────────────────
export function EmptyState({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  text?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-14 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/5">
        <Icon size={22} className="text-primary/60" />
      </div>
      <p className="font-medium text-dark-secondary">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────
const noopSubscribe = () => () => {}

function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false)
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  printable = false,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Chop etishda faqat shu oyna tarkibi chiqadi */
  printable?: boolean
}) {
  const isClient = useIsClient()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open || !isClient) return null

  const widths = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-5xl' }

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-end justify-center bg-dark/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4',
        printable && 'print-root print:static print:block print:bg-transparent print:p-0 print:backdrop-blur-none',
      )}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-surface shadow-2xl sm:rounded-2xl',
          widths[size],
          'print:max-h-none print:max-w-none print:rounded-none print:shadow-none',
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 print:hidden">
          <h2 className="font-display text-xl font-semibold text-primary">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Yopish"
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-background hover:text-dark-secondary"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 print:overflow-visible print:p-0">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-border px-5 py-4 print:hidden">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

// ─── Kichik tugma (ikonka) ────────────────────────────────────────────────
export function IconButton({
  label,
  className,
  children,
  tone = 'default',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; tone?: 'default' | 'danger' }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        tone === 'danger' ? 'hover:bg-negative/10 hover:text-negative' : 'hover:bg-background hover:text-dark-secondary',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// ─── Statistika kartasi ───────────────────────────────────────────────────
export function StatTile({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string
  value: React.ReactNode
  icon: React.ComponentType<{ size?: number; className?: string }>
  hint?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">{label}</p>
        <Icon size={16} className="text-primary/50" />
      </div>
      <p className="mt-2 font-display text-3xl font-bold text-primary font-numeric">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  )
}
