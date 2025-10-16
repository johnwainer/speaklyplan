
'use client';

import { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { toast } from 'sonner';

interface DashboardTourProps {
  runTour: boolean;
  onTourEnd: () => void;
}

export default function DashboardTour({ runTour, onTourEnd }: DashboardTourProps) {
  const [run, setRun] = useState(false);

  useEffect(() => {
    setRun(runTour);
  }, [runTour]);

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-3 animate-bounce">
              <span className="text-4xl">👋</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            ¡Bienvenido a SpeaklyPlan!
          </h2>
          <p className="text-gray-700 mb-4 text-lg">
            Tu plataforma completa para dominar el inglés profesional en 6 meses.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
            <p className="font-semibold text-blue-900 mb-2">✨ Lo que aprenderás:</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <span>Tutor IA 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🗣️</span>
                <span>Pronunciación</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">👥</span>
                <span>Práctica Social</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📚</span>
                <span>1,200+ palabras</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            💡 Este tour te tomará solo 2 minutos. Puedes saltarlo y volverlo a ver cuando quieras.
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="user-menu"]',
      content: (
        <div>
          <div className="mb-3 text-center">
            <div className="inline-block p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full">
              <span className="text-2xl">👤</span>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3 text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
            Tu Perfil Personal
          </h3>
          <p className="text-gray-700 mb-3 text-center">
            Haz clic en tu nombre para acceder a estas opciones:
          </p>
          <div className="space-y-2">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-2">
                <span className="text-xl">📝</span>
                <div>
                  <p className="font-semibold text-blue-900 text-sm mb-1">Mi Perfil</p>
                  <p className="text-xs text-gray-700">
                    Actualiza tu foto, datos personales y contraseña de forma segura
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-2">
                <span className="text-xl">👥</span>
                <div>
                  <p className="font-semibold text-purple-900 text-sm mb-1">Invitar Amigos</p>
                  <p className="text-xs text-gray-700">
                    Comparte SpeaklyPlan y aprende junto a tus amigos
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-2">
                <span className="text-xl">🚪</span>
                <div>
                  <p className="font-semibold text-red-900 text-sm mb-1">Cerrar Sesión</p>
                  <p className="text-xs text-gray-700">
                    Sal de tu cuenta de forma segura cuando termines
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="nav-dashboard"]',
      content: (
        <div>
          <div className="mb-3 text-center">
            <div className="inline-block p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <span className="text-3xl">🏠</span>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 text-center bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
            Dashboard - Tu Centro de Control
          </h3>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4">
            <p className="text-gray-700 text-center font-medium">
              <strong>🎯 Aquí estás ahora.</strong>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Tu centro de control principal donde ves tu progreso, actividades pendientes y todas tus estadísticas de aprendizaje.
            </p>
          </div>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="nav-tutor"]',
      content: (
        <div>
          <div className="mb-3 text-center">
            <div className="inline-block p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg animate-pulse">
              <span className="text-3xl">🤖</span>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Tutor de IA - Tu Profesor 24/7
          </h3>
          <p className="text-gray-700 mb-3 text-center font-medium">
            Tu profesor personal de inglés <strong>siempre disponible</strong>
          </p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-2">
              <p className="font-semibold text-blue-900 text-xs mb-1">💬 Conversaciones</p>
              <p className="text-[10px] text-gray-600">Práctica real en contexto</p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-2">
              <p className="font-semibold text-green-900 text-xs mb-1">✅ Feedback</p>
              <p className="text-[10px] text-gray-600">Corrección instantánea</p>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-2">
              <p className="font-semibold text-purple-900 text-xs mb-1">🎤 Voz</p>
              <p className="text-[10px] text-gray-600">Reconocimiento de voz</p>
            </div>
            <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-2">
              <p className="font-semibold text-orange-900 text-xs mb-1">⭐ XP</p>
              <p className="text-[10px] text-gray-600">Gana puntos</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg p-2">
            <p className="text-xs text-center font-semibold text-gray-700">
              🚀 ¡Sin límites! Practica todo lo que quieras
            </p>
          </div>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="nav-vocabulary"]',
      content: (
        <div>
          <div className="mb-3 text-center">
            <div className="inline-block p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-lg">
              <span className="text-3xl">📚</span>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3 text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
            Vocabulario Profesional
          </h3>
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-400 rounded-xl p-3 mb-3">
            <p className="font-bold text-emerald-700 text-center mb-1">✨ 1,200+ Términos Profesionales</p>
            <p className="text-xs text-gray-600 text-center">Organizados en 12 categorías específicas</p>
          </div>
          <div className="space-y-2">
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔊</span>
                <div>
                  <p className="font-semibold text-blue-900 text-xs">Escuchar</p>
                  <p className="text-[10px] text-gray-600">Pronunciación con voz nativa</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎤</span>
                <div>
                  <p className="font-semibold text-green-900 text-xs">Practicar</p>
                  <p className="text-[10px] text-gray-600">Graba y recibe calificación 0-100</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <div>
                  <p className="font-semibold text-purple-900 text-xs">Seguimiento</p>
                  <p className="text-[10px] text-gray-600">Ve tu progreso por categoría</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="nav-resources"]',
      content: (
        <div>
          <div className="mb-3 text-center">
            <div className="inline-block p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg">
              <span className="text-3xl">🎓</span>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3 text-center bg-gradient-to-r from-orange-600 to-red-600 text-transparent bg-clip-text">
            Recursos Externos
          </h3>
          <p className="text-gray-700 mb-3 text-center">
            Herramientas y contenido curado para complementar tu aprendizaje
          </p>
          <div className="space-y-2">
            <div className="bg-blue-50 rounded-lg p-2 flex items-center gap-2">
              <span className="text-lg">📱</span>
              <span className="text-xs text-gray-700"><strong>Apps:</strong> Duolingo, HelloTalk, Memrise</span>
            </div>
            <div className="bg-purple-50 rounded-lg p-2 flex items-center gap-2">
              <span className="text-lg">🎙️</span>
              <span className="text-xs text-gray-700"><strong>Podcasts:</strong> Para CTOs y profesionales</span>
            </div>
            <div className="bg-red-50 rounded-lg p-2 flex items-center gap-2">
              <span className="text-lg">📺</span>
              <span className="text-xs text-gray-700"><strong>YouTube:</strong> Canales educativos</span>
            </div>
            <div className="bg-green-50 rounded-lg p-2 flex items-center gap-2">
              <span className="text-lg">🌐</span>
              <span className="text-xs text-gray-700"><strong>Sitios web:</strong> Herramientas útiles</span>
            </div>
          </div>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="nav-practica"]',
      content: (
        <div>
          <div className="mb-3">
            <div className="inline-block p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg">
              <span className="text-2xl">🎉</span>
            </div>
            <span className="ml-2 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full animate-pulse">
              ¡NUEVO!
            </span>
          </div>
          <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-pink-600 to-rose-600 text-transparent bg-clip-text">
            👥 Práctica Social
          </h3>
          <p className="text-gray-700 mb-3">
            <strong>¡La función más esperada!</strong> Practica inglés con otros estudiantes en sesiones uno a uno.
          </p>
          <div className="space-y-2 mb-3">
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3">
              <p className="font-semibold text-blue-900 text-sm mb-1">📩 Invita Compañeros</p>
              <p className="text-xs text-gray-700">
                Busca usuarios por email y envía invitaciones de práctica
              </p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-3">
              <p className="font-semibold text-green-900 text-sm mb-1">💬 Sesiones en Vivo</p>
              <p className="text-xs text-gray-700">
                Practica conversaciones estructuradas con feedback mutuo
              </p>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-3">
              <p className="font-semibold text-purple-900 text-sm mb-1">📊 Historial</p>
              <p className="text-xs text-gray-700">
                Revisa tus sesiones pasadas y el feedback recibido
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg p-2">
            <p className="text-xs text-gray-700">
              <strong>💡 Tip:</strong> Las sesiones de práctica son la manera más efectiva de mejorar tu fluidez
            </p>
          </div>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="nav-guide"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">📖 Guía de Uso</h3>
          <p className="text-gray-700 mb-3">
            Guía completa e interactiva con tutoriales paso a paso, checklist de inicio, 
            tips diarios, FAQs y consejos para aprovechar al máximo la plataforma.
          </p>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <p className="text-xs text-gray-700">
              <strong>📹 Incluye:</strong> Videos tutoriales, checklist interactivo, quiz personalizado y tour guiado
            </p>
          </div>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '.py-3.px-4.bg-gradient-to-r',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">📊 Estadísticas Rápidas</h3>
          <p className="text-gray-700 mb-2">
            Aquí ves de un vistazo tus métricas más importantes:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xs">📈</span>
              </div>
              <span><strong>Porcentaje completado:</strong> Tu progreso total del plan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xs">🔥</span>
              </div>
              <span><strong>Racha actual:</strong> Días consecutivos practicando</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xs">📅</span>
              </div>
              <span><strong>Semana actual:</strong> En qué parte del plan estás</span>
            </div>
          </div>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="pending-activities"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">🎯 ¡Empieza aquí!</h3>
          <p className="text-gray-700 mb-2">
            Tu lista de actividades pendientes de la semana actual. Cada actividad incluye:
          </p>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li><strong>Título y descripción:</strong> Qué debes hacer</li>
            <li><strong>Duración estimada:</strong> Tiempo que te tomará</li>
            <li><strong>Categoría:</strong> Tipo de actividad (lectura, conversación, etc.)</li>
          </ul>
          <p className="text-sm text-gray-600 mt-2">
            💡 Haz clic en cualquier actividad para ver todos los detalles y marcarla como completada.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '.border-emerald-500',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">🎤 Tutor de IA - Acceso Rápido</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-2">
            <p className="font-bold text-yellow-800 text-sm">✨ NUEVA FUNCIÓN</p>
          </div>
          <p className="text-gray-700 mb-2">
            Acceso directo a tu tutor personal con características destacadas:
          </p>
          <div className="space-y-1 text-sm text-gray-700">
            <p>🗣️ <strong>Voz en tiempo real:</strong> Conversaciones fluidas</p>
            <p>🌐 <strong>Traducción simultánea:</strong> Español ↔ Inglés</p>
            <p>🎮 <strong>Gamificación:</strong> Gana XP en cada sesión</p>
            <p>📚 <strong>Vocabulario sugerido:</strong> Palabras para practicar</p>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Disponible 24/7 · Sin límites de uso
          </p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tour="weekly-plan"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">📅 Tu Plan de 24 Semanas</h3>
          <p className="text-gray-700 mb-2">
            El plan completo estructurado profesionalmente. Aquí puedes:
          </p>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside mb-2">
            <li>Ver el progreso de cada semana (0% a 100%)</li>
            <li>Navegar entre semanas con los botones de navegación</li>
            <li>Marcar actividades como completadas</li>
            <li>Agregar notas y reflexiones personales</li>
            <li>Ver detalles completos de cada actividad</li>
          </ul>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
            <p className="text-xs text-gray-700">
              <strong>Tip:</strong> Usa el botón "Vista Semanal" arriba para ver solo una semana, 
              o "Vista General" para ver todo el progreso de un vistazo.
            </p>
          </div>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="progress-sidebar"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">🏆 Sistema de Gamificación</h3>
          <p className="text-gray-700 mb-2">
            Tu progreso gamificado para mantenerte motivado:
          </p>
          <div className="space-y-2 text-sm">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
              <p className="font-semibold text-purple-900 mb-1">Nivel y XP</p>
              <p className="text-xs text-gray-700">
                Gana experiencia completando actividades y usando el tutor. 
                Cada nivel desbloqueado te acerca más a la fluidez.
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
              <p className="font-semibold text-orange-900 mb-1">Rachas</p>
              <p className="text-xs text-gray-700">
                Mantén tu racha diaria practicando todos los días. 
                ¡Tu racha actual y récord personal se muestran aquí!
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <p className="font-semibold text-blue-900 mb-1">Actividades</p>
              <p className="text-xs text-gray-700">
                Contador de actividades completadas vs. total del plan.
              </p>
            </div>
          </div>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tour="daily-missions"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">🎯 Misiones Diarias y Semanales</h3>
          <p className="text-gray-700 mb-2">
            Completa misiones para ganar XP adicional:
          </p>
          <div className="space-y-2 text-sm">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
              <p className="font-semibold text-yellow-900 text-sm mb-1">⚡ Práctica Diaria (50 XP)</p>
              <p className="text-xs text-gray-700">Completa 3 actividades hoy</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <p className="font-semibold text-blue-900 text-sm mb-1">💬 Sesión con el Tutor (30 XP)</p>
              <p className="text-xs text-gray-700">Practica 10 minutos con el Tutor AI</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
              <p className="font-semibold text-green-900 text-sm mb-1">📚 Vocabulario (25 XP)</p>
              <p className="text-xs text-gray-700">Aprende 5 palabras nuevas</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
              <p className="font-semibold text-purple-900 text-sm mb-1">🏆 Semana Perfecta (200 XP)</p>
              <p className="text-xs text-gray-700">Completa todas las actividades de la semana</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Las misiones diarias se reinician cada 24 horas. ¡No rompas tu racha!
          </p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: 'body',
      content: (
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-block p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-3 animate-pulse">
              <span className="text-5xl">🚀</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
            ¡Todo Listo para Empezar!
          </h2>
          <p className="text-gray-700 mb-4 text-lg">
            Ya conoces todas las secciones y herramientas de SpeaklyPlan
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-4 mb-4 text-left">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <span className="text-xl">💡</span>
              </div>
              <p className="font-bold text-blue-900 text-lg">Tus Primeros Pasos:</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white/70 rounded-lg p-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 font-bold text-white">1</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Revisa tus actividades pendientes</p>
                  <p className="text-xs text-gray-600">Ve qué tienes que hacer esta semana</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/70 rounded-lg p-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 font-bold text-white">2</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Completa al menos una actividad hoy</p>
                  <p className="text-xs text-gray-600">¡Empieza tu racha de aprendizaje!</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/70 rounded-lg p-3">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 font-bold text-white">3</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Prueba el Tutor de IA por 10 minutos</p>
                  <p className="text-xs text-gray-600">Conversa en inglés y recibe feedback instantáneo</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/70 rounded-lg p-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 font-bold text-white">4</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Explora el vocabulario</p>
                  <p className="text-xs text-gray-600">Practica pronunciación de palabras profesionales</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-4 mb-4">
            <p className="font-bold text-yellow-900 mb-2">🎯 Meta del Día 1:</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">✅</span>
              <p className="text-sm text-gray-700">Completa 1 actividad + 10 min con el Tutor IA</p>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              💬 <strong>¿Necesitas ayuda?</strong> Vuelve a ver este tour haciendo clic en el botón de ayuda <strong>(?)</strong> en la esquina inferior izquierda o visita la <strong>Guía de Uso</strong>.
            </p>
          </div>
        </div>
      ),
      placement: 'center',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      onTourEnd();
      
      if (status === STATUS.FINISHED) {
        toast.success('¡Tour completado! Ya puedes empezar a aprender.');
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#2563eb',
          textColor: '#1f2937',
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          arrowColor: '#ffffff',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 8,
          padding: 20,
        },
        tooltipContent: {
          padding: '10px 0',
        },
        buttonNext: {
          backgroundColor: '#2563eb',
          borderRadius: 6,
          padding: '8px 16px',
        },
        buttonBack: {
          color: '#6b7280',
          marginRight: 10,
        },
        buttonSkip: {
          color: '#6b7280',
        },
      }}
      locale={{
        back: 'Atrás',
        close: 'Cerrar',
        last: 'Finalizar',
        next: 'Siguiente',
        skip: 'Saltar tour',
      }}
    />
  );
}
