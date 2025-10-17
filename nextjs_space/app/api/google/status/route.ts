
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        googleConnected: true,
        googleTokenExpiresAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Check if Google OAuth is configured
    const isConfigured = Boolean(
      process.env.GOOGLE_CLIENT_ID && 
      process.env.GOOGLE_CLIENT_SECRET && 
      process.env.GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID' &&
      process.env.GOOGLE_CLIENT_SECRET !== 'YOUR_GOOGLE_CLIENT_SECRET'
    );

    return NextResponse.json({
      connected: user.googleConnected,
      expiresAt: user.googleTokenExpiresAt,
      configured: isConfigured,
    });
  } catch (error) {
    console.error('Error checking Google status:', error);
    return NextResponse.json(
      { error: 'Error al verificar estado de Google Calendar' },
      { status: 500 }
    );
  }
}
