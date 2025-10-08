
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Obtener el contexto de aprendizaje del usuario
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    let context = await prisma.learningContext.findUnique({
      where: { userId: session.user.id }
    });
    
    if (!context) {
      context = await prisma.learningContext.create({
        data: {
          userId: session.user.id,
          currentLevel: 'A1',
          weakAreas: [],
          strongAreas: [],
          preferredTopics: [],
          learningGoals: ['improve English for professional settings']
        }
      });
    }
    
    return NextResponse.json({ context });
    
  } catch (error) {
    console.error('Error fetching learning context:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learning context' },
      { status: 500 }
    );
  }
}

// Actualizar el contexto de aprendizaje del usuario
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { currentLevel, weakAreas, strongAreas, learningGoals, preferredTopics } = await req.json();
    
    const context = await prisma.learningContext.upsert({
      where: { userId: session.user.id },
      update: {
        currentLevel,
        weakAreas,
        strongAreas,
        learningGoals,
        preferredTopics
      },
      create: {
        userId: session.user.id,
        currentLevel: currentLevel || 'A1',
        weakAreas: weakAreas || [],
        strongAreas: strongAreas || [],
        learningGoals: learningGoals || [],
        preferredTopics: preferredTopics || []
      }
    });
    
    return NextResponse.json({ context });
    
  } catch (error) {
    console.error('Error updating learning context:', error);
    return NextResponse.json(
      { error: 'Failed to update learning context' },
      { status: 500 }
    );
  }
}
