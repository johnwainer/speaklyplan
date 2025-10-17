
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, Users, Calendar, History, UserPlus } from 'lucide-react'
import { InviteModal } from '@/components/practice/invite-modal'
import { InvitationCard } from '@/components/practice/invitation-card'
import { PartnersList } from '@/components/practice/partners-list'
import { SessionsList } from '@/components/practice/sessions-list'
import { HistoryList } from '@/components/practice/history-list'
import { ConnectCalendarButton } from '@/components/practice/connect-calendar-button'
import { useToast } from '@/hooks/use-toast'

interface PracticeClientProps {
  currentUserId: string
  hasGoogleCalendar: boolean
  calendarStatus?: string
  receivedInvitations: any[]
  sentInvitations: any[]
  partners: any[]
  scheduledSessions: any[]
  history: any[]
  unreadNotifications: number
}

export function PracticeClient({
  currentUserId,
  hasGoogleCalendar,
  calendarStatus,
  receivedInvitations,
  sentInvitations,
  partners,
  scheduledSessions,
  history,
  unreadNotifications
}: PracticeClientProps) {
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (calendarStatus === 'connected') {
      toast({
        title: '¡Google Calendar conectado!',
        description: 'Ahora puedes crear sesiones con links de Meet automáticamente'
      })
      router.replace('/practice')
    } else if (calendarStatus === 'cancelled') {
      toast({
        title: 'Conexión cancelada',
        description: 'No se conectó Google Calendar',
        variant: 'destructive'
      })
      router.replace('/practice')
    } else if (calendarStatus === 'error') {
      toast({
        title: 'Error',
        description: 'Hubo un error al conectar Google Calendar',
        variant: 'destructive'
      })
      router.replace('/practice')
    }
  }, [calendarStatus])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Prácticas 1 a 1</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Practica inglés con otros usuarios de la plataforma
              </p>
            </div>
            <Button onClick={() => setInviteModalOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Nueva Invitación
            </Button>
          </div>

          {/* Google Calendar Integration */}
          {!hasGoogleCalendar && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-sm text-blue-900 mb-2">
                Mejora tu experiencia con Google Calendar
              </h3>
              <p className="text-xs text-blue-700 mb-3">
                Conecta tu Google Calendar para crear sesiones con links de Meet automáticamente y recibir recordatorios.
              </p>
              <ConnectCalendarButton isConnected={false} />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="invitations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="invitations" className="relative">
              <Bell className="h-4 w-4 mr-2" />
              Invitaciones
              {receivedInvitations.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {receivedInvitations.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="partners">
              <Users className="h-4 w-4 mr-2" />
              Compañeros ({partners.length})
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <Calendar className="h-4 w-4 mr-2" />
              Sesiones ({scheduledSessions.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              Historial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invitations" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Invitaciones Recibidas</h3>
              {receivedInvitations.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">
                    No tienes invitaciones pendientes
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedInvitations.map((invitation) => (
                    <InvitationCard
                      key={invitation.id}
                      invitation={invitation}
                      type="received"
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Invitaciones Enviadas</h3>
              {sentInvitations.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">
                    No has enviado invitaciones
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sentInvitations.map((invitation) => (
                    <InvitationCard
                      key={invitation.id}
                      invitation={{
                        ...invitation,
                        sender: invitation.receiver
                      }}
                      type="sent"
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="partners">
            <h3 className="text-lg font-medium mb-4">Mis Compañeros de Práctica</h3>
            <PartnersList partners={partners} hasGoogleCalendar={hasGoogleCalendar} />
          </TabsContent>

          <TabsContent value="sessions">
            <h3 className="text-lg font-medium mb-4">Sesiones Programadas</h3>
            <SessionsList sessions={scheduledSessions} currentUserId={currentUserId} />
          </TabsContent>

          <TabsContent value="history">
            <h3 className="text-lg font-medium mb-4">Historial de Sesiones</h3>
            <HistoryList history={history} currentUserId={currentUserId} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Invite Modal */}
      <InviteModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />
    </div>
  )
}
