'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  ListChecks,
  Pencil,
  Play,
  Plus,
  Printer,
  Trash2,
} from 'lucide-react'
import { useDarsStore } from '@/lib/dars/store'
import type { Assignment, AssignmentType, CaseStudy, Handout, Test, TestQuestion } from '@/lib/dars/types'
import { formatDate, formatTimestamp, gradeFor, todayISO, uid } from '@/lib/dars/utils'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  EmptyState,
  Field,
  IconButton,
  Modal,
  PageHeader,
  Select,
  Tabs,
  TextArea,
  TextInput,
} from '@/components/dars/ui'
import { cn } from '@/lib/utils'

type Tab = 'handouts' | 'tests' | 'assignments' | 'cases'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

const ASSIGNMENT_TYPES: Record<AssignmentType, string> = {
  individual: 'Yakka',
  group: 'Guruhli',
  homework: 'Uyga vazifa',
  project: 'Loyiha',
}

export function MaterialsView() {
  const { handouts, tests, assignments, cases } = useDarsStore()
  const [tab, setTab] = useState<Tab>('handouts')

  return (
    <>
      <PageHeader
        title="Materiallar"
        description="Tarqatma materiallar, testlar, topshiriqlar va keyslarni yarating, darsda qoʻllang va chop eting."
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'handouts', label: 'Tarqatmalar', icon: FileText, count: handouts.length },
          { value: 'tests', label: 'Testlar', icon: ListChecks, count: tests.length },
          { value: 'assignments', label: 'Topshiriqlar', icon: ClipboardCheck, count: assignments.length },
          { value: 'cases', label: 'Keyslar', icon: Briefcase, count: cases.length },
        ]}
      />
      {tab === 'handouts' && <HandoutsPanel />}
      {tab === 'tests' && <TestsPanel />}
      {tab === 'assignments' && <AssignmentsPanel />}
      {tab === 'cases' && <CasesPanel />}
    </>
  )
}

// ─── Umumiy qismlar ───────────────────────────────────────────────────────
function MaterialCard({
  title,
  badges,
  excerpt,
  meta,
  actions,
}: {
  title: string
  badges: (string | undefined)[]
  excerpt?: string
  meta?: React.ReactNode
  actions: React.ReactNode
}) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-surface p-5 shadow-card">
      <div className="mb-2 flex flex-wrap gap-1.5">
        {badges.filter(Boolean).map((b, i) => (
          <Badge key={i} variant={i === 0 ? 'primary' : 'default'}>
            {b}
          </Badge>
        ))}
      </div>
      <div className="flex-1">
        <h3 className="font-display text-lg font-semibold leading-snug text-primary">{title || 'Nomsiz'}</h3>
        {excerpt && <p className="mt-1.5 line-clamp-3 whitespace-pre-line text-sm text-muted">{excerpt}</p>}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
        {meta && <div className="mr-auto text-xs text-muted">{meta}</div>}
        <div className="ml-auto flex">{actions}</div>
      </div>
    </div>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>
}

function PanelBar({ text, onAdd, addLabel }: { text: string; onAdd: () => void; addLabel: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted">{text}</p>
      <Button onClick={onAdd}>
        <Plus size={16} /> {addLabel}
      </Button>
    </div>
  )
}

function MetaFields({
  subject,
  grade,
  onChange,
}: {
  subject: string
  grade: string
  onChange: (p: { subject?: string; grade?: string }) => void
}) {
  return (
    <>
      <Field label="Fan">
        {(id) => <TextInput id={id} value={subject} onChange={(e) => onChange({ subject: e.target.value })} />}
      </Field>
      <Field label="Sinf">
        {(id) => <TextInput id={id} value={grade} onChange={(e) => onChange({ grade: e.target.value })} placeholder="7-sinf" />}
      </Field>
    </>
  )
}

