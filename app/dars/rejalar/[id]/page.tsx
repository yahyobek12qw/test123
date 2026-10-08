import type { Metadata } from 'next'
import { PlanEditorView } from '@/components/dars/views/PlanEditorView'

export const metadata: Metadata = { title: 'Dars rejasi' }

export default async function PlanEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PlanEditorView id={id} />
}
