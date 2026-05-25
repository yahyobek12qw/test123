import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string
  error?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix, suffix, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-dark-secondary mb-1.5 font-body"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm font-mono pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-lg border border-border bg-surface font-body',
              'px-3 py-2.5 text-sm text-dark-secondary placeholder:text-muted',
              'focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50',
              'transition-all duration-150',
              prefix && 'pl-8',
              suffix && 'pr-10',
              error && 'border-negative/60 focus:ring-negative/20',
              className,
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm font-body pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-negative font-body">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
