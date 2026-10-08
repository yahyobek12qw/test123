import type { AttendanceStatus, LessonStage } from './types'

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

/** Mahalliy vaqt boʻyicha bugungi sana, YYYY-MM-DD */
export function todayISO(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

const MONTHS = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
]

export function formatDate(iso: string): string {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return `${d}-${MONTHS[m - 1]}, ${y}`
}

export function totalMinutes(stages: LessonStage[]): number {
  return stages.reduce((sum, s) => sum + (Number(s.minutes) || 0), 0)
}

export function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function attendanceKey(classId: string, date: string): string {
  return `${classId}|${date}`
}

export const ATTENDANCE_LABELS: Record<AttendanceStatus, string> = {
  present: 'Keldi',
  late: 'Kechikdi',
  excused: 'Sababli',
  absent: 'Kelmadi',
}

export const ATTENDANCE_STYLES: Record<AttendanceStatus, string> = {
  present: 'bg-positive text-white border-positive',
  late: 'bg-gold text-white border-gold',
  excused: 'bg-sky-600 text-white border-sky-600',
  absent: 'bg-negative text-white border-negative',
}

export function gradeFor(score: number, total: number): { grade: number; label: string } {
  const pct = total ? (score / total) * 100 : 0
  if (pct >= 86) return { grade: 5, label: 'Aʼlo' }
  if (pct >= 71) return { grade: 4, label: 'Yaxshi' }
  if (pct >= 56) return { grade: 3, label: 'Qoniqarli' }
  return { grade: 2, label: 'Qoniqarsiz' }
}

export function formatTimestamp(ts: number): string {
  const d = new Date(ts)
  return `${d.getDate()}-${MONTHS[d.getMonth()]}, ${d.getFullYear()}`
}
