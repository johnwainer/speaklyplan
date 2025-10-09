

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Eye,
  Loader2,
  User,
  Mail,
  Calendar,
  Award,
  Zap,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Target,
  Trophy,
  Clock,
  Activity,
  CheckCircle2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserDetailsDialogProps {
  userId: string
  userName: string | null
  userEmail: string
}

interface UserDetails {
  user: {
    id: string
    name: string | null
    email: string
    role: string
    createdAt: string
    updatedAt: string
    lastActiveDate: string | null
    points: number
    level: number
    currentStreak: number
    bestStreak: number
    emailVerified: string | null
    image: string | null
  }
  stats: {
    totalActivitiesCompleted: number
    totalConversations: number
    totalPracticeSessions: number
    totalMistakes: number
    totalVocabularyProgress: number
    totalAchievements: number
    totalNotes: number
    totalStreaks: number
    totalSessionAnalytics: number
    totalVocabularyCards: number
    daysSinceRegistration: number
    daysSinceLastActive: number | null
    activityRate: number
  }
  recentAchievements: Array<{
    id: string
    achievementName: string
    achievementDescription: string
    achievementIcon: string
    achievementPoints: number
    unlockedAt: string
  }>
  recentProgress: Array<{
    id: string
    activityTitle: string
    weekNumber: number
    completed: boolean
    completedAt: string | null
    timeSpent: number
    score: number | null
  }>
  recentConversations: Array<{
    id: string
    title: string
    createdAt: string
    messageCount: number
  }>
  recentPracticeSessions: Array<{
    id: string
    sessionType: string
    topic: string | null
    score: number | null
    createdAt: string
    duration: number
  }>
}

