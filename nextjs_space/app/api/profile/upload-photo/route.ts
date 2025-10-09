
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { uploadFile, deleteFile } from '@/lib/s3'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, WebP)' 
      }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'El archivo es demasiado grande. Tamaño máximo: 5MB' 
      }, { status: 400 })
    }

    // Get current user to check if they have an old image
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true }
    })

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to S3
    const cloud_storage_path = await uploadFile(buffer, file.name, file.type)

    // Update user profile with new image path
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: cloud_storage_path },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      }
    })

    // Delete old image if it exists and is from S3
    if (currentUser?.image && currentUser.image.includes('profile-images/')) {
      try {
        await deleteFile(currentUser.image)
      } catch (error) {
        console.error('Error deleting old image:', error)
        // Continue even if deletion fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      cloud_storage_path 
    })
  } catch (error) {
    console.error('Error uploading photo:', error)
    return NextResponse.json({ 
      error: 'Error al subir la foto' 
    }, { status: 500 })
  }
}
