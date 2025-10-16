'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Play, Pause, Square, ExternalLink, Save, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'
import { LoadingSpinner } from '@/components/practice/loading-spinner'
import toast from 'react-hot-toast'

export default function SesionPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession() || {}
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [meetingData, setMeetingData] = useState<any>(null)
  const [notes, setNotes] = useState('')
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [feedbackDialog, setFeedbackDialog] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (session?.user) {
      loadSession()
    }
  }, [session])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => setTimer(t => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const loadSession = async () => {
    try {
      const response = await fetch(`/api/practice/sessions/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setMeetingData(data.session)
        setNotes(data.session.notes || '')
        if (data.session.status === 'IN_PROGRESS' && data.session.startedAt) {
          const elapsed = Math.floor((Date.now() - new Date(data.session.startedAt).getTime()) / 1000)
          setTimer(elapsed)
          setIsRunning(true)
        }
      } else {
        toast.error('Sesión no encontrada')
        router.push('/practica')
      }
    } catch (error) {
      console.error('Error loading session:', error)
      toast.error('Error al cargar sesión')
    } finally {
      setLoading(false)
    }
  }

  const startSession = async () => {
    try {
      const response = await fetch(`/api/practice/sessions/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
      })
      if (response.ok) {
        setIsRunning(true)
        toast.success('¡Sesión iniciada!')
        loadSession()
      }
    } catch (error) {
      toast.error('Error al iniciar sesión')
    }
  }

  const saveNotes = async () => {
    try {
      await fetch(`/api/practice/sessions/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_notes', notes })
      })
      toast.success('Notas guardadas')
    } catch (error) {
      toast.error('Error al guardar notas')
    }
  }

  const completeSession = async () => {
    setSubmitting(true)
    try {
      const response = await fetch(`/api/practice/sessions/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete', notes, feedback, rating })
      })
      const data = await response.json()
      if (response.ok) {
        toast.success(`¡Sesión completada! +${data.pointsEarned} puntos`)
        setTimeout(() => router.push('/practica/historial'), 1500)
      }
    } catch (error) {
      toast.error('Error al completar sesión')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner text="Cargando sesión..." /></div>
  if (!meetingData) return null

  const partner = meetingData.initiatorId === session?.user?.id ? meetingData.partner : meetingData.initiator
  const status = meetingData.status

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link href="/practica"><Button variant="ghost" className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Volver</Button></Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-full bg-muted overflow-hidden">
                    {partner.image ? <Image src={partner.image} alt={partner.name || 'Partner'} fill className="object-cover" /> : 
                      <div className="h-full w-full flex items-center justify-center bg-primary text-white text-2xl font-semibold">
                        {(partner.name || partner.email)[0].toUpperCase()}
                      </div>}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{partner.name || partner.email}</h2>
                    <p className="text-muted-foreground">{meetingData.topic || 'Práctica de conversación'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-mono font-bold">{formatTime(timer)}</div>
                  <p className="text-xs text-muted-foreground">Tiempo de sesión</p>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                {status === 'SCHEDULED' && (
                  <Button onClick={startSession} className="flex-1"><Play className="h-4 w-4 mr-2" />Iniciar Sesión</Button>
                )}
                {status === 'IN_PROGRESS' && (
                  <>
                    <Button onClick={() => setIsRunning(!isRunning)} variant="outline">{isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}{isRunning ? 'Pausar' : 'Reanudar'}</Button>
                    <Button onClick={() => setFeedbackDialog(true)} variant="destructive"><Square className="h-4 w-4 mr-2" />Finalizar</Button>
                  </>
                )}
              </div>

              {meetingData.externalLink && (
                <a href={meetingData.externalLink} target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="outline" className="w-full"><ExternalLink className="h-4 w-4 mr-2" />Abrir videollamada</Button>
                </a>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center justify-between">
                Notas de la sesión
                <Button onClick={saveNotes} size="sm" variant="outline"><Save className="h-4 w-4 mr-2" />Guardar</Button>
              </h3>
              <Textarea
                placeholder="Escribe tus notas aquí: vocabulario nuevo, puntos a mejorar, temas interesantes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[200px]"
              />
            </Card>
          </div>

          <Card className="p-6 h-fit">
            <h3 className="font-semibold mb-4">Información de la sesión</h3>
            <div className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">Estado:</span> <span className="font-medium capitalize">{status.toLowerCase().replace('_', ' ')}</span></div>
              <div><span className="text-muted-foreground">Compañero:</span> <span className="font-medium">{partner.name || partner.email}</span></div>
              <div><span className="text-muted-foreground">Tema:</span> <span className="font-medium">{meetingData.topic || 'Conversación general'}</span></div>
            </div>
          </Card>
        </div>

        <Dialog open={feedbackDialog} onOpenChange={setFeedbackDialog}>
          <DialogContent>
            <DialogHeader><DialogTitle>Finalizar Sesión</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>¿Cómo calificas esta sesión?</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
                      <Star className={`h-8 w-8 ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Feedback para tu compañero</Label>
                <Textarea placeholder="¿Qué te pareció la sesión? ¿Algún consejo?" value={feedback} onChange={(e) => setFeedback(e.target.value)} className="mt-2" />
              </div>
              <Button onClick={completeSession} disabled={submitting || rating === 0} className="w-full">
                {submitting ? 'Finalizando...' : 'Finalizar Sesión'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
