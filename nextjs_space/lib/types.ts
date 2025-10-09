
import { User, PlanWeek, PlanActivity, UserProgress, VocabularyCategory, VocabularyTerm, Resource, Achievement, PlanPhase } from '@prisma/client'

export type { User, PlanWeek, PlanActivity, UserProgress, VocabularyCategory, VocabularyTerm, Resource, Achievement, PlanPhase }

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  role: string
}

declare module "next-auth" {
  interface Session {
    user: SessionUser
  }

  interface User {
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
  }
}

export interface WeekWithActivities extends PlanWeek {
  activities: PlanActivity[]
}

export interface ProgressWithActivity extends UserProgress {
  activity: PlanActivity
}

export interface CategoryWithTerms extends VocabularyCategory {
  terms: VocabularyTerm[]
}

// Dashboard types
export interface PlanWeekData {
  id: string
  number: number
  month: number
  phase: string
  objective: string
  activities: PlanActivityData[]
}

export interface PlanActivityData {
  id: string
  day: string
  dayNumber: number
  title: string
  description: string
  duration: number
  category: string
  completed: boolean
  completedAt: Date | null
}

export interface UserProgressData {
  totalActivities: number
  completedActivities: number
  currentWeek: number
  currentStreak: number
  bestStreak: number
  percentageCompleted: number
}
