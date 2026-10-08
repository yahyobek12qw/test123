import type { Metadata } from 'next'
import { PlansView } from '@/components/dars/views/PlansView'

export const metadata: Metadata = { title: 'Dars rejalari' }

export default function PlansPage() {
  return <PlansView />
}
