
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AppHeader } from '@/components/app-header'
import {
  User,
  Camera,
  Edit2,
  Save,
  X,
  Trophy,
  Flame,
  Star,
  Calendar,
  Mail,
  Shield,
  TrendingUp,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Trash2,
  Eye
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface UserData {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string
  points: number
  level: number
  currentStreak: number
  bestStreak: number
  createdAt: Date
}

interface PerfilClientProps {
  user: UserData
}

export default function PerfilClient({ user: initialUser }: PerfilClientProps) {
  const [user, setUser] = useState(initialUser)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(user.name || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const getLevelProgress = () => {
    const pointsForNextLevel = user.level * 1000
    const progressPercentage = (user.points % 1000) / 10
    return {
      current: user.points % 1000,
      needed: pointsForNextLevel % 1000 || 1000,
      percentage: progressPercentage
    }
  }

  const handleSaveProfile = async () => {
    if (!editedName.trim()) {
      toast({
        title: "Error",
        description: "El nombre no puede estar vacío",
        variant: "destructive"
      })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedName.trim()
        }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar perfil')
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      setIsEditing(false)

      toast({
        title: "¡Perfil actualizado!",
        description: "Tus cambios se han guardado correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Intenta de nuevo.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedName(user.name || '')
    setIsEditing(false)
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Archivo inválido",
        description: "Por favor selecciona una imagen válida",
        variant: "destructive"
      })
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Archivo muy grande",
        description: "La imagen no debe superar los 5MB",
        variant: "destructive"
      })
      return
    }

    setIsUploadingPhoto(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch('/api/profile/upload-photo', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al subir la foto')
      }

      const data = await response.json()
      
      // Actualizar el estado local con la nueva imagen
      setUser(prev => ({ ...prev, image: data.cloud_storage_path }))

      toast({
        title: "¡Foto actualizada!",
        description: "Tu foto de perfil se ha actualizado correctamente.",
      })

      // Actualizar la sesión de NextAuth y recargar datos
      await fetch('/api/auth/session?update', { method: 'GET' })
      
      // Forzar recarga completa para actualizar en todos los componentes
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo subir la foto. Intenta de nuevo.",
        variant: "destructive"
      })
    } finally {
      setIsUploadingPhoto(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeletePhoto = async () => {
    setIsDeletingPhoto(true)
    try {
      const response = await fetch('/api/profile/delete-photo', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al eliminar la foto')
      }

      const updatedUser = await response.json()
      
      // Actualizar el estado local
      setUser(updatedUser)
      setShowDeleteDialog(false)

      toast({
        title: "¡Foto eliminada!",
        description: "Tu foto de perfil se ha eliminado correctamente.",
      })

      // Actualizar la sesión de NextAuth y recargar datos
      await fetch('/api/auth/session?update', { method: 'GET' })

      // Forzar recarga completa para actualizar en todos los componentes
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la foto. Intenta de nuevo.",
        variant: "destructive"
      })
    } finally {
      setIsDeletingPhoto(false)
    }
  }

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    return `/api/profile/image/${encodeURIComponent(imagePath)}`
  }

  const levelProgress = getLevelProgress()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <AppHeader 
        title="SpeaklyPlan"
        subtitle="Mi Perfil"
        currentView="/perfil"
      />

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal y configuración</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Photo Card */}
            <Card className="border-2 border-blue-100">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  {/* Profile Photo */}
                  <div className="relative group">
                    <button
                      onClick={() => user.image && setShowImageDialog(true)}
                      disabled={!user.image}
                      className={`relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg ${
                        user.image ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
                      }`}
                    >
                      {user.image ? (
                        <>
                          <Image
                            src={getImageUrl(user.image) || '/placeholder-avatar.png'}
                            alt={user.name || 'Usuario'}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          {/* Hover overlay to indicate clickability */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="h-16 w-16 text-white" />
                        </div>
                      )}
                      {isUploadingPhoto && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                      )}
                    </button>
                    
                    {/* Camera Button Overlay */}
                    <button
                      onClick={handlePhotoClick}
                      disabled={isUploadingPhoto}
                      className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Cambiar foto"
                    >
                      {isUploadingPhoto ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Camera className="h-5 w-5" />
                      )}
                    </button>

                    {/* Delete Button - Only show if user has a photo */}
                    {user.image && !isUploadingPhoto && (
                      <button
                        onClick={() => setShowDeleteDialog(true)}
                        className="absolute bottom-0 left-0 p-2 bg-red-600 rounded-full text-white shadow-lg hover:bg-red-700 transition-colors"
                        title="Eliminar foto"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Upload Progress */}
                  {isUploadingPhoto && uploadProgress > 0 && (
                    <div className="w-full mt-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Subiendo...</span>
                        <span className="text-xs font-semibold text-blue-600">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  {/* User Name & Email */}
                  <div className="text-center mt-4 w-full">
                    <h2 className="text-xl font-bold text-gray-900">{user.name || 'Sin nombre'}</h2>
                    <p className="text-sm text-gray-600 flex items-center justify-center gap-1 mt-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </p>
                    <Badge variant="outline" className="mt-2 gap-1">
                      <Shield className="h-3 w-3" />
                      {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </Badge>
                  </div>

                  <Separator className="my-4" />

                  {/* Member Since */}
                  <div className="w-full text-center">
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Miembro desde {format(new Date(user.createdAt), 'MMMM yyyy', { locale: es })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Level */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Nivel {user.level}
                    </span>
                    <span className="text-xs text-gray-500">
                      {levelProgress.current}/{levelProgress.needed} pts
                    </span>
                  </div>
                  <Progress value={levelProgress.percentage} className="h-2" />
                </div>

                <Separator />

                {/* Points */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    Puntos Totales
                  </span>
                  <span className="text-lg font-bold text-blue-600">{user.points}</span>
                </div>

                <Separator />

                {/* Current Streak */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    Racha Actual
                  </span>
                  <span className="text-lg font-bold text-orange-600">{user.currentStreak} días</span>
                </div>

                <Separator />

                {/* Best Streak */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-purple-500" />
                    Mejor Racha
                  </span>
                  <span className="text-lg font-bold text-purple-600">{user.bestStreak} días</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Edit Profile */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-blue-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      Información Personal
                    </CardTitle>
                    <CardDescription>
                      Actualiza tu información de perfil
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Editar
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nombre completo
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Ingresa tu nombre"
                      className="border-blue-200 focus:border-blue-500"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900">{user.name || 'Sin nombre'}</p>
                    </div>
                  )}
                </div>

                {/* Email Field (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Correo electrónico
                  </Label>
                  <div className="p-3 bg-gray-100 rounded-lg border border-gray-300 relative">
                    <p className="text-gray-600">{user.email}</p>
                    <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                      No editable
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    El correo electrónico no puede ser modificado por razones de seguridad
                  </p>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex-1 gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      variant="outline"
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancelar
                    </Button>
                  </div>
                )}

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 text-sm mb-1">
                        Sobre tu perfil
                      </h4>
                      <ul className="text-xs text-blue-800 space-y-1">
                        <li>• Tu foto de perfil se almacena de forma segura en la nube</li>
                        <li>• Las imágenes deben ser menores a 5MB</li>
                        <li>• Puedes actualizar tu nombre en cualquier momento</li>
                        <li>• Tu email está protegido y no puede ser modificado</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements Preview Card */}
            <Card className="border-2 border-yellow-100 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Próximamente: Logros y Badges
                </CardTitle>
                <CardDescription>
                  Desbloquea logros mientras aprendes inglés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center opacity-50"
                    >
                      <Trophy className="h-8 w-8 text-gray-400" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Estamos trabajando en un sistema de logros para que puedas celebrar tus avances
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Image Preview Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Foto de Perfil</DialogTitle>
            <DialogDescription>
              {user.name || 'Usuario'}
            </DialogDescription>
          </DialogHeader>
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
            {user.image && (
              <Image
                src={getImageUrl(user.image) || '/placeholder-avatar.png'}
                alt={user.name || 'Usuario'}
                fill
                className="object-contain"
                unoptimized
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar foto de perfil?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Tu foto de perfil será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingPhoto}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePhoto}
              disabled={isDeletingPhoto}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingPhoto ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
