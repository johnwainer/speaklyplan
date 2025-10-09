
'use client';

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
  Zap
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
import { useToast } from '@/hooks/use-toast'
import { 
  LevelBadge, 
  StreakDisplay, 
  DailyMissions,
  XpToast,
  LevelUpModal,
  ActivityCompletionCelebration
} from '@/components/gamification'

interface DashboardClientProps {
  initialData: {
    user: {
      id: string
      name?: string | null
      email?: string | null
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
  
  // Handle mounting for hydration safety
  useEffect(() => {
    setMounted(true)
    loadGamificationStats()
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
        const xpEarned = 20 // Base XP for activity completion
        
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
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">SpeaklyPlan</h1>
              <p className="text-sm text-gray-600 hidden sm:block">Dashboard</p>
            </div>
          </button>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user?.name || user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  <span>Menú</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium truncate">{user?.name || user?.email}</span>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-500 mb-3">Vistas</p>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant={currentView === 'overview' ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => {
                        setCurrentView('overview')
                        setMobileMenuOpen(false)
                      }}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Vista General
                    </Button>
                    <Button
                      variant={currentView === 'week' ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => {
                        setCurrentView('week')
                        setMobileMenuOpen(false)
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Vista Semanal
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-500 mb-3">Recursos</p>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
                      onClick={() => {
                        router.push('/tutor')
                        setMobileMenuOpen(false)
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium">AI Tutor</span>
                      <Badge variant="secondary" className="ml-auto">NUEVO</Badge>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push('/vocabulario')
                        setMobileMenuOpen(false)
                      }}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Vocabulario
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push('/recursos')
                        setMobileMenuOpen(false)
                      }}
                    >
                      <Library className="h-4 w-4 mr-2" />
                      Recursos
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push('/guia')
                        setMobileMenuOpen(false)
                      }}
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Guía de Uso
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4 mt-auto">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

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
                size="sm"
                onClick={() => router.push('/tutor')}
                className="my-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Tutor
                <Badge variant="secondary" className="ml-2">NUEVO</Badge>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/vocabulario')}
                className="my-2"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Vocabulario
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/recursos')}
                className="my-2"
              >
                <Library className="h-4 w-4 mr-2" />
                Recursos
              </Button>
              <Button
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

      {/* Progress Stats */}
      <section className="py-6 px-4 bg-white border-b">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-0 bg-blue-50">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{progressData.percentageCompleted}%</div>
                <div className="text-sm text-gray-600">Completado</div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-green-50">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Flame className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{progressData.currentStreak}</div>
                <div className="text-sm text-gray-600">Racha actual</div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-purple-50">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">{progressData.currentWeek}</div>
                <div className="text-sm text-gray-600">Semana actual</div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-orange-50">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-5 w-5 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-600">{progressData.bestStreak}</div>
                <div className="text-sm text-gray-600">Mejor racha</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main content area */}
            <div className="lg:col-span-2">
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
                />
              )}
            </div>

            {/* Gamification sidebar */}
            <div className="space-y-6">
              {/* Level and XP */}
              {gamificationStats && (
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-purple-600" />
                      Tu Nivel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LevelBadge
                      level={gamificationStats.level}
                      points={gamificationStats.points}
                      size="md"
                      showProgress={true}
                      levelProgress={gamificationStats.levelProgress}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Streaks */}
              {gamificationStats && (
                <StreakDisplay
                  currentStreak={gamificationStats.currentStreak}
                  bestStreak={gamificationStats.bestStreak}
                  size="sm"
                />
              )}

              {/* Daily Missions */}
              <DailyMissions />

              {/* Quick Stats */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Estadísticas Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">Actividades</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      {progressData.completedActivities}/{progressData.totalActivities}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">Progreso</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {progressData.percentageCompleted}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium">Semana Actual</span>
                    </div>
                    <span className="text-lg font-bold text-purple-600">
                      {progressData.currentWeek}/24
                    </span>
                  </div>
                </CardContent>
              </Card>
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
    </div>
  )
}
