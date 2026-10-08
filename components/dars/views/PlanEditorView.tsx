'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Eye,
  Pencil,
  Plus,
  Printer,
  Trash2,
} from 'lucide-react'
import { useDarsStore } from '@/lib/dars/store'
import { METHODS, findMethod } from '@/lib/dars/methods'
import type { LessonPlan, LessonStage } from '@/lib/dars/types'
import { formatDate, totalMinutes, uid } from '@/lib/dars/utils'
import { Button } from '@/components/ui/Button'
import {
  EmptyState,
  Field,
  IconButton,
  PageHeader,
  Select,
  TextArea,
  TextInput,
} from '@/components/dars/ui'
import { cn } from '@/lib/utils'

const STAGE_COLORS = ['#1a1a2e', '#D4AF37', '#10B981', '#3B82F6', '#8B5CF6', '#F97316', '#EC4899', '#14B8A6']

export function PlanEditorView({ id }: { id: string }) {
  const plan = useDarsStore((s) => s.plans.find((p) => p.id === id))
  const updatePlan = useDarsStore((s) => s.updatePlan)
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')

  if (!plan) {
    return (
      <EmptyState
        icon={Pencil}
        title="Dars rejasi topilmadi"
        text="U oʻchirilgan boʻlishi yoki boshqa brauzerda yaratilgan boʻlishi mumkin."
        action={
          <Link href="/dars/rejalar">
            <Button variant="secondary">
              <ArrowLeft size={16} /> Rejalar roʻyxati
            </Button>
          </Link>
        }
      />
    )
  }

  const patch = (p: Partial<LessonPlan>) => updatePlan(plan.id, p)

  return (
    <>
      <Link
        href="/dars/rejalar"
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary print:hidden"
      >
        <ArrowLeft size={15} /> Dars rejalari
      </Link>
      <PageHeader
        title={plan.topic || 'Yangi dars rejasi'}
        description={mode === 'edit' ? 'Oʻzgarishlar avtomatik saqlanadi.' : 'Chop etishga tayyor koʻrinish.'}
        actions={
          mode === 'edit' ? (
            <Button variant="secondary" onClick={() => setMode('preview')}>
              <Eye size={16} /> Koʻrish
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setMode('edit')}>
                <Pencil size={16} /> Tahrirlash
              </Button>
              <Button onClick={() => window.print()}>
                <Printer size={16} /> Chop etish
              </Button>
            </>
          )
        }
      />

      {mode === 'edit' ? <PlanForm plan={plan} patch={patch} /> : <PlanDocument plan={plan} />}
    </>
  )
}

// ─── Tahrirlash formasi ───────────────────────────────────────────────────
function Section({ n, title, children, aside }: { n: number; title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xs font-semibold text-gold">
          {n}
        </span>
        <h2 className="font-display text-lg font-semibold text-primary">{title}</h2>
        {aside && <div className="ml-auto">{aside}</div>}
      </div>
      {children}
    </section>
  )
}

