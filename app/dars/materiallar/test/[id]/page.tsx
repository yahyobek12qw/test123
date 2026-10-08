import type { Metadata } from 'next'
import { TestRunnerView } from '@/components/dars/views/TestRunnerView'

export const metadata: Metadata = { title: 'Test' }

export default async function TestRunnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TestRunnerView id={id} />
}
