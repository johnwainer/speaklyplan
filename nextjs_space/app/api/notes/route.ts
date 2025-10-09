
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/notes?weekNumber=X - Obtener todas las notas de una semana
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const weekNumber = searchParams.get('weekNumber')

    if (!weekNumber) {
      return NextResponse.json({ error: 'Número de semana requerido' }, { status: 400 })
    }

    const notes = await prisma.userNote.findMany({
      where: {
        userId: session.user.id,
        weekNumber: parseInt(weekNumber)
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error al obtener notas:', error)
    return NextResponse.json(
      { error: 'Error al obtener notas' },
      { status: 500 }
    )
  }
}

// POST /api/notes - Crear una nueva nota
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { weekNumber, content, reflection } = body

    if (!weekNumber || !content) {
      return NextResponse.json(
        { error: 'Número de semana y contenido son requeridos' },
        { status: 400 }
      )
    }

    const note = await prisma.userNote.create({
      data: {
        userId: session.user.id,
        weekNumber: parseInt(weekNumber),
        content,
        reflection: reflection || null
      }
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('Error al crear nota:', error)
    return NextResponse.json(
      { error: 'Error al crear nota' },
      { status: 500 }
    )
  }
}

// DELETE /api/notes - Eliminar una nota
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const noteId = searchParams.get('id')

    if (!noteId) {
      return NextResponse.json(
        { error: 'ID de nota requerido' },
        { status: 400 }
      )
    }

    // Verificar que la nota pertenece al usuario
    const note = await prisma.userNote.findUnique({
      where: { id: noteId }
    })

    if (!note) {
      return NextResponse.json(
        { error: 'Nota no encontrada' },
        { status: 404 }
      )
    }

    if (note.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    await prisma.userNote.delete({
      where: { id: noteId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar nota:', error)
    return NextResponse.json(
      { error: 'Error al eliminar nota' },
      { status: 500 }
    )
  }
}
