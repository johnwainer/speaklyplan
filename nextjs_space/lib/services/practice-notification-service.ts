
/**
 * Practice Notification Service
 * Handles notifications for the 1-on-1 practice system
 */

import { prisma } from '@/lib/db'
import { NotificationType } from '@prisma/client'
import { PracticeNotificationWithDetails } from '@/lib/types'

// ============================================
// NOTIFICATION CREATION
// ============================================

/**
 * Create a practice notification
 */
export async function createPracticeNotification(data: {
  userId: string
  type: NotificationType
  title: string
  message: string
  actionUrl?: string
  invitationId?: string
  meetingId?: string
}) {
  return await prisma.practiceNotification.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      actionUrl: data.actionUrl,
      invitationId: data.invitationId,
      meetingId: data.meetingId
    }
  })
}

/**
 * Notify user about new invitation
 */
export async function notifyInvitationReceived(
  receiverId: string,
  senderName: string,
  invitationId: string
) {
  return await createPracticeNotification({
    userId: receiverId,
    type: 'INVITATION_RECEIVED',
    title: '¡Nueva invitación de práctica!',
    message: `${senderName} te ha invitado a practicar inglés juntos`,
    actionUrl: '/practica/invitaciones',
    invitationId
  })
}

/**
 * Notify user their invitation was accepted
 */
export async function notifyInvitationAccepted(
  senderId: string,
  accepterName: string,
  invitationId: string
) {
  return await createPracticeNotification({
    userId: senderId,
    type: 'INVITATION_ACCEPTED',
    title: '¡Tu invitación fue aceptada!',
    message: `${accepterName} aceptó tu invitación. ¡Ahora son compañeros de práctica!`,
    actionUrl: '/practica/companeros',
    invitationId
  })
}

/**
 * Notify user their invitation was rejected
 */
export async function notifyInvitationRejected(
  senderId: string,
  rejecterName: string,
  invitationId: string
) {
  return await createPracticeNotification({
    userId: senderId,
    type: 'INVITATION_REJECTED',
    title: 'Invitación rechazada',
    message: `${rejecterName} rechazó tu invitación de práctica`,
    actionUrl: '/practica/invitaciones',
    invitationId
  })
}

/**
 * Notify user about new scheduled session
 */
export async function notifySessionScheduled(
  partnerId: string,
  initiatorName: string,
  meetingId: string,
  scheduledFor?: Date
) {
  const dateStr = scheduledFor 
    ? new Date(scheduledFor).toLocaleString('es-ES', { 
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    : 'ahora'

  return await createPracticeNotification({
    userId: partnerId,
    type: 'SESSION_SCHEDULED',
    title: '¡Sesión de práctica programada!',
    message: `${initiatorName} quiere practicar contigo ${scheduledFor ? `el ${dateStr}` : 'ahora'}`,
    actionUrl: `/practica/sesion/${meetingId}`,
    meetingId
  })
}

/**
 * Notify user session is starting soon (5 min before)
 */
export async function notifySessionStartingSoon(
  userId: string,
  partnerName: string,
  meetingId: string
) {
  return await createPracticeNotification({
    userId,
    type: 'SESSION_STARTING_SOON',
    title: 'Tu sesión comienza pronto',
    message: `Tu sesión con ${partnerName} comienza en 5 minutos`,
    actionUrl: `/practica/sesion/${meetingId}`,
    meetingId
  })
}

/**
 * Notify user session was completed and feedback is needed
 */
export async function notifyFeedbackRequested(
  userId: string,
  partnerName: string,
  meetingId: string
) {
  return await createPracticeNotification({
    userId,
    type: 'FEEDBACK_REQUESTED',
    title: 'Deja tu feedback',
    message: `${partnerName} dejó feedback sobre tu sesión. ¿Qué te pareció practicar con ${partnerName}?`,
    actionUrl: `/practica/historial`,
    meetingId
  })
}

// ============================================
// NOTIFICATION RETRIEVAL
// ============================================

/**
 * Get notifications for a user
 */
export async function getUserNotifications(
  userId: string,
  unreadOnly: boolean = false,
  limit: number = 50
): Promise<PracticeNotificationWithDetails[]> {
  const notifications = await prisma.practiceNotification.findMany({
    where: {
      userId,
      ...(unreadOnly && { isRead: false })
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit
  })

  return notifications
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  return await prisma.practiceNotification.count({
    where: {
      userId,
      isRead: false
    }
  })
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string, userId: string) {
  const notification = await prisma.practiceNotification.findUnique({
    where: { id: notificationId }
  })

  if (!notification) {
    throw new Error('Notificación no encontrada')
  }

  if (notification.userId !== userId) {
    throw new Error('No autorizado')
  }

  return await prisma.practiceNotification.update({
    where: { id: notificationId },
    data: {
      isRead: true,
      readAt: new Date()
    }
  })
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(userId: string) {
  const result = await prisma.practiceNotification.updateMany({
    where: {
      userId,
      isRead: false
    },
    data: {
      isRead: true,
      readAt: new Date()
    }
  })

  return result.count
}

/**
 * Delete old read notifications (cleanup job)
 */
export async function deleteOldNotifications(daysOld: number = 30) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysOld)

  return await prisma.practiceNotification.deleteMany({
    where: {
      isRead: true,
      readAt: {
        lt: cutoffDate
      }
    }
  })
}
