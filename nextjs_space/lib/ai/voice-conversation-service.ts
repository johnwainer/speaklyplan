
/**
 * Servicio de Conversación de Voz en Tiempo Real
 * Implementa la Mejora #1 del análisis de IA
 */

interface PhonemeError {
  phoneme: string;
  position: number;
  severity: 'low' | 'medium' | 'high';
  nativeComparison: number; // 0-100 similarity
  suggestion: string;
}

interface AccentScore {
  overall: number; // 0-100
  nativeAccent: string; // 'american', 'british', etc.
  problemPhonemes: string[];
  strengths: string[];
}

interface VoiceAnalysisResult {
  transcript: string;
  phonemeErrors: PhonemeError[];
  accentScore: AccentScore;
  fluencyScore: number; // 0-100
  pronunciationScore: number; // 0-100
  suggestions: string[];
}

/**
 * Analiza la pronunciación del usuario en profundidad
 */
export async function analyzeVoicePronunciation(
  audioText: string,
  targetLevel: string = 'B1'
): Promise<VoiceAnalysisResult> {
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
            content: `You are an advanced phonetics and pronunciation expert for English learners. 
Analyze the transcribed speech and identify:
1. Common phoneme pronunciation issues for Spanish speakers (th, r, v, etc.)
2. Overall accent quality and native speaker similarity
3. Fluency and natural speech patterns
4. Specific suggestions for improvement

Target level: ${targetLevel}

Return a detailed JSON analysis.`
          },
          {
            role: 'user',
            content: `Analyze this transcribed speech for pronunciation issues: "${audioText}"\n\nProvide detailed phoneme analysis, accent scoring, and specific suggestions.`
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze voice');
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      return getDefaultAnalysis(audioText);
    }
    
    const analysis = JSON.parse(content);
    
    return {
      transcript: audioText,
      phonemeErrors: analysis.phonemeErrors || [],
      accentScore: analysis.accentScore || { overall: 75, nativeAccent: 'neutral', problemPhonemes: [], strengths: [] },
      fluencyScore: analysis.fluencyScore || 75,
      pronunciationScore: analysis.pronunciationScore || 75,
      suggestions: analysis.suggestions || []
    };
  } catch (error) {
    console.error('Error analyzing voice:', error);
    return getDefaultAnalysis(audioText);
  }
}

function getDefaultAnalysis(transcript: string): VoiceAnalysisResult {
  return {
    transcript,
    phonemeErrors: [],
    accentScore: {
      overall: 75,
      nativeAccent: 'neutral',
      problemPhonemes: [],
      strengths: ['Good effort!']
    },
    fluencyScore: 75,
    pronunciationScore: 75,
    suggestions: ['Keep practicing!']
  };
}

/**
 * Genera una respuesta de voz conversacional del tutor
 */
export async function generateVoiceResponse(
  userTranscript: string,
  conversationContext: any,
  analysisResult: VoiceAnalysisResult
): Promise<{ text: string; shouldCorrect: boolean; correctionPhrase?: string }> {
  try {
    const hasCriticalErrors = analysisResult.phonemeErrors.some(e => e.severity === 'high');
    
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
            content: `You are a conversational English tutor in a voice conversation. 
Keep responses natural and concise (1-3 sentences max).
Be encouraging and supportive.
If there are critical pronunciation errors, naturally incorporate the correct pronunciation in your response.
Focus on maintaining conversation flow while gently correcting.`
          },
          {
            role: 'user',
            content: `User said: "${userTranscript}"
Pronunciation score: ${analysisResult.pronunciationScore}/100
Has critical errors: ${hasCriticalErrors}

Respond naturally to continue the conversation. If there are critical pronunciation issues, subtly demonstrate the correct pronunciation.`
          }
        ],
        temperature: 0.8,
        max_tokens: 150
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate voice response');
    }
    
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 'I see. Please continue.';
    
    return {
      text,
      shouldCorrect: hasCriticalErrors,
      correctionPhrase: hasCriticalErrors 
        ? `Let me help with that pronunciation...` 
        : undefined
    };
  } catch (error) {
    console.error('Error generating voice response:', error);
    return {
      text: 'That\'s interesting. Tell me more.',
      shouldCorrect: false
    };
  }
}

/**
 * Detecta patrones de errores para crear ejercicios personalizados
 */
export async function detectPronunciationPatterns(
  userId: string,
  recentErrors: PhonemeError[]
): Promise<{ patterns: string[]; exercises: any[] }> {
  if (recentErrors.length === 0) {
    return { patterns: [], exercises: [] };
  }
  
  try {
    // Agrupar errores por fonema
    const phonemeGroups = recentErrors.reduce((acc, error) => {
      const phoneme = error.phoneme;
      if (!acc[phoneme]) {
        acc[phoneme] = [];
      }
      acc[phoneme].push(error);
      return acc;
    }, {} as Record<string, PhonemeError[]>);
    
    // Identificar patrones (fonemas que aparecen 3+ veces)
    const patterns = Object.entries(phonemeGroups)
      .filter(([, errors]) => errors.length >= 3)
      .map(([phoneme]) => phoneme);
    
    // Generar ejercicios personalizados
    const exercises = await generateCustomExercises(patterns);
    
    return { patterns, exercises };
  } catch (error) {
    console.error('Error detecting patterns:', error);
    return { patterns: [], exercises: [] };
  }
}

async function generateCustomExercises(problemPhonemes: string[]): Promise<any[]> {
  if (problemPhonemes.length === 0) return [];
  
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
            content: 'You are a pronunciation exercise creator. Generate practice exercises for problem phonemes.'
          },
          {
            role: 'user',
            content: `Create 5 practice phrases for these problem phonemes: ${problemPhonemes.join(', ')}. 
Return as JSON array with: { phoneme, phrase, difficulty, tip }`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) return [];
    
    const parsed = JSON.parse(content);
    return parsed.exercises || [];
  } catch (error) {
    console.error('Error generating exercises:', error);
    return [];
  }
}

/**
 * Simula diferentes acentos para práctica
 */
export interface AccentProfile {
  accent: 'american' | 'british' | 'indian' | 'australian';
  characteristics: string[];
  practicePrompts: string[];
}

export const ACCENT_PROFILES: Record<string, AccentProfile> = {
  american: {
    accent: 'american',
    characteristics: ['Rhotic R', 'Flat A', 'Hard T'],
    practicePrompts: [
      'Tell me about your work.',
      'What are your thoughts on this?',
      'Can you walk me through that?'
    ]
  },
  british: {
    accent: 'british',
    characteristics: ['Non-rhotic R', 'Received Pronunciation', 'Glottal Stop'],
    practicePrompts: [
      'Brilliant! Could you elaborate?',
      'That\'s quite interesting.',
      'Shall we discuss this further?'
    ]
  },
  indian: {
    accent: 'indian',
    characteristics: ['Retroflex sounds', 'Syllable timing', 'V/W distinction'],
    practicePrompts: [
      'Could you please clarify?',
      'That is very good point.',
      'Let us discuss the requirements.'
    ]
  },
  australian: {
    accent: 'australian',
    characteristics: ['Vowel shifting', 'Rising intonation', 'A variations'],
    practicePrompts: [
      'G\'day! How\'s it going?',
      'That\'s a ripper idea!',
      'No worries, mate.'
    ]
  }
};
