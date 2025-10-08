
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
  Library
} from 'lucide-react'
import { PlanWeekData, UserProgressData } from '@/lib/types'
import WeekView from './week-view'
import ProgressOverview from './progress-overview'
import { useToast } from '@/hooks/use-toast'

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
  const [currentView, setCurrentView] = useState<'overview' | 'week'>('overview')
  const [selectedWeek, setSelectedWeek] = useState<number>(initialData.progress.currentWeek)
  const [planData, setPlanData] = useState(initialData.planWeeks)
  const [progressData, setProgressData] = useState(initialData.progress)
  
  // Handle mounting for hydration safety
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const { data: session, status } = useSession() || {};
  const { toast } = useToast()
  const router = useRouter()
  
  // Usar los datos iniciales si la sesión aún no está cargada
  const user = session?.user || initialData.user;

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

      toast({
        title: completed ? "¡Actividad completada!" : "Actividad desmarcada",
        description: completed ? "Sigue así, estás progresando genial." : "Actividad marcada como pendiente.",
      })

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
          <div className="flex items-center space-x-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">SpeaklyPlan</h1>
              <p className="text-sm text-gray-600 hidden sm:block">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
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
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
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
      </main>
    </div>
  )
}
