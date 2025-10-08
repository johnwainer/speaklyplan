
/**
 * Gamification Service
 * Handles points, achievements, streaks, and level progression
 */

import { prisma } from '@/lib/db';

// Achievement definitions
export const ACHIEVEMENTS = [
  // Streak achievements
  {
    code: 'STREAK_3',
    name: '🔥 En Racha',
    description: '3 días consecutivos practicando',
    category: 'streak',
    threshold: 3,
    points: 50,
    icon: '🔥',
  },
  {
    code: 'STREAK_7',
    name: '🔥 Una Semana Completa',
    description: '7 días consecutivos practicando',
    category: 'streak',
    threshold: 7,
    points: 150,
    icon: '🔥',
  },
  {
    code: 'STREAK_30',
    name: '🔥 Dedicación Total',
    description: '30 días consecutivos practicando',
    category: 'streak',
    threshold: 30,
    points: 500,
    icon: '🔥',
  },
  // Message achievements
  {
    code: 'MESSAGES_10',
    name: '💬 Conversador',
    description: 'Enviar 10 mensajes',
    category: 'messages',
    threshold: 10,
    points: 30,
    icon: '💬',
  },
  {
    code: 'MESSAGES_100',
    name: '💬 Charlatán',
    description: 'Enviar 100 mensajes',
    category: 'messages',
    threshold: 100,
    points: 200,
    icon: '💬',
  },
  {
    code: 'MESSAGES_500',
    name: '💬 Maestro de la Conversación',
    description: 'Enviar 500 mensajes',
    category: 'messages',
    threshold: 500,
    points: 1000,
    icon: '💬',
  },
  // Session achievements
  {
    code: 'SESSIONS_5',
    name: '🎯 Principiante Dedicado',
    description: 'Completar 5 sesiones',
    category: 'sessions',
    threshold: 5,
    points: 50,
    icon: '🎯',
  },
  {
    code: 'SESSIONS_25',
    name: '🎯 Estudiante Consistente',
    description: 'Completar 25 sesiones',
    category: 'sessions',
    threshold: 25,
    points: 250,
    icon: '🎯',
  },
  {
    code: 'SESSIONS_100',
    name: '🎯 Experto en Práctica',
    description: 'Completar 100 sesiones',
    category: 'sessions',
    threshold: 100,
    points: 1000,
    icon: '🎯',
  },
  // Grammar achievements
  {
    code: 'GRAMMAR_PERFECT',
    name: '✅ Gramática Perfecta',
    description: 'Sesión sin errores gramaticales',
    category: 'grammar',
    threshold: 1,
    points: 100,
    icon: '✅',
  },
  {
    code: 'GRAMMAR_MASTER',
    name: '📚 Maestro de la Gramática',
    description: '10 sesiones sin errores',
    category: 'grammar',
    threshold: 10,
    points: 500,
    icon: '📚',
  },
  // Vocabulary achievements
  {
    code: 'VOCAB_50',
    name: '📖 Constructor de Vocabulario',
    description: 'Aprender 50 palabras nuevas',
    category: 'vocabulary',
    threshold: 50,
    points: 200,
    icon: '📖',
  },
  {
    code: 'VOCAB_200',
    name: '📖 Políglota en Desarrollo',
    description: 'Aprender 200 palabras nuevas',
    category: 'vocabulary',
    threshold: 200,
    points: 800,
    icon: '📖',
  },
];

// Points system
export const POINTS = {
  MESSAGE_SENT: 5,
  SESSION_COMPLETED: 20,
  PERFECT_GRAMMAR: 50,
  NEW_WORD_LEARNED: 10,
  VOCABULARY_REVIEWED: 5,
  DAILY_GOAL_ACHIEVED: 30,
};

// Level calculation (exponential curve)
export function calculateLevel(points: number): number {
  // Level formula: level = floor(sqrt(points / 100)) + 1
  return Math.floor(Math.sqrt(points / 100)) + 1;
}

export function pointsForNextLevel(currentLevel: number): number {
  // Inverse of level formula: points = (level - 1)^2 * 100
  return Math.pow(currentLevel, 2) * 100;
}

