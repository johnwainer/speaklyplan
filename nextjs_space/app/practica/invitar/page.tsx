
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import InvitarClient from './_components/invitar-client'

export default async function InvitarPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  return <InvitarClient />
}
