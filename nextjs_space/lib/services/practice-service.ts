
/**
 * Practice Service
 * Handles all business logic for the 1-on-1 practice system
 */

import { prisma } from '@/lib/db'
import { 
  PracticeInvitationWithUsers, 
  PracticeConnectionWithPartner,
  PracticeMeetingWithUsers,
  PracticeHistoryItem,
  PracticeStats
} from '@/lib/types'
import { InvitationStatus, MeetingStatus } from '@prisma/client'

// ============================================
// INVITATIONS
// ============================================

/**
 * Send a practice invitation to another user
 */
export async function sendPracticeInvitation(
  senderId: string,
  receiverEmail: string,
  message?: string
) {
  // Find receiver by email
  const receiver = await prisma.user.findUnique({
    where: { email: receiverEmail }
  })

  if (!receiver) {
    throw new Error('Usuario no encontrado')
  }

  if (receiver.id === senderId) {
    throw new Error('No puedes enviarte una invitación a ti mismo')
  }

  // Check if already connected
  const existingConnection = await getConnection(senderId, receiver.id)
  if (existingConnection) {
    throw new Error('Ya están conectados')
  }

  // Check for pending invitation (either direction)
  const existingInvitation = await prisma.practiceInvitation.findFirst({
    where: {
      OR: [
        { senderId, receiverId: receiver.id, status: 'PENDING' },
        { senderId: receiver.id, receiverId: senderId, status: 'PENDING' }
      ]
    }
  })

  if (existingInvitation) {
    throw new Error('Ya existe una invitación pendiente')
  }

  // Create invitation
  const invitation = await prisma.practiceInvitation.create({
    data: {
      senderId,
      receiverId: receiver.id,
      message,
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
      },
      receiver: {
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

  return invitation
}

/**
 * Get invitations for a user (sent or received)
 */
export async function getUserInvitations(
  userId: string,
  type: 'sent' | 'received' = 'received'
): Promise<PracticeInvitationWithUsers[]> {
  const invitations = await prisma.practiceInvitation.findMany({
    where: type === 'sent' 
      ? { senderId: userId }
      : { receiverId: userId },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          level: true
        }
      },
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

  return invitations
}

/**
 * Accept a practice invitation
 */
export async function acceptInvitation(invitationId: string, userId: string) {
  const invitation = await prisma.practiceInvitation.findUnique({
    where: { id: invitationId }
  })

  if (!invitation) {
    throw new Error('Invitación no encontrada')
  }

  if (invitation.receiverId !== userId) {
    throw new Error('No autorizado')
  }

  if (invitation.status !== 'PENDING') {
    throw new Error('Esta invitación ya fue procesada')
  }

  // Update invitation
  const updatedInvitation = await prisma.practiceInvitation.update({
    where: { id: invitationId },
    data: {
      status: 'ACCEPTED',
      respondedAt: new Date()
    }
  })

  // Create connection (ensure user1Id < user2Id for consistency)
  const [user1Id, user2Id] = [invitation.senderId, invitation.receiverId].sort()
  
  const connection = await prisma.practiceConnection.create({
    data: {
      user1Id,
      user2Id,
      isActive: true
    }
  })

  return { invitation: updatedInvitation, connection }
}

/**
 * Reject a practice invitation
 */
export async function rejectInvitation(invitationId: string, userId: string) {
  const invitation = await prisma.practiceInvitation.findUnique({
    where: { id: invitationId }
  })

  if (!invitation) {
    throw new Error('Invitación no encontrada')
  }

  if (invitation.receiverId !== userId) {
    throw new Error('No autorizado')
  }

  if (invitation.status !== 'PENDING') {
    throw new Error('Esta invitación ya fue procesada')
  }

  return await prisma.practiceInvitation.update({
    where: { id: invitationId },
    data: {
      status: 'REJECTED',
      respondedAt: new Date()
    }
  })
}

/**
 * Cancel a sent invitation
 */
export async function cancelInvitation(invitationId: string, userId: string) {
  const invitation = await prisma.practiceInvitation.findUnique({
    where: { id: invitationId }
  })

  if (!invitation) {
    throw new Error('Invitación no encontrada')
  }

  if (invitation.senderId !== userId) {
    throw new Error('No autorizado')
  }

  if (invitation.status !== 'PENDING') {
    throw new Error('Esta invitación ya fue procesada')
  }

  return await prisma.practiceInvitation.update({
    where: { id: invitationId },
    data: {
      status: 'CANCELLED'
    }
  })
}

// ============================================
// CONNECTIONS
// ============================================

/**
 * Get a connection between two users
 */
export async function getConnection(user1Id: string, user2Id: string) {
  const [sortedUser1, sortedUser2] = [user1Id, user2Id].sort()
  
  return await prisma.practiceConnection.findUnique({
    where: {
      user1Id_user2Id: {
        user1Id: sortedUser1,
        user2Id: sortedUser2
      }
    }
  })
}

/**
 * Get all practice connections for a user
 */
export async function getUserConnections(userId: string): Promise<PracticeConnectionWithPartner[]> {
  // Get connections where user is user1 or user2
  const connections = await prisma.practiceConnection.findMany({
    where: {
      OR: [
        { user1Id: userId },
        { user2Id: userId }
      ],
      isActive: true
    },
    include: {
      user1: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          level: true,
          practiceAvailable: true
        }
      },
      user2: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          level: true,
          practiceAvailable: true
        }
      }
    },
    orderBy: {
      lastSessionAt: 'desc'
    }
  })

  // Map to include partner info
  return connections.map(conn => {
    const partner = conn.user1Id === userId ? conn.user2 : conn.user1
    return {
      ...conn,
      partner
    }
  })
}

