
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, CheckCircle2, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function ConnectCalendarButton({ isConnected }: { isConnected: boolean }) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleConnect = async () => {
    try {
      setLoading(true)

      const response = await fetch('/api/auth/google-calendar')
      const data = await response.json()

      if (!data.authUrl) {
        throw new Error('Error obteniendo URL de autorización')
      }

      const width = 600
      const height = 700
      const left = window.screen.width / 2 - width / 2
      const top = window.screen.height / 2 - height / 2

      const popup = window.open(
        data.authUrl,
        'Google Calendar Authorization',
        `width=${width},height=${height},left=${left},top=${top}`
      )

      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed)
          setLoading(false)
          window.location.reload()
        }
      }, 500)
    } catch (error: any) {
      console.error('Error conectando Calendar:', error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
      setLoading(false)
    }
  }

  if (isConnected) {
    return (
      <Button variant="outline" disabled className="w-full">
        <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
        Google Calendar Conectado
      </Button>
    )
  }

  return (
    <Button 
      onClick={handleConnect} 
      disabled={loading}
      className="w-full"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Conectando...
        </>
      ) : (
        <>
          <Calendar className="mr-2 h-4 w-4" />
          Conectar Google Calendar
        </>
      )}
    </Button>
  )
}
