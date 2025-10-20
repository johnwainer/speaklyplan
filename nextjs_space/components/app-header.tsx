
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
  Target,
  Calendar,
  ChevronDown,
  Home
} from 'lucide-react';
import { getProfileImageUrl } from '@/lib/utils';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  currentView?: string;
  showBackButton?: boolean;
}

export function AppHeader({ 
  title = 'SpeaklyPlan', 
  subtitle = 'Dashboard',
  currentView,
  showBackButton = false 
}: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession() || {};
  const router = useRouter();
  const user = session?.user;

  const navigationItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: Home
    },
    {
      href: '/tutor',
      label: 'AI Tutor',
      icon: MessageSquare,
      highlighted: true
    },
    {
      href: '/one-on-one',
      label: 'Práctica 1 a 1',
      icon: Users,
      highlighted: true
    },
    {
      href: '/vocabulario',
      label: 'Vocabulario',
      icon: BookOpen
    },
    {
      href: '/recursos',
      label: 'Recursos',
      icon: Library
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4">
        {/* Logo and Title */}
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <BookOpen className="h-8 w-8 text-blue-600" />
          <div className="text-left">
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600 hidden sm:block text-left">{subtitle}</p>
          </div>
        </button>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.href;
            return (
              <Button
                key={item.href}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => router.push(item.href)}
                className={item.highlighted ? 'font-semibold' : ''}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            );
          })}
        </div>
        
        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                {user?.image ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-blue-300 shadow-sm">
                    <Image
                      src={getProfileImageUrl(user.image) || ''}
                      alt={user.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                <span className="font-medium max-w-[150px] truncate">
                  {user?.name || user?.email}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => router.push('/perfil')}>
                <User className="h-4 w-4 mr-2" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/guia')}>
                <HelpCircle className="h-4 w-4 mr-2" />
                Guía de Uso
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
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
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                )}
                <span className="text-sm font-medium truncate">
                  {user?.name || user?.email}
                </span>
              </div>
              
              {/* Navigation */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-500 mb-3">Navegación</p>
                <div className="flex flex-col gap-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.href;
                    return (
                      <Button
                        key={item.href}
                        variant={isActive ? 'default' : 'outline'}
                        className={`w-full justify-start ${
                          item.highlighted 
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200' 
                            : ''
                        }`}
                        onClick={() => {
                          router.push(item.href);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* User Actions */}
              <div className="border-t pt-4 mt-auto">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      router.push('/perfil');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Mi Perfil
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      router.push('/guia');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Guía de Uso
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
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
  );
}
