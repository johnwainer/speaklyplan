
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { 
  getMeeting,
  startMeeting, 
  completeMeeting, 
  cancelMeeting,
  updateMeetingNotes
} from '@/lib/services/practice-service'
import { notifyFeedbackRequested } from '@/lib/services/practice-notification-service'
import { prisma } from '@/lib/db'

/**
 * GET /api/practice/sessions/[id]
 * Get a specific session
 */
export async function GET(
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

    const meeting = await getMeeting(params.id, session.user.id)

    if (!meeting) {
      return NextResponse.json(
        { error: 'Sesión no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      session: meeting
    })
  } catch (error: any) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener sesión' },
      { status: 400 }
    )
  }
}

/**
 * PATCH /api/practice/sessions/[id]
 * Update a session (start, complete, cancel, update notes)
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
    const { action, notes, feedback, rating } = body
    const meetingId = params.id

    if (!action) {
      return NextResponse.json(
        { error: 'Acción requerida' },
        { status: 400 }
      )
    }

    let result

    if (action === 'start') {
      result = await startMeeting(meetingId, session.user.id)
      
      return NextResponse.json({
        success: true,
        session: result
      })
    } else if (action === 'complete') {
      result = await completeMeeting(meetingId, session.user.id, {
        notes,
        feedback,
        rating
      })

      // Calculate points earned
      const durationMinutes = result.durationMinutes || 0
      let pointsEarned = 0
      if (durationMinutes >= 60) pointsEarned = 75
      else if (durationMinutes >= 30) pointsEarned = 50
      else if (durationMinutes >= 15) pointsEarned = 30

      // Award points
      if (pointsEarned > 0) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            points: { increment: pointsEarned }
          }
        })
      }

      // Notify partner to leave feedback
      const partnerId = result.initiatorId === session.user.id 
        ? result.partnerId 
        : result.initiatorId
      
      await notifyFeedbackRequested(
        partnerId,
        session.user.name || 'Un usuario',
        meetingId
      )

      return NextResponse.json({
        success: true,
        session: result,
        pointsEarned
      })
    } else if (action === 'cancel') {
      result = await cancelMeeting(meetingId, session.user.id)
      
      return NextResponse.json({
        success: true,
        session: result
      })
    } else if (action === 'update_notes') {
      result = await updateMeetingNotes(meetingId, session.user.id, notes)
      
      return NextResponse.json({
        success: true,
        session: result
      })
    } else {
      return NextResponse.json(
        { error: 'Acción inválida' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error updating session:', error)
    return NextResponse.json(
      { error: error.message || 'Error al actualizar sesión' },
      { status: 400 }
    )
  }
}
