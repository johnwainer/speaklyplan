
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createMeeting, getUserMeetings } from '@/lib/services/practice-service'
import { notifySessionScheduled } from '@/lib/services/practice-notification-service'
import { createPracticeEvent } from '@/lib/services/google-calendar-service'
import { MeetingStatus } from '@prisma/client'
import { prisma } from '@/lib/db'

/**
 * POST /api/practice/sessions
 * Create a new practice session
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
    const { partnerId, scheduledFor, topic, externalLink, useGoogleCalendar } = body

    if (!partnerId) {
      return NextResponse.json(
        { error: 'ID del compañero requerido' },
        { status: 400 }
      )
    }

    if (!scheduledFor || !topic) {
      return NextResponse.json(
        { error: 'Fecha y tema requeridos' },
        { status: 400 }
      )
    }

    let meetLink: string | undefined = externalLink
    let calendarEventId: string | undefined

    // Verificar si el usuario tiene Google Calendar conectado
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        googleConnected: true,
        googleAccessToken: true,
        googleRefreshToken: true,
      }
    })

    // Si el usuario tiene Google Calendar conectado, crear el evento automáticamente
    if (user?.googleConnected && user.googleAccessToken && user.googleRefreshToken) {
      try {
        const calendarResult = await createPracticeEvent({
          userId: session.user.id,
          partnerId,
          scheduledFor: new Date(scheduledFor),
          topic,
          durationMinutes: 30
        })

        meetLink = calendarResult.meetLink || undefined
        calendarEventId = calendarResult.eventId
        
        console.log('✅ Evento de Google Meet creado:', calendarEventId)
      } catch (calendarError: any) {
        console.error('⚠️ Error creando evento de Calendar:', calendarError)
        // Continuar sin Calendar si falla
      }
    }

    // Create meeting
    const meeting = await createMeeting({
      initiatorId: session.user.id,
      partnerId,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      topic,
      externalLink: meetLink,
      calendarEventId
    })

    // Notify partner
    await notifySessionScheduled(
      partnerId,
      session.user.name || 'Un usuario',
      meeting.id,
      scheduledFor ? new Date(scheduledFor) : undefined
    )

    return NextResponse.json({
      success: true,
      session: meeting,
      meetLink,
      message: meetLink 
        ? 'Sesión programada con Google Meet' 
        : 'Sesión programada correctamente'
    })
  } catch (error: any) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear sesión' },
      { status: 400 }
    )
  }
}

/**
 * GET /api/practice/sessions?status=scheduled|in_progress|completed
 * Get user's practice sessions
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
    const status = searchParams.get('status') as MeetingStatus | undefined

    const sessions = await getUserMeetings(session.user.id, status)

    return NextResponse.json({
      success: true,
      sessions
    })
  } catch (error: any) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener sesiones' },
      { status: 400 }
    )
  }
}
