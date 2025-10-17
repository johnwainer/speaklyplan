
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

    return NextResponse.json({
      connected: user.googleConnected,
      expiresAt: user.googleTokenExpiresAt,
    });
  } catch (error) {
    console.error('Error checking Google status:', error);
    return NextResponse.json(
      { error: 'Error al verificar estado de Google Calendar' },
      { status: 500 }
    );
  }
}
