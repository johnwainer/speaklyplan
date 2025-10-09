
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PUT /api/notes/[id] - Actualizar una nota
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { content, reflection } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Contenido es requerido' },
        { status: 400 }
      )
    }

    // Verificar que la nota pertenece al usuario
    const existingNote = await prisma.userNote.findUnique({
      where: { id: params.id }
    })

    if (!existingNote) {
      return NextResponse.json(
        { error: 'Nota no encontrada' },
        { status: 404 }
      )
    }

    if (existingNote.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const updatedNote = await prisma.userNote.update({
      where: { id: params.id },
      data: {
        content,
        reflection: reflection || null
      }
    })

    return NextResponse.json(updatedNote)
  } catch (error) {
    console.error('Error al actualizar nota:', error)
    return NextResponse.json(
      { error: 'Error al actualizar nota' },
      { status: 500 }
    )
  }
}
