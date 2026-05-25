'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const base = [
      'inline-flex items-center justify-center gap-2 rounded-lg font-body font-medium',
      'transition-all duration-150 cursor-pointer select-none',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-[0.98]',
    ].join(' ')

    const variants = {
      primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
      secondary: 'bg-surface border border-border text-dark-secondary hover:bg-background',
      outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
      ghost: 'text-muted hover:text-dark-secondary hover:bg-background',
      danger: 'bg-negative text-white hover:bg-negative/90',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
