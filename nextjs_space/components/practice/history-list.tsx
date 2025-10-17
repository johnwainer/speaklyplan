
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Star } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface HistoryItem {
  id: string
  startedAt: string | null
  endedAt: string | null
  durationMinutes: number | null
  topic: string | null
  partner: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  initiator: {
    id: string
  }
  initiatorRating: number | null
  partnerRating: number | null
}

interface HistoryListProps {
  history: HistoryItem[]
  currentUserId: string
}

export function HistoryList({ history, currentUserId }: HistoryListProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Aún no has completado ninguna sesión.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Comienza a practicar con tus compañeros.
        </p>
      </div>
    )
  }

  const renderStars = (rating: number | null) => {
    if (!rating) return null

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {history.map((item) => {
        const partner = item.partner
        const myRating = item.initiator.id === currentUserId 
          ? item.initiatorRating 
          : item.partnerRating

        return (
          <div
            key={item.id}
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
                  {item.topic && (
                    <p className="text-xs text-muted-foreground">{item.topic}</p>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  Completada
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {item.startedAt && (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(item.startedAt), 'PPP', { locale: es })}
                  </div>
                )}
                {item.durationMinutes && (
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.durationMinutes} min
                  </div>
                )}
              </div>

              {myRating && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-muted-foreground">Tu calificación:</span>
                  {renderStars(myRating)}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
