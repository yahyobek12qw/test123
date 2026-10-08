'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpenCheck,
  ClipboardList,
  FileStack,
  GraduationCap,
  LayoutGrid,
  Users,
} from 'lucide-react'
import { useDarsHydrated, useDarsStore } from '@/lib/dars/store'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dars', icon: LayoutGrid, label: 'Bosh sahifa', hint: 'Umumiy koʻrinish' },
  { href: '/dars/rejalar', icon: ClipboardList, label: 'Dars rejalari', hint: 'Maqsad, vazifa, bosqichlar' },
  { href: '/dars/materiallar', icon: FileStack, label: 'Materiallar', hint: 'Tarqatma, test, topshiriq' },
  { href: '/dars/metodlar', icon: BookOpenCheck, label: 'Interfaol metodlar', hint: 'Guruh, keys, munozara' },
  { href: '/dars/sinf', icon: Users, label: 'Sinf boshqaruvi', hint: 'Davomat va intizom' },
]

function isActive(pathname: string, href: string) {
  return href === '/dars' ? pathname === href : pathname.startsWith(href)
}

export function DarsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hydrated = useDarsHydrated()

  useEffect(() => {
    useDarsStore.persist.rehydrate()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop yon panel */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface lg:flex print:hidden">
        <Link href="/dars" className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap size={18} className="text-gold" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-primary">Ustoz</span>
            <span className="block text-[11px] text-muted">Darsni tashkil etish</span>
          </span>
        </Link>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map(({ href, icon: Icon, label, hint }) => {
            const active = isActive(pathname, href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors',
                  active ? 'bg-primary text-white shadow-sm' : 'text-dark-secondary hover:bg-background',
                )}
              >
                <Icon size={18} className={cn('mt-0.5 shrink-0', active ? 'text-gold' : 'text-muted')} />
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{label}</span>
                  <span className={cn('block truncate text-xs', active ? 'text-white/60' : 'text-muted')}>
                    {hint}
                  </span>
                </span>
              </Link>
            )
          })}
        </nav>
        <p className="border-t border-border px-5 py-4 text-xs leading-relaxed text-muted">
          Maʼlumotlar shu brauzerda saqlanadi.
        </p>
      </aside>

      {/* Mobil yuqori panel */}
      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur lg:hidden print:hidden">
        <div className="flex h-14 items-center gap-2.5 px-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <GraduationCap size={16} className="text-gold" />
          </span>
          <span className="font-display text-lg font-bold text-primary">Ustoz</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = isActive(pathname, href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium',
                  active ? 'bg-primary text-white' : 'bg-background text-muted',
                )}
              >
                <Icon size={14} />
                {label}
              </Link>
            )
          })}
        </nav>
      </header>

      <main className="lg:pl-64 print:pl-0">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8 print:max-w-none print:p-0">
          {hydrated ? (
            children
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-muted">
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Yuklanmoqda…
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
