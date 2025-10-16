
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Star, TrendingUp, Users, MessageSquare, Award, Zap, Target } from 'lucide-react'
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link href="/practica">
              <Button variant="ghost" className="mb-4 group">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Volver
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <Calendar className="h-10 w-10 text-indigo-500" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-indigo-500/20 blur-xl"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Mi Historial de Práctica
              </h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Revisa tus sesiones anteriores y tu progreso 📊
            </p>
          </motion.div>

          {/* Stats with animations */}
          {stats && (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <motion.div variants={itemVariant}>
                <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 p-3 group-hover:scale-110 transition-transform">
                        <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <Zap className="h-5 w-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {stats.totalSessions}
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold">Sesiones Totales</p>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariant}>
                <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="rounded-2xl bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/50 dark:to-emerald-800/50 p-3 group-hover:scale-110 transition-transform">
                        <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <Target className="h-5 w-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-3xl font-bold mb-1 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {stats.totalMinutes}
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold">Minutos Totales</p>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariant}>
                <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="rounded-2xl bg-gradient-to-br from-yellow-100 to-amber-200 dark:from-yellow-900/50 dark:to-amber-800/50 p-3 group-hover:scale-110 transition-transform">
                        <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <Award className="h-5 w-5 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-3xl font-bold mb-1 bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                      {stats.averageRating.toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold">Rating Promedio ⭐</p>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariant}>
                <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="rounded-2xl bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/50 dark:to-pink-800/50 p-3 group-hover:scale-110 transition-transform">
                        <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <TrendingUp className="h-5 w-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-3xl font-bold mb-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {stats.totalPartners}
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold">Compañeros</p>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* History List */}
          <AnimatePresence mode="wait">
            {history.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <EmptyState
                  icon={Calendar}
                  title="Aún no tienes sesiones completadas"
                  description="Completa tu primera sesión para ver tu historial aquí"
                  action={
                    <Link href="/practica/companeros">
                      <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Practicar Ahora
                      </Button>
                    </Link>
                  }
                />
              </motion.div>
            ) : (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {history.map((item, index) => {
                  const myFeedback = item.initiatorFeedback
                  const partnerFeedbackForMe = item.partnerFeedback
                  const myRating = item.initiatorRating
                  const partnerRatingForMe = item.partnerRating

                  return (
                    <motion.div
                      key={item.id}
                      variants={itemVariant}
                    >
                      <Card className="group relative overflow-hidden p-6 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/30">
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative flex items-start gap-4">
                          <motion.div 
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            className="relative h-16 w-16 rounded-2xl bg-muted overflow-hidden flex-shrink-0 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                          >
                            {item.partner.image ? (
                              <Image
                                src={item.partner.image}
                                alt={item.partner.name || 'Partner'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary via-purple-500 to-pink-500 text-white text-2xl font-bold">
                                {(item.partner.name || item.partner.email)[0].toUpperCase()}
                              </div>
                            )}
                          </motion.div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">
                                  {item.partner.name || item.partner.email}
                                </h3>
                                <p className="text-sm text-muted-foreground font-medium">
                                  {item.topic || 'Práctica de conversación'}
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-sm font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                  {format(new Date(item.startedAt), 'dd MMM yyyy', { locale: es })}
                                </p>
                                <p className="text-xs text-muted-foreground font-medium">
                                  {format(new Date(item.startedAt), 'HH:mm', { locale: es })}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-4">
                              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800">
                                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{item.durationMinutes} min</span>
                              </div>
                              {partnerRatingForMe && (
                                <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 px-3 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-800">
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                                  <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">{partnerRatingForMe}/5</span>
                                </div>
                              )}
                              {item.pointsEarned > 0 && (
                                <motion.div 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                  className="flex items-center gap-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800"
                                >
                                  <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
                                  <span className="text-sm font-bold text-green-700 dark:text-green-300">+{item.pointsEarned} pts</span>
                                </motion.div>
                              )}
                            </div>

                            {item.notes && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-4 p-4 bg-gradient-to-r from-muted/80 to-muted/50 rounded-xl border border-muted-foreground/10"
                              >
                                <p className="text-xs font-bold text-primary mb-1.5 flex items-center gap-1.5">
                                  <Award className="h-3.5 w-3.5" />
                                  Mis notas:
                                </p>
                                <p className="text-sm line-clamp-2 text-foreground/90">{item.notes}</p>
                              </motion.div>
                            )}

                            {(partnerFeedbackForMe || myFeedback) && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-muted">
                                {partnerFeedbackForMe && (
                                  <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800"
                                  >
                                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1.5">
                                      <MessageSquare className="h-3.5 w-3.5" />
                                      Feedback de {item.partner.name || 'tu compañero'}:
                                    </p>
                                    <p className="text-sm line-clamp-2 text-blue-900 dark:text-blue-100">&ldquo;{partnerFeedbackForMe}&rdquo;</p>
                                  </motion.div>
                                )}
                                {myFeedback && (
                                  <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border-2 border-purple-200 dark:border-purple-800"
                                  >
                                    <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-2 flex items-center gap-1.5">
                                      <Star className="h-3.5 w-3.5" />
                                      Tu feedback:
                                    </p>
                                    <p className="text-sm line-clamp-2 text-purple-900 dark:text-purple-100">&ldquo;{myFeedback}&rdquo;</p>
                                  </motion.div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
