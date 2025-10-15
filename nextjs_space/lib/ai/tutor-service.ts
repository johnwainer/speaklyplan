
// Servicio principal del tutor de IA

import { getTutorSystemPrompt, getContextualPrompt } from './prompts';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface GenerateTutorResponseParams {
  userMessage: string;
  conversationHistory: Message[];
  learningContext: any;
  context: string;
  vocabulary: any[];
}

export async function generateTutorResponse(params: GenerateTutorResponseParams) {
  const {
    userMessage,
    conversationHistory,
    learningContext,
    context,
    vocabulary
  } = params;
  
  // 1. Construir el prompt del sistema
  const systemPrompt = getTutorSystemPrompt(learningContext);
  
  // 2. Construir el prompt contextual
  const contextualPrompt = getContextualPrompt(
    context,
    vocabulary.map(v => v.term)
  );
  
  // 3. Construir historial de conversación (últimos 10 mensajes)
  const recentHistory = conversationHistory
    .slice(-10)
    .map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  
  // 4. Construir array de mensajes
  const messages: Message[] = [
    { role: 'system', content: systemPrompt },
    { role: 'system', content: contextualPrompt },
    ...recentHistory,
    { role: 'user', content: userMessage }
  ];
  
  // 5. Llamar a la API de Abacus AI
  try {
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 300,
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to get tutor response');
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 
                   'I apologize, I had trouble responding. Could you try again?';
    
    // 6. Detectar vocabulario usado
    const vocabularyUsed = vocabulary
      .filter(v => content.toLowerCase().includes(v.term.toLowerCase()))
      .map(v => v.term);
    
    return {
      content,
      vocabularyUsed
    };
  } catch (error) {
    console.error('Error generating tutor response:', error);
    return {
      content: "I'm having trouble connecting right now. Please try again in a moment.",
      vocabularyUsed: []
    };
  }
}

export async function analyzeGrammar(text: string, level: string = 'A1') {
  const { getGrammarAnalysisPrompt } = require('./prompts');
  const prompt = getGrammarAnalysisPrompt(text, level);
  
  try {
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
            content: 'You are a grammar analysis expert. Always return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      return {
        errors: [],
        feedback: { hasErrors: false, suggestion: '', accuracyScore: 100 }
      };
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      return {
        errors: [],
        feedback: { hasErrors: false, suggestion: '', accuracyScore: 100 }
      };
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing grammar:', error);
    return {
      errors: [],
      feedback: { hasErrors: false, suggestion: '', accuracyScore: 100 }
    };
  }
}

export async function analyzePronunciation(text: string, level: string = 'A1') {
  const { getPronunciationAnalysisPrompt } = require('./prompts');
  const prompt = getPronunciationAnalysisPrompt(text, level);
  
  try {
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
            content: 'You are a pronunciation and phonetics expert. Always return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      return getDefaultPronunciationAnalysis();
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      return getDefaultPronunciationAnalysis();
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing pronunciation:', error);
    return getDefaultPronunciationAnalysis();
  }
}

function getDefaultPronunciationAnalysis() {
  return {
    pronunciationScore: 85,
    fluencyScore: 85,
    phonemeErrors: [],
    strengths: ['Keep practicing!'],
    areasToImprove: [],
    suggestions: ['Continue with your great work!'],
    suggestionsSpanish: ['¡Continúa con tu excelente trabajo!'],
    overallFeedback: 'Good effort!',
    overallFeedbackSpanish: '¡Buen esfuerzo!'
  };
}

export async function translateToSpanish(text: string): Promise<string> {
  const { getTranslationPrompt } = require('./prompts');
  const prompt = getTranslationPrompt(text);
  
  try {
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
            content: 'You are a translator. Return only the translation.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      })
    });
    
    if (!response.ok) {
      return '';
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('Error translating:', error);
    return '';
  }
}
