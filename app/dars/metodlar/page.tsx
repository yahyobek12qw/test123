import type { Metadata } from 'next'
import { MethodsView } from '@/components/dars/views/MethodsView'

export const metadata: Metadata = { title: 'Interfaol metodlar' }

export default function MethodsPage() {
  return <MethodsView />
}
