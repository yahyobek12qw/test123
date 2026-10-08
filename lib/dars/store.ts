'use client'

import { useSyncExternalStore } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Assignment,
  AttendanceStatus,
  BehaviorEntry,
  CaseStudy,
  Handout,
  LessonPlan,
  LessonStage,
  SchoolClass,
  Test,
  TestResult,
} from './types'
import { attendanceKey, todayISO, uid } from './utils'

interface Collections {
  plans: LessonPlan[]
  handouts: Handout[]
  tests: Test[]
  results: TestResult[]
  assignments: Assignment[]
  cases: CaseStudy[]
  classes: SchoolClass[]
  behavior: BehaviorEntry[]
}

type CollectionKey = keyof Collections

interface DarsStore extends Collections {
  /** `${classId}|${date}` → { studentId: status } */
  attendance: Record<string, Record<string, AttendanceStatus>>

  upsert: <K extends CollectionKey>(key: K, item: Collections[K][number]) => void
  remove: (key: CollectionKey, id: string) => void

  createPlan: () => string
  updatePlan: (id: string, patch: Partial<LessonPlan>) => void
  duplicatePlan: (id: string) => string | undefined

  updateClass: (id: string, patch: Partial<SchoolClass>) => void
  setAttendance: (classId: string, date: string, studentId: string, status: AttendanceStatus) => void
  markAllPresent: (classId: string, date: string) => void
  addBehavior: (entry: Omit<BehaviorEntry, 'id' | 'date'>) => void
}

export function defaultStages(): LessonStage[] {
  return [
    { id: uid(), title: 'Tashkiliy qism', minutes: 2, teacher: 'Salomlashish, davomatni aniqlash, darsga tayyorgarlikni tekshirish.', students: 'Darsga tayyorlanadi.' },
    { id: uid(), title: 'Uy vazifasini soʻrash va takrorlash', minutes: 8, teacher: 'Oʻtilgan mavzu boʻyicha savollar beradi.', students: 'Savollarga javob beradi.', methodId: 'blits' },
    { id: uid(), title: 'Yangi mavzu bayoni', minutes: 15, teacher: 'Yangi mavzuni tushuntiradi, koʻrgazmalardan foydalanadi.', students: 'Tinglaydi, daftarga yozadi, savol beradi.' },
    { id: uid(), title: 'Mustahkamlash', minutes: 12, teacher: 'Guruhlarga topshiriq beradi, yoʻnaltiradi.', students: 'Guruhda ishlaydi, natijani taqdim etadi.', methodId: 'klaster' },
    { id: uid(), title: 'Baholash va refleksiya', minutes: 5, teacher: 'Faol oʻquvchilarni baholaydi, xulosa qiladi.', students: 'Oʻz ishini tahlil qiladi.', methodId: 'sinkveyn' },
    { id: uid(), title: 'Uyga vazifa', minutes: 3, teacher: 'Uy vazifasini tushuntiradi.', students: 'Kundaliklarga yozadi.' },
  ]
}

export function emptyPlan(): LessonPlan {
  const now = Date.now()
  return {
    id: uid(),
    subject: '',
    topic: '',
    grade: '',
    date: todayISO(),
    duration: 45,
    goals: { educational: '', upbringing: '', developmental: '' },
    tasks: [''],
    stages: defaultStages(),
    equipment: '',
    outcomes: '',
    homework: '',
    createdAt: now,
    updatedAt: now,
  }
}

export const DEFAULT_RULES = [
  'Darsga oʻz vaqtida kelamiz.',
  'Gapirishdan oldin qoʻl koʻtaramiz.',
  'Bir-birimizni tinglaymiz va hurmat qilamiz.',
  'Dars vaqtida telefonni ovozsiz rejimga qoʻyamiz.',
  'Uy vazifasini bajarib kelamiz.',
]

