
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
          <p className="text-gray-700">
            Te voy a mostrar una guía rápida de todas las secciones de tu plan de aprendizaje. 
            Puedes saltar esta guía en cualquier momento.
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="pending-activities"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">📝 ¡Empieza aquí!</h3>
          <p className="text-gray-700">
            Esta es tu lista de tareas pendientes. Aquí verás las actividades que debes completar hoy. 
            Las actividades se desbloquean en orden, así que completa una para avanzar a la siguiente.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="progress-sidebar"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">📊 Tu Progreso</h3>
          <p className="text-gray-700">
            Aquí puedes ver tu nivel actual, puntos de experiencia y progreso hacia el siguiente nivel. 
            ¡Gana XP completando actividades y usando el Tutor AI!
          </p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tour="daily-missions"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">🎯 Misiones Diarias</h3>
          <p className="text-gray-700">
            Completa estas misiones diarias para ganar puntos extra. Las misiones se reinician cada día 
            y te ayudan a mantener una práctica constante.
          </p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tour="weekly-plan"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">📅 Plan Semanal</h3>
          <p className="text-gray-700">
            Este es tu plan completo de 24 semanas. Puedes navegar entre semanas, ver tu progreso 
            y agregar notas o reflexiones personales para cada semana.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="nav-tutor"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">🤖 Tutor AI</h3>
          <p className="text-gray-700">
            Tu profesor de inglés personal disponible 24/7. Practica conversaciones en diferentes contextos: 
            casual, reuniones, entrevistas, emails y más. ¡Recibe feedback instantáneo!
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="nav-vocabulary"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">📚 Vocabulario Interactivo</h3>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-3">
            <p className="font-bold text-emerald-700 mb-1">✨ NOVEDAD: Práctica de Pronunciación</p>
            <p className="text-sm text-gray-700">Ahora cada término incluye herramientas de pronunciación:</p>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p>🔊 <strong>Escuchar:</strong> Reproduce la pronunciación correcta con voz nativa</p>
            <p>🎤 <strong>Practicar:</strong> Graba tu pronunciación con reconocimiento de voz</p>
            <p>⭐ <strong>Calificar:</strong> Recibe puntuación 0-100 y feedback instantáneo</p>
          </div>
          <p className="text-gray-700 mt-3">
            Más de 1200 términos organizados en 12 categorías profesionales para dominar.
          </p>
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
            Encuentra recursos externos recomendados: apps, podcasts, videos y cursos 
            para complementar tu aprendizaje.
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
            Guía completa e interactiva sobre cómo usar la plataforma, 
            con tutoriales, FAQs y consejos para aprovechar al máximo tu aprendizaje.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: 'body',
      content: (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">¡Listo para empezar! 🚀</h2>
          <p className="text-gray-700 mb-3">
            Ya conoces todas las secciones principales. Recuerda que puedes volver a ver 
            este tour en cualquier momento desde el botón flotante en la esquina inferior izquierda.
          </p>
          <p className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> Comienza completando tus actividades del día y 
            luego practica con el Tutor AI. ¡Buena suerte! 🎯
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
