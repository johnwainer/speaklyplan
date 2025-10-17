
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { PracticeClient } from './_components/practice-client'

export const metadata = {
  title: 'Prácticas 1 a 1 - SpeaklyPlan',
  description: 'Practica inglés con otros usuarios de la plataforma'
}

export default async function PracticePage({
  searchParams
}: {
  searchParams: { calendar?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const userId = session.user.id

  // Check if calendar was just connected
  const calendarStatus = searchParams.calendar

  // Fetch user data including calendar integration
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      calendarIntegration: true
    }
  })

  // Fetch invitations received
  const receivedInvitations = await prisma.practiceInvitation.findMany({
    where: {
      receiverId: userId,
      status: 'PENDING'
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          level: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Fetch invitations sent
  const sentInvitations = await prisma.practiceInvitation.findMany({
    where: {
      senderId: userId,
      status: 'PENDING'
    },
    include: {
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          level: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Fetch partners (connections)
  const connections1 = await prisma.practiceConnection.findMany({
    where: {
      user1Id: userId,
      isActive: true
    },
    include: {
      user2: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          level: true
        }
      }
    }
  })

  const connections2 = await prisma.practiceConnection.findMany({
    where: {
      user2Id: userId,
      isActive: true
    },
    include: {
      user1: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          level: true
        }
      }
    }
  })

  // Merge and format partners
  const partners = [
    ...connections1.map(c => ({
      id: c.user2.id,
      name: c.user2.name,
      email: c.user2.email,
      image: c.user2.image,
      level: c.user2.level,
      totalSessions: c.totalSessions,
      lastSessionAt: c.lastSessionAt?.toISOString() || null
    })),
    ...connections2.map(c => ({
      id: c.user1.id,
      name: c.user1.name,
      email: c.user1.email,
      image: c.user1.image,
      level: c.user1.level,
      totalSessions: c.totalSessions,
      lastSessionAt: c.lastSessionAt?.toISOString() || null
    }))
  ]

  // Fetch scheduled sessions
  const scheduledSessions = await prisma.practiceMeeting.findMany({
    where: {
      OR: [
        { initiatorId: userId },
        { partnerId: userId }
      ],
      status: 'SCHEDULED',
      scheduledFor: {
        gte: new Date()
      }
    },
    include: {
      initiator: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      partner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    },
    orderBy: {
      scheduledFor: 'asc'
    }
  })

  // Fetch completed sessions (history)
  const history = await prisma.practiceMeeting.findMany({
    where: {
      OR: [
        { initiatorId: userId },
        { partnerId: userId }
      ],
      status: 'COMPLETED'
    },
    include: {
      initiator: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      partner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    },
    orderBy: {
      endedAt: 'desc'
    },
    take: 20
  })

  // Fetch notifications
  const notifications = await prisma.practiceNotification.findMany({
    where: {
      userId,
      isRead: false
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  })

  const hasGoogleCalendar = !!user?.calendarIntegration

  return (
    <PracticeClient
      currentUserId={userId}
      hasGoogleCalendar={hasGoogleCalendar}
      calendarStatus={calendarStatus}
      receivedInvitations={receivedInvitations.map(inv => ({
        ...inv,
        createdAt: inv.createdAt.toISOString()
      }))}
      sentInvitations={sentInvitations.map(inv => ({
        ...inv,
        createdAt: inv.createdAt.toISOString(),
        receiver: inv.receiver
      }))}
      partners={partners}
      scheduledSessions={scheduledSessions.map(s => ({
        ...s,
        scheduledFor: s.scheduledFor?.toISOString() || null,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
        startedAt: s.startedAt?.toISOString() || null,
        endedAt: s.endedAt?.toISOString() || null
      }))}
      history={history.map(h => ({
        ...h,
        scheduledFor: h.scheduledFor?.toISOString() || null,
        createdAt: h.createdAt.toISOString(),
        updatedAt: h.updatedAt.toISOString(),
        startedAt: h.startedAt?.toISOString() || null,
        endedAt: h.endedAt?.toISOString() || null
      }))}
      unreadNotifications={notifications.length}
    />
  )
}
