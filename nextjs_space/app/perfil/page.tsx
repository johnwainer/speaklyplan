
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import PerfilClient from './_components/perfil-client'

export default async function PerfilPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      points: true,
      level: true,
      currentStreak: true,
      bestStreak: true,
      createdAt: true,
    }
  })

  if (!user) {
    redirect('/auth/login')
  }

  return <PerfilClient user={user} />
}
