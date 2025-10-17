
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserAvailability } from '@/lib/services/google-calendar-service'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    const date = dateParam ? new Date(dateParam) : new Date()

    // Verificar que el usuario tiene Calendar conectado
    const integration = await prisma.calendarIntegration.findUnique({
      where: { userId: params.userId }
    })

    if (!integration) {
      // Si no tiene Calendar, devolver todos los slots disponibles
      const slots: Array<{ start: Date; end: Date; available: boolean }> = []
      const startHour = 8
      const endHour = 22

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute of [0, 30]) {
          const slotStart = new Date(date)
          slotStart.setHours(hour, minute, 0, 0)
          
          const slotEnd = new Date(slotStart.getTime() + 30 * 60000)

          slots.push({
            start: slotStart,
            end: slotEnd,
            available: slotStart > new Date()
          })
        }
      }

      return NextResponse.json({
        success: true,
        date,
        slots,
        hasCalendar: false
      })
    }

    const availability = await getUserAvailability({
      userId: params.userId,
      date
    })

    return NextResponse.json({
      ...availability,
      hasCalendar: true
    })
  } catch (error: any) {
    console.error('Error obteniendo disponibilidad:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
