
import { google, calendar_v3 } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { prisma } from '@/lib/db'
import { addMinutes } from 'date-fns'

// Cliente OAuth2
function createOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/google/callback`
  )
}

// Obtener cliente autenticado para un usuario
async function getAuthenticatedClient(userId: string): Promise<OAuth2Client> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      googleAccessToken: true,
      googleRefreshToken: true,
      googleTokenExpiresAt: true,
      googleConnected: true,
    }
  })

  if (!user?.googleConnected || !user.googleAccessToken || !user.googleRefreshToken) {
    throw new Error('Usuario no ha conectado Google Calendar')
  }

  const oauth2Client = createOAuth2Client()
  
  oauth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
    expiry_date: user.googleTokenExpiresAt?.getTime()
  })

  // Si el token está expirado, refrescarlo
  if (user.googleTokenExpiresAt && user.googleTokenExpiresAt < new Date()) {
    const { credentials } = await oauth2Client.refreshAccessToken()
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: credentials.access_token!,
        googleTokenExpiresAt: new Date(credentials.expiry_date!),
        googleRefreshToken: credentials.refresh_token || user.googleRefreshToken,
      }
    })

    oauth2Client.setCredentials(credentials)
  }

  return oauth2Client
}

// CREAR EVENTO DE PRÁCTICA
export async function createPracticeEvent({
  userId,
  partnerId,
  scheduledFor,
  topic,
  durationMinutes = 30
}: {
  userId: string
  partnerId: string
  scheduledFor: Date
  topic: string
  durationMinutes?: number
}) {
  try {
    const auth = await getAuthenticatedClient(userId)
    const calendar = google.calendar({ version: 'v3', auth })

    const [user, partner] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.user.findUnique({ where: { id: partnerId } })
    ])

    if (!user || !partner) {
      throw new Error('Usuario no encontrado')
    }

    const startTime = scheduledFor
    const endTime = addMinutes(startTime, durationMinutes)

    const event: calendar_v3.Schema$Event = {
      summary: `🎤 Práctica de Inglés: ${topic}`,
      description: `
Sesión 1 a 1 con ${partner.name || partner.email} en SpeaklyPlan

📚 Tema: ${topic}
⏱️ Duración: ${durationMinutes} minutos

💡 Tips:
• Llega 2 minutos antes para verificar audio/video
• Ten listo el tema de conversación
• Practica con confianza, ¡los errores son parte del aprendizaje!

🔗 Enlace a la plataforma: ${process.env.NEXTAUTH_URL}/practice
      `.trim(),
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'America/Bogota'
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'America/Bogota'
      },
      attendees: [
        { 
          email: user.email!,
          displayName: user.name || undefined,
          responseStatus: 'accepted'
        },
        { 
          email: partner.email!,
          displayName: partner.name || undefined
        }
      ],
      conferenceData: {
        createRequest: {
          requestId: `practice-${userId}-${partnerId}-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 60 },
          { method: 'popup', minutes: 10 }
        ]
      },
      guestsCanModify: true,
      guestsCanSeeOtherGuests: true
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      sendUpdates: 'all',
      requestBody: event
    })

    const createdEvent = response.data

    return {
      success: true,
      eventId: createdEvent.id!,
      eventLink: createdEvent.htmlLink!,
      meetLink: createdEvent.hangoutLink || createdEvent.conferenceData?.entryPoints?.[0]?.uri,
      startTime: createdEvent.start?.dateTime!,
      endTime: createdEvent.end?.dateTime!
    }
  } catch (error: any) {
    console.error('Error creando evento de Calendar:', error)
    
    if (error.code === 401) {
      throw new Error('Sesión de Google Calendar expirada. Por favor reconecta tu cuenta.')
    }
    
    throw new Error('Error al crear evento: ' + error.message)
  }
}

// CANCELAR EVENTO
export async function cancelPracticeEvent({
  userId,
  eventId
}: {
  userId: string
  eventId: string
}) {
  try {
    const auth = await getAuthenticatedClient(userId)
    const calendar = google.calendar({ version: 'v3', auth })

    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
      sendUpdates: 'all'
    })

    return {
      success: true,
      message: 'Evento cancelado correctamente'
    }
  } catch (error: any) {
    console.error('Error cancelando evento:', error)
    throw new Error('Error al cancelar evento: ' + error.message)
  }
}

// OBTENER DISPONIBILIDAD DE UN USUARIO
export async function getUserAvailability({
  userId,
  date
}: {
  userId: string
  date: Date
}) {
  try {
    const auth = await getAuthenticatedClient(userId)
    const calendar = google.calendar({ version: 'v3', auth })

    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    })

    const busyEvents = response.data.items || []

    const slots: Array<{ start: Date; end: Date; available: boolean }> = []
    const startHour = 8
    const endHour = 22

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of [0, 30]) {
        const slotStart = new Date(date)
        slotStart.setHours(hour, minute, 0, 0)
        
        const slotEnd = addMinutes(slotStart, 30)

        const isOccupied = busyEvents.some(event => {
          const eventStart = new Date(event.start?.dateTime || event.start?.date!)
          const eventEnd = new Date(event.end?.dateTime || event.end?.date!)
          
          return (
            (slotStart >= eventStart && slotStart < eventEnd) ||
            (slotEnd > eventStart && slotEnd <= eventEnd) ||
            (slotStart <= eventStart && slotEnd >= eventEnd)
          )
        })

        slots.push({
          start: slotStart,
          end: slotEnd,
          available: !isOccupied && slotStart > new Date()
        })
      }
    }

    return {
      success: true,
      date,
      slots,
      busyEvents: busyEvents.map(e => ({
        summary: e.summary,
        start: e.start?.dateTime || e.start?.date,
        end: e.end?.dateTime || e.end?.date
      }))
    }
  } catch (error: any) {
    console.error('Error obteniendo disponibilidad:', error)
    throw new Error('Error al obtener disponibilidad: ' + error.message)
  }
}

export { createOAuth2Client }
