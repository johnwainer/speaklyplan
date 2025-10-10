
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { currentPassword, newPassword } = await req.json()

    // Validaciones básicas
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'La nueva contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Obtener el usuario con su contraseña actual
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        password: true,
      }
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que la contraseña actual sea correcta
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'La contraseña actual es incorrecta' },
        { status: 400 }
      )
    }

    // Verificar que la nueva contraseña sea diferente a la actual
    const isSamePassword = await bcrypt.compare(newPassword, user.password)
    if (isSamePassword) {
      return NextResponse.json(
        { error: 'La nueva contraseña debe ser diferente a la actual' },
        { status: 400 }
      )
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Actualizar la contraseña en la base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Contraseña actualizada correctamente' 
    })

  } catch (error) {
    console.error('Error al cambiar contraseña:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
