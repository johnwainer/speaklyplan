
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  createSessionAnalytics,
  getUserAnalyticsSummary,
} from '@/lib/ai/analytics-service';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'summary';

    if (type === 'summary') {
      const summary = await getUserAnalyticsSummary(user.id);
      return NextResponse.json(summary);
    } else if (type === 'session') {
      const sessionId = searchParams.get('sessionId');
      if (!sessionId) {
        return NextResponse.json(
          { error: 'Session ID requerido' },
          { status: 400 }
        );
      }

      const analytics = await prisma.sessionAnalytics.findFirst({
        where: {
          userId: user.id,
          conversationId: sessionId,
        },
      });

      return NextResponse.json(analytics);
    } else {
      // Get all sessions
      const analytics = await prisma.sessionAnalytics.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      return NextResponse.json(analytics);
    }
  } catch (error) {
    console.error('Error getting analytics:', error);
    return NextResponse.json(
      { error: 'Error al obtener análisis' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const { conversationId, sessionType } = await req.json();

    // Get messages from conversation
    const messages = await prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    // Create analytics
    const analytics = await createSessionAnalytics(
      user.id,
      conversationId,
      sessionType,
      messages
    );

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error creating analytics:', error);
    return NextResponse.json(
      { error: 'Error al crear análisis' },
      { status: 500 }
    );
  }
}
