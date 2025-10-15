
'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  LogOut,
  User,
  Menu,
  MessageSquare,
  Library,
  HelpCircle,
  UserPlus,
  LayoutDashboard,
  ChevronDown,
  Mic
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getProfileImageUrl } from '@/lib/utils'
import { InviteFriendsModal } from '@/components/invite-friends-modal'

interface AppHeaderProps {
  currentSection: string
  showBackButton?: boolean
}

export function AppHeader({ currentSection, showBackButton = false }: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const { data: session } = useSession() || {}
  const router = useRouter()
  const user = session?.user

  const getSectionTitle = () => {
    switch(currentSection) {
      case 'dashboard': return 'Dashboard'
      case 'tutor': return 'AI Tutor'
      case 'vocabulario': return 'Vocabulario'
      case 'recursos': return 'Recursos'
      case 'guia': return 'Guía de Uso'
      case 'perfil': return 'Mi Perfil'
      default: return 'SpeaklyPlan'
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4">
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <BookOpen className="h-8 w-8 text-blue-600" />
          <div className="text-left">
            <h1 className="text-xl font-bold text-gray-900">SpeaklyPlan</h1>
            <p className="text-sm text-gray-600 hidden sm:block text-left">{getSectionTitle()}</p>
          </div>
        </button>
        
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button 
                data-tour="user-menu"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                {user?.image ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-300 shadow-sm group-hover:border-blue-400 transition-colors">
                    <Image
                      src={getProfileImageUrl(user.image) || ''}
                      alt={user.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm text-gray-700 group-hover:text-gray-900">{user?.name || user?.email}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform group-data-[state=open]:rotate-180" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <div className="px-2 py-1.5 text-sm">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                data-tour="profile-button"
                onClick={() => {
                  setDropdownOpen(false)
                  router.push('/perfil')
                }}
                className="cursor-pointer"
              >
                <User className="h-4 w-4 mr-2" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                data-tour="invite-friends"
                onClick={(e) => {
                  e.preventDefault()
                  setDropdownOpen(false)
                  setInviteModalOpen(true)
                }}
                className="cursor-pointer"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                <span>Invitar Amigos</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setDropdownOpen(false)
                  signOut({ callbackUrl: '/' })
                }}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Invite Modal - Outside Dropdown */}
          <InviteFriendsModal
            senderEmail={user?.email || undefined}
            senderName={user?.name || undefined}
            open={inviteModalOpen}
            onOpenChange={setInviteModalOpen}
            trigger={<div style={{ display: 'none' }} />}
          />
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span>Menú</span>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                {user?.image ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200 flex-shrink-0">
                    <Image
                      src={getProfileImageUrl(user.image) || ''}
                      alt={user.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <User className="h-5 w-5 text-blue-600" />
                )}
                <span className="text-sm font-medium truncate">{user?.name || user?.email}</span>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-500 mb-3">Navegación</p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant={currentSection === 'dashboard' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => {
                      router.push('/dashboard')
                      setMobileMenuOpen(false)
                    }}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant={currentSection === 'tutor' ? 'default' : 'outline'}
                    className="w-full justify-start bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
                    onClick={() => {
                      router.push('/tutor')
                      setMobileMenuOpen(false)
                    }}
                  >
                    <Mic className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="font-medium">AI Tutor (Voz)</span>
                  </Button>
                  <Button
                    variant={currentSection === 'vocabulario' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => {
                      router.push('/vocabulario')
                      setMobileMenuOpen(false)
                    }}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Vocabulario
                  </Button>
                  <Button
                    variant={currentSection === 'recursos' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => {
                      router.push('/recursos')
                      setMobileMenuOpen(false)
                    }}
                  >
                    <Library className="h-4 w-4 mr-2" />
                    Recursos
                  </Button>
                  <Button
                    variant={currentSection === 'guia' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => {
                      router.push('/guia')
                      setMobileMenuOpen(false)
                    }}
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Guía de Uso
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4 mt-auto">
                <div className="flex flex-col gap-2">
                  {/* Invite Friends Button - Mobile */}
                  <Button
                    variant="outline"
                    className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      // Wait for sheet animation to complete before opening modal
                      setTimeout(() => setInviteModalOpen(true), 200)
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="font-medium text-blue-700">Invitar Amigos</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      router.push('/perfil')
                      setMobileMenuOpen(false)
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Mi Perfil
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
