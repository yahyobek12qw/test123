'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BookOpenCheck,
  Clock,
  Pause,
  Play,
  RotateCcw,
  Search,
  Shuffle,
  Target,
  Timer,
  Users,
} from 'lucide-react'
import { useDarsStore } from '@/lib/dars/store'
import { GROUP_ROLES, METHOD_CATEGORIES, METHODS } from '@/lib/dars/methods'
import type { InteractiveMethod, MethodCategory, Student } from '@/lib/dars/types'
import { attendanceKey, shuffle, todayISO } from '@/lib/dars/utils'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState, Field, Modal, PageHeader, Select, Tabs, TextInput } from '@/components/dars/ui'
import { cn } from '@/lib/utils'

type Tab = 'library' | 'groups' | 'timer'

export function MethodsView() {
  const [tab, setTab] = useState<Tab>('library')
  return (
    <>
      <PageHeader
        title="Interfaol metodlar"
        description="Guruhli ishlash, keys-stadi va munozara metodlari hamda ularni darsda qoʻllash uchun vositalar."
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'library', label: 'Metodlar kutubxonasi', icon: BookOpenCheck, count: METHODS.length },
          { value: 'groups', label: 'Guruhlarga ajratish', icon: Users },
          { value: 'timer', label: 'Taymer', icon: Timer },
        ]}
      />
      {tab === 'library' && <Library />}
      {tab === 'groups' && <GroupMaker />}
      {tab === 'timer' && <ActivityTimer />}
    </>
  )
}

