import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Helper function para generar descripciones detalladas por día
function getDetailedDescription(day: string, weekNumber: number, objective: string, baseDescription: string): string {
  const descriptions: Record<string, (obj: string) => string> = {
    lunes: (obj) => `📚 **VOCABULARIO Y LISTENING - Enfoque: ${obj}**

🎯 **Paso 1: Vocabulario Técnico (20 minutos)**
- Revisa las 20 palabras técnicas de esta semana en la sección de vocabulario
- Crea flashcards digitales o usa Anki para cada palabra
- Escribe una oración técnica con cada palabra relacionada con: ${obj}
- Ejemplo: Si la palabra es "deployment", escribe: "Our deployment process includes automated testing"

🎧 **Paso 2: Listening BBC 6 Minute English (20 minutos)**
- Ve a: https://www.bbc.co.uk/learningenglish/english/features/6-minute-english
- Escoge un episodio relacionado con tecnología o negocios
- Primera escucha: Sin subtítulos, capta la idea general
- Segunda escucha: Con transcripción, identifica palabras nuevas
- Anota 5 frases útiles que puedas usar en tu trabajo

💡 **Tip del día**: No te preocupes si no entiendes todo. El objetivo es familiarizarte con el ritmo y los sonidos del inglés técnico.`,

    martes: (obj) => `🗣️ **SPEAKING Y SHADOWING - Enfoque: ${obj}**

🤖 **Paso 1: Speaking con ChatGPT (30 minutos)**
- Abre ChatGPT y configúralo como tu tutor de inglés
- Prompt sugerido: "I'm a professional learning English. Let's have a conversation about: ${obj}. Please correct my mistakes and give me feedback."
- Temas de conversación:
  • Describe tu día típico en el trabajo
  • Explica un proyecto reciente
  • Discute un desafío profesional que enfrentaste
- Graba tu audio para revisar después

🎭 **Paso 2: Shadowing (30 minutos)**
- Busca un video de TED Talk relacionado con tu área (5-10 min)
- Técnica de shadowing:
  1. Escucha el video completo una vez
  2. Reproduce frase por frase
  3. Repite cada frase imitando pronunciación, ritmo y entonación
  4. Graba tu versión y compara
  
💡 **Tip del día**: El shadowing mejora tu pronunciación y fluidez. No tengas vergüenza de exagerar la entonación.`,

    miércoles: (obj) => `✍️ **GRAMÁTICA Y WRITING - Enfoque: ${obj}**

📖 **Paso 1: Gramática Aplicada (30 minutos)**
- Tema de hoy: Tiempos verbales en contexto profesional
- Recursos: BBC Learning English Grammar section
- Ejercicios prácticos:
  • Present Perfect: "I have completed 5 projects this month"
  • Past Simple: "We finished the report last week"
  • Future: "We will start the new phase next month"
- Completa 10 ejercicios online
- Crea 5 oraciones sobre tu trabajo usando los tiempos estudiados

📧 **Paso 2: Writing Emails (30 minutos)**
- Escribe 3 emails profesionales sobre: ${obj}
- Tipos de email a practicar:
  1. **Email de actualización**: Informa al equipo sobre el progreso de un proyecto
  2. **Email de propuesta**: Sugiere una mejora o idea
  3. **Email de respuesta**: Responde preguntas de colegas o clientes
- Usa Grammarly para revisar errores
- Guarda los emails como templates

💡 **Tip del día**: Los emails profesionales deben ser claros, concisos y corteses. Usa bullet points para información importante.`,

    jueves: (obj) => `🎯 **SIMULACIÓN PRÁCTICA - Enfoque: ${obj}**

🤝 **Reunión Profesional Simulada con IA (60 minutos)**

**Preparación (15 minutos):**
- Define el tipo de reunión: Team meeting, Project update, Client call, o One-on-one
- Contexto: ${obj}
- Prepara 3 puntos clave que quieres comunicar
- Anota vocabulario relevante para tu área

**Simulación con ChatGPT (35 minutos):**
- Prompt: "You are my team/client. We're having a [tipo de reunión] about ${obj}. Ask me questions and I'll respond. Correct my English and give suggestions."
- Practica:
  • Presentar tu punto de vista
  • Responder preguntas difíciles
  • Negociar y persuadir
  • Manejar desacuerdos profesionalmente
- Graba la conversación completa

**Autoevaluación (10 minutos):**
- Escucha tu grabación
- Identifica 3 errores comunes que cometiste
- Anota frases que te costaron expresar
- Busca formas mejores de decir esas frases

💡 **Tip del día**: En reuniones, está bien pedir clarificación: "Could you repeat that?" o "Let me make sure I understand..."`,

    viernes: (obj) => `📊 **PRESENTACIÓN PROFESIONAL - Enfoque: ${obj}**

🎤 **Preparación y Delivery de Presentación (60 minutos)**

**Fase 1: Preparación (25 minutos)**
- Tema: ${obj}
- Estructura de tu presentación:
  1. **Introducción** (1 min): "Today I'll talk about..."
  2. **Problema** (2 min): "We're facing..."
  3. **Solución** (3 min): "I propose..."
  4. **Beneficios** (2 min): "This will help us..."
  5. **Próximos pasos** (1 min): "Going forward..."
  6. **Q&A** (1 min): Anticipa 3 preguntas
- Crea 5-7 slides mentalmente o en papel
- Practica transiciones: "Moving on to...", "Let me show you...", "This brings us to..."

**Fase 2: Delivery (25 minutos)**
- Grábate presentando (video si es posible)
- Primera toma completa sin parar
- Segunda toma: Mejora las partes difíciles
- Tercera toma: Tu mejor versión
- Objetivo: Hablar claro, con pausas estratégicas, y proyectar confianza

**Fase 3: Feedback (10 minutos)**
- Revisa tu video
- Evalúa:
  • Claridad de pronunciación
  • Uso de conectores (however, therefore, additionally)
  • Lenguaje corporal (si hay video)
  • Manejo de nervios
- Identifica 2 cosas que mejorarás la próxima semana

💡 **Tip del día**: Las mejores presentaciones cuentan una historia. No solo datos, sino el journey y el impacto.`,

    sábado: (obj) => `🎬 **INMERSIÓN CULTURAL - Enfoque: ${obj}**

📺 **Serie o Contenido en Inglés (60 minutos)**

**Opciones recomendadas:**
- Series profesionales: The Office, Suits, Mad Men
- Documentales: Netflix documentaries relacionados con tu campo
- TED Talks: Busca charlas sobre ${obj}
- YouTube: Videos profesionales de tu industria

**Método de inmersión activa:**

**Antes de ver (5 minutos):**
- Lee un resumen del contenido en inglés
- Identifica el tema principal
- Relación con: ${obj}

**Durante la visualización (45 minutos):**
- Primera mitad: Subtítulos en inglés
- Segunda mitad: Sin subtítulos (desafío)
- Pausa cuando escuches:
  • Una frase profesional nueva
  • Una expresión idiomática
  • Un término relevante para tu trabajo
- Anota mínimo 10 frases o palabras nuevas

**Después de ver (10 minutos):**
- Escribe un resumen de 5 líneas en inglés
- Lista 3 frases que quieres incorporar en tu vocabulario
- Ejemplo: "Let's circle back", "I'll keep you posted", "That makes sense"
- Practica diciendo estas frases en voz alta

💡 **Tip del día**: La inmersión cultural te ayuda a entender el contexto y la cultura profesional en inglés, no solo el idioma.`,

    domingo: (obj) => `📈 **REVISIÓN Y PLANIFICACIÓN - Enfoque: ${obj}**

🔍 **Revisión Semanal Completa (60 minutos)**

**Parte 1: Autoevaluación (20 minutos)**
Responde estas preguntas en inglés (escribe en tu diario):
1. What was my biggest achievement this week?
2. What was the most challenging activity and why?
3. How many new words did I learn? (Cuenta tus flashcards)
4. Can I explain "${obj}" better than last week?
5. Rate your confidence level (1-10) speaking about ${obj}

**Parte 2: Revisión de Materiales (20 minutos)**
- Repasa todas las palabras nuevas de la semana
- Vuelve a leer los emails que escribiste
- Escucha tu grabación del jueves (reunión)
- Ve tu presentación del viernes
- Identifica patrones en tus errores

**Parte 3: Plan para la Próxima Semana (20 minutos)**
- Revisa el objetivo de la Semana ${weekNumber + 1}
- Prepara tu calendario: Bloquea tiempo para cada actividad
- Define 3 metas específicas:
  • Meta de vocabulario: "Dominar 20 palabras nuevas"
  • Meta de speaking: "Hablar más fluido sobre X"
  • Meta de confianza: "Presentar sin leer mis notas"
- Descarga recursos que necesitarás
- Comparte tu progreso con alguien (accountability partner)

**Celebración:**
✅ ¡Completaste la semana ${weekNumber}!
✅ Llevas [X] horas acumuladas de práctica
✅ Estás [X]% más cerca de tu meta de 6 meses

💡 **Tip del día**: El progreso no es lineal. Algunos días te sentirás genial, otros frustrado. Es normal. Lo importante es la consistencia.`
  }

  return descriptions[day] ? descriptions[day](objective) : baseDescription
}

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  try {
    console.log('📊 Preparando datos del plan...')

    // Crear el usuario de prueba admin (john@doe.com / johndoe123)
    const hashedPassword = await bcrypt.hash('johndoe123', 12)
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'john@doe.com' },
      update: {},
      create: {
        email: 'john@doe.com',
        password: hashedPassword,
        name: 'Admin Usuario',
        role: 'admin',
      }
    })

    // Crear racha inicial para el usuario admin
    await prisma.userStreak.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: {
        userId: adminUser.id,
        currentStreak: 0,
        bestStreak: 0,
      }
    })

    console.log('👤 Usuario admin creado: john@doe.com / johndoe123')

    // Procesar fases del plan
    const phases = [
      {
        number: 1,
        name: 'FASE 1: CATARSIS',
        description: 'Fundamentos y vocabulario técnico básico'
      },
      {
        number: 2,
        name: 'FASE 2: SPEAKING MÍNIMO VIABLE',
        description: 'Conversaciones técnicas y presentaciones'
      },
      {
        number: 3,
        name: 'FASE 3: PLAYBOOK FOR JTBD',
        description: 'Dominio avanzado y simulaciones reales'
      }
    ]

    console.log('🎯 Creando fases del plan...')
    for (const phaseData of phases) {
      await prisma.planPhase.upsert({
        where: { number: phaseData.number },
        update: {},
        create: phaseData
      })
    }

    // Crear datos del plan completo (24 semanas) con descripciones detalladas
    console.log('📅 Creando plan semanal completo con descripciones detalladas (24 semanas)...')
    
    const weeklyPlans = [
      // ============ FASE 1: CATARSIS (Semanas 1-8) ============
      {
        number: 1, month: 1, phase: 1,
        objective: "Primeros pasos: Presentación personal básica",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Vocabulario y Listening", duration: 40, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Práctica de Speaking", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Escritura y Gramática", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Simulación Práctica", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Presentación Técnica", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Inmersión Cultural", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Revisión Semanal", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 2, month: 1, phase: 1,
        objective: "Rutina diaria: Describir tu día",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Vocabulario y Listening", duration: 40, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Práctica de Speaking", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Escritura y Gramática", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Simulación Práctica", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Presentación Técnica", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Inmersión Cultural", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Revisión Semanal", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 3, month: 1, phase: 1,
        objective: "Trabajo: Describir tu rol y responsabilidades",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Vocabulario y Listening", duration: 40, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Práctica de Speaking", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Escritura y Gramática", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Simulación Práctica", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Presentación Técnica", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Inmersión Cultural", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Revisión Semanal", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 4, month: 1, phase: 1,
        objective: "Herramientas: Explicar las que usas en tu trabajo",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Vocabulario y Listening", duration: 40, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Práctica de Speaking", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Escritura y Gramática", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Simulación Práctica", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Presentación Técnica", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Inmersión Cultural", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Revisión Semanal", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 5, month: 2, phase: 1,
        objective: "Equipo: Describir tu equipo y proyectos",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Vocabulario y Listening", duration: 40, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Práctica de Speaking", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Escritura y Gramática", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Simulación Práctica", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Presentación Técnica", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Inmersión Cultural", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Revisión Semanal", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 6, month: 2, phase: 1,
        objective: "Procesos: Explicar cómo funciona tu trabajo",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Vocabulario y Listening", duration: 40, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Práctica de Speaking", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Escritura y Gramática", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Simulación Práctica", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Presentación Técnica", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Inmersión Cultural", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Revisión Semanal", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 7, month: 2, phase: 1,
        objective: "Desafíos: Hablar de problemas y soluciones",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Vocabulario y Listening", duration: 40, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Práctica de Speaking", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Escritura y Gramática", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Simulación Práctica", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Presentación Técnica", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Inmersión Cultural", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Revisión Semanal", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 8, month: 2, phase: 1,
        objective: "Consolidación Fase 1: Video presentación 5 min",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Vocabulario y Listening", duration: 40, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Práctica de Speaking", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Escritura y Gramática", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Simulación Práctica", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Presentación Técnica", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Inmersión Cultural", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Revisión Semanal", duration: 60, category: "revisión" },
        ]
      },

      // ============ FASE 2: SPEAKING MVP (Semanas 9-16) ============
      {
        number: 9, month: 3, phase: 2,
        objective: "Explicar: Sistemas y procesos complejos",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Vocabulario y Podcast", duration: 60, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Role-play y Pronunciación", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Documentación Técnica", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Sprint Planning Simulation", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Demo Presentation", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Movie Time", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Weekly Review", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 10, month: 3, phase: 2,
        objective: "Toma de decisiones: Justificar tus elecciones",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Vocabulario y Podcast", duration: 60, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Role-play y Pronunciación", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Documentación Técnica", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Sprint Planning Simulation", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Demo Presentation", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Movie Time", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Weekly Review", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 11, month: 3, phase: 2,
        objective: "Análisis: Discutir pros y contras de opciones",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Vocabulario y Podcast", duration: 60, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Role-play y Pronunciación", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Documentación Técnica", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Sprint Planning Simulation", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Demo Presentation", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Movie Time", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Weekly Review", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 12, month: 3, phase: 2,
        objective: "Planificación: Presentar planes y estrategias",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Vocabulario y Podcast", duration: 60, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Role-play y Pronunciación", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Documentación Técnica", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Sprint Planning Simulation", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Demo Presentation", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Movie Time", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Weekly Review", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 13, month: 4, phase: 2,
        objective: "Liderazgo: Principios de gestión de equipos",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Vocabulario y Podcast", duration: 60, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Role-play y Pronunciación", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Documentación Técnica", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Sprint Planning Simulation", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Demo Presentation", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Movie Time", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Weekly Review", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 14, month: 4, phase: 2,
        objective: "Crecimiento: Discutir expansión y mejora",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Vocabulario y Podcast", duration: 60, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Role-play y Pronunciación", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Documentación Técnica", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Sprint Planning Simulation", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Demo Presentation", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Movie Time", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Weekly Review", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 15, month: 4, phase: 2,
        objective: "Buenas prácticas: Explicar estándares de tu área",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Vocabulario y Podcast", duration: 60, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Role-play y Pronunciación", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Documentación Técnica", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Sprint Planning Simulation", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Demo Presentation", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Movie Time", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Weekly Review", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 16, month: 4, phase: 2,
        objective: "Consolidación Fase 2: Presentación técnica 10 min",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Vocabulario y Podcast", duration: 60, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Role-play y Pronunciación", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Documentación Técnica", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Sprint Planning Simulation", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Demo Presentation", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Movie Time", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Weekly Review", duration: 60, category: "revisión" },
        ]
      },

      // ============ FASE 3: PLAYBOOK (Semanas 17-24) ============
      {
        number: 17, month: 5, phase: 3,
        objective: "Reuniones importantes: Comunicar con stakeholders",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Technical Vocabulary Deep Dive", duration: 60, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Debate Técnico Avanzado", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Technical Proposal Writing", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Architecture Review Meeting", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Roadmap Presentation", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Tech Documentary", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Strategic Review", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 18, month: 5, phase: 3,
        objective: "Presentaciones clave: Comunicar tu visión",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Technical Vocabulary Deep Dive", duration: 60, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Debate Técnico Avanzado", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Technical Proposal Writing", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Architecture Review Meeting", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Roadmap Presentation", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Tech Documentary", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Strategic Review", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 19, month: 5, phase: 3,
        objective: "Negociación: Discutir presupuestos y recursos",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Technical Vocabulary Deep Dive", duration: 60, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Debate Técnico Avanzado", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Technical Proposal Writing", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Architecture Review Meeting", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Roadmap Presentation", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Tech Documentary", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Strategic Review", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 20, month: 5, phase: 3,
        objective: "Networking: Small talk profesional avanzado",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Technical Vocabulary Deep Dive", duration: 60, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Debate Técnico Avanzado", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Technical Proposal Writing", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Architecture Review Meeting", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Roadmap Presentation", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "Tech Documentary", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Strategic Review", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 21, month: 6, phase: 3,
        objective: "Crisis management: Comunicar en situaciones difíciles",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Advanced Vocabulary Mastery", duration: 60, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Mock Interview Practice", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Executive Summary Writing", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Board Presentation Simulation", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Investor Pitch Practice", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "YouTube Tech Binge", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Reflection and Goal Setting", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 22, month: 6, phase: 3,
        objective: "Hiring: Entrevistas y recruitment",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Advanced Vocabulary Mastery", duration: 60, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Mock Interview Practice", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Executive Summary Writing", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Board Presentation Simulation", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Investor Pitch Practice", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "YouTube Tech Binge", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Reflection and Goal Setting", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 23, month: 6, phase: 3,
        objective: "Vision: Articular estrategia long-term",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Advanced Vocabulary Mastery", duration: 60, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Mock Interview Practice", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Executive Summary Writing", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Board Presentation Simulation", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Investor Pitch Practice", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "YouTube Tech Binge", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Reflection and Goal Setting", duration: 60, category: "revisión" },
        ]
      },
      {
        number: 24, month: 6, phase: 3,
        objective: "Consolidación Final: Dominio completo",
        activities: [
          { day: "lunes", dayNumber: 1, title: "Advanced Vocabulary Mastery", duration: 60, category: "vocabulario" },
          { day: "martes", dayNumber: 2, title: "Mock Interview Practice", duration: 60, category: "speaking" },
          { day: "miércoles", dayNumber: 3, title: "Executive Summary Writing", duration: 60, category: "writing" },
          { day: "jueves", dayNumber: 4, title: "Board Presentation Simulation", duration: 60, category: "simulación" },
          { day: "viernes", dayNumber: 5, title: "Investor Pitch Practice", duration: 60, category: "presentación" },
          { day: "sábado", dayNumber: 6, title: "YouTube Tech Binge", duration: 60, category: "inmersión" },
          { day: "domingo", dayNumber: 7, title: "Reflection and Goal Setting", duration: 60, category: "revisión" },
        ]
      },
    ]

    // Procesar cada semana y agregar descripciones detalladas
    for (const weekPlan of weeklyPlans) {
      const phase = await prisma.planPhase.findUnique({
        where: { number: weekPlan.phase }
      })

      if (!phase) {
        console.error(`❌ Fase ${weekPlan.phase} no encontrada`)
        continue
      }

      const week = await prisma.planWeek.upsert({
        where: { number: weekPlan.number },
        update: {},
        create: {
          number: weekPlan.number,
          month: weekPlan.month,
          phaseId: phase.id,
          objective: weekPlan.objective,
        }
      })

      // Crear actividades con descripciones detalladas
      for (const activityData of weekPlan.activities) {
        const detailedDescription = getDetailedDescription(
          activityData.day,
          weekPlan.number,
          weekPlan.objective,
          activityData.title
        )

        await prisma.planActivity.upsert({
          where: {
            weekId_day: {
              weekId: week.id,
              day: activityData.day
            }
          },
          update: {
            dayNumber: activityData.dayNumber,
            title: activityData.title,
            description: detailedDescription,
            duration: activityData.duration,
            category: activityData.category,
          },
          create: {
            weekId: week.id,
            day: activityData.day,
            dayNumber: activityData.dayNumber,
            title: activityData.title,
            description: detailedDescription,
            duration: activityData.duration,
            category: activityData.category,
          }
        })
      }

      console.log(`✅ Semana ${weekPlan.number} creada con descripciones detalladas`)
    }

    console.log('✅ Plan completo de 24 semanas creado exitosamente!')
    console.log('📊 Total: 168 actividades con descripciones detalladas')

  } catch (error) {
    console.error('❌ Error en el seed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