/**
 * Remove a practice connection
 */
export async function removeConnection(connectionId: string, userId: string) {
  const connection = await prisma.practiceConnection.findUnique({
    where: { id: connectionId }
  })

  if (!connection) {
    throw new Error('Conexión no encontrada')
  }

  if (connection.user1Id !== userId && connection.user2Id !== userId) {
    throw new Error('No autorizado')
  }

  return await prisma.practiceConnection.update({
    where: { id: connectionId },
    data: { isActive: false }
  })
}

// ============================================
// MEETINGS
// ============================================

/**
 * Create a practice meeting
 */
export async function createMeeting(data: {
  initiatorId: string
  partnerId: string
  scheduledFor?: Date | null
  topic?: string
  externalLink?: string
  calendarEventId?: string
}) {
  const { initiatorId, partnerId, scheduledFor, topic, externalLink, calendarEventId } = data

  // Verify connection exists
  const connection = await getConnection(initiatorId, partnerId)
  if (!connection) {
    throw new Error('No existe conexión con este usuario')
  }

  // Create meeting
  const meeting = await prisma.practiceMeeting.create({
    data: {
      connectionId: connection.id,
      initiatorId,
      partnerId,
      scheduledFor: scheduledFor || null,
      topic,
      externalLink,
      calendarEventId,
      status: 'SCHEDULED'
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
    }
  })

  return meeting
}

/**
 * Get meetings for a user
 */
export async function getUserMeetings(
  userId: string,
  status?: MeetingStatus
): Promise<PracticeMeetingWithUsers[]> {
  const meetings = await prisma.practiceMeeting.findMany({
    where: {
      OR: [
        { initiatorId: userId },
        { partnerId: userId }
      ],
      ...(status && { status })
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
      scheduledFor: 'desc'
    }
  })

  return meetings
}

/**
 * Get a single meeting by ID
 */
export async function getMeeting(meetingId: string, userId: string): Promise<PracticeMeetingWithUsers | null> {
  const meeting = await prisma.practiceMeeting.findUnique({
    where: { id: meetingId },
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
    }
  })

  if (!meeting) return null

  // Verify user is part of the meeting
  if (meeting.initiatorId !== userId && meeting.partnerId !== userId) {
    throw new Error('No autorizado')
  }

  return meeting
}

/**
 * Start a meeting
 */
export async function startMeeting(meetingId: string, userId: string) {
  const meeting = await getMeeting(meetingId, userId)
  
  if (!meeting) {
    throw new Error('Sesión no encontrada')
  }

  if (meeting.status !== 'SCHEDULED') {
    throw new Error('Esta sesión ya fue iniciada o completada')
  }

  return await prisma.practiceMeeting.update({
    where: { id: meetingId },
    data: {
      status: 'IN_PROGRESS',
      startedAt: new Date()
    }
  })
}

/**
 * Complete a meeting with feedback
 */
export async function completeMeeting(
  meetingId: string,
  userId: string,
  data: {
    notes?: string
    feedback?: string
    rating?: number
  }
) {
  const meeting = await getMeeting(meetingId, userId)
  
  if (!meeting) {
    throw new Error('Sesión no encontrada')
  }

  if (meeting.status === 'COMPLETED') {
    throw new Error('Esta sesión ya fue completada')
  }

  const isInitiator = meeting.initiatorId === userId
  const now = new Date()
  const startedAt = meeting.startedAt || now
  const durationMinutes = Math.round((now.getTime() - startedAt.getTime()) / 60000)

  // Update meeting
  const updatedMeeting = await prisma.practiceMeeting.update({
    where: { id: meetingId },
    data: {
      status: 'COMPLETED',
      endedAt: now,
      durationMinutes: meeting.durationMinutes || durationMinutes,
      notes: data.notes || meeting.notes,
      ...(isInitiator ? {
        initiatorFeedback: data.feedback,
        initiatorRating: data.rating
      } : {
        partnerFeedback: data.feedback,
        partnerRating: data.rating
      })
    }
  })

  // Update connection statistics
  await prisma.practiceConnection.update({
    where: { id: meeting.connectionId },
    data: {
      totalSessions: { increment: 1 },
      lastSessionAt: now
    }
  })

  return updatedMeeting
}

