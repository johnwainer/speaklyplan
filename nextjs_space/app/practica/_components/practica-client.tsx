
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp,
  Mail,
  UserPlus,
  MessageSquare,
  Star,
  ArrowRight,
  Sparkles,
  Trophy,
  Zap
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
import { GoogleCalendarConnect } from '@/app/dashboard/practicas/_components/google-calendar-connect'

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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
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
          {/* Header with animation */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <Sparkles className="h-10 w-10 text-blue-500 animate-pulse" />
                <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Prácticas 1 a 1
              </h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Practica inglés en vivo con otros estudiantes 🚀
            </p>
          </motion.div>

          {/* Quick Actions with hover effects */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <motion.div variants={item}>
              <Link href="/practica/invitar">
                <Card className="group relative p-6 overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 flex items-start gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg"
                    >
                      <UserPlus className="h-6 w-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                        Invitar Compañero
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Encuentra un compañero para practicar
                      </p>
                      <div className="flex items-center text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Comenzar <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={item}>
              <Link href="/practica/invitaciones">
                <Card className="group relative p-6 overflow-hidden cursor-pointer border-2 border-transparent hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1">
                  <AnimatePresence>
                    {pendingInvitations > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute top-3 right-3 z-20"
                      >
                        <div className="relative">
                          <span className="flex h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white text-xs items-center justify-center font-bold shadow-lg">
                            {pendingInvitations}
                          </span>
                          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 flex items-start gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-3 shadow-lg"
                    >
                      <Mail className="h-6 w-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-purple-600 transition-colors">
                        Invitaciones
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Ver invitaciones enviadas y recibidas
                      </p>
                      <div className="flex items-center text-sm text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver todas <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={item}>
              <Link href="/practica/companeros">
                <Card className="group relative p-6 overflow-hidden cursor-pointer border-2 border-transparent hover:border-green-500 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 flex items-start gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-3 shadow-lg"
                    >
                      <Users className="h-6 w-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-green-600 transition-colors">
                        Mis Compañeros
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {stats?.totalPartners || 0} compañeros conectados
                      </p>
                      <div className="flex items-center text-sm text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Administrar <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Overview with animations */}
          {stats && (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <motion.div variants={item}>
                <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                  <div className="relative p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="rounded-xl bg-blue-100 dark:bg-blue-900/30 p-2.5 group-hover:scale-110 transition-transform">
                        <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <Zap className="h-4 w-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-2xl font-bold mb-1">{stats.totalSessions}</p>
                    <p className="text-xs text-muted-foreground font-medium">Sesiones Totales</p>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
                  <div className="relative p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="rounded-xl bg-purple-100 dark:bg-purple-900/30 p-2.5 group-hover:scale-110 transition-transform">
                        <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <Zap className="h-4 w-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-2xl font-bold mb-1">{stats.totalMinutes}</p>
                    <p className="text-xs text-muted-foreground font-medium">Minutos Practicados</p>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent" />
                  <div className="relative p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="rounded-xl bg-yellow-100 dark:bg-yellow-900/30 p-2.5 group-hover:scale-110 transition-transform">
                        <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <Trophy className="h-4 w-4 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-2xl font-bold mb-1">{stats.averageRating.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground font-medium">Rating Promedio ⭐</p>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
                  <div className="relative p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="rounded-xl bg-green-100 dark:bg-green-900/30 p-2.5 group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <Sparkles className="h-4 w-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-2xl font-bold mb-1">{stats.completedThisWeek}</p>
                    <p className="text-xs text-muted-foreground font-medium">Esta Semana</p>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Google Calendar Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <GoogleCalendarConnect />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Sessions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    Próximas Sesiones
                  </h2>
                  <Link href="/practica/companeros">
                    <Button variant="outline" size="sm" className="group">
                      Agendar
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
                    <AnimatePresence>
                      {upcomingSessions.slice(0, 3).map((session, index) => (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link href={`/practica/sesion/${session.id}`} className="block">
                            <Card className="group p-4 hover:bg-accent/50 transition-all cursor-pointer border-2 border-transparent hover:border-primary/50 hover:shadow-md">
                              <div className="flex items-center gap-3">
                                <div className="relative h-12 w-12 rounded-full bg-muted overflow-hidden flex-shrink-0 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
                                  {session.partner.image ? (
                                    <Image
                                      src={session.partner.image}
                                      alt={session.partner.name || 'Partner'}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/70 text-white font-semibold text-lg">
                                      {(session.partner.name || session.partner.email)[0].toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold truncate group-hover:text-primary transition-colors">
                                    {session.partner.name || session.partner.email}
                                  </p>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {session.topic || 'Práctica de conversación'}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {session.scheduledFor
                                      ? formatDistanceToNow(new Date(session.scheduledFor), {
                                          addSuffix: true,
                                          locale: es
                                        })
                                      : 'Sin programar'}
                                  </p>
                                </div>
                                <Button size="sm" variant="ghost" className="group-hover:bg-primary group-hover:text-white transition-all">
                                  Unirse
                                </Button>
                              </div>
                            </Card>
                          </Link>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Progress Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 hover:shadow-xl transition-shadow">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
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
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="origin-left"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Sesiones este mes</span>
                        <span className="text-sm font-bold text-primary">{stats.completedThisMonth}</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((stats.completedThisMonth / 10) * 100, 100)}%` }}
                          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative"
                        >
                          <div className="absolute inset-0 bg-white/30 animate-pulse" />
                        </motion.div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        Meta: 10 sesiones al mes
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="origin-left"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Minutos practicados</span>
                        <span className="text-sm font-bold text-green-600">{stats.totalMinutes} min</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((stats.totalMinutes / 600) * 100, 100)}%` }}
                          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full relative"
                        >
                          <div className="absolute inset-0 bg-white/30 animate-pulse" />
                        </motion.div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Meta: 600 minutos
                      </p>
                    </motion.div>

                    <div className="pt-4 border-t">
                      <Link href="/practica/historial">
                        <Button variant="outline" className="w-full group hover:bg-primary hover:text-white transition-all">
                          Ver Historial Completo
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
