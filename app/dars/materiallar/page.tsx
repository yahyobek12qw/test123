import type { Metadata } from 'next'
import { MaterialsView } from '@/components/dars/views/MaterialsView'

export const metadata: Metadata = { title: 'Materiallar' }

export default function MaterialsPage() {
  return <MaterialsView />
}