export function pointsProgressToNextLevel(
  currentPoints: number,
  currentLevel: number
): { current: number; needed: number; percentage: number } {
  const currentLevelPoints = pointsForNextLevel(currentLevel - 1);
  const nextLevelPoints = pointsForNextLevel(currentLevel);
  const needed = nextLevelPoints - currentLevelPoints;
  const current = currentPoints - currentLevelPoints;
  const percentage = (current / needed) * 100;

  return { current, needed, percentage };
}

// Update user streak
export async function updateStreak(userId: string): Promise<{
  currentStreak: number;
  bestStreak: number;
  streakMaintained: boolean;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error('User not found');

  const now = new Date();
  const lastActive = user.lastActiveDate;

  let currentStreak = user.currentStreak;
  let bestStreak = user.bestStreak;
  let streakMaintained = false;

  if (!lastActive) {
    // First time user
    currentStreak = 1;
    bestStreak = 1;
    streakMaintained = true;
  } else {
    const daysSinceLastActive = Math.floor(
      (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastActive === 0) {
      // Same day, maintain streak
      streakMaintained = true;
    } else if (daysSinceLastActive === 1) {
      // Next day, increment streak
      currentStreak += 1;
      bestStreak = Math.max(bestStreak, currentStreak);
      streakMaintained = true;
    } else {
      // Streak broken
      currentStreak = 1;
      streakMaintained = false;
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      currentStreak,
      bestStreak,
      lastActiveDate: now,
    },
  });

  return { currentStreak, bestStreak, streakMaintained };
}

// Award points
export async function awardPoints(
  userId: string,
  points: number,
  reason: string
): Promise<{ newPoints: number; newLevel: number; leveledUp: boolean }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error('User not found');

  const oldLevel = user.level;
  const newPoints = user.points + points;
  const newLevel = calculateLevel(newPoints);
  const leveledUp = newLevel > oldLevel;

  await prisma.user.update({
    where: { id: userId },
    data: {
      points: newPoints,
      level: newLevel,
    },
  });

  return { newPoints, newLevel, leveledUp };
}

// Check and unlock achievements
export async function checkAchievements(
  userId: string,
  metrics: {
    streak?: number;
    totalMessages?: number;
    totalSessions?: number;
    perfectGrammarSessions?: number;
    vocabularyLearned?: number;
  }
): Promise<any[]> {
  const unlockedAchievements = [];

  // Get user's current achievements
  const existingAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
  });

  const existingCodes = new Set(
    existingAchievements.map((ua) => ua.achievement.code)
  );

  // Check each achievement
  for (const achDef of ACHIEVEMENTS) {
    if (existingCodes.has(achDef.code)) continue;

    let shouldUnlock = false;

    switch (achDef.category) {
      case 'streak':
        shouldUnlock = (metrics.streak || 0) >= achDef.threshold;
        break;
      case 'messages':
        shouldUnlock = (metrics.totalMessages || 0) >= achDef.threshold;
        break;
      case 'sessions':
        shouldUnlock = (metrics.totalSessions || 0) >= achDef.threshold;
        break;
      case 'grammar':
        shouldUnlock =
          (metrics.perfectGrammarSessions || 0) >= achDef.threshold;
        break;
      case 'vocabulary':
        shouldUnlock = (metrics.vocabularyLearned || 0) >= achDef.threshold;
        break;
    }

    if (shouldUnlock) {
      // Ensure achievement exists in database
      let achievement = await prisma.achievement.findUnique({
        where: { code: achDef.code },
      });

      if (!achievement) {
        achievement = await prisma.achievement.create({
          data: achDef,
        });
      }

      // Unlock achievement
      const userAchievement = await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
        },
        include: { achievement: true },
      });

      // Award points
      await awardPoints(
        userId,
        achDef.points,
        `Logro desbloqueado: ${achDef.name}`
      );

      unlockedAchievements.push(userAchievement);
    }
  }

  return unlockedAchievements;
}

// Get user's gamification stats
export async function getGamificationStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userAchievements: {
        include: { achievement: true },
        orderBy: { unlockedAt: 'desc' },
      },
    },
  });

  if (!user) return null;

  const levelProgress = pointsProgressToNextLevel(user.points, user.level);

  return {
    points: user.points,
    level: user.level,
    currentStreak: user.currentStreak,
    bestStreak: user.bestStreak,
    levelProgress,
    achievements: user.userAchievements,
    totalAchievements: ACHIEVEMENTS.length,
    unlockedAchievements: user.userAchievements.length,
  };
}
