
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { wordId, mastered } = body

    if (!wordId || typeof mastered !== 'boolean') {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    // Upsert user vocabulary progress
    const progress = await prisma.userVocabularyProgress.upsert({
      where: {
        userId_wordId: {
          userId: session.user.id,
          wordId: wordId
        }
      },
      update: {
        mastered: mastered,
        lastReviewed: new Date(),
        attempts: { increment: 1 }
      },
      create: {
        userId: session.user.id,
        wordId: wordId,
        mastered: mastered,
        lastReviewed: new Date(),
        attempts: 1
      }
    })

    return NextResponse.json({ 
      success: true,
      progress 
    })

  } catch (error) {
    console.error('Error updating vocabulary progress:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
