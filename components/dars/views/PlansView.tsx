'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CalendarDays, ClipboardList, Copy, Plus, Search, Timer, Trash2 } from 'lucide-react'
import { useDarsStore } from '@/lib/dars/store'
import { formatDate, totalMinutes } from '@/lib/dars/utils'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState, IconButton, PageHeader, TextInput } from '@/components/dars/ui'

export function PlansView() {
  const router = useRouter()
  const { plans, createPlan, duplicatePlan, remove } = useDarsStore()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return [...plans]
      .sort((a, b) => b.date.localeCompare(a.date) || b.updatedAt - a.updatedAt)
      .filter((p) => !q || [p.topic, p.subject, p.grade].some((v) => v.toLowerCase().includes(q)))
  }, [plans, query])

  const onCreate = () => router.push(`/dars/rejalar/${createPlan()}`)

  return (
    <>
      <PageHeader
        title="Dars rejalari"
        description="Har bir dars uchun maqsad, vazifalar va vaqt boʻyicha taqsimlangan bosqichlarni rejalashtiring."
        actions={
          <Button onClick={onCreate}>
            <Plus size={16} /> Yangi reja
          </Button>
        }
      />

      {plans.length > 0 && (
        <div className="relative mb-5 max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Mavzu, fan yoki sinf boʻyicha qidirish"
            className="pl-9"
            aria-label="Qidirish"
          />
        </div>
      )}

      {plans.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Hali dars rejasi yoʻq"
          text="Birinchi rejangizni yarating — standart 45 daqiqalik bosqichlar avtomatik qoʻshiladi."
          action={
            <Button onClick={onCreate}>
              <Plus size={16} /> Yangi reja
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted">“{query}” boʻyicha hech narsa topilmadi.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => {
            const total = totalMinutes(p.stages)
            const ok = total === p.duration
            return (
              <div
                key={p.id}
                className="group flex flex-col rounded-xl border border-border bg-surface p-5 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="mb-3 flex flex-wrap items-center gap-1.5">
                  {p.subject && <Badge variant="primary">{p.subject}</Badge>}
                  {p.grade && <Badge>{p.grade}</Badge>}
                </div>
                <Link href={`/dars/rejalar/${p.id}`} className="flex-1">
                  <h2 className="font-display text-lg font-semibold leading-snug text-primary group-hover:underline">
                    {p.topic || 'Nomsiz mavzu'}
                  </h2>
                  {p.goals.educational && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted">{p.goals.educational}</p>
                  )}
                </Link>
                <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} /> {formatDate(p.date)}
                  </span>
                  <span className={`flex items-center gap-1.5 ${ok ? '' : 'text-gold'}`}>
                    <Timer size={14} /> {total}/{p.duration} daq
                  </span>
                  <span className="ml-auto flex">
                    <IconButton label="Nusxa olish" onClick={() => duplicatePlan(p.id)}>
                      <Copy size={15} />
                    </IconButton>
                    <IconButton
                      label="Oʻchirish"
                      tone="danger"
                      onClick={() => confirm('Ushbu dars rejasi oʻchirilsinmi?') && remove('plans', p.id)}
                    >
                      <Trash2 size={15} />
                    </IconButton>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