export function UserDetailsDialog({ userId, userName, userEmail }: UserDetailsDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [details, setDetails] = useState<UserDetails | null>(null)
  const { toast } = useToast()

  const fetchUserDetails = async () => {
    if (!open) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/user-details/${userId}`)
      
      if (response.ok) {
        const data = await response.json()
        setDetails(data)
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "No se pudieron obtener los detalles del usuario",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
      toast({
        title: "Error",
        description: "Error al cargar los detalles del usuario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, [open])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Ver detalles
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalles del Usuario</DialogTitle>
          <DialogDescription>
            Información completa y estadísticas de {userName || userEmail}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : details ? (
          <ScrollArea className="h-[600px] pr-4">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="stats">Estadísticas</TabsTrigger>
                <TabsTrigger value="activity">Actividad</TabsTrigger>
                <TabsTrigger value="achievements">Logros</TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información Personal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>Nombre</span>
                        </div>
                        <p className="font-medium">{details.user.name || "Sin nombre"}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </div>
                        <p className="font-medium">{details.user.email}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Award className="h-4 w-4" />
                          <span>Rol</span>
                        </div>
                        <Badge variant={details.user.role === "admin" ? "default" : "secondary"}>
                          {details.user.role}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Email Verificado</span>
                        </div>
                        <Badge variant={details.user.emailVerified ? "default" : "secondary"}>
                          {details.user.emailVerified ? "Sí" : "No"}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Fecha de Registro</span>
                        </div>
                        <p className="font-medium">{formatDate(details.user.createdAt)}</p>
                        <p className="text-xs text-muted-foreground">
                          Hace {details.stats.daysSinceRegistration} días
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Última Actividad</span>
                        </div>
                        <p className="font-medium">{formatDate(details.user.lastActiveDate)}</p>
                        {details.stats.daysSinceLastActive !== null && (
                          <p className="text-xs text-muted-foreground">
                            Hace {details.stats.daysSinceLastActive} días
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Gamificación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <Trophy className="h-8 w-8 text-yellow-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Nivel</p>
                          <p className="text-2xl font-bold text-yellow-600">{details.user.level}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Award className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Puntos</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {details.user.points.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                        <Zap className="h-8 w-8 text-orange-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Racha Actual</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {details.user.currentStreak} días
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <TrendingUp className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Mejor Racha</p>
                          <p className="text-2xl font-bold text-green-600">
                            {details.user.bestStreak} días
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Stats Tab */}
              <TabsContent value="stats" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resumen de Actividad</CardTitle>
                    <CardDescription>
                      Tasa de actividad: {details.stats.activityRate.toFixed(2)} acciones/día
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>Actividades Completadas</span>
                        </div>
                        <p className="text-2xl font-bold">{details.stats.totalActivitiesCompleted}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MessageSquare className="h-4 w-4" />
                          <span>Conversaciones</span>
                        </div>
                        <p className="text-2xl font-bold">{details.stats.totalConversations}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Target className="h-4 w-4" />
                          <span>Sesiones de Práctica</span>
                        </div>
                        <p className="text-2xl font-bold">{details.stats.totalPracticeSessions}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Trophy className="h-4 w-4" />
                          <span>Logros Desbloqueados</span>
                        </div>
                        <p className="text-2xl font-bold">{details.stats.totalAchievements}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>Progreso en Vocabulario</span>
                        </div>
                        <p className="text-2xl font-bold">{details.stats.totalVocabularyProgress}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Award className="h-4 w-4" />
                          <span>Tarjetas de Vocabulario</span>
                        </div>
                        <p className="text-2xl font-bold">{details.stats.totalVocabularyCards}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Activity className="h-4 w-4" />
                          <span>Errores Comunes</span>
                        </div>
                        <p className="text-2xl font-bold">{details.stats.totalMistakes}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>Notas Creadas</span>
                        </div>
                        <p className="text-2xl font-bold">{details.stats.totalNotes}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Zap className="h-4 w-4" />
                          <span>Rachas Registradas</span>
                        </div>
                        <p className="text-2xl font-bold">{details.stats.totalStreaks}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Progreso Reciente</CardTitle>
                    <CardDescription>Últimas 5 actividades completadas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {details.recentProgress.length > 0 ? (
                      <div className="space-y-3">
                        {details.recentProgress.map((progress) => (
                          <div
                            key={progress.id}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{progress.activityTitle}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <span>Semana {progress.weekNumber}</span>
                                <span>•</span>
                                <span>{formatDateTime(progress.completedAt)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              {progress.score !== null && (
                                <Badge variant="outline" className="mb-1">
                                  {progress.score}%
                                </Badge>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {Math.floor(progress.timeSpent / 60)} min
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No hay actividades completadas aún
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Conversaciones Recientes</CardTitle>
                    <CardDescription>Últimas 5 conversaciones con el tutor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {details.recentConversations.length > 0 ? (
                      <div className="space-y-3">
                        {details.recentConversations.map((conversation) => (
                          <div
                            key={conversation.id}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{conversation.title || "Conversación sin título"}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatDateTime(conversation.createdAt)}
                              </p>
                            </div>
                            <Badge variant="outline">
                              {conversation.messageCount} mensajes
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No hay conversaciones aún
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sesiones de Práctica Recientes</CardTitle>
                    <CardDescription>Últimas 5 sesiones de práctica</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {details.recentPracticeSessions.length > 0 ? (
                      <div className="space-y-3">
                        {details.recentPracticeSessions.map((session) => (
                          <div
                            key={session.id}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium capitalize">{session.sessionType}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {session.topic && (
                                  <Badge variant="outline" className="text-xs">
                                    {session.topic}
                                  </Badge>
                                )}
                                <span className="text-sm text-muted-foreground">
                                  {formatDateTime(session.createdAt)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              {session.score !== null && (
                                <Badge variant="default" className="mb-1">
                                  {session.score.toFixed(0)}%
                                </Badge>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {Math.floor(session.duration / 60)} min
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No hay sesiones de práctica aún
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Logros Desbloqueados</CardTitle>
                    <CardDescription>
                      {details.stats.totalAchievements} logros desbloqueados en total
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {details.recentAchievements.length > 0 ? (
                      <div className="space-y-3">
                        {details.recentAchievements.map((achievement) => (
                          <div
                            key={achievement.id}
                            className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                              <span className="text-2xl">{achievement.achievementIcon}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{achievement.achievementName}</p>
                              <p className="text-sm text-muted-foreground">
                                {achievement.achievementDescription}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Desbloqueado: {formatDateTime(achievement.unlockedAt)}
                              </p>
                            </div>
                            <Badge variant="outline">
                              +{achievement.achievementPoints} pts
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No hay logros desbloqueados aún
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No se pudieron cargar los detalles</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
