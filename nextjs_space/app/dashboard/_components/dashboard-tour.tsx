
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
    // Bienvenida
    {
      target: 'body',
      content: (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">¡Bienvenido a SpeaklyPlan! 🎉</h2>
          <p className="text-gray-700">
            Te mostraré las secciones clave de tu plataforma de aprendizaje en 2 minutos.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Puedes saltar este tour en cualquier momento.
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },

    // Paso 1: Actividades pendientes
    {
      target: '[data-tour="pending-activities"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">📝 Actividades del Día</h3>
          <p className="text-gray-700">
            Aquí están tus tareas pendientes. Completa cada actividad para desbloquear la siguiente y ganar puntos XP.
          </p>
        </div>
      ),
      placement: 'bottom',
    },

    // Paso 2: Progreso y nivel
    {
      target: '[data-tour="progress-sidebar"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">📊 Tu Progreso</h3>
          <p className="text-gray-700">
            Nivel actual, puntos XP y progreso al siguiente nivel. ¡Completa actividades para subir de nivel!
          </p>
        </div>
      ),
      placement: 'left',
    },

    // Paso 3: Misiones diarias
    {
      target: '[data-tour="daily-missions"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">🎯 Misiones Diarias</h3>
          <p className="text-gray-700">
            Objetivos diarios que se reinician cada 24 horas. Gana puntos extra completándolas todas.
          </p>
        </div>
      ),
      placement: 'left',
    },

    // Paso 4: Plan semanal
    {
      target: '[data-tour="weekly-plan"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">📅 Plan de 24 Semanas</h3>
          <p className="text-gray-700">
            Navega entre semanas, revisa tu progreso y agrega notas personales. Tu roadmap completo al inglés fluido.
          </p>
        </div>
      ),
      placement: 'top',
    },

    // Paso 5: Dashboard principal
    {
      target: '[data-tour="nav-dashboard"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">🏠 Dashboard</h3>
          <p className="text-gray-700">
            Tu centro de comando. Actividades, progreso semanal, estadísticas y logros en un solo lugar.
          </p>
        </div>
      ),
      placement: 'bottom',
    },

    // Paso 6: Tutor AI
    {
      target: '[data-tour="nav-tutor"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">🤖 AI Tutor</h3>
          <p className="text-gray-700">
            Tu profesor personal 24/7. Conversaciones con voz en tiempo real, análisis de pronunciación y feedback instantáneo.
          </p>
        </div>
      ),
      placement: 'bottom',
    },

    // Paso 7: Prácticas 1-on-1
    {
      target: '[data-tour="nav-one-on-one"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">👥 Práctica 1-on-1</h3>
          <p className="text-gray-700">
            Conecta con otros usuarios. Envía invitaciones, programa sesiones y practica juntos en tiempo real.
          </p>
        </div>
      ),
      placement: 'bottom',
    },

    // Paso 8: Vocabulario
    {
      target: '[data-tour="nav-vocabulary"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">📚 Vocabulario</h3>
          <p className="text-gray-700">
            Más de 1,200 términos profesionales con pronunciación interactiva. Escucha, practica y recibe calificación instantánea.
          </p>
        </div>
      ),
      placement: 'bottom',
    },

    // Paso 9: Recursos
    {
      target: '[data-tour="nav-resources"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">🎓 Recursos</h3>
          <p className="text-gray-700">
            Apps, podcasts, videos y cursos externos recomendados para complementar tu aprendizaje.
          </p>
        </div>
      ),
      placement: 'bottom',
    },

    // Paso 10: Menú de usuario
    {
      target: '[data-tour="user-menu"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">👤 Tu Perfil</h3>
          <p className="text-gray-700">
            Accede a tu perfil, guía de uso y cierra sesión desde aquí.
          </p>
        </div>
      ),
      placement: 'bottom',
    },

    // Final
    {
      target: 'body',
      content: (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">¡Todo listo! 🚀</h2>
          <p className="text-gray-700 mb-3">
            Ya conoces las secciones principales. Comienza completando tus actividades y practicando con el AI Tutor.
          </p>
          <p className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> Mantén una racha diaria completando misiones para maximizar tu progreso.
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
