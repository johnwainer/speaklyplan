
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { 
  acceptInvitation, 
  rejectInvitation, 
  cancelInvitation 
} from '@/lib/services/practice-service'
import { 
  notifyInvitationAccepted,
  notifyInvitationRejected
} from '@/lib/services/practice-notification-service'

/**
 * PATCH /api/practice/invitations/[id]
 * Accept, reject, or cancel an invitation
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

    const body = await request.json()
    const { action } = body
    const invitationId = params.id

    if (!['accept', 'reject', 'cancel'].includes(action)) {
      return NextResponse.json(
        { error: 'Acción inválida' },
        { status: 400 }
      )
    }

    let result

    if (action === 'accept') {
      result = await acceptInvitation(invitationId, session.user.id)
      
      // Notify sender
      await notifyInvitationAccepted(
        result.invitation.senderId,
        session.user.name || 'Un usuario',
        invitationId
      )

      return NextResponse.json({
        success: true,
        invitation: result.invitation,
        connection: result.connection,
        message: '¡Ahora son compañeros de práctica!'
      })
    } else if (action === 'reject') {
      result = await rejectInvitation(invitationId, session.user.id)
      
      // Notify sender
      await notifyInvitationRejected(
        result.senderId,
        session.user.name || 'Un usuario',
        invitationId
      )

      return NextResponse.json({
        success: true,
        invitation: result
      })
    } else {
      result = await cancelInvitation(invitationId, session.user.id)
      
      return NextResponse.json({
        success: true,
        invitation: result
      })
    }
  } catch (error: any) {
    console.error('Error updating invitation:', error)
    return NextResponse.json(
      { error: error.message || 'Error al actualizar invitación' },
      { status: 400 }
    )
  }
}
