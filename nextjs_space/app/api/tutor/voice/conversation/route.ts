

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { userMessage, conversationHistory, practiceWords } = await req.json();
    
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
    
    return NextResponse.json({
      response: tutorResponse,
      translation,
      suggestedWords: usedWords.length > 0 ? usedWords : null
    });
    
  } catch (error) {
    console.error('Error in conversation:', error);
    return NextResponse.json(
      { 
        response: "I see. Could you tell me more about that?",
        translation: "Ya veo. ¿Podrías contarme más sobre eso?",
        suggestedWords: null
      },
      { status: 200 } // Return 200 con fallback para no romper la UX
    );
  }
}

