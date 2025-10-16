
'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Calendar, Clock, Star, TrendingUp, Users, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { LoadingSpinner } from '@/components/practice/loading-spinner'
import { EmptyState } from '@/components/practice/empty-state'
import { StatsCard } from '@/components/practice/stats-card'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { AppHeader } from '@/components/app-header'
import { SectionNavigator } from '@/components/section-navigator'

interface HistoryItem {
  id: string
  topic: string | null
  startedAt: string
  endedAt: string
  durationMinutes: number
  notes: string | null
  initiatorFeedback: string | null
  partnerFeedback: string | null
  initiatorRating: number | null
  partnerRating: number | null
  partner: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  pointsEarned: number
}

export default function HistorialClient() {
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/practice/history?limit=50')
      if (response.ok) {
        const data = await response.json()
        setHistory(data.history || [])
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <AppHeader currentSection="practica" />
        <SectionNavigator currentSection="practica" />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner text="Cargando historial..." />
        </div>
      </>
    )
  }

  return (
    <>
      <AppHeader currentSection="practica" />
      <SectionNavigator currentSection="practica" />
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <Link href="/practica">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Mi Historial de Práctica
            </h1>
            <p className="text-muted-foreground">
              Revisa tus sesiones anteriores y tu progreso
            </p>
          </div>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatsCard
                icon={MessageSquare}
                label="Sesiones Totales"
                value={stats.totalSessions}
                iconColor="text-blue-500"
              />
              <StatsCard
                icon={Clock}
                label="Minutos Totales"
                value={stats.totalMinutes}
                iconColor="text-green-500"
              />
              <StatsCard
                icon={Star}
                label="Rating Promedio"
                value={stats.averageRating.toFixed(1)}
                subtitle="⭐ de 5.0"
                iconColor="text-yellow-500"
              />
              <StatsCard
                icon={Users}
                label="Compañeros"
                value={stats.totalPartners}
                iconColor="text-purple-500"
              />
            </div>
          )}

          {history.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="Aún no tienes sesiones completadas"
              description="Completa tu primera sesión para ver tu historial aquí"
              action={
                <Link href="/practica/companeros">
                  <Button>Practicar Ahora</Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              {history.map((item) => {
                const myFeedback = item.initiatorFeedback
                const partnerFeedbackForMe = item.partnerFeedback
                const myRating = item.initiatorRating
                const partnerRatingForMe = item.partnerRating

                return (
                  <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="relative h-14 w-14 rounded-full bg-muted overflow-hidden flex-shrink-0">
                        {item.partner.image ? (
                          <Image
                            src={item.partner.image}
                            alt={item.partner.name || 'Partner'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary text-white text-xl font-semibold">
                            {(item.partner.name || item.partner.email)[0].toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {item.partner.name || item.partner.email}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {item.topic || 'Práctica de conversación'}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-medium">
                              {format(new Date(item.startedAt), 'dd MMM yyyy', { locale: es })}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(item.startedAt), 'HH:mm', { locale: es })}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{item.durationMinutes} min</span>
                          </div>
                          {partnerRatingForMe && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              <span>{partnerRatingForMe}/5</span>
                            </div>
                          )}
                          {item.pointsEarned > 0 && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <span className="text-green-600 dark:text-green-400">+{item.pointsEarned} pts</span>
                            </div>
                          )}
                        </div>

                        {item.notes && (
                          <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Mis notas:</p>
                            <p className="text-sm line-clamp-2">{item.notes}</p>
                          </div>
                        )}

                        {(partnerFeedbackForMe || myFeedback) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t">
                            {partnerFeedbackForMe && (
                              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                                  Feedback de {item.partner.name || 'tu compañero'}:
                                </p>
                                <p className="text-sm line-clamp-2">&ldquo;{partnerFeedbackForMe}&rdquo;</p>
                              </div>
                            )}
                            {myFeedback && (
                              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
                                  Tu feedback:
                                </p>
                                <p className="text-sm line-clamp-2">&ldquo;{myFeedback}&rdquo;</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
