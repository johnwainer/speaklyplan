

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { analyzeGrammar, analyzePronunciation, translateToSpanish } from '@/lib/ai/tutor-service';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { userMessage, conversationHistory, practiceWords, enableAnalysis = true } = await req.json();
    
    if (!userMessage?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    // Construir historial de conversación para contexto
    const recentHistory = (conversationHistory || []).slice(-6).map((msg: any) => 
      `${msg.type === 'user' ? 'Student' : 'Tutor'}: ${msg.text}`
    ).join('\n');
    
    // Seleccionar 2-3 palabras aleatorias del vocabulario para incorporar en la respuesta
    const wordsToIncorporate = (practiceWords || [])
      .filter((w: any) => !w.mastered && w.attempts < 5)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const vocabularyInstructions = wordsToIncorporate.length > 0
      ? `Try to naturally incorporate these vocabulary words in your response: ${wordsToIncorporate.map((w: any) => w.term).join(', ')}. Use them in a way that sounds natural and helps the student practice.`
      : '';
    
    // MEJORA DE VELOCIDAD: Generar respuesta y traducción en paralelo
    const [tutorResponseData, learningContext] = await Promise.all([
      fetch('https://apps.abacus.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a friendly, natural English conversation tutor for Spanish speakers.

CRITICAL RULES:
- Keep responses VERY SHORT (1-2 sentences, 20-30 words MAX)
- Be natural, warm, and conversational like a real friend
- Ask ONE engaging follow-up question
- Use simple, clear, everyday language
- Be encouraging and positive
- Respond naturally to what the student says
${vocabularyInstructions}

Focus on making the student feel comfortable and engaged in natural conversation.`
            },
            {
              role: 'user',
              content: `${recentHistory ? `Recent conversation:\n${recentHistory}\n\n` : ''}Student just said: "${userMessage}"

Respond naturally and keep the conversation flowing.`
            }
          ],
          temperature: 0.9,
          max_tokens: 60 // Reducido para respuestas más rápidas
        })
      }).then(res => res.json()),
      prisma.learningContext.findUnique({
        where: { userId: session.user.id }
      })
    ]);
    
    const tutorResponse = tutorResponseData.choices?.[0]?.message?.content || "That's interesting! Tell me more.";
    const userLevel = learningContext?.currentLevel || 'B1';
    
    // Traducir en paralelo con análisis
    const translationPromise = fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Translate to natural, conversational Spanish. ONLY the translation, no explanations.'
          },
          {
            role: 'user',
            content: tutorResponse
          }
        ],
        temperature: 0.3,
        max_tokens: 80
      })
    }).then(res => res.json()).catch(() => ({ choices: [{ message: { content: tutorResponse } }] }));
    
    let translation = tutorResponse; // Fallback
    
    // Identificar qué palabras del vocabulario se usaron en la respuesta
    const usedWords = wordsToIncorporate.filter((word: any) =>
      tutorResponse.toLowerCase().includes(word.term.toLowerCase())
    );
    
    // MEJORA DE VELOCIDAD: Ejecutar TODO en paralelo (traducción, análisis, actualizaciones DB)
    const analysisPromises: Promise<any>[] = [];
    
    // Actualizar intentos para las palabras usadas (no bloqueante)
    if (usedWords.length > 0) {
      const updatePromises = usedWords.map((word: any) =>
        prisma.userVocabularyProgress.updateMany({
          where: {
            userId: session.user.id,
            word: {
              term: word.term
            }
          },
          data: {
            attempts: {
              increment: 1
            },
            lastReviewed: new Date()
          }
        }).catch(err => console.log('Error updating vocab:', err))
      );
      analysisPromises.push(...updatePromises);
    }
    
    // Análisis en paralelo (solo si hay suficiente texto)
    let grammarPromise: Promise<any> = Promise.resolve(null);
    let pronunciationPromise: Promise<any> = Promise.resolve(null);
    
    if (enableAnalysis && userMessage.trim().split(' ').length >= 3) {
      grammarPromise = analyzeGrammar(userMessage, userLevel).catch(err => {
        console.error('Grammar analysis error:', err);
        return null;
      });
      
      pronunciationPromise = analyzePronunciation(userMessage, userLevel).catch(err => {
        console.error('Pronunciation analysis error:', err);
        return null;
      });
      
      analysisPromises.push(grammarPromise, pronunciationPromise);
    }
    
    // Esperar traducción + análisis en paralelo
    const [translationData, grammarAnalysis, pronunciationAnalysis] = await Promise.all([
      translationPromise,
      grammarPromise,
      pronunciationPromise
    ]);
    
    translation = translationData?.choices?.[0]?.message?.content || tutorResponse;
    
    // Guardar errores y sesiones en background (no bloqueante)
    if (grammarAnalysis?.errors && grammarAnalysis.errors.length > 0) {
      Promise.all(
        grammarAnalysis.errors.map((error: any) =>
          prisma.commonMistake.upsert({
            where: {
              userId_mistake: {
                userId: session.user.id,
                mistake: error.original
              }
            },
            update: {
              occurrences: { increment: 1 },
              lastSeenAt: new Date(),
              correction: error.correction,
              explanation: error.explanationSpanish || error.explanation
            },
            create: {
              userId: session.user.id,
              errorType: 'grammar',
              mistake: error.original,
              correction: error.correction,
              explanation: error.explanationSpanish || error.explanation,
              occurrences: 1
            }
          }).catch(e => console.log('Error saving mistake:', e))
        )
      ).catch(e => console.log('Error in background save:', e));
    }
    
    // Guardar análisis de pronunciación en background
    if (pronunciationAnalysis && pronunciationAnalysis.phonemeErrors?.length > 0) {
      prisma.voiceSession.create({
        data: {
          userId: session.user.id,
          transcript: userMessage,
          pronunciationScore: pronunciationAnalysis.pronunciationScore || 85,
          fluencyScore: pronunciationAnalysis.fluencyScore || 85,
          accentScore: 85,
          phonemeErrors: pronunciationAnalysis.phonemeErrors || [],
          suggestions: pronunciationAnalysis.suggestions || []
        }
      }).catch(e => console.log('Error saving voice session:', e));
    }
    
    return NextResponse.json({
      response: tutorResponse,
      translation,
      suggestedWords: usedWords.length > 0 ? usedWords : null,
      grammarAnalysis,
      pronunciationAnalysis
    });
    
  } catch (error) {
    console.error('Error in conversation:', error);
    return NextResponse.json(
      { 
        response: "I see. Could you tell me more about that?",
        translation: "Ya veo. ¿Podrías contarme más sobre eso?",
        suggestedWords: null,
        grammarAnalysis: null,
        pronunciationAnalysis: null
      },
      { status: 200 } // Return 200 con fallback para no romper la UX
    );
  }
}

