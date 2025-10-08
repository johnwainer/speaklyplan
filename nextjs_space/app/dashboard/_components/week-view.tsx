
'use client';

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Target,
  Calendar,
  BookOpen,
  Headphones,
  MessageSquare,
  PenTool,
  Users,
  Monitor,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { PlanWeekData } from '@/lib/types'

interface WeekViewProps {
  weekData?: PlanWeekData
  onActivityComplete: (activityId: string, completed: boolean) => void
  onWeekChange: (weekNumber: number) => void
  totalWeeks: number
  currentWeek: number
}

const dayNames = {
  'lunes': 'Lunes',
  'martes': 'Martes',
  'miércoles': 'Miércoles',
  'jueves': 'Jueves',
  'viernes': 'Viernes',
  'sábado': 'Sábado',
  'domingo': 'Domingo'
}

const categoryIcons = {
  'vocabulario': <BookOpen className="h-4 w-4" />,
  'listening': <Headphones className="h-4 w-4" />,
  'speaking': <MessageSquare className="h-4 w-4" />,
  'writing': <PenTool className="h-4 w-4" />,
  'simulación': <Users className="h-4 w-4" />,
  'presentación': <Monitor className="h-4 w-4" />,
  'inmersión': <FileText className="h-4 w-4" />,
  'revisión': <Target className="h-4 w-4" />
}

const categoryColors = {
  'vocabulario': 'bg-blue-100 text-blue-800',
  'listening': 'bg-green-100 text-green-800',
  'speaking': 'bg-purple-100 text-purple-800',
  'writing': 'bg-orange-100 text-orange-800',
  'simulación': 'bg-red-100 text-red-800',
  'presentación': 'bg-pink-100 text-pink-800',
  'inmersión': 'bg-indigo-100 text-indigo-800',
  'revisión': 'bg-gray-100 text-gray-800'
}

export default function WeekView({ 
  weekData, 
  onActivityComplete, 
  onWeekChange, 
  totalWeeks, 
  currentWeek 
}: WeekViewProps) {
  const [notes, setNotes] = useState('')
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set())

  const toggleActivityExpanded = (activityId: string) => {
    setExpandedActivities(prev => {
      const newSet = new Set(prev)
      if (newSet.has(activityId)) {
        newSet.delete(activityId)
      } else {
        newSet.add(activityId)
      }
      return newSet
    })
  }

  if (!weekData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Semana no encontrada</h2>
          <p className="text-gray-600">No se pudo cargar la información de esta semana.</p>
        </CardContent>
      </Card>
    )
  }

  const weekProgress = weekData?.activities?.length > 0 
    ? Math.round((weekData.activities.filter(a => a?.completed)?.length / weekData.activities.length) * 100)
    : 0

  const activitiesByDay = (weekData?.activities || []).reduce((acc, activity) => {
    if (activity?.day && !acc[activity.day]) {
      acc[activity.day] = []
    }
    if (activity?.day) {
      acc[activity.day].push(activity)
    }
    return acc
  }, {} as Record<string, typeof weekData.activities>)

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => onWeekChange(Math.max(1, currentWeek - 1))}
          disabled={currentWeek <= 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Semana Anterior
        </Button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold">Semana {weekData.number}</h1>
          <p className="text-gray-600">Mes {weekData.month} • {weekData.phase}</p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => onWeekChange(Math.min(totalWeeks, currentWeek + 1))}
          disabled={currentWeek >= totalWeeks}
        >
          Siguiente Semana
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Week Progress */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Objetivo de la Semana
            </CardTitle>
            <Badge variant="secondary">{weekProgress}% completado</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{weekData.objective}</p>
          <Progress value={weekProgress} className="h-3" />
          <p className="text-sm text-gray-600 mt-2">
            {weekData?.activities?.filter(a => a?.completed)?.length || 0} de {weekData?.activities?.length || 0} actividades completadas
          </p>
        </CardContent>
      </Card>

      {/* Daily Activities */}
      <div className="grid gap-6">
        {Object.entries(dayNames).map(([dayKey, dayName]) => {
          const dayActivities = activitiesByDay[dayKey] || []
          const dayCompleted = dayActivities.every(a => a.completed)
          
          if (dayActivities.length === 0) return null

          return (
            <Card key={dayKey} className={`border-0 shadow-lg ${dayCompleted ? 'bg-green-50' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                    {dayName}
                  </div>
                  {dayCompleted && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Completado
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dayActivities.map((activity) => {
                    const categoryKey = activity.category.toLowerCase()
                    const icon = categoryIcons[categoryKey as keyof typeof categoryIcons] || <Circle className="h-4 w-4" />
                    const colorClass = categoryColors[categoryKey as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'
                    const isExpanded = expandedActivities.has(activity.id)
                    
                    return (
                      <div 
                        key={activity.id}
                        className={`p-4 rounded-lg border transition-all ${
                          activity.completed 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <Badge className={`${colorClass} mr-2`}>
                                {icon}
                                <span className="ml-1 capitalize">{activity.category}</span>
                              </Badge>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {activity.duration} min
                              </div>
                            </div>
                            <h3 className="font-semibold mb-2">{activity.title}</h3>
                            
                            {/* Descripción colapsable */}
                            <div className="space-y-2">
                              {isExpanded ? (
                                <div className="prose prose-sm max-w-none">
                                  <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    {activity.description}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {activity.description.split('\n')[0]}
                                </p>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleActivityExpanded(activity.id)}
                                className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="h-4 w-4 mr-1" />
                                    Ver menos
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-4 w-4 mr-1" />
                                    Ver guía completa
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          <Button
                            variant={activity.completed ? "default" : "outline"}
                            size="sm"
                            onClick={() => onActivityComplete(activity.id, !activity.completed)}
                            className={`ml-4 flex-shrink-0 ${activity.completed ? "bg-green-600 hover:bg-green-700" : ""}`}
                          >
                            {activity.completed ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Completada
                              </>
                            ) : (
                              <>
                                <Circle className="h-4 w-4 mr-1" />
                                Marcar
                              </>
                            )}
                          </Button>
                        </div>
                        
                        {activity.completed && activity.completedAt && (
                          <p className="text-xs text-green-600 mt-2">
                            ✅ Completada el {new Date(activity.completedAt).toLocaleDateString('es-ES', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Notes Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Notas y Reflexiones</CardTitle>
          <CardDescription>
            Guarda tus reflexiones, dudas o logros de esta semana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">Notas de la semana</Label>
              <Textarea
                id="notes"
                placeholder="¿Cómo te fue esta semana? ¿Qué aprendiste? ¿Qué te resultó más difícil?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
            <Button>
              Guardar Notas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
