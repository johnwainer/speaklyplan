
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateTutorResponse, analyzeGrammar, translateToSpanish } from '@/lib/ai/tutor-service';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { message, conversationId, context, userId } = await req.json();
    
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    // 1. Obtener o crear conversación
    let conversation;
    if (conversationId) {
      conversation = await prisma.chatConversation.findUnique({
        where: { id: conversationId },
        include: { 
          messages: { 
            orderBy: { createdAt: 'desc' }, 
            take: 10 
          } 
        }
      });
    }
    
    if (!conversation) {
      conversation = await prisma.chatConversation.create({
        data: {
          userId,
          context: context || 'casual',
          title: `Conversación - ${new Date().toLocaleDateString('es-ES')}`
        },
        include: { messages: true }
      });
    }
    
    // 2. Guardar mensaje del usuario
    const userMessage = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message
      }
    });
    
    // 3. Obtener o crear contexto de aprendizaje del usuario
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
    
    // 4. Obtener vocabulario relevante (primeras 20 palabras para el MVP)
    const relevantVocab = await prisma.vocabularyTerm.findMany({
      take: 20,
      include: {
        category: true
      }
    });
    
    // 5. Generar respuesta del tutor usando IA
    const conversationHistory = conversation.messages
      .reverse()
      .map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content
      }));
    
    const tutorResponse = await generateTutorResponse({
      userMessage: message,
      conversationHistory,
      learningContext: {
        currentLevel: learningContext.currentLevel,
        weakAreas: Array.isArray(learningContext.weakAreas) ? learningContext.weakAreas : [],
        strongAreas: Array.isArray(learningContext.strongAreas) ? learningContext.strongAreas : [],
        learningGoals: Array.isArray(learningContext.learningGoals) ? learningContext.learningGoals : [],
        totalMessages: learningContext.totalMessages
      },
      context: conversation.context || 'casual',
      vocabulary: relevantVocab
    });
    
    // 6. Analizar errores gramaticales (solo para niveles básicos e intermedios)
    let grammarAnalysis = { errors: [], feedback: { hasErrors: false, suggestion: '' } };
    if (['A1', 'A2', 'B1'].includes(learningContext.currentLevel)) {
      grammarAnalysis = await analyzeGrammar(message, learningContext.currentLevel);
    }
    
    // 7. Generar traducción para niveles principiantes
    let translation = null;
    if (['A1', 'A2'].includes(learningContext.currentLevel)) {
      translation = await translateToSpanish(tutorResponse.content);
    }
    
    // 8. Guardar respuesta del asistente
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: tutorResponse.content,
        translation: translation,
        grammarErrors: grammarAnalysis.errors,
        vocabularyUsed: tutorResponse.vocabularyUsed
      }
    });
    
    // 9. Actualizar errores comunes del usuario
    if (grammarAnalysis.errors && Array.isArray(grammarAnalysis.errors) && grammarAnalysis.errors.length > 0) {
      for (const error of grammarAnalysis.errors) {
        if (!error || typeof error !== 'object') continue;
        
        const errorObj = error as { 
          type: string; 
          original: string; 
          correction: string; 
          explanation?: string;
        };
        
        const existingMistake = await prisma.commonMistake.findFirst({
          where: {
            userId,
            mistake: errorObj.original
          }
        });
        
        if (existingMistake) {
          await prisma.commonMistake.update({
            where: { id: existingMistake.id },
            data: {
              occurrences: { increment: 1 },
              lastSeenAt: new Date()
            }
          });
        } else {
          await prisma.commonMistake.create({
            data: {
              userId,
              errorType: errorObj.type,
              mistake: errorObj.original,
              correction: errorObj.correction,
              explanation: errorObj.explanation || ''
            }
          });
        }
      }
    }
    
    // 10. Actualizar contexto de aprendizaje
    await prisma.learningContext.update({
      where: { userId },
      data: {
        totalMessages: { increment: 1 }
      }
    });
    
    // 11. Actualizar timestamp de la conversación
    await prisma.chatConversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: new Date()
      }
    });
    
    return NextResponse.json({
      messageId: assistantMessage.id,
      conversationId: conversation.id,
      content: tutorResponse.content,
      translation: translation,
      grammarFeedback: grammarAnalysis.feedback,
      vocabularyUsed: tutorResponse.vocabularyUsed
    });
    
  } catch (error) {
    console.error('Error in tutor chat:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

// Endpoint para obtener el historial de conversaciones
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    
    if (conversationId) {
      // Obtener una conversación específica con sus mensajes
      const conversation = await prisma.chatConversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });
      
      return NextResponse.json({ conversation });
    } else {
      // Obtener todas las conversaciones del usuario
      const conversations = await prisma.chatConversation.findMany({
        where: { userId: session.user.id },
        orderBy: { lastMessageAt: 'desc' },
        take: 20,
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });
      
      return NextResponse.json({ conversations });
    }
    
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