// ─── Kutubxona ────────────────────────────────────────────────────────────
function Library() {
  const [category, setCategory] = useState<MethodCategory | 'all'>('all')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<InteractiveMethod | null>(null)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return METHODS.filter(
      (m) =>
        (category === 'all' || m.category === category) &&
        (!q || m.name.toLowerCase().includes(q) || m.goal.toLowerCase().includes(q)),
    )
  }, [category, query])

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-1.5">
          {(['all', ...Object.keys(METHOD_CATEGORIES)] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c as MethodCategory | 'all')}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                category === c ? 'border-primary bg-primary text-white' : 'border-border bg-surface text-muted hover:text-dark-secondary',
              )}
            >
              {c === 'all' ? 'Barchasi' : METHOD_CATEGORIES[c as MethodCategory]}
            </button>
          ))}
        </div>
        <div className="relative lg:ml-auto lg:w-72">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <TextInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Metodni qidirish" className="pl-9" aria-label="Metodni qidirish" />
        </div>
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-muted">Hech narsa topilmadi.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((m) => (
            <button
              key={m.id}
              onClick={() => setOpen(m)}
              className="flex flex-col rounded-xl border border-border bg-surface p-5 text-left shadow-card transition-shadow hover:shadow-card-hover"
            >
              <Badge variant="primary">{METHOD_CATEGORIES[m.category]}</Badge>
              <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-primary">{m.name}</h3>
              <p className="mt-1.5 line-clamp-3 flex-1 text-sm text-muted">{m.goal}</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted">
                <span className="flex items-center gap-1.5"><Clock size={13} /> {m.duration}</span>
                <span className="flex items-center gap-1.5"><Users size={13} /> {m.groupSize}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.name ?? ''} printable footer={<Button variant="secondary" onClick={() => window.print()}>Chop etish</Button>}>
        {open && (
          <div className="space-y-5 text-dark-secondary">
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary" size="md">{METHOD_CATEGORIES[open.category]}</Badge>
              <Badge size="md"><Clock size={12} /> {open.duration}</Badge>
              <Badge size="md"><Users size={12} /> {open.groupSize}</Badge>
            </div>
            <div className="flex gap-3 rounded-lg bg-background p-4">
              <Target size={18} className="mt-0.5 shrink-0 text-gold" />
              <p className="text-sm leading-relaxed">{open.goal}</p>
            </div>
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">Oʻtkazish tartibi</h3>
              <ol className="space-y-3">
                {open.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xs font-semibold text-gold">{i + 1}</span>
                    <span className="pt-0.5">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            {open.tips.length > 0 && (
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">Maslahatlar</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
                  {open.tips.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}

// ─── Guruhlarga ajratish ──────────────────────────────────────────────────
const GROUP_COLORS = ['#1a1a2e', '#D4AF37', '#10B981', '#3B82F6', '#8B5CF6', '#F97316', '#EC4899', '#14B8A6']

function GroupMaker() {
  const { classes, attendance } = useDarsStore()
  const [classId, setClassId] = useState(classes[0]?.id ?? '')
  const [mode, setMode] = useState<'count' | 'size'>('count')
  const [value, setValue] = useState(4)
  const [skipAbsent, setSkipAbsent] = useState(true)
  const [withRoles, setWithRoles] = useState(false)
  const [groups, setGroups] = useState<Student[][]>([])

  const cls = classes.find((c) => c.id === classId)
  const today = attendance[attendanceKey(classId, todayISO())] ?? {}
  const pool = (cls?.students ?? []).filter((s) => !skipAbsent || (today[s.id] !== 'absent' && today[s.id] !== 'excused'))

  if (classes.length === 0) {
    return <EmptyState icon={Users} title="Sinf qoʻshilmagan" text="Avval “Sinf boshqaruvi” boʻlimida sinf va oʻquvchilarni kiriting." />
  }

  const make = () => {
    const n = Math.max(1, value)
    const count = mode === 'count' ? Math.min(n, pool.length) : Math.ceil(pool.length / n)
    const result: Student[][] = Array.from({ length: Math.max(1, count) }, () => [])
    shuffle(pool).forEach((s, i) => result[i % result.length].push(s))
    setGroups(result.filter((g) => g.length))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="h-fit space-y-4 rounded-xl border border-border bg-surface p-5 shadow-card">
        <Field label="Sinf">
          {(id) => (
            <Select id={id} value={classId} onChange={(e) => { setClassId(e.target.value); setGroups([]) }}>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          )}
        </Field>
        <div>
          <p className="mb-1.5 text-sm font-medium text-dark-secondary">Ajratish usuli</p>
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-background p-1">
            {([['count', 'Guruhlar soni'], ['size', 'Guruhda kishi']] as const).map(([k, l]) => (
              <button key={k} onClick={() => setMode(k)} className={cn('rounded-md px-2 py-1.5 text-xs font-medium', mode === k ? 'bg-surface text-primary shadow-sm' : 'text-muted')}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <Field label={mode === 'count' ? 'Nechta guruh?' : 'Har bir guruhda nechta oʻquvchi?'}>
          {(id) => <TextInput id={id} type="number" min={1} max={20} value={value} onChange={(e) => setValue(Number(e.target.value))} />}
        </Field>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-dark-secondary">
          <input type="checkbox" checked={skipAbsent} onChange={(e) => setSkipAbsent(e.target.checked)} className="accent-primary" />
          Bugun kelmaganlarni chiqarib tashlash
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-dark-secondary">
          <input type="checkbox" checked={withRoles} onChange={(e) => setWithRoles(e.target.checked)} className="accent-primary" />
          Guruhda rollarni taqsimlash
        </label>
        <p className="text-xs text-muted">{pool.length} ta oʻquvchi ishtirok etadi.</p>
        <Button className="w-full" onClick={make} disabled={pool.length === 0}>
          <Shuffle size={16} /> {groups.length ? 'Qayta ajratish' : 'Ajratish'}
        </Button>
      </div>

      {groups.length === 0 ? (
        <EmptyState icon={Shuffle} title="Guruhlar hali tuzilmagan" text="Sozlamalarni tanlang va “Ajratish” tugmasini bosing." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((g, gi) => (
            <div key={gi} className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
              <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: GROUP_COLORS[gi % GROUP_COLORS.length] }}>
                <span className="font-display text-lg font-semibold">{gi + 1}-guruh</span>
                <span className="font-mono text-xs opacity-80">{g.length} kishi</span>
              </div>
              <ul className="divide-y divide-border">
                {g.map((s, si) => (
                  <li key={s.id} className="flex items-center justify-between gap-2 px-4 py-2 text-sm">
                    <span>{s.name}</span>
                    {withRoles && si < GROUP_ROLES.length && <Badge>{GROUP_ROLES[si]}</Badge>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Taymer ───────────────────────────────────────────────────────────────
const PRESETS = [1, 3, 5, 7, 10, 15, 20]

function beep() {
  try {
    const ctx = new AudioContext()
    ;[0, 0.35, 0.7].forEach((t) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.2, ctx.currentTime + t)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3)
      osc.connect(gain).connect(ctx.destination)
      osc.start(ctx.currentTime + t)
      osc.stop(ctx.currentTime + t + 0.3)
    })
  } catch {
    // Ovoz qoʻllab-quvvatlanmasa — jim
  }
}

function ActivityTimer() {
  const [duration, setDuration] = useState(5 * 60)
  const [remaining, setRemaining] = useState(5 * 60)
  const [running, setRunning] = useState(false)
  const [label, setLabel] = useState('Guruhda ishlash')
  const endRef = useRef(0)

  useEffect(() => {
    if (!running) return
    const t = setInterval(() => {
      const left = Math.max(0, Math.round((endRef.current - Date.now()) / 1000))
      setRemaining(left)
      if (left === 0) {
        setRunning(false)
        beep()
      }
    }, 200)
    return () => clearInterval(t)
  }, [running])

  const setMinutes = (m: number) => {
    setRunning(false)
    setDuration(m * 60)
    setRemaining(m * 60)
  }

  const toggle = () => {
    if (running) {
      setRunning(false)
      return
    }
    const left = remaining === 0 ? duration : remaining
    endRef.current = Date.now() + left * 1000
    setRemaining(left)
    setRunning(true)
  }

  const pct = duration ? (remaining / duration) * 100 : 0
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const R = 120
  const C = 2 * Math.PI * R

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-6 text-center shadow-card sm:p-8">
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        aria-label="Faoliyat nomi"
        className="w-full bg-transparent text-center font-display text-xl font-semibold text-primary focus:outline-none"
      />
      <div className="relative mx-auto my-6 aspect-square w-full max-w-[280px]">
        <svg viewBox="0 0 280 280" className="h-full w-full -rotate-90">
          <circle cx="140" cy="140" r={R} fill="none" stroke="var(--color-border)" strokeWidth="12" />
          <circle
            cx="140"
            cy="140"
            r={R}
            fill="none"
            stroke={remaining === 0 ? 'var(--color-negative)' : pct < 20 ? 'var(--color-gold)' : 'var(--color-primary)'}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - pct / 100)}
            className="transition-[stroke-dashoffset] duration-200"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-mono text-6xl font-semibold tabular-nums', remaining === 0 ? 'text-negative' : 'text-primary')}>
            {mm}:{ss}
          </span>
          {remaining === 0 && <span className="mt-1 text-sm font-medium text-negative">Vaqt tugadi!</span>}
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <Button size="lg" onClick={toggle} className="min-w-36">
          {running ? <><Pause size={18} /> Pauza</> : <><Play size={18} /> {remaining === duration ? 'Boshlash' : 'Davom etish'}</>}
        </Button>
        <Button size="lg" variant="secondary" onClick={() => setMinutes(duration / 60)} aria-label="Qaytadan">
          <RotateCcw size={18} />
        </Button>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-1.5">
        {PRESETS.map((m) => (
          <button
            key={m}
            onClick={() => setMinutes(m)}
            className={cn(
              'rounded-full border px-3 py-1.5 font-mono text-xs font-medium',
              duration === m * 60 ? 'border-primary bg-primary text-white' : 'border-border text-muted hover:text-dark-secondary',
            )}
          >
            {m} daq
          </button>
        ))}
      </div>
    </div>
  )
}
