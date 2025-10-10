
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { useRef } from 'react'
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

// Animated Counter Component
function AnimatedCounter({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let startTime: number | null = null
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

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
      <motion.header 
        className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <div className="container flex h-16 max-w-6xl mx-auto items-center justify-between px-4">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <BookOpen className="h-8 w-8 text-blue-600" />
            </motion.div>
            <motion.span 
              className="text-xl font-bold text-gray-900"
              animate={{ 
                color: [
                  "#1f2937",
                  "#3b82f6",
                  "#7c3aed",
                  "#1f2937"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              SpeaklyPlan
            </motion.span>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="sm">
                  Iniciar Sesión
                </Button>
              </motion.div>
            </Link>
            <Link href="/auth/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    "0 0 0 rgba(59, 130, 246, 0)",
                    "0 0 20px rgba(59, 130, 246, 0.5)",
                    "0 0 0 rgba(59, 130, 246, 0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Registrarse
                </Button>
              </motion.div>
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
      </motion.header>

      {/* Hero Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="container max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4 animate-pulse">
              ✨ Método 1% - De Básico a Fluido
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Aprende <motion.span 
              className="text-blue-600"
              animate={{ 
                backgroundImage: [
                  "linear-gradient(to right, #2563eb, #7c3aed)",
                  "linear-gradient(to right, #7c3aed, #2563eb)",
                  "linear-gradient(to right, #2563eb, #7c3aed)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ 
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Inglés Profesional
            </motion.span><br />
            en 6 Meses
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Plan completo diseñado para <strong>profesionales con nivel básico de inglés</strong>. 
            Solo 1 hora diaria usando recursos 100% gratuitos + <span className="text-purple-600 font-bold">Tutor AI incluido</span>.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/auth/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <Link href="#plan">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Ver el Plan
                </Button>
              </motion.div>
            </Link>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap gap-6 justify-center text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {[
              { icon: CheckCircle, text: "6 meses de duración", color: "text-green-600" },
              { icon: CheckCircle, text: "Solo recursos gratuitos", color: "text-green-600" },
              { icon: CheckCircle, text: "Enfoque profesional", color: "text-green-600" },
              { icon: Sparkles, text: "Tutor AI 24/7", color: "text-purple-600", highlight: true }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
              >
                <item.icon className={`h-5 w-5 ${item.color} mr-2`} />
                <span className={item.highlight ? "font-semibold text-purple-600" : ""}>
                  {item.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Tutor Section - NUEVA FUNCIONALIDAD */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white relative overflow-hidden">
        {/* Decorative background */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <motion.div 
            className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.5, 1],
              x: [0, 50, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, -60, 0],
              y: [0, 60, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        
        <div className="container max-w-6xl mx-auto relative z-10">
          {/* Header with badge */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Badge variant="secondary" className="mb-4 bg-yellow-400 text-purple-900 border-0 px-4 py-2 text-sm font-bold">
                <motion.div 
                  className="inline-flex items-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                </motion.div>
                🚀 NUEVA FUNCIONALIDAD - Tutor AI
              </Badge>
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Tu Tutor de Inglés con <motion.span 
                className="text-yellow-300"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(253, 224, 71, 0.5)",
                    "0 0 40px rgba(253, 224, 71, 0.8)",
                    "0 0 20px rgba(253, 224, 71, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Inteligencia Artificial
              </motion.span>
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Practica conversaciones reales 24/7 con nuestro asistente AI avanzado. 
              Mejora tu pronunciación, gramática y fluidez con feedback instantáneo.
            </motion.p>
          </motion.div>

          {/* Main features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { icon: MessageSquare, title: "Conversaciones Reales", desc: "Practica con 5 modos diferentes: conversación casual, reuniones de trabajo, entrevistas, emails profesionales y ejercicios de gramática.", color: "bg-blue-500", delay: 0 },
              { icon: Mic, title: "Reconocimiento de Voz", desc: "Habla naturalmente y el AI transcribe automáticamente. Practica tu pronunciación en tiempo real sin escribir.", color: "bg-green-500", delay: 0.1 },
              { icon: Trophy, title: "Sistema de Gamificación", desc: "Gana puntos, sube de nivel, mantén rachas diarias y desbloquea logros. Mantén tu motivación al máximo.", color: "bg-yellow-500", delay: 0.2 },
              { icon: BarChart3, title: "Análisis Detallado", desc: "Recibe análisis completo de cada sesión: fluidez, precisión, comprensión, vocabulario y gramática con recomendaciones personalizadas.", color: "bg-purple-500", delay: 0.3 },
              { icon: Brain, title: "Repaso Inteligente", desc: "Sistema de repetición espaciada para vocabulario. Aprende y retén nuevas palabras de forma científicamente comprobada.", color: "bg-pink-500", delay: 0.4 },
              { icon: History, title: "Historial Completo", desc: "Accede a todas tus conversaciones pasadas. Revisa tu progreso y repasa temas específicos cuando lo necesites.", color: "bg-orange-500", delay: 0.5 }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group"
              >
                <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/25 transition-all h-full cursor-pointer">
                  <CardHeader>
                    <motion.div 
                      className={`p-3 ${feature.color} rounded-lg w-fit mb-3`}
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-6 w-6" />
                    </motion.div>
                    <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-blue-100">
                      {feature.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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

      {/* Pronunciation Practice Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
        {/* Decorative elements */}
        <motion.div 
          className="absolute top-0 right-0 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-20"
          animate={{ 
            scale: [1, 1.4, 1],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200 rounded-full blur-3xl opacity-20"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 40, 0],
            y: [0, -40, 0]
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="container max-w-6xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Badge variant="secondary" className="mb-4 bg-emerald-600 text-white border-0 px-4 py-2 text-sm font-bold">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-block"
                >
                  <Volume2 className="h-4 w-4 mr-2 inline" />
                </motion.div>
                ✨ NOVEDAD - Práctica de Pronunciación Interactiva
              </Badge>
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Domina la <motion.span 
                className="text-emerald-600"
                animate={{ 
                  scale: [1, 1.05, 1],
                  textShadow: [
                    "0 0 20px rgba(5, 150, 105, 0.3)",
                    "0 0 40px rgba(5, 150, 105, 0.6)",
                    "0 0 20px rgba(5, 150, 105, 0.3)"
                  ]
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                Pronunciación
              </motion.span> con IA
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Más de <strong>1200 términos profesionales</strong> con pronunciación interactiva. 
              Escucha, practica y recibe calificación automática de tu pronunciación en tiempo real.
            </motion.p>
          </motion.div>

          {/* Main Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { 
                icon: Volume2, 
                title: "🔊 Escuchar", 
                desc: "Síntesis de voz nativa en inglés americano. Cada término se reproduce con pronunciación perfecta y velocidad ajustada para el aprendizaje.",
                gradient: "from-blue-50 to-white",
                iconBg: "bg-blue-600",
                listBg: "bg-blue-100",
                features: ["Pronunciación nativa perfecta", "Velocidad reducida para aprender", "Disponible en todos los términos"],
                delay: 0
              },
              { 
                icon: Mic, 
                title: "🎤 Practicar", 
                desc: "Reconocimiento de voz avanzado captura tu pronunciación en tiempo real. Practica cuantas veces quieras sin límites.",
                gradient: "from-emerald-50 to-white",
                iconBg: "bg-emerald-600",
                listBg: "bg-emerald-100",
                features: ["Reconocimiento en tiempo real", "Sin límites de práctica", "Grabación automática por voz"],
                delay: 0.2
              },
              { 
                icon: Star, 
                title: "⭐ Calificar", 
                desc: "Algoritmo inteligente compara tu pronunciación con el original y te da una puntuación de 0-100 con feedback motivacional.",
                gradient: "from-amber-50 to-white",
                iconBg: "bg-amber-600",
                listBg: "bg-amber-100",
                features: ["Puntuación precisa 0-100", "Feedback inmediato", "Seguimiento de mejora"],
                delay: 0.4
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ y: -15, scale: 1.05 }}
              >
                <Card className={`border-0 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br ${feature.gradient} cursor-pointer h-full`}>
                  <CardHeader className="text-center pb-4">
                    <motion.div 
                      className={`mx-auto mb-4 p-4 ${feature.iconBg} rounded-2xl w-fit`}
                      whileHover={{ 
                        rotate: [0, -10, 10, -10, 0],
                        scale: 1.2
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <CardTitle className="text-2xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      <strong>{feature.desc.split('.')[0]}</strong>.{feature.desc.split('.').slice(1).join('.')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className={`${feature.listBg} rounded-lg p-4 text-sm text-gray-700`}>
                      {feature.features.map((item, idx) => (
                        <motion.p 
                          key={idx}
                          className="font-semibold mb-1 last:mb-0"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: feature.delay + 0.6 + idx * 0.1 }}
                        >
                          ✓ {item}
                        </motion.p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* How it works */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-emerald-100 shadow-lg">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">
              Así funciona en 3 pasos simples:
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  1
                </div>
                <h4 className="font-bold text-lg mb-2">Escucha</h4>
                <p className="text-gray-600">
                  Haz clic en el botón <strong>"Escuchar"</strong> para reproducir la pronunciación correcta
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  2
                </div>
                <h4 className="font-bold text-lg mb-2">Practica</h4>
                <p className="text-gray-600">
                  Presiona <strong>"Practicar"</strong> y pronuncia la palabra en voz alta
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  3
                </div>
                <h4 className="font-bold text-lg mb-2">Recibe tu puntuación</h4>
                <p className="text-gray-600">
                  Ve tu <strong>calificación</strong> y feedback para mejorar tu pronunciación
                </p>
              </div>
            </div>
          </div>

          {/* Stats highlight */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md">
              <div className="text-3xl font-bold text-emerald-600 mb-1">1200+</div>
              <div className="text-sm text-gray-600">Términos disponibles</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-1">12</div>
              <div className="text-sm text-gray-600">Categorías profesionales</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md">
              <div className="text-3xl font-bold text-amber-600 mb-1">100%</div>
              <div className="text-sm text-gray-600">Precisión en scoring</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md">
              <div className="text-3xl font-bold text-purple-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Práctica ilimitada</div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link href="/auth/register">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg hover:shadow-xl transition-all">
                <Volume2 className="mr-2 h-5 w-5" />
                Empezar a Practicar Pronunciación
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              💡 Funciona directamente en tu navegador, sin instalaciones
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-white via-blue-50/30 to-white relative overflow-hidden">
        {/* Floating icons */}
        <motion.div 
          className="absolute top-10 right-10 text-6xl opacity-10"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          🎯
        </motion.div>
        <motion.div 
          className="absolute bottom-10 left-10 text-6xl opacity-10"
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          📚
        </motion.div>

        <div className="container max-w-6xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué SpeaklyPlan?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Un enfoque metodológico diseñado para profesionales ocupados 
              que necesitan dominar el inglés profesional desde nivel básico.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-2xl transition-all cursor-pointer h-full">
                  <CardHeader className="text-center pb-4">
                    <motion.div 
                      className="mx-auto mb-4 p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full w-fit"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan Overview Section */}
      <section id="plan" className="py-16 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Animated timeline */}
        <motion.div 
          className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-green-400 to-purple-400 opacity-30 hidden md:block"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          style={{ originY: 0 }}
        />

        <div className="container max-w-6xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              animate={{ 
                backgroundImage: [
                  "linear-gradient(to right, #1f2937, #3b82f6, #7c3aed)",
                  "linear-gradient(to right, #7c3aed, #3b82f6, #1f2937)",
                  "linear-gradient(to right, #1f2937, #3b82f6, #7c3aed)"
                ]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ 
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Plan de 6 Meses - 3 Fases
            </motion.h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Progresión estructurada desde nivel básico hasta intermedio-avanzado, 
              con actividades específicas cada día.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {phases.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateY: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -15, 
                  scale: 1.05,
                  rotateY: 5
                }}
                style={{ perspective: 1000 }}
                className="relative"
              >
                <Card className="border-0 shadow-lg hover:shadow-2xl transition-all cursor-pointer h-full relative overflow-hidden group">
                  {/* Background animation */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0.8, rotate: -10 }}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  />

                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Badge className={`${phase.color} font-bold px-3 py-1`}>
                          {phase.phase}
                        </Badge>
                      </motion.div>
                      <motion.span 
                        className="text-sm text-gray-500 font-medium"
                        whileHover={{ scale: 1.1 }}
                      >
                        {phase.weeks}
                      </motion.span>
                    </div>
                    <CardTitle className="text-xl font-bold">{phase.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-base leading-relaxed">
                      {phase.description}
                    </CardDescription>
                    
                    {/* Progress indicator */}
                    <motion.div 
                      className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1, delay: index * 0.2 + 0.8 }}
                    >
                      <motion.div
                        className={`h-full ${
                          index === 0 ? "bg-blue-500" : 
                          index === 1 ? "bg-green-500" : "bg-purple-500"
                        } rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ 
                          duration: 1.5, 
                          delay: index * 0.2 + 1,
                          type: "spring",
                          stiffness: 100
                        }}
                      />
                    </motion.div>
                    
                    <motion.div 
                      className="mt-2 text-xs text-gray-700 text-center font-semibold"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.2 + 1.5 }}
                    >
                      8 semanas intensivas
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Phase transition visual */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span>🎯 Básico</span>
              <ArrowRight className="w-4 h-4" />
              <span>🚀 Intermedio</span>
              <ArrowRight className="w-4 h-4" />
              <span>💼 Avanzado</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { end: 24, suffix: "", color: "text-blue-400", label: "Semanas de contenido", icon: "📅", delay: 0 },
              { end: 1200, suffix: "", color: "text-green-400", label: "Términos en 12 categorías", icon: "📚", delay: 0.2 },
              { end: 60, suffix: "", color: "text-purple-400", label: "Minutos diarios", icon: "⏱️", delay: 0.4 },
              { end: 100, suffix: "%", color: "text-orange-400", label: "Recursos gratuitos", icon: "🎁", delay: 0.6 }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: stat.delay }}
                whileHover={{ scale: 1.1, y: -10 }}
              >
                <motion.div
                  className="text-5xl mb-4"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: stat.delay }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div 
                  className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}
                  whileHover={{ scale: 1.2 }}
                >
                  <AnimatedCounter end={stat.end} duration={2} suffix={stat.suffix} />
                </motion.div>
                <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white relative overflow-hidden">
        {/* Animated background effects */}
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            backgroundImage: [
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Floating stars */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Sparkles className="h-4 w-4 text-yellow-300" />
          </motion.div>
        ))}

        <div className="container max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Badge variant="secondary" className="mb-4 bg-yellow-400 text-purple-900 border-0 px-4 py-2 text-sm font-bold shadow-lg">
                <MessageSquare className="h-4 w-4 mr-2 inline" />
                Incluye Tutor AI Avanzado
              </Badge>
            </motion.div>
          </motion.div>

          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            animate={{ 
              textShadow: [
                "0 0 20px rgba(255,255,255,0.3)",
                "0 0 40px rgba(255,255,255,0.6)",
                "0 0 20px rgba(255,255,255,0.3)"
              ]
            }}
            style={{ textShadow: "0 0 30px rgba(255,255,255,0.5)" }}
          >
            Comienza Tu Transformación Hoy
          </motion.h2>

          <motion.p 
            className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Únete a cientos de profesionales que ya están dominando el inglés profesional 
            con nuestro plan estructurado y el Tutor AI disponible 24/7
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/auth/register">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  y: [0, -10, 0],
                  boxShadow: [
                    "0 20px 50px rgba(255,255,255,0.3)",
                    "0 30px 60px rgba(255,255,255,0.5)",
                    "0 20px 50px rgba(255,255,255,0.3)"
                  ]
                }}
                transition={{ 
                  y: { duration: 2, repeat: Infinity },
                  boxShadow: { duration: 2, repeat: Infinity }
                }}
              >
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-2xl text-lg px-8 py-6"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Empezar Gratis Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div 
            className="flex flex-wrap gap-4 justify-center text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {[
              { icon: CheckCircle, text: "Acceso inmediato al Tutor AI" },
              { icon: CheckCircle, text: "Plan de 6 meses completo" },
              { icon: CheckCircle, text: "100% gratis, sin tarjeta" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/20 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05, x: 5 }}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.text}
              </motion.div>
            ))}
          </motion.div>

          {/* Urgency indicator */}
          <motion.div
            className="mt-8 inline-flex items-center gap-2 text-yellow-300 font-semibold"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame className="h-5 w-5" />
            <span>¡Empieza hoy y alcanza tus metas en 6 meses!</span>
            <Flame className="h-5 w-5" />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-400 relative overflow-hidden">
        {/* Subtle animated background */}
        <motion.div 
          className="absolute inset-0 opacity-5"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ 
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="container max-w-6xl mx-auto text-center relative z-10">
          <motion.div 
            className="flex items-center justify-center space-x-2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <BookOpen className="h-6 w-6 text-blue-400" />
            </motion.div>
            <motion.span 
              className="text-lg font-semibold text-white"
              whileHover={{ scale: 1.05 }}
              animate={{ 
                color: [
                  "#ffffff",
                  "#60a5fa",
                  "#a78bfa",
                  "#ffffff"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              SpeaklyPlan
            </motion.span>
          </motion.div>
          <motion.p 
            className="text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            © 2024 SpeaklyPlan. Transformando profesionales a través del inglés.
          </motion.p>
          <motion.div
            className="mt-4 flex items-center justify-center gap-2 text-xs"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Sparkles className="h-3 w-3 text-yellow-400" />
            <span className="text-gray-500">Hecho con ❤️ para profesionales ambiciosos</span>
            <Sparkles className="h-3 w-3 text-yellow-400" />
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
