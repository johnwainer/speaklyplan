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

    // ============ VOCABULARIO EXTENSO PARA PROFESIONALES ============
    console.log('📚 Creando vocabulario extenso para profesionales...')
    
    const vocabularyData = [
      // 1. Marketing y Publicidad
      {
        category: 'Marketing y Publicidad',
        icon: '📢',
        terms: [
          { term: 'Brand awareness', pronunciation: '/brænd əˈwernəs/', translation: 'Reconocimiento de marca', example: 'Our campaign increased brand awareness by 40%', difficulty: 'intermediate' },
          { term: 'Target audience', pronunciation: '/ˈtɑːrɡɪt ˈɔːdiəns/', translation: 'Público objetivo', example: 'We need to identify our target audience first', difficulty: 'beginner' },
          { term: 'Conversion rate', pronunciation: '/kənˈvɜːrʒn reɪt/', translation: 'Tasa de conversión', example: 'The conversion rate improved after the redesign', difficulty: 'intermediate' },
          { term: 'Lead generation', pronunciation: '/liːd ˌdʒenəˈreɪʃn/', translation: 'Generación de clientes potenciales', example: 'Lead generation is crucial for our sales team', difficulty: 'intermediate' },
          { term: 'Content marketing', pronunciation: '/ˈkɑːntent ˈmɑːrkɪtɪŋ/', translation: 'Marketing de contenidos', example: 'Content marketing drives organic traffic to our site', difficulty: 'beginner' },
          { term: 'SEO optimization', pronunciation: '/ˌes iː ˈoʊ ˌɑːptɪməˈzeɪʃn/', translation: 'Optimización para motores de búsqueda', example: 'SEO optimization is essential for visibility', difficulty: 'intermediate' },
          { term: 'Call to action (CTA)', pronunciation: '/kɔːl tuː ˈækʃn/', translation: 'Llamada a la acción', example: 'Add a clear call to action on the landing page', difficulty: 'intermediate' },
          { term: 'Engagement rate', pronunciation: '/ɪnˈɡeɪdʒmənt reɪt/', translation: 'Tasa de interacción', example: 'Social media engagement rate has doubled', difficulty: 'intermediate' },
          { term: 'Campaign performance', pronunciation: '/kæmˈpeɪn pərˈfɔːrməns/', translation: 'Rendimiento de campaña', example: 'Let\'s analyze campaign performance metrics', difficulty: 'intermediate' },
          { term: 'Customer journey', pronunciation: '/ˈkʌstəmər ˈdʒɜːrni/', translation: 'Viaje del cliente', example: 'Map the customer journey from awareness to purchase', difficulty: 'intermediate' },
          { term: 'Value proposition', pronunciation: '/ˈvæljuː ˌprɑːpəˈzɪʃn/', translation: 'Propuesta de valor', example: 'Our value proposition is clear and compelling', difficulty: 'advanced' },
          { term: 'Market segmentation', pronunciation: '/ˈmɑːrkɪt ˌseɡmenˈteɪʃn/', translation: 'Segmentación de mercado', example: 'Market segmentation helps us target better', difficulty: 'intermediate' },
          { term: 'Brand positioning', pronunciation: '/brænd pəˈzɪʃnɪŋ/', translation: 'Posicionamiento de marca', example: 'Brand positioning defines how we compete', difficulty: 'advanced' },
          { term: 'Influencer marketing', pronunciation: '/ˈɪnfluənsər ˈmɑːrkɪtɪŋ/', translation: 'Marketing de influencers', example: 'Influencer marketing expanded our reach', difficulty: 'beginner' },
          { term: 'A/B testing', pronunciation: '/ˌeɪ ˈbiː ˈtestɪŋ/', translation: 'Pruebas A/B', example: 'A/B testing helped us optimize the design', difficulty: 'intermediate' },
          { term: 'Return on investment (ROI)', pronunciation: '/rɪˈtɜːrn ɑːn ɪnˈvestmənt/', translation: 'Retorno de inversión', example: 'Calculate the ROI for each marketing channel', difficulty: 'intermediate' },
          { term: 'Omnichannel strategy', pronunciation: '/ˈɑːmnɪˌtʃænl ˈstrætədʒi/', translation: 'Estrategia omnicanal', example: 'Our omnichannel strategy connects all touchpoints', difficulty: 'advanced' },
          { term: 'Customer acquisition cost', pronunciation: '/ˈkʌstəmər ˌækwɪˈzɪʃn kɔːst/', translation: 'Costo de adquisición de clientes', example: 'We need to reduce customer acquisition cost', difficulty: 'advanced' },
          { term: 'Viral marketing', pronunciation: '/ˈvaɪrəl ˈmɑːrkɪtɪŋ/', translation: 'Marketing viral', example: 'The video achieved viral marketing success', difficulty: 'beginner' },
          { term: 'Brand loyalty', pronunciation: '/brænd ˈlɔɪəlti/', translation: 'Lealtad de marca', example: 'Building brand loyalty takes time and consistency', difficulty: 'intermediate' },
          { term: 'Landing page', pronunciation: '/ˈlændɪŋ peɪdʒ/', translation: 'Página de aterrizaje', example: 'The landing page converts 15% of visitors', difficulty: 'beginner' },
          { term: 'Email campaign', pronunciation: '/ˈiːmeɪl kæmˈpeɪn/', translation: 'Campaña de correo electrónico', example: 'Our email campaign reached 50,000 subscribers', difficulty: 'beginner' },
          { term: 'Market research', pronunciation: '/ˈmɑːrkɪt rɪˈsɜːrtʃ/', translation: 'Investigación de mercado', example: 'Market research revealed new opportunities', difficulty: 'intermediate' },
          { term: 'Retargeting ads', pronunciation: '/riːˈtɑːrɡɪtɪŋ ædz/', translation: 'Anuncios de retargeting', example: 'Retargeting ads brought back 30% of visitors', difficulty: 'intermediate' },
          { term: 'User-generated content', pronunciation: '/ˈjuːzər ˈdʒenəreɪtɪd ˈkɑːntent/', translation: 'Contenido generado por usuarios', example: 'User-generated content builds authenticity', difficulty: 'intermediate' },
          { term: 'Growth hacking', pronunciation: '/ɡroʊθ ˈhækɪŋ/', translation: 'Crecimiento acelerado', example: 'Growth hacking techniques boosted our user base', difficulty: 'advanced' },
          { term: 'Brand ambassador', pronunciation: '/brænd æmˈbæsədər/', translation: 'Embajador de marca', example: 'We hired brand ambassadors for the launch', difficulty: 'intermediate' },
          { term: 'Marketing funnel', pronunciation: '/ˈmɑːrkɪtɪŋ ˈfʌnl/', translation: 'Embudo de marketing', example: 'Optimize each stage of the marketing funnel', difficulty: 'intermediate' },
          { term: 'Social proof', pronunciation: '/ˈsoʊʃl pruːf/', translation: 'Prueba social', example: 'Customer testimonials provide social proof', difficulty: 'intermediate' },
          { term: 'Competitive advantage', pronunciation: '/kəmˈpetətɪv ədˈvæntɪdʒ/', translation: 'Ventaja competitiva', example: 'Our competitive advantage is customer service', difficulty: 'advanced' }
        ]
      },

      // 2. Administración y Gestión
      {
        category: 'Administración y Gestión',
        icon: '📊',
        terms: [
          { term: 'Strategic planning', pronunciation: '/strəˈtiːdʒɪk ˈplænɪŋ/', translation: 'Planificación estratégica', example: 'Strategic planning sessions happen quarterly', difficulty: 'intermediate' },
          { term: 'Resource allocation', pronunciation: '/ˈriːsɔːrs ˌæləˈkeɪʃn/', translation: 'Asignación de recursos', example: 'Resource allocation needs to be more efficient', difficulty: 'intermediate' },
          { term: 'Key performance indicator (KPI)', pronunciation: '/kiː pərˈfɔːrməns ˈɪndɪkeɪtər/', translation: 'Indicador clave de rendimiento', example: 'Track KPIs to measure progress', difficulty: 'intermediate' },
          { term: 'Stakeholder management', pronunciation: '/ˈsteɪkhoʊldər ˈmænɪdʒmənt/', translation: 'Gestión de partes interesadas', example: 'Stakeholder management is critical for success', difficulty: 'advanced' },
          { term: 'Performance review', pronunciation: '/pərˈfɔːrməns rɪˈvjuː/', translation: 'Evaluación de desempeño', example: 'Annual performance reviews are next week', difficulty: 'intermediate' },
          { term: 'Project timeline', pronunciation: '/ˈprɑːdʒekt ˈtaɪmlaɪn/', translation: 'Cronograma del proyecto', example: 'The project timeline is very tight', difficulty: 'beginner' },
          { term: 'Risk assessment', pronunciation: '/rɪsk əˈsesmənt/', translation: 'Evaluación de riesgos', example: 'Conduct a risk assessment before proceeding', difficulty: 'intermediate' },
          { term: 'Change management', pronunciation: '/tʃeɪndʒ ˈmænɪdʒmənt/', translation: 'Gestión del cambio', example: 'Change management requires clear communication', difficulty: 'advanced' },
          { term: 'Budget forecast', pronunciation: '/ˈbʌdʒɪt ˈfɔːrkæst/', translation: 'Pronóstico presupuestario', example: 'Update the budget forecast for Q2', difficulty: 'intermediate' },
          { term: 'Team building', pronunciation: '/tiːm ˈbɪldɪŋ/', translation: 'Construcción de equipos', example: 'Team building activities improve collaboration', difficulty: 'beginner' },
          { term: 'Delegation skills', pronunciation: '/ˌdelɪˈɡeɪʃn skɪlz/', translation: 'Habilidades de delegación', example: 'Effective delegation skills are essential for leaders', difficulty: 'intermediate' },
          { term: 'Cross-functional team', pronunciation: '/krɔːs ˈfʌŋkʃənl tiːm/', translation: 'Equipo multifuncional', example: 'Form a cross-functional team for the initiative', difficulty: 'intermediate' },
          { term: 'Business continuity', pronunciation: '/ˈbɪznəs ˌkɑːntɪˈnuːəti/', translation: 'Continuidad del negocio', example: 'Business continuity planning is a priority', difficulty: 'advanced' },
          { term: 'Operational efficiency', pronunciation: '/ˌɑːpəˈreɪʃənl ɪˈfɪʃnsi/', translation: 'Eficiencia operativa', example: 'Improve operational efficiency by 20%', difficulty: 'intermediate' },
          { term: 'Workflow optimization', pronunciation: '/ˈwɜːrkfloʊ ˌɑːptɪməˈzeɪʃn/', translation: 'Optimización del flujo de trabajo', example: 'Workflow optimization reduced processing time', difficulty: 'intermediate' },
          { term: 'Decision-making process', pronunciation: '/dɪˈsɪʒn ˈmeɪkɪŋ ˈprɑːses/', translation: 'Proceso de toma de decisiones', example: 'Our decision-making process is data-driven', difficulty: 'intermediate' },
          { term: 'Organizational structure', pronunciation: '/ˌɔːrɡənəˈzeɪʃənl ˈstrʌktʃər/', translation: 'Estructura organizacional', example: 'The organizational structure needs updating', difficulty: 'intermediate' },
          { term: 'Executive summary', pronunciation: '/ɪɡˈzekjətɪv ˈsʌməri/', translation: 'Resumen ejecutivo', example: 'Prepare an executive summary for the board', difficulty: 'advanced' },
          { term: 'Milestone tracking', pronunciation: '/ˈmaɪlstoʊn ˈtrækɪŋ/', translation: 'Seguimiento de hitos', example: 'Milestone tracking keeps projects on schedule', difficulty: 'intermediate' },
          { term: 'Accountability framework', pronunciation: '/əˌkaʊntəˈbɪləti ˈfreɪmwɜːrk/', translation: 'Marco de responsabilidad', example: 'Establish a clear accountability framework', difficulty: 'advanced' },
          { term: 'Leadership development', pronunciation: '/ˈliːdərʃɪp dɪˈveləpmənt/', translation: 'Desarrollo de liderazgo', example: 'Invest in leadership development programs', difficulty: 'intermediate' },
          { term: 'Best practices', pronunciation: '/best ˈpræktɪsɪz/', translation: 'Mejores prácticas', example: 'Share best practices across departments', difficulty: 'intermediate' },
          { term: 'Capacity planning', pronunciation: '/kəˈpæsəti ˈplænɪŋ/', translation: 'Planificación de capacidad', example: 'Capacity planning ensures we meet demand', difficulty: 'intermediate' },
          { term: 'Performance metrics', pronunciation: '/pərˈfɔːrməns ˈmetrɪks/', translation: 'Métricas de rendimiento', example: 'Review performance metrics monthly', difficulty: 'intermediate' },
          { term: 'Quality assurance', pronunciation: '/ˈkwɑːləti əˈʃʊrəns/', translation: 'Aseguramiento de calidad', example: 'Quality assurance is part of every process', difficulty: 'intermediate' },
          { term: 'Time management', pronunciation: '/taɪm ˈmænɪdʒmənt/', translation: 'Gestión del tiempo', example: 'Good time management increases productivity', difficulty: 'beginner' },
          { term: 'Priority setting', pronunciation: '/praɪˈɔːrəti ˈsetɪŋ/', translation: 'Establecimiento de prioridades', example: 'Priority setting helps focus efforts', difficulty: 'intermediate' },
          { term: 'Meeting agenda', pronunciation: '/ˈmiːtɪŋ əˈdʒendə/', translation: 'Agenda de reunión', example: 'Send the meeting agenda in advance', difficulty: 'beginner' },
          { term: 'Action items', pronunciation: '/ˈækʃn ˈaɪtəmz/', translation: 'Elementos de acción', example: 'Document all action items from the meeting', difficulty: 'beginner' },
          { term: 'Progress report', pronunciation: '/ˈprɑːɡres rɪˈpɔːrt/', translation: 'Informe de progreso', example: 'Submit a progress report by Friday', difficulty: 'beginner' }
        ]
      },

      // 3. Ventas y Negocios
      {
        category: 'Ventas y Negocios',
        icon: '💼',
        terms: [
          { term: 'Sales pipeline', pronunciation: '/seɪlz ˈpaɪplaɪn/', translation: 'Pipeline de ventas', example: 'Our sales pipeline has 50 active leads', difficulty: 'intermediate' },
          { term: 'Closing rate', pronunciation: '/ˈkloʊzɪŋ reɪt/', translation: 'Tasa de cierre', example: 'The closing rate improved to 35%', difficulty: 'intermediate' },
          { term: 'Cold calling', pronunciation: '/koʊld ˈkɔːlɪŋ/', translation: 'Llamadas en frío', example: 'Cold calling is still effective for B2B', difficulty: 'beginner' },
          { term: 'Sales forecast', pronunciation: '/seɪlz ˈfɔːrkæst/', translation: 'Pronóstico de ventas', example: 'Update the sales forecast for Q3', difficulty: 'intermediate' },
          { term: 'Customer retention', pronunciation: '/ˈkʌstəmər rɪˈtenʃn/', translation: 'Retención de clientes', example: 'Customer retention is more profitable than acquisition', difficulty: 'intermediate' },
          { term: 'Upselling opportunity', pronunciation: '/ˌʌpˈselɪŋ ˌɑːpərˈtuːnəti/', translation: 'Oportunidad de venta adicional', example: 'Identify upselling opportunities with existing clients', difficulty: 'intermediate' },
          { term: 'Negotiation tactics', pronunciation: '/nɪˌɡoʊʃiˈeɪʃn ˈtæktɪks/', translation: 'Tácticas de negociación', example: 'Learn effective negotiation tactics', difficulty: 'intermediate' },
          { term: 'Deal structure', pronunciation: '/diːl ˈstrʌktʃər/', translation: 'Estructura del acuerdo', example: 'The deal structure works for both parties', difficulty: 'advanced' },
          { term: 'Pricing strategy', pronunciation: '/ˈpraɪsɪŋ ˈstrætədʒi/', translation: 'Estrategia de precios', example: 'Review our pricing strategy quarterly', difficulty: 'intermediate' },
          { term: 'Sales quota', pronunciation: '/seɪlz ˈkwoʊtə/', translation: 'Cuota de ventas', example: 'I exceeded my sales quota this month', difficulty: 'intermediate' },
          { term: 'Prospecting', pronunciation: '/ˈprɑːspektɪŋ/', translation: 'Prospección', example: 'Prospecting is the first step in sales', difficulty: 'intermediate' },
          { term: 'Objection handling', pronunciation: '/əbˈdʒekʃn ˈhændlɪŋ/', translation: 'Manejo de objeciones', example: 'Objection handling is a crucial skill', difficulty: 'intermediate' },
          { term: 'Follow-up strategy', pronunciation: '/ˈfɑːloʊ ʌp ˈstrætədʒi/', translation: 'Estrategia de seguimiento', example: 'A solid follow-up strategy increases conversions', difficulty: 'intermediate' },
          { term: 'Referral program', pronunciation: '/rɪˈfɜːrəl ˈproʊɡræm/', translation: 'Programa de referencias', example: 'Our referral program generates 20% of new leads', difficulty: 'intermediate' },
          { term: 'Sales funnel', pronunciation: '/seɪlz ˈfʌnl/', translation: 'Embudo de ventas', example: 'Optimize each stage of the sales funnel', difficulty: 'intermediate' },
          { term: 'Account management', pronunciation: '/əˈkaʊnt ˈmænɪdʒmənt/', translation: 'Gestión de cuentas', example: 'Account management keeps clients satisfied', difficulty: 'intermediate' },
          { term: 'Revenue growth', pronunciation: '/ˈrevənuː ɡroʊθ/', translation: 'Crecimiento de ingresos', example: 'We achieved 40% revenue growth this year', difficulty: 'intermediate' },
          { term: 'Market penetration', pronunciation: '/ˈmɑːrkɪt ˌpenəˈtreɪʃn/', translation: 'Penetración de mercado', example: 'Market penetration increased in Asia', difficulty: 'advanced' },
          { term: 'Competitive pricing', pronunciation: '/kəmˈpetətɪv ˈpraɪsɪŋ/', translation: 'Precios competitivos', example: 'Our competitive pricing attracts more clients', difficulty: 'intermediate' },
          { term: 'Partnership agreement', pronunciation: '/ˈpɑːrtnərʃɪp əˈɡriːmənt/', translation: 'Acuerdo de asociación', example: 'Sign the partnership agreement next week', difficulty: 'advanced' },
          { term: 'Sales territory', pronunciation: '/seɪlz ˈterətɔːri/', translation: 'Territorio de ventas', example: 'Each rep has a defined sales territory', difficulty: 'intermediate' },
          { term: 'Customer testimonial', pronunciation: '/ˈkʌstəmər ˌtestɪˈmoʊniəl/', translation: 'Testimonio de cliente', example: 'Customer testimonials build trust', difficulty: 'beginner' },
          { term: 'Value-based selling', pronunciation: '/ˈvæljuː beɪst ˈselɪŋ/', translation: 'Venta basada en valor', example: 'Value-based selling focuses on benefits', difficulty: 'advanced' },
          { term: 'Contract negotiation', pronunciation: '/ˈkɑːntrækt nɪˌɡoʊʃiˈeɪʃn/', translation: 'Negociación de contratos', example: 'Contract negotiation took three weeks', difficulty: 'advanced' },
          { term: 'Commission structure', pronunciation: '/kəˈmɪʃn ˈstrʌktʃər/', translation: 'Estructura de comisiones', example: 'The commission structure motivates the team', difficulty: 'intermediate' },
          { term: 'Business development', pronunciation: '/ˈbɪznəs dɪˈveləpmənt/', translation: 'Desarrollo de negocios', example: 'Business development opened new markets', difficulty: 'intermediate' },
          { term: 'Strategic alliance', pronunciation: '/strəˈtiːdʒɪk əˈlaɪəns/', translation: 'Alianza estratégica', example: 'A strategic alliance expanded our reach', difficulty: 'advanced' },
          { term: 'Profit margin', pronunciation: '/ˈprɑːfɪt ˈmɑːrdʒɪn/', translation: 'Margen de beneficio', example: 'Improve the profit margin by 5%', difficulty: 'intermediate' },
          { term: 'Sales enablement', pronunciation: '/seɪlz ɪˈneɪblmənt/', translation: 'Habilitación de ventas', example: 'Sales enablement tools help reps close faster', difficulty: 'advanced' },
          { term: 'Win rate', pronunciation: '/wɪn reɪt/', translation: 'Tasa de éxito', example: 'Our win rate is 45% this quarter', difficulty: 'intermediate' }
        ]
      },

      // 4. Inteligencia Artificial y Tecnología
      {
        category: 'Inteligencia Artificial y Tecnología',
        icon: '🤖',
        terms: [
          { term: 'Machine learning', pronunciation: '/məˈʃiːn ˈlɜːrnɪŋ/', translation: 'Aprendizaje automático', example: 'Machine learning improves prediction accuracy', difficulty: 'intermediate' },
          { term: 'Neural network', pronunciation: '/ˈnʊrəl ˈnetwɜːrk/', translation: 'Red neuronal', example: 'Neural networks power image recognition', difficulty: 'advanced' },
          { term: 'Deep learning', pronunciation: '/diːp ˈlɜːrnɪŋ/', translation: 'Aprendizaje profundo', example: 'Deep learning models require large datasets', difficulty: 'advanced' },
          { term: 'Natural language processing', pronunciation: '/ˈnætʃrəl ˈlæŋɡwɪdʒ ˈprɑːsesɪŋ/', translation: 'Procesamiento de lenguaje natural', example: 'Natural language processing enables chatbots', difficulty: 'advanced' },
          { term: 'Data training', pronunciation: '/ˈdeɪtə ˈtreɪnɪŋ/', translation: 'Entrenamiento de datos', example: 'Data training takes several hours', difficulty: 'intermediate' },
          { term: 'Algorithm optimization', pronunciation: '/ˈælɡərɪðəm ˌɑːptɪməˈzeɪʃn/', translation: 'Optimización de algoritmos', example: 'Algorithm optimization improved performance', difficulty: 'advanced' },
          { term: 'Predictive analytics', pronunciation: '/prɪˈdɪktɪv ˌænəˈlɪtɪks/', translation: 'Analítica predictiva', example: 'Predictive analytics forecast customer behavior', difficulty: 'advanced' },
          { term: 'Computer vision', pronunciation: '/kəmˈpjuːtər ˈvɪʒn/', translation: 'Visión por computadora', example: 'Computer vision detects defects in products', difficulty: 'advanced' },
          { term: 'AI model', pronunciation: '/ˌeɪ ˈaɪ ˈmɑːdl/', translation: 'Modelo de IA', example: 'The AI model needs retraining', difficulty: 'intermediate' },
          { term: 'Training dataset', pronunciation: '/ˈtreɪnɪŋ ˈdeɪtəset/', translation: 'Conjunto de datos de entrenamiento', example: 'Prepare a diverse training dataset', difficulty: 'intermediate' },
          { term: 'Feature engineering', pronunciation: '/ˈfiːtʃər ˌendʒɪˈnɪrɪŋ/', translation: 'Ingeniería de características', example: 'Feature engineering improves model accuracy', difficulty: 'advanced' },
          { term: 'Deployment pipeline', pronunciation: '/dɪˈplɔɪmənt ˈpaɪplaɪn/', translation: 'Pipeline de despliegue', example: 'The deployment pipeline is automated', difficulty: 'intermediate' },
          { term: 'Cloud computing', pronunciation: '/klaʊd kəmˈpjuːtɪŋ/', translation: 'Computación en la nube', example: 'Cloud computing reduces infrastructure costs', difficulty: 'intermediate' },
          { term: 'API integration', pronunciation: '/ˌeɪ piː ˈaɪ ˌɪntɪˈɡreɪʃn/', translation: 'Integración de API', example: 'API integration connects our systems', difficulty: 'intermediate' },
          { term: 'Data pipeline', pronunciation: '/ˈdeɪtə ˈpaɪplaɪn/', translation: 'Pipeline de datos', example: 'The data pipeline processes millions of records', difficulty: 'intermediate' },
          { term: 'Model accuracy', pronunciation: '/ˈmɑːdl ˈækjərəsi/', translation: 'Precisión del modelo', example: 'Model accuracy reached 95%', difficulty: 'intermediate' },
          { term: 'Automation workflow', pronunciation: '/ˌɔːtəˈmeɪʃn ˈwɜːrkfloʊ/', translation: 'Flujo de trabajo automatizado', example: 'Automation workflow saves 10 hours weekly', difficulty: 'intermediate' },
          { term: 'Reinforcement learning', pronunciation: '/ˌriːɪnˈfɔːrsmənt ˈlɜːrnɪŋ/', translation: 'Aprendizaje por refuerzo', example: 'Reinforcement learning trains game-playing AI', difficulty: 'advanced' },
          { term: 'Supervised learning', pronunciation: '/ˈsuːpərvaɪzd ˈlɜːrnɪŋ/', translation: 'Aprendizaje supervisado', example: 'Supervised learning requires labeled data', difficulty: 'advanced' },
          { term: 'Unsupervised learning', pronunciation: '/ˌʌnsəˈpərvaɪzd ˈlɜːrnɪŋ/', translation: 'Aprendizaje no supervisado', example: 'Unsupervised learning finds hidden patterns', difficulty: 'advanced' },
          { term: 'Edge computing', pronunciation: '/edʒ kəmˈpjuːtɪŋ/', translation: 'Computación en el borde', example: 'Edge computing reduces latency', difficulty: 'advanced' },
          { term: 'Chatbot development', pronunciation: '/ˈtʃætbɑːt dɪˈveləpmənt/', translation: 'Desarrollo de chatbots', example: 'Chatbot development improves customer support', difficulty: 'intermediate' },
          { term: 'Data preprocessing', pronunciation: '/ˈdeɪtə ˈpriːˌprɑːsesɪŋ/', translation: 'Preprocesamiento de datos', example: 'Data preprocessing is essential for clean inputs', difficulty: 'intermediate' },
          { term: 'Model deployment', pronunciation: '/ˈmɑːdl dɪˈplɔɪmənt/', translation: 'Despliegue del modelo', example: 'Model deployment went smoothly', difficulty: 'intermediate' },
          { term: 'Transfer learning', pronunciation: '/ˈtrænsfɜːr ˈlɜːrnɪŋ/', translation: 'Aprendizaje por transferencia', example: 'Transfer learning speeds up development', difficulty: 'advanced' },
          { term: 'Generative AI', pronunciation: '/ˈdʒenərətɪv ˌeɪ ˈaɪ/', translation: 'IA generativa', example: 'Generative AI creates original content', difficulty: 'advanced' },
          { term: 'Large language model (LLM)', pronunciation: '/lɑːrdʒ ˈlæŋɡwɪdʒ ˈmɑːdl/', translation: 'Modelo de lenguaje grande', example: 'Large language models understand context', difficulty: 'advanced' },
          { term: 'Prompt engineering', pronunciation: '/prɑːmpt ˌendʒɪˈnɪrɪŋ/', translation: 'Ingeniería de prompts', example: 'Prompt engineering improves AI responses', difficulty: 'intermediate' },
          { term: 'Bias detection', pronunciation: '/ˈbaɪəs dɪˈtekʃn/', translation: 'Detección de sesgos', example: 'Bias detection ensures fairness in AI', difficulty: 'advanced' },
          { term: 'Scalability', pronunciation: '/ˌskeɪləˈbɪləti/', translation: 'Escalabilidad', example: 'Scalability is crucial for growth', difficulty: 'intermediate' }
        ]
      },

      // 5. Procesos y Operaciones
      {
        category: 'Procesos y Operaciones',
        icon: '⚙️',
        terms: [
          { term: 'Process improvement', pronunciation: '/ˈprɑːses ɪmˈpruːvmənt/', translation: 'Mejora de procesos', example: 'Process improvement reduced cycle time', difficulty: 'intermediate' },
          { term: 'Standard operating procedure', pronunciation: '/ˈstændərd ˈɑːpəreɪtɪŋ prəˈsiːdʒər/', translation: 'Procedimiento operativo estándar', example: 'Follow the standard operating procedure', difficulty: 'intermediate' },
          { term: 'Quality control', pronunciation: '/ˈkwɑːləti kənˈtroʊl/', translation: 'Control de calidad', example: 'Quality control inspects every unit', difficulty: 'intermediate' },
          { term: 'Lean methodology', pronunciation: '/liːn ˌmeθəˈdɑːlədʒi/', translation: 'Metodología lean', example: 'Lean methodology eliminates waste', difficulty: 'advanced' },
          { term: 'Six Sigma', pronunciation: '/sɪks ˈsɪɡmə/', translation: 'Six Sigma', example: 'Six Sigma certification improves quality', difficulty: 'advanced' },
          { term: 'Bottleneck analysis', pronunciation: '/ˈbɑːtlnek əˈnæləsɪs/', translation: 'Análisis de cuellos de botella', example: 'Bottleneck analysis identified delays', difficulty: 'intermediate' },
          { term: 'Throughput', pronunciation: '/ˈθruːpʊt/', translation: 'Rendimiento', example: 'Throughput increased by 25%', difficulty: 'intermediate' },
          { term: 'Cycle time', pronunciation: '/ˈsaɪkl taɪm/', translation: 'Tiempo de ciclo', example: 'Reduce cycle time to improve efficiency', difficulty: 'intermediate' },
          { term: 'Root cause analysis', pronunciation: '/ruːt kɔːz əˈnæləsɪs/', translation: 'Análisis de causa raíz', example: 'Root cause analysis prevents recurrence', difficulty: 'intermediate' },
          { term: 'Process mapping', pronunciation: '/ˈprɑːses ˈmæpɪŋ/', translation: 'Mapeo de procesos', example: 'Process mapping visualizes workflows', difficulty: 'intermediate' },
          { term: 'Continuous improvement', pronunciation: '/kənˈtɪnjuəs ɪmˈpruːvmənt/', translation: 'Mejora continua', example: 'Continuous improvement is part of our culture', difficulty: 'intermediate' },
          { term: 'Capacity utilization', pronunciation: '/kəˈpæsəti ˌjuːtələˈzeɪʃn/', translation: 'Utilización de capacidad', example: 'Capacity utilization reached 90%', difficulty: 'intermediate' },
          { term: 'Inventory management', pronunciation: '/ˈɪnvəntɔːri ˈmænɪdʒmənt/', translation: 'Gestión de inventario', example: 'Inventory management reduces storage costs', difficulty: 'intermediate' },
          { term: 'Production schedule', pronunciation: '/prəˈdʌkʃn ˈskedʒuːl/', translation: 'Programa de producción', example: 'Update the production schedule weekly', difficulty: 'beginner' },
          { term: 'Downtime reduction', pronunciation: '/ˈdaʊntaɪm rɪˈdʌkʃn/', translation: 'Reducción de tiempo de inactividad', example: 'Downtime reduction saved $50,000', difficulty: 'intermediate' },
          { term: 'Defect rate', pronunciation: '/ˈdiːfekt reɪt/', translation: 'Tasa de defectos', example: 'The defect rate dropped to 2%', difficulty: 'intermediate' },
          { term: 'Preventive maintenance', pronunciation: '/prɪˈventɪv ˈmeɪntənəns/', translation: 'Mantenimiento preventivo', example: 'Preventive maintenance avoids breakdowns', difficulty: 'intermediate' },
          { term: 'Supply chain optimization', pronunciation: '/səˈplaɪ tʃeɪn ˌɑːptɪməˈzeɪʃn/', translation: 'Optimización de cadena de suministro', example: 'Supply chain optimization cut delivery time', difficulty: 'advanced' },
          { term: 'Work order', pronunciation: '/wɜːrk ˈɔːrdər/', translation: 'Orden de trabajo', example: 'Issue a work order for repairs', difficulty: 'beginner' },
          { term: 'Safety compliance', pronunciation: '/ˈseɪfti kəmˈplaɪəns/', translation: 'Cumplimiento de seguridad', example: 'Safety compliance is our top priority', difficulty: 'intermediate' },
          { term: 'Equipment efficiency', pronunciation: '/ɪˈkwɪpmənt ɪˈfɪʃnsi/', translation: 'Eficiencia del equipo', example: 'Equipment efficiency improved with upgrades', difficulty: 'intermediate' },
          { term: 'Process audit', pronunciation: '/ˈprɑːses ˈɔːdɪt/', translation: 'Auditoría de procesos', example: 'Process audit revealed inefficiencies', difficulty: 'intermediate' },
          { term: 'Standardization', pronunciation: '/ˌstændərdəˈzeɪʃn/', translation: 'Estandarización', example: 'Standardization ensures consistency', difficulty: 'intermediate' },
          { term: 'Value stream mapping', pronunciation: '/ˈvæljuː striːm ˈmæpɪŋ/', translation: 'Mapeo de flujo de valor', example: 'Value stream mapping identifies waste', difficulty: 'advanced' },
          { term: 'Operational excellence', pronunciation: '/ˌɑːpəˈreɪʃənl ˈeksələns/', translation: 'Excelencia operacional', example: 'Operational excellence is our goal', difficulty: 'advanced' },
          { term: 'Key process indicator', pronunciation: '/kiː ˈprɑːses ˈɪndɪkeɪtər/', translation: 'Indicador clave de proceso', example: 'Track key process indicators daily', difficulty: 'intermediate' },
          { term: 'Batch processing', pronunciation: '/bætʃ ˈprɑːsesɪŋ/', translation: 'Procesamiento por lotes', example: 'Batch processing runs overnight', difficulty: 'intermediate' },
          { term: 'Just-in-time delivery', pronunciation: '/dʒʌst ɪn taɪm dɪˈlɪvəri/', translation: 'Entrega justo a tiempo', example: 'Just-in-time delivery reduces inventory', difficulty: 'intermediate' },
          { term: 'Workflow automation', pronunciation: '/ˈwɜːrkfloʊ ˌɔːtəˈmeɪʃn/', translation: 'Automatización del flujo de trabajo', example: 'Workflow automation saves 15 hours weekly', difficulty: 'intermediate' },
          { term: 'Efficiency ratio', pronunciation: '/ɪˈfɪʃnsi ˈreɪʃioʊ/', translation: 'Ratio de eficiencia', example: 'The efficiency ratio improved to 85%', difficulty: 'intermediate' }
        ]
      },

      // 6. Finanzas y Contabilidad
      {
        category: 'Finanzas y Contabilidad',
        icon: '💰',
        terms: [
          { term: 'Balance sheet', pronunciation: '/ˈbæləns ʃiːt/', translation: 'Balance general', example: 'Review the balance sheet quarterly', difficulty: 'intermediate' },
          { term: 'Cash flow', pronunciation: '/kæʃ floʊ/', translation: 'Flujo de efectivo', example: 'Monitor cash flow closely', difficulty: 'intermediate' },
          { term: 'Profit and loss statement', pronunciation: '/ˈprɑːfɪt ənd lɔːs ˈsteɪtmənt/', translation: 'Estado de pérdidas y ganancias', example: 'The profit and loss statement shows growth', difficulty: 'intermediate' },
          { term: 'Revenue recognition', pronunciation: '/ˈrevənuː ˌrekəɡˈnɪʃn/', translation: 'Reconocimiento de ingresos', example: 'Revenue recognition follows accounting standards', difficulty: 'advanced' },
          { term: 'Accounts receivable', pronunciation: '/əˈkaʊnts rɪˈsiːvəbl/', translation: 'Cuentas por cobrar', example: 'Accounts receivable are due next month', difficulty: 'intermediate' },
          { term: 'Accounts payable', pronunciation: '/əˈkaʊnts ˈpeɪəbl/', translation: 'Cuentas por pagar', example: 'Process accounts payable by Friday', difficulty: 'intermediate' },
          { term: 'Operating expenses', pronunciation: '/ˈɑːpəreɪtɪŋ ɪkˈspensɪz/', translation: 'Gastos operativos', example: 'Reduce operating expenses by 10%', difficulty: 'intermediate' },
          { term: 'Capital expenditure', pronunciation: '/ˈkæpɪtl ɪkˈspendɪtʃər/', translation: 'Gasto de capital', example: 'Approve capital expenditure for equipment', difficulty: 'advanced' },
          { term: 'Return on investment (ROI)', pronunciation: '/rɪˈtɜːrn ɑːn ɪnˈvestmənt/', translation: 'Retorno de inversión', example: 'Calculate ROI for each project', difficulty: 'intermediate' },
          { term: 'Gross margin', pronunciation: '/ɡroʊs ˈmɑːrdʒɪn/', translation: 'Margen bruto', example: 'Gross margin increased to 45%', difficulty: 'intermediate' },
          { term: 'Net income', pronunciation: '/net ˈɪnkʌm/', translation: 'Ingreso neto', example: 'Net income exceeded expectations', difficulty: 'intermediate' },
          { term: 'Financial forecast', pronunciation: '/faɪˈnænʃl ˈfɔːrkæst/', translation: 'Pronóstico financiero', example: 'Update the financial forecast monthly', difficulty: 'intermediate' },
          { term: 'Budget allocation', pronunciation: '/ˈbʌdʒɪt ˌæləˈkeɪʃn/', translation: 'Asignación presupuestaria', example: 'Budget allocation prioritizes marketing', difficulty: 'intermediate' },
          { term: 'Cost reduction', pronunciation: '/kɔːst rɪˈdʌkʃn/', translation: 'Reducción de costos', example: 'Cost reduction initiatives saved $100K', difficulty: 'intermediate' },
          { term: 'Financial audit', pronunciation: '/faɪˈnænʃl ˈɔːdɪt/', translation: 'Auditoría financiera', example: 'The financial audit is scheduled for May', difficulty: 'intermediate' },
          { term: 'Working capital', pronunciation: '/ˈwɜːrkɪŋ ˈkæpɪtl/', translation: 'Capital de trabajo', example: 'Working capital is sufficient for growth', difficulty: 'intermediate' },
          { term: 'Break-even analysis', pronunciation: '/ˌbreɪk ˈiːvən əˈnæləsɪs/', translation: 'Análisis de punto de equilibrio', example: 'Break-even analysis shows profitability timeline', difficulty: 'advanced' },
          { term: 'Asset valuation', pronunciation: '/ˈæset ˌvæljuˈeɪʃn/', translation: 'Valoración de activos', example: 'Asset valuation determines company worth', difficulty: 'advanced' },
          { term: 'Liability management', pronunciation: '/ˌlaɪəˈbɪləti ˈmænɪdʒmənt/', translation: 'Gestión de pasivos', example: 'Liability management reduces risk', difficulty: 'advanced' },
          { term: 'Tax compliance', pronunciation: '/tæks kəmˈplaɪəns/', translation: 'Cumplimiento fiscal', example: 'Tax compliance is mandatory', difficulty: 'intermediate' },
          { term: 'Depreciation', pronunciation: '/dɪˌpriːʃiˈeɪʃn/', translation: 'Depreciación', example: 'Calculate depreciation on equipment', difficulty: 'intermediate' },
          { term: 'Equity financing', pronunciation: '/ˈekwəti ˈfaɪnænsɪŋ/', translation: 'Financiamiento de capital', example: 'Equity financing raised $2 million', difficulty: 'advanced' },
          { term: 'Debt financing', pronunciation: '/det ˈfaɪnænsɪŋ/', translation: 'Financiamiento de deuda', example: 'Debt financing has lower interest rates', difficulty: 'advanced' },
          { term: 'Financial ratios', pronunciation: '/faɪˈnænʃl ˈreɪʃioʊz/', translation: 'Ratios financieros', example: 'Analyze financial ratios for performance', difficulty: 'intermediate' },
          { term: 'Accrual accounting', pronunciation: '/əˈkruːəl əˈkaʊntɪŋ/', translation: 'Contabilidad de devengo', example: 'Accrual accounting matches revenue and expenses', difficulty: 'advanced' },
          { term: 'Invoice processing', pronunciation: '/ˈɪnvɔɪs ˈprɑːsesɪŋ/', translation: 'Procesamiento de facturas', example: 'Invoice processing is automated', difficulty: 'beginner' },
          { term: 'Budget variance', pronunciation: '/ˈbʌdʒɪt ˈveriəns/', translation: 'Variación presupuestaria', example: 'Budget variance analysis shows overspending', difficulty: 'intermediate' },
          { term: 'Financial planning', pronunciation: '/faɪˈnænʃl ˈplænɪŋ/', translation: 'Planificación financiera', example: 'Financial planning ensures sustainability', difficulty: 'intermediate' },
          { term: 'Cost accounting', pronunciation: '/kɔːst əˈkaʊntɪŋ/', translation: 'Contabilidad de costos', example: 'Cost accounting tracks production expenses', difficulty: 'intermediate' },
          { term: 'Profitability analysis', pronunciation: '/ˌprɑːfɪtəˈbɪləti əˈnæləsɪs/', translation: 'Análisis de rentabilidad', example: 'Profitability analysis guides decisions', difficulty: 'intermediate' }
        ]
      },

      // 7. Recursos Humanos
      {
        category: 'Recursos Humanos',
        icon: '👥',
        terms: [
          { term: 'Talent acquisition', pronunciation: '/ˈtælənt ˌækwɪˈzɪʃn/', translation: 'Adquisición de talento', example: 'Talent acquisition is competitive right now', difficulty: 'intermediate' },
          { term: 'Employee engagement', pronunciation: '/ɪmˈplɔɪiː ɪnˈɡeɪdʒmənt/', translation: 'Compromiso del empleado', example: 'Employee engagement scores improved', difficulty: 'intermediate' },
          { term: 'Performance appraisal', pronunciation: '/pərˈfɔːrməns əˈpreɪzl/', translation: 'Evaluación de desempeño', example: 'Performance appraisal happens annually', difficulty: 'intermediate' },
          { term: 'Onboarding process', pronunciation: '/ˈɑːnbɔːrdɪŋ ˈprɑːses/', translation: 'Proceso de incorporación', example: 'The onboarding process takes two weeks', difficulty: 'intermediate' },
          { term: 'Employee retention', pronunciation: '/ɪmˈplɔɪiː rɪˈtenʃn/', translation: 'Retención de empleados', example: 'Employee retention improved this year', difficulty: 'intermediate' },
          { term: 'Compensation package', pronunciation: '/ˌkɑːmpenˈseɪʃn ˈpækɪdʒ/', translation: 'Paquete de compensación', example: 'Review the compensation package offer', difficulty: 'intermediate' },
          { term: 'Benefits administration', pronunciation: '/ˈbenɪfɪts ədˌmɪnɪˈstreɪʃn/', translation: 'Administración de beneficios', example: 'Benefits administration is handled by HR', difficulty: 'intermediate' },
          { term: 'Succession planning', pronunciation: '/səkˈseʃn ˈplænɪŋ/', translation: 'Planificación de sucesión', example: 'Succession planning prepares future leaders', difficulty: 'advanced' },
          { term: 'Career development', pronunciation: '/kəˈrɪr dɪˈveləpmənt/', translation: 'Desarrollo profesional', example: 'Career development programs are available', difficulty: 'intermediate' },
          { term: 'Workplace culture', pronunciation: '/ˈwɜːrkpleɪs ˈkʌltʃər/', translation: 'Cultura laboral', example: 'Workplace culture impacts productivity', difficulty: 'intermediate' },
          { term: 'Employee handbook', pronunciation: '/ɪmˈplɔɪiː ˈhændbʊk/', translation: 'Manual del empleado', example: 'Read the employee handbook carefully', difficulty: 'beginner' },
          { term: 'Job description', pronunciation: '/dʒɑːb dɪˈskrɪpʃn/', translation: 'Descripción del puesto', example: 'Update the job description for clarity', difficulty: 'beginner' },
          { term: 'Recruitment strategy', pronunciation: '/rɪˈkruːtmənt ˈstrætədʒi/', translation: 'Estrategia de reclutamiento', example: 'Our recruitment strategy focuses on diversity', difficulty: 'intermediate' },
          { term: 'Exit interview', pronunciation: '/ˈeksɪt ˈɪntərvjuː/', translation: 'Entrevista de salida', example: 'Exit interviews provide valuable feedback', difficulty: 'intermediate' },
          { term: 'Professional development', pronunciation: '/prəˈfeʃənl dɪˈveləpmənt/', translation: 'Desarrollo profesional', example: 'Professional development is encouraged', difficulty: 'intermediate' },
          { term: 'Work-life balance', pronunciation: '/wɜːrk laɪf ˈbæləns/', translation: 'Equilibrio trabajo-vida', example: 'Work-life balance is important for retention', difficulty: 'intermediate' },
          { term: 'Diversity and inclusion', pronunciation: '/dɪˈvɜːrsəti ənd ɪnˈkluːʒn/', translation: 'Diversidad e inclusión', example: 'Diversity and inclusion initiatives are expanding', difficulty: 'intermediate' },
          { term: 'Conflict resolution', pronunciation: '/ˈkɑːnflɪkt ˌrezəˈluːʃn/', translation: 'Resolución de conflictos', example: 'Conflict resolution training is mandatory', difficulty: 'intermediate' },
          { term: 'Employee turnover', pronunciation: '/ɪmˈplɔɪiː ˈtɜːrnoʊvər/', translation: 'Rotación de empleados', example: 'Employee turnover decreased by 15%', difficulty: 'intermediate' },
          { term: 'Payroll processing', pronunciation: '/ˈpeɪroʊl ˈprɑːsesɪŋ/', translation: 'Procesamiento de nómina', example: 'Payroll processing happens bi-weekly', difficulty: 'beginner' },
          { term: 'Training program', pronunciation: '/ˈtreɪnɪŋ ˈproʊɡræm/', translation: 'Programa de capacitación', example: 'Enroll in the training program next month', difficulty: 'beginner' },
          { term: 'Remote work policy', pronunciation: '/rɪˈmoʊt wɜːrk ˈpɑːləsi/', translation: 'Política de trabajo remoto', example: 'The remote work policy is flexible', difficulty: 'beginner' },
          { term: 'Performance metrics', pronunciation: '/pərˈfɔːrməns ˈmetrɪks/', translation: 'Métricas de desempeño', example: 'Track performance metrics monthly', difficulty: 'intermediate' },
          { term: 'Team dynamics', pronunciation: '/tiːm daɪˈnæmɪks/', translation: 'Dinámica de equipo', example: 'Team dynamics affect collaboration', difficulty: 'intermediate' },
          { term: 'Leadership training', pronunciation: '/ˈliːdərʃɪp ˈtreɪnɪŋ/', translation: 'Capacitación en liderazgo', example: 'Leadership training develops managers', difficulty: 'intermediate' },
          { term: 'Employee satisfaction', pronunciation: '/ɪmˈplɔɪiː ˌsætɪsˈfækʃn/', translation: 'Satisfacción del empleado', example: 'Employee satisfaction survey results are in', difficulty: 'intermediate' },
          { term: 'Competency framework', pronunciation: '/ˈkɑːmpɪtənsi ˈfreɪmwɜːrk/', translation: 'Marco de competencias', example: 'Use the competency framework for hiring', difficulty: 'advanced' },
          { term: 'Workforce planning', pronunciation: '/ˈwɜːrkfɔːrs ˈplænɪŋ/', translation: 'Planificación de la fuerza laboral', example: 'Workforce planning anticipates future needs', difficulty: 'intermediate' },
          { term: 'Employee referral', pronunciation: '/ɪmˈplɔɪiː rɪˈfɜːrəl/', translation: 'Referencia de empleado', example: 'Employee referral bonuses are offered', difficulty: 'beginner' },
          { term: 'Organizational development', pronunciation: '/ˌɔːrɡənəˈzeɪʃənl dɪˈveləpmənt/', translation: 'Desarrollo organizacional', example: 'Organizational development drives transformation', difficulty: 'advanced' }
        ]
      },

      // 8. Atención al Cliente
      {
        category: 'Atención al Cliente',
        icon: '🤝',
        terms: [
          { term: 'Customer satisfaction', pronunciation: '/ˈkʌstəmər ˌsætɪsˈfækʃn/', translation: 'Satisfacción del cliente', example: 'Customer satisfaction scores are high', difficulty: 'intermediate' },
          { term: 'Service level agreement (SLA)', pronunciation: '/ˈsɜːrvɪs ˈlevl əˈɡriːmənt/', translation: 'Acuerdo de nivel de servicio', example: 'We met our SLA targets this month', difficulty: 'advanced' },
          { term: 'First response time', pronunciation: '/fɜːrst rɪˈspɑːns taɪm/', translation: 'Tiempo de primera respuesta', example: 'Reduce first response time to under 2 hours', difficulty: 'intermediate' },
          { term: 'Customer feedback', pronunciation: '/ˈkʌstəmər ˈfiːdbæk/', translation: 'Retroalimentación del cliente', example: 'Customer feedback helps us improve', difficulty: 'beginner' },
          { term: 'Issue resolution', pronunciation: '/ˈɪʃuː ˌrezəˈluːʃn/', translation: 'Resolución de problemas', example: 'Issue resolution time improved by 30%', difficulty: 'intermediate' },
          { term: 'Support ticket', pronunciation: '/səˈpɔːrt ˈtɪkɪt/', translation: 'Ticket de soporte', example: 'Close the support ticket after solving it', difficulty: 'beginner' },
          { term: 'Customer experience', pronunciation: '/ˈkʌstəmər ɪkˈspɪriəns/', translation: 'Experiencia del cliente', example: 'Customer experience is our priority', difficulty: 'intermediate' },
          { term: 'Complaint handling', pronunciation: '/kəmˈpleɪnt ˈhændlɪŋ/', translation: 'Manejo de quejas', example: 'Complaint handling requires empathy', difficulty: 'intermediate' },
          { term: 'Live chat support', pronunciation: '/laɪv tʃæt səˈpɔːrt/', translation: 'Soporte por chat en vivo', example: 'Live chat support is available 24/7', difficulty: 'beginner' },
          { term: 'Customer loyalty', pronunciation: '/ˈkʌstəmər ˈlɔɪəlti/', translation: 'Lealtad del cliente', example: 'Customer loyalty programs increase retention', difficulty: 'intermediate' },
          { term: 'Net promoter score (NPS)', pronunciation: '/net prəˈmoʊtər skɔːr/', translation: 'Puntaje neto de promotores', example: 'Our NPS improved to 72', difficulty: 'advanced' },
          { term: 'Escalation process', pronunciation: '/ˌeskəˈleɪʃn ˈprɑːses/', translation: 'Proceso de escalamiento', example: 'Follow the escalation process for urgent issues', difficulty: 'intermediate' },
          { term: 'Knowledge base', pronunciation: '/ˈnɑːlɪdʒ beɪs/', translation: 'Base de conocimiento', example: 'Update the knowledge base regularly', difficulty: 'intermediate' },
          { term: 'Self-service portal', pronunciation: '/self ˈsɜːrvɪs ˈpɔːrtl/', translation: 'Portal de autoservicio', example: 'The self-service portal reduces ticket volume', difficulty: 'intermediate' },
          { term: 'Response template', pronunciation: '/rɪˈspɑːns ˈtempleɪt/', translation: 'Plantilla de respuesta', example: 'Use response templates for common questions', difficulty: 'beginner' },
          { term: 'Customer retention', pronunciation: '/ˈkʌstəmər rɪˈtenʃn/', translation: 'Retención de clientes', example: 'Customer retention improved by 20%', difficulty: 'intermediate' },
          { term: 'Proactive support', pronunciation: '/proʊˈæktɪv səˈpɔːrt/', translation: 'Soporte proactivo', example: 'Proactive support prevents issues', difficulty: 'intermediate' },
          { term: 'Follow-up call', pronunciation: '/ˈfɑːloʊ ʌp kɔːl/', translation: 'Llamada de seguimiento', example: 'Schedule a follow-up call with the client', difficulty: 'beginner' },
          { term: 'Quality assurance', pronunciation: '/ˈkwɑːləti əˈʃʊrəns/', translation: 'Aseguramiento de calidad', example: 'Quality assurance monitors all interactions', difficulty: 'intermediate' },
          { term: 'Customer churn', pronunciation: '/ˈkʌstəmər tʃɜːrn/', translation: 'Abandono de clientes', example: 'Reduce customer churn with better service', difficulty: 'intermediate' },
          { term: 'Call center metrics', pronunciation: '/kɔːl ˈsentər ˈmetrɪks/', translation: 'Métricas de centro de llamadas', example: 'Review call center metrics weekly', difficulty: 'intermediate' },
          { term: 'Customer advocate', pronunciation: '/ˈkʌstəmər ˈædvəkət/', translation: 'Defensor del cliente', example: 'Become a customer advocate in your role', difficulty: 'intermediate' },
          { term: 'Empathy statement', pronunciation: '/ˈempəθi ˈsteɪtmənt/', translation: 'Declaración de empatía', example: 'Use empathy statements when handling complaints', difficulty: 'intermediate' },
          { term: 'Resolution rate', pronunciation: '/ˌrezəˈluːʃn reɪt/', translation: 'Tasa de resolución', example: 'Our resolution rate is 95%', difficulty: 'intermediate' },
          { term: 'Customer journey map', pronunciation: '/ˈkʌstəmər ˈdʒɜːrni mæp/', translation: 'Mapa del viaje del cliente', example: 'Create a customer journey map', difficulty: 'advanced' },
          { term: 'Service recovery', pronunciation: '/ˈsɜːrvɪs rɪˈkʌvəri/', translation: 'Recuperación del servicio', example: 'Service recovery turns complaints into loyalty', difficulty: 'intermediate' },
          { term: 'Average handle time', pronunciation: '/ˈævərɪdʒ ˈhændl taɪm/', translation: 'Tiempo promedio de manejo', example: 'Average handle time is 8 minutes', difficulty: 'intermediate' },
          { term: 'Customer touchpoint', pronunciation: '/ˈkʌstəmər ˈtʌtʃpɔɪnt/', translation: 'Punto de contacto del cliente', example: 'Optimize every customer touchpoint', difficulty: 'intermediate' },
          { term: 'Feedback loop', pronunciation: '/ˈfiːdbæk luːp/', translation: 'Ciclo de retroalimentación', example: 'Establish a feedback loop with customers', difficulty: 'intermediate' },
          { term: 'Customer success manager', pronunciation: '/ˈkʌstəmər səkˈses ˈmænɪdʒər/', translation: 'Gerente de éxito del cliente', example: 'The customer success manager ensures adoption', difficulty: 'intermediate' }
        ]
      },

      // 9. Logística y Cadena de Suministro
      {
        category: 'Logística y Cadena de Suministro',
        icon: '📦',
        terms: [
          { term: 'Supply chain management', pronunciation: '/səˈplaɪ tʃeɪn ˈmænɪdʒmənt/', translation: 'Gestión de cadena de suministro', example: 'Supply chain management optimizes delivery', difficulty: 'intermediate' },
          { term: 'Inventory turnover', pronunciation: '/ˈɪnvəntɔːri ˈtɜːrnoʊvər/', translation: 'Rotación de inventario', example: 'Inventory turnover increased this quarter', difficulty: 'intermediate' },
          { term: 'Distribution network', pronunciation: '/ˌdɪstrɪˈbjuːʃn ˈnetwɜːrk/', translation: 'Red de distribución', example: 'Expand the distribution network to Asia', difficulty: 'intermediate' },
          { term: 'Lead time', pronunciation: '/liːd taɪm/', translation: 'Tiempo de entrega', example: 'Reduce lead time to 5 days', difficulty: 'intermediate' },
          { term: 'Freight forwarding', pronunciation: '/freɪt ˈfɔːrwərdɪŋ/', translation: 'Transporte de carga', example: 'Freight forwarding handles international shipping', difficulty: 'advanced' },
          { term: 'Warehouse management', pronunciation: '/ˈwerhɑʊs ˈmænɪdʒmənt/', translation: 'Gestión de almacén', example: 'Warehouse management systems track inventory', difficulty: 'intermediate' },
          { term: 'Order fulfillment', pronunciation: '/ˈɔːrdər fʊlˈfɪlmənt/', translation: 'Cumplimiento de pedidos', example: 'Order fulfillment takes 24 hours', difficulty: 'intermediate' },
          { term: 'Last-mile delivery', pronunciation: '/læst maɪl dɪˈlɪvəri/', translation: 'Entrega de última milla', example: 'Last-mile delivery is the most expensive part', difficulty: 'intermediate' },
          { term: 'Procurement process', pronunciation: '/prəˈkjʊrmənt ˈprɑːses/', translation: 'Proceso de adquisición', example: 'The procurement process takes three weeks', difficulty: 'intermediate' },
          { term: 'Vendor management', pronunciation: '/ˈvendər ˈmænɪdʒmənt/', translation: 'Gestión de proveedores', example: 'Vendor management ensures quality', difficulty: 'intermediate' },
          { term: 'Shipping logistics', pronunciation: '/ˈʃɪpɪŋ loʊˈdʒɪstɪks/', translation: 'Logística de envío', example: 'Shipping logistics coordinate global deliveries', difficulty: 'intermediate' },
          { term: 'Demand forecasting', pronunciation: '/dɪˈmænd ˈfɔːrkæstɪŋ/', translation: 'Pronóstico de demanda', example: 'Demand forecasting uses historical data', difficulty: 'intermediate' },
          { term: 'Stock level', pronunciation: '/stɑːk ˈlevl/', translation: 'Nivel de stock', example: 'Monitor stock levels to avoid shortages', difficulty: 'beginner' },
          { term: 'Transportation cost', pronunciation: '/ˌtrænspərˈteɪʃn kɔːst/', translation: 'Costo de transporte', example: 'Transportation costs increased 10%', difficulty: 'intermediate' },
          { term: 'Cross-docking', pronunciation: '/krɔːs ˈdɑːkɪŋ/', translation: 'Cross-docking', example: 'Cross-docking reduces storage time', difficulty: 'advanced' },
          { term: 'Bill of lading', pronunciation: '/bɪl əv ˈleɪdɪŋ/', translation: 'Conocimiento de embarque', example: 'Sign the bill of lading for the shipment', difficulty: 'advanced' },
          { term: 'Customs clearance', pronunciation: '/ˈkʌstəmz ˈklɪrəns/', translation: 'Despacho de aduana', example: 'Customs clearance delays the shipment', difficulty: 'intermediate' },
          { term: 'Third-party logistics (3PL)', pronunciation: '/θɜːrd ˈpɑːrti loʊˈdʒɪstɪks/', translation: 'Logística de terceros', example: 'Use a 3PL provider for warehousing', difficulty: 'advanced' },
          { term: 'Route optimization', pronunciation: '/ruːt ˌɑːptɪməˈzeɪʃn/', translation: 'Optimización de rutas', example: 'Route optimization saves fuel costs', difficulty: 'intermediate' },
          { term: 'Backorder', pronunciation: '/ˈbækˌɔːrdər/', translation: 'Pedido pendiente', example: 'The item is on backorder until Friday', difficulty: 'intermediate' },
          { term: 'Pallet', pronunciation: '/ˈpælət/', translation: 'Palé', example: 'Ship 20 pallets to the warehouse', difficulty: 'beginner' },
          { term: 'Supply chain visibility', pronunciation: '/səˈplaɪ tʃeɪn ˌvɪzəˈbɪləti/', translation: 'Visibilidad de cadena de suministro', example: 'Supply chain visibility improves planning', difficulty: 'advanced' },
          { term: 'Reverse logistics', pronunciation: '/rɪˈvɜːrs loʊˈdʒɪstɪks/', translation: 'Logística inversa', example: 'Reverse logistics handles returns', difficulty: 'advanced' },
          { term: 'Shipment tracking', pronunciation: '/ˈʃɪpmənt ˈtrækɪŋ/', translation: 'Seguimiento de envío', example: 'Shipment tracking provides real-time updates', difficulty: 'beginner' },
          { term: 'Safety stock', pronunciation: '/ˈseɪfti stɑːk/', translation: 'Stock de seguridad', example: 'Maintain safety stock for high-demand items', difficulty: 'intermediate' },
          { term: 'Bulk shipping', pronunciation: '/bʌlk ˈʃɪpɪŋ/', translation: 'Envío a granel', example: 'Bulk shipping reduces unit costs', difficulty: 'intermediate' },
          { term: 'Container load', pronunciation: '/kənˈteɪnər loʊd/', translation: 'Carga de contenedor', example: 'The container load arrives tomorrow', difficulty: 'beginner' },
          { term: 'Inbound logistics', pronunciation: '/ˈɪnbaʊnd loʊˈdʒɪstɪks/', translation: 'Logística de entrada', example: 'Inbound logistics manage supplier deliveries', difficulty: 'intermediate' },
          { term: 'Outbound logistics', pronunciation: '/ˈaʊtbaʊnd loʊˈdʒɪstɪks/', translation: 'Logística de salida', example: 'Outbound logistics handle customer shipments', difficulty: 'intermediate' },
          { term: 'Delivery schedule', pronunciation: '/dɪˈlɪvəri ˈskedʒuːl/', translation: 'Programa de entrega', example: 'Check the delivery schedule for updates', difficulty: 'beginner' }
        ]
      },

      // 10. Legal y Compliance
      {
        category: 'Legal y Compliance',
        icon: '⚖️',
        terms: [
          { term: 'Legal compliance', pronunciation: '/ˈliːɡl kəmˈplaɪəns/', translation: 'Cumplimiento legal', example: 'Legal compliance is mandatory for operations', difficulty: 'intermediate' },
          { term: 'Regulatory framework', pronunciation: '/ˈreɡjələtɔːri ˈfreɪmwɜːrk/', translation: 'Marco regulatorio', example: 'Understand the regulatory framework', difficulty: 'advanced' },
          { term: 'Confidentiality agreement', pronunciation: '/ˌkɑːnfɪˌdenʃiˈæləti əˈɡriːmənt/', translation: 'Acuerdo de confidencialidad', example: 'Sign the confidentiality agreement first', difficulty: 'intermediate' },
          { term: 'Intellectual property', pronunciation: '/ˌɪntəˈlektʃuəl ˈprɑːpərti/', translation: 'Propiedad intelectual', example: 'Protect intellectual property rights', difficulty: 'advanced' },
          { term: 'Contract terms', pronunciation: '/ˈkɑːntrækt tɜːrmz/', translation: 'Términos del contrato', example: 'Review the contract terms carefully', difficulty: 'intermediate' },
          { term: 'Due diligence', pronunciation: '/duː ˈdɪlɪdʒəns/', translation: 'Debida diligencia', example: 'Due diligence is required before acquisition', difficulty: 'advanced' },
          { term: 'Non-disclosure agreement (NDA)', pronunciation: '/nɑːn dɪsˈkloʊʒər əˈɡriːmənt/', translation: 'Acuerdo de no divulgación', example: 'All vendors must sign an NDA', difficulty: 'intermediate' },
          { term: 'Terms and conditions', pronunciation: '/tɜːrmz ənd kənˈdɪʃnz/', translation: 'Términos y condiciones', example: 'Read the terms and conditions before signing', difficulty: 'beginner' },
          { term: 'Risk mitigation', pronunciation: '/rɪsk ˌmɪtɪˈɡeɪʃn/', translation: 'Mitigación de riesgos', example: 'Risk mitigation strategies are in place', difficulty: 'advanced' },
          { term: 'Data protection', pronunciation: '/ˈdeɪtə prəˈtekʃn/', translation: 'Protección de datos', example: 'Data protection complies with GDPR', difficulty: 'intermediate' },
          { term: 'Liability clause', pronunciation: '/ˌlaɪəˈbɪləti klɔːz/', translation: 'Cláusula de responsabilidad', example: 'Review the liability clause in section 5', difficulty: 'advanced' },
          { term: 'Dispute resolution', pronunciation: '/dɪˈspjuːt ˌrezəˈluːʃn/', translation: 'Resolución de disputas', example: 'Dispute resolution is handled through arbitration', difficulty: 'advanced' },
          { term: 'Corporate governance', pronunciation: '/ˈkɔːrpərət ˈɡʌvərnəns/', translation: 'Gobierno corporativo', example: 'Corporate governance ensures accountability', difficulty: 'advanced' },
          { term: 'Compliance audit', pronunciation: '/kəmˈplaɪəns ˈɔːdɪt/', translation: 'Auditoría de cumplimiento', example: 'The compliance audit is next month', difficulty: 'intermediate' },
          { term: 'Employment law', pronunciation: '/ɪmˈplɔɪmənt lɔː/', translation: 'Ley laboral', example: 'Employment law protects workers\' rights', difficulty: 'intermediate' },
          { term: 'Breach of contract', pronunciation: '/briːtʃ əv ˈkɑːntrækt/', translation: 'Incumplimiento de contrato', example: 'Breach of contract has legal consequences', difficulty: 'advanced' },
          { term: 'Legal counsel', pronunciation: '/ˈliːɡl ˈkaʊnsl/', translation: 'Asesoría legal', example: 'Consult legal counsel before proceeding', difficulty: 'intermediate' },
          { term: 'Indemnity clause', pronunciation: '/ɪnˈdemnəti klɔːz/', translation: 'Cláusula de indemnización', example: 'The indemnity clause protects both parties', difficulty: 'advanced' },
          { term: 'Arbitration agreement', pronunciation: '/ˌɑːrbɪˈtreɪʃn əˈɡriːmənt/', translation: 'Acuerdo de arbitraje', example: 'Sign the arbitration agreement', difficulty: 'advanced' },
          { term: 'Privacy policy', pronunciation: '/ˈpraɪvəsi ˈpɑːləsi/', translation: 'Política de privacidad', example: 'Update the privacy policy to comply with regulations', difficulty: 'intermediate' },
          { term: 'Code of conduct', pronunciation: '/koʊd əv ˈkɑːndʌkt/', translation: 'Código de conducta', example: 'Follow the code of conduct at all times', difficulty: 'beginner' },
          { term: 'Whistleblower protection', pronunciation: '/ˈwɪslˌbloʊər prəˈtekʃn/', translation: 'Protección de denunciantes', example: 'Whistleblower protection is guaranteed', difficulty: 'advanced' },
          { term: 'Legal liability', pronunciation: '/ˈliːɡl ˌlaɪəˈbɪləti/', translation: 'Responsabilidad legal', example: 'Understand your legal liability', difficulty: 'advanced' },
          { term: 'Statutory requirement', pronunciation: '/ˈstætʃətɔːri rɪˈkwaɪərmənt/', translation: 'Requisito legal', example: 'Meet all statutory requirements', difficulty: 'advanced' },
          { term: 'Terms of service', pronunciation: '/tɜːrmz əv ˈsɜːrvɪs/', translation: 'Términos de servicio', example: 'Read the terms of service before using the app', difficulty: 'beginner' },
          { term: 'Compliance officer', pronunciation: '/kəmˈplaɪəns ˈɔːfɪsər/', translation: 'Oficial de cumplimiento', example: 'The compliance officer monitors regulations', difficulty: 'intermediate' },
          { term: 'Legal precedent', pronunciation: '/ˈliːɡl ˈpresɪdənt/', translation: 'Precedente legal', example: 'Legal precedent supports our case', difficulty: 'advanced' },
          { term: 'Licensing agreement', pronunciation: '/ˈlaɪsənsɪŋ əˈɡriːmənt/', translation: 'Acuerdo de licencia', example: 'Review the licensing agreement terms', difficulty: 'intermediate' },
          { term: 'Compliance training', pronunciation: '/kəmˈplaɪəns ˈtreɪnɪŋ/', translation: 'Capacitación en cumplimiento', example: 'Compliance training is required annually', difficulty: 'intermediate' },
          { term: 'Legal documentation', pronunciation: '/ˈliːɡl ˌdɑːkjumenˈteɪʃn/', translation: 'Documentación legal', example: 'File all legal documentation properly', difficulty: 'intermediate' }
        ]
      },

      // 11. Producción y Manufactura
      {
        category: 'Producción y Manufactura',
        icon: '🏭',
        terms: [
          { term: 'Production line', pronunciation: '/prəˈdʌkʃn laɪn/', translation: 'Línea de producción', example: 'The production line operates 24/7', difficulty: 'beginner' },
          { term: 'Manufacturing process', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ˈprɑːses/', translation: 'Proceso de manufactura', example: 'Optimize the manufacturing process', difficulty: 'intermediate' },
          { term: 'Quality inspection', pronunciation: '/ˈkwɑːləti ɪnˈspekʃn/', translation: 'Inspección de calidad', example: 'Quality inspection happens at every stage', difficulty: 'intermediate' },
          { term: 'Assembly line', pronunciation: '/əˈsembli laɪn/', translation: 'Línea de ensamblaje', example: 'Workers on the assembly line wear PPE', difficulty: 'beginner' },
          { term: 'Production capacity', pronunciation: '/prəˈdʌkʃn kəˈpæsəti/', translation: 'Capacidad de producción', example: 'Production capacity increased by 30%', difficulty: 'intermediate' },
          { term: 'Raw materials', pronunciation: '/rɔː məˈtɪriəlz/', translation: 'Materias primas', example: 'Order raw materials for next month', difficulty: 'beginner' },
          { term: 'Finished goods', pronunciation: '/ˈfɪnɪʃt ɡʊdz/', translation: 'Productos terminados', example: 'Finished goods are ready for shipment', difficulty: 'beginner' },
          { term: 'Machine downtime', pronunciation: '/məˈʃiːn ˈdaʊntaɪm/', translation: 'Tiempo de inactividad de máquina', example: 'Reduce machine downtime to 2%', difficulty: 'intermediate' },
          { term: 'Yield rate', pronunciation: '/jiːld reɪt/', translation: 'Tasa de rendimiento', example: 'The yield rate improved to 98%', difficulty: 'intermediate' },
          { term: 'Work in progress (WIP)', pronunciation: '/wɜːrk ɪn ˈprɑːɡres/', translation: 'Trabajo en progreso', example: 'Track WIP inventory daily', difficulty: 'intermediate' },
          { term: 'Batch production', pronunciation: '/bætʃ prəˈdʌkʃn/', translation: 'Producción por lotes', example: 'Batch production runs every Tuesday', difficulty: 'intermediate' },
          { term: 'Production schedule', pronunciation: '/prəˈdʌkʃn ˈskedʒuːl/', translation: 'Programa de producción', example: 'Update the production schedule weekly', difficulty: 'beginner' },
          { term: 'Scrap rate', pronunciation: '/skræp reɪt/', translation: 'Tasa de desperdicio', example: 'Lower the scrap rate to 3%', difficulty: 'intermediate' },
          { term: 'Tooling and fixtures', pronunciation: '/ˈtuːlɪŋ ənd ˈfɪkstʃərz/', translation: 'Herramientas y accesorios', example: 'Order new tooling and fixtures', difficulty: 'intermediate' },
          { term: 'Lean manufacturing', pronunciation: '/liːn ˌmænjəˈfæktʃərɪŋ/', translation: 'Manufactura lean', example: 'Lean manufacturing reduces waste', difficulty: 'advanced' },
          { term: 'Production output', pronunciation: '/prəˈdʌkʃn ˈaʊtpʊt/', translation: 'Producción total', example: 'Production output met targets', difficulty: 'intermediate' },
          { term: 'Quality standards', pronunciation: '/ˈkwɑːləti ˈstændərdz/', translation: 'Estándares de calidad', example: 'Meet all quality standards', difficulty: 'intermediate' },
          { term: 'Production cost', pronunciation: '/prəˈdʌkʃn kɔːst/', translation: 'Costo de producción', example: 'Production cost decreased by 12%', difficulty: 'intermediate' },
          { term: 'Continuous flow', pronunciation: '/kənˈtɪnjuəs floʊ/', translation: 'Flujo continuo', example: 'Continuous flow improves efficiency', difficulty: 'intermediate' },
          { term: 'First-pass yield', pronunciation: '/fɜːrst pæs jiːld/', translation: 'Rendimiento de primera pasada', example: 'First-pass yield is at 95%', difficulty: 'intermediate' },
          { term: 'Production planning', pronunciation: '/prəˈdʌkʃn ˈplænɪŋ/', translation: 'Planificación de producción', example: 'Production planning starts in January', difficulty: 'intermediate' },
          { term: 'Setup time', pronunciation: '/ˈsetʌp taɪm/', translation: 'Tiempo de configuración', example: 'Reduce setup time to 15 minutes', difficulty: 'intermediate' },
          { term: 'Process validation', pronunciation: '/ˈprɑːses ˌvælɪˈdeɪʃn/', translation: 'Validación de proceso', example: 'Process validation ensures consistency', difficulty: 'advanced' },
          { term: 'Material handling', pronunciation: '/məˈtɪriəl ˈhændlɪŋ/', translation: 'Manejo de materiales', example: 'Material handling equipment needs maintenance', difficulty: 'intermediate' },
          { term: 'Production efficiency', pronunciation: '/prəˈdʌkʃn ɪˈfɪʃnsi/', translation: 'Eficiencia de producción', example: 'Production efficiency reached 92%', difficulty: 'intermediate' },
          { term: 'Plant capacity', pronunciation: '/plænt kəˈpæsəti/', translation: 'Capacidad de planta', example: 'Plant capacity is fully utilized', difficulty: 'intermediate' },
          { term: 'Manufacturing overhead', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ˈoʊvərhed/', translation: 'Gastos generales de manufactura', example: 'Manufacturing overhead includes utilities', difficulty: 'advanced' },
          { term: 'Process automation', pronunciation: '/ˈprɑːses ˌɔːtəˈmeɪʃn/', translation: 'Automatización de procesos', example: 'Process automation reduced labor costs', difficulty: 'intermediate' },
          { term: 'Production metrics', pronunciation: '/prəˈdʌkʃn ˈmetrɪks/', translation: 'Métricas de producción', example: 'Review production metrics monthly', difficulty: 'intermediate' },
          { term: 'Total productive maintenance', pronunciation: '/ˈtoʊtl prəˈdʌktɪv ˈmeɪntənəns/', translation: 'Mantenimiento productivo total', example: 'Total productive maintenance prevents breakdowns', difficulty: 'advanced' }
        ]
      },

      // 12. Emprendimiento y Startups
      {
        category: 'Emprendimiento y Startups',
        icon: '🚀',
        terms: [
          { term: 'Startup ecosystem', pronunciation: '/ˈstɑːrtʌp ˈiːkoʊˌsɪstəm/', translation: 'Ecosistema de startups', example: 'The startup ecosystem is thriving here', difficulty: 'intermediate' },
          { term: 'Minimum viable product (MVP)', pronunciation: '/ˈmɪnɪməm ˈvaɪəbl ˈprɑːdʌkt/', translation: 'Producto mínimo viable', example: 'Launch the MVP in three months', difficulty: 'intermediate' },
          { term: 'Venture capital', pronunciation: '/ˈventʃər ˈkæpɪtl/', translation: 'Capital de riesgo', example: 'Venture capital funded the expansion', difficulty: 'advanced' },
          { term: 'Product-market fit', pronunciation: '/ˈprɑːdʌkt ˈmɑːrkɪt fɪt/', translation: 'Ajuste producto-mercado', example: 'Achieving product-market fit is crucial', difficulty: 'advanced' },
          { term: 'Pitch deck', pronunciation: '/pɪtʃ dek/', translation: 'Presentación de pitch', example: 'Prepare a compelling pitch deck', difficulty: 'intermediate' },
          { term: 'Seed funding', pronunciation: '/siːd ˈfʌndɪŋ/', translation: 'Financiamiento semilla', example: 'Seed funding raised $500K', difficulty: 'intermediate' },
          { term: 'Scalability', pronunciation: '/ˌskeɪləˈbɪləti/', translation: 'Escalabilidad', example: 'Scalability is key to growth', difficulty: 'intermediate' },
          { term: 'Growth hacking', pronunciation: '/ɡroʊθ ˈhækɪŋ/', translation: 'Crecimiento acelerado', example: 'Growth hacking strategies boosted signups', difficulty: 'advanced' },
          { term: 'Angel investor', pronunciation: '/ˈeɪndʒəl ɪnˈvestər/', translation: 'Inversionista ángel', example: 'An angel investor provided early funding', difficulty: 'intermediate' },
          { term: 'Burn rate', pronunciation: '/bɜːrn reɪt/', translation: 'Tasa de quema', example: 'Monitor the burn rate closely', difficulty: 'advanced' },
          { term: 'Runway', pronunciation: '/ˈrʌnweɪ/', translation: 'Pista (tiempo de supervivencia)', example: 'We have 18 months of runway', difficulty: 'advanced' },
          { term: 'Exit strategy', pronunciation: '/ˈeksɪt ˈstrætədʒi/', translation: 'Estrategia de salida', example: 'Plan an exit strategy from the start', difficulty: 'advanced' },
          { term: 'Bootstrapping', pronunciation: '/ˈbuːtstræpɪŋ/', translation: 'Autofinanciamiento', example: 'Bootstrapping requires discipline', difficulty: 'intermediate' },
          { term: 'Pivot', pronunciation: '/ˈpɪvət/', translation: 'Pivotar', example: 'We decided to pivot to B2B', difficulty: 'intermediate' },
          { term: 'Traction', pronunciation: '/ˈtrækʃn/', translation: 'Tracción', example: 'The startup is gaining traction', difficulty: 'intermediate' },
          { term: 'Incubator program', pronunciation: '/ˈɪŋkjəbeɪtər ˈproʊɡræm/', translation: 'Programa de incubación', example: 'Join an incubator program for support', difficulty: 'intermediate' },
          { term: 'Accelerator', pronunciation: '/ækˈseləreɪtər/', translation: 'Aceleradora', example: 'The accelerator invests in early-stage startups', difficulty: 'intermediate' },
          { term: 'Cap table', pronunciation: '/kæp ˈteɪbl/', translation: 'Tabla de capitalización', example: 'Keep the cap table organized', difficulty: 'advanced' },
          { term: 'Equity stake', pronunciation: '/ˈekwəti steɪk/', translation: 'Participación accionaria', example: 'Investors receive a 20% equity stake', difficulty: 'advanced' },
          { term: 'Series A funding', pronunciation: '/ˈsɪriːz eɪ ˈfʌndɪŋ/', translation: 'Financiamiento Serie A', example: 'Series A funding valued us at $10M', difficulty: 'advanced' },
          { term: 'User acquisition', pronunciation: '/ˈjuːzər ˌækwɪˈzɪʃn/', translation: 'Adquisición de usuarios', example: 'User acquisition cost is $5 per user', difficulty: 'intermediate' },
          { term: 'Customer validation', pronunciation: '/ˈkʌstəmər ˌvælɪˈdeɪʃn/', translation: 'Validación de clientes', example: 'Customer validation confirmed demand', difficulty: 'intermediate' },
          { term: 'Disruptive innovation', pronunciation: '/dɪsˈrʌptɪv ˌɪnəˈveɪʃn/', translation: 'Innovación disruptiva', example: 'Disruptive innovation changes industries', difficulty: 'advanced' },
          { term: 'Market opportunity', pronunciation: '/ˈmɑːrkɪt ˌɑːpərˈtuːnəti/', translation: 'Oportunidad de mercado', example: 'The market opportunity is $5 billion', difficulty: 'intermediate' },
          { term: 'Proof of concept', pronunciation: '/pruːf əv ˈkɑːnsept/', translation: 'Prueba de concepto', example: 'Build a proof of concept first', difficulty: 'intermediate' },
          { term: 'Go-to-market strategy', pronunciation: '/ˌɡoʊ tə ˈmɑːrkɪt ˈstrætədʒi/', translation: 'Estrategia de salida al mercado', example: 'Our go-to-market strategy targets SMBs', difficulty: 'advanced' },
          { term: 'Competitive landscape', pronunciation: '/kəmˈpetətɪv ˈlændskeɪp/', translation: 'Panorama competitivo', example: 'Analyze the competitive landscape', difficulty: 'intermediate' },
          { term: 'Revenue model', pronunciation: '/ˈrevənuː ˈmɑːdl/', translation: 'Modelo de ingresos', example: 'Our revenue model is subscription-based', difficulty: 'intermediate' },
          { term: 'Co-founder', pronunciation: '/koʊ ˈfaʊndər/', translation: 'Cofundador', example: 'Choose a co-founder with complementary skills', difficulty: 'beginner' },
          { term: 'Term sheet', pronunciation: '/tɜːrm ʃiːt/', translation: 'Hoja de términos', example: 'Review the term sheet carefully', difficulty: 'advanced' }
        ]
      }
    ]

    for (const category of vocabularyData) {
      console.log(`📚 Procesando categoría: ${category.category}...`)
      
      const vocabCategory = await prisma.vocabularyCategory.upsert({
        where: { name: category.category },
        update: {},
        create: {
          name: category.category,
          icon: category.icon,
          description: `Vocabulario profesional para ${category.category.toLowerCase()}`
        }
      })

      for (const termData of category.terms) {
        await prisma.vocabularyTerm.upsert({
          where: {
            term_categoryId: {
              term: termData.term,
              categoryId: vocabCategory.id
            }
          },
          update: {},
          create: {
            term: termData.term,
            pronunciation: termData.pronunciation,
            translation: termData.translation,
            example: termData.example,
            difficulty: termData.difficulty,
            categoryId: vocabCategory.id
          }
        })
      }
      
      console.log(`✅ Categoría ${category.category} completada con ${category.terms.length} términos`)
    }

    console.log('✅ Vocabulario extenso creado exitosamente!')
    console.log(`📊 Total: ${vocabularyData.length} categorías`)
    console.log(`📊 Total: ${vocabularyData.reduce((acc, cat) => acc + cat.terms.length, 0)} términos de vocabulario`)

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
