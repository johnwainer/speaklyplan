
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, Check, X, Clock, UserPlus, Send, Inbox, Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Link from 'next/link'
import Image from 'next/image'
import { LoadingSpinner } from '@/components/practice/loading-spinner'
import { EmptyState } from '@/components/practice/empty-state'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { AppHeader } from '@/components/app-header'
import { SectionNavigator } from '@/components/section-navigator'

interface Invitation {
  id: string
  status: string
  message: string | null
  createdAt: string
  respondedAt: string | null
  sender: {
    id: string
    name: string | null
    email: string
    image: string | null
    level: number
  }
  receiver: {
    id: string
    name: string | null
    email: string
    image: string | null
    level: number
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

export default function InvitacionesClient() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('received')
  const [loading, setLoading] = useState(true)
  const [receivedInvitations, setReceivedInvitations] = useState<Invitation[]>([])
  const [sentInvitations, setSentInvitations] = useState<Invitation[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogAction, setDialogAction] = useState<{ type: string; invitationId: string } | null>(null)

  useEffect(() => {
    loadInvitations()
  }, [])

  const loadInvitations = async () => {
    try {
      const [receivedRes, sentRes] = await Promise.all([
        fetch('/api/practice/invitations?type=received'),
        fetch('/api/practice/invitations?type=sent')
      ])

      if (receivedRes.ok) {
        const data = await receivedRes.json()
        setReceivedInvitations(data.invitations || [])
      }

      if (sentRes.ok) {
        const data = await sentRes.json()
        setSentInvitations(data.invitations || [])
      }
    } catch (error) {
      console.error('Error loading invitations:', error)
      toast.error('Error al cargar invitaciones')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (invitationId: string, action: 'accept' | 'reject' | 'cancel') => {
    setActionLoading(invitationId)

    try {
      const response = await fetch(`/api/practice/invitations/${invitationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      const data = await response.json()

      if (response.ok) {
        if (action === 'accept') {
          toast.success(data.message || '¡Ahora son compañeros de práctica!')
          setTimeout(() => router.push('/practica/companeros'), 1500)
        } else if (action === 'reject') {
          toast.success('Invitación rechazada')
        } else {
          toast.success('Invitación cancelada')
        }
        loadInvitations()
      } else {
        toast.error(data.error || 'Error al procesar invitación')
      }
    } catch (error) {
      toast.error('Error al procesar invitación')
    } finally {
      setActionLoading(null)
      setDialogOpen(false)
      setDialogAction(null)
    }
  }

  const openDialog = (type: string, invitationId: string) => {
    setDialogAction({ type, invitationId })
    setDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: { 
        label: 'Pendiente', 
        className: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 dark:from-yellow-900 dark:to-amber-900 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800',
        icon: <Clock className="h-3 w-3 mr-1" />
      },
      ACCEPTED: { 
        label: 'Aceptada', 
        className: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900 dark:to-emerald-900 dark:text-green-300 border border-green-200 dark:border-green-800',
        icon: <Check className="h-3 w-3 mr-1" />
      },
      REJECTED: { 
        label: 'Rechazada', 
        className: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 dark:from-red-900 dark:to-rose-900 dark:text-red-300 border border-red-200 dark:border-red-800',
        icon: <X className="h-3 w-3 mr-1" />
      },
      CANCELLED: { 
        label: 'Cancelada', 
        className: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 dark:from-gray-800 dark:to-slate-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
        icon: <AlertCircle className="h-3 w-3 mr-1" />
      },
      EXPIRED: { 
        label: 'Expirada', 
        className: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 dark:from-gray-800 dark:to-slate-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
        icon: <AlertCircle className="h-3 w-3 mr-1" />
      }
    }
    const badge = badges[status as keyof typeof badges] || badges.PENDING
    return (
      <motion.span 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 ${badge.className}`}
      >
        {badge.icon}
        {badge.label}
      </motion.span>
    )
  }

  const InvitationCard = ({ invitation, type, index }: { invitation: Invitation; type: 'received' | 'sent'; index: number }) => {
    const otherUser = type === 'received' ? invitation.sender : invitation.receiver
    const isPending = invitation.status === 'PENDING'

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card className="group relative overflow-hidden p-5 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/30">
          {/* Background gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative flex items-start gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative h-14 w-14 rounded-2xl bg-muted overflow-hidden flex-shrink-0 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
            >
              {otherUser.image ? (
                <Image
                  src={otherUser.image}
                  alt={otherUser.name || 'User'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/70 text-white font-bold text-xl">
                  {(otherUser.name || otherUser.email)[0].toUpperCase()}
                </div>
              )}
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate text-lg group-hover:text-primary transition-colors">
                    {otherUser.name || otherUser.email}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{otherUser.email}</p>
                </div>
                {getStatusBadge(invitation.status)}
              </div>

              {invitation.message && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-100 dark:border-blue-900"
                >
                  <p className="text-sm italic line-clamp-2 text-gray-700 dark:text-gray-300">
                    &ldquo;{invitation.message}&rdquo;
                  </p>
                </motion.div>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1.5 rounded-full">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDistanceToNow(new Date(invitation.createdAt), { addSuffix: true, locale: es })}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">
                  Nivel {otherUser.level}
                </span>
              </div>

              {/* Actions */}
              {isPending && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex gap-2"
                >
                  {type === 'received' ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleAction(invitation.id, 'accept')}
                        disabled={actionLoading === invitation.id}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 group/btn"
                      >
                        <Check className="h-4 w-4 mr-1.5 group-hover/btn:scale-110 transition-transform" />
                        Aceptar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDialog('reject', invitation.id)}
                        disabled={actionLoading === invitation.id}
                        className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-950/30 group/btn"
                      >
                        <X className="h-4 w-4 mr-1.5 group-hover/btn:scale-110 transition-transform" />
                        Rechazar
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDialog('cancel', invitation.id)}
                      disabled={actionLoading === invitation.id}
                      className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-950/30 group/btn"
                    >
                      <X className="h-4 w-4 mr-1.5 group-hover/btn:rotate-90 transition-transform" />
                      Cancelar Invitación
                    </Button>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <>
        <AppHeader currentSection="practica" />
        <SectionNavigator currentSection="practica" />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner text="Cargando invitaciones..." />
        </div>
      </>
    )
  }

  const pendingReceived = receivedInvitations.filter(i => i.status === 'PENDING').length
  const pendingSent = sentInvitations.filter(i => i.status === 'PENDING').length

  return (
    <>
      <AppHeader currentSection="practica" />
      <SectionNavigator currentSection="practica" />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
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
                <Mail className="h-10 w-10 text-purple-500" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-purple-500/20 blur-xl"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                Mis Invitaciones
              </h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Gestiona tus invitaciones de práctica ✨
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 p-1.5 bg-muted/50 rounded-xl h-auto">
                <TabsTrigger 
                  value="received" 
                  className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all"
                >
                  <Inbox className="h-4 w-4" />
                  <span className="font-semibold">Recibidas</span>
                  {pendingReceived > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold"
                    >
                      {pendingReceived}
                    </motion.span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="sent" 
                  className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all"
                >
                  <Send className="h-4 w-4" />
                  <span className="font-semibold">Enviadas</span>
                  {pendingSent > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-1 px-2 py-0.5 rounded-full bg-yellow-500 text-white text-xs font-bold"
                    >
                      {pendingSent}
                    </motion.span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="received" className="space-y-4">
                <AnimatePresence mode="wait">
                  {receivedInvitations.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <EmptyState
                        icon={Inbox}
                        title="No has recibido invitaciones"
                        description="Cuando otros usuarios te inviten a practicar, verás las invitaciones aquí"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="space-y-4"
                    >
                      {receivedInvitations.map((invitation, index) => (
                        <InvitationCard key={invitation.id} invitation={invitation} type="received" index={index} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="sent" className="space-y-4">
                <AnimatePresence mode="wait">
                  {sentInvitations.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <EmptyState
                        icon={Send}
                        title="No has enviado invitaciones"
                        description="Invita a otros usuarios para comenzar a practicar juntos"
                        action={
                          <Link href="/practica/invitar">
                            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Invitar Compañero
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
                      {sentInvitations.map((invitation, index) => (
                        <InvitationCard key={invitation.id} invitation={invitation} type="sent" index={index} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Confirmation Dialog */}
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl">
                  {dialogAction?.type === 'reject' ? '¿Rechazar invitación?' : '¿Cancelar invitación?'}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-base">
                  {dialogAction?.type === 'reject' 
                    ? 'El usuario será notificado que rechazaste su invitación.'
                    : 'Esta acción no se puede deshacer.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="hover:bg-muted">Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (dialogAction) {
                      handleAction(dialogAction.invitationId, dialogAction.type as any)
                    }
                  }}
                  className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  )
}
