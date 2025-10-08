
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  calculateNextReview,
  getCardsDueForReview,
  getRecommendedSessionSize,
  categorizeCardsByDifficulty,
} from '@/lib/ai/spaced-repetition';

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
    const filter = searchParams.get('filter') || 'due';

    let cards = await prisma.vocabularyCard.findMany({
      where: { userId: user.id },
      orderBy: { nextReviewDate: 'asc' },
    });

    // Apply filters
    if (filter === 'due') {
      cards = getCardsDueForReview(cards);
    } else if (filter === 'all') {
      // Return all cards
    } else if (filter === 'new') {
      cards = cards.filter((c) => c.repetitions === 0);
    } else if (filter === 'learning') {
      cards = cards.filter((c) => c.repetitions > 0 && c.repetitions < 3);
    } else if (filter === 'mastered') {
      cards = cards.filter((c) => c.repetitions >= 3);
    }

    const dueCards = getCardsDueForReview(
      await prisma.vocabularyCard.findMany({
        where: { userId: user.id },
      })
    );

    const categories = categorizeCardsByDifficulty(cards);
    const recommendedSessionSize = getRecommendedSessionSize(dueCards.length);

    return NextResponse.json({
      cards,
      dueCount: dueCards.length,
      totalCount: cards.length,
      categories,
      recommendedSessionSize,
    });
  } catch (error) {
    console.error('Error getting vocabulary cards:', error);
    return NextResponse.json(
      { error: 'Error al obtener tarjetas' },
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

    const { word, translation, context } = await req.json();

    // Check if card already exists
    const existing = await prisma.vocabularyCard.findFirst({
      where: {
        userId: user.id,
        word: word.toLowerCase(),
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Esta palabra ya está en tu lista' },
        { status: 400 }
      );
    }

    const card = await prisma.vocabularyCard.create({
      data: {
        userId: user.id,
        word: word.toLowerCase(),
        translation,
        context,
        nextReviewDate: new Date(), // Available immediately for first review
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error creating vocabulary card:', error);
    return NextResponse.json(
      { error: 'Error al crear tarjeta' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
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

    const { cardId, quality } = await req.json();

    const card = await prisma.vocabularyCard.findUnique({
      where: { id: cardId },
    });

    if (!card || card.userId !== user.id) {
      return NextResponse.json(
        { error: 'Tarjeta no encontrada' },
        { status: 404 }
      );
    }

    // Calculate next review using SM-2 algorithm
    const review = calculateNextReview(
      quality,
      card.easeFactor,
      card.interval,
      card.repetitions
    );

    // Update card
    const updatedCard = await prisma.vocabularyCard.update({
      where: { id: cardId },
      data: {
        difficulty: quality,
        easeFactor: review.easeFactor,
        interval: review.interval,
        repetitions: review.repetitions,
        nextReviewDate: review.nextReviewDate,
        lastReviewedAt: new Date(),
      },
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error('Error reviewing vocabulary card:', error);
    return NextResponse.json(
      { error: 'Error al revisar tarjeta' },
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
    const cardId = searchParams.get('cardId');

    if (!cardId) {
      return NextResponse.json(
        { error: 'ID de tarjeta requerido' },
        { status: 400 }
      );
    }

    const card = await prisma.vocabularyCard.findUnique({
      where: { id: cardId },
    });

    if (!card || card.userId !== user.id) {
      return NextResponse.json(
        { error: 'Tarjeta no encontrada' },
        { status: 404 }
      );
    }

    await prisma.vocabularyCard.delete({
      where: { id: cardId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vocabulary card:', error);
    return NextResponse.json(
      { error: 'Error al eliminar tarjeta' },
      { status: 500 }
    );
  }
}
