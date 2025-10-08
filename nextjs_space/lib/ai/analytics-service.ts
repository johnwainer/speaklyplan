
/**
 * Analytics Service
 * Generates detailed session analytics and learning insights
 */

import { prisma } from '@/lib/db';

export interface SessionMetrics {
  duration: number;
  messagesCount: number;
  wordsSpoken: number;
  grammarAccuracy?: number;
  vocabularyDiversity?: number;
  responseTime?: number;
  turnTaking: number;
  questionsAsked: number;
  newWordsLearned: string[];
  errorsIdentified: any[];
  topicsDiscussed: string[];
}

/**
 * Calculate grammar accuracy from messages
 */
export function calculateGrammarAccuracy(messages: any[]): number {
  let totalErrors = 0;
  let totalWords = 0;

  messages.forEach((msg) => {
    if (msg.role === 'user') {
      const wordCount = msg.content.split(/\s+/).length;
      totalWords += wordCount;

      if (msg.grammarErrors) {
        const errors = Array.isArray(msg.grammarErrors)
          ? msg.grammarErrors
          : msg.grammarErrors.errors || [];
        totalErrors += errors.length;
      }
    }
  });

  if (totalWords === 0) return 100;

  const errorRate = totalErrors / totalWords;
  return Math.max(0, (1 - errorRate) * 100);
}

/**
 * Calculate vocabulary diversity (unique words / total words)
 */
export function calculateVocabularyDiversity(messages: any[]): number {
  const allWords = new Set<string>();
  let totalWords = 0;

  messages.forEach((msg) => {
    if (msg.role === 'user') {
      const words = msg.content.toLowerCase().match(/\b\w+\b/g) || [];
      words.forEach((word: string) => allWords.add(word));
      totalWords += words.length;
    }
  });

  if (totalWords === 0) return 0;

  return (allWords.size / totalWords) * 100;
}

/**
 * Extract new words learned from vocabulary usage
 */
export function extractNewWords(messages: any[]): string[] {
  const newWords = new Set<string>();

  messages.forEach((msg) => {
    if (msg.vocabularyUsed) {
      const vocab = Array.isArray(msg.vocabularyUsed)
        ? msg.vocabularyUsed
        : msg.vocabularyUsed?.words || [];

      vocab.forEach((word: { word: string; isNew?: boolean }) => {
        if (word.isNew) {
          newWords.add(word.word);
        }
      });
    }
  });

  return Array.from(newWords);
}

/**
 * Extract all grammar errors
 */
export function extractGrammarErrors(messages: any[]): any[] {
  const allErrors: any[] = [];

  messages.forEach((msg) => {
    if (msg.role === 'user' && msg.grammarErrors) {
      const errors = Array.isArray(msg.grammarErrors)
        ? msg.grammarErrors
        : msg.grammarErrors.errors || [];

      errors.forEach((error: any) => {
        allErrors.push({
          message: msg.content,
          error: error.mistake || error.message,
          correction: error.correction,
          type: error.type || 'grammar',
        });
      });
    }
  });

  return allErrors;
}

/**
 * Calculate response time (average time between user message and AI response)
 */
export function calculateAverageResponseTime(messages: any[]): number {
  const responseTimes: number[] = [];

  for (let i = 0; i < messages.length - 1; i++) {
    if (messages[i].role === 'user' && messages[i + 1].role === 'assistant') {
      const userTime = new Date(messages[i].createdAt).getTime();
      const aiTime = new Date(messages[i + 1].createdAt).getTime();
      responseTimes.push((aiTime - userTime) / 1000); // in seconds
    }
  }

  if (responseTimes.length === 0) return 0;

  return responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
}

/**
 * Count turn-taking (back-and-forth exchanges)
 */
export function countTurnTaking(messages: any[]): number {
  let turns = 0;

  for (let i = 0; i < messages.length - 1; i++) {
    if (messages[i].role !== messages[i + 1].role) {
      turns++;
    }
  }

  return Math.floor(turns / 2); // Divide by 2 to get pairs
}

