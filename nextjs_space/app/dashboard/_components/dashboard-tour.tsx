
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
          <h2 className="text-2xl font-bold mb-2">¡Bienvenido a SpeaklyPlan! 🎉</h2>
          <p className="text-gray-700 mb-3">
            Te voy a mostrar una guía rápida del Dashboard para que sepas cómo aprovechar al máximo tu plan de aprendizaje.
          </p>
          <p className="text-sm text-gray-600">
            Puedes saltar esta guía en cualquier momento y volver a verla haciendo clic en el botón de ayuda (?) en la esquina inferior izquierda.
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
          <h3 className="text-lg font-bold mb-2">👤 Tu Perfil</h3>
          <p className="text-gray-700 mb-3">
            Haz clic en tu nombre para acceder a opciones importantes:
          </p>
          <div className="space-y-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <p className="font-semibold text-blue-900 text-sm mb-1">📝 Mi Perfil</p>
              <p className="text-xs text-gray-700">
                Actualiza tu foto, datos personales y contraseña
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
              <p className="font-semibold text-purple-900 text-sm mb-1">👥 Invitar Amigos</p>
              <p className="text-xs text-gray-700">
                Comparte SpeaklyPlan con amigos que quieran aprender inglés
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-2">
              <p className="font-semibold text-red-900 text-sm mb-1">🚪 Cerrar Sesión</p>
              <p className="text-xs text-gray-700">
                Sal de tu cuenta de forma segura
              </p>
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
          <h3 className="text-lg font-bold mb-2">🏠 Dashboard</h3>
          <p className="text-gray-700">
            <strong>Aquí estás ahora.</strong> Es tu centro de control principal donde ves tu progreso, 
            actividades pendientes y estadísticas de aprendizaje.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="nav-tutor"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">🤖 Tutor de IA</h3>
          <p className="text-gray-700 mb-2">
            Tu profesor personal de inglés disponible 24/7. Aquí puedes:
          </p>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>Practicar conversaciones reales en diferentes contextos</li>
            <li>Recibir feedback instantáneo sobre gramática y vocabulario</li>
            <li>Usar reconocimiento de voz para mejorar tu pronunciación</li>
            <li>Ganar XP y puntos por cada sesión de práctica</li>
          </ul>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="nav-vocabulary"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">📚 Vocabulario</h3>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 mb-2">
            <p className="font-bold text-emerald-700 text-sm mb-1">✨ Con Práctica de Pronunciación</p>
          </div>
          <p className="text-gray-700 mb-2">
            Más de 1,200 términos profesionales organizados en 12 categorías:
          </p>
          <div className="space-y-1 text-sm text-gray-700">
            <p>🔊 <strong>Escuchar:</strong> Pronunciación con voz nativa</p>
            <p>🎤 <strong>Practicar:</strong> Graba y recibe calificación 0-100</p>
            <p>📊 <strong>Seguimiento:</strong> Ve tu progreso por categoría</p>
          </div>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="nav-resources"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">🎓 Recursos</h3>
          <p className="text-gray-700">
            Recursos externos curados: apps recomendadas (Duolingo, HelloTalk), 
            podcasts para CTOs, canales de YouTube, y más herramientas para 
            complementar tu aprendizaje.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="nav-guide"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">📖 Guía de Uso</h3>
          <p className="text-gray-700">
            Guía completa e interactiva con tutoriales paso a paso, checklist de inicio, 
            tips diarios, FAQs y consejos para aprovechar al máximo la plataforma.
          </p>
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
          <h2 className="text-2xl font-bold mb-2">¡Todo listo para empezar! 🚀</h2>
          <p className="text-gray-700 mb-3">
            Ya conoces todas las secciones y herramientas del Dashboard. 
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 text-left">
            <p className="font-semibold text-blue-900 mb-2">💡 Recomendación para empezar:</p>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Revisa las actividades pendientes de esta semana</li>
              <li>Completa al menos una actividad hoy</li>
              <li>Prueba el Tutor de IA por 10 minutos</li>
              <li>Explora el vocabulario y practica pronunciación</li>
            </ol>
          </div>
          <p className="text-sm text-gray-600">
            Recuerda: Puedes volver a ver este tour en cualquier momento haciendo clic 
            en el botón de ayuda <strong>(?)</strong> en la esquina inferior izquierda.
          </p>
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
