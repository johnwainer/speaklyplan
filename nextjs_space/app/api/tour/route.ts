
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { hasSeenTour } = await request.json();

    // Actualizar el estado del tour del usuario
    await prisma.user.update({
      where: { email: session.user.email },
      data: { hasSeenTour }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating tour status:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el estado del tour' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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
      select: { hasSeenTour: true }
    });

    return NextResponse.json({ hasSeenTour: user?.hasSeenTour || false });
  } catch (error) {
    console.error('Error getting tour status:', error);
    return NextResponse.json(
      { error: 'Error al obtener el estado del tour' },
      { status: 500 }
    );
  }
}
