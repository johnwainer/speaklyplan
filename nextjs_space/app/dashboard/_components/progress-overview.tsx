
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Calendar, 
  Target, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  BookOpen
} from 'lucide-react'
import { PlanWeekData, UserProgressData } from '@/lib/types'

interface ProgressOverviewProps {
  planWeeks: PlanWeekData[]
  progress: UserProgressData
  onWeekSelect: (weekNumber: number) => void
}

const phaseColors = {
  'FASE 1: CATARSIS': 'bg-blue-100 text-blue-800 border-blue-200',
  'FASE 2: SPEAKING MÍNIMO VIABLE': 'bg-green-100 text-green-800 border-green-200',
  'FASE 3: PLAYBOOK FOR JTBD': 'bg-purple-100 text-purple-800 border-purple-200',
}

export default function ProgressOverview({ planWeeks, progress, onWeekSelect }: ProgressOverviewProps) {
  const getWeekProgress = (week: PlanWeekData) => {
    const totalActivities = week?.activities?.length || 0
    const completedActivities = week?.activities?.filter(a => a?.completed)?.length || 0
    return totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0
  }

  const groupedWeeks = (planWeeks || []).reduce((acc, week) => {
    if (week?.phase && !acc[week.phase]) {
      acc[week.phase] = []
    }
    if (week?.phase) {
      acc[week.phase].push(week)
    }
    return acc
  }, {} as Record<string, PlanWeekData[]>)

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Bienvenido a tu Plan de Inglés!
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Tu camino hacia el dominio del inglés técnico está aquí. Cada día cuenta, cada actividad te acerca a tu objetivo.
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-600" />
            Tu Progreso General
          </CardTitle>
          <CardDescription>
            Has completado {progress.completedActivities} de {progress.totalActivities} actividades totales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progreso Total</span>
                <span className="font-medium">{progress.percentageCompleted}%</span>
              </div>
              <Progress value={progress.percentageCompleted} className="h-3" />
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 pt-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-blue-600">Semana {progress.currentWeek}</div>
                <div className="text-sm text-gray-600">Semana actual</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="font-semibold text-green-600">{progress.currentStreak} días</div>
                <div className="text-sm text-gray-600">Racha actual</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="font-semibold text-orange-600">{Math.round((progress.completedActivities * 60) / 60)} horas</div>
                <div className="text-sm text-gray-600">Tiempo invertido</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phases Overview */}
      {Object.entries(groupedWeeks || {}).map(([phaseName, weeks]) => {
        const phaseProgress = weeks?.length > 0 ? weeks.reduce((sum, week) => sum + getWeekProgress(week), 0) / weeks.length : 0
        
        return (
          <Card key={phaseName} className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-gray-600" />
                  {phaseName}
                </CardTitle>
                <Badge className={phaseColors[phaseName as keyof typeof phaseColors] || 'bg-gray-100'}>
                  {Math.round(phaseProgress)}% completado
                </Badge>
              </div>
              <CardDescription>
                Semanas {weeks?.[0]?.number || 1} - {weeks?.[weeks.length - 1]?.number || 1}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(weeks || []).map((week) => {
                  if (!week) return null
                  const weekProgress = getWeekProgress(week)
                  const isCurrentWeek = week?.number === progress?.currentWeek
                  const isCompleted = weekProgress === 100
                  
                  return (
                    <Card 
                      key={week.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isCurrentWeek ? 'ring-2 ring-blue-500' : ''
                      } ${isCompleted ? 'bg-green-50' : ''}`}
                      onClick={() => onWeekSelect(week.number)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">
                            Semana {week.number}
                            {isCurrentWeek && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Actual
                              </Badge>
                            )}
                          </h3>
                          {isCompleted && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {week.objective}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Progreso</span>
                            <span>{weekProgress}%</span>
                          </div>
                          <Progress value={weekProgress} className="h-2" />
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full mt-3 text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            onWeekSelect(week.number)
                          }}
                        >
                          Ver detalles
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