/**
 * Cancel a meeting
 */
export async function cancelMeeting(meetingId: string, userId: string) {
  const meeting = await getMeeting(meetingId, userId)
  
  if (!meeting) {
    throw new Error('Sesión no encontrada')
  }

  if (meeting.status === 'COMPLETED') {
    throw new Error('No se puede cancelar una sesión completada')
  }

  return await prisma.practiceMeeting.update({
    where: { id: meetingId },
    data: {
      status: 'CANCELLED'
    }
  })
}

/**
 * Update meeting notes
 */
export async function updateMeetingNotes(
  meetingId: string,
  userId: string,
  notes: string
) {
  const meeting = await getMeeting(meetingId, userId)
  
  if (!meeting) {
    throw new Error('Sesión no encontrada')
  }

  return await prisma.practiceMeeting.update({
    where: { id: meetingId },
    data: { notes }
  })
}

// ============================================
// HISTORY & STATS
// ============================================

/**
 * Get practice history for a user
 */
export async function getPracticeHistory(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ history: PracticeHistoryItem[]; total: number }> {
  const [meetings, total] = await Promise.all([
    prisma.practiceMeeting.findMany({
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
      take: limit,
      skip: offset
    }),
    prisma.practiceMeeting.count({
      where: {
        OR: [
          { initiatorId: userId },
          { partnerId: userId }
        ],
        status: 'COMPLETED'
      }
    })
  ])

  // Map to include partner info and calculate points
  const history = meetings.map(meeting => {
    const partner = meeting.initiatorId === userId ? meeting.partner : meeting.initiator
    const durationMinutes = meeting.durationMinutes || 0
    
    // Calculate points (same as gamification system)
    let pointsEarned = 0
    if (durationMinutes >= 60) pointsEarned = 75
    else if (durationMinutes >= 30) pointsEarned = 50
    else if (durationMinutes >= 15) pointsEarned = 30

    return {
      ...meeting,
      partner,
      pointsEarned
    }
  })

  return { history, total }
}

/**
 * Get practice statistics for a user
 */
export async function getPracticeStats(userId: string): Promise<PracticeStats> {
  const now = new Date()
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [allSessions, weekSessions, monthSessions] = await Promise.all([
    prisma.practiceMeeting.findMany({
      where: {
        OR: [
          { initiatorId: userId },
          { partnerId: userId }
        ],
        status: 'COMPLETED'
      },
      select: {
        durationMinutes: true,
        initiatorId: true,
        initiatorRating: true,
        partnerRating: true
      }
    }),
    prisma.practiceMeeting.count({
      where: {
        OR: [
          { initiatorId: userId },
          { partnerId: userId }
        ],
        status: 'COMPLETED',
        endedAt: {
          gte: startOfWeek
        }
      }
    }),
    prisma.practiceMeeting.count({
      where: {
        OR: [
          { initiatorId: userId },
          { partnerId: userId }
        ],
        status: 'COMPLETED',
        endedAt: {
          gte: startOfMonth
        }
      }
    })
  ])

  // Calculate stats
  const totalSessions = allSessions.length
  const totalMinutes = allSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0)
  
  // Calculate average rating
  const ratings = allSessions
    .map(s => s.initiatorId === userId ? s.partnerRating : s.initiatorRating)
    .filter(r => r !== null) as number[]
  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
    : 0

  // Get unique partners
  const connections = await prisma.practiceConnection.count({
    where: {
      OR: [
        { user1Id: userId },
        { user2Id: userId }
      ],
      isActive: true
    }
  })

  return {
    totalSessions,
    totalMinutes,
    averageRating,
    totalPartners: connections,
    completedThisWeek: weekSessions,
    completedThisMonth: monthSessions
  }
}

/**
 * Search users by email (for invitations)
 */
export async function searchUserByEmail(email: string, currentUserId: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      level: true,
      practiceAvailable: true
    }
  })

  if (!user) return null
  if (user.id === currentUserId) return null

  return user
}
