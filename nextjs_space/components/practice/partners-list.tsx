
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, MessageCircle } from 'lucide-react'
import { ScheduleSessionModal } from './schedule-session-modal'

interface Partner {
  id: string
  name: string | null
  email: string
  image: string | null
  level: number
  totalSessions: number
  lastSessionAt: string | null
}

interface PartnersListProps {
  partners: Partner[]
  hasGoogleCalendar: boolean
}

export function PartnersList({ partners, hasGoogleCalendar }: PartnersListProps) {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)

  const handleSchedule = (partner: Partner) => {
    setSelectedPartner(partner)
    setScheduleModalOpen(true)
  }

  if (partners.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Aún no tienes compañeros de práctica.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Envía invitaciones para empezar a practicar.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={partner.image || undefined} alt={partner.name || partner.email} />
              <AvatarFallback>
                {(partner.name || partner.email).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-medium text-sm">{partner.name || partner.email}</h4>
                <Badge variant="secondary" className="text-xs">
                  Nivel {partner.level}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{partner.totalSessions} sesiones</span>
                {partner.lastSessionAt && (
                  <span>
                    Última: {new Date(partner.lastSessionAt).toLocaleDateString('es-CO')}
                  </span>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => handleSchedule(partner)}
                  className="flex-1"
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Programar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  disabled
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Chat
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPartner && (
        <ScheduleSessionModal
          open={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
          partner={selectedPartner}
          hasGoogleCalendar={hasGoogleCalendar}
        />
      )}
    </>
  )
}
