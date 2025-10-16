
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, ArrowLeft, Check, X, Clock, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import Link from 'next/link'
import Image from 'next/image'
import { LoadingSpinner } from '@/components/practice/loading-spinner'
import { EmptyState } from '@/components/practice/empty-state'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { AppHeader } from '@/components/app-header'
import { SectionNavigator } from '@/components/section-navigator'

interface Invitation {
  id: string
  status: string
  message: string | null
  createdAt: string
  respondedAt: string | null
  sender: {
    id: string
    name: string | null
    email: string
    image: string | null
    level: number
  }
  receiver: {
    id: string
    name: string | null
    email: string
    image: string | null
    level: number
  }
}

export default function InvitacionesClient() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('received')
  const [loading, setLoading] = useState(true)
  const [receivedInvitations, setReceivedInvitations] = useState<Invitation[]>([])
  const [sentInvitations, setSentInvitations] = useState<Invitation[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogAction, setDialogAction] = useState<{ type: string; invitationId: string } | null>(null)

  useEffect(() => {
    loadInvitations()
  }, [])

  const loadInvitations = async () => {
    try {
      const [receivedRes, sentRes] = await Promise.all([
        fetch('/api/practice/invitations?type=received'),
        fetch('/api/practice/invitations?type=sent')
      ])

      if (receivedRes.ok) {
        const data = await receivedRes.json()
        setReceivedInvitations(data.invitations || [])
      }

      if (sentRes.ok) {
        const data = await sentRes.json()
        setSentInvitations(data.invitations || [])
      }
    } catch (error) {
      console.error('Error loading invitations:', error)
      toast.error('Error al cargar invitaciones')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (invitationId: string, action: 'accept' | 'reject' | 'cancel') => {
    setActionLoading(invitationId)

    try {
      const response = await fetch(`/api/practice/invitations/${invitationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      const data = await response.json()

      if (response.ok) {
        if (action === 'accept') {
          toast.success(data.message || '¡Ahora son compañeros de práctica!')
          setTimeout(() => router.push('/practica/companeros'), 1500)
        } else if (action === 'reject') {
          toast.success('Invitación rechazada')
        } else {
          toast.success('Invitación cancelada')
        }
        loadInvitations()
      } else {
        toast.error(data.error || 'Error al procesar invitación')
      }
    } catch (error) {
      toast.error('Error al procesar invitación')
    } finally {
      setActionLoading(null)
      setDialogOpen(false)
      setDialogAction(null)
    }
  }

  const openDialog = (type: string, invitationId: string) => {
    setDialogAction({ type, invitationId })
    setDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
      ACCEPTED: { label: 'Aceptada', className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
      REJECTED: { label: 'Rechazada', className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
      CANCELLED: { label: 'Cancelada', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
      EXPIRED: { label: 'Expirada', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' }
    }
    const badge = badges[status as keyof typeof badges] || badges.PENDING
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${badge.className}`}>
        {badge.label}
      </span>
    )
  }

  const InvitationCard = ({ invitation, type }: { invitation: Invitation; type: 'received' | 'sent' }) => {
    const otherUser = type === 'received' ? invitation.sender : invitation.receiver
    const isPending = invitation.status === 'PENDING'

    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div className="relative h-12 w-12 rounded-full bg-muted overflow-hidden flex-shrink-0">
            {otherUser.image ? (
              <Image
                src={otherUser.image}
                alt={otherUser.name || 'User'}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary text-white font-semibold">
                {(otherUser.name || otherUser.email)[0].toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <h3 className="font-semibold truncate">
                  {otherUser.name || otherUser.email}
                </h3>
                <p className="text-sm text-muted-foreground truncate">{otherUser.email}</p>
              </div>
              {getStatusBadge(invitation.status)}
            </div>

            {invitation.message && (
              <p className="text-sm text-muted-foreground italic mt-2 mb-2 line-clamp-2">
                &ldquo;{invitation.message}&rdquo;
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(invitation.createdAt), { addSuffix: true, locale: es })}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                Nivel {otherUser.level}
              </span>
            </div>

            {/* Actions */}
            {isPending && (
              <div className="flex gap-2 mt-4">
                {type === 'received' ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleAction(invitation.id, 'accept')}
                      disabled={actionLoading === invitation.id}
                      className="flex-1"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Aceptar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDialog('reject', invitation.id)}
                      disabled={actionLoading === invitation.id}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Rechazar
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDialog('cancel', invitation.id)}
                    disabled={actionLoading === invitation.id}
                    className="w-full"
                  >
                    Cancelar Invitación
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <>
        <AppHeader currentSection="practica" />
        <SectionNavigator currentSection="practica" />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner text="Cargando invitaciones..." />
        </div>
      </>
    )
  }

  return (
    <>
      <AppHeader currentSection="practica" />
      <SectionNavigator currentSection="practica" />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/practica">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mis Invitaciones
            </h1>
            <p className="text-muted-foreground">
              Gestiona tus invitaciones de práctica
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="received" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Recibidas ({receivedInvitations.filter(i => i.status === 'PENDING').length})
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Enviadas ({sentInvitations.filter(i => i.status === 'PENDING').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="received" className="space-y-4">
              {receivedInvitations.length === 0 ? (
                <EmptyState
                  icon={Mail}
                  title="No has recibido invitaciones"
                  description="Cuando otros usuarios te inviten a practicar, verás las invitaciones aquí"
                />
              ) : (
                receivedInvitations.map((invitation) => (
                  <InvitationCard key={invitation.id} invitation={invitation} type="received" />
                ))
              )}
            </TabsContent>

            <TabsContent value="sent" className="space-y-4">
              {sentInvitations.length === 0 ? (
                <EmptyState
                  icon={UserPlus}
                  title="No has enviado invitaciones"
                  description="Invita a otros usuarios para comenzar a practicar juntos"
                  action={
                    <Link href="/practica/invitar">
                      <Button>Invitar Compañero</Button>
                    </Link>
                  }
                />
              ) : (
                sentInvitations.map((invitation) => (
                  <InvitationCard key={invitation.id} invitation={invitation} type="sent" />
                ))
              )}
            </TabsContent>
          </Tabs>

          {/* Confirmation Dialog */}
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {dialogAction?.type === 'reject' ? '¿Rechazar invitación?' : '¿Cancelar invitación?'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {dialogAction?.type === 'reject' 
                    ? 'El usuario será notificado que rechazaste su invitación.'
                    : 'Esta acción no se puede deshacer.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (dialogAction) {
                      handleAction(dialogAction.invitationId, dialogAction.type as any)
                    }
                  }}
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  )
}