/**
 * Count questions asked by user
 */
export function countQuestionsAsked(messages: any[]): number {
  return messages.filter(
    (msg) => msg.role === 'user' && msg.content.includes('?')
  ).length;
}

/**
 * Calculate fluency score (based on message length and coherence)
 */
export function calculateFluencyScore(messages: any[]): number {
  const userMessages = messages.filter((m) => m.role === 'user');

  if (userMessages.length === 0) return 0;

  const avgLength =
    userMessages.reduce((sum, m) => sum + m.content.split(/\s+/).length, 0) /
    userMessages.length;

  // Score based on average message length (5-20 words is ideal)
  let score = 50;

  if (avgLength >= 5 && avgLength <= 20) {
    score = 90;
  } else if (avgLength > 20 && avgLength <= 30) {
    score = 75;
  } else if (avgLength < 5) {
    score = 40;
  }

  return Math.min(100, score);
}

/**
 * Calculate comprehension score (based on relevance and turn-taking)
 */
export function calculateComprehensionScore(
  messages: any[],
  turnTaking: number
): number {
  if (messages.length < 4) return 50;

  // High turn-taking indicates good comprehension
  const avgTurnTaking = turnTaking / (messages.length / 2);

  return Math.min(100, 50 + avgTurnTaking * 25);
}

/**
 * Generate feedback and recommendations
 */
export function generateFeedback(metrics: SessionMetrics): {
  feedback: string;
  strengths: string[];
  areasToImprove: string[];
} {
  const strengths: string[] = [];
  const areasToImprove: string[] = [];

  // Grammar
  if ((metrics.grammarAccuracy || 0) >= 90) {
    strengths.push('Excelente precisión gramatical');
  } else if ((metrics.grammarAccuracy || 0) < 70) {
    areasToImprove.push('Revisar reglas gramaticales básicas');
  }

  // Vocabulary
  if ((metrics.vocabularyDiversity || 0) >= 60) {
    strengths.push('Vocabulario diverso y rico');
  } else if ((metrics.vocabularyDiversity || 0) < 40) {
    areasToImprove.push('Ampliar vocabulario activo');
  }

  // Engagement
  if (metrics.turnTaking >= 5) {
    strengths.push('Participación activa en la conversación');
  } else if (metrics.turnTaking < 3) {
    areasToImprove.push('Ser más participativo en las conversaciones');
  }

  // Questions
  if (metrics.questionsAsked >= 2) {
    strengths.push('Curiosidad y participación activa');
  }

  // New words
  if (metrics.newWordsLearned.length >= 5) {
    strengths.push(`Aprendiste ${metrics.newWordsLearned.length} palabras nuevas`);
  }

  let feedback = '¡Gran sesión de práctica! ';

  if (strengths.length > 0) {
    feedback += `Fortalezas: ${strengths.join(', ')}. `;
  }

  if (areasToImprove.length > 0) {
    feedback += `Áreas de mejora: ${areasToImprove.join(', ')}.`;
  }

  return { feedback, strengths, areasToImprove };
}

/**
 * Create session analytics record
 */
