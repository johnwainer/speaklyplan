
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Mail, Calendar, Award, TrendingUp, MessageSquare, BookOpen, Target, Activity, Brain, Trophy, Edit, Trash2, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface UserDetail {
  id: string
  name: string | null
  email: string
  role: string
  points: number
  level: number
  currentStreak: number
  bestStreak: number
  createdAt: string
  lastActiveDate: string | null
  progress: any[]
  conversations: any[]
  practiceSessions: any[]
  mistakes: any[]
  vocabularyProgress: any[]
  userAchievements: any[]
  sessionAnalytics: any[]
  learningContext: any
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    role: "",
    points: 0,
    level: 0
  })

  useEffect(() => {
    fetchUserDetail()
  }, [params.userId])

  const fetchUserDetail = async () => {
    try {
      const response = await fetch(`/api/admin/user/${params.userId}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setEditForm({
          role: data.role,
          points: data.points,
          level: data.level
        })
      }
    } catch (error) {
      console.error("Error fetching user detail:", error)
      toast.error("Error al cargar los detalles del usuario")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/user/${params.userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        toast.success("Usuario actualizado correctamente")
        setEditing(false)
        fetchUserDetail()
      } else {
        toast.error("Error al actualizar el usuario")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Error al actualizar el usuario")
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/user/${params.userId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Usuario eliminado correctamente")
        router.push("/admin")
      } else {
        toast.error("Error al eliminar el usuario")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Error al eliminar el usuario")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Usuario no encontrado</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al panel
          </Button>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-400 text-white text-xl">
                      {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    {editing ? (
                      <div className="space-y-2">
                        <Input
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          placeholder="Rol"
                          className="w-48"
                        />
                      </div>
                    ) : (
                      <>
                        <h1 className="text-2xl font-bold">{user.name || "Sin nombre"}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                            {user.role}
                          </Badge>
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            Desde {new Date(user.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {editing ? (
                    <>
                      <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                      </Button>
                      <Button variant="outline" onClick={() => setEditing(false)}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => setEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminarán permanentemente todos los datos del usuario.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </div>

              {editing && (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <Label>Puntos</Label>
                    <Input
                      type="number"
                      value={editForm.points}
                      onChange={(e) => setEditForm({ ...editForm, points: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Nivel</Label>
                    <Input
                      type="number"
                      value={editForm.level}
                      onChange={(e) => setEditForm({ ...editForm, level: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-50">Nivel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{user.level}</div>
              <p className="text-xs text-blue-100 mt-1">{user.points.toLocaleString()} puntos</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-50">Racha</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{user.currentStreak}</div>
              <p className="text-xs text-orange-100 mt-1">Mejor: {user.bestStreak} días</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-50">Actividades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {user.progress.filter((p) => p.completed).length}
              </div>
              <p className="text-xs text-green-100 mt-1">
                de {user.progress.length} totales
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-50">Sesiones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{user.practiceSessions.length}</div>
              <p className="text-xs text-purple-100 mt-1">
                {user.conversations.length} conversaciones
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <Tabs defaultValue="progress" className="space-y-4">
          <TabsList>
            <TabsTrigger value="progress">Progreso</TabsTrigger>
            <TabsTrigger value="sessions">Sesiones</TabsTrigger>
            <TabsTrigger value="vocabulary">Vocabulario</TabsTrigger>
            <TabsTrigger value="achievements">Logros</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Progreso del Plan</CardTitle>
                <CardDescription>
                  Actividades completadas por el usuario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {user.progress
                      .filter((p) => p.completed)
                      .map((progress) => (
                        <div
                          key={progress.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                        >
                          <div>
                            <p className="font-medium">{progress.activity.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Semana {progress.activity.week.number} • {progress.activity.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">
                              {new Date(progress.completedAt).toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Sesiones de Práctica</CardTitle>
                <CardDescription>
                  Historial de sesiones con el Tutor AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {user.practiceSessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-4 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge>{session.sessionType}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(session.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Duración:</span>{" "}
                            {Math.floor(session.duration / 60)} min
                          </div>
                          <div>
                            <span className="text-muted-foreground">Mensajes:</span>{" "}
                            {session.messagesCount}
                          </div>
                          {session.overallScore && (
                            <div>
                              <span className="text-muted-foreground">Puntuación:</span>{" "}
                              {session.overallScore.toFixed(1)}/10
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vocabulary">
            <Card>
              <CardHeader>
                <CardTitle>Vocabulario</CardTitle>
                <CardDescription>
                  Palabras aprendidas: {user.vocabularyProgress.filter((v) => v.mastered).length} de {user.vocabularyProgress.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {user.vocabularyProgress.map((vocab) => (
                      <div
                        key={vocab.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{vocab.word.term}</p>
                          <p className="text-sm text-muted-foreground">
                            {vocab.word.category.name} • {vocab.word.difficulty}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={vocab.mastered ? "default" : "secondary"}>
                            {vocab.mastered ? "Dominado" : "En progreso"}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {vocab.attempts} intentos
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Logros Desbloqueados</CardTitle>
                <CardDescription>
                  {user.userAchievements.length} logros conseguidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {user.userAchievements.map((ua) => (
                    <div
                      key={ua.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 text-white text-2xl">
                        {ua.achievement.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{ua.achievement.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {ua.achievement.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(ua.unlockedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Detallados</CardTitle>
                <CardDescription>
                  Métricas de rendimiento y aprendizaje
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {user.sessionAnalytics.map((analytics) => (
                      <div
                        key={analytics.id}
                        className="p-4 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Badge>{analytics.sessionType}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(analytics.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {analytics.overallScore && (
                            <div>
                              <p className="text-sm text-muted-foreground">Puntuación General</p>
                              <p className="text-lg font-bold">{analytics.overallScore.toFixed(1)}/10</p>
                            </div>
                          )}
                          {analytics.grammarAccuracy && (
                            <div>
                              <p className="text-sm text-muted-foreground">Precisión Gramatical</p>
                              <p className="text-lg font-bold">{(analytics.grammarAccuracy * 100).toFixed(0)}%</p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-muted-foreground">Duración</p>
                            <p className="text-lg font-bold">{Math.floor(analytics.duration / 60)} min</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Mensajes</p>
                            <p className="text-lg font-bold">{analytics.messagesCount}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
