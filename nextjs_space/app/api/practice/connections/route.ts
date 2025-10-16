
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserConnections } from '@/lib/services/practice-service'

/**
 * GET /api/practice/connections
 * Get user's practice connections
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

    const connections = await getUserConnections(session.user.id)

    return NextResponse.json({
      success: true,
      connections
    })
  } catch (error: any) {
    console.error('Error fetching connections:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener compañeros' },
      { status: 400 }
    )
  }
}
