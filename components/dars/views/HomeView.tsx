'use client'

import Link from 'next/link'
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  ClipboardList,
  FileStack,
  Plus,
  Users,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDarsStore } from '@/lib/dars/store'
import { attendanceKey, formatDate, todayISO, totalMinutes } from '@/lib/dars/utils'
import { METHODS } from '@/lib/dars/methods'
import { Button } from '@/components/ui/Button'
import { StatTile } from '@/components/dars/ui'

const MODULES = [
  {
    href: '/dars/rejalar',
    icon: ClipboardList,
    title: 'Dars rejasi',
    text: 'Taʼlimiy, tarbiyaviy va rivojlantiruvchi maqsadlar, vazifalar hamda vaqt boʻyicha taqsimlangan bosqichlar.',
  },
  {
    href: '/dars/materiallar',
    icon: FileStack,
    title: 'Tarqatma materiallar, testlar, topshiriqlar',
    text: 'Tarqatmalar, avtomatik tekshiriladigan testlar, topshiriqlar va keyslarni yarating, chop eting.',
  },
  {
    href: '/dars/metodlar',
    icon: BookOpenCheck,
    title: 'Interfaol metodlar',
    text: `${METHODS.length} ta metod: guruhli ishlash, keys-stadi, munozara. Guruhlarga ajratish va taymer.`,
  },
  {
    href: '/dars/sinf',
    icon: Users,
    title: 'Sinf boshqaruvi va intizom',
    text: 'Davomat, xulq-atvor ballari, sinf qoidalari va tasodifiy oʻquvchi tanlash.',
  },
]

export function HomeView() {
  const router = useRouter()
  const { plans, handouts, tests, assignments, cases, classes, attendance, createPlan } = useDarsStore()

  const today = todayISO()
  const upcoming = plans
    .filter((p) => p.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4)
  const studentCount = classes.reduce((n, c) => n + c.students.length, 0)
  const materialsCount = handouts.length + tests.length + assignments.length + cases.length

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-primary px-6 py-8 text-white sm:px-8">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/10" aria-hidden />
        <div className="relative max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">{formatDate(today)}</p>
          <h1 className="mt-2 font-display text-display-sm font-bold">Darsni tashkil etish</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Rejadan tortib sinfdagi intizomgacha — darsga tayyorgarlik va uni oʻtkazish uchun barcha vositalar bitta joyda.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              className="bg-gold text-primary hover:bg-gold/90"
              onClick={() => router.push(`/dars/rejalar/${createPlan()}`)}
            >
              <Plus size={16} /> Yangi dars rejasi
            </Button>
            <Link href="/dars/sinf">
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                Davomat olish <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Dars rejalari" value={plans.length} icon={ClipboardList} />
        <StatTile label="Materiallar" value={materialsCount} icon={FileStack} hint={`${tests.length} ta test`} />
        <StatTile label="Sinflar" value={classes.length} icon={Users} />
        <StatTile label="Oʻquvchilar" value={studentCount} icon={Users} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {MODULES.map(({ href, icon: Icon, title, text }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-xl border border-border bg-surface p-5 shadow-card transition-shadow hover:shadow-card-hover"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                <Icon size={20} />
              </span>
              <div className="min-w-0">
                <h2 className="flex items-center gap-2 font-semibold text-primary">
                  {title}
                  <ArrowRight size={15} className="opacity-0 transition-opacity group-hover:opacity-100" />
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">Yaqin darslar</h2>
            <Link href="/dars/rejalar" className="text-xs font-medium text-primary hover:underline">
              Barchasi
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted">Rejalashtirilgan darslar yoʻq.</p>
          ) : (
            <ul className="divide-y divide-border">
              {upcoming.map((p) => (
                <li key={p.id}>
                  <Link href={`/dars/rejalar/${p.id}`} className="flex items-center gap-3 py-3 hover:opacity-80">
                    <CalendarDays size={16} className="shrink-0 text-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-dark-secondary">{p.topic || 'Nomsiz mavzu'}</p>
                      <p className="text-xs text-muted">
                        {[p.subject, p.grade].filter(Boolean).join(' · ') || '—'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-dark-secondary">{formatDate(p.date)}</p>
                      <p className="font-mono text-[11px] text-muted">{totalMinutes(p.stages)} daq</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">Bugungi davomat</h2>
            <Link href="/dars/sinf" className="text-xs font-medium text-primary hover:underline">
              Sinf boshqaruvi
            </Link>
          </div>
          {classes.length === 0 ? (
            <p className="text-sm text-muted">Hali sinf qoʻshilmagan.</p>
          ) : (
            <ul className="space-y-3">
              {classes.map((c) => {
                const day = attendance[attendanceKey(c.id, today)] ?? {}
                const marked = c.students.filter((s) => day[s.id]).length
                const present = c.students.filter((s) => day[s.id] === 'present' || day[s.id] === 'late').length
                const pct = c.students.length ? Math.round((present / c.students.length) * 100) : 0
                return (
                  <li key={c.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-dark-secondary">{c.name}</span>
                      <span className="font-mono text-xs text-muted">
                        {marked === 0 ? 'belgilanmagan' : `${present}/${c.students.length}`}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-border">
                      <div className="h-full rounded-full bg-positive" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
