
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Check, X, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface InvitationCardProps {
  invitation: {
    id: string
    message: string | null
    createdAt: string
    sender: {
      id: string
      name: string | null
      email: string
      image: string | null
      level: number
    }
  }
  type: 'received' | 'sent'
}

export function InvitationCard({ invitation, type }: InvitationCardProps) {
  const [loading, setLoading] = useState<'accept' | 'reject' | null>(null)
  const { toast } = useToast()

  const handleAction = async (action: 'accept' | 'reject') => {
    try {
      setLoading(action)

      const response = await fetch(`/api/practice/invitations/${invitation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Error al procesar invitación')
      }

      toast({
        title: action === 'accept' ? '¡Invitación aceptada!' : 'Invitación rechazada',
        description: action === 'accept' 
          ? `Ahora ${invitation.sender.name || invitation.sender.email} es tu compañero de práctica`
          : 'La invitación ha sido rechazada'
      })

      window.location.reload()
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(null)
    }
  }

  const user = invitation.sender

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <Avatar className="h-12 w-12">
        <AvatarImage src={user.image || undefined} alt={user.name || user.email} />
        <AvatarFallback>
          {(user.name || user.email).charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-sm">{user.name || user.email}</h4>
            <Badge variant="secondary" className="text-xs">
              Nivel {user.level}
            </Badge>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {formatDistanceToNow(new Date(invitation.createdAt), {
              addSuffix: true,
              locale: es
            })}
          </div>
        </div>

        {invitation.message && (
          <p className="text-sm text-muted-foreground">
            "{invitation.message}"
          </p>
        )}

        {type === 'received' && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => handleAction('accept')}
              disabled={loading !== null}
              className="flex-1"
            >
              {loading === 'accept' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Aceptar
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAction('reject')}
              disabled={loading !== null}
              className="flex-1"
            >
              {loading === 'reject' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <X className="h-4 w-4 mr-1" />
                  Rechazar
                </>
              )}
            </Button>
          </div>
        )}

        {type === 'sent' && (
          <Badge variant="outline" className="text-xs">
            Pendiente
          </Badge>
        )}
      </div>
    </div>
  )
}
