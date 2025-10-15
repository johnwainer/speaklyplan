

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
    
    // Generar respuesta del tutor
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
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
- Keep responses SHORT (2-3 sentences max, 30-40 words)
- Be natural, warm, and conversational
- Ask engaging follow-up questions
- Use simple, clear language
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
        max_tokens: 100
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate response');
    }
    
    const data = await response.json();
    const tutorResponse = data.choices?.[0]?.message?.content || "That's interesting! Tell me more.";
    
    // Traducir la respuesta al español
    const translationResponse = await fetch('https://apps.abacus.ai/v1/chat/completions', {
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
            content: 'You are a professional translator. Translate the following English text to natural, conversational Spanish. Provide ONLY the translation, no explanations.'
          },
          {
            role: 'user',
            content: tutorResponse
          }
        ],
        temperature: 0.3,
        max_tokens: 150
      })
    });
    
    let translation = tutorResponse; // Fallback
    
    if (translationResponse.ok) {
      const translationData = await translationResponse.json();
      translation = translationData.choices?.[0]?.message?.content || tutorResponse;
    }
    
    // Identificar qué palabras del vocabulario se usaron en la respuesta
    const usedWords = wordsToIncorporate.filter((word: any) =>
      tutorResponse.toLowerCase().includes(word.term.toLowerCase())
    );
    
    // Actualizar intentos para las palabras usadas
    if (usedWords.length > 0) {
      for (const word of usedWords) {
        await prisma.userVocabularyProgress.updateMany({
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
        });
      }
    }
    
    // MEJORA #1 y #3: Análisis de pronunciación y gramática en paralelo
    let grammarAnalysis = null;
    let pronunciationAnalysis = null;
    
    if (enableAnalysis && userMessage.trim().split(' ').length >= 3) {
      // Obtener nivel del usuario
      const learningContext = await prisma.learningContext.findUnique({
        where: { userId: session.user.id }
      });
      
      const userLevel = learningContext?.currentLevel || 'B1';
      
      // Ejecutar análisis en paralelo para mejor performance
      const [grammar, pronunciation] = await Promise.all([
        analyzeGrammar(userMessage, userLevel).catch(err => {
          console.error('Grammar analysis error:', err);
          return null;
        }),
        analyzePronunciation(userMessage, userLevel).catch(err => {
          console.error('Pronunciation analysis error:', err);
          return null;
        })
      ]);
      
      grammarAnalysis = grammar;
      pronunciationAnalysis = pronunciation;
      
      // Guardar errores comunes para tracking (Modo Tolerante - no interrumpir)
      if (grammar?.errors && grammar.errors.length > 0) {
        for (const error of grammar.errors) {
          try {
            await prisma.commonMistake.upsert({
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
            });
          } catch (e) {
            console.log('Error saving common mistake:', e);
          }
        }
      }
      
      // Guardar análisis de pronunciación para tracking de patrones
      if (pronunciation && pronunciation.phonemeErrors?.length > 0) {
        try {
          await prisma.voiceSession.create({
            data: {
              userId: session.user.id,
              transcript: userMessage,
              pronunciationScore: pronunciation.pronunciationScore || 85,
              fluencyScore: pronunciation.fluencyScore || 85,
              accentScore: 85,
              phonemeErrors: pronunciation.phonemeErrors || [],
              suggestions: pronunciation.suggestions || []
            }
          });
        } catch (e) {
          console.log('Error saving voice session:', e);
        }
      }
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

