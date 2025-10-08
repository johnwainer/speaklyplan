
import { User } from '@prisma/client'

declare module 'next-auth' {
  interface User {
    role?: string
  }
  
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
  }
}

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
  completed?: boolean
  completedAt?: Date | null
}

export interface UserProgressData {
  totalActivities: number
  completedActivities: number
  currentWeek: number
  currentStreak: number
  bestStreak: number
  percentageCompleted: number
}

export interface VocabularyWordData {
  id: string
  english: string
  spanish: string
  example: string | null
  category: string
  mastered?: boolean
}

export interface ResourceData {
  id: string
  name: string
  description: string
  url?: string | null
  platform?: string | null
  rating?: number | null
  category: string
}
