
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import InvitacionesClient from './_components/invitaciones-client'

export default async function InvitacionesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  return <InvitacionesClient />
}
