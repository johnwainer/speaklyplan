
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

// Function to convert Markdown to HTML with rich formatting
function markdownToHtml(text: string): string {
  if (!text) return ''
  
  let html = text
  
  // Convert **bold** to <strong>
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
  
  // Convert *italic* or _italic_ to <em>
  html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
  html = html.replace(/_(.+?)_/g, '<em class="italic">$1</em>')
  
  // Convert [text](url) to clickable links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-medium transition-colors">$1</a>')
  
  // Convert ### headers to h3
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-gray-900 mt-3 mb-2">$1</h3>')
  
  // Convert ## headers to h2
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">$1</h2>')
  
  // Convert # headers to h1
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-gray-900 mt-4 mb-3">$1</h1>')
  
  // Split into lines for list processing
  const lines = html.split('\n')
  const processedLines: string[] = []
  let inUnorderedList = false
  let inOrderedList = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Check for unordered list items (-, *, •)
    if (line.match(/^[-*•]\s+(.+)$/)) {
      if (!inUnorderedList) {
        processedLines.push('<ul class="list-none space-y-2 my-3 pl-0">')
        inUnorderedList = true
      }
      const content = line.replace(/^[-*•]\s+/, '')
      processedLines.push(`<li class="flex items-start gap-2 text-gray-700"><span class="text-blue-600 font-bold flex-shrink-0 mt-0.5">•</span><span class="flex-1">${content}</span></li>`)
    } 
    // Check for ordered list items (1. 2. etc)
    else if (line.match(/^\d+\.\s+(.+)$/)) {
      if (!inOrderedList) {
        processedLines.push('<ol class="list-decimal list-inside space-y-2 my-3 pl-4 marker:text-blue-600 marker:font-semibold">')
        inOrderedList = true
      }
      const content = line.replace(/^\d+\.\s+/, '')
      processedLines.push(`<li class="text-gray-700 pl-2">${content}</li>`)
    } 
    // Regular line
    else {
      // Close any open lists
      if (inUnorderedList) {
        processedLines.push('</ul>')
        inUnorderedList = false
      }
      if (inOrderedList) {
        processedLines.push('</ol>')
        inOrderedList = false
      }
      
      // Add the line if it's not empty
      if (line) {
        processedLines.push(line)
      }
    }
  }
  
  // Close any remaining open lists
  if (inUnorderedList) {
    processedLines.push('</ul>')
  }
  if (inOrderedList) {
    processedLines.push('</ol>')
  }
  
  // Join lines with <br> for paragraphs, but not after lists or headers
  html = processedLines.join('\n')
  html = html.replace(/\n(?!<\/?(ul|ol|li|h[1-3]|br))/g, '<br/>')
  
  // Clean up multiple <br> tags
  html = html.replace(/(<br\/>){3,}/g, '<br/><br/>')
  
  return html
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => onWeekChange(Math.max(1, currentWeek - 1))}
          disabled={currentWeek <= 1}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Semana Anterior</span>
          <span className="sm:hidden">Anterior</span>
        </Button>
        
        <div className="text-center order-1 sm:order-2">
          <h1 className="text-xl sm:text-2xl font-bold">Semana {weekData.number}</h1>
          <p className="text-sm sm:text-base text-gray-600">Mes {weekData.month} • {weekData.phase}</p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => onWeekChange(Math.min(totalWeeks, currentWeek + 1))}
          disabled={currentWeek >= totalWeeks}
          className="w-full sm:w-auto order-3"
        >
          <span className="hidden sm:inline">Siguiente Semana</span>
          <span className="sm:hidden">Siguiente</span>
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Week Progress */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Target className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" />
              <span>Objetivo de la Semana</span>
            </CardTitle>
            <Badge variant="secondary" className="self-start sm:self-auto">{weekProgress}% completado</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">{weekData.objective}</p>
          <Progress value={weekProgress} className="h-2.5 sm:h-3" />
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
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
              <CardHeader className="pb-3">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center text-base sm:text-lg">
                    <Calendar className="h-5 w-5 mr-2 text-gray-600 flex-shrink-0" />
                    <span>{dayName}</span>
                  </div>
                  {dayCompleted && (
                    <Badge className="bg-green-100 text-green-800 self-start sm:self-auto text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completado
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {dayActivities.map((activity) => {
                    const categoryKey = activity.category.toLowerCase()
                    const icon = categoryIcons[categoryKey as keyof typeof categoryIcons] || <Circle className="h-4 w-4" />
                    const colorClass = categoryColors[categoryKey as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'
                    const isExpanded = expandedActivities.has(activity.id)
                    
                    return (
                      <div 
                        key={activity.id}
                        className={`p-3 sm:p-4 rounded-lg border transition-all ${
                          activity.completed 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Header - Categoría y duración */}
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className={`${colorClass} text-xs`}>
                              {icon}
                              <span className="ml-1 capitalize">{activity.category}</span>
                            </Badge>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {activity.duration} min
                            </div>
                          </div>
                          
                          {/* Título */}
                          <h3 className="font-semibold text-base sm:text-lg leading-tight">{activity.title}</h3>
                          
                          {/* Descripción colapsable */}
                          <div className="space-y-2">
                            {isExpanded ? (
                              <div className="activity-description-content">
                                <div 
                                  className="text-sm leading-relaxed text-gray-700 bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 sm:p-4 rounded-lg border border-gray-200 overflow-x-hidden break-words shadow-sm"
                                  dangerouslySetInnerHTML={{ __html: markdownToHtml(activity.description) }}
                                />
                              </div>
                            ) : (
                              <div 
                                className="text-sm leading-relaxed text-gray-600 line-clamp-2 overflow-hidden break-words"
                                dangerouslySetInnerHTML={{ __html: markdownToHtml(activity.description.split('\n')[0]) }}
                              />
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleActivityExpanded(activity.id)}
                              className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal text-sm"
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
                          
                          {/* Botón de completar - full width en mobile */}
                          <Button
                            variant={activity.completed ? "default" : "outline"}
                            size="sm"
                            onClick={() => onActivityComplete(activity.id, !activity.completed)}
                            className={`w-full sm:w-auto ${activity.completed ? "bg-green-600 hover:bg-green-700" : ""}`}
                          >
                            {activity.completed ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Completada
                              </>
                            ) : (
                              <>
                                <Circle className="h-4 w-4 mr-2" />
                                Marcar como completada
                              </>
                            )}
                          </Button>
                          
                          {/* Fecha de completado */}
                          {activity.completed && activity.completedAt && (
                            <p className="text-xs text-green-600 pt-2 border-t border-green-200">
                              ✅ Completada el {new Date(activity.completedAt).toLocaleDateString('es-ES', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          )}
                        </div>
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
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Notas y Reflexiones</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Guarda tus reflexiones, dudas o logros de esta semana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="notes" className="text-sm">Notas de la semana</Label>
              <Textarea
                id="notes"
                placeholder="¿Cómo te fue esta semana? ¿Qué aprendiste? ¿Qué te resultó más difícil?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="text-sm resize-none"
              />
            </div>
            <Button className="w-full sm:w-auto">
              Guardar Notas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
