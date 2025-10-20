
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import TutorClientV2 from './_components/tutor-client-v2';

async function getTutorData(userId: string) {
  try {
    // Obtener contexto de aprendizaje
    let learningContext = await prisma.learningContext.findUnique({
      where: { userId }
    });
    
    if (!learningContext) {
      learningContext = await prisma.learningContext.create({
        data: {
          userId,
          currentLevel: 'A1',
          weakAreas: [],
          strongAreas: [],
          preferredTopics: [],
          learningGoals: ['improve English for professional settings']
        }
      });
    }
    
    // Obtener conversaciones recientes
    const recentConversations = await prisma.chatConversation.findMany({
      where: { userId, isActive: true },
      orderBy: { lastMessageAt: 'desc' },
      take: 5,
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    
    // Obtener vocabulario reciente
    const currentWeekVocab = await prisma.vocabularyTerm.findMany({
      take: 20,
      include: {
        category: true
      }
    });
    
    // Obtener errores comunes recientes
    const recentMistakes = await prisma.commonMistake.findMany({
      where: { 
        userId,
        mastered: false
      },
      orderBy: { lastSeenAt: 'desc' },
      take: 5
    });
    
    return {
      learningContext: {
        id: learningContext.id,
        currentLevel: learningContext.currentLevel,
        weakAreas: Array.isArray(learningContext.weakAreas) ? learningContext.weakAreas : [],
        strongAreas: Array.isArray(learningContext.strongAreas) ? learningContext.strongAreas : [],
        learningGoals: Array.isArray(learningContext.learningGoals) ? learningContext.learningGoals : [],
        totalConversations: learningContext.totalConversations,
        totalMessages: learningContext.totalMessages
      },
      recentConversations: recentConversations.map(conv => ({
        id: conv.id,
        title: conv.title || 'Nueva conversación',
        context: conv.context || 'casual',
        lastMessageAt: conv.lastMessageAt.toISOString(),
        lastMessage: conv.messages[0]?.content || ''
      })),
      currentWeekVocab: currentWeekVocab.map(term => ({
        id: term.id,
        term: term.term,
        translation: term.translation,
        pronunciation: term.pronunciation,
        category: term.category?.name || ''
      })),
      recentMistakes: recentMistakes.map(mistake => ({
        id: mistake.id,
        mistake: mistake.mistake,
        correction: mistake.correction,
        explanation: mistake.explanation || '',
        occurrences: mistake.occurrences
      }))
    };
  } catch (error) {
    console.error('Error getting tutor data:', error);
    return {
      learningContext: {
        id: '',
        currentLevel: 'A1',
        weakAreas: [],
        strongAreas: [],
        learningGoals: ['improve English for professional settings'],
        totalConversations: 0,
        totalMessages: 0
      },
      recentConversations: [],
      currentWeekVocab: [],
      recentMistakes: []
    };
  }
}

export default async function TutorPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/login');
  }
  
  const tutorData = await getTutorData(session.user.id);
  
  return (
    <TutorClientV2 
      initialData={tutorData}
      userId={session.user.id}
    />
  );
}
