
'use client';

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  Clock, 
  LogOut,
  User,
  Award,
  Flame,
  HelpCircle,
  Library,
  Menu,
  MessageSquare,
  Trophy,
  Zap,
  UserPlus,
  Mic
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { PlanWeekData, UserProgressData } from '@/lib/types'
import WeekView from './week-view'
import ProgressOverview from './progress-overview'
import DashboardTour from './dashboard-tour'
import { useToast } from '@/hooks/use-toast'
import { 
  LevelBadge, 
  StreakDisplay, 
  DailyMissions,
  XpToast,
  LevelUpModal,
  ActivityCompletionCelebration
} from '@/components/gamification'
import { getProfileImageUrl } from '@/lib/utils'
import { InviteFriendsModal } from '@/components/invite-friends-modal'
import { AppHeader } from '@/components/app-header'

// Helper function to format Markdown text
function formatMarkdownText(text: string | null | undefined): React.ReactNode {
  if (!text) return null;
  
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  let key = 0;
  
  // Match **bold** text
  const boldRegex = /\*\*(.*?)\*\*/g;
  let match;
  
  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the bold
    if (match.index > currentIndex) {
      parts.push(text.substring(currentIndex, match.index));
    }
    
    // Add the bold text
    parts.push(
      <strong key={key++} className="font-semibold">
        {match[1]}
      </strong>
    );
    
    currentIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }
  
  return parts.length > 0 ? parts : text;
}

interface DashboardClientProps {
  initialData: {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
    planWeeks: PlanWeekData[]
    progress: UserProgressData
  }
  userId: string
}

