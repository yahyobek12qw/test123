import type { Metadata } from 'next'
import { DarsShell } from '@/components/dars/DarsShell'

export const metadata: Metadata = {
  title: {
    template: '%s | Ustoz',
    default: 'Ustoz — Darsni tashkil etish',
  },
  description:
    'Dars rejalari, tarqatma materiallar, testlar, interfaol metodlar hamda sinf boshqaruvi — oʻqituvchi uchun bitta joyda.',
}

export default function DarsLayout({ children }: { children: React.ReactNode }) {
  return <DarsShell>{children}</DarsShell>
}
