
"use client";

import { useState } from "react";
import { 
  BookOpen, Target, Calendar, Library, TrendingUp, 
  Users, Clock, Lightbulb, CheckCircle2, XCircle, 
  Rocket, Award, MessageSquare, ChevronDown, ChevronRight,
  Smartphone, Youtube, Radio, Film, AlertCircle, 
  BarChart3, Zap, Heart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function GuiaPage() {
  const [expandedSection, setExpandedSection] = useState<string>("intro");

  const sections = [
    {
      id: "intro",
      icon: <BookOpen className="h-6 w-6" />,
      title: "Bienvenido a tu Transformación",
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            Este plan te llevará de nivel básico a comunicarte con confianza como CTO en inglés, 
            usando <strong>solo recursos gratuitos</strong> y dedicando <strong>1 hora diaria</strong>.
          </p>
          <div className="bg-primary/10 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🎯 En 6 meses serás capaz de:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Liderar reuniones técnicas en inglés con confianza</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Presentar a boards e investors sin nervios</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Negociar con vendors internacionales</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Networking en conferencias globales</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Entrevistar para posiciones CTO en empresas internacionales</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "fases",
      icon: <Target className="h-6 w-6" />,
      title: "Las 3 Fases del Método 1%",
      content: (
        <div className="space-y-6">
          <Card className="border-gray-300">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <span className="bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                Fase 1: Catarsis (Semanas 1-8)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="font-semibold text-gray-700 mb-3">Objetivo: Romper barreras mentales y hablar desde el día 1</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <span>Perder el miedo a hablar</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <span>500-1000 palabras básicas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <span>Conversaciones de 2-7 minutos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <span>Ganar confianza inicial</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <p className="text-sm font-semibold">Entregable:</p>
                <p className="text-sm">Video de presentación personal de 3 minutos</p>
              </div>
              <div className="mt-2 p-3 bg-purple-50 rounded border border-purple-200">
                <p className="text-sm italic">&quot;No importa si cometo errores. Lo importante es HABLAR.&quot;</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-300">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                Fase 2: Speaking Mínimo Viable (Semanas 9-16)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="font-semibold text-blue-700 mb-3">Objetivo: Estructurar ideas complejas con claridad</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>1500+ palabras técnicas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Presentaciones de 5-10 minutos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Argumentación lógica</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Participar en debates técnicos</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-blue-100 rounded">
                <p className="text-sm font-semibold">Entregable:</p>
                <p className="text-sm">Presentación técnica de 10 minutos sobre arquitectura</p>
              </div>
              <div className="mt-2 p-3 bg-purple-50 rounded border border-purple-200">
                <p className="text-sm italic">&quot;Puedo explicar ideas complejas de forma clara y estructurada.&quot;</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-300">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2">
                <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
                Fase 3: Playbook for JTBD (Semanas 17-24)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="font-semibold text-green-700 mb-3">Objetivo: Dominar inglés profesional como CTO</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>2000+ vocabulario ejecutivo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Liderar reuniones de 30+ minutos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Negociaciones exitosas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Networking internacional</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-green-100 rounded">
                <p className="text-sm font-semibold">Entregable:</p>
                <p className="text-sm">Simulación completa de Board Meeting + Investor Pitch</p>
              </div>
              <div className="mt-2 p-3 bg-purple-50 rounded border border-purple-200">
                <p className="text-sm italic">&quot;Soy un CTO que comunica con confianza y precisión en inglés.&quot;</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: "primeros-pasos",
      icon: <Rocket className="h-6 w-6" />,
      title: "Cómo Empezar - Primeros 7 Días",
      content: (
        <div className="space-y-4">
          <Card className="border-orange-300 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Calendar className="h-5 w-5" />
                Día 1: Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Lee el plan completo en el dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Descarga apps esenciales: Duolingo, ELSA Speak, HelloTalk</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Configura tu teléfono en inglés</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Únete a r/EnglishLearning en Reddit</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Crea cuenta en ChatGPT (si no tienes)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Calendar className="h-5 w-5" />
                Días 2-7: Primeros Pasos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Sigue el plan semanal detallado (Semana 1)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Practica tu presentación personal básica</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Aprende tus primeras 20 palabras técnicas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Ten tu primera conversación (aunque sea con ChatGPT)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Completa tu primer registro de progreso</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: "recursos",
      icon: <Library className="h-6 w-6" />,
      title: "Recursos y Herramientas",
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                ChatGPT - Tu Tutor 24/7
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4 text-sm text-gray-600">ChatGPT es tu mejor recurso gratuito. Úsalo para:</p>
              <div className="grid gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-sm mb-1">Para Conversación:</p>
                  <p className="text-sm text-gray-600 italic">
                    &quot;Let&apos;s have a conversation. You are my colleague, and we&apos;re discussing our upcoming sprint planning...&quot;
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-sm mb-1">Para Feedback:</p>
                  <p className="text-sm text-gray-600 italic">
                    &quot;I&apos;m going to write a paragraph in English. Please give me detailed feedback...&quot;
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-semibold text-sm mb-1">Para Role-Play:</p>
                  <p className="text-sm text-gray-600 italic">
                    &quot;Let&apos;s do a role-play. You are the CEO, and I&apos;m the CTO presenting...&quot;
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Smartphone className="h-5 w-5" />
                  Apps Recomendadas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  <li>
                    <p className="font-semibold text-sm">Duolingo (15 min/día)</p>
                    <p className="text-xs text-gray-600">Warm-up matutino, 1 lección mínimo</p>
                  </li>
                  <li>
                    <p className="font-semibold text-sm">ELSA Speak (10 min/día)</p>
                    <p className="text-xs text-gray-600">Pronunciación y palabras técnicas</p>
                  </li>
                  <li>
                    <p className="font-semibold text-sm">HelloTalk/Tandem (20-30 min, 2-3x/semana)</p>
                    <p className="text-xs text-gray-600">Language partners reales</p>
                  </li>
                  <li>
                    <p className="font-semibold text-sm">BBC Learning English</p>
                    <p className="text-xs text-gray-600">Lecciones estructuradas</p>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Youtube className="h-5 w-5" />
                  YouTube & Podcasts
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-sm mb-1">Canales Tech:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Tech Lead</li>
                      <li>• Y Combinator</li>
                      <li>• Google Developers</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1">Podcasts:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Syntax.fm (Developer conversations)</li>
                      <li>• Tech Stuff (Tech news)</li>
                      <li>• 6 Minute English (Daily lessons)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2 text-base">
                <Film className="h-5 w-5" />
                Series y Películas Recomendadas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-sm mb-2">Para Tech:</p>
                  <ul className="space-y-1 text-sm">
                    <li>⭐⭐⭐⭐⭐ Silicon Valley</li>
                    <li>⭐⭐⭐⭐⭐ Mr. Robot</li>
                    <li>⭐⭐⭐⭐⭐ The Social Network</li>
                    <li>⭐⭐⭐⭐ Steve Jobs</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-2">Para Business:</p>
                  <ul className="space-y-1 text-sm">
                    <li>⭐⭐⭐⭐⭐ Billions</li>
                    <li>⭐⭐⭐⭐⭐ Succession</li>
                    <li>⭐⭐⭐⭐ The Big Short</li>
                    <li>⭐⭐⭐⭐ Moneyball</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm">
                  <Lightbulb className="h-4 w-4 inline mr-1" />
                  <strong>Tip:</strong> Semana 1-4 usa subtítulos en inglés. Semana 5+ quítalos gradualmente.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: "habitos",
      icon: <Clock className="h-6 w-6" />,
      title: "Hábitos Diarios para el Éxito",
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-yellow-300">
              <CardHeader className="bg-yellow-50">
                <CardTitle className="text-base">☀️ Rutina Matutina (15 min)</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Radio className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>Podcast mientras te preparas (5 min)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BookOpen className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>Noticias tech en inglés (5 min)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>Práctica de pronunciación (5 min)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-300">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-base">💪 Práctica Activa (30 min)</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Conversación con ChatGPT (10 min)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Youtube className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Shadowing de videos (10 min)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Diario técnico (5 min)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Library className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Flashcards vocabulario (5 min)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-300">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-base">🎧 Inmersión Pasiva (15 min)</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Radio className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Podcast tech (10 min)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Youtube className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Video corto YouTube (5 min)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-green-300 bg-green-50">
            <CardHeader>
              <CardTitle className="text-base">✅ Checklist Semanal</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Teléfono configurado en inglés</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>1 conversación con language partner</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>1 película/serie tech</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Participación en comunidad online</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Auto-grabación y feedback</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Revisión dominical del progreso</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: "claves",
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Claves para el Éxito",
      content: (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-green-300">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Lo Que DEBES Hacer
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                <li>
                  <p className="font-semibold text-sm">1. Consistencia es Rey</p>
                  <p className="text-xs text-gray-600">1 hora diaria es MEJOR que 7 horas los domingos</p>
                </li>
                <li>
                  <p className="font-semibold text-sm">2. Habla desde el Día 1</p>
                  <p className="text-xs text-gray-600">No esperes a &quot;estar listo&quot;. Habla con ChatGPT, grabadora, espejo</p>
                </li>
                <li>
                  <p className="font-semibold text-sm">3. Inmersión Total</p>
                  <p className="text-xs text-gray-600">Cambia TODO a inglés: teléfono, apps, Netflix</p>
                </li>
                <li>
                  <p className="font-semibold text-sm">4. Usa lo que Aprendes</p>
                  <p className="text-xs text-gray-600">Aplica nuevas palabras el mismo día</p>
                </li>
                <li>
                  <p className="font-semibold text-sm">5. Mide tu Progreso</p>
                  <p className="text-xs text-gray-600">Completa tu registro cada domingo</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-red-300">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center gap-2 text-base">
                <XCircle className="h-5 w-5 text-red-600" />
                Lo Que DEBES Evitar
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                <li>
                  <p className="font-semibold text-sm">1. No Traducir Mentalmente</p>
                  <p className="text-xs text-gray-600">Piensa directamente en inglés</p>
                </li>
                <li>
                  <p className="font-semibold text-sm">2. No Buscar Perfección</p>
                  <p className="text-xs text-gray-600">&quot;Done is better than perfect&quot;</p>
                </li>
                <li>
                  <p className="font-semibold text-sm">3. No Saltarte los Domingos</p>
                  <p className="text-xs text-gray-600">La revisión semanal es CRÍTICA</p>
                </li>
                <li>
                  <p className="font-semibold text-sm">4. No Aislarte</p>
                  <p className="text-xs text-gray-600">Busca language partners y comunidades</p>
                </li>
                <li>
                  <p className="font-semibold text-sm">5. No Abandonar en el Valley of Despair</p>
                  <p className="text-xs text-gray-600">Semanas 4-6: es normal sentir que no avanzas</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: "expectativas",
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Expectativas Realistas por Mes",
      content: (
        <div className="space-y-3">
          {[
            {
              mes: 1,
              titulo: "Fundamentos",
              logros: [
                "Presentarte con confianza",
                "300-500 palabras básicas",
                "Conversaciones simples 2-3 min",
                "Perder el miedo inicial"
              ],
              sentimiento: 'Normal sentir que "no sabes nada aún"',
              color: "gray"
            },
            {
              mes: 2,
              titulo: "Fluidez Básica",
              logros: [
                "Describir tu trabajo y proyectos",
                "700-1000 palabras",
                "Conversaciones 5-7 min sin traducir",
                'Empezar a "pensar en inglés"'
              ],
              sentimiento: '"¡Estoy progresando!"',
              color: "blue"
            },
            {
              mes: 3,
              titulo: "Estructuración",
              logros: [
                "Explicar sistemas técnicos complejos",
                "1000-1300 palabras técnicas",
                "Presentaciones cortas 5 min",
                "Primeros debates técnicos"
              ],
              sentimiento: '"Puedo mantener conversaciones técnicas"',
              color: "indigo"
            },
            {
              mes: 4,
              titulo: "Argumentación",
              logros: [
                "Justificar decisiones técnicas",
                "1300-1700 palabras",
                "Reuniones de 15-20 min",
                "Discutir trade-offs con claridad"
              ],
              sentimiento: '"Me siento cómodo en reuniones"',
              color: "purple"
            },
            {
              mes: 5,
              titulo: "Simulaciones Reales",
              logros: [
                "Presentaciones a stakeholders",
                "1700-2000 palabras ejecutivas",
                "Liderar reuniones 30+ min",
                "Negociaciones básicas"
              ],
              sentimiento: '"Casi listo para el mundo real"',
              color: "pink"
            },
            {
              mes: 6,
              titulo: "Dominio CTO",
              logros: [
                "Board meetings con confianza",
                "2000+ vocabulario completo",
                "Networking internacional",
                "Entrevistas y pitches exitosos"
              ],
              sentimiento: '"SOY UN CTO QUE HABLA INGLÉS"',
              color: "green"
            }
          ].map((mes) => (
            <Card key={mes.mes} className={`border-${mes.color}-300`}>
              <CardHeader className={`bg-${mes.color}-50`}>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className={`bg-${mes.color}-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm`}>
                    {mes.mes}
                  </span>
                  Mes {mes.mes}: {mes.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-1 text-sm mb-3">
                  {mes.logros.map((logro, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className={`h-4 w-4 text-${mes.color}-600 mt-0.5 flex-shrink-0`} />
                      <span>{logro}</span>
                    </li>
                  ))}
                </ul>
                <div className={`p-2 bg-${mes.color}-100 rounded text-sm italic`}>
                  💭 {mes.sentimiento}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: "problemas",
      icon: <AlertCircle className="h-6 w-6" />,
      title: "Troubleshooting - Problemas Comunes",
      content: (
        <div className="space-y-4">
          {[
            {
              problema: '"No tengo tiempo"',
              solucion: [
                "Aprovecha 'dead time': gym, cocinar, trasladarte",
                "Podcasts mientras haces otras cosas",
                "Micro-sessions de 10 min 6x al día",
                "Reevalúa prioridades: ¿Cuánto tiempo en redes sociales?"
              ]
            },
            {
              problema: '"No progreso"',
              solucion: [
                "Grábate hoy. Grábate en 2 semanas. COMPARA.",
                "Revisa tus métricas: ¿Realmente practicas 7h/semana?",
                "El progreso no es lineal, es exponencial",
                "Semanas 4-8 son el 'valley of despair' = NORMAL"
              ]
            },
            {
              problema: '"No tengo con quién practicar"',
              solucion: [
                "ChatGPT = conversación ilimitada",
                "HelloTalk/Tandem = miles de partners",
                "Discord servers = comunidades activas",
                "Grábate y auto-evalúa"
              ]
            },
            {
              problema: '"Me da vergüenza hablar"',
              solucion: [
                "TODOS los no-nativos sienten esto",
                "Practica solo al inicio (ChatGPT, grabadora)",
                "Empieza con texto, luego voz",
                "Recuerda: Los nativos respetan a quien lo intenta"
              ]
            },
            {
              problema: '"No entiendo cuando hablan rápido"',
              solucion: [
                "YouTube: velocidad 0.75x al inicio",
                "Pide a language partners hablar más lento",
                "Necesitas 100+ horas de listening para adaptarte",
                "Es NORMAL en meses 1-3"
              ]
            },
            {
              problema: '"Olvido el vocabulario"',
              solucion: [
                "USA las palabras el mismo día que las aprendes",
                "Anki con spaced repetition",
                "Enseña las palabras a alguien más",
                "Flashcards con CONTEXTO, no solo traducción"
              ]
            }
          ].map((item, idx) => (
            <Card key={idx} className="border-orange-200">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  {item.problema}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="font-semibold text-sm mb-2 text-green-700">✅ Solución:</p>
                <ul className="space-y-1 text-sm">
                  {item.solucion.map((sol, sidx) => (
                    <li key={sidx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{sol}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: "motivacion",
      icon: <Heart className="h-6 w-6" />,
      title: "Motivación Final",
      content: (
        <div className="space-y-4">
          <Card className="border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="text-lg">💪 Recuerda Siempre</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/70 rounded-lg">
                <p className="font-semibold text-purple-900 mb-1">&quot;El inglés no es inteligencia, es exposición.&quot;</p>
                <p className="text-sm text-gray-600">Niños lo aprenden sin estudiar gramática. Tu cerebro está diseñado para esto.</p>
              </div>
              <div className="p-4 bg-white/70 rounded-lg">
                <p className="font-semibold text-purple-900 mb-1">&quot;Cada error es un paso hacia el éxito.&quot;</p>
                <p className="text-sm text-gray-600">Los nativos te respetan más cuando lo intentas. Perfección = enemigo del progreso.</p>
              </div>
              <div className="p-4 bg-white/70 rounded-lg">
                <p className="font-semibold text-purple-900 mb-1">&quot;1% mejor cada día = 37x mejor en 1 año.&quot;</p>
                <p className="text-sm text-gray-600">Método 1% compuesto = transformación. Pequeñas acciones diarias = grandes resultados.</p>
              </div>
              <div className="p-4 bg-white/70 rounded-lg">
                <p className="font-semibold text-purple-900 mb-1">&quot;Tu yo del futuro te agradecerá.&quot;</p>
                <p className="text-sm text-gray-600">CTO fluido en inglés = +40% oportunidades. Networking global = career transformation.</p>
              </div>
              <div className="p-4 bg-white/70 rounded-lg">
                <p className="font-semibold text-purple-900 mb-1">&quot;No eres malo en inglés, eres NUEVO en inglés.&quot;</p>
                <p className="text-sm text-gray-600">Cambio de mentalidad: de &quot;no puedo&quot; a &quot;todavía no puedo&quot;.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-300 bg-gradient-to-br from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Rocket className="h-6 w-6" />
                Último Mensaje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-base">
                  Estás a punto de empezar un viaje transformador. En 6 meses, serás capaz de comunicarte como CTO con confianza total en inglés.
                </p>
                <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
                  <p className="font-semibold mb-2">Esto NO es fácil. Pero ES posible.</p>
                  <p className="text-sm">Miles de profesionales lo han logrado antes que tú. El único requisito es: <strong>CONSISTENCIA</strong>.</p>
                </div>
                <div className="p-4 bg-red-100 border-l-4 border-red-500 rounded">
                  <p className="font-semibold mb-2">⚠️ No te rindas en las semanas 4-8</p>
                  <p className="text-sm">Ese es el punto donde el 80% abandona. Pero <strong>TÚ NO ERES EL 80%</strong>.</p>
                </div>
                <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-center">
                  <p className="text-xl font-bold mb-2">&quot;The best time to plant a tree was 20 years ago.</p>
                  <p className="text-xl font-bold mb-4">The second best time is now.&quot;</p>
                  <p className="text-lg">HOY es tu Día 1.</p>
                  <p className="text-lg mb-4">En 180 días, serás un CTO bilingüe.</p>
                  <p className="text-2xl font-bold">¡VAMOS! 💪🚀</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-300 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                Comunidad y Soporte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm">¿Necesitas motivación extra? Únete a estas comunidades:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>r/EnglishLearning (Reddit)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Discord: &quot;English Learning&quot; servers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Facebook: Grupos de inglés para profesionales</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>LinkedIn: Comparte tu progreso con #100DaysOfEnglish</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-blue-100 rounded">
                <p className="text-sm font-semibold">Comparte tu progreso:</p>
                <p className="text-sm">Usa #CTOEnglishJourney en redes. Accountability = 10x más probabilidad de éxito</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📘 Guía de Uso: Plan Maestro de Inglés
          </h1>
          <p className="text-xl text-gray-600">
            Tu transformación de 6 meses hacia la fluidez profesional
          </p>
        </div>

        <Accordion type="single" collapsible value={expandedSection} onValueChange={setExpandedSection}>
          {sections.map((section) => (
            <AccordionItem key={section.id} value={section.id} className="mb-4">
              <Card className="border-2 shadow-md hover:shadow-lg transition-shadow">
                <AccordionTrigger className="hover:no-underline px-6 py-4">
                  <div className="flex items-center gap-4 text-left w-full">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-3 rounded-lg">
                      {section.icon}
                    </div>
                    <span className="text-xl font-semibold">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-6 pb-6 pt-2">
                    {section.content}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>

        <Card className="mt-8 border-4 border-green-400 bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6 text-center">
            <Award className="h-16 w-16 mx-auto mb-4 text-green-600" />
            <h3 className="text-2xl font-bold mb-2">¿Listo para Comenzar?</h3>
            <p className="text-gray-600 mb-4">
              Regresa al dashboard y empieza con la Semana 1 del plan
            </p>
            <a href="/dashboard" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
              Ir al Dashboard →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
