
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { markAsRead } from '@/lib/services/practice-notification-service'

/**
 * PATCH /api/practice/notifications/[id]/read
 * Mark a notification as read
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const notification = await markAsRead(params.id, session.user.id)

    return NextResponse.json({
      success: true,
      notification
    })
  } catch (error: any) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json(
      { error: error.message || 'Error al marcar notificación' },
      { status: 400 }
    )
  }
}
