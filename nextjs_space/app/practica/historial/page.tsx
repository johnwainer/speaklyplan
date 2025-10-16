
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import HistorialClient from './_components/historial-client'

export default async function HistorialPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  return <HistorialClient />
}
