
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

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
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      // Get specific conversation with messages
      const conversation = await prisma.chatConversation.findFirst({
        where: {
          id: conversationId,
          userId: user.id,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversación no encontrada' },
          { status: 404 }
        );
      }

      return NextResponse.json(conversation);
    } else {
      // Get all conversations
      const conversations = await prisma.chatConversation.findMany({
        where: { userId: user.id },
        orderBy: { lastMessageAt: 'desc' },
        include: {
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: { messages: true },
          },
        },
      });

      return NextResponse.json(conversations);
    }
  } catch (error) {
    console.error('Error getting conversation history:', error);
    return NextResponse.json(
      { error: 'Error al obtener historial' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
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
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'ID de conversación requerido' },
        { status: 400 }
      );
    }

    const conversation = await prisma.chatConversation.findFirst({
      where: {
        id: conversationId,
        userId: user.id,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    await prisma.chatConversation.delete({
      where: { id: conversationId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { error: 'Error al eliminar conversación' },
      { status: 500 }
    );
  }
}
