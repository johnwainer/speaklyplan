
'use client';

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getProfileImageUrl } from '@/lib/utils'
import { AppHeader } from '@/components/app-header'
import { 
  BookOpen, Target, Calendar, Library, TrendingUp, 
  Users, Clock, Lightbulb, CheckCircle2, XCircle, 
  Rocket, Award, MessageSquare, ArrowLeft,
  Smartphone, Youtube, Radio, Film, AlertCircle, 
  BarChart3, Zap, Heart, LogOut, User, Home,
  Play, ChevronRight, Brain, Star, Trophy, Flame,
  Check, Circle, MapPin, Monitor, Smartphone as Phone
} from 'lucide-react'

interface GuiaClientProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function GuiaClient({ user }: GuiaClientProps) {
  const { data: session } = useSession() || {};
  const router = useRouter()
  const currentUser = session?.user || user;
  
  // Estado para el tutorial interactivo
  const [tutorialStep, setTutorialStep] = useState(0)
  const [showTutorial, setShowTutorial] = useState(false)
  
  // Estado para el checklist
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, text: 'Explorar el Dashboard y ver las actividades de la Semana 1', completed: false },
    { id: 2, text: 'Descargar Duolingo y completar la primera lección', completed: false },
    { id: 3, text: 'Probar el AI Tutor con una conversación simple', completed: false },
    { id: 4, text: 'Probar la Práctica de Conversación con reconocimiento de voz', completed: false },
    { id: 5, text: 'Revisar el vocabulario de la semana actual', completed: false },
    { id: 6, text: 'Configurar tu horario diario de estudio (1 hora)', completed: false },
    { id: 7, text: 'Unirte a una comunidad de intercambio (HelloTalk/Reddit)', completed: false },
  ])
  
  // Estado para el quiz de nivel
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  
  // Estado para tarjetas flip
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  
  // Cargar estado del checklist del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('speaklyplan-checklist')
    if (saved) {
      setChecklistItems(JSON.parse(saved))
    }
  }, [])
  
  // Guardar checklist en localStorage
  const toggleChecklistItem = (id: number) => {
    const updated = checklistItems.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    )
    setChecklistItems(updated)
    localStorage.setItem('speaklyplan-checklist', JSON.stringify(updated))
  }
  
  const completedCount = checklistItems.filter(item => item.completed).length
  const progressPercentage = (completedCount / checklistItems.length) * 100
  
  // Tutorial steps
  const tutorialSteps = [
    {
      title: '¡Bienvenido a SpeaklyPlan! 🎉',
      description: 'Vamos a hacer un tour rápido de 2 minutos para que sepas cómo usar la plataforma.',
      icon: <Rocket className="h-12 w-12 text-blue-600" />,
      action: 'Dashboard'
    },
    {
      title: 'Dashboard: Tu Centro de Control 📊',
      description: 'Aquí verás tu progreso semanal, actividades diarias y estadísticas. Marca las actividades completadas para mantener tu racha.',
      icon: <Target className="h-12 w-12 text-green-600" />,
      action: 'AI Tutor'
    },
    {
      title: 'AI Tutor: Tu Profesor Personal 🤖',
      description: 'Practica conversación en inglés 24/7. El tutor te corrige, te da feedback y se adapta a tu nivel.',
      icon: <MessageSquare className="h-12 w-12 text-purple-600" />,
      action: 'Conversación'
    },
    {
      title: 'Práctica de Conversación: Mejora tu Pronunciación 🎤',
      description: 'Conversaciones interactivas en tiempo real con reconocimiento de voz, análisis detallado y gamificación. 5 modos diferentes para practicar.',
      icon: <Phone className="h-12 w-12 text-emerald-600" />,
      action: 'Vocabulario'
    },
    {
      title: 'Vocabulario: Palabras Clave 📚',
      description: 'Aprende vocabulario profesional organizado por categorías. Marca las palabras que dominas.',
      icon: <BookOpen className="h-12 w-12 text-orange-600" />,
      action: 'Recursos'
    },
    {
      title: 'Recursos: Tu Biblioteca Gratuita 🎓',
      description: 'Accede a más de 60 recursos gratuitos: apps, podcasts, canales de YouTube y más.',
      icon: <Library className="h-12 w-12 text-pink-600" />,
      action: 'Comenzar'
    },
  ]
  
  // Quiz questions
  const quizQuestions = [
    {
      question: '¿Cuál es tu nivel actual de inglés?',
      options: ['Principiante (A1-A2)', 'Intermedio (B1-B2)', 'Avanzado (C1-C2)'],
      scores: [10, 20, 30]
    },
    {
      question: '¿Puedes mantener una conversación básica en inglés?',
      options: ['No, apenas entiendo', 'Con dificultad', 'Sí, con pausas', 'Sí, fluido'],
      scores: [5, 10, 15, 25]
    },
    {
      question: '¿Entiendes podcasts o videos en inglés?',
      options: ['Casi nada', 'Solo con subtítulos', 'Parcialmente', 'Sí, sin problemas'],
      scores: [5, 10, 15, 25]
    },
    {
      question: '¿Cuánto tiempo puedes dedicar al día?',
      options: ['30 min', '1 hora', '2+ horas'],
      scores: [10, 20, 30]
    }
  ]
  
  const toggleFlipCard = (index: number) => {
    setFlippedCards(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }
  
  const flipCards = [
    {
      front: '¿Cuánto tiempo toma ver resultados?',
      back: 'Con 1 hora diaria, notarás mejoras significativas en 4-6 semanas. La fluidez profesional llega en 4-6 meses.'
    },
    {
      front: '¿Necesito pagar por algo?',
      back: 'No. Todo el plan usa recursos 100% gratuitos. Solo necesitas dedicación y constancia.'
    },
    {
      front: '¿Qué pasa si pierdo días?',
      back: 'No pasa nada. Retoma donde lo dejaste. La constancia a largo plazo es más importante que la perfección diaria.'
    },
    {
      front: '¿Cómo sé si estoy progresando?',
      back: 'El dashboard muestra tu progreso semanal, racha y actividades completadas. También puedes grabarte hablando cada mes para comparar.'
    },
    {
      front: '¿El AI Tutor reemplaza un profesor real?',
      back: 'Es un complemento excelente para practicar 24/7, pero combínalo con intercambios reales en HelloTalk o iTalki para mejores resultados.'
    },
    {
      front: '¿Qué nivel alcanzaré en 6 meses?',
      back: 'Con dedicación constante, llegarás a un B2 (intermedio-alto): suficiente para trabajar en inglés profesionalmente.'
    },
  ]

  const sections = [
    {
      id: "intro",
      icon: <BookOpen className="h-6 w-6" />,
      title: "Bienvenido a tu Transformación",
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            Este plan te llevará de nivel básico a comunicarte con confianza en inglés profesional, 
            usando <strong>solo recursos gratuitos</strong> y dedicando <strong>1 hora diaria</strong>.
          </p>
          <div className="bg-primary/10 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🎯 En 6 meses serás capaz de:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Participar activamente en reuniones de trabajo en inglés</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Presentar ideas y proyectos con claridad</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Comunicarte efectivamente con colegas internacionales</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Participar en eventos y conferencias profesionales</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Consumir contenido profesional sin dificultad</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "method",
      icon: <Target className="h-6 w-6" />,
      title: "Las 3 Fases del Método",
      content: (
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-bold text-lg mb-2">📚 FASE 1: Fundación Sólida (Mes 1-2)</h4>
            <p className="mb-2">El objetivo es construir tu base de vocabulario y gramática esencial.</p>
            <ul className="space-y-1 text-sm">
              <li>• Aprender 2,000 palabras más comunes del inglés</li>
              <li>• Dominar tiempos verbales esenciales</li>
              <li>• Desarrollar oído para el idioma</li>
              <li>• Construir el hábito diario de estudio</li>
            </ul>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-bold text-lg mb-2">🚀 FASE 2: Construcción Activa (Mes 3-4)</h4>
            <p className="mb-2">Aquí empiezas a USAR el inglés activamente en contextos reales.</p>
            <ul className="space-y-1 text-sm">
              <li>• Hablar con nativos vía intercambio</li>
              <li>• Consumir contenido técnico en inglés</li>
              <li>• Escribir regularmente (journaling, posts)</li>
              <li>• Pensar en inglés durante el día</li>
            </ul>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-bold text-lg mb-2">💼 FASE 3: Dominio Profesional (Mes 5-6)</h4>
            <p className="mb-2">El enfoque final es pulir tu inglés para contextos profesionales específicos.</p>
            <ul className="space-y-1 text-sm">
              <li>• Vocabulario técnico de tu industria</li>
              <li>• Simulaciones de presentaciones y meetings</li>
              <li>• Networking en comunidades internacionales</li>
              <li>• Preparación para certificaciones (opcional)</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "start",
      icon: <Rocket className="h-6 w-6" />,
      title: "Cómo Empezar",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Abre tu dashboard y ve a la Semana 1
            </h4>
            <p className="text-sm ml-8">Verás las actividades de Lunes a Domingo perfectamente organizadas.</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Dedica 1 hora al día (idealmente en la mañana)
            </h4>
            <p className="text-sm ml-8">La constancia es más importante que la perfección. 1 hora diaria {'>'} 7 horas el domingo.</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              Marca las actividades como completadas
            </h4>
            <p className="text-sm ml-8">Esto te ayudará a mantener tu racha y motivación. ¡Celebra cada victoria pequeña!</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
              No te saltes días
            </h4>
            <p className="text-sm ml-8">Si un día no puedes hacer la hora completa, haz al menos 20 minutos. Mantener el hábito es clave.</p>
          </div>
        </div>
      )
    },
    {
      id: "resources",
      icon: <Library className="h-6 w-6" />,
      title: "Recursos Recomendados (100% Gratuitos)",
      content: (
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-blue-600" />
              Apps Esenciales
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between items-start">
                <span>• <strong>Duolingo:</strong> Para vocabulario y práctica diaria</span>
                <span className="text-xs text-gray-500">Básico-Intermedio</span>
              </li>
              <li className="flex justify-between items-start">
                <span>• <strong>Anki:</strong> Sistema de repetición espaciada para memorizar</span>
                <span className="text-xs text-gray-500">Todos los niveles</span>
              </li>
              <li className="flex justify-between items-start">
                <span>• <strong>HelloTalk:</strong> Intercambio de idiomas con nativos</span>
                <span className="text-xs text-gray-500">Intermedio+</span>
              </li>
              <li className="flex justify-between items-start">
                <span>• <strong>ELSA Speak:</strong> Mejora tu pronunciación con IA</span>
                <span className="text-xs text-gray-500">Todos los niveles</span>
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-600" />
              Canales de YouTube
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• <strong>EnglishClass101:</strong> Lecciones estructuradas</li>
              <li>• <strong>Learn English with TV Series:</strong> Aprende con tus series favoritas</li>
              <li>• <strong>TED-Ed:</strong> Contenido educativo e interesante</li>
              <li>• <strong>Canales tech en inglés:</strong> Fireship, ThePrimeagen, Traversy Media</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Radio className="h-5 w-5 text-purple-600" />
              Podcasts
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• <strong>The English We Speak (BBC):</strong> Frases del día a día</li>
              <li>• <strong>All Ears English:</strong> Conversaciones naturales</li>
              <li>• <strong>Podcasts tech:</strong> Syntax.fm, The Changelog, Software Engineering Daily</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Film className="h-5 w-5 text-green-600" />
              Contenido para Consumir
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Series/Películas:</strong> Primero con subs español, luego inglés, luego sin subs</li>
              <li>• <strong>Documentales técnicos:</strong> Netflix, YouTube Premium trials</li>
              <li>• <strong>Twitch streams en inglés:</strong> Programadores, tech talks</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "habits",
      icon: <Clock className="h-6 w-6" />,
      title: "Hábitos Diarios que Transforman",
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <h4 className="font-bold mb-2">⏰ Rutina de 1 Hora Ideal</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>15 min:</strong> Duolingo/Anki (vocabulario)</li>
              <li>• <strong>20 min:</strong> Ejercicio del día (gramática, listening, etc.)</li>
              <li>• <strong>15 min:</strong> Shadowing (repetir audios)</li>
              <li>• <strong>10 min:</strong> Journaling en inglés</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold mb-2">🔄 Micro-hábitos durante el día</h4>
            <ul className="space-y-2 text-sm">
              <li>• Cambia tu celular y apps a inglés</li>
              <li>• Escucha podcasts camino al trabajo</li>
              <li>• Lee noticias tech en inglés en el desayuno</li>
              <li>• Piensa tus to-dos en inglés</li>
              <li>• Comenta en GitHub/Twitter en inglés</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-bold mb-2">🎯 Hábito de oro: Active Recall</h4>
            <p className="text-sm mb-2">
              No solo consumas inglés, ÚSALO activamente. Habla solo en inglés por 5 minutos al día,
              grábate, escúchate. Es incómodo al principio, pero es el método más efectivo.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "success",
      icon: <Zap className="h-6 w-6" />,
      title: "Claves del Éxito",
      content: (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Constancia sobre intensidad:</strong> 1 hora al día por 6 meses {'>'} 10 horas un día
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Inmersión total:</strong> Rodéate de inglés. Cambia idioma de dispositivos, consume solo contenido en inglés
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Habla desde el día 1:</strong> No esperes a "estar listo". Habla con errores, grábate, practica con IA
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Enfoque {'>'} cantidad:</strong> Mejor dominar 2,000 palabras que conocer superficialmente 10,000
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Celebra victorias pequeñas:</strong> Cada actividad completada es un paso más cerca de tu meta
            </div>
          </div>
        </div>
      )
    },
    {
      id: "expectations",
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Expectativas Realistas",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Mes 1-2: Fundación</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Entenderás frases básicas y tendrás 2,000+ palabras
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                NO esperarás tener conversaciones fluidas todavía
              </li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Mes 3-4: Despegue</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Podrás tener conversaciones básicas con pausas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Entenderás podcasts y videos con contexto
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                NO esperarás debates complejos sin preparación
              </li>
            </ul>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Mes 5-6: Profesional</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Participarás en reuniones profesionales con confianza
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Presentarás ideas sin traducir mentalmente
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Consumirás contenido profesional sin esfuerzo
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="text-sm">
              <strong>Importante:</strong> El inglés es una maratón, no un sprint. Estos 6 meses te dan
              una base profesional sólida, pero la maestría viene con años de práctica continua.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "troubleshooting",
      icon: <AlertCircle className="h-6 w-6" />,
      title: "Problemas Comunes y Soluciones",
      content: (
        <div className="space-y-4">
          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-bold mb-2">❌ "No tengo tiempo"</h4>
            <p className="text-sm mb-2">
              <strong>Solución:</strong> No necesitas 1 hora de corrido. Usa micro-momentos:
            </p>
            <ul className="text-sm space-y-1">
              <li>• 15 min en Duolingo mientras desayunas</li>
              <li>• 20 min de podcast camino al trabajo</li>
              <li>• 15 min de shadowing antes de dormir</li>
              <li>• 10 min de journaling en tu break</li>
            </ul>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-bold mb-2">❌ "Me da vergüenza hablar"</h4>
            <p className="text-sm">
              <strong>Solución:</strong> Empieza hablando solo. Grábate con tu celular describiendo tu día.
              Luego usa apps de IA (ChatGPT voz, ELSA) antes de hablar con humanos. Todo el mundo empieza mal.
            </p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4">
            <h4 className="font-bold mb-2">❌ "Rompí mi racha"</h4>
            <p className="text-sm">
              <strong>Solución:</strong> No te obsesiones con la perfección. Si pierdes un día, retoma al siguiente.
              Lo importante es el progreso a largo plazo, no la perfección diaria.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-bold mb-2">❌ "No veo progreso"</h4>
            <p className="text-sm">
              <strong>Solución:</strong> El progreso es invisible al principio. Grábate hablando en semana 1,
              luego en semana 12. La diferencia te sorprenderá. Confía en el proceso.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-bold mb-2">❌ "Este plan no es para mí"</h4>
            <p className="text-sm">
              <strong>Solución:</strong> Adapta el plan a tu estilo. Si prefieres más conversación, reduce
              gramática y aumenta intercambios. Si eres visual, usa más videos. El plan es una guía, no una biblia.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "motivation",
      icon: <Heart className="h-6 w-6" />,
      title: "Tu Why - Nunca lo Olvides",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h4 className="font-bold text-lg mb-4">¿Por qué estás haciendo esto?</h4>
            <p className="mb-4">
              Escribe tu razón personal aquí (en tu mente o en un papel que veas todos los días):
            </p>
            <div className="bg-white p-4 rounded border-2 border-dashed min-h-[100px] text-gray-500 italic">
              Ejemplo: "Quiero trabajar en una empresa internacional", "Aspiro a comunicarme con clientes extranjeros",
              "Necesito presentar proyectos en inglés", "Quiero expandir mis oportunidades laborales"...
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <h4 className="font-bold mb-2">💡 Recuerda en los días difíciles:</h4>
            <ul className="space-y-2 text-sm">
              <li>• El inglés no es un don, es una habilidad que SE CONSTRUYE</li>
              <li>• Millones de personas lo han logrado antes que tú</li>
              <li>• Cada día de práctica es una inversión en tu futuro</li>
              <li>• El mejor momento para empezar fue hace 6 meses. El segundo mejor momento es HOY</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg text-center">
            <Rocket className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-2xl font-bold mb-2">Tu transformación empieza hoy</h3>
            <p className="text-lg">
              En 6 meses, mirarás atrás y te sentirás orgulloso de haber tomado esta decisión.
            </p>
            <p className="mt-4 font-semibold text-blue-600">
              ¡Vamos con todo! 🚀
            </p>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <AppHeader currentSection="guia" />

      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="my-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          {/* Hero Section */}
          <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3 flex-wrap">
                <Rocket className="h-8 w-8 text-blue-600" />
                <span>Guía Interactiva de Uso</span>
              </CardTitle>
              <p className="text-center text-muted-foreground mt-2">
                Domina el inglés en 6 meses con nuestra metodología probada
              </p>
            </CardHeader>
          </Card>

          {/* Tutorial Modal */}
          {showTutorial && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        {tutorialSteps[tutorialStep].icon}
                        <div>
                          <CardTitle className="text-2xl">{tutorialSteps[tutorialStep].title}</CardTitle>
                          <Badge variant="secondary" className="mt-2">
                            Paso {tutorialStep + 1} de {tutorialSteps.length}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTutorial(false)}
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-6">{tutorialSteps[tutorialStep].description}</p>
                  
                  <Progress value={(tutorialStep / (tutorialSteps.length - 1)) * 100} className="mb-6" />
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
                      disabled={tutorialStep === 0}
                    >
                      Anterior
                    </Button>
                    
                    {tutorialStep < tutorialSteps.length - 1 ? (
                      <Button onClick={() => setTutorialStep(tutorialStep + 1)}>
                        Siguiente
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setShowTutorial(false)
                          setTutorialStep(0)
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        ¡Comenzar!
                        <Rocket className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Tabs */}
          <Tabs defaultValue="inicio" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2">
              <TabsTrigger value="inicio" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                <span className="hidden sm:inline">Inicio Rápido</span>
                <span className="sm:hidden">Inicio</span>
              </TabsTrigger>
              <TabsTrigger value="metodo" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Metodología</span>
                <span className="sm:hidden">Método</span>
              </TabsTrigger>
              <TabsTrigger value="recursos" className="flex items-center gap-2">
                <Library className="h-4 w-4" />
                <span>Recursos</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span>FAQ</span>
              </TabsTrigger>
              <TabsTrigger value="motivacion" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Motivación</span>
                <span className="sm:hidden">Tips</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab: Inicio Rápido */}
            <TabsContent value="inicio" className="space-y-6">
              {/* Tutorial Button */}
              <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-bold mb-2">¿Primera vez aquí? 🚀</h3>
                      <p className="text-blue-100">
                        Toma un tour interactivo de 2 minutos y descubre cómo funciona la plataforma
                      </p>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => setShowTutorial(true)}
                      className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Iniciar Tour
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Checklist de Primeros Pasos */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      Checklist de Primeros Pasos
                    </CardTitle>
                    <Badge variant="secondary" className="text-lg">
                      {completedCount}/{checklistItems.length}
                    </Badge>
                  </div>
                  <Progress value={progressPercentage} className="mt-4" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {checklistItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        item.completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => toggleChecklistItem(item.id)}
                    >
                      <div className="mt-0.5">
                        {item.completed ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                  
                  {completedCount === checklistItems.length && (
                    <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg text-center border-2 border-green-200">
                      <Trophy className="h-12 w-12 mx-auto mb-3 text-yellow-500" />
                      <h4 className="text-xl font-bold text-green-900 mb-2">
                        ¡Felicitaciones! 🎉
                      </h4>
                      <p className="text-green-800">
                        Has completado todos los pasos iniciales. ¡Estás listo para comenzar tu viaje!
                      </p>
                      <Button
                        className="mt-4 bg-green-600 hover:bg-green-700"
                        onClick={() => router.push('/dashboard')}
                      >
                        Ir al Dashboard
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mapa de la Plataforma */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-blue-600" />
                    Mapa de la Plataforma
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div
                      className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => router.push('/dashboard')}
                    >
                      <Target className="h-8 w-8 text-blue-600 mb-3" />
                      <h4 className="font-bold text-lg mb-2">Dashboard</h4>
                      <p className="text-sm text-gray-700 mb-4">
                        Tu centro de control. Ve tu progreso, semana actual y actividades diarias.
                      </p>
                      <Badge variant="secondary">Centro de Control</Badge>
                    </div>
                    
                    <div
                      className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => router.push('/tutor')}
                    >
                      <MessageSquare className="h-8 w-8 text-purple-600 mb-3" />
                      <h4 className="font-bold text-lg mb-2">AI Tutor</h4>
                      <p className="text-sm text-gray-700 mb-4">
                        Practica conversación 24/7. Recibe correcciones y feedback instantáneo.
                      </p>
                    </div>
                    
                    <div
                      className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => router.push('/vocabulario')}
                    >
                      <BookOpen className="h-8 w-8 text-green-600 mb-3" />
                      <h4 className="font-bold text-lg mb-2">Vocabulario</h4>
                      <p className="text-sm text-gray-700 mb-4">
                        2,000+ palabras profesionales organizadas por categorías.
                      </p>
                      <Badge variant="secondary">Aprendizaje</Badge>
                    </div>
                    
                    <div
                      className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => router.push('/recursos')}
                    >
                      <Library className="h-8 w-8 text-orange-600 mb-3" />
                      <h4 className="font-bold text-lg mb-2">Recursos</h4>
                      <p className="text-sm text-gray-700 mb-4">
                        60+ recursos gratuitos: apps, podcasts, canales y más.
                      </p>
                      <Badge variant="secondary">Biblioteca</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Metodología */}
            <TabsContent value="metodo" className="space-y-6">
              <Accordion type="single" collapsible defaultValue="intro" className="space-y-4">
                {sections.map((section) => (
                  <AccordionItem 
                    key={section.id} 
                    value={section.id}
                    className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center gap-3 text-left">
                        <div className="flex-shrink-0 text-blue-600">
                          {section.icon}
                        </div>
                        <span className="font-semibold text-lg">{section.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 bg-gray-50/50">
                      {section.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            {/* Tab: Recursos */}
            <TabsContent value="recursos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Recursos Categorizados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sections.find(s => s.id === 'resources')?.content}
                  </div>
                  <div className="mt-6 text-center">
                    <Button
                      size="lg"
                      onClick={() => router.push('/recursos')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Library className="mr-2 h-5 w-5" />
                      Ver Todos los Recursos (60+)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: FAQ - Tarjetas Flip */}
            <TabsContent value="faq" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-yellow-500" />
                    Preguntas Frecuentes
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Haz clic en cualquier tarjeta para ver la respuesta
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {flipCards.map((card, index) => (
                      <div
                        key={index}
                        className="relative h-48 cursor-pointer perspective"
                        onClick={() => toggleFlipCard(index)}
                      >
                        <div
                          className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${
                            flippedCards.includes(index) ? '[transform:rotateY(180deg)]' : ''
                          }`}
                        >
                          {/* Front */}
                          <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 flex items-center justify-center text-center text-white shadow-lg">
                            <div>
                              <Lightbulb className="h-8 w-8 mx-auto mb-3" />
                              <p className="text-lg font-semibold">{card.front}</p>
                              <p className="text-sm mt-2 text-blue-100">Clic para ver respuesta</p>
                            </div>
                          </div>
                          {/* Back */}
                          <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] bg-gradient-to-br from-green-500 to-blue-600 rounded-lg p-6 flex items-center justify-center text-center text-white shadow-lg">
                            <div>
                              <CheckCircle2 className="h-8 w-8 mx-auto mb-3" />
                              <p className="text-sm">{card.back}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Troubleshooting */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-orange-500" />
                    Solución de Problemas Comunes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sections.find(s => s.id === 'troubleshooting')?.content}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Motivación */}
            <TabsContent value="motivacion" className="space-y-6">
              {/* Expectativas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                    Expectativas Realistas por Mes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sections.find(s => s.id === 'expectations')?.content}
                </CardContent>
              </Card>

              {/* Claves del Éxito */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Zap className="h-6 w-6 text-yellow-500" />
                    Claves del Éxito
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sections.find(s => s.id === 'success')?.content}
                </CardContent>
              </Card>

              {/* Tu Why */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Heart className="h-6 w-6 text-red-500" />
                    Tu Motivación Personal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sections.find(s => s.id === 'motivation')?.content}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Footer CTA */}
          <Card className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <Rocket className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-4">¿Listo para tu transformación?</h3>
              <p className="mb-6 text-blue-100 text-lg max-w-2xl mx-auto">
                Recuerda: La constancia vence al talento. 1 hora al día durante 6 meses cambiará tu vida profesional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg"
                  onClick={() => router.push('/dashboard')}
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Ir al Dashboard
                </Button>
                <Button 
                  size="lg"
                  onClick={() => router.push('/tutor')}
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Probar AI Tutor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