function PlanForm({ plan, patch }: { plan: LessonPlan; patch: (p: Partial<LessonPlan>) => void }) {
  const total = totalMinutes(plan.stages)

  const setStage = (sid: string, p: Partial<LessonStage>) =>
    patch({ stages: plan.stages.map((s) => (s.id === sid ? { ...s, ...p } : s)) })

  const moveStage = (i: number, dir: -1 | 1) => {
    const next = [...plan.stages]
    ;[next[i], next[i + dir]] = [next[i + dir], next[i]]
    patch({ stages: next })
  }

  const setTask = (i: number, value: string) => patch({ tasks: plan.tasks.map((t, j) => (j === i ? value : t)) })

  return (
    <div className="space-y-5">
      <Section n={1} title="Umumiy maʼlumot">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Mavzu" className="sm:col-span-2 lg:col-span-3">
            {(id) => (
              <TextInput id={id} value={plan.topic} onChange={(e) => patch({ topic: e.target.value })} placeholder="Masalan: Kasrlarni qoʻshish" />
            )}
          </Field>
          <Field label="Fan">
            {(id) => <TextInput id={id} value={plan.subject} onChange={(e) => patch({ subject: e.target.value })} placeholder="Matematika" />}
          </Field>
          <Field label="Sinf">
            {(id) => <TextInput id={id} value={plan.grade} onChange={(e) => patch({ grade: e.target.value })} placeholder="5-sinf" />}
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sana">
              {(id) => <TextInput id={id} type="date" value={plan.date} onChange={(e) => patch({ date: e.target.value })} />}
            </Field>
            <Field label="Davomiyligi (daq)">
              {(id) => (
                <TextInput
                  id={id}
                  type="number"
                  min={5}
                  max={240}
                  value={plan.duration}
                  onChange={(e) => patch({ duration: Math.max(0, Number(e.target.value)) })}
                />
              )}
            </Field>
          </div>
        </div>
      </Section>

      <Section n={2} title="Dars maqsadi">
        <div className="grid gap-4 lg:grid-cols-3">
          <Field label="Taʼlimiy maqsad">
            {(id) => (
              <TextArea id={id} rows={4} value={plan.goals.educational} onChange={(e) => patch({ goals: { ...plan.goals, educational: e.target.value } })} placeholder="Oʻquvchilarga … haqida bilim berish" />
            )}
          </Field>
          <Field label="Tarbiyaviy maqsad">
            {(id) => (
              <TextArea id={id} rows={4} value={plan.goals.upbringing} onChange={(e) => patch({ goals: { ...plan.goals, upbringing: e.target.value } })} placeholder="… ruhida tarbiyalash" />
            )}
          </Field>
          <Field label="Rivojlantiruvchi maqsad">
            {(id) => (
              <TextArea id={id} rows={4} value={plan.goals.developmental} onChange={(e) => patch({ goals: { ...plan.goals, developmental: e.target.value } })} placeholder="… koʻnikmalarini rivojlantirish" />
            )}
          </Field>
        </div>
      </Section>

      <Section n={3} title="Dars vazifalari">
        <ol className="space-y-2">
          {plan.tasks.map((t, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-6 shrink-0 text-right font-mono text-xs text-muted">{i + 1}.</span>
              <TextInput value={t} onChange={(e) => setTask(i, e.target.value)} placeholder="Vazifa matni" aria-label={`Vazifa ${i + 1}`} />
              <IconButton label="Vazifani oʻchirish" tone="danger" onClick={() => patch({ tasks: plan.tasks.filter((_, j) => j !== i) })}>
                <Trash2 size={15} />
              </IconButton>
            </li>
          ))}
        </ol>
        <Button variant="ghost" size="sm" className="mt-3" onClick={() => patch({ tasks: [...plan.tasks, ''] })}>
          <Plus size={15} /> Vazifa qoʻshish
        </Button>
      </Section>

      <Section
        n={4}
        title="Dars bosqichlari"
        aside={
          <span
            className={cn(
              'flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-xs font-medium',
              total === plan.duration ? 'bg-positive/10 text-positive' : 'bg-gold/15 text-gold',
            )}
          >
            {total === plan.duration && <Check size={13} />}
            {total} / {plan.duration} daq
          </span>
        }
      >
        <TimeBar stages={plan.stages} duration={plan.duration} />
        {total !== plan.duration && (
          <p className="mb-4 text-xs text-gold">
            {total > plan.duration
              ? `Bosqichlar dars vaqtidan ${total - plan.duration} daqiqa koʻp.`
              : `Yana ${plan.duration - total} daqiqa taqsimlanmagan.`}
          </p>
        )}

        <div className="space-y-3">
          {plan.stages.map((st, i) => (
            <div key={st.id} className="rounded-lg border border-border bg-background/60 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: STAGE_COLORS[i % STAGE_COLORS.length] }} />
                <TextInput
                  value={st.title}
                  onChange={(e) => setStage(st.id, { title: e.target.value })}
                  placeholder="Bosqich nomi"
                  aria-label="Bosqich nomi"
                  className="min-w-0 flex-1 font-medium"
                />
                <div className="flex items-center gap-1.5">
                  <TextInput
                    type="number"
                    min={0}
                    value={st.minutes}
                    onChange={(e) => setStage(st.id, { minutes: Math.max(0, Number(e.target.value)) })}
                    aria-label="Daqiqa"
                    className="w-20 text-center font-mono"
                  />
                  <span className="text-xs text-muted">daq</span>
                </div>
                <div className="flex">
                  <IconButton label="Yuqoriga" disabled={i === 0} onClick={() => moveStage(i, -1)}>
                    <ArrowUp size={15} />
                  </IconButton>
                  <IconButton label="Pastga" disabled={i === plan.stages.length - 1} onClick={() => moveStage(i, 1)}>
                    <ArrowDown size={15} />
                  </IconButton>
                  <IconButton label="Bosqichni oʻchirish" tone="danger" onClick={() => patch({ stages: plan.stages.filter((s) => s.id !== st.id) })}>
                    <Trash2 size={15} />
                  </IconButton>
                </div>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <Field label="Interfaol metod">
                  {(id) => (
                    <Select id={id} value={st.methodId ?? ''} onChange={(e) => setStage(st.id, { methodId: e.target.value || undefined })}>
                      <option value="">— Tanlanmagan —</option>
                      {METHODS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
                <Field label="Oʻqituvchi faoliyati">
                  {(id) => <TextArea id={id} rows={2} value={st.teacher} onChange={(e) => setStage(st.id, { teacher: e.target.value })} />}
                </Field>
                <Field label="Oʻquvchi faoliyati">
                  {(id) => <TextArea id={id} rows={2} value={st.students} onChange={(e) => setStage(st.id, { students: e.target.value })} />}
                </Field>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3"
          onClick={() =>
            patch({
              stages: [
                ...plan.stages,
                { id: uid(), title: '', minutes: Math.max(0, plan.duration - total), teacher: '', students: '' },
              ],
            })
          }
        >
          <Plus size={15} /> Bosqich qoʻshish
        </Button>
      </Section>

      <Section n={5} title="Jihozlar, natija va uyga vazifa">
        <div className="grid gap-4 lg:grid-cols-3">
          <Field label="Dars jihozlari">
            {(id) => <TextArea id={id} rows={3} value={plan.equipment} onChange={(e) => patch({ equipment: e.target.value })} placeholder="Darslik, proyektor, tarqatmalar…" />}
          </Field>
          <Field label="Kutilayotgan natija">
            {(id) => <TextArea id={id} rows={3} value={plan.outcomes} onChange={(e) => patch({ outcomes: e.target.value })} placeholder="Dars yakunida oʻquvchi …" />}
          </Field>
          <Field label="Uyga vazifa">
            {(id) => <TextArea id={id} rows={3} value={plan.homework} onChange={(e) => patch({ homework: e.target.value })} />}
          </Field>
        </div>
      </Section>
    </div>
  )
}

function TimeBar({ stages, duration }: { stages: LessonStage[]; duration: number }) {
  const total = Math.max(totalMinutes(stages), duration, 1)
  return (
    <div className="mb-3 flex h-3 overflow-hidden rounded-full bg-border" aria-hidden>
      {stages.map((st, i) =>
        st.minutes > 0 ? (
          <div
            key={st.id}
            title={`${st.title}: ${st.minutes} daq`}
            className="h-full border-r border-surface last:border-r-0"
            style={{ width: `${(st.minutes / total) * 100}%`, background: STAGE_COLORS[i % STAGE_COLORS.length] }}
          />
        ) : null,
      )}
    </div>
  )
}

// ─── Chop etish koʻrinishi ────────────────────────────────────────────────
function PlanDocument({ plan }: { plan: LessonPlan }) {
  const tasks = plan.tasks.filter((t) => t.trim())
  const starts = plan.stages.map((_, i) => totalMinutes(plan.stages.slice(0, i)))
  return (
    <article className="mx-auto max-w-4xl rounded-xl border border-border bg-surface p-6 text-[15px] leading-relaxed text-dark-secondary shadow-card sm:p-10 print:border-0 print:p-0 print:shadow-none">
      <header className="mb-6 border-b border-border pb-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">Dars ishlanmasi</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-primary">{plan.topic || 'Nomsiz mavzu'}</h1>
        <p className="mt-2 text-sm text-muted">
          {[plan.subject && `Fan: ${plan.subject}`, plan.grade && `Sinf: ${plan.grade}`, `Sana: ${formatDate(plan.date)}`, `Davomiyligi: ${plan.duration} daqiqa`]
            .filter(Boolean)
            .join('   ·   ')}
        </p>
      </header>

      <h2 className="mb-2 font-semibold text-primary">Dars maqsadi</h2>
      <dl className="mb-5 space-y-1.5">
        {(
          [
            ['Taʼlimiy', plan.goals.educational],
            ['Tarbiyaviy', plan.goals.upbringing],
            ['Rivojlantiruvchi', plan.goals.developmental],
          ] as const
        ).map(([k, v]) => (
          <div key={k}>
            <dt className="inline font-medium">{k}: </dt>
            <dd className="inline">{v || '—'}</dd>
          </div>
        ))}
      </dl>

      {tasks.length > 0 && (
        <>
          <h2 className="mb-2 font-semibold text-primary">Dars vazifalari</h2>
          <ol className="mb-5 list-decimal space-y-1 pl-6">
            {tasks.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ol>
        </>
      )}

      {plan.equipment && (
        <p className="mb-5">
          <span className="font-semibold text-primary">Dars jihozlari: </span>
          {plan.equipment}
        </p>
      )}

      <h2 className="mb-2 font-semibold text-primary">Darsning borishi</h2>
      <div className="mb-5 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-background text-left">
              <th className="border border-border px-2 py-2 font-semibold">№</th>
              <th className="border border-border px-2 py-2 font-semibold">Bosqich</th>
              <th className="border border-border px-2 py-2 font-semibold">Vaqt</th>
              <th className="border border-border px-2 py-2 font-semibold">Oʻqituvchi faoliyati</th>
              <th className="border border-border px-2 py-2 font-semibold">Oʻquvchi faoliyati</th>
            </tr>
          </thead>
          <tbody>
            {plan.stages.map((st, i) => {
              const from = starts[i]
              const method = findMethod(st.methodId)
              return (
                <tr key={st.id} className="align-top">
                  <td className="border border-border px-2 py-2 font-mono">{i + 1}</td>
                  <td className="border border-border px-2 py-2">
                    <p className="font-medium">{st.title || '—'}</p>
                    {method && <p className="mt-0.5 text-xs text-muted">Metod: {method.name}</p>}
                  </td>
                  <td className="whitespace-nowrap border border-border px-2 py-2 font-mono text-xs">
                    {st.minutes} daq
                    <span className="block text-muted">
                      {from}–{from + st.minutes}
                    </span>
                  </td>
                  <td className="border border-border px-2 py-2 whitespace-pre-line">{st.teacher}</td>
                  <td className="border border-border px-2 py-2 whitespace-pre-line">{st.students}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {plan.outcomes && (
        <p className="mb-3">
          <span className="font-semibold text-primary">Kutilayotgan natija: </span>
          {plan.outcomes}
        </p>
      )}
      {plan.homework && (
        <p>
          <span className="font-semibold text-primary">Uyga vazifa: </span>
          {plan.homework}
        </p>
      )}
    </article>
  )
}
