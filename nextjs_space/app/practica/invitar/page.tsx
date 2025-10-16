
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Search, UserPlus, Send, ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  level: number
  practiceAvailable: boolean
}

export default function InvitarCompanero() {
  const { data: session } = useSession() || {}
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [searching, setSearching] = useState(false)
  const [sending, setSending] = useState(false)
  const [foundUser, setFoundUser] = useState<User | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const searchUser = async () => {
    if (!email.trim()) {
      setError('Por favor ingresa un email')
      return
    }

    setSearching(true)
    setError('')
    setFoundUser(null)

    try {
      const response = await fetch(`/api/practice/search-user?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (response.ok) {
        setFoundUser(data.user)
      } else {
        setError(data.error || 'Usuario no encontrado')
      }
    } catch (err) {
      setError('Error al buscar usuario')
    } finally {
      setSearching(false)
    }
  }

  const sendInvitation = async () => {
    if (!foundUser) return

    setSending(true)

    try {
      const response = await fetch('/api/practice/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverEmail: foundUser.email,
          message: message.trim() || undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        toast.success('¡Invitación enviada exitosamente!')
        setTimeout(() => {
          router.push('/practica/invitaciones')
        }, 2000)
      } else {
        toast.error(data.error || 'Error al enviar invitación')
      }
    } catch (err) {
      toast.error('Error al enviar invitación')
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!foundUser) {
        searchUser()
      }
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="rounded-full bg-green-500 p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">¡Invitación Enviada!</h2>
          <p className="text-muted-foreground mb-6">
            {foundUser?.name || foundUser?.email} recibirá tu invitación por email y en su perfil.
          </p>
          <Button onClick={() => router.push('/practica/invitaciones')} className="w-full">
            Ver Mis Invitaciones
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/practica">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Invitar Compañero
          </h1>
          <p className="text-muted-foreground">
            Encuentra un compañero para practicar inglés juntos
          </p>
        </div>

        <div className="space-y-6">
          {/* Search Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Buscar Usuario
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email del usuario</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={searching || !!foundUser}
                  />
                  {!foundUser && (
                    <Button
                      onClick={searchUser}
                      disabled={searching || !email.trim()}
                    >
                      {searching ? 'Buscando...' : 'Buscar'}
                    </Button>
                  )}
                  {foundUser && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFoundUser(null)
                        setEmail('')
                        setMessage('')
                        setError('')
                      }}
                    >
                      Cambiar
                    </Button>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
            </div>
          </Card>

          {/* User Preview */}
          {foundUser && (
            <Card className="p-6 border-2 border-primary">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Usuario Encontrado
              </h2>

              <div className="flex items-center gap-4 mb-6">
                <div className="relative h-16 w-16 rounded-full bg-muted overflow-hidden flex-shrink-0">
                  {foundUser.image ? (
                    <Image
                      src={foundUser.image}
                      alt={foundUser.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary text-white text-2xl font-semibold">
                      {(foundUser.name || foundUser.email)[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {foundUser.name || 'Usuario'}
                  </h3>
                  <p className="text-sm text-muted-foreground">{foundUser.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                      Nivel {foundUser.level}
                    </span>
                    {foundUser.practiceAvailable && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                        Disponible para practicar
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="message">Mensaje personalizado (opcional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Ej: ¡Hola! Me gustaría practicar inglés contigo. Estoy trabajando en mejorar mi conversación..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-2 min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Un mensaje personal aumenta la probabilidad de aceptación
                  </p>
                </div>

                <Button
                  onClick={sendInvitation}
                  disabled={sending}
                  className="w-full"
                  size="lg"
                >
                  {sending ? 'Enviando...' : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Invitación
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}

          {/* Help Card */}
          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-2">💡 Consejos</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Busca usuarios que conozcas o que estén en tu mismo nivel</li>
              <li>• Agrega un mensaje personal para aumentar las posibilidades</li>
              <li>• Una vez aceptada, podrán agendar sesiones de práctica</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
