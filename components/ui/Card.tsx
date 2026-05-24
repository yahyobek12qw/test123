import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'dark' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({
  variant = 'default',
  padding = 'md',
  className,
  children,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-surface border border-border shadow-card',
    elevated: 'bg-surface shadow-metric',
    dark: 'bg-dark text-white border border-white/10',
    ghost: 'bg-background border border-border',
  }

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={cn('rounded-xl', variants[variant], paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  )
}

function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'font-body text-xs font-semibold uppercase tracking-widest text-muted',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  )
}

function CardBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Title = CardTitle
Card.Body = CardBody
