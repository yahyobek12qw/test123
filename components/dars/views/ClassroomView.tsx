'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Award,
  CalendarCheck,
  Dices,
  Gavel,
  Lightbulb,
  Minus,
  Pencil,
  Plus,
  Printer,
  RotateCcw,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react'
import { DEFAULT_RULES, useDarsStore } from '@/lib/dars/store'
import { BEHAVIOR_PRESETS, DISCIPLINE_TIPS } from '@/lib/dars/methods'
import type { AttendanceStatus, SchoolClass, Student } from '@/lib/dars/types'
import {
  ATTENDANCE_LABELS,
  ATTENDANCE_STYLES,
  attendanceKey,
  formatDate,
  formatTimestamp,
  todayISO,
  uid,
} from '@/lib/dars/utils'
import { Button } from '@/components/ui/Button'
import {
  EmptyState,
  Field,
  IconButton,
  Modal,
  PageHeader,
  Tabs,
  TextArea,
  TextInput,
} from '@/components/dars/ui'
import { cn } from '@/lib/utils'

type Tab = 'students' | 'attendance' | 'behavior' | 'rules' | 'random'

const STATUSES: AttendanceStatus[] = ['present', 'late', 'excused', 'absent']

function parseNames(text: string): Student[] {
  return text
    .split('\n')
    .map((n) => n.trim())
    .filter(Boolean)
    .map((name) => ({ id: uid(), name }))
}

export function ClassroomView() {
  const { classes, upsert } = useDarsStore()
  const [selected, setSelected] = useState(classes[0]?.id ?? '')
  const [tab, setTab] = useState<Tab>('attendance')
  const [creating, setCreating] = useState(false)

  const cls = classes.find((c) => c.id === selected) ?? classes[0]

  return (
    <>
      <PageHeader
        title="Sinf boshqaruvi va intizom"
        description="Davomat, xulq-atvor ballari, sinf qoidalari va tasodifiy oʻquvchi tanlash."
        actions={
          <Button variant="secondary" onClick={() => setCreating(true)}>
            <Plus size={16} /> Sinf qoʻshish
          </Button>
        }
      />

      {!cls ? (
        <EmptyState
          icon={Users}
          title="Hali sinf yoʻq"
          text="Sinf nomini va oʻquvchilar roʻyxatini kiriting."
          action={<Button onClick={() => setCreating(true)}><Plus size={16} /> Sinf qoʻshish</Button>}
        />
      ) : (
        <>
          {classes.length > 1 && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {classes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                    c.id === cls.id ? 'border-primary bg-primary text-white' : 'border-border bg-surface text-muted hover:text-dark-secondary',
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              { value: 'attendance', label: 'Davomat', icon: CalendarCheck },
              { value: 'behavior', label: 'Xulq-atvor', icon: Award },
              { value: 'random', label: 'Tasodifiy tanlash', icon: Dices },
              { value: 'rules', label: 'Qoidalar va intizom', icon: Gavel },
              { value: 'students', label: 'Oʻquvchilar', icon: Users, count: cls.students.length },
            ]}
          />
          {cls.students.length === 0 && tab !== 'students' && tab !== 'rules' ? (
            <EmptyState
              icon={UserPlus}
              title="Sinfda oʻquvchi yoʻq"
              action={<Button onClick={() => setTab('students')}><UserPlus size={16} /> Oʻquvchi qoʻshish</Button>}
            />
          ) : (
            <>
              {tab === 'students' && <StudentsPanel cls={cls} />}
              {tab === 'attendance' && <AttendancePanel cls={cls} />}
              {tab === 'behavior' && <BehaviorPanel cls={cls} />}
              {tab === 'rules' && <RulesPanel cls={cls} />}
              {tab === 'random' && <RandomPicker key={cls.id} cls={cls} />}
            </>
          )}
        </>
      )}

      <NewClassModal
        open={creating}
        onClose={() => setCreating(false)}
        onCreate={(c) => {
          upsert('classes', c)
          setSelected(c.id)
          setTab('students')
          setCreating(false)
        }}
      />
    </>
  )
}

function NewClassModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (c: SchoolClass) => void }) {
  const [name, setName] = useState('')
  const [names, setNames] = useState('')
  const close = () => {
    setName('')
    setNames('')
    onClose()
  }
  return (
    <Modal
      open={open}
      onClose={close}
      title="Yangi sinf"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={close}>Bekor qilish</Button>
          <Button
            disabled={!name.trim()}
            onClick={() => {
              onCreate({ id: uid(), name: name.trim(), students: parseNames(names), rules: [...DEFAULT_RULES] })
              setName('')
              setNames('')
            }}
          >
            Yaratish
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Sinf nomi">
          {(id) => <TextInput id={id} value={name} onChange={(e) => setName(e.target.value)} placeholder="5-B sinf" autoFocus />}
        </Field>
        <Field label="Oʻquvchilar roʻyxati" hint="Har bir oʻquvchini yangi qatordan yozing. Keyin ham qoʻshish mumkin.">
          {(id) => <TextArea id={id} rows={8} value={names} onChange={(e) => setNames(e.target.value)} placeholder={'Aliyev Ali\nValiyeva Malika'} />}
        </Field>
      </div>
    </Modal>
  )
}

// ─── Oʻquvchilar ──────────────────────────────────────────────────────────
function StudentsPanel({ cls }: { cls: SchoolClass }) {
  const { updateClass, remove } = useDarsStore()
  const [bulk, setBulk] = useState('')
  const [editingName, setEditingName] = useState<string | null>(null)

  const sorted = [...cls.students].sort((a, b) => a.name.localeCompare(b.name, 'uz'))

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-xl border border-border bg-surface shadow-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          {editingName !== null ? (
            <form
              className="flex flex-1 gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (editingName.trim()) updateClass(cls.id, { name: editingName.trim() })
                setEditingName(null)
              }}
            >
              <TextInput value={editingName} onChange={(e) => setEditingName(e.target.value)} aria-label="Sinf nomi" autoFocus />
              <Button type="submit" size="sm">Saqlash</Button>
            </form>
          ) : (
            <>
              <h2 className="font-display text-lg font-semibold text-primary">{cls.name}</h2>
              <IconButton label="Nomini oʻzgartirish" onClick={() => setEditingName(cls.name)}><Pencil size={15} /></IconButton>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-negative hover:bg-negative/10 hover:text-negative"
                onClick={() => confirm(`“${cls.name}” va uning barcha maʼlumotlari (davomat, ballar) oʻchirilsinmi?`) && remove('classes', cls.id)}
              >
                <Trash2 size={15} /> Sinfni oʻchirish
              </Button>
            </>
          )}
        </div>
        {sorted.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">Oʻquvchilar roʻyxati boʻsh.</p>
        ) : (
          <ol className="divide-y divide-border">
            {sorted.map((s, i) => (
              <li key={s.id} className="flex items-center gap-3 px-5 py-2">
                <span className="w-6 text-right font-mono text-xs text-muted">{i + 1}</span>
                <input
                  value={s.name}
                  onChange={(e) => updateClass(cls.id, { students: cls.students.map((x) => (x.id === s.id ? { ...x, name: e.target.value } : x)) })}
                  aria-label="Oʻquvchi ismi"
                  className="min-w-0 flex-1 rounded-md bg-transparent px-2 py-1.5 text-sm focus:bg-background focus:outline-none"
                />
                <IconButton label="Oʻquvchini oʻchirish" tone="danger" onClick={() => updateClass(cls.id, { students: cls.students.filter((x) => x.id !== s.id) })}>
                  <Trash2 size={15} />
                </IconButton>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="h-fit rounded-xl border border-border bg-surface p-5 shadow-card">
        <Field label="Oʻquvchi qoʻshish" hint="Bir nechta oʻquvchini har birini yangi qatordan yozib qoʻshish mumkin.">
          {(id) => <TextArea id={id} rows={6} value={bulk} onChange={(e) => setBulk(e.target.value)} placeholder={'Familiya Ism\nFamiliya Ism'} />}
        </Field>
        <Button
          className="mt-3 w-full"
          disabled={!bulk.trim()}
          onClick={() => {
            updateClass(cls.id, { students: [...cls.students, ...parseNames(bulk)] })
            setBulk('')
          }}
        >
          <UserPlus size={16} /> Qoʻshish
        </Button>
      </div>
    </div>
  )
}

// ─── Davomat ──────────────────────────────────────────────────────────────
function AttendancePanel({ cls }: { cls: SchoolClass }) {
  const { attendance, setAttendance, markAllPresent } = useDarsStore()
  const [date, setDate] = useState(todayISO())
  const day = attendance[attendanceKey(cls.id, date)] ?? {}

  const history = useMemo(
    () =>
      Object.entries(attendance)
        .filter(([k]) => k.startsWith(`${cls.id}|`))
        .map(([k, v]) => ({ date: k.split('|')[1], day: v }))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [attendance, cls.id],
  )

  const rate = (sid: string) => {
    const days = history.filter((h) => h.day[sid])
    if (days.length === 0) return null
    const present = days.filter((h) => h.day[sid] === 'present' || h.day[sid] === 'late').length
    return Math.round((present / days.length) * 100)
  }

  const counts = STATUSES.map((st) => ({ st, n: cls.students.filter((s) => day[s.id] === st).length }))
  const unmarked = cls.students.filter((s) => !day[s.id]).length

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="rounded-xl border border-border bg-surface shadow-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
          <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value || todayISO())} className="w-auto" aria-label="Sana" />
          <Button variant="secondary" size="sm" onClick={() => markAllPresent(cls.id, date)}>Hammasi keldi</Button>
          <div className="flex flex-wrap gap-1.5 sm:ml-auto">
            {counts.map(({ st, n }) => (
              <span key={st} className="rounded-full bg-background px-2.5 py-1 text-xs text-muted">
                {ATTENDANCE_LABELS[st]}: <b className="font-mono text-dark-secondary">{n}</b>
              </span>
            ))}
            {unmarked > 0 && <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs text-gold">Belgilanmagan: {unmarked}</span>}
          </div>
        </div>
        <ol className="divide-y divide-border">
          {[...cls.students]
            .sort((a, b) => a.name.localeCompare(b.name, 'uz'))
            .map((s, i) => {
              const r = rate(s.id)
              return (
                <li key={s.id} className="flex flex-col gap-2 px-5 py-2.5 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="w-6 text-right font-mono text-xs text-muted">{i + 1}</span>
                    <span className="truncate text-sm font-medium">{s.name}</span>
                    {r !== null && (
                      <span className={cn('font-mono text-[11px]', r >= 90 ? 'text-positive' : r >= 75 ? 'text-gold' : 'text-negative')} title="Umumiy davomat">
                        {r}%
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1 pl-9 sm:pl-0">
                    {STATUSES.map((st) => (
                      <button
                        key={st}
                        onClick={() => setAttendance(cls.id, date, s.id, st)}
                        aria-pressed={day[s.id] === st}
                        className={cn(
                          'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                          day[s.id] === st ? ATTENDANCE_STYLES[st] : 'border-border text-muted hover:text-dark-secondary',
                        )}
                      >
                        {ATTENDANCE_LABELS[st]}
                      </button>
                    ))}
                  </div>
                </li>
              )
            })}
        </ol>
      </div>

      <div className="h-fit rounded-xl border border-border bg-surface p-5 shadow-card">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">Davomat tarixi</h3>
        {history.length === 0 ? (
          <p className="text-sm text-muted">Hali davomat olinmagan.</p>
        ) : (
          <ul className="space-y-1">
            {history.slice(0, 12).map((h) => {
              const present = cls.students.filter((s) => h.day[s.id] === 'present' || h.day[s.id] === 'late').length
              return (
                <li key={h.date}>
                  <button
                    onClick={() => setDate(h.date)}
                    className={cn('flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-background', h.date === date && 'bg-background font-medium')}
                  >
                    <span>{formatDate(h.date)}</span>
                    <span className="font-mono text-xs text-muted">{present}/{cls.students.length}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

// ─── Xulq-atvor ───────────────────────────────────────────────────────────
function BehaviorPanel({ cls }: { cls: SchoolClass }) {
  const { behavior, addBehavior, remove } = useDarsStore()
  const [target, setTarget] = useState<{ student: Student; sign: 1 | -1 } | null>(null)
  const [reason, setReason] = useState('')
  const [points, setPoints] = useState(1)

  const entries = behavior.filter((b) => b.classId === cls.id)
  const totals = useMemo(() => {
    const m: Record<string, number> = {}
    for (const e of entries) m[e.studentId] = (m[e.studentId] ?? 0) + e.points
    return m
  }, [entries])
  const ranked = [...cls.students].sort((a, b) => (totals[b.id] ?? 0) - (totals[a.id] ?? 0) || a.name.localeCompare(b.name, 'uz'))
  const nameOf = (sid: string) => cls.students.find((s) => s.id === sid)?.name ?? 'Oʻchirilgan oʻquvchi'

  const give = (r: string, p: number) => {
    if (!target) return
    addBehavior({ classId: cls.id, studentId: target.student.id, points: p, reason: r })
    setTarget(null)
    setReason('')
    setPoints(1)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="grid h-fit gap-3 sm:grid-cols-2">
        {ranked.map((s, i) => {
          const t = totals[s.id] ?? 0
          return (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 shadow-card">
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-sm font-semibold',
                  t > 0 ? 'bg-positive/10 text-positive' : t < 0 ? 'bg-negative/10 text-negative' : 'bg-background text-muted',
                )}
              >
                {t > 0 ? `+${t}` : t}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{s.name}</p>
                {i < 3 && t > 0 && <p className="text-[11px] text-gold">★ {i + 1}-oʻrin</p>}
              </div>
              <div className="flex gap-1">
                <button aria-label={`${s.name}: ball ayirish`} onClick={() => setTarget({ student: s, sign: -1 })} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-negative hover:bg-negative/10">
                  <Minus size={15} />
                </button>
                <button aria-label={`${s.name}: ball qoʻshish`} onClick={() => setTarget({ student: s, sign: 1 })} className="flex h-8 w-8 items-center justify-center rounded-lg bg-positive text-white hover:bg-positive/90">
                  <Plus size={15} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="h-fit rounded-xl border border-border bg-surface p-5 shadow-card">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">Soʻnggi qaydlar</h3>
        {entries.length === 0 ? (
          <p className="text-sm text-muted">Hali qayd yoʻq. Oʻquvchi yonidagi + yoki − tugmasini bosing.</p>
        ) : (
          <ul className="space-y-2">
            {entries.slice(0, 15).map((e) => (
              <li key={e.id} className="flex items-start gap-2 text-sm">
                <span className={cn('mt-0.5 w-7 shrink-0 font-mono text-xs font-semibold', e.points > 0 ? 'text-positive' : 'text-negative')}>
                  {e.points > 0 ? `+${e.points}` : e.points}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{nameOf(e.studentId)}</p>
                  <p className="text-xs text-muted">
                    {e.reason} · {formatTimestamp(e.date)}
                  </p>
                </div>
                <IconButton label="Bekor qilish" tone="danger" onClick={() => remove('behavior', e.id)}><Trash2 size={13} /></IconButton>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        open={!!target}
        onClose={() => setTarget(null)}
        size="sm"
        title={target ? `${target.student.name}: ${target.sign > 0 ? 'ragʻbatlantirish' : 'ogohlantirish'}` : ''}
      >
        {target && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {BEHAVIOR_PRESETS.filter((p) => Math.sign(p.points) === target.sign).map((p) => (
                <button
                  key={p.reason}
                  onClick={() => give(p.reason, p.points)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-sm transition-colors',
                    target.sign > 0 ? 'border-positive/30 hover:bg-positive/10' : 'border-negative/30 hover:bg-negative/10',
                  )}
                >
                  {p.reason} <b className="font-mono">{p.points > 0 ? `+${p.points}` : p.points}</b>
                </button>
              ))}
            </div>
            <form
              className="flex items-end gap-2 border-t border-border pt-4"
              onSubmit={(e) => {
                e.preventDefault()
                if (reason.trim()) give(reason.trim(), target.sign * Math.max(1, points))
              }}
            >
              <Field label="Boshqa sabab" className="flex-1">
                {(id) => <TextInput id={id} value={reason} onChange={(e) => setReason(e.target.value)} />}
              </Field>
              <Field label="Ball" className="w-20">
                {(id) => <TextInput id={id} type="number" min={1} max={10} value={points} onChange={(e) => setPoints(Number(e.target.value))} />}
              </Field>
              <Button type="submit" disabled={!reason.trim()}>OK</Button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ─── Qoidalar va intizom ──────────────────────────────────────────────────
function RulesPanel({ cls }: { cls: SchoolClass }) {
  const { updateClass } = useDarsStore()
  const [draft, setDraft] = useState('')
  const [poster, setPoster] = useState(false)

  const setRules = (rules: string[]) => updateClass(cls.id, { rules })

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="h-fit rounded-xl border border-border bg-surface p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-primary">{cls.name} qoidalari</h3>
          <div className="flex">
            <IconButton label="Standart qoidalarni tiklash" onClick={() => confirm('Standart qoidalar tiklansinmi?') && setRules([...DEFAULT_RULES])}><RotateCcw size={15} /></IconButton>
            <IconButton label="Plakat sifatida chop etish" onClick={() => setPoster(true)}><Printer size={15} /></IconButton>
          </div>
        </div>
        <ol className="space-y-2">
          {cls.rules.map((r, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xs font-semibold text-gold">{i + 1}</span>
              <input
                value={r}
                onChange={(e) => setRules(cls.rules.map((x, j) => (j === i ? e.target.value : x)))}
                aria-label={`${i + 1}-qoida`}
                className="min-w-0 flex-1 rounded-md bg-transparent px-2 py-1.5 text-sm focus:bg-background focus:outline-none"
              />
              <IconButton label="Qoidani oʻchirish" tone="danger" onClick={() => setRules(cls.rules.filter((_, j) => j !== i))}><Trash2 size={14} /></IconButton>
            </li>
          ))}
        </ol>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (!draft.trim()) return
            setRules([...cls.rules, draft.trim()])
            setDraft('')
          }}
        >
          <TextInput value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Yangi qoida" aria-label="Yangi qoida" />
          <Button type="submit" disabled={!draft.trim()}><Plus size={16} /></Button>
        </form>
      </div>

      <div className="space-y-3">
        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
          <Lightbulb size={14} className="text-gold" /> Intizom boʻyicha tavsiyalar
        </h3>
        {DISCIPLINE_TIPS.map((t) => (
          <div key={t.title} className="rounded-xl border border-border bg-surface p-4 shadow-card">
            <p className="font-medium text-primary">{t.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{t.text}</p>
          </div>
        ))}
      </div>

      <Modal open={poster} onClose={() => setPoster(false)} title="Sinf qoidalari plakati" size="lg" printable footer={<Button onClick={() => window.print()}><Printer size={16} /> Chop etish</Button>}>
        <div className="px-2 py-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">{cls.name}</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-primary">Bizning qoidalarimiz</h1>
          <ol className="mx-auto mt-8 max-w-xl space-y-4 text-left">
            {cls.rules.filter((r) => r.trim()).map((r, i) => (
              <li key={i} className="flex items-center gap-4 text-xl">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-gold print:border-2 print:border-primary print:bg-transparent print:text-primary">
                  {i + 1}
                </span>
                {r}
              </li>
            ))}
          </ol>
        </div>
      </Modal>
    </div>
  )
}

// ─── Tasodifiy tanlash ────────────────────────────────────────────────────
function RandomPicker({ cls }: { cls: SchoolClass }) {
  const { attendance } = useDarsStore()
  const [skipAbsent, setSkipAbsent] = useState(true)
  const [noRepeat, setNoRepeat] = useState(true)
  const [picked, setPicked] = useState<string[]>([])
  const [current, setCurrent] = useState<Student | null>(null)
  const [spinning, setSpinning] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current)
  }, [])

  const today = attendance[attendanceKey(cls.id, todayISO())] ?? {}
  const present = cls.students.filter((s) => !skipAbsent || (today[s.id] !== 'absent' && today[s.id] !== 'excused'))
  const pool = noRepeat ? present.filter((s) => !picked.includes(s.id)) : present

  const spin = () => {
    if (pool.length === 0 || spinning) return
    const winner = pool[Math.floor(Math.random() * pool.length)]
    setSpinning(true)
    let ticks = 0
    timer.current = setInterval(() => {
      ticks++
      if (ticks >= 14) {
        clearInterval(timer.current!)
        timer.current = null
        setCurrent(winner)
        setPicked((p) => [...p, winner.id])
        setSpinning(false)
        return
      }
      setCurrent(present[Math.floor(Math.random() * present.length)])
    }, 80)
  }

  const nameOf = (sid: string) => cls.students.find((s) => s.id === sid)?.name

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="flex flex-col items-center rounded-2xl bg-primary px-6 py-12 text-center text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">Javob beradi</p>
        <p className={cn('mt-4 min-h-[3.5rem] font-display text-4xl font-bold sm:text-5xl', spinning && 'opacity-70')}>
          {current?.name ?? '???'}
        </p>
        <Button size="lg" className="mt-8 min-w-44 bg-gold text-primary hover:bg-gold/90" onClick={spin} disabled={pool.length === 0 || spinning}>
          <Dices size={18} /> {pool.length === 0 ? 'Hamma tanlandi' : 'Tanlash'}
        </Button>
        <p className="mt-3 text-xs text-white/60">Navbatda: {pool.length} ta oʻquvchi</p>
      </div>

      <div className="h-fit space-y-4 rounded-xl border border-border bg-surface p-5 shadow-card">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={skipAbsent} onChange={(e) => setSkipAbsent(e.target.checked)} className="accent-primary" />
          Bugun kelmaganlarni hisobga olmaslik
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={noRepeat} onChange={(e) => setNoRepeat(e.target.checked)} className="accent-primary" />
          Takrorlamaslik
        </label>
        <div className="border-t border-border pt-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Tanlanganlar</h3>
            {picked.length > 0 && (
              <button className="text-xs text-primary hover:underline" onClick={() => { setPicked([]); setCurrent(null) }}>
                Tozalash
              </button>
            )}
          </div>
          {picked.length === 0 ? (
            <p className="text-sm text-muted">Hali hech kim tanlanmagan.</p>
          ) : (
            <ol className="list-decimal space-y-1 pl-5 text-sm">
              {picked.map((sid, i) => <li key={`${sid}-${i}`}>{nameOf(sid)}</li>)}
            </ol>
          )}
        </div>
      </div>
    </div>
  )
}
