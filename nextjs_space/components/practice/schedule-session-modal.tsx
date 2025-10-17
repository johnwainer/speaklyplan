
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AvailabilityPicker } from './availability-picker'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Calendar, Video } from 'lucide-react'

interface Partner {
  id: string
  name: string | null
  email: string
}

export function ScheduleSessionModal({
  open,
  onClose,
  partner,
  hasGoogleCalendar
}: {
  open: boolean
  onClose: () => void
  partner: Partner
  hasGoogleCalendar: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<any>(null)
  const [useGoogleCalendar, setUseGoogleCalendar] = useState(hasGoogleCalendar)
  const { toast } = useToast()

  const handleSchedule = async () => {
    try {
      if (!topic.trim()) {
        toast({
          title: 'Error',
          description: 'Por favor escribe un tema para la sesión',
          variant: 'destructive'
        })
        return
      }

      if (!selectedSlot) {
        toast({
          title: 'Error',
          description: 'Por favor selecciona un horario',
          variant: 'destructive'
        })
        return
      }

      setLoading(true)

      const response = await fetch('/api/practice/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: partner.id,
          scheduledFor: selectedSlot.start.toISOString(),
          topic,
          useGoogleCalendar
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Error al programar sesión')
      }

      toast({
        title: '¡Sesión programada! 🎉',
        description: data.googleMeetGenerated
          ? '✅ Evento creado en Google Calendar con enlace de Meet automático'
          : data.meetLink 
          ? 'Sesión confirmada con enlace de videollamada'
          : `Sesión confirmada con ${partner.name || partner.email}`
      })

      onClose()
      window.location.reload()
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Programar sesión con {partner.name || partner.email}
          </DialogTitle>
          <DialogDescription>
            Selecciona un horario disponible y el tema de conversación
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="topic">Tema de conversación</Label>
            <Input
              id="topic"
              placeholder="Ej: Business presentations, Travel conversations..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Fecha y hora</Label>
            <AvailabilityPicker
              partnerId={partner.id}
              onSelectSlot={setSelectedSlot}
            />
            {selectedSlot && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900">
                  ✓ Seleccionado: {selectedSlot.start.toLocaleString('es-CO', {
                    dateStyle: 'full',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
            )}
          </div>

          {hasGoogleCalendar && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <div className="flex h-5 items-center">
                  <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-green-900">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Google Calendar Conectado
                  </div>
                  <p className="text-xs text-green-700">
                    ✨ Se generará automáticamente un enlace de Google Meet para esta sesión y ambos participantes recibirán recordatorios por email
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSchedule} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Programando...
              </>
            ) : (
              <>
                <Video className="mr-2 h-4 w-4" />
                Programar Sesión
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
