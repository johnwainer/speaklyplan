
/**
 * Spaced Repetition System using SM-2 Algorithm
 * This system calculates the optimal interval for reviewing vocabulary cards
 */

export interface ReviewResult {
  quality: number; // 0-5 (0: total blackout, 5: perfect response)
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
}

/**
 * SM-2 Algorithm for calculating next review interval
 * @param quality - User's self-assessed quality of recall (0-5)
 * @param previousEaseFactor - Previous ease factor (default 2.5)
 * @param previousInterval - Previous interval in days
 * @param previousRepetitions - Number of previous repetitions
 */
export function calculateNextReview(
  quality: number,
  previousEaseFactor: number = 2.5,
  previousInterval: number = 0,
  previousRepetitions: number = 0
): ReviewResult {
  // Ensure quality is between 0 and 5
  quality = Math.max(0, Math.min(5, quality));

  // Calculate new ease factor
  let newEaseFactor =
    previousEaseFactor +
    (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Ease factor should not be less than 1.3
  newEaseFactor = Math.max(1.3, newEaseFactor);

  let newRepetitions = previousRepetitions;
  let newInterval = previousInterval;

  // If quality < 3, reset repetitions
  if (quality < 3) {
    newRepetitions = 0;
    newInterval = 0;
  } else {
    newRepetitions = previousRepetitions + 1;

    // Calculate new interval based on repetitions
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(previousInterval * newEaseFactor);
    }
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    quality,
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate,
  };
}

/**
 * Get cards due for review
 */
export function getCardsDueForReview(cards: any[]): any[] {
  const now = new Date();
  return cards.filter((card) => new Date(card.nextReviewDate) <= now);
}

/**
 * Calculate retention rate based on review history
 */
export function calculateRetentionRate(reviews: any[]): number {
  if (reviews.length === 0) return 0;

  const successfulReviews = reviews.filter((r) => r.quality >= 3).length;
  return (successfulReviews / reviews.length) * 100;
}

/**
 * Get recommended study session size based on due cards
 */
export function getRecommendedSessionSize(dueCardsCount: number): number {
  if (dueCardsCount <= 5) return dueCardsCount;
  if (dueCardsCount <= 20) return 10;
  if (dueCardsCount <= 50) return 20;
  return 30; // Max 30 cards per session
}

/**
 * Categorize cards by difficulty
 */
export function categorizeCardsByDifficulty(cards: any[]): {
  hard: any[];
  medium: any[];
  easy: any[];
} {
  return {
    hard: cards.filter((c) => c.easeFactor < 2.0),
    medium: cards.filter((c) => c.easeFactor >= 2.0 && c.easeFactor < 2.5),
    easy: cards.filter((c) => c.easeFactor >= 2.5),
  };
}
