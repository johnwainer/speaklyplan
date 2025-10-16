
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp,
  Mail,
  UserPlus,
  MessageSquare,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { LoadingSpinner } from '@/components/practice/loading-spinner'
import { EmptyState } from '@/components/practice/empty-state'
import { StatsCard } from '@/components/practice/stats-card'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import Image from 'next/image'
import { AppHeader } from '@/components/app-header'
import { SectionNavigator } from '@/components/section-navigator'

interface PracticeStats {
  totalSessions: number
  totalMinutes: number
  averageRating: number
  totalPartners: number
  completedThisWeek: number
  completedThisMonth: number
}

interface Session {
  id: string
  status: string
  scheduledFor: string | null
  topic: string | null
  partner: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

export default function PracticaClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<PracticeStats | null>(null)
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [pendingInvitations, setPendingInvitations] = useState(0)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [historyRes, sessionsRes, invitationsRes] = await Promise.all([
        fetch('/api/practice/history?limit=1'),
        fetch('/api/practice/sessions?status=SCHEDULED'),
        fetch('/api/practice/invitations?type=received')
      ])

      if (historyRes.ok) {
        const historyData = await historyRes.json()
        setStats(historyData.stats)
      }

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json()
        setUpcomingSessions(sessionsData.sessions || [])
      }

      if (invitationsRes.ok) {
        const invitationsData = await invitationsRes.json()
        const pending = invitationsData.invitations?.filter(
          (inv: any) => inv.status === 'PENDING'
        ).length || 0
        setPendingInvitations(pending)
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
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
          <LoadingSpinner text="Cargando tu dashboard..." />
        </div>
      </>
    )
  }

  return (
    <>
      <AppHeader currentSection="practica" />
      <SectionNavigator currentSection="practica" />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Prácticas 1 a 1
            </h1>
            <p className="text-muted-foreground">
              Practica inglés en vivo con otros estudiantes
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
              <Link href="/practica/invitar">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-500 p-3">
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Invitar Compañero</h3>
                    <p className="text-sm text-muted-foreground">
                      Encuentra un compañero para practicar
                    </p>
                  </div>
                </div>
              </Link>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500 relative">
              <Link href="/practica/invitaciones">
                {pendingInvitations > 0 && (
                  <span className="absolute top-3 right-3 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-semibold">
                    {pendingInvitations}
                  </span>
                )}
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-purple-500 p-3">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Invitaciones</h3>
                    <p className="text-sm text-muted-foreground">
                      Ver invitaciones enviadas y recibidas
                    </p>
                  </div>
                </div>
              </Link>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
              <Link href="/practica/companeros">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-green-500 p-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Mis Compañeros</h3>
                    <p className="text-sm text-muted-foreground">
                      {stats?.totalPartners || 0} compañeros conectados
                    </p>
                  </div>
                </div>
              </Link>
            </Card>
          </div>

          {/* Stats Overview */}
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
                label="Minutos Practicados"
                value={stats.totalMinutes}
                iconColor="text-purple-500"
              />
              <StatsCard
                icon={Star}
                label="Rating Promedio"
                value={stats.averageRating.toFixed(1)}
                subtitle="⭐ de 5.0"
                iconColor="text-yellow-500"
              />
              <StatsCard
                icon={TrendingUp}
                label="Esta Semana"
                value={stats.completedThisWeek}
                subtitle={`${stats.completedThisMonth} este mes`}
                iconColor="text-green-500"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Sessions */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Próximas Sesiones
                </h2>
                <Link href="/practica/companeros">
                  <Button variant="outline" size="sm">
                    Agendar
                  </Button>
                </Link>
              </div>

              {upcomingSessions.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No hay sesiones programadas"
                  description="Agenda una sesión con tus compañeros para comenzar a practicar"
                  action={
                    <Link href="/practica/companeros">
                      <Button>Agendar Sesión</Button>
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {upcomingSessions.slice(0, 3).map((session) => (
                    <Link
                      key={session.id}
                      href={`/practica/sesion/${session.id}`}
                      className="block"
                    >
                      <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-full bg-muted overflow-hidden flex-shrink-0">
                            {session.partner.image ? (
                              <Image
                                src={session.partner.image}
                                alt={session.partner.name || 'Partner'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-primary text-white font-semibold">
                                {(session.partner.name || session.partner.email)[0].toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">
                              {session.partner.name || session.partner.email}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {session.topic || 'Práctica de conversación'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {session.scheduledFor
                                ? formatDistanceToNow(new Date(session.scheduledFor), {
                                    addSuffix: true,
                                    locale: es
                                  })
                                : 'Sin programar'}
                            </p>
                          </div>
                          <Button size="sm" variant="ghost">
                            Unirse
                          </Button>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Activity / Quick Stats */}
            <Card className="p-6">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                Tu Progreso
              </h2>

              {!stats || stats.totalSessions === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="¡Comienza a practicar!"
                  description="Completa tu primera sesión para ver tu progreso aquí"
                  action={
                    <Link href="/practica/invitar">
                      <Button>Invitar Compañero</Button>
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Sesiones este mes</span>
                      <span className="text-sm font-bold">{stats.completedThisMonth}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                        style={{ width: `${Math.min((stats.completedThisMonth / 10) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Meta: 10 sesiones al mes
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Minutos practicados</span>
                      <span className="text-sm font-bold">{stats.totalMinutes} min</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                        style={{ width: `${Math.min((stats.totalMinutes / 600) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Meta: 600 minutos
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <Link href="/practica/historial">
                      <Button variant="outline" className="w-full">
                        Ver Historial Completo
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
