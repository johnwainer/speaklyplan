
import { 
  User, 
  PlanWeek, 
  PlanActivity, 
  UserProgress, 
  VocabularyCategory, 
  VocabularyTerm, 
  Resource, 
  Achievement, 
  PlanPhase,
  PracticeInvitation,
  PracticeConnection,
  PracticeMeeting,
  PracticeNotification,
  InvitationStatus,
  MeetingStatus,
  NotificationType
} from '@prisma/client'

export type { 
  User, 
  PlanWeek, 
  PlanActivity, 
  UserProgress, 
  VocabularyCategory, 
  VocabularyTerm, 
  Resource, 
  Achievement, 
  PlanPhase,
  PracticeInvitation,
  PracticeConnection,
  PracticeMeeting,
  PracticeNotification,
  InvitationStatus,
  MeetingStatus,
  NotificationType
}

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  role: string
  image?: string | null
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

// ============================================
// PRACTICE 1-ON-1 TYPES
// ============================================

export interface PracticeInvitationWithUsers extends PracticeInvitation {
  sender: {
    id: string
    name: string | null
    email: string
    image: string | null
    level: number
  }
  receiver: {
    id: string
    name: string | null
    email: string
    image: string | null
    level: number
  }
}

export interface PracticeConnectionWithPartner extends PracticeConnection {
  partner: {
    id: string
    name: string | null
    email: string
    image: string | null
    level: number
    practiceAvailable: boolean
  }
}

export interface PracticeMeetingWithUsers extends PracticeMeeting {
  initiator: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  partner: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

export interface PracticeHistoryItem extends PracticeMeeting {
  partner: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  pointsEarned?: number
}

export interface PracticeStats {
  totalSessions: number
  totalMinutes: number
  averageRating: number
  totalPartners: number
  completedThisWeek: number
  completedThisMonth: number
}

export interface PracticeNotificationWithDetails extends PracticeNotification {
  relatedUser?: {
    id: string
    name: string | null
    image: string | null
  }
}
