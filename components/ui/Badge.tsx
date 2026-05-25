import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'default' | 'positive' | 'negative' | 'warning' | 'gold' | 'primary'
  size?: 'sm' | 'md'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'default', size = 'sm', children, className }: BadgeProps) {
  const variants = {
    default: 'bg-muted/10 text-muted',
    positive: 'bg-positive/10 text-positive',
    negative: 'bg-negative/10 text-negative',
    warning: 'bg-gold/10 text-gold',
    gold: 'bg-gold/15 text-gold font-semibold',
    primary: 'bg-primary/10 text-primary',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-mono font-medium',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
