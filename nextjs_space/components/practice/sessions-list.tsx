
'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Clock, Video, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Session {
  id: string
  scheduledFor: string | null
  topic: string | null
  status: string
  externalLink: string | null
  partner: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  initiator: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

interface SessionsListProps {
  sessions: Session[]
  currentUserId: string
}

export function SessionsList({ sessions, currentUserId }: SessionsListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No tienes sesiones programadas.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Programa una sesión con tus compañeros de práctica.
        </p>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      SCHEDULED: { variant: 'default', label: 'Programada' },
      IN_PROGRESS: { variant: 'secondary', label: 'En progreso' },
      COMPLETED: { variant: 'outline', label: 'Completada' },
      CANCELLED: { variant: 'destructive', label: 'Cancelada' }
    }

    const config = variants[status] || variants.SCHEDULED

    return (
      <Badge variant={config.variant as any} className="text-xs">
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        const partner = session.initiator.id === currentUserId 
          ? session.partner 
          : session.initiator

        return (
          <div
            key={session.id}
            className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={partner.image || undefined} alt={partner.name || partner.email} />
              <AvatarFallback>
                {(partner.name || partner.email).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">
                    Sesión con {partner.name || partner.email}
                  </h4>
                  {session.topic && (
                    <p className="text-xs text-muted-foreground">{session.topic}</p>
                  )}
                </div>
                {getStatusBadge(session.status)}
              </div>

              {session.scheduledFor && (
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(session.scheduledFor), 'PPP', { locale: es })}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(session.scheduledFor), 'p', { locale: es })}
                  </div>
                </div>
              )}

              {session.externalLink && (
                <Button
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => window.open(session.externalLink!, '_blank')}
                >
                  <Video className="h-3 w-3 mr-1" />
                  Unirse a la sesión
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
