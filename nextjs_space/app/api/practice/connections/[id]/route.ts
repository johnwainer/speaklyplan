
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { removeConnection } from '@/lib/services/practice-service'

/**
 * DELETE /api/practice/connections/[id]
 * Remove a practice connection
 */
export async function DELETE(
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

    await removeConnection(params.id, session.user.id)

    return NextResponse.json({
      success: true,
      message: 'Compañero eliminado correctamente'
    })
  } catch (error: any) {
    console.error('Error removing connection:', error)
    return NextResponse.json(
      { error: error.message || 'Error al eliminar compañero' },
      { status: 400 }
    )
  }
}