export default function DashboardClient({ initialData, userId }: DashboardClientProps) {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentView, setCurrentView] = useState<'overview' | 'week'>('overview')
  const [selectedWeek, setSelectedWeek] = useState<number>(initialData.progress.currentWeek)
  const [planData, setPlanData] = useState(initialData.planWeeks)
  const [progressData, setProgressData] = useState(initialData.progress)
  
  // Gamification states
  const [gamificationStats, setGamificationStats] = useState<any>(null)
  const [showXpToast, setShowXpToast] = useState(false)
  const [xpToastData, setXpToastData] = useState({ points: 0, reason: '' })
  const [showLevelUpModal, setShowLevelUpModal] = useState(false)
  const [levelUpData, setLevelUpData] = useState(0)
  const [showCompletionCelebration, setShowCompletionCelebration] = useState(false)
  const [completionData, setCompletionData] = useState({ activityTitle: '', xpEarned: 0 })
  
  // Tour states
  const [runTour, setRunTour] = useState(false)
  const [hasSeenTour, setHasSeenTour] = useState(true) // Default to true, will be updated
  
  // Handle mounting for hydration safety
  useEffect(() => {
    setMounted(true)
    loadGamificationStats()
    checkTourStatus()
  }, [])
  
  const { data: session, status } = useSession() || {};
  const { toast } = useToast()
  const router = useRouter()
  
  // Usar los datos iniciales si la sesión aún no está cargada
  const user = session?.user || initialData.user;
  
  const loadGamificationStats = async () => {
    try {
      const response = await fetch('/api/tutor/gamification')
      if (response.ok) {
        const data = await response.json()
        setGamificationStats(data)
      }
    } catch (error) {
      console.error('Error loading gamification stats:', error)
    }
  }
  
  const checkTourStatus = async () => {
    try {
      const response = await fetch('/api/tour')
      if (response.ok) {
        const data = await response.json()
        setHasSeenTour(data.hasSeenTour)
        
        // Si el usuario no ha visto el tour, iniciarlo automáticamente después de un delay
        if (!data.hasSeenTour) {
          setTimeout(() => {
            setRunTour(true)
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Error checking tour status:', error)
    }
  }
  
  const handleTourEnd = async () => {
    setRunTour(false)
    
    // Actualizar en el servidor que el usuario ya vio el tour
    try {
      await fetch('/api/tour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hasSeenTour: true })
      })
      setHasSeenTour(true)
    } catch (error) {
      console.error('Error updating tour status:', error)
    }
  }
  
  const startTour = () => {
    setRunTour(true)
  }

  // Calculate missions based on current progress
  const calculateMissions = () => {
    // Get today's completed activities
    const today = new Date()
    const currentWeek = planData?.find(w => w?.number === progressData.currentWeek)
    const allActivities = currentWeek?.activities || []
    
    const completedToday = allActivities.filter(a => {
      if (!a?.completedAt) return false
      const completedDate = new Date(a.completedAt)
      return completedDate.toDateString() === today.toDateString()
    }).length

    // Get tutor session time from gamification stats (in minutes)
    const tutorSessionTime = gamificationStats?.totalSessionTime || 0

    // Get vocabulary progress (assuming we track this)
    const vocabularyProgress = gamificationStats?.vocabularyLearned || 0

    // Get weekly progress
    const weeklyProgress = allActivities.filter(a => a?.completed).length
    const weeklyTarget = allActivities.length

    return [
      {
        id: 'daily-practice',
        title: 'Práctica Diaria',
        description: 'Completa 3 actividades hoy',
        icon: Zap,
        progress: completedToday,
        target: 3,
        xpReward: 50,
        completed: completedToday >= 3,
        category: 'daily' as const
      },
      {
        id: 'tutor-session',
        title: 'Sesión con el Tutor',
        description: 'Practica 10 minutos con el Tutor AI',
        icon: MessageSquare,
        progress: Math.min(tutorSessionTime, 10),
        target: 10,
        xpReward: 30,
        completed: tutorSessionTime >= 10,
        category: 'daily' as const
      },
      {
        id: 'vocabulary',
        title: 'Vocabulario',
        description: 'Aprende 5 palabras nuevas',
        icon: BookOpen,
        progress: Math.min(vocabularyProgress, 5),
        target: 5,
        xpReward: 25,
        completed: vocabularyProgress >= 5,
        category: 'daily' as const
      },
      {
        id: 'perfect-week',
        title: 'Semana Perfecta',
        description: 'Completa todas las actividades de esta semana',
        icon: Trophy,
        progress: weeklyProgress,
        target: weeklyTarget,
        xpReward: 200,
        completed: weeklyProgress >= weeklyTarget && weeklyTarget > 0,
        category: 'weekly' as const
      }
    ]
  }

  const handleActivityComplete = async (activityId: string, completed: boolean) => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityId,
          completed,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar progreso')
      }

      const updatedProgress = await response.json()
      
      // Find activity title for celebration
      let activityTitle = ''
      planData?.forEach(week => {
        const activity = week?.activities?.find(a => a?.id === activityId)
        if (activity) activityTitle = activity.title
      })

      // Update local state
      setPlanData(prev => 
        (prev || []).map(week => ({
          ...week,
          activities: (week?.activities || []).map(activity => 
            activity?.id === activityId 
              ? { ...activity, completed, completedAt: completed ? new Date() : null }
              : activity
          )
        }))
      )

      // Update progress data
      setProgressData(prev => ({
        ...prev,
        completedActivities: completed ? prev.completedActivities + 1 : prev.completedActivities - 1,
        percentageCompleted: Math.round(((completed ? prev.completedActivities + 1 : prev.completedActivities - 1) / prev.totalActivities) * 100),
        currentStreak: updatedProgress.currentStreak || prev.currentStreak,
        bestStreak: updatedProgress.bestStreak || prev.bestStreak,
      }))

      if (completed) {
        // Award points for completing activity
        let xpEarned = 20 // Base XP for activity completion
        
        // Check missions before and after to award XP for newly completed missions
        const missionsBefore = calculateMissions()
        
        // Calculate missions after the activity completion
        // We need to simulate the state after completion
        const today = new Date()
        const currentWeek = planData?.find(w => w?.number === progressData.currentWeek)
        const allActivities = currentWeek?.activities || []
        const completedTodayAfter = allActivities.filter(a => {
          if (a?.id === activityId) return true // This activity will be completed
          if (!a?.completedAt) return false
          const completedDate = new Date(a.completedAt)
          return completedDate.toDateString() === today.toDateString()
        }).length

        // Check if daily practice mission was just completed
        if (completedTodayAfter >= 3 && !missionsBefore.find(m => m.id === 'daily-practice')?.completed) {
          xpEarned += 50 // Add daily practice mission XP
        }

        // Check if weekly mission was just completed
        const weeklyProgressAfter = allActivities.filter(a => a?.id === activityId || a?.completed).length
        const weeklyTarget = allActivities.length
        if (weeklyProgressAfter >= weeklyTarget && weeklyTarget > 0 && !missionsBefore.find(m => m.id === 'perfect-week')?.completed) {
          xpEarned += 200 // Add perfect week mission XP
        }
        
        // Show completion celebration
        setCompletionData({ activityTitle, xpEarned })
        setShowCompletionCelebration(true)
        
        // Award points via API
        try {
          const gamificationResponse = await fetch('/api/tutor/gamification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'award_points',
              points: xpEarned,
              reason: `Actividad completada: ${activityTitle}`
            })
          })
          
          if (gamificationResponse.ok) {
            const result = await gamificationResponse.json()
            
            // Update gamification stats
            await loadGamificationStats()
            
            // Check if leveled up
            if (result.points?.leveledUp) {
              setTimeout(() => {
                setLevelUpData(result.points.newLevel)
                setShowLevelUpModal(true)
              }, 3500)
            } else {
              // Show XP toast
              setTimeout(() => {
                setXpToastData({ points: xpEarned, reason: activityTitle })
                setShowXpToast(true)
              }, 3500)
            }
          }
        } catch (error) {
          console.error('Error awarding points:', error)
        }
        
        toast({
          title: "¡Actividad completada!",
          description: "Sigue así, estás progresando genial.",
        })
      } else {
        toast({
          title: "Actividad desmarcada",
          description: "Actividad marcada como pendiente.",
        })
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el progreso. Intenta de nuevo.",
        variant: "destructive"
      })
    }
  }

  const currentWeekData = planData?.find(week => week?.number === selectedWeek)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <AppHeader currentSection="dashboard" />

      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-between items-center">
            <div className="flex space-x-8">
              <button
                onClick={() => setCurrentView('overview')}
                className={`py-4 text-sm font-medium border-b-2 ${
                  currentView === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Vista General
              </button>
              <button
                onClick={() => setCurrentView('week')}
                className={`py-4 text-sm font-medium border-b-2 ${
                  currentView === 'week'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Vista Semanal
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                data-tour="nav-tutor"
                size="sm"
                onClick={() => router.push('/tutor')}
                className="my-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Tutor
              </Button>
              <Button
                data-tour="nav-vocabulary"
                variant="outline"
                size="sm"
                onClick={() => router.push('/vocabulario')}
                className="my-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Vocabulario
              </Button>
              <Button
                data-tour="nav-resources"
                variant="outline"
                size="sm"
                onClick={() => router.push('/recursos')}
                className="my-2"
              >
                <Library className="h-4 w-4 mr-2" />
                Recursos
              </Button>
              <Button
                data-tour="nav-guide"
                variant="outline"
                size="sm"
                onClick={() => router.push('/guia')}
                className="my-2"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Guía de Uso
              </Button>
            </div>
          </div>

          {/* Mobile Navigation - Tabs only */}
          <div className="md:hidden flex justify-center">
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('overview')}
                className={`py-3 px-4 text-sm font-medium border-b-2 ${
                  currentView === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setCurrentView('week')}
                className={`py-3 px-4 text-sm font-medium border-b-2 ${
                  currentView === 'week'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Semanal
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Compact Progress Stats */}
      <section className="py-3 px-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-600">{progressData.percentageCompleted}%</div>
                  <div className="text-xs text-gray-600">Completado</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600">{progressData.currentStreak} días</div>
                  <div className="text-xs text-gray-600">Racha actual</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-600">Semana {progressData.currentWeek}</div>
                  <div className="text-xs text-gray-600">de 24 semanas</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-700">
                {progressData.completedActivities} de {progressData.totalActivities} actividades
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="container max-w-7xl mx-auto">
          {/* Top Section Grid - Empieza Aquí + CTA Conversación */}
          {currentView === 'overview' && (
            <div className="grid lg:grid-cols-[1fr_320px] gap-6 mb-6">
              {/* Empieza Aquí - Column 1 (Main) */}
              <Card data-tour="pending-activities" className="border-2 border-blue-500 shadow-lg bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <Target className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0 overflow-hidden">
                        <CardTitle className="text-base sm:text-lg truncate">¡Empieza aquí!</CardTitle>
                        <CardDescription className="text-xs truncate">
                          Tus actividades de esta semana
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedWeek(progressData.currentWeek)
                        setCurrentView('week')
                      }}
                      className="bg-blue-600 hover:bg-blue-700 flex-shrink-0 text-xs sm:text-sm px-2 sm:px-4"
                    >
                      Ver todas
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 overflow-hidden">
                  {(() => {
                    const currentWeek = planData?.find(w => w?.number === progressData.currentWeek)
                    const pendingActivities = currentWeek?.activities?.filter(a => !a?.completed) || []
                    const completedToday = currentWeek?.activities?.filter(a => {
                      if (!a?.completedAt) return false
                      const completedDate = new Date(a.completedAt)
                      const today = new Date()
                      return completedDate.toDateString() === today.toDateString()
                    }) || []

                    if (pendingActivities.length === 0) {
                      return (
                        <div className="text-center py-4">
                          <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto mb-2" />
                          <h3 className="text-base font-semibold text-gray-900 mb-1">
                            ¡Felicitaciones! Semana completada 🎉
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            Has completado todas las actividades de esta semana
                          </p>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedWeek(progressData.currentWeek + 1)
                              setCurrentView('week')
                            }}
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled={progressData.currentWeek >= (planData?.length || 0)}
                          >
                            Ir a la siguiente semana
                          </Button>
                        </div>
                      )
                    }

                    return (
                      <div className="space-y-2">
                        {completedToday.length > 0 && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-2">
                            <div className="flex items-center gap-2 text-green-700">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="text-xs font-medium">
                                ¡Excelente! Has completado {completedToday.length} {completedToday.length === 1 ? 'actividad' : 'actividades'} hoy
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="grid gap-2 w-full overflow-hidden">
                          {pendingActivities.slice(0, 2).map((activity) => (
                            <div
                              key={activity?.id}
                              className="bg-white border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer w-full overflow-hidden"
                              onClick={() => {
                                setSelectedWeek(progressData.currentWeek)
                                setCurrentView('week')
                              }}
                            >
                              <div className="flex items-start justify-between gap-2 sm:gap-3 max-w-full overflow-hidden">
                                <div className="flex-1 min-w-0 overflow-hidden">
                                  <h4 className="font-semibold text-sm text-gray-900 mb-1 truncate">
                                    {activity?.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 line-clamp-1 break-words">
                                    {formatMarkdownText(activity?.description)}
                                  </p>
                                  <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
                                    <Badge variant="secondary" className="text-xs py-0 px-2 whitespace-nowrap">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {activity?.duration} min
                                    </Badge>
                                    <Badge variant="outline" className="text-xs py-0 px-2 truncate max-w-[120px]">
                                      {activity?.category}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                                  <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {pendingActivities.length > 2 && (
                          <div className="text-center pt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedWeek(progressData.currentWeek)
                                setCurrentView('week')
                              }}
                              className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 text-xs"
                            >
                              Ver {pendingActivities.length - 2} actividades más
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>

              {/* Práctica de Conversación - Column 2 (Sidebar width) */}
              <Card className="border-2 border-emerald-500 shadow-xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden relative">
                {/* Badge de "Nuevo" */}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-yellow-400 text-purple-900 border-0 px-2 py-0.5 text-xs font-bold shadow-md animate-pulse">
                    ✨ NUEVO
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Mic className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base mb-0.5 text-gray-900">
                        Tutor de IA 🎤
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Practica en tiempo real
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-2 space-y-3">
                  {/* Compact Features */}
                  <div className="space-y-2">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-emerald-200">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs text-gray-900">5 Modos</h4>
                          <p className="text-xs text-gray-600">Trabajo, entrevistas, más</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-emerald-200">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Trophy className="h-3.5 w-3.5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs text-gray-900">Gamificación</h4>
                          <p className="text-xs text-gray-600">Gana XP y sube de nivel</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-emerald-200">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="h-3.5 w-3.5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs text-gray-900">Análisis AI</h4>
                          <p className="text-xs text-gray-600">Feedback detallado</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg p-2 border border-emerald-200">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1 text-emerald-900">
                        <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                        <span>Reconocimiento de voz</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-900">
                        <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                        <span>Sistema de repetición</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-900">
                        <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                        <span>Historial completo</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                    onClick={() => router.push('/tutor')}
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Empezar Ahora
                  </Button>
                  
                  <p className="text-center text-xs text-gray-500">
                    💡 24/7 · Sin límites
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Main content area */}
            <div data-tour="weekly-plan">
              {currentView === 'overview' ? (
                <ProgressOverview
                  planWeeks={planData}
                  progress={progressData}
                  onWeekSelect={(weekNumber) => {
                    setSelectedWeek(weekNumber)
                    setCurrentView('week')
                  }}
                />
              ) : (
                <WeekView
                  weekData={currentWeekData}
                  onActivityComplete={handleActivityComplete}
                  onWeekChange={setSelectedWeek}
                  totalWeeks={planData?.length || 0}
                  currentWeek={selectedWeek}
                  allWeeks={planData || []}
                />
              )}
            </div>

            {/* Compact Gamification sidebar */}
            <div data-tour="progress-sidebar" className="space-y-4">
              {/* Combined Level, XP & Stats Card */}
              {gamificationStats && (
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-purple-600" />
                      Progreso y Nivel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <LevelBadge
                      level={gamificationStats.level}
                      points={gamificationStats.points}
                      size="sm"
                      showProgress={true}
                      levelProgress={gamificationStats.levelProgress}
                    />
                    
                    {/* Compact Stats */}
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span>Racha</span>
                        </div>
                        <span className="font-bold text-orange-600">
                          {gamificationStats.currentStreak} días
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Award className="w-4 h-4 text-yellow-500" />
                          <span>Mejor racha</span>
                        </div>
                        <span className="font-bold text-yellow-600">
                          {gamificationStats.bestStreak} días
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-blue-500" />
                          <span>Actividades</span>
                        </div>
                        <span className="font-bold text-blue-600">
                          {progressData.completedActivities}/{progressData.totalActivities}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Daily Missions */}
              <div data-tour="daily-missions">
                <DailyMissions missions={calculateMissions()} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Gamification Notifications */}
      <XpToast
        points={xpToastData.points}
        reason={xpToastData.reason}
        show={showXpToast}
        onHide={() => setShowXpToast(false)}
      />

      <LevelUpModal
        show={showLevelUpModal}
        level={levelUpData}
        onClose={() => setShowLevelUpModal(false)}
      />

      <ActivityCompletionCelebration
        show={showCompletionCelebration}
        activityTitle={completionData.activityTitle}
        xpEarned={completionData.xpEarned}
        onComplete={() => setShowCompletionCelebration(false)}
      />
      
      {/* Tour Guide */}
      <DashboardTour runTour={runTour} onTourEnd={handleTourEnd} />
      
      {/* Floating Button to Restart Tour */}
      {mounted && (
        <Button
          onClick={startTour}
          className="fixed bottom-6 left-6 rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 z-50"
          title="Ver guía interactiva"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
