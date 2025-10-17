
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Send } from 'lucide-react'

export function InviteModal({
  open,
  onClose
}: {
  open: boolean
  onClose: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('¡Hola! ¿Te gustaría practicar inglés conmigo?')
  const { toast } = useToast()

  const handleSend = async () => {
    try {
      if (!email.trim()) {
        toast({
          title: 'Error',
          description: 'Por favor ingresa un email',
          variant: 'destructive'
        })
        return
      }

      setLoading(true)

      const response = await fetch('/api/practice/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverEmail: email,
          message
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Error al enviar invitación')
      }

      toast({
        title: '¡Invitación enviada! 🎉',
        description: `Se ha enviado una invitación a ${email}`
      })

      setEmail('')
      setMessage('¡Hola! ¿Te gustaría practicar inglés conmigo?')
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Invitar a practicar
          </DialogTitle>
          <DialogDescription>
            Invita a otro usuario a ser tu compañero de práctica
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="email">Email del usuario</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="message">Mensaje (opcional)</Label>
            <Textarea
              id="message"
              placeholder="Escribe un mensaje personalizado..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Invitación
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