function PrintHeader({ title, subtitle, studentLine = true }: { title: string; subtitle?: string; studentLine?: boolean }) {
  return (
    <header className="mb-5 border-b border-border pb-4">
      {studentLine && (
        <p className="mb-4 flex flex-wrap gap-x-8 gap-y-1 text-sm text-muted">
          <span>Ism-familiya: ______________________</span>
          <span>Sinf: ________</span>
          <span>Sana: ____________</span>
        </p>
      )}
      <h1 className="font-display text-2xl font-bold text-primary">{title || 'Nomsiz'}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </header>
  )
}

function confirmDelete(what: string) {
  return confirm(`${what} oʻchirilsinmi?`)
}

// ─── Tarqatmalar ──────────────────────────────────────────────────────────
function emptyHandout(): Handout {
  return { id: uid(), title: '', subject: '', grade: '', content: '', createdAt: Date.now() }
}

function HandoutsPanel() {
  const { handouts, upsert, remove } = useDarsStore()
  const [draft, setDraft] = useState<Handout | null>(null)
  const [printing, setPrinting] = useState<Handout | null>(null)

  return (
    <>
      <PanelBar text="Darsda oʻquvchilarga tarqatiladigan maʼlumotnoma, jadval va matnlar." onAdd={() => setDraft(emptyHandout())} addLabel="Tarqatma" />
      {handouts.length === 0 ? (
        <EmptyState icon={FileText} title="Tarqatmalar yoʻq" text="Matn, jadval yoki eslatma tayyorlab, sinf uchun chop eting." />
      ) : (
        <Grid>
          {handouts.map((h) => (
            <MaterialCard
              key={h.id}
              title={h.title}
              badges={[h.subject, h.grade]}
              excerpt={h.content}
              actions={
                <>
                  <IconButton label="Chop etish" onClick={() => setPrinting(h)}><Printer size={15} /></IconButton>
                  <IconButton label="Tahrirlash" onClick={() => setDraft(structuredClone(h))}><Pencil size={15} /></IconButton>
                  <IconButton label="Oʻchirish" tone="danger" onClick={() => confirmDelete('Tarqatma') && remove('handouts', h.id)}><Trash2 size={15} /></IconButton>
                </>
              }
            />
          ))}
        </Grid>
      )}

      <Modal
        open={!!draft}
        onClose={() => setDraft(null)}
        title="Tarqatma material"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDraft(null)}>Bekor qilish</Button>
            <Button disabled={!draft?.title.trim()} onClick={() => { upsert('handouts', draft!); setDraft(null) }}>Saqlash</Button>
          </>
        }
      >
        {draft && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Sarlavha" className="sm:col-span-2">
              {(id) => <TextInput id={id} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} autoFocus />}
            </Field>
            <MetaFields subject={draft.subject} grade={draft.grade} onChange={(p) => setDraft({ ...draft, ...p })} />
            <Field label="Matn" className="sm:col-span-2" hint="Har bir yangi qator alohida qator boʻlib chop etiladi.">
              {(id) => <TextArea id={id} rows={12} value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />}
            </Field>
          </div>
        )}
      </Modal>

      <Modal open={!!printing} onClose={() => setPrinting(null)} title="Chop etish" size="lg" printable footer={<Button onClick={() => window.print()}><Printer size={16} /> Chop etish</Button>}>
        {printing && (
          <article className="text-dark-secondary">
            <PrintHeader title={printing.title} subtitle={[printing.subject, printing.grade].filter(Boolean).join(' · ')} studentLine={false} />
            <div className="whitespace-pre-line text-[15px] leading-relaxed">{printing.content}</div>
          </article>
        )}
      </Modal>
    </>
  )
}

// ─── Testlar ──────────────────────────────────────────────────────────────
function emptyQuestion(): TestQuestion {
  return { id: uid(), text: '', options: ['', '', '', ''], correct: 0 }
}

function emptyTest(): Test {
  return { id: uid(), title: '', subject: '', grade: '', timeLimit: 10, questions: [emptyQuestion()], createdAt: Date.now() }
}

