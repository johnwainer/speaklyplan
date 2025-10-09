
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { token, email, password } = await request.json()

    // Validaciones básicas
    if (!token || !email || !password) {
      return NextResponse.json(
        { error: 'Token, email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Hash del token para comparar con la base de datos
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    // Buscar el token de verificación
    const verificationTokens = await prisma.verificationToken.findMany({
      where: {
        identifier: email
      }
    })

    if (!verificationTokens || verificationTokens.length === 0) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      )
    }

    // Buscar el token correcto
    const verificationToken = verificationTokens.find(t => t.token === hashedToken)

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      )
    }

    // Verificar que el token no haya expirado
    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.deleteMany({
        where: { 
          identifier: email,
          token: hashedToken
        }
      })
      return NextResponse.json(
        { error: 'El token ha expirado. Solicita uno nuevo.' },
        { status: 400 }
      )
    }

    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Actualizar la contraseña del usuario
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })

    // Eliminar el token usado
    await prisma.verificationToken.deleteMany({
      where: { 
        identifier: email,
        token: hashedToken
      }
    })

    return NextResponse.json({
      message: 'Contraseña actualizada exitosamente'
    })

  } catch (error) {
    console.error('Error en reset-password:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
