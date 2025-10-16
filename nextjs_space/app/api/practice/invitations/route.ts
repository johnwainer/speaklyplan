
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { 
  sendPracticeInvitation, 
  getUserInvitations 
} from '@/lib/services/practice-service'
import { 
  notifyInvitationReceived 
} from '@/lib/services/practice-notification-service'

/**
 * POST /api/practice/invitations
 * Send a practice invitation
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { receiverEmail, message } = body

    if (!receiverEmail) {
      return NextResponse.json(
        { error: 'Email del destinatario requerido' },
        { status: 400 }
      )
    }

    // Send invitation
    const invitation = await sendPracticeInvitation(
      session.user.id,
      receiverEmail,
      message
    )

    // Create notification for receiver
    await notifyInvitationReceived(
      invitation.receiverId,
      session.user.name || 'Un usuario',
      invitation.id
    )

    return NextResponse.json({
      success: true,
      invitation
    })
  } catch (error: any) {
    console.error('Error sending invitation:', error)
    return NextResponse.json(
      { error: error.message || 'Error al enviar invitación' },
      { status: 400 }
    )
  }
}

/**
 * GET /api/practice/invitations?type=received|sent
 * Get user's invitations
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
    const type = (searchParams.get('type') || 'received') as 'sent' | 'received'

    const invitations = await getUserInvitations(session.user.id, type)

    return NextResponse.json({
      success: true,
      invitations
    })
  } catch (error: any) {
    console.error('Error fetching invitations:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener invitaciones' },
      { status: 400 }
    )
  }
}
