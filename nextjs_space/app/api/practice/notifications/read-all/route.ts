
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { markAllAsRead } from '@/lib/services/practice-notification-service'

/**
 * PATCH /api/practice/notifications/read-all
 * Mark all notifications as read
 */
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const updated = await markAllAsRead(session.user.id)

    return NextResponse.json({
      success: true,
      updated
    })
  } catch (error: any) {
    console.error('Error marking all as read:', error)
    return NextResponse.json(
      { error: error.message || 'Error al marcar notificaciones' },
      { status: 400 }
    )
  }
}
