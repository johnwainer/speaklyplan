
'use client';

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  ChevronUp,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  Save,
  X
} from 'lucide-react'
import { PlanWeekData } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

interface WeekViewProps {
  weekData?: PlanWeekData
  onActivityComplete: (activityId: string, completed: boolean) => void
  onWeekChange: (weekNumber: number) => void
  totalWeeks: number
  currentWeek: number
}

interface Note {
  id: string
  weekNumber: number
  content: string
  reflection: string | null
  createdAt: string
  updatedAt: string
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
  
  // First, convert links before any other processing to preserve them
  let processedText = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '___LINK_START___$2___LINK_MIDDLE___$1___LINK_END___')
  
  // Convert **bold** to <strong>
  processedText = processedText.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
  
  // Convert *italic* or _italic_ to <em> (but not list markers)
  processedText = processedText.replace(/([^-*•\d])\*([^*\s][^*]*?)\*/g, '$1<em class="italic">$2</em>')
  processedText = processedText.replace(/_(.+?)_/g, '<em class="italic">$1</em>')
  
  // Convert ### headers to h3
  processedText = processedText.replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-gray-900 mt-3 mb-2">$1</h3>')
  
  // Convert ## headers to h2
  processedText = processedText.replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">$1</h2>')
  
  // Convert # headers to h1
  processedText = processedText.replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-gray-900 mt-4 mb-3">$1</h1>')
  
  // Split into lines for list processing
  const lines = processedText.split('\n')
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
  let html = processedLines.join('\n')
  html = html.replace(/\n(?!<\/?(ul|ol|li|h[1-3]|br))/g, '<br/>')
  
  // Clean up multiple <br> tags
  html = html.replace(/(<br\/>){3,}/g, '<br/><br/>')
  
  // Finally, convert link placeholders back to actual anchor tags
  html = html.replace(/___LINK_START___([^_]+)___LINK_MIDDLE___([^_]+)___LINK_END___/g, 
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-medium transition-colors break-all">$2</a>')
  
  return html
}

export default function WeekView({ 
  weekData, 
  onActivityComplete, 
  onWeekChange, 
  totalWeeks, 
  currentWeek 
}: WeekViewProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNoteContent, setNewNoteContent] = useState('')
  const [newNoteReflection, setNewNoteReflection] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editReflection, setEditReflection] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  // Cargar notas cuando cambia la semana
  useEffect(() => {
    if (weekData?.number) {
      loadNotes()
    }
  }, [weekData?.number])

  const loadNotes = async () => {
    if (!weekData?.number) return
    
    try {
      const response = await fetch(`/api/notes?weekNumber=${weekData.number}`)
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      }
    } catch (error) {
      console.error('Error al cargar notas:', error)
    }
  }

  const handleCreateNote = async () => {
    if (!newNoteContent.trim() || !weekData?.number) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekNumber: weekData.number,
          content: newNoteContent,
          reflection: newNoteReflection || null
        })
      })

      if (response.ok) {
        const newNote = await response.json()
        setNotes([newNote, ...notes])
        setNewNoteContent('')
        setNewNoteReflection('')
        toast({
          title: '✅ Nota guardada',
          description: 'Tu nota ha sido guardada exitosamente',
        })
      } else {
        throw new Error('Error al crear nota')
      }
    } catch (error) {
      console.error('Error al crear nota:', error)
      toast({
        title: '❌ Error',
        description: 'No se pudo guardar la nota',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateNote = async (noteId: string) => {
    if (!editContent.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editContent,
          reflection: editReflection || null
        })
      })

      if (response.ok) {
        const updatedNote = await response.json()
        setNotes(notes.map(note => note.id === noteId ? updatedNote : note))
        setEditingNoteId(null)
        setEditContent('')
        setEditReflection('')
        toast({
          title: '✅ Nota actualizada',
          description: 'Los cambios han sido guardados',
        })
      } else {
        throw new Error('Error al actualizar nota')
      }
    } catch (error) {
      console.error('Error al actualizar nota:', error)
      toast({
        title: '❌ Error',
        description: 'No se pudo actualizar la nota',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta nota?')) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/notes?id=${noteId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setNotes(notes.filter(note => note.id !== noteId))
        toast({
          title: '✅ Nota eliminada',
          description: 'La nota ha sido eliminada',
        })
      } else {
        throw new Error('Error al eliminar nota')
      }
    } catch (error) {
      console.error('Error al eliminar nota:', error)
      toast({
        title: '❌ Error',
        description: 'No se pudo eliminar la nota',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startEditing = (note: Note) => {
    setEditingNoteId(note.id)
    setEditContent(note.content)
    setEditReflection(note.reflection || '')
  }

  const cancelEditing = () => {
    setEditingNoteId(null)
    setEditContent('')
    setEditReflection('')
  }

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
                  {dayActivities.map((activity, index) => {
                    const categoryKey = activity.category.toLowerCase()
                    const icon = categoryIcons[categoryKey as keyof typeof categoryIcons] || <Circle className="h-4 w-4" />
                    const colorClass = categoryColors[categoryKey as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'
                    const isExpanded = expandedActivities.has(activity.id)
                    
                    return (
                      <motion.div 
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
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
                      </motion.div>
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
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Notas y Reflexiones
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Puedes agregar múltiples notas para documentar tu progreso y reflexiones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Formulario para nueva nota */}
            <div className="space-y-4 p-4 bg-blue-50/50 rounded-lg border border-blue-200">
              <div>
                <Label htmlFor="new-note" className="text-sm font-semibold flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nueva Nota
                </Label>
                <Textarea
                  id="new-note"
                  placeholder="¿Qué aprendiste esta semana? ¿Qué logros alcanzaste?"
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={3}
                  className="text-sm resize-none mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="new-reflection" className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Reflexión (opcional)
                </Label>
                <Textarea
                  id="new-reflection"
                  placeholder="¿Qué te resultó difícil? ¿Qué podrías mejorar?"
                  value={newNoteReflection}
                  onChange={(e) => setNewNoteReflection(e.target.value)}
                  rows={2}
                  className="text-sm resize-none mt-2"
                />
              </div>
              
              <Button 
                onClick={handleCreateNote}
                disabled={!newNoteContent.trim() || isLoading}
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Nota
              </Button>
            </div>

            {/* Lista de notas existentes */}
            {notes.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-700">
                  Tus notas ({notes.length})
                </h3>
                {notes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                  >
                    {editingNoteId === note.id ? (
                      // Modo edición
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-gray-600">Nota</Label>
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={3}
                            className="text-sm resize-none mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Reflexión</Label>
                          <Textarea
                            value={editReflection}
                            onChange={(e) => setEditReflection(e.target.value)}
                            rows={2}
                            className="text-sm resize-none mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateNote(note.id)}
                            disabled={isLoading}
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Guardar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEditing}
                            disabled={isLoading}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Modo vista
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {note.content}
                          </p>
                        </div>
                        
                        {note.reflection && (
                          <div className="p-3 bg-purple-50 rounded-md border border-purple-200">
                            <p className="text-xs font-semibold text-purple-700 mb-1 flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              Reflexión
                            </p>
                            <p className="text-sm text-purple-900 whitespace-pre-wrap leading-relaxed">
                              {note.reflection}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            {new Date(note.createdAt).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditing(note)}
                              disabled={isLoading}
                              className="h-8 px-2"
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteNote(note.id)}
                              disabled={isLoading}
                              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Aún no tienes notas para esta semana</p>
                <p className="text-xs text-gray-400 mt-1">
                  Comienza agregando tu primera nota arriba
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
