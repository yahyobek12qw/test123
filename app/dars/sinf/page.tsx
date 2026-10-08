import type { Metadata } from 'next'
import { ClassroomView } from '@/components/dars/views/ClassroomView'

export const metadata: Metadata = { title: 'Sinf boshqaruvi' }

export default function ClassroomPage() {
  return <ClassroomView />
}
