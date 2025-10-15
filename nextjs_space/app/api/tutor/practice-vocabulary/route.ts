

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
    
    // Obtener palabras del vocabulario del usuario que necesitan práctica
    // Priorizar: no dominadas, con pocos intentos, y revisadas hace tiempo
    const vocabularyProgress = await prisma.userVocabularyProgress.findMany({
      where: {
        userId: session.user.id,
        OR: [
          { mastered: false },
          { attempts: { lt: 5 } }
        ]
      },
      include: {
        word: {
          include: {
            category: true
          }
        }
      },
      orderBy: [
        { mastered: 'asc' },  // No dominadas primero
        { attempts: 'asc' },  // Con menos intentos primero
        { lastReviewed: 'asc' }  // Menos revisadas recientemente
      ],
      take: 20
    });
    
    // Si no hay progreso registrado, obtener palabras básicas del vocabulario
    if (vocabularyProgress.length === 0) {
      const basicVocabulary = await prisma.vocabularyTerm.findMany({
        where: {
          difficulty: {
            in: ['basic', 'intermediate']
          }
        },
        include: {
          category: true
        },
        take: 15,
        orderBy: {
          term: 'asc'
        }
      });
      
      const words = basicVocabulary.map(term => ({
        term: term.term,
        translation: term.translation,
        pronunciation: term.pronunciation,
        attempts: 0,
        mastered: false,
        category: term.category.name
      }));
      
      return NextResponse.json({ words });
    }
    
    // Formatear las palabras para la respuesta
    const words = vocabularyProgress.map(progress => ({
      term: progress.word.term,
      translation: progress.word.translation,
      pronunciation: progress.word.pronunciation,
      attempts: progress.attempts,
      mastered: progress.mastered,
      category: progress.word.category.name
    }));
    
    return NextResponse.json({ words });
    
  } catch (error) {
    console.error('Error fetching practice vocabulary:', error);
    return NextResponse.json(
      { words: [] },
      { status: 200 } // Return 200 con array vacío como fallback
    );
  }
}

