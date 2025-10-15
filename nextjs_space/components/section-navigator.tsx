
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard,
  MessageSquare, 
  BookOpen, 
  Library, 
  HelpCircle,
  Mic,
  Sparkles,
  TrendingUp,
  ChevronRight
} from 'lucide-react'

interface SectionNavigatorProps {
  currentSection?: 'dashboard' | 'tutor' | 'vocabulario' | 'recursos' | 'guia' | null
  /**
   * Optional custom actions to show on the right side of the navigator
   */
  rightActions?: React.ReactNode
}

export function SectionNavigator({ currentSection, rightActions }: SectionNavigatorProps) {
  const router = useRouter()

  const sections = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      description: 'Tu progreso'
    },
    {
      id: 'tutor',
      name: 'Tutor IA',
      icon: Mic,
      path: '/tutor',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      description: 'Práctica con voz',
      isNew: true
    },
    {
      id: 'vocabulario',
      name: 'Vocabulario',
      icon: BookOpen,
      path: '/vocabulario',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      description: 'Palabras clave'
    },
    {
      id: 'recursos',
      name: 'Recursos',
      icon: Library,
      path: '/recursos',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      description: 'Herramientas'
    },
    {
      id: 'guia',
      name: 'Guía',
      icon: HelpCircle,
      path: '/guia',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-300',
      description: 'Cómo usar'
    }
  ]

  return (
    <nav className="sticky top-16 z-40 w-full border-b bg-white/95 backdrop-blur-lg shadow-sm">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 py-2">
            {sections.map((section, index) => {
              const Icon = section.icon
              const isActive = currentSection === section.id
              
              return (
                <div key={section.id} className="flex items-center">
                  <button
                    onClick={() => router.push(section.path)}
                    className={cn(
                      "group relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200",
                      "hover:scale-105 active:scale-95",
                      isActive 
                        ? `${section.bgColor} ${section.borderColor} border-2 shadow-md`
                        : "border-2 border-transparent hover:bg-gray-50"
                    )}
                  >
                    <div className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      isActive ? "bg-white shadow-sm" : "bg-transparent"
                    )}>
                      <Icon className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? section.color : "text-gray-500 group-hover:text-gray-700"
                      )} />
                    </div>
                    
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-1.5">
                        <span className={cn(
                          "text-sm font-semibold transition-colors",
                          isActive ? section.color : "text-gray-700 group-hover:text-gray-900"
                        )}>
                          {section.name}
                        </span>
                        {section.isNew && (
                          <Badge className="h-4 px-1.5 text-[10px] bg-gradient-to-r from-yellow-400 to-orange-500 border-0 animate-pulse">
                            NEW
                          </Badge>
                        )}
                      </div>
                      <span className={cn(
                        "text-[10px] transition-colors",
                        isActive ? "text-gray-600 font-medium" : "text-gray-500"
                      )}>
                        {section.description}
                      </span>
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50" 
                           style={{ color: section.color.replace('text-', '') }}
                      />
                    )}
                  </button>
                  
                  {/* Separator */}
                  {index < sections.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-gray-300 mx-1" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Mobile Navigation - Horizontal Scroll */}
          <div className="md:hidden flex items-center gap-2 py-2 overflow-x-auto scrollbar-hide w-full">
            {sections.map((section) => {
              const Icon = section.icon
              const isActive = currentSection === section.id
              
              return (
                <button
                  key={section.id}
                  onClick={() => router.push(section.path)}
                  className={cn(
                    "flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
                    isActive 
                      ? `${section.bgColor} ${section.borderColor} border-2`
                      : "border-2 border-transparent active:bg-gray-50"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-lg",
                    isActive ? "bg-white shadow-sm" : ""
                  )}>
                    <Icon className={cn(
                      "h-4 w-4",
                      isActive ? section.color : "text-gray-500"
                    )} />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-0.5">
                      <span className={cn(
                        "text-[10px] font-semibold whitespace-nowrap",
                        isActive ? section.color : "text-gray-600"
                      )}>
                        {section.name}
                      </span>
                      {section.isNew && (
                        <span className="text-[8px] bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-1 py-0.5 rounded font-bold">
                          NEW
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Right Actions */}
          {rightActions && (
            <div className="hidden md:flex items-center gap-2 py-2">
              {rightActions}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
