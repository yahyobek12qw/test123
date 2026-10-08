// ─── Dars rejasi ──────────────────────────────────────────────────────────
export interface LessonStage {
  id: string
  title: string
  minutes: number
  teacher: string
  students: string
  methodId?: string
}

export interface LessonGoals {
  educational: string
  upbringing: string
  developmental: string
}

export interface LessonPlan {
  id: string
  subject: string
  topic: string
  grade: string
  date: string
  duration: number
  goals: LessonGoals
  tasks: string[]
  stages: LessonStage[]
  equipment: string
  outcomes: string
  homework: string
  createdAt: number
  updatedAt: number
}

// ─── Materiallar ──────────────────────────────────────────────────────────
export interface Handout {
  id: string
  title: string
  subject: string
  grade: string
  content: string
  createdAt: number
}

export interface TestQuestion {
  id: string
  text: string
  options: string[]
  correct: number
}

export interface Test {
  id: string
  title: string
  subject: string
  grade: string
  timeLimit: number
  questions: TestQuestion[]
  createdAt: number
}

export interface TestResult {
  id: string
  testId: string
  studentName: string
  score: number
  total: number
  date: number
}

export type AssignmentType = 'individual' | 'group' | 'homework' | 'project'

export interface Assignment {
  id: string
  title: string
  type: AssignmentType
  subject: string
  grade: string
  description: string
  criteria: string
  dueDate: string
  maxScore: number
  createdAt: number
}

export interface CaseStudy {
  id: string
  title: string
  subject: string
  grade: string
  situation: string
  questions: string[]
  solution: string
  createdAt: number
}

// ─── Sinf boshqaruvi ──────────────────────────────────────────────────────
export interface Student {
  id: string
  name: string
}

export interface SchoolClass {
  id: string
  name: string
  students: Student[]
  rules: string[]
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

export interface BehaviorEntry {
  id: string
  classId: string
  studentId: string
  points: number
  reason: string
  date: number
}

// ─── Interfaol metodlar ───────────────────────────────────────────────────
export type MethodCategory = 'guruh' | 'keys' | 'munozara' | 'grafik' | 'faollashtirish'

export interface InteractiveMethod {
  id: string
  name: string
  category: MethodCategory
  duration: string
  groupSize: string
  goal: string
  steps: string[]
  tips: string[]
}
