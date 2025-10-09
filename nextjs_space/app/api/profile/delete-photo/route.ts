
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { deleteFile } from '@/lib/s3'

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Get user with current photo
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, image: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Delete from S3 if exists
    if (user.image && !user.image.startsWith('http')) {
      try {
        await deleteFile(user.image)
      } catch (error) {
        console.error('Error deleting file from S3:', error)
        // Continue even if S3 deletion fails
      }
    }

    // Update user to remove photo
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { image: null },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        points: true,
        level: true,
        currentStreak: true,
        bestStreak: true,
        createdAt: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error deleting profile photo:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la foto de perfil' },
      { status: 500 }
    )
  }
}