function seed(): Collections {
  const names = [
    'Abdullayev Jasur', 'Aliyeva Madina', 'Boboyev Sardor', 'Karimova Dilnoza',
    'Mirzayev Otabek', 'Nazarova Sevara', 'Qodirov Behruz', 'Rahimova Nilufar',
    'Saidov Azizbek', 'Toʻxtayeva Zarina', 'Usmonov Doniyor', 'Xolmatova Shahzoda',
  ]
  const cls: SchoolClass = {
    id: uid(),
    name: '7-A sinf',
    students: names.map((name) => ({ id: uid(), name })),
    rules: DEFAULT_RULES,
  }
  const plan: LessonPlan = {
    ...emptyPlan(),
    subject: 'Biologiya',
    topic: 'Oʻsimlik hujayrasining tuzilishi',
    grade: '7-sinf',
    goals: {
      educational: 'Oʻquvchilarga oʻsimlik hujayrasining asosiy qismlari va ularning vazifalari haqida bilim berish.',
      upbringing: 'Tabiatga ehtiyotkorona munosabat va jamoada ishlash madaniyatini tarbiyalash.',
      developmental: 'Kuzatish, taqqoslash va xulosa chiqarish koʻnikmalarini rivojlantirish.',
    },
    tasks: [
      'Hujayra qobigʻi, sitoplazma, yadro va vakuolani farqlashni oʻrgatish.',
      'Mikroskopda ishlash koʻnikmasini mustahkamlash.',
      'Oʻsimlik va hayvon hujayrasini taqqoslay olish.',
    ],
    equipment: 'Mikroskop, piyoz poʻsti preparati, hujayra jadvali, tarqatma materiallar.',
    outcomes: 'Oʻquvchi hujayra qismlarini ayta oladi, ularning vazifasini tushuntiradi va Venn diagrammasi orqali taqqoslaydi.',
    homework: '§12 ni oʻqish, hujayra rasmini chizib qismlarini belgilash.',
  }
  const now = Date.now()
  return {
    plans: [plan],
    handouts: [
      {
        id: uid(),
        title: 'Hujayra qismlari — maʼlumotnoma',
        subject: 'Biologiya',
        grade: '7-sinf',
        content:
          'Hujayra qobigʻi — hujayraga shakl beradi va uni himoya qiladi.\nSitoplazma — hujayraning ichki yarim suyuq muhiti.\nYadro — irsiy axborotni saqlaydi va hujayra faoliyatini boshqaradi.\nVakuola — hujayra shirasi bilan toʻla boʻshliq.\nXloroplast — fotosintez jarayoni sodir boʻladigan organoid.',
        createdAt: now,
      },
    ],
    tests: [
      {
        id: uid(),
        title: 'Hujayra tuzilishi — mini test',
        subject: 'Biologiya',
        grade: '7-sinf',
        timeLimit: 10,
        createdAt: now,
        questions: [
          { id: uid(), text: 'Irsiy axborot hujayraning qaysi qismida saqlanadi?', options: ['Vakuolada', 'Yadroda', 'Sitoplazmada', 'Qobiqda'], correct: 1 },
          { id: uid(), text: 'Fotosintez qaysi organoidda sodir boʻladi?', options: ['Mitoxondriya', 'Ribosoma', 'Xloroplast', 'Vakuola'], correct: 2 },
          { id: uid(), text: 'Hujayraga shakl beruvchi qism qaysi?', options: ['Hujayra qobigʻi', 'Yadrocha', 'Sitoplazma', 'Vakuola'], correct: 0 },
        ],
      },
    ],
    results: [],
    assignments: [
      {
        id: uid(),
        title: 'Hujayra modelini yasash',
        type: 'project',
        subject: 'Biologiya',
        grade: '7-sinf',
        description: 'Plastilin yoki qogʻozdan oʻsimlik hujayrasi modelini yasang va har bir qismini belgilang.',
        criteria: 'Barcha qismlar mavjud — 4 ball\nToʻgʻri belgilangan — 3 ball\nTaqdimot — 3 ball',
        dueDate: todayISO(),
        maxScore: 10,
        createdAt: now,
      },
    ],
    cases: [
      {
        id: uid(),
        title: 'Soʻlib qolgan uy gullari',
        subject: 'Biologiya',
        grade: '7-sinf',
        situation:
          'Dilnoza taʼtilga ketishdan oldin xonadagi gullarni deraza oldidan qorongʻi burchakka olib qoʻydi va sugʻorishni unutdi. Ikki haftadan soʻng qaytganida gullarning barglari sargʻayib, soʻlib qolgan edi.',
        questions: [
          'Gullar nima uchun soʻlib qoldi? Hujayra darajasida tushuntiring.',
          'Qaysi organoidlar faoliyati buzildi?',
          'Dilnozaga qanday maslahat bergan boʻlardingiz?',
        ],
        solution: 'Yorugʻlik yetishmasligi xloroplastlarda fotosintezni toʻxtatdi; suv yetishmasligi vakuolalar hajmini kamaytirib, hujayra turgorini pasaytirdi.',
        createdAt: now,
      },
    ],
    classes: [cls],
    behavior: [],
  }
}

