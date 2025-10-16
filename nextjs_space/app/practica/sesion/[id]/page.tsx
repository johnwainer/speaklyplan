
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import SesionClient from './_components/sesion-client'

export default async function SesionPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  return <SesionClient sessionId={params.id} userId={session.user.id} />
}
