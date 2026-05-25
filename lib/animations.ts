import type { Variants } from 'framer-motion'

// ─── Page transitions ──────────────────────────────────────────────────────
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2 },
  },
}

// ─── Staggered container (parent) ─────────────────────────────────────────
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
}

// ─── Stagger child item ────────────────────────────────────────────────────
export const fadeUpItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// ─── Metric card mount ────────────────────────────────────────────────────
export const metricMountVariant: Variants = {
  initial: { scale: 0.97, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

// ─── Slide in from right (panels, drawers) ────────────────────────────────
export const slideInRight: Variants = {
  initial: { x: '100%', opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

// ─── Fade in simple ───────────────────────────────────────────────────────
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

// ─── Scale on hover (applied via whileHover) ──────────────────────────────
export const cardHoverProps = {
  whileHover: { y: -2, transition: { duration: 0.2 } },
}

// ─── Number counter spring config ─────────────────────────────────────────
export const counterSpring = {
  stiffness: 80,
  damping: 20,
  mass: 1,
}
