

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, Target, Users, BookOpen, TrendingUp, ArrowRight } from 'lucide-react'

export default function HomePage() {
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
          <div className="flex items-center space-x-4">
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
            Solo 1 hora diaria usando recursos 100% gratuitos.
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
              <div className="text-3xl font-bold text-green-400 mb-2">3000+</div>
              <div className="text-gray-400">Palabras y frases útiles</div>
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
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Comienza Tu Transformación Hoy
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Únete a cientos de profesionales que ya están dominando el inglés profesional
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Empezar Gratis Ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
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
