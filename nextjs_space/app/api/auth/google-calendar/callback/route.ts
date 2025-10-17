
import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { prisma } from '@/lib/db'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/auth/google-calendar/callback`
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/practice?calendar=cancelled`
      )
    }

    if (!code || !state) {
      throw new Error('Código o estado faltante')
    }

    const { tokens } = await oauth2Client.getToken(code)

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Tokens inválidos')
    }

    await prisma.calendarIntegration.upsert({
      where: { userId: state },
      create: {
        userId: state,
        provider: 'google',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(tokens.expiry_date!)
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(tokens.expiry_date!)
      }
    })

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/practice?calendar=connected`
    )
  } catch (error: any) {
    console.error('Error en callback de Calendar:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/practice?calendar=error`
    )
  }
}
