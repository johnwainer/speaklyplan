
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, ArrowLeft, Video, Calendar, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import Image from 'next/image'
import { LoadingSpinner } from '@/components/practice/loading-spinner'
import { EmptyState } from '@/components/practice/empty-state'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { AppHeader } from '@/components/app-header'
import { SectionNavigator } from '@/components/section-navigator'

interface Connection {
  id: string
  totalSessions: number
  lastSessionAt: string | null
  partner: {
    id: string
    name: string | null
    email: string
    image: string | null
    level: number
    practiceAvailable: boolean
  }
}

export default function CompanerosClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [connections, setConnections] = useState<Connection[]>([])
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sessionDialog, setSessionDialog] = useState<{ open: boolean; partner: Connection['partner'] | null }>({ open: false, partner: null })
  const [sessionData, setSessionData] = useState({ topic: '', externalLink: '' })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadConnections()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredConnections(
        connections.filter(c =>
          c.partner.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.partner.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredConnections(connections)
    }
  }, [searchQuery, connections])

  const loadConnections = async () => {
    try {
      const response = await fetch('/api/practice/connections')
      if (response.ok) {
        const data = await response.json()
        setConnections(data.connections || [])
        setFilteredConnections(data.connections || [])
      }
    } catch (error) {
      console.error('Error loading connections:', error)
      toast.error('Error al cargar compañeros')
    } finally {
      setLoading(false)
    }
  }

  const createSession = async () => {
    if (!sessionDialog.partner) return

    setCreating(true)
    try {
      const response = await fetch('/api/practice/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: sessionDialog.partner.id,
          scheduledFor: null,
          topic: sessionData.topic || undefined,
          externalLink: sessionData.externalLink || undefined
        })
      })

      const data = await response.json()
      if (response.ok) {
        toast.success('¡Sesión creada! Redirigiendo...')
        setTimeout(() => router.push(`/practica/sesion/${data.session.id}`), 1000)
      } else {
        toast.error(data.error || 'Error al crear sesión')
      }
    } catch (error) {
      toast.error('Error al crear sesión')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <>
        <AppHeader currentSection="practica" />
        <SectionNavigator currentSection="practica" />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner text="Cargando compañeros..." />
        </div>
      </>
    )
  }

  return (
    <>
      <AppHeader currentSection="practica" />
      <SectionNavigator currentSection="practica" />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <Link href="/practica">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Mis Compañeros
            </h1>
            <p className="text-muted-foreground">
              {connections.length} {connections.length === 1 ? 'compañero conectado' : 'compañeros conectados'}
            </p>
          </div>

          {connections.length > 0 && (
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar compañeros..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          )}

          {filteredConnections.length === 0 && connections.length > 0 ? (
            <EmptyState
              icon={Search}
              title="No se encontraron compañeros"
              description="Intenta con otro término de búsqueda"
            />
          ) : filteredConnections.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Aún no tienes compañeros"
              description="Envía invitaciones para comenzar a practicar con otros usuarios"
              action={
                <Link href="/practica/invitar">
                  <Button>Invitar Compañero</Button>
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredConnections.map((connection) => (
                <Card key={connection.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative h-16 w-16 rounded-full bg-muted overflow-hidden flex-shrink-0">
                      {connection.partner.image ? (
                        <Image src={connection.partner.image} alt={connection.partner.name || 'Partner'} fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary text-white text-2xl font-semibold">
                          {(connection.partner.name || connection.partner.email)[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{connection.partner.name || 'Usuario'}</h3>
                      <p className="text-sm text-muted-foreground truncate">{connection.partner.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                          Nivel {connection.partner.level}
                        </span>
                        {connection.partner.practiceAvailable && (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                            Disponible
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="font-bold text-2xl">{connection.totalSessions}</p>
                      <p className="text-xs text-muted-foreground">Sesiones</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Última sesión</p>
                      <p className="font-medium text-xs">
                        {connection.lastSessionAt
                          ? formatDistanceToNow(new Date(connection.lastSessionAt), { addSuffix: true, locale: es })
                          : 'Nunca'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => setSessionDialog({ open: true, partner: connection.partner })} className="flex-1">
                      <Video className="h-4 w-4 mr-2" />
                      Practicar Ahora
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <Dialog open={sessionDialog.open} onOpenChange={(open) => setSessionDialog({ open, partner: null })}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Iniciar Sesión de Práctica</DialogTitle>
                <DialogDescription>
                  Crea una sesión inmediata con {sessionDialog.partner?.name || sessionDialog.partner?.email}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="topic">Tema (opcional)</Label>
                  <Input
                    id="topic"
                    placeholder="Ej: Business English, Conversation Practice..."
                    value={sessionData.topic}
                    onChange={(e) => setSessionData({ ...sessionData, topic: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="link">Link de videollamada (opcional)</Label>
                  <Input
                    id="link"
                    placeholder="https://meet.google.com/..."
                    value={sessionData.externalLink}
                    onChange={(e) => setSessionData({ ...sessionData, externalLink: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Agrega un link de Zoom, Google Meet o similar
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSessionDialog({ open: false, partner: null })}>Cancelar</Button>
                <Button onClick={createSession} disabled={creating}>
                  {creating ? 'Creando...' : 'Crear Sesión'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  )
}
