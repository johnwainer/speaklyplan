
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendEmail, generatePasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      )
    }

    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Por seguridad, siempre devolver el mismo mensaje
    // incluso si el usuario no existe
    if (!user) {
      return NextResponse.json({
        message: 'Si el email existe en nuestro sistema, recibirás un enlace de restablecimiento.'
      })
    }

    // Generar token único y seguro
    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    // Crear o actualizar el token de verificación
    // Expira en 1 hora
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    // Eliminar cualquier token previo para este email
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: email
      }
    })

    // Crear nuevo token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires: expiresAt
      }
    })

    // Generar enlace de restablecimiento
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resetLink = `${baseUrl}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`

    // Enviar email
    await sendEmail({
      to: email,
      subject: 'Restablece tu contraseña - SpeaklyPlan',
      html: generatePasswordResetEmail(user.name || 'Usuario', resetLink)
    })

    return NextResponse.json({
      message: 'Si el email existe en nuestro sistema, recibirás un enlace de restablecimiento.'
    })

  } catch (error) {
    console.error('Error en forgot-password:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
