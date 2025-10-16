
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import PracticaClient from './_components/practica-client'

export default async function PracticaPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/login')
  }
  
  return <PracticaClient />
}