export async function createSessionAnalytics(
  userId: string,
  conversationId: string,
  sessionType: string,
  messages: any[]
): Promise<any> {
  // Calculate metrics
  const duration = messages.length > 0
    ? Math.floor(
        (new Date(messages[messages.length - 1].createdAt).getTime() -
          new Date(messages[0].createdAt).getTime()) /
          1000
      )
    : 0;

  const wordsSpoken = messages
    .filter((m) => m.role === 'user')
    .reduce((sum, m) => sum + m.content.split(/\s+/).length, 0);

  const metrics: SessionMetrics = {
    duration,
    messagesCount: messages.length,
    wordsSpoken,
    grammarAccuracy: calculateGrammarAccuracy(messages),
    vocabularyDiversity: calculateVocabularyDiversity(messages),
    responseTime: calculateAverageResponseTime(messages),
    turnTaking: countTurnTaking(messages),
    questionsAsked: countQuestionsAsked(messages),
    newWordsLearned: extractNewWords(messages),
    errorsIdentified: extractGrammarErrors(messages),
    topicsDiscussed: [], // Can be enhanced with topic extraction
  };

  const fluencyScore = calculateFluencyScore(messages);
  const comprehensionScore = calculateComprehensionScore(
    messages,
    metrics.turnTaking
  );
  const accuracyScore = metrics.grammarAccuracy || 0;
  const overallScore = (fluencyScore + comprehensionScore + accuracyScore) / 3;

  const { feedback, strengths, areasToImprove } = generateFeedback(metrics);

  // Create analytics record
  const analytics = await prisma.sessionAnalytics.create({
    data: {
      userId,
      conversationId,
      sessionType,
      duration: metrics.duration,
      messagesCount: metrics.messagesCount,
      wordsSpoken: metrics.wordsSpoken,
      grammarAccuracy: metrics.grammarAccuracy,
      vocabularyDiversity: metrics.vocabularyDiversity,
      responseTime: metrics.responseTime,
      turnTaking: metrics.turnTaking,
      questionsAsked: metrics.questionsAsked,
      newWordsLearned: metrics.newWordsLearned,
      errorsIdentified: metrics.errorsIdentified,
      topicsDiscussed: metrics.topicsDiscussed,
      fluencyScore,
      accuracyScore,
      comprehensionScore,
      overallScore,
      feedback,
      strengths,
      areasToImprove,
    },
  });

  return analytics;
}

/**
 * Get user's analytics summary
 */
export async function getUserAnalyticsSummary(userId: string) {
  const analytics = await prisma.sessionAnalytics.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 30, // Last 30 sessions
  });

  if (analytics.length === 0) {
    return null;
  }

  const avgGrammarAccuracy =
    analytics.reduce((sum, a) => sum + (a.grammarAccuracy || 0), 0) /
    analytics.length;

  const avgVocabularyDiversity =
    analytics.reduce((sum, a) => sum + (a.vocabularyDiversity || 0), 0) /
    analytics.length;

  const avgOverallScore =
    analytics.reduce((sum, a) => sum + (a.overallScore || 0), 0) /
    analytics.length;

  const totalDuration = analytics.reduce((sum, a) => sum + a.duration, 0);
  const totalWords = analytics.reduce((sum, a) => sum + a.wordsSpoken, 0);
  const totalMessages = analytics.reduce((sum, a) => sum + a.messagesCount, 0);

  const allNewWords = new Set<string>();
  analytics.forEach((a) => {
    const words = Array.isArray(a.newWordsLearned) ? a.newWordsLearned : [];
    words.forEach((w: any) => allNewWords.add(w));
  });

  return {
    totalSessions: analytics.length,
    totalDuration,
    totalWords,
    totalMessages,
    totalNewWords: allNewWords.size,
    avgGrammarAccuracy,
    avgVocabularyDiversity,
    avgOverallScore,
    recentSessions: analytics.slice(0, 10),
    progressTrend: calculateProgressTrend(analytics),
  };
}

/**
 * Calculate progress trend (improving/declining/stable)
 */
function calculateProgressTrend(analytics: any[]): string {
  if (analytics.length < 5) return 'insufficient_data';

  const recent = analytics.slice(0, 5);
  const older = analytics.slice(5, 10);

  if (older.length === 0) return 'new_learner';

  const recentAvg =
    recent.reduce((sum, a) => sum + (a.overallScore || 0), 0) / recent.length;
  const olderAvg =
    older.reduce((sum, a) => sum + (a.overallScore || 0), 0) / older.length;

  const difference = recentAvg - olderAvg;

  if (difference > 5) return 'improving';
  if (difference < -5) return 'declining';
  return 'stable';
}
