
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import GuiaClient from './_components/guia-client'

export default async function GuiaPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  return (
    <GuiaClient 
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email
      }}
    />
  )
}
