
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const onlyUnmastered = searchParams.get('unmastered') === 'true';
    
    const where: any = {
      userId: session.user.id
    };
    
    if (onlyUnmastered) {
      where.mastered = false;
    }
    
    const mistakes = await prisma.commonMistake.findMany({
      where,
      orderBy: [
        { occurrences: 'desc' },
        { lastSeenAt: 'desc' }
      ],
      take: limit
    });
    
    // Calcular estadísticas
    const stats = {
      totalMistakes: mistakes.length,
      grammarErrors: mistakes.filter(m => m.errorType === 'grammar').length,
      pronunciationErrors: mistakes.filter(m => m.errorType === 'pronunciation').length,
      vocabularyErrors: mistakes.filter(m => m.errorType === 'vocabulary').length,
      mostCommon: mistakes.slice(0, 3).map(m => ({
        mistake: m.mistake,
        correction: m.correction,
        occurrences: m.occurrences
      }))
    };
    
    return NextResponse.json({
      mistakes,
      stats
    });
    
  } catch (error) {
    console.error('Error fetching common mistakes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mistakes' },
      { status: 500 }
    );
  }
}

// Mark a mistake as mastered
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { mistakeId } = await req.json();
    
    if (!mistakeId) {
      return NextResponse.json({ error: 'Mistake ID is required' }, { status: 400 });
    }
    
    const updated = await prisma.commonMistake.update({
      where: {
        id: mistakeId,
        userId: session.user.id // Security check
      },
      data: {
        mastered: true
      }
    });
    
    return NextResponse.json({ success: true, mistake: updated });
    
  } catch (error) {
    console.error('Error updating mistake:', error);
    return NextResponse.json(
      { error: 'Failed to update mistake' },
      { status: 500 }
    );
  }
}
