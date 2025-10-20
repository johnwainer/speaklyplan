'use client';

import { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  BookOpen,
  User,
  LogOut,
  HelpCircle,
  Menu,
  MessageSquare,
  Users,
  Library,
  Home,
  ChevronDown,
  Sparkles,
  Zap,
  TrendingUp,
  Flame,
  Award
} from 'lucide-react';
import { getProfileImageUrl } from '@/lib/utils';

interface TabItem {
  key: string;
  label: string;
  icon?: any;
}

interface AppHeaderProps {
  currentPage?: 'dashboard' | 'tutor' | 'one-on-one' | 'vocabulario' | 'recursos' | 'perfil' | 'guia';
  tabs?: TabItem[];
  currentTab?: string;
  onTabChange?: (tab: string) => void;
  actions?: ReactNode;
  statsBar?: ReactNode;
}

export function AppHeader({ 
  currentPage = 'dashboard',
  tabs,
  currentTab,
  onTabChange,
  actions,
  statsBar
}: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession() || {};
  const router = useRouter();
  const user = session?.user;

  const navigationItems = [
    {
      key: 'dashboard',
      href: '/dashboard',
      label: 'Dashboard',
      icon: Home,
      color: 'text-blue-600'
    },
    {
      key: 'tutor',
      href: '/tutor',
      label: 'AI Tutor',
      icon: MessageSquare,
      color: 'text-purple-600',
      badge: 'Nuevo'
    },
    {
      key: 'one-on-one',
      href: '/one-on-one',
      label: 'Práctica 1 a 1',
      icon: Users,
      color: 'text-green-600',
      badge: 'Pro'
    },
    {
      key: 'vocabulario',
      href: '/vocabulario',
      label: 'Vocabulario',
      icon: BookOpen,
      color: 'text-emerald-600'
    },
    {
      key: 'recursos',
      href: '/recursos',
      label: 'Recursos',
      icon: Library,
      color: 'text-orange-600'
    }
  ];

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md shadow-sm">
        <div className="w-full">
          {/* Top Bar - Logo + Navigation + User */}
          <div className="border-b border-gray-100">
            <div className="container max-w-7xl mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                {/* Logo */}
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg blur-sm opacity-50 group-hover:opacity-70 transition-opacity" />
                    <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-left hidden sm:block">
                    <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      SpeaklyPlan
                    </h1>
                    <p className="text-xs text-gray-500">Tu camino al inglés perfecto</p>
                  </div>
                </button>
                
                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => router.push(item.href)}
                        className={`
                          relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                          transition-all duration-200 group
                          ${isActive 
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }
                        `}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? item.color : ''} transition-transform group-hover:scale-110`} />
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {item.badge}
                          </Badge>
                        )}
                        {isActive && (
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </nav>
                
                {/* User Menu */}
                <div className="flex items-center gap-2">
                  {/* Desktop User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="hidden md:flex">
                      <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-50 group">
                        {user?.image ? (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all">
                            <Image
                              src={getProfileImageUrl(user.image) || ''}
                              alt={user.name || 'User'}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <span className="font-medium text-sm max-w-[120px] truncate text-gray-700">
                          {user?.name?.split(' ')[0] || user?.email}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <DropdownMenuItem onClick={() => router.push('/perfil')} className="cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        Mi Perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/guia')} className="cursor-pointer">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Guía de Uso
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Mobile Menu */}
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild className="lg:hidden">
                      <Button variant="ghost" size="sm" className="px-2">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px]">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          <span>Menú</span>
                        </SheetTitle>
                      </SheetHeader>
                      
                      <div className="flex flex-col gap-4 mt-6">
                        {/* User Info */}
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                          {user?.image ? (
                            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-200 flex-shrink-0">
                              <Image
                                src={getProfileImageUrl(user.image) || ''}
                                alt={user.name || 'User'}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ring-2 ring-blue-200 flex-shrink-0">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                          </div>
                        </div>
                        
                        {/* Navigation */}
                        <div className="space-y-1">
                          {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPage === item.key;
                            return (
                              <button
                                key={item.key}
                                onClick={() => {
                                  router.push(item.href);
                                  setMobileMenuOpen(false);
                                }}
                                className={`
                                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                                  transition-all duration-200
                                  ${isActive 
                                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm border border-blue-200' 
                                    : 'text-gray-600 hover:bg-gray-50'
                                  }
                                `}
                              >
                                <Icon className={`h-4 w-4 ${isActive ? item.color : ''}`} />
                                <span className="flex-1 text-left">{item.label}</span>
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                    {item.badge}
                                  </Badge>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* User Actions */}
                        <div className="border-t pt-4 space-y-1">
                          <button
                            onClick={() => {
                              router.push('/perfil');
                              setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <User className="h-4 w-4" />
                            <span>Mi Perfil</span>
                          </button>
                          <button
                            onClick={() => {
                              router.push('/guia');
                              setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <HelpCircle className="h-4 w-4" />
                            <span>Guía de Uso</span>
                          </button>
                          <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Cerrar Sesión</span>
                          </button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs & Actions Bar (when tabs are provided) */}
          {(tabs || actions) && (
            <div className="border-b border-gray-100 bg-gray-50/50">
              <div className="container max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-12">
                  {/* Tabs */}
                  {tabs && tabs.length > 0 && (
                    <div className="flex items-center gap-1">
                      {tabs.map((tab) => {
                        const TabIcon = tab.icon;
                        const isActive = currentTab === tab.key;
                        return (
                          <button
                            key={tab.key}
                            onClick={() => onTabChange?.(tab.key)}
                            className={`
                              relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md
                              transition-all duration-200
                              ${isActive 
                                ? 'text-blue-700 bg-white shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                              }
                            `}
                          >
                            {TabIcon && <TabIcon className="h-4 w-4" />}
                            {tab.label}
                            {isActive && (
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Actions */}
                  {actions && (
                    <div className="flex items-center gap-2">
                      {actions}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Stats Bar (optional) */}
          {statsBar && (
            <div className="border-b bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <div className="container max-w-7xl mx-auto px-4 py-3">
                {statsBar}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
