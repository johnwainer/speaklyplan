
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import RecursosClient from './_components/recursos-client'

export default async function RecursosPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  return (
    <RecursosClient 
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email
      }}
    />
  )
}
