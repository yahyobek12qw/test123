'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, ListChecks, RotateCcw, XCircle } from 'lucide-react'
import { useDarsStore } from '@/lib/dars/store'
import { gradeFor, uid } from '@/lib/dars/utils'
import { Button } from '@/components/ui/Button'
import { EmptyState, Field, TextInput } from '@/components/dars/ui'
import { cn } from '@/lib/utils'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

type Phase = 'intro' | 'running' | 'done'

function formatClock(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export function TestRunnerView({ id }: { id: string }) {
  const test = useDarsStore((s) => s.tests.find((t) => t.id === id))
  const classes = useDarsStore((s) => s.classes)
  const upsert = useDarsStore((s) => s.upsert)

  const [phase, setPhase] = useState<Phase>('intro')
  const [name, setName] = useState('')
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [endsAt, setEndsAt] = useState<number | null>(null)
  const [now, setNow] = useState(0)
  const answersRef = useRef<Record<string, number>>({})
  const finishedRef = useRef(false)

  const finish = useCallback(() => {
    if (!test || finishedRef.current) return
    finishedRef.current = true
    const score = test.questions.filter((q) => answersRef.current[q.id] === q.correct).length
    upsert('results', {
      id: uid(),
      testId: test.id,
      studentName: name.trim() || 'Nomaʼlum',
      score,
      total: test.questions.length,
      date: Date.now(),
    })
    setPhase('done')
  }, [test, name, upsert])

  useEffect(() => {
    if (phase !== 'running' || !endsAt) return
    const timer = setInterval(() => {
      const t = Date.now()
      setNow(t)
      if (t >= endsAt) finish()
    }, 250)
    return () => clearInterval(timer)
  }, [phase, endsAt, finish])

  if (!test) {
    return (
      <EmptyState
        icon={ListChecks}
        title="Test topilmadi"
        action={
          <Link href="/dars/materiallar">
            <Button variant="secondary"><ArrowLeft size={16} /> Materiallar</Button>
          </Link>
        }
      />
    )
  }

  const start = () => {
    answersRef.current = {}
    finishedRef.current = false
    setAnswers({})
    const t = Date.now()
    setNow(t)
    setEndsAt(test.timeLimit ? t + test.timeLimit * 60_000 : null)
    setPhase('running')
  }

  const choose = (qid: string, oi: number) => {
    const next = { ...answersRef.current, [qid]: oi }
    answersRef.current = next
    setAnswers(next)
  }

  const reset = () => {
    setName('')
    setPhase('intro')
  }

  const answered = Object.keys(answers).length
  const total = test.questions.length
  const score = test.questions.filter((q) => answers[q.id] === q.correct).length
  const studentNames = Array.from(new Set(classes.flatMap((c) => c.students.map((s) => s.name))))

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dars/materiallar" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary">
        <ArrowLeft size={15} /> Materiallar
      </Link>

      {phase === 'intro' && (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            {[test.subject, test.grade].filter(Boolean).join(' · ') || 'Test'}
          </p>
          <h1 className="mt-1 font-display text-display-sm font-bold text-primary">{test.title}</h1>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5"><ListChecks size={15} /> {total} ta savol</span>
            <span className="flex items-center gap-1.5"><Clock size={15} /> {test.timeLimit ? `${test.timeLimit} daqiqa` : 'Vaqt cheklanmagan'}</span>
          </div>
          <form
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault()
              if (name.trim()) start()
            }}
          >
            <Field label="Oʻquvchining ismi" className="flex-1">
              {(fid) => (
                <>
                  <TextInput id={fid} value={name} onChange={(e) => setName(e.target.value)} list="students-list" placeholder="Familiya Ism" autoFocus />
                  <datalist id="students-list">
                    {studentNames.map((n) => <option key={n} value={n} />)}
                  </datalist>
                </>
              )}
            </Field>
            <Button type="submit" size="lg" disabled={!name.trim()}>Testni boshlash</Button>
          </form>
        </div>
      )}

      {phase === 'running' && (
        <>
          <div className="sticky top-28 z-10 mb-4 flex items-center gap-4 rounded-xl border border-border bg-surface/95 px-4 py-3 shadow-card backdrop-blur lg:top-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-primary">{name}</p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(answered / total) * 100}%` }} />
              </div>
            </div>
            <span className="font-mono text-xs text-muted">{answered}/{total}</span>
            {endsAt && (
              <span className={cn('flex items-center gap-1.5 font-mono text-sm font-semibold', endsAt - now < 60_000 ? 'text-negative' : 'text-primary')}>
                <Clock size={15} /> {formatClock(endsAt - now)}
              </span>
            )}
          </div>

          <ol className="space-y-4">
            {test.questions.map((q, qi) => (
              <li key={q.id} className="rounded-xl border border-border bg-surface p-5 shadow-card">
                <p className="font-medium text-dark-secondary">
                  <span className="mr-1 font-mono text-primary">{qi + 1}.</span> {q.text}
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {q.options.map((o, oi) => {
                    const selected = answers[q.id] === oi
                    return (
                      <button
                        key={oi}
                        type="button"
                        onClick={() => choose(q.id, oi)}
                        aria-pressed={selected}
                        className={cn(
                          'flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                          selected ? 'border-primary bg-primary text-white' : 'border-border hover:border-primary/40 hover:bg-background',
                        )}
                      >
                        <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold', selected ? 'bg-gold text-primary' : 'bg-background text-muted')}>
                          {LETTERS[oi]}
                        </span>
                        {o}
                      </button>
                    )
                  })}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex justify-end">
            <Button
              size="lg"
              onClick={() => {
                if (answered < total && !confirm(`${total - answered} ta savolga javob berilmagan. Yakunlansinmi?`)) return
                finish()
              }}
            >
              Yakunlash
            </Button>
          </div>
        </>
      )}

      {phase === 'done' && (
        <>
          <ResultSummary name={name} score={score} total={total} onRestart={reset} />
          <ol className="mt-6 space-y-3">
            {test.questions.map((q, qi) => {
              const a = answers[q.id]
              const ok = a === q.correct
              return (
                <li key={q.id} className="rounded-xl border border-border bg-surface p-4">
                  <p className="flex items-start gap-2 text-sm font-medium text-dark-secondary">
                    {ok ? <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-positive" /> : <XCircle size={17} className="mt-0.5 shrink-0 text-negative" />}
                    <span>{qi + 1}. {q.text}</span>
                  </p>
                  <p className="mt-1.5 pl-6 text-sm text-muted">
                    {a === undefined ? 'Javob berilmagan' : `Javob: ${LETTERS[a]}) ${q.options[a]}`}
                    {!ok && (
                      <span className="block text-positive">Toʻgʻri javob: {LETTERS[q.correct]}) {q.options[q.correct]}</span>
                    )}
                  </p>
                </li>
              )
            })}
          </ol>
        </>
      )}
    </div>
  )
}

function ResultSummary({ name, score, total, onRestart }: { name: string; score: number; total: number; onRestart: () => void }) {
  const g = gradeFor(score, total)
  const pct = total ? Math.round((score / total) * 100) : 0
  return (
    <div className="rounded-2xl bg-primary p-6 text-white sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-gold">Natija</p>
      <h1 className="mt-1 font-display text-2xl font-bold">{name}</h1>
      <div className="mt-5 flex flex-wrap items-end gap-8">
        <div>
          <p className="font-display text-5xl font-bold font-numeric">{score}<span className="text-2xl text-white/50">/{total}</span></p>
          <p className="mt-1 text-sm text-white/60">{pct}% toʻgʻri</p>
        </div>
        <div>
          <p className="font-display text-5xl font-bold text-gold">{g.grade}</p>
          <p className="mt-1 text-sm text-white/60">{g.label}</p>
        </div>
        <Button className="ml-auto bg-gold text-primary hover:bg-gold/90" onClick={onRestart}>
          <RotateCcw size={16} /> Keyingi oʻquvchi
        </Button>
      </div>
    </div>
  )
}