export const useDarsStore = create<DarsStore>()(
  persist(
    (set, get) => ({
      ...seed(),
      attendance: {},

      upsert: (key, item) =>
        set((s) => {
          const list = s[key] as { id: string }[]
          const exists = list.some((x) => x.id === item.id)
          const next = exists ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list]
          return { [key]: next } as Partial<DarsStore>
        }),

      remove: (key, id) =>
        set((s) => {
          const patch: Partial<DarsStore> = {
            [key]: (s[key] as { id: string }[]).filter((x) => x.id !== id),
          }
          if (key === 'classes') {
            patch.behavior = s.behavior.filter((b) => b.classId !== id)
            patch.attendance = Object.fromEntries(
              Object.entries(s.attendance).filter(([k]) => !k.startsWith(`${id}|`)),
            )
          }
          if (key === 'tests') patch.results = s.results.filter((r) => r.testId !== id)
          return patch
        }),

      createPlan: () => {
        const plan = emptyPlan()
        set((s) => ({ plans: [plan, ...s.plans] }))
        return plan.id
      },

      updatePlan: (id, patch) =>
        set((s) => ({
          plans: s.plans.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p)),
        })),

      duplicatePlan: (id) => {
        const src = get().plans.find((p) => p.id === id)
        if (!src) return undefined
        const now = Date.now()
        const copy: LessonPlan = {
          ...structuredClone(src),
          id: uid(),
          topic: `${src.topic} (nusxa)`,
          stages: src.stages.map((st) => ({ ...st, id: uid() })),
          createdAt: now,
          updatedAt: now,
        }
        set((s) => ({ plans: [copy, ...s.plans] }))
        return copy.id
      },

      updateClass: (id, patch) =>
        set((s) => ({ classes: s.classes.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),

      setAttendance: (classId, date, studentId, status) =>
        set((s) => {
          const key = attendanceKey(classId, date)
          return { attendance: { ...s.attendance, [key]: { ...s.attendance[key], [studentId]: status } } }
        }),

      markAllPresent: (classId, date) =>
        set((s) => {
          const cls = s.classes.find((c) => c.id === classId)
          if (!cls) return {}
          const key = attendanceKey(classId, date)
          const day = Object.fromEntries(cls.students.map((st) => [st.id, 'present' as const]))
          return { attendance: { ...s.attendance, [key]: day } }
        }),

      addBehavior: (entry) =>
        set((s) => ({ behavior: [{ ...entry, id: uid(), date: Date.now() }, ...s.behavior] })),
    }),
    {
      name: 'dars-tashkil-etish',
      version: 1,
      skipHydration: true,
    },
  ),
)

const subscribeHydration = (cb: () => void) => useDarsStore.persist.onFinishHydration(cb)

/** localStorage dan maʼlumot yuklanganini bildiradi (SSR da har doim false). */
export function useDarsHydrated(): boolean {
  return useSyncExternalStore(
    subscribeHydration,
    () => useDarsStore.persist.hasHydrated(),
    () => false,
  )
}

