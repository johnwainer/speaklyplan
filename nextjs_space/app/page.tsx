
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, Target, Users, BookOpen, TrendingUp, ArrowRight, Menu, X, MessageSquare, Mic, Award, History, BarChart3, Sparkles, Brain, Zap, Trophy, Volume2, Flame, Star } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const features = [
    {
      icon: <Target className="h-6 w-6 text-blue-600" />,
      title: "Plan Estructurado",
      description: "24 semanas organizadas en 3 fases específicas para profesionales ocupados"
    },
    {
      icon: <Clock className="h-6 w-6 text-green-600" />,
      title: "Solo 1 Hora Diaria",
      description: "Actividades diseñadas para adaptarse a tu horario de trabajo"
    },
    {
      icon: <BookOpen className="h-6 w-6 text-purple-600" />,
      title: "100% Gratuito",
      description: "Todos los recursos y herramientas son completamente gratis"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
      title: "Seguimiento de Progreso",
      description: "Métricas visuales para monitorear tu avance día a día"
    }
  ]

  const phases = [
    {
      phase: "FASE 1",
      title: "FUNDACIÓN SÓLIDA",
      description: "Vocabulario esencial y gramática básica",
      weeks: "Semanas 1-8",
      color: "bg-blue-100 text-blue-800"
    },
    {
      phase: "FASE 2", 
      title: "CONSTRUCCIÓN ACTIVA",
      description: "Conversaciones prácticas y fluidez",
      weeks: "Semanas 9-16",
      color: "bg-green-100 text-green-800"
    },
    {
      phase: "FASE 3",
      title: "DOMINIO PROFESIONAL",
      description: "Inglés avanzado para el trabajo",
      weeks: "Semanas 17-24",
      color: "bg-purple-100 text-purple-800"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 max-w-6xl mx-auto items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">SpeaklyPlan</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">
                Registrarse
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
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
                  <span>SpeaklyPlan</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full" size="lg">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full" size="lg">
                    Registrarse
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            ✨ Método 1% - De Básico a Fluido
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Aprende <span className="text-blue-600">Inglés Profesional</span><br />
            en 6 Meses
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plan completo diseñado para <strong>profesionales con nivel básico de inglés</strong>. 
            Solo 1 hora diaria usando recursos 100% gratuitos + <span className="text-purple-600 font-bold">Tutor AI incluido</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#plan">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Ver el Plan
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 justify-center text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              6 meses de duración
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Solo recursos gratuitos
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Enfoque profesional
            </div>
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
              <span className="font-semibold text-purple-600">Tutor AI 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tutor Section - NUEVA FUNCIONALIDAD */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container max-w-6xl mx-auto relative z-10">
          {/* Header with badge */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-yellow-400 text-purple-900 border-0 px-4 py-2 text-sm font-bold animate-pulse">
              <Sparkles className="h-4 w-4 mr-2 inline" />
              🚀 NUEVA FUNCIONALIDAD - Tutor AI
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Tu Tutor de Inglés con <span className="text-yellow-300">Inteligencia Artificial</span>
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Practica conversaciones reales 24/7 con nuestro asistente AI avanzado. 
              Mejora tu pronunciación, gramática y fluidez con feedback instantáneo.
            </p>
          </div>

          {/* Main features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Conversaciones Inteligentes */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <CardHeader>
                <div className="p-3 bg-blue-500 rounded-lg w-fit mb-3">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <CardTitle className="text-white text-lg">Conversaciones Reales</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100">
                  Practica con 5 modos diferentes: conversación casual, reuniones de trabajo, entrevistas, emails profesionales y ejercicios de gramática.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Speech-to-Text */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <CardHeader>
                <div className="p-3 bg-green-500 rounded-lg w-fit mb-3">
                  <Mic className="h-6 w-6" />
                </div>
                <CardTitle className="text-white text-lg">Reconocimiento de Voz</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100">
                  Habla naturalmente y el AI transcribe automáticamente. Practica tu pronunciación en tiempo real sin escribir.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Gamification */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <CardHeader>
                <div className="p-3 bg-yellow-500 rounded-lg w-fit mb-3">
                  <Trophy className="h-6 w-6" />
                </div>
                <CardTitle className="text-white text-lg">Sistema de Gamificación</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100">
                  Gana puntos, sube de nivel, mantén rachas diarias y desbloquea logros. Mantén tu motivación al máximo.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <CardHeader>
                <div className="p-3 bg-purple-500 rounded-lg w-fit mb-3">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <CardTitle className="text-white text-lg">Análisis Detallado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100">
                  Recibe análisis completo de cada sesión: fluidez, precisión, comprensión, vocabulario y gramática con recomendaciones personalizadas.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Spaced Repetition */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <CardHeader>
                <div className="p-3 bg-pink-500 rounded-lg w-fit mb-3">
                  <Brain className="h-6 w-6" />
                </div>
                <CardTitle className="text-white text-lg">Repaso Inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100">
                  Sistema de repetición espaciada para vocabulario. Aprende y retén nuevas palabras de forma científicamente comprobada.
                </CardDescription>
              </CardContent>
            </Card>

            {/* History & Progress */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <CardHeader>
                <div className="p-3 bg-orange-500 rounded-lg w-fit mb-3">
                  <History className="h-6 w-6" />
                </div>
                <CardTitle className="text-white text-lg">Historial Completo</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100">
                  Accede a todas tus conversaciones pasadas. Revisa tu progreso y repasa temas específicos cuando lo necesites.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Additional features list */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-12">
            <h3 className="text-2xl font-bold mb-6 text-center">Y mucho más incluido:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Volume2 className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Síntesis de Voz</h4>
                  <p className="text-sm text-blue-100">Escucha cada respuesta del AI con pronunciación nativa perfecta</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Corrección Gramatical</h4>
                  <p className="text-sm text-blue-100">Feedback instantáneo sobre errores con sugerencias de mejora</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-300" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Traducciones Inteligentes</h4>
                  <p className="text-sm text-blue-100">Traducciones contextuales para ayudarte a comprender mejor</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Flame className="h-5 w-5 text-orange-300" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Rachas y Motivación</h4>
                  <p className="text-sm text-blue-100">Mantén tu racha de días consecutivos y sube de nivel constantemente</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Award className="h-5 w-5 text-purple-300" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Sistema de Logros</h4>
                  <p className="text-sm text-blue-100">Desbloquea insignias y celebra cada hito en tu aprendizaje</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-pink-500/20 rounded-lg">
                  <Zap className="h-5 w-5 text-pink-300" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Respuestas Instantáneas</h4>
                  <p className="text-sm text-blue-100">Conversaciones fluidas sin esperas, como hablar con un nativo</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4 items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-left">
                <p className="font-bold text-lg mb-1">¿Listo para practicar?</p>
                <p className="text-sm text-blue-100">Accede al Tutor AI inmediatamente después de registrarte</p>
              </div>
              <Link href="/auth/register">
                <Button size="lg" className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 font-bold shadow-lg hover:shadow-xl transition-all">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Probar el Tutor AI Gratis
                </Button>
              </Link>
            </div>
            
            <p className="mt-6 text-sm text-blue-200">
              💡 <strong>Sin costo, sin límites.</strong> Practica todo lo que quieras, cuando quieras.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué SpeaklyPlan?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un enfoque metodológico diseñado para profesionales ocupados 
              que necesitan dominar el inglés profesional desde nivel básico.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plan Overview Section */}
      <section id="plan" className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Plan de 6 Meses - 3 Fases
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Progresión estructurada desde nivel básico hasta intermedio-avanzado, 
              con actividades específicas cada día.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {phases.map((phase, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={phase.color}>{phase.phase}</Badge>
                    <span className="text-sm text-gray-500">{phase.weeks}</span>
                  </div>
                  <CardTitle className="text-xl">{phase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{phase.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">24</div>
              <div className="text-gray-400">Semanas de contenido</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">1200</div>
              <div className="text-gray-400">Términos en 12 categorías</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">60</div>
              <div className="text-gray-400">Minutos diarios</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-2">100%</div>
              <div className="text-gray-400">Recursos gratuitos</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4 bg-yellow-400 text-purple-900 border-0 px-4 py-2 text-sm font-bold">
            <MessageSquare className="h-4 w-4 mr-2 inline" />
            Incluye Tutor AI Avanzado
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comienza Tu Transformación Hoy
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Únete a cientos de profesionales que ya están dominando el inglés profesional 
            con nuestro plan estructurado y el Tutor AI disponible 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 font-bold">
                <Sparkles className="mr-2 h-5 w-5" />
                Empezar Gratis Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Acceso inmediato al Tutor AI
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Plan de 6 meses completo
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              100% gratis, sin tarjeta
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400">
        <div className="container max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold text-white">SpeaklyPlan</span>
          </div>
          <p className="text-sm">
            © 2024 SpeaklyPlan. Transformando profesionales a través del inglés.
          </p>
        </div>
      </footer>
    </div>
  )
}
