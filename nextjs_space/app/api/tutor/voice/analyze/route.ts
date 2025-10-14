
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { analyzeVoicePronunciation, detectPronunciationPatterns } from '@/lib/ai/voice-conversation-service';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { transcript, conversationId } = await req.json();
    
    if (!transcript?.trim()) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }
    
    // Obtener nivel del usuario
    const learningContext = await prisma.learningContext.findUnique({
      where: { userId: session.user.id }
    });
    
    const targetLevel = learningContext?.currentLevel || 'B1';
    
    // Analizar pronunciación
    const analysis = await analyzeVoicePronunciation(transcript, targetLevel);
    
    // Guardar análisis en la base de datos
    if (conversationId) {
      await prisma.voiceSession.create({
        data: {
          userId: session.user.id,
          conversationId,
          transcript,
          pronunciationScore: analysis.pronunciationScore,
          fluencyScore: analysis.fluencyScore,
          accentScore: analysis.accentScore.overall,
          phonemeErrors: analysis.phonemeErrors as any,
          suggestions: analysis.suggestions
        }
      });
    }
    
    // Detectar patrones de errores recurrentes
    const recentSessions = await prisma.voiceSession.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Últimos 7 días
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    
    // Extraer errores de fonemas de las sesiones recientes
    const recentErrors = recentSessions
      .flatMap(s => (s.phonemeErrors as any[]) || [])
      .filter(e => e && typeof e === 'object');
    
    const { patterns, exercises } = await detectPronunciationPatterns(
      session.user.id,
      recentErrors
    );
    
    return NextResponse.json({
      analysis,
      patterns,
      exercises,
      sessionCount: recentSessions.length
    });
    
  } catch (error) {
    console.error('Error analyzing voice:', error);
    return NextResponse.json(
      { error: 'Failed to analyze voice' },
      { status: 500 }
    );
  }
}

// Get voice analysis history
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const sessions = await prisma.voiceSession.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        conversation: {
          select: {
            context: true,
            title: true
          }
        }
      }
    });
    
    // Calculate overall statistics
    const stats = {
      totalSessions: sessions.length,
      averagePronunciation: sessions.reduce((sum, s) => sum + s.pronunciationScore, 0) / sessions.length || 0,
      averageFluency: sessions.reduce((sum, s) => sum + s.fluencyScore, 0) / sessions.length || 0,
      averageAccent: sessions.reduce((sum, s) => sum + s.accentScore, 0) / sessions.length || 0,
      recentImprovement: calculateImprovement(sessions)
    };
    
    return NextResponse.json({
      sessions,
      stats
    });
    
  } catch (error) {
    console.error('Error fetching voice history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

function calculateImprovement(sessions: any[]): number {
  if (sessions.length < 2) return 0;
  
  const recent = sessions.slice(0, 5);
  const older = sessions.slice(5, 10);
  
  if (older.length === 0) return 0;
  
  const recentAvg = recent.reduce((sum, s) => sum + s.pronunciationScore, 0) / recent.length;
  const olderAvg = older.reduce((sum, s) => sum + s.pronunciationScore, 0) / older.length;
  
  return ((recentAvg - olderAvg) / olderAvg) * 100;
}
