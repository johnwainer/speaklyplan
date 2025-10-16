
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserNotifications, getUnreadCount } from '@/lib/services/practice-notification-service'

/**
 * GET /api/practice/notifications?unreadOnly=true&limit=50
 * Get user's practice notifications
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    const [notifications, unreadCount] = await Promise.all([
      getUserNotifications(session.user.id, unreadOnly, limit),
      getUnreadCount(session.user.id)
    ])

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount
    })
  } catch (error: any) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener notificaciones' },
      { status: 400 }
    )
  }
}
