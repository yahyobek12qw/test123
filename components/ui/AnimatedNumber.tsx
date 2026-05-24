'use client'

import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring, animate } from 'framer-motion'
import { cn } from '@/lib/utils'
import { counterSpring } from '@/lib/animations'

interface AnimatedNumberProps {
  value: number
  formatter?: (v: number) => string
  className?: string
  duration?: number
}

export function AnimatedNumber({
  value,
  formatter,
  className,
  duration = 1.0,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, counterSpring)

  useEffect(() => {
    animate(motionValue, value, { duration })
  }, [value, motionValue, duration])

  useEffect(() => {
    return springValue.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent = formatter
          ? formatter(v)
          : Math.round(v).toLocaleString('en-US')
      }
    })
  }, [springValue, formatter])

  return (
    <span ref={ref} className={cn('font-numeric tabular-nums', className)}>
      {formatter ? formatter(0) : '0'}
    </span>
  )
}
