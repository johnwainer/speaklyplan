
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import CompanerosClient from './_components/companeros-client'

export default async function CompanerosPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  return <CompanerosClient />
}