function validateTest(t: Test): string | null {
  if (!t.title.trim()) return 'Test nomini kiriting.'
  if (t.questions.length === 0) return 'Kamida bitta savol qoʻshing.'
  for (const [i, q] of t.questions.entries()) {
    if (!q.text.trim()) return `${i + 1}-savol matni boʻsh.`
    if (q.options.filter((o) => o.trim()).length < 2) return `${i + 1}-savolda kamida 2 ta javob varianti boʻlsin.`
    if (!q.options[q.correct]?.trim()) return `${i + 1}-savolda toʻgʻri javob boʻsh variantga belgilangan.`
  }
  return null
}

/** Boʻsh variantlarni olib tashlaydi va toʻgʻri javob indeksini moslaydi. */
function cleanTest(t: Test): Test {
  return {
    ...t,
    questions: t.questions.map((q) => {
      const kept = q.options.map((o, i) => ({ o: o.trim(), i })).filter((x) => x.o)
      return { ...q, text: q.text.trim(), options: kept.map((x) => x.o), correct: kept.findIndex((x) => x.i === q.correct) }
    }),
  }
}

function TestsPanel() {
  const { tests, results, upsert, remove } = useDarsStore()
  const [draft, setDraft] = useState<Test | null>(null)
  const [printing, setPrinting] = useState<Test | null>(null)
  const [withKey, setWithKey] = useState(false)
  const [viewing, setViewing] = useState<Test | null>(null)

  const error = draft ? validateTest(draft) : null

  const setQ = (qid: string, p: Partial<TestQuestion>) =>
    draft && setDraft({ ...draft, questions: draft.questions.map((q) => (q.id === qid ? { ...q, ...p } : q)) })

  return (
    <>
      <PanelBar text="Testni sinfda kompyuter/planshetda oʻtkazing (avtomatik baholanadi) yoki qogʻozga chop eting." onAdd={() => setDraft(emptyTest())} addLabel="Test" />
      {tests.length === 0 ? (
        <EmptyState icon={ListChecks} title="Testlar yoʻq" text="Savollar va javob variantlarini kiriting — tekshirish avtomatik." />
      ) : (
        <Grid>
          {tests.map((t) => {
            const rs = results.filter((r) => r.testId === t.id)
            const avg = rs.length ? Math.round((rs.reduce((n, r) => n + r.score / r.total, 0) / rs.length) * 100) : null
            return (
              <MaterialCard
                key={t.id}
                title={t.title}
                badges={[t.subject, t.grade]}
                excerpt={`${t.questions.length} ta savol${t.timeLimit ? ` · ${t.timeLimit} daqiqa` : ''}`}
                meta={
                  rs.length > 0 ? (
                    <button className="flex items-center gap-1 hover:text-primary" onClick={() => setViewing(t)}>
                      <BarChart3 size={13} /> {rs.length} natija · oʻrtacha {avg}%
                    </button>
                  ) : (
                    'Natijalar yoʻq'
                  )
                }
                actions={
                  <>
                    <Link href={`/dars/materiallar/test/${t.id}`} aria-label="Testni boshlash" title="Testni boshlash" className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-positive hover:bg-positive/10">
                      <Play size={15} />
                    </Link>
                    <IconButton label="Chop etish" onClick={() => setPrinting(t)}><Printer size={15} /></IconButton>
                    <IconButton label="Tahrirlash" onClick={() => setDraft(structuredClone(t))}><Pencil size={15} /></IconButton>
                    <IconButton label="Oʻchirish" tone="danger" onClick={() => confirmDelete('Test va uning natijalari') && remove('tests', t.id)}><Trash2 size={15} /></IconButton>
                  </>
                }
              />
            )
          })}
        </Grid>
      )}

      {/* Test muharriri */}
      <Modal
        open={!!draft}
        onClose={() => setDraft(null)}
        title="Test tuzish"
        size="lg"
        footer={
          <>
            {error && <p className="mr-auto self-center text-xs text-negative">{error}</p>}
            <Button variant="secondary" onClick={() => setDraft(null)}>Bekor qilish</Button>
            <Button disabled={!!error} onClick={() => { upsert('tests', cleanTest(draft!)); setDraft(null) }}>Saqlash</Button>
          </>
        }
      >
        {draft && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Test nomi" className="sm:col-span-2 lg:col-span-4">
                {(id) => <TextInput id={id} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} autoFocus />}
              </Field>
              <MetaFields subject={draft.subject} grade={draft.grade} onChange={(p) => setDraft({ ...draft, ...p })} />
              <Field label="Vaqt (daq)" hint="0 — cheklanmagan">
                {(id) => <TextInput id={id} type="number" min={0} value={draft.timeLimit} onChange={(e) => setDraft({ ...draft, timeLimit: Math.max(0, Number(e.target.value)) })} />}
              </Field>
            </div>

            {draft.questions.map((q, qi) => (
              <div key={q.id} className="rounded-lg border border-border bg-background/60 p-4">
                <div className="mb-3 flex items-start gap-2">
                  <span className="mt-2.5 w-6 shrink-0 font-mono text-sm font-semibold text-primary">{qi + 1}.</span>
                  <TextArea rows={2} value={q.text} onChange={(e) => setQ(q.id, { text: e.target.value })} placeholder="Savol matni" aria-label={`${qi + 1}-savol`} />
                  <IconButton label="Savolni oʻchirish" tone="danger" className="mt-1.5" onClick={() => setDraft({ ...draft, questions: draft.questions.filter((x) => x.id !== q.id) })}>
                    <Trash2 size={15} />
                  </IconButton>
                </div>
                <div className="grid gap-2 pl-8 sm:grid-cols-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQ(q.id, { correct: oi })}
                        aria-label={`${LETTERS[oi]} — toʻgʻri javob`}
                        title="Toʻgʻri javob sifatida belgilash"
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-semibold transition-colors',
                          q.correct === oi ? 'border-positive bg-positive text-white' : 'border-border bg-surface text-muted hover:border-positive',
                        )}
                      >
                        {q.correct === oi ? <CheckCircle2 size={15} /> : LETTERS[oi]}
                      </button>
                      <TextInput
                        value={opt}
                        onChange={(e) => setQ(q.id, { options: q.options.map((o, j) => (j === oi ? e.target.value : o)) })}
                        placeholder={`${LETTERS[oi]} variant`}
                        aria-label={`${qi + 1}-savol, ${LETTERS[oi]} variant`}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-2 pl-8">
                  {q.options.length < LETTERS.length && (
                    <Button variant="ghost" size="sm" onClick={() => setQ(q.id, { options: [...q.options, ''] })}>
                      <Plus size={14} /> Variant
                    </Button>
                  )}
                  {q.options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQ(q.id, { options: q.options.slice(0, -1), correct: Math.min(q.correct, q.options.length - 2) })}
                    >
                      Oxirgi variantni olib tashlash
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setDraft({ ...draft, questions: [...draft.questions, emptyQuestion()] })}>
              <Plus size={16} /> Savol qoʻshish
            </Button>
          </div>
        )}
      </Modal>

      {/* Chop etish */}
      <Modal
        open={!!printing}
        onClose={() => setPrinting(null)}
        title="Testni chop etish"
        size="lg"
        printable
        footer={
          <>
            <label className="mr-auto flex cursor-pointer items-center gap-2 self-center text-sm text-dark-secondary">
              <input type="checkbox" checked={withKey} onChange={(e) => setWithKey(e.target.checked)} className="accent-primary" />
              Javoblar kaliti bilan
            </label>
            <Button onClick={() => window.print()}><Printer size={16} /> Chop etish</Button>
          </>
        }
      >
        {printing && (
          <article className="text-dark-secondary">
            <PrintHeader
              title={printing.title}
              subtitle={[printing.subject, printing.grade, printing.timeLimit ? `${printing.timeLimit} daqiqa` : ''].filter(Boolean).join(' · ')}
            />
            <ol className="space-y-4">
              {printing.questions.map((q, qi) => (
                <li key={q.id} className="break-inside-avoid">
                  <p className="font-medium">{qi + 1}. {q.text}</p>
                  <div className="mt-1.5 grid gap-x-6 gap-y-1 pl-5 text-[15px] sm:grid-cols-2 print:grid-cols-2">
                    {q.options.map((o, oi) => (
                      <p key={oi}>
                        <span className="font-mono font-semibold">{LETTERS[oi]})</span> {o}
                      </p>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
            {withKey && (
              <div className="mt-8 break-before-page border-t border-dashed border-border pt-4">
                <p className="mb-2 font-semibold text-primary">Javoblar kaliti</p>
                <p className="font-mono text-sm">
                  {printing.questions.map((q, i) => `${i + 1}-${LETTERS[q.correct]}`).join('   ')}
                </p>
              </div>
            )}
          </article>
        )}
      </Modal>

      {/* Natijalar */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing ? `Natijalar: ${viewing.title}` : 'Natijalar'}>
        {viewing && <ResultsTable testId={viewing.id} />}
      </Modal>
    </>
  )
}

function ResultsTable({ testId }: { testId: string }) {
  const { results, remove } = useDarsStore()
  const rows = results.filter((r) => r.testId === testId).sort((a, b) => b.score / b.total - a.score / a.total)
  if (rows.length === 0) return <p className="text-sm text-muted">Natijalar yoʻq.</p>
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
          <th className="py-2 font-semibold">Oʻquvchi</th>
          <th className="py-2 font-semibold">Natija</th>
          <th className="py-2 font-semibold">Baho</th>
          <th className="py-2 font-semibold">Sana</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const g = gradeFor(r.score, r.total)
          return (
            <tr key={r.id} className="border-b border-border last:border-0">
              <td className="py-2 font-medium">{r.studentName}</td>
              <td className="py-2 font-mono">{r.score}/{r.total}</td>
              <td className="py-2"><Badge variant={g.grade >= 4 ? 'positive' : g.grade === 3 ? 'warning' : 'negative'}>{g.grade} · {g.label}</Badge></td>
              <td className="py-2 text-xs text-muted">{formatTimestamp(r.date)}</td>
              <td className="py-2 text-right">
                <IconButton label="Natijani oʻchirish" tone="danger" onClick={() => remove('results', r.id)}><Trash2 size={14} /></IconButton>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

// ─── Topshiriqlar ─────────────────────────────────────────────────────────
function emptyAssignment(): Assignment {
  return { id: uid(), title: '', type: 'individual', subject: '', grade: '', description: '', criteria: '', dueDate: todayISO(), maxScore: 5, createdAt: Date.now() }
}

function AssignmentsPanel() {
  const { assignments, upsert, remove } = useDarsStore()
  const [draft, setDraft] = useState<Assignment | null>(null)
  const [printing, setPrinting] = useState<Assignment | null>(null)
  const sorted = [...assignments].sort((a, b) => a.dueDate.localeCompare(b.dueDate))

  return (
    <>
      <PanelBar text="Yakka, guruhli, uyga vazifa va loyiha topshiriqlari — baholash mezonlari bilan." onAdd={() => setDraft(emptyAssignment())} addLabel="Topshiriq" />
      {assignments.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="Topshiriqlar yoʻq" />
      ) : (
        <Grid>
          {sorted.map((a) => (
            <MaterialCard
              key={a.id}
              title={a.title}
              badges={[ASSIGNMENT_TYPES[a.type], a.subject, a.grade]}
              excerpt={a.description}
              meta={
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={13} /> {formatDate(a.dueDate)} · {a.maxScore} ball
                </span>
              }
              actions={
                <>
                  <IconButton label="Chop etish" onClick={() => setPrinting(a)}><Printer size={15} /></IconButton>
                  <IconButton label="Tahrirlash" onClick={() => setDraft(structuredClone(a))}><Pencil size={15} /></IconButton>
                  <IconButton label="Oʻchirish" tone="danger" onClick={() => confirmDelete('Topshiriq') && remove('assignments', a.id)}><Trash2 size={15} /></IconButton>
                </>
              }
            />
          ))}
        </Grid>
      )}

      <Modal
        open={!!draft}
        onClose={() => setDraft(null)}
        title="Topshiriq"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDraft(null)}>Bekor qilish</Button>
            <Button disabled={!draft?.title.trim()} onClick={() => { upsert('assignments', draft!); setDraft(null) }}>Saqlash</Button>
          </>
        }
      >
        {draft && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Topshiriq nomi" className="sm:col-span-2">
              {(id) => <TextInput id={id} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} autoFocus />}
            </Field>
            <Field label="Turi">
              {(id) => (
                <Select id={id} value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as AssignmentType })}>
                  {Object.entries(ASSIGNMENT_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </Select>
              )}
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Muddat">
                {(id) => <TextInput id={id} type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} />}
              </Field>
              <Field label="Maks. ball">
                {(id) => <TextInput id={id} type="number" min={1} value={draft.maxScore} onChange={(e) => setDraft({ ...draft, maxScore: Math.max(1, Number(e.target.value)) })} />}
              </Field>
            </div>
            <MetaFields subject={draft.subject} grade={draft.grade} onChange={(p) => setDraft({ ...draft, ...p })} />
            <Field label="Topshiriq mazmuni" className="sm:col-span-2">
              {(id) => <TextArea id={id} rows={5} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />}
            </Field>
            <Field label="Baholash mezonlari" className="sm:col-span-2" hint="Har bir mezonni yangi qatordan yozing.">
              {(id) => <TextArea id={id} rows={4} value={draft.criteria} onChange={(e) => setDraft({ ...draft, criteria: e.target.value })} />}
            </Field>
          </div>
        )}
      </Modal>

      <Modal open={!!printing} onClose={() => setPrinting(null)} title="Chop etish" size="lg" printable footer={<Button onClick={() => window.print()}><Printer size={16} /> Chop etish</Button>}>
        {printing && (
          <article className="text-dark-secondary">
            <PrintHeader
              title={printing.title}
              subtitle={[ASSIGNMENT_TYPES[printing.type], printing.subject, printing.grade, `Muddat: ${formatDate(printing.dueDate)}`, `${printing.maxScore} ball`].filter(Boolean).join(' · ')}
            />
            <div className="whitespace-pre-line text-[15px] leading-relaxed">{printing.description}</div>
            {printing.criteria.trim() && (
              <>
                <h2 className="mb-2 mt-6 font-semibold text-primary">Baholash mezonlari</h2>
                <ul className="list-disc space-y-1 pl-6 text-[15px]">
                  {printing.criteria.split('\n').filter((l) => l.trim()).map((l, i) => <li key={i}>{l}</li>)}
                </ul>
              </>
            )}
          </article>
        )}
      </Modal>
    </>
  )
}

