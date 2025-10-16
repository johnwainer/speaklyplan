
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPracticeHistory, getPracticeStats } from '@/lib/services/practice-service'

/**
 * GET /api/practice/history?limit=20&offset=0
 * Get user's practice history and stats
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
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const [historyData, stats] = await Promise.all([
      getPracticeHistory(session.user.id, limit, offset),
      getPracticeStats(session.user.id)
    ])

    return NextResponse.json({
      success: true,
      history: historyData.history,
      total: historyData.total,
      stats
    })
  } catch (error: any) {
    console.error('Error fetching history:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener historial' },
      { status: 400 }
    )
  }
}
