
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { UserPlus, Mail, X, Check, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface InviteFriendsModalProps {
  trigger?: React.ReactNode
  senderEmail?: string
  senderName?: string
  variant?: 'default' | 'floating' | 'inline'
}

export function InviteFriendsModal({ trigger, senderEmail, senderName, variant = 'default' }: InviteFriendsModalProps) {
  const [open, setOpen] = useState(false)
  const [emails, setEmails] = useState<string[]>([''])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const addEmailField = () => {
    if (emails.length < 10) {
      setEmails([...emails, ''])
    }
  }

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index))
    }
  }

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails]
    newEmails[index] = value
    setEmails(newEmails)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Filter out empty emails
    const validEmails = emails.filter(email => email.trim() !== '')
    
    if (validEmails.length === 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa al menos un correo electrónico",
        variant: "destructive"
      })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const invalidEmails = validEmails.filter(email => !emailRegex.test(email))
    
    if (invalidEmails.length > 0) {
      toast({
        title: "Error",
        description: "Algunos correos no tienen un formato válido",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/invitations/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: validEmails,
          message,
          senderEmail,
          senderName
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "¡Invitaciones enviadas! 🎉",
          description: `Se enviaron ${data.sent} invitación${data.sent > 1 ? 'es' : ''} exitosamente`,
        })
        
        // Reset form
        setEmails([''])
        setMessage('')
        setOpen(false)
      } else {
        toast({
          title: "Error",
          description: data.error || "No se pudieron enviar las invitaciones",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al enviar las invitaciones",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = variant === 'floating' ? (
    <Button
      size="lg"
      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <UserPlus className="h-5 w-5 mr-2" />
      Invitar Amigos
    </Button>
  ) : (
    <Button variant="outline" size="sm">
      <UserPlus className="h-4 w-4 mr-2" />
      Invitar
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          // Prevenir cierre en dispositivos móviles al tocar elementos dentro del modal
          e.preventDefault()
        }}
        onEscapeKeyDown={(e) => {
          // Permitir cerrar con ESC en desktop
          setOpen(false)
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <UserPlus className="h-6 w-6 text-blue-600" />
            Invita a tus Amigos
          </DialogTitle>
          <DialogDescription>
            Comparte SpeaklyPlan con tus amigos y aprende inglés juntos. ¡Es completamente gratis! 🚀
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6" onClick={(e) => e.stopPropagation()}>
          <div className="space-y-4">
            <Label>Correos electrónicos de tus amigos</Label>
            {emails.map((email, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="amigo@ejemplo.com"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    className="pl-10"
                  />
                </div>
                {emails.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEmailField(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {emails.length < 10 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEmailField}
                className="w-full"
              >
                + Agregar otro correo
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensaje personal (opcional)</Label>
            <Textarea
              id="message"
              placeholder="¡Hola! Te invito a unirte a SpeaklyPlan, una plataforma gratuita para aprender inglés..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500">{message.length}/500 caracteres</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-blue-900 mb-2">
              ✨ ¿Por qué invitar amigos?
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Practiquen juntos y manténganse motivados</li>
              <li>• Compartan su progreso y logros</li>
              <li>• 100% gratis para todos</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Enviar Invitaciones
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