// ─── Keyslar ──────────────────────────────────────────────────────────────
function emptyCase(): CaseStudy {
  return { id: uid(), title: '', subject: '', grade: '', situation: '', questions: [''], solution: '', createdAt: Date.now() }
}

function CasesPanel() {
  const { cases, upsert, remove } = useDarsStore()
  const [draft, setDraft] = useState<CaseStudy | null>(null)
  const [printing, setPrinting] = useState<CaseStudy | null>(null)

  return (
    <>
      <PanelBar text="Keys-stadi metodi uchun vaziyat, tahliliy savollar va namunaviy yechim." onAdd={() => setDraft(emptyCase())} addLabel="Keys" />
      {cases.length === 0 ? (
        <EmptyState icon={Briefcase} title="Keyslar yoʻq" text="Hayotiy vaziyatni tasvirlang va guruhlar uchun savollar tuzing." />
      ) : (
        <Grid>
          {cases.map((c) => (
            <MaterialCard
              key={c.id}
              title={c.title}
              badges={[c.subject, c.grade]}
              excerpt={c.situation}
              meta={`${c.questions.filter((q) => q.trim()).length} ta savol`}
              actions={
                <>
                  <IconButton label="Chop etish" onClick={() => setPrinting(c)}><Printer size={15} /></IconButton>
                  <IconButton label="Tahrirlash" onClick={() => setDraft(structuredClone(c))}><Pencil size={15} /></IconButton>
                  <IconButton label="Oʻchirish" tone="danger" onClick={() => confirmDelete('Keys') && remove('cases', c.id)}><Trash2 size={15} /></IconButton>
                </>
              }
            />
          ))}
        </Grid>
      )}

      <Modal
        open={!!draft}
        onClose={() => setDraft(null)}
        title="Keys (vaziyatli masala)"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDraft(null)}>Bekor qilish</Button>
            <Button
              disabled={!draft?.title.trim()}
              onClick={() => { upsert('cases', { ...draft!, questions: draft!.questions.filter((q) => q.trim()) }); setDraft(null) }}
            >
              Saqlash
            </Button>
          </>
        }
      >
        {draft && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Keys nomi" className="sm:col-span-2">
              {(id) => <TextInput id={id} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} autoFocus />}
            </Field>
            <MetaFields subject={draft.subject} grade={draft.grade} onChange={(p) => setDraft({ ...draft, ...p })} />
            <Field label="Vaziyat tavsifi" className="sm:col-span-2">
              {(id) => <TextArea id={id} rows={6} value={draft.situation} onChange={(e) => setDraft({ ...draft, situation: e.target.value })} />}
            </Field>
            <div className="sm:col-span-2">
              <p className="mb-1.5 text-sm font-medium text-dark-secondary">Tahlil uchun savollar</p>
              <ol className="space-y-2">
                {draft.questions.map((q, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-6 shrink-0 text-right font-mono text-xs text-muted">{i + 1}.</span>
                    <TextInput value={q} onChange={(e) => setDraft({ ...draft, questions: draft.questions.map((x, j) => (j === i ? e.target.value : x)) })} aria-label={`${i + 1}-savol`} />
                    <IconButton label="Savolni oʻchirish" tone="danger" onClick={() => setDraft({ ...draft, questions: draft.questions.filter((_, j) => j !== i) })}>
                      <Trash2 size={15} />
                    </IconButton>
                  </li>
                ))}
              </ol>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setDraft({ ...draft, questions: [...draft.questions, ''] })}>
                <Plus size={14} /> Savol qoʻshish
              </Button>
            </div>
            <Field label="Namunaviy yechim (oʻqituvchi uchun)" className="sm:col-span-2">
              {(id) => <TextArea id={id} rows={3} value={draft.solution} onChange={(e) => setDraft({ ...draft, solution: e.target.value })} />}
            </Field>
          </div>
        )}
      </Modal>

      <Modal open={!!printing} onClose={() => setPrinting(null)} title="Chop etish" size="lg" printable footer={<Button onClick={() => window.print()}><Printer size={16} /> Chop etish</Button>}>
        {printing && (
          <article className="text-dark-secondary">
            <PrintHeader title={`Keys: ${printing.title}`} subtitle={[printing.subject, printing.grade].filter(Boolean).join(' · ')} studentLine={false} />
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted">Vaziyat</p>
            <div className="mb-6 whitespace-pre-line rounded-lg bg-background p-4 text-[15px] leading-relaxed print:border print:border-border print:bg-transparent">
              {printing.situation}
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">Guruh uchun savollar</p>
            <ol className="list-decimal space-y-6 pl-6 text-[15px]">
              {printing.questions.map((q, i) => (
                <li key={i}>
                  {q}
                  <div className="mt-2 h-14 border-b border-dashed border-border" />
                </li>
              ))}
            </ol>
          </article>
        )}
      </Modal>
    </>
  )
}
