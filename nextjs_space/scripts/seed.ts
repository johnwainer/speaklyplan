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
        name: 'FASE 1: FUNDACIÓN SÓLIDA',
        description: 'Vocabulario esencial y gramática básica'
      },
      {
        number: 2,
        name: 'FASE 2: CONSTRUCCIÓN ACTIVA',
        description: 'Conversaciones prácticas y fluidez'
      },
      {
        number: 3,
        name: 'FASE 3: DOMINIO PROFESIONAL',
        description: 'Inglés avanzado para el trabajo'
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
      // ============ FASE 1: FUNDACIÓN SÓLIDA (Semanas 1-8) ============
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

      // ============ FASE 2: CONSTRUCCIÓN ACTIVA (Semanas 9-16) ============
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

      // ============ FASE 3: DOMINIO PROFESIONAL (Semanas 17-24) ============
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
          { term: 'Competitive advantage', pronunciation: '/kəmˈpetətɪv ədˈvæntɪdʒ/', translation: 'Ventaja competitiva', example: 'Our competitive advantage is customer service', difficulty: 'advanced' },
          { term: 'brand equity', pronunciation: '/brænd ˈɛkwɪti/', translation: 'valor de marca', example: 'Our brand equity has increased by 40% after the rebranding campaign.', difficulty: 'intermediate' },
          { term: 'conversion rate', pronunciation: '/kənˈvɜːrʒən reɪt/', translation: 'tasa de conversión', example: 'We need to optimize our landing page to improve the conversion rate.', difficulty: 'intermediate' },
          { term: 'influencer marketing', pronunciation: '/ˈɪnfluənsər ˈmɑːrkɪtɪŋ/', translation: 'marketing de influencers', example: 'Influencer marketing has become essential for reaching younger demographics.', difficulty: 'beginner' },
          { term: 'attribution model', pronunciation: '/ˌætrɪˈbjuːʃən ˈmɒdl/', translation: 'modelo de atribución', example: 'We\'re implementing a multi-touch attribution model to better understand customer journeys.', difficulty: 'advanced' },
          { term: 'retargeting', pronunciation: '/riːˈtɑːrgɪtɪŋ/', translation: 'reorientación publicitaria', example: 'Our retargeting campaigns have doubled our return on ad spend.', difficulty: 'intermediate' },
          { term: 'customer acquisition cost', pronunciation: '/ˈkʌstəmər ˌækwɪˈzɪʃən kɒst/', translation: 'costo de adquisición de cliente', example: 'We must reduce our customer acquisition cost to maintain profitability.', difficulty: 'intermediate' },
          { term: 'viral marketing', pronunciation: '/ˈvaɪrəl ˈmɑːrkɪtɪŋ/', translation: 'marketing viral', example: 'The video campaign achieved viral marketing success with over 10 million shares.', difficulty: 'beginner' },
          { term: 'programmatic advertising', pronunciation: '/ˌproʊɡrəˈmætɪk ˈædvərtaɪzɪŋ/', translation: 'publicidad programática', example: 'Programmatic advertising allows us to automate media buying in real-time.', difficulty: 'advanced' },
          { term: 'content syndication', pronunciation: '/ˈkɒntɛnt ˌsɪndɪˈkeɪʃən/', translation: 'sindicación de contenido', example: 'Content syndication helps us reach audiences beyond our owned channels.', difficulty: 'intermediate' },
          { term: 'brand ambassador', pronunciation: '/brænd æmˈbæsədər/', translation: 'embajador de marca', example: 'We hired a brand ambassador to represent our company at industry events.', difficulty: 'beginner' },
          { term: 'market segmentation', pronunciation: '/ˈmɑːrkɪt ˌsɛɡmɛnˈteɪʃən/', translation: 'segmentación de mercado', example: 'Effective market segmentation allows us to target specific customer groups.', difficulty: 'intermediate' },
          { term: 'call to action', pronunciation: '/kɔːl tuː ˈækʃən/', translation: 'llamada a la acción', example: 'Every marketing email should include a clear call to action.', difficulty: 'beginner' },
          { term: 'customer lifetime value', pronunciation: '/ˈkʌstəmər ˈlaɪftaɪm ˈvæljuː/', translation: 'valor del tiempo de vida del cliente', example: 'Increasing customer lifetime value is more cost-effective than acquiring new customers.', difficulty: 'advanced' },
          { term: 'native advertising', pronunciation: '/ˈneɪtɪv ˈædvərtaɪzɪŋ/', translation: 'publicidad nativa', example: 'Native advertising blends seamlessly with editorial content on digital platforms.', difficulty: 'intermediate' },
          { term: 'brand positioning', pronunciation: '/brænd pəˈzɪʃənɪŋ/', translation: 'posicionamiento de marca', example: 'Our brand positioning strategy focuses on premium quality and sustainability.', difficulty: 'intermediate' },
          { term: 'engagement rate', pronunciation: '/ɪnˈɡeɪdʒmənt reɪt/', translation: 'tasa de interacción', example: 'Our social media engagement rate has increased by 25% this quarter.', difficulty: 'beginner' },
          { term: 'guerrilla marketing', pronunciation: '/ɡəˈrɪlə ˈmɑːrkɪtɪŋ/', translation: 'marketing de guerrilla', example: 'Guerrilla marketing tactics helped us create buzz with a limited budget.', difficulty: 'intermediate' },
          { term: 'marketing automation', pronunciation: '/ˈmɑːrkɪtɪŋ ˌɔːtəˈmeɪʃən/', translation: 'automatización de marketing', example: 'Marketing automation has streamlined our email campaigns and lead nurturing.', difficulty: 'intermediate' },
          { term: 'thought leadership', pronunciation: '/θɔːt ˈliːdərʃɪp/', translation: 'liderazgo de pensamiento', example: 'Publishing white papers establishes our company as a thought leadership authority.', difficulty: 'advanced' },
          { term: 'brand awareness', pronunciation: '/brænd əˈwɛrnəs/', translation: 'conocimiento de marca', example: 'Our brand awareness campaign reached 5 million potential customers.', difficulty: 'beginner' },
          { term: 'omnichannel marketing', pronunciation: '/ˈɒmnɪtʃænl ˈmɑːrkɪtɪŋ/', translation: 'marketing omnicanal', example: 'Omnichannel marketing ensures consistent messaging across all customer touchpoints.', difficulty: 'advanced' },
          { term: 'cost per click', pronunciation: '/kɒst pɜːr klɪk/', translation: 'costo por clic', example: 'We reduced our cost per click by optimizing ad targeting parameters.', difficulty: 'intermediate' },
          { term: 'user-generated content', pronunciation: '/ˈjuːzər ˈdʒɛnəreɪtɪd ˈkɒntɛnt/', translation: 'contenido generado por usuarios', example: 'User-generated content increases authenticity and customer engagement.', difficulty: 'intermediate' },
          { term: 'market penetration', pronunciation: '/ˈmɑːrkɪt ˌpɛnɪˈtreɪʃən/', translation: 'penetración de mercado', example: 'Our market penetration strategy focuses on competitive pricing and distribution.', difficulty: 'intermediate' },
          { term: 'brand loyalty', pronunciation: '/brænd ˈlɔɪəlti/', translation: 'lealtad de marca', example: 'Building brand loyalty requires consistent quality and excellent customer service.', difficulty: 'beginner' },
          { term: 'search engine optimization', pronunciation: '/sɜːrtʃ ˈɛndʒɪn ˌɒptɪmaɪˈzeɪʃən/', translation: 'optimización para motores de búsqueda', example: 'Search engine optimization is crucial for improving our website\'s organic visibility.', difficulty: 'intermediate' },
          { term: 'marketing mix', pronunciation: '/ˈmɑːrkɪtɪŋ mɪks/', translation: 'mezcla de marketing', example: 'We\'re adjusting our marketing mix to allocate more budget to digital channels.', difficulty: 'intermediate' },
          { term: 'customer persona', pronunciation: '/ˈkʌstəmər pərˈsoʊnə/', translation: 'perfil de cliente', example: 'We developed three customer personas to guide our content strategy.', difficulty: 'intermediate' },
          { term: 'impressions', pronunciation: '/ɪmˈprɛʃənz/', translation: 'impresiones', example: 'Our display ads generated over 2 million impressions last month.', difficulty: 'beginner' },
          { term: 'affiliate marketing', pronunciation: '/əˈfɪliət ˈmɑːrkɪtɪŋ/', translation: 'marketing de afiliados', example: 'Affiliate marketing accounts for 15% of our total online revenue.', difficulty: 'intermediate' },
          { term: 'brand identity', pronunciation: '/brænd aɪˈdɛntɪti/', translation: 'identidad de marca', example: 'Our brand identity reflects innovation, reliability, and customer focus.', difficulty: 'beginner' },
          { term: 'marketing funnel', pronunciation: '/ˈmɑːrkɪtɪŋ ˈfʌnl/', translation: 'embudo de marketing', example: 'We analyze each stage of the marketing funnel to identify optimization opportunities.', difficulty: 'intermediate' },
          { term: 'competitive advantage', pronunciation: '/kəmˈpɛtɪtɪv ədˈvæntɪdʒ/', translation: 'ventaja competitiva', example: 'Our competitive advantage lies in superior customer service and product innovation.', difficulty: 'intermediate' },
          { term: 'pay-per-click', pronunciation: '/peɪ pɜːr klɪk/', translation: 'pago por clic', example: 'Pay-per-click advertising delivers immediate traffic to our website.', difficulty: 'beginner' },
          { term: 'market research', pronunciation: '/ˈmɑːrkɪt rɪˈsɜːrtʃ/', translation: 'investigación de mercado', example: 'Market research revealed strong demand for our new product line.', difficulty: 'beginner' },
          { term: 'brand extension', pronunciation: '/brænd ɪkˈstɛnʃən/', translation: 'extensión de marca', example: 'The brand extension into health products was highly successful.', difficulty: 'intermediate' },
          { term: 'customer journey', pronunciation: '/ˈkʌstəmər ˈdʒɜːrni/', translation: 'recorrido del cliente', example: 'Mapping the customer journey helps us identify pain points and opportunities.', difficulty: 'intermediate' },
          { term: 'value proposition', pronunciation: '/ˈvæljuː ˌprɒpəˈzɪʃən/', translation: 'propuesta de valor', example: 'Our value proposition emphasizes quality, affordability, and convenience.', difficulty: 'intermediate' },
          { term: 'click-through rate', pronunciation: '/klɪk θruː reɪt/', translation: 'tasa de clics', example: 'The email campaign achieved a click-through rate of 8%, exceeding industry benchmarks.', difficulty: 'intermediate' },
          { term: 'target audience', pronunciation: '/ˈtɑːrɡɪt ˈɔːdiəns/', translation: 'público objetivo', example: 'Our target audience consists of professionals aged 25-45 in urban areas.', difficulty: 'beginner' },
          { term: 'brand recognition', pronunciation: '/brænd ˌrɛkəɡˈnɪʃən/', translation: 'reconocimiento de marca', example: 'Brand recognition increased significantly after our Super Bowl advertisement.', difficulty: 'beginner' },
          { term: 'marketing campaign', pronunciation: '/ˈmɑːrkɪtɪŋ kæmˈpeɪn/', translation: 'campaña de marketing', example: 'The marketing campaign generated 50,000 new leads in three months.', difficulty: 'beginner' },
          { term: 'sentiment analysis', pronunciation: '/ˈsɛntɪmənt əˈnæləsɪs/', translation: 'análisis de sentimiento', example: 'Sentiment analysis of social media mentions shows 85% positive brand perception.', difficulty: 'advanced' },
          { term: 'brand dilution', pronunciation: '/brænd daɪˈluːʃən/', translation: 'dilución de marca', example: 'We must avoid brand dilution by maintaining consistent quality standards.', difficulty: 'advanced' },
          { term: 'marketing metrics', pronunciation: '/ˈmɑːrkɪtɪŋ ˈmɛtrɪks/', translation: 'métricas de marketing', example: 'We track key marketing metrics including ROI, engagement, and conversion rates.', difficulty: 'intermediate' },
          { term: 'promotional strategy', pronunciation: '/prəˈmoʊʃənl ˈstrætədʒi/', translation: 'estrategia promocional', example: 'Our promotional strategy combines digital advertising with in-store events.', difficulty: 'intermediate' },
          { term: 'market share', pronunciation: '/ˈmɑːrkɪt ʃɛr/', translation: 'cuota de mercado', example: 'We increased our market share from 12% to 18% in the past year.', difficulty: 'intermediate' },
          { term: 'customer retention', pronunciation: '/ˈkʌstəmər rɪˈtɛnʃən/', translation: 'retención de clientes', example: 'Customer retention is more cost-effective than acquiring new customers.', difficulty: 'intermediate' },
          { term: 'brand messaging', pronunciation: '/brænd ˈmɛsɪdʒɪŋ/', translation: 'mensajería de marca', example: 'Consistent brand messaging across all channels strengthens customer trust.', difficulty: 'intermediate' },
          { term: 'marketing analytics', pronunciation: '/ˈmɑːrkɪtɪŋ ˌænəˈlɪtɪks/', translation: 'analítica de marketing', example: 'Marketing analytics revealed that video content drives the highest engagement.', difficulty: 'advanced' },
          { term: 'product placement', pronunciation: '/ˈprɒdʌkt ˈpleɪsmənt/', translation: 'colocación de producto', example: 'Product placement in popular TV shows increased brand visibility significantly.', difficulty: 'intermediate' },
          { term: 'brand architecture', pronunciation: '/brænd ˈɑːrkɪtɛktʃər/', translation: 'arquitectura de marca', example: 'Our brand architecture clearly defines the relationship between parent and sub-brands.', difficulty: 'advanced' },
          { term: 'marketing collateral', pronunciation: '/ˈmɑːrkɪtɪŋ kəˈlætərəl/', translation: 'material de marketing', example: 'We need to update our marketing collateral to reflect the new brand guidelines.', difficulty: 'intermediate' },
          { term: 'customer touchpoint', pronunciation: '/ˈkʌstəmər ˈtʌtʃpɔɪnt/', translation: 'punto de contacto con el cliente', example: 'We identified 12 key customer touchpoints throughout the buying process.', difficulty: 'intermediate' },
          { term: 'market positioning', pronunciation: '/ˈmɑːrkɪt pəˈzɪʃənɪŋ/', translation: 'posicionamiento de mercado', example: 'Our market positioning emphasizes premium quality at competitive prices.', difficulty: 'intermediate' },
          { term: 'advertising spend', pronunciation: '/ˈædvərtaɪzɪŋ spɛnd/', translation: 'gasto publicitario', example: 'We\'re increasing our advertising spend by 30% to support the product launch.', difficulty: 'beginner' },
          { term: 'brand perception', pronunciation: '/brænd pərˈsɛpʃən/', translation: 'percepción de marca', example: 'Brand perception surveys show we\'re viewed as innovative and trustworthy.', difficulty: 'intermediate' },
          { term: 'marketing ROI', pronunciation: '/ˈmɑːrkɪtɪŋ ɑːr oʊ aɪ/', translation: 'retorno de inversión en marketing', example: 'Our digital campaigns achieved a marketing ROI of 400% last quarter.', difficulty: 'intermediate' },
          { term: 'promotional mix', pronunciation: '/prəˈmoʊʃənl mɪks/', translation: 'mezcla promocional', example: 'The promotional mix includes advertising, PR, sales promotions, and direct marketing.', difficulty: 'intermediate' },
          { term: 'brand equity measurement', pronunciation: '/brænd ˈɛkwɪti ˈmɛʒərmənt/', translation: 'medición del valor de marca', example: 'Brand equity measurement helps us quantify the value of our brand assets.', difficulty: 'advanced' },
          { term: 'customer engagement', pronunciation: '/ˈkʌstəmər ɪnˈɡeɪdʒmənt/', translation: 'compromiso del cliente', example: 'Customer engagement on social media has doubled since we started interactive campaigns.', difficulty: 'beginner' },
          { term: 'market saturation', pronunciation: '/ˈmɑːrkɪt ˌsætʃəˈreɪʃən/', translation: 'saturación de mercado', example: 'Market saturation in developed countries is pushing us to explore emerging markets.', difficulty: 'advanced' },
          { term: 'brand storytelling', pronunciation: '/brænd ˈstɔːritɛlɪŋ/', translation: 'narrativa de marca', example: 'Brand storytelling creates emotional connections with our target audience.', difficulty: 'intermediate' },
          { term: 'marketing budget', pronunciation: '/ˈmɑːrkɪtɪŋ ˈbʌdʒɪt/', translation: 'presupuesto de marketing', example: 'The marketing budget for next year has been approved at $2.5 million.', difficulty: 'beginner' },
          { term: 'brand consistency', pronunciation: '/brænd kənˈsɪstənsi/', translation: 'consistencia de marca', example: 'Brand consistency across all platforms reinforces our market position.', difficulty: 'intermediate' },
          { term: 'marketing intelligence', pronunciation: '/ˈmɑːrkɪtɪŋ ɪnˈtɛlɪdʒəns/', translation: 'inteligencia de marketing', example: 'Marketing intelligence helps us anticipate market trends and competitor moves.', difficulty: 'advanced' },
          { term: 'promotional campaign', pronunciation: '/prəˈmoʊʃənl kæmˈpeɪn/', translation: 'campaña promocional', example: 'The promotional campaign increased sales by 35% during the holiday season.', difficulty: 'beginner' },
          { term: 'brand valuation', pronunciation: '/brænd ˌvæljuˈeɪʃən/', translation: 'valoración de marca', example: 'Independent brand valuation placed our company among the top 50 global brands.', difficulty: 'advanced' },
          { term: 'customer advocacy', pronunciation: '/ˈkʌstəmər ˈædvəkəsi/', translation: 'defensa del cliente', example: 'Customer advocacy programs turn satisfied customers into brand ambassadors.', difficulty: 'intermediate' },
          { term: 'Brand equity', pronunciation: '/brænd ˈɛkwɪti/', translation: 'Valor de marca', example: 'Our company has built strong brand equity over the past decade through consistent quality and customer service.', difficulty: 'advanced' }
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
          { term: 'Progress report', pronunciation: '/ˈprɑːɡres rɪˈpɔːrt/', translation: 'Informe de progreso', example: 'Submit a progress report by Friday', difficulty: 'beginner' },
          { term: 'organizational structure', pronunciation: '/ˌɔːrɡənaɪˈzeɪʃənl ˈstrʌktʃər/', translation: 'estructura organizacional', example: 'We\'re redesigning our organizational structure to improve communication and efficiency.', difficulty: 'intermediate' },
          { term: 'strategic planning', pronunciation: '/strəˈtiːdʒɪk ˈplænɪŋ/', translation: 'planificación estratégica', example: 'Strategic planning sessions are held quarterly to align departmental goals.', difficulty: 'intermediate' },
          { term: 'performance metrics', pronunciation: '/pərˈfɔːrməns ˈmɛtrɪks/', translation: 'métricas de rendimiento', example: 'We track performance metrics to evaluate employee productivity and efficiency.', difficulty: 'intermediate' },
          { term: 'delegation', pronunciation: '/ˌdɛlɪˈɡeɪʃən/', translation: 'delegación', example: 'Effective delegation empowers team members and improves overall productivity.', difficulty: 'beginner' },
          { term: 'change management', pronunciation: '/tʃeɪndʒ ˈmænɪdʒmənt/', translation: 'gestión del cambio', example: 'Change management strategies helped us successfully implement the new ERP system.', difficulty: 'advanced' },
          { term: 'stakeholder engagement', pronunciation: '/ˈsteɪkhoʊldər ɪnˈɡeɪdʒmənt/', translation: 'compromiso de las partes interesadas', example: 'Stakeholder engagement is crucial for securing buy-in on major initiatives.', difficulty: 'intermediate' },
          { term: 'resource allocation', pronunciation: '/rɪˈsɔːrs ˌæləˈkeɪʃən/', translation: 'asignación de recursos', example: 'Resource allocation decisions must balance competing priorities across departments.', difficulty: 'intermediate' },
          { term: 'business continuity', pronunciation: '/ˈbɪznəs ˌkɒntɪˈnjuːɪti/', translation: 'continuidad del negocio', example: 'Our business continuity plan ensures operations can continue during emergencies.', difficulty: 'advanced' },
          { term: 'key performance indicator', pronunciation: '/kiː pərˈfɔːrməns ˈɪndɪkeɪtər/', translation: 'indicador clave de rendimiento', example: 'Each department has specific key performance indicators to measure success.', difficulty: 'intermediate' },
          { term: 'workflow optimization', pronunciation: '/ˈwɜːrkfloʊ ˌɒptɪmaɪˈzeɪʃən/', translation: 'optimización del flujo de trabajo', example: 'Workflow optimization reduced processing time by 40% in our operations department.', difficulty: 'intermediate' },
          { term: 'corporate governance', pronunciation: '/ˈkɔːrpərət ˈɡʌvərnəns/', translation: 'gobierno corporativo', example: 'Strong corporate governance practices protect shareholder interests and ensure compliance.', difficulty: 'advanced' },
          { term: 'project management', pronunciation: '/ˈprɒdʒɛkt ˈmænɪdʒmənt/', translation: 'gestión de proyectos', example: 'Project management methodologies help us deliver initiatives on time and within budget.', difficulty: 'intermediate' },
          { term: 'risk assessment', pronunciation: '/rɪsk əˈsɛsmənt/', translation: 'evaluación de riesgos', example: 'Regular risk assessment helps us identify and mitigate potential business threats.', difficulty: 'intermediate' },
          { term: 'operational efficiency', pronunciation: '/ˌɒpəˈreɪʃənl ɪˈfɪʃənsi/', translation: 'eficiencia operacional', example: 'Improving operational efficiency is our top priority for reducing costs.', difficulty: 'intermediate' },
          { term: 'succession planning', pronunciation: '/səkˈsɛʃən ˈplænɪŋ/', translation: 'planificación de sucesión', example: 'Succession planning ensures leadership continuity when key executives retire.', difficulty: 'advanced' },
          { term: 'budget management', pronunciation: '/ˈbʌdʒɪt ˈmænɪdʒmənt/', translation: 'gestión presupuestaria', example: 'Effective budget management requires careful monitoring of expenses and revenues.', difficulty: 'intermediate' },
          { term: 'organizational culture', pronunciation: '/ˌɔːrɡənaɪˈzeɪʃənl ˈkʌltʃər/', translation: 'cultura organizacional', example: 'Our organizational culture emphasizes innovation, collaboration, and accountability.', difficulty: 'intermediate' },
          { term: 'decision-making process', pronunciation: '/dɪˈsɪʒən ˈmeɪkɪŋ ˈprɒsɛs/', translation: 'proceso de toma de decisiones', example: 'The decision-making process involves input from all relevant stakeholders.', difficulty: 'beginner' },
          { term: 'business process reengineering', pronunciation: '/ˈbɪznəs ˈprɒsɛs ˌriːɛndʒɪˈnɪrɪŋ/', translation: 'reingeniería de procesos de negocio', example: 'Business process reengineering helped us eliminate redundancies and improve efficiency.', difficulty: 'advanced' },
          { term: 'performance appraisal', pronunciation: '/pərˈfɔːrməns əˈpreɪzəl/', translation: 'evaluación de desempeño', example: 'Annual performance appraisals provide feedback and identify development opportunities.', difficulty: 'intermediate' },
          { term: 'administrative overhead', pronunciation: '/ədˈmɪnɪstrətɪv ˈoʊvərhɛd/', translation: 'gastos administrativos generales', example: 'We\'re working to reduce administrative overhead without compromising service quality.', difficulty: 'intermediate' },
          { term: 'cross-functional team', pronunciation: '/krɒs ˈfʌŋkʃənl tiːm/', translation: 'equipo multifuncional', example: 'The cross-functional team includes members from marketing, IT, and operations.', difficulty: 'intermediate' },
          { term: 'management hierarchy', pronunciation: '/ˈmænɪdʒmənt ˈhaɪərɑːrki/', translation: 'jerarquía de gestión', example: 'Our flat management hierarchy promotes faster decision-making and communication.', difficulty: 'beginner' },
          { term: 'business intelligence', pronunciation: '/ˈbɪznəs ɪnˈtɛlɪdʒəns/', translation: 'inteligencia de negocios', example: 'Business intelligence tools help us analyze data and make informed decisions.', difficulty: 'advanced' },
          { term: 'quality assurance', pronunciation: '/ˈkwɒlɪti əˈʃʊrəns/', translation: 'aseguramiento de calidad', example: 'Quality assurance processes ensure our products meet industry standards.', difficulty: 'intermediate' },
          { term: 'time management', pronunciation: '/taɪm ˈmænɪdʒmənt/', translation: 'gestión del tiempo', example: 'Good time management skills are essential for meeting project deadlines.', difficulty: 'beginner' },
          { term: 'organizational development', pronunciation: '/ˌɔːrɡənaɪˈzeɪʃənl dɪˈvɛləpmənt/', translation: 'desarrollo organizacional', example: 'Organizational development initiatives focus on improving employee capabilities and culture.', difficulty: 'advanced' },
          { term: 'policy implementation', pronunciation: '/ˈpɒləsi ˌɪmplɪmɛnˈteɪʃən/', translation: 'implementación de políticas', example: 'Policy implementation requires clear communication and training for all employees.', difficulty: 'intermediate' },
          { term: 'benchmarking', pronunciation: '/ˈbɛntʃmɑːrkɪŋ/', translation: 'evaluación comparativa', example: 'Benchmarking against industry leaders helps us identify areas for improvement.', difficulty: 'intermediate' },
          { term: 'administrative assistant', pronunciation: '/ədˈmɪnɪstrətɪv əˈsɪstənt/', translation: 'asistente administrativo', example: 'The administrative assistant manages schedules, correspondence, and office supplies.', difficulty: 'beginner' },
          { term: 'business strategy', pronunciation: '/ˈbɪznəs ˈstrætədʒi/', translation: 'estrategia empresarial', example: 'Our business strategy focuses on digital transformation and customer experience.', difficulty: 'intermediate' },
          { term: 'operational planning', pronunciation: '/ˌɒpəˈreɪʃənl ˈplænɪŋ/', translation: 'planificación operativa', example: 'Operational planning translates strategic goals into actionable departmental objectives.', difficulty: 'intermediate' },
          { term: 'management information system', pronunciation: '/ˈmænɪdʒmənt ˌɪnfərˈmeɪʃən ˈsɪstəm/', translation: 'sistema de información gerencial', example: 'The management information system provides real-time data for decision-making.', difficulty: 'advanced' },
          { term: 'accountability', pronunciation: '/əˌkaʊntəˈbɪləti/', translation: 'responsabilidad', example: 'Clear accountability ensures that team members take ownership of their tasks.', difficulty: 'beginner' },
          { term: 'business model', pronunciation: '/ˈbɪznəs ˈmɒdl/', translation: 'modelo de negocio', example: 'Our business model is based on subscription revenue and value-added services.', difficulty: 'intermediate' },
          { term: 'process improvement', pronunciation: '/ˈprɒsɛs ɪmˈpruːvmənt/', translation: 'mejora de procesos', example: 'Continuous process improvement is embedded in our organizational culture.', difficulty: 'intermediate' },
          { term: 'executive leadership', pronunciation: '/ɪɡˈzɛkjʊtɪv ˈliːdərʃɪp/', translation: 'liderazgo ejecutivo', example: 'Strong executive leadership is essential for navigating market challenges.', difficulty: 'intermediate' },
          { term: 'administrative procedures', pronunciation: '/ədˈmɪnɪstrətɪv prəˈsiːdʒərz/', translation: 'procedimientos administrativos', example: 'Standardized administrative procedures ensure consistency across all departments.', difficulty: 'beginner' },
          { term: 'organizational effectiveness', pronunciation: '/ˌɔːrɡənaɪˈzeɪʃənl ɪˈfɛktɪvnəs/', translation: 'efectividad organizacional', example: 'Measuring organizational effectiveness helps us assess our strategic progress.', difficulty: 'advanced' },
          { term: 'business analytics', pronunciation: '/ˈbɪznəs ˌænəˈlɪtɪks/', translation: 'analítica empresarial', example: 'Business analytics revealed opportunities to optimize our supply chain.', difficulty: 'advanced' },
          { term: 'management style', pronunciation: '/ˈmænɪdʒmənt staɪl/', translation: 'estilo de gestión', example: 'A collaborative management style encourages employee participation and innovation.', difficulty: 'intermediate' },
          { term: 'organizational chart', pronunciation: '/ˌɔːrɡənaɪˈzeɪʃənl tʃɑːrt/', translation: 'organigrama', example: 'The organizational chart clearly shows reporting relationships and departmental structure.', difficulty: 'beginner' },
          { term: 'business operations', pronunciation: '/ˈbɪznəs ˌɒpəˈreɪʃənz/', translation: 'operaciones comerciales', example: 'Streamlining business operations reduced costs by 20% last year.', difficulty: 'intermediate' },
          { term: 'strategic initiative', pronunciation: '/strəˈtiːdʒɪk ɪˈnɪʃətɪv/', translation: 'iniciativa estratégica', example: 'The digital transformation is our most important strategic initiative this year.', difficulty: 'intermediate' },
          { term: 'administrative support', pronunciation: '/ədˈmɪnɪstrətɪv səˈpɔːrt/', translation: 'apoyo administrativo', example: 'Administrative support staff play a crucial role in daily operations.', difficulty: 'beginner' },
          { term: 'performance management', pronunciation: '/pərˈfɔːrməns ˈmænɪdʒmənt/', translation: 'gestión del desempeño', example: 'Our performance management system aligns individual goals with company objectives.', difficulty: 'intermediate' },
          { term: 'business continuity planning', pronunciation: '/ˈbɪznəs ˌkɒntɪˈnjuːɪti ˈplænɪŋ/', translation: 'planificación de continuidad del negocio', example: 'Business continuity planning prepares us for potential disruptions and disasters.', difficulty: 'advanced' },
          { term: 'organizational alignment', pronunciation: '/ˌɔːrɡənaɪˈzeɪʃənl əˈlaɪnmənt/', translation: 'alineación organizacional', example: 'Organizational alignment ensures all departments work toward common goals.', difficulty: 'intermediate' },
          { term: 'management consulting', pronunciation: '/ˈmænɪdʒmənt kənˈsʌltɪŋ/', translation: 'consultoría de gestión', example: 'We hired a management consulting firm to help optimize our operations.', difficulty: 'intermediate' },
          { term: 'business transformation', pronunciation: '/ˈbɪznəs ˌtrænsfərˈmeɪʃən/', translation: 'transformación empresarial', example: 'Business transformation requires significant investment in technology and training.', difficulty: 'advanced' },
          { term: 'administrative efficiency', pronunciation: '/ədˈmɪnɪstrətɪv ɪˈfɪʃənsi/', translation: 'eficiencia administrativa', example: 'Automation improved administrative efficiency by eliminating manual data entry.', difficulty: 'intermediate' },
          { term: 'organizational learning', pronunciation: '/ˌɔːrɡənaɪˈzeɪʃənl ˈlɜːrnɪŋ/', translation: 'aprendizaje organizacional', example: 'Organizational learning helps us adapt to changing market conditions.', difficulty: 'advanced' },
          { term: 'business process management', pronunciation: '/ˈbɪznəs ˈprɒsɛs ˈmænɪdʒmənt/', translation: 'gestión de procesos de negocio', example: 'Business process management software helps us monitor and optimize workflows.', difficulty: 'advanced' },
          { term: 'management team', pronunciation: '/ˈmænɪdʒmənt tiːm/', translation: 'equipo directivo', example: 'The management team meets weekly to review progress and address challenges.', difficulty: 'beginner' },
          { term: 'organizational resilience', pronunciation: '/ˌɔːrɡənaɪˈzeɪʃənl rɪˈzɪliəns/', translation: 'resiliencia organizacional', example: 'Building organizational resilience helps us recover quickly from setbacks.', difficulty: 'advanced' },
          { term: 'business planning', pronunciation: '/ˈbɪznəs ˈplænɪŋ/', translation: 'planificación empresarial', example: 'Annual business planning sessions set priorities and allocate resources.', difficulty: 'intermediate' },
          { term: 'administrative control', pronunciation: '/ədˈmɪnɪstrətɪv kənˈtroʊl/', translation: 'control administrativo', example: 'Strong administrative control prevents errors and ensures compliance.', difficulty: 'intermediate' },
          { term: 'organizational agility', pronunciation: '/ˌɔːrɡənaɪˈzeɪʃənl əˈdʒɪləti/', translation: 'agilidad organizacional', example: 'Organizational agility enables us to respond quickly to market opportunities.', difficulty: 'advanced' },
          { term: 'business objective', pronunciation: '/ˈbɪznəs əbˈdʒɛktɪv/', translation: 'objetivo empresarial', example: 'Our primary business objective is to increase market share by 15% this year.', difficulty: 'beginner' },
          { term: 'management framework', pronunciation: '/ˈmænɪdʒmənt ˈfreɪmwɜːrk/', translation: 'marco de gestión', example: 'The management framework provides structure for decision-making and accountability.', difficulty: 'intermediate' },
          { term: 'organizational capacity', pronunciation: '/ˌɔːrɡənaɪˈzeɪʃənl kəˈpæsəti/', translation: 'capacidad organizacional', example: 'We\'re investing in training to build organizational capacity for growth.', difficulty: 'advanced' },
          { term: 'business administration', pronunciation: '/ˈbɪznəs ədˌmɪnɪˈstreɪʃən/', translation: 'administración de empresas', example: 'A degree in business administration provides foundational management knowledge.', difficulty: 'beginner' },
          { term: 'management principles', pronunciation: '/ˈmænɪdʒmənt ˈprɪnsəplz/', translation: 'principios de gestión', example: 'Our management principles emphasize transparency, accountability, and collaboration.', difficulty: 'intermediate' },
          { term: 'organizational performance', pronunciation: '/ˌɔːrɡənaɪˈzeɪʃənl pərˈfɔːrməns/', translation: 'desempeño organizacional', example: 'Organizational performance improved significantly after implementing new systems.', difficulty: 'intermediate' },
          { term: 'business excellence', pronunciation: '/ˈbɪznəs ˈɛksələns/', translation: 'excelencia empresarial', example: 'Achieving business excellence requires continuous improvement and innovation.', difficulty: 'advanced' },
          { term: 'administrative workflow', pronunciation: '/ədˈmɪnɪstrətɪv ˈwɜːrkfloʊ/', translation: 'flujo de trabajo administrativo', example: 'Digitizing the administrative workflow reduced processing time by 50%.', difficulty: 'intermediate' },
          { term: 'organizational sustainability', pronunciation: '/ˌɔːrɡənaɪˈzeɪʃənl səˌsteɪnəˈbɪləti/', translation: 'sostenibilidad organizacional', example: 'Organizational sustainability requires balancing financial, social, and environmental goals.', difficulty: 'advanced' },
          { term: 'Stakeholder engagement', pronunciation: '/ˈsteɪkˌhoʊldər ɪnˈgeɪdʒmənt/', translation: 'Compromiso de las partes interesadas', example: 'Effective stakeholder engagement is crucial for the success of our organizational transformation initiative.', difficulty: 'advanced' },
          { term: 'Delegation', pronunciation: '/ˌdɛləˈgeɪʃən/', translation: 'Delegación', example: 'Proper delegation of tasks allows managers to focus on strategic priorities while empowering team members.', difficulty: 'intermediate' },
          { term: 'Performance metrics', pronunciation: '/pərˈfɔrməns ˈmɛtrɪks/', translation: 'Métricas de rendimiento', example: 'We track performance metrics monthly to ensure our department meets its quarterly objectives.', difficulty: 'intermediate' }
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
          { term: 'Win rate', pronunciation: '/wɪn reɪt/', translation: 'Tasa de éxito', example: 'Our win rate is 45% this quarter', difficulty: 'intermediate' },
          { term: 'sales pipeline', pronunciation: '/seɪlz ˈpaɪplaɪn/', translation: 'embudo de ventas', example: 'Our sales pipeline shows 50 qualified leads in various stages of the buying process.', difficulty: 'intermediate' },
          { term: 'closing rate', pronunciation: '/ˈkloʊzɪŋ reɪt/', translation: 'tasa de cierre', example: 'The team\'s closing rate improved from 15% to 25% after implementing new techniques.', difficulty: 'intermediate' },
          { term: 'cold calling', pronunciation: '/koʊld ˈkɔːlɪŋ/', translation: 'llamadas en frío', example: 'Cold calling remains an effective strategy for reaching new prospects.', difficulty: 'beginner' },
          { term: 'value proposition', pronunciation: '/ˈvæljuː ˌprɒpəˈzɪʃən/', translation: 'propuesta de valor', example: 'Our value proposition emphasizes cost savings and superior customer service.', difficulty: 'intermediate' },
          { term: 'sales quota', pronunciation: '/seɪlz ˈkwoʊtə/', translation: 'cuota de ventas', example: 'Each sales representative has a monthly sales quota of $100,000.', difficulty: 'beginner' },
          { term: 'lead generation', pronunciation: '/liːd ˌdʒɛnəˈreɪʃən/', translation: 'generación de prospectos', example: 'Our lead generation strategy combines content marketing with targeted advertising.', difficulty: 'intermediate' },
          { term: 'business development', pronunciation: '/ˈbɪznəs dɪˈvɛləpmənt/', translation: 'desarrollo de negocios', example: 'The business development team identified three new market opportunities.', difficulty: 'intermediate' },
          { term: 'sales forecast', pronunciation: '/seɪlz ˈfɔːrkæst/', translation: 'pronóstico de ventas', example: 'The sales forecast predicts 20% revenue growth in the next quarter.', difficulty: 'intermediate' },
          { term: 'customer relationship management', pronunciation: '/ˈkʌstəmər rɪˈleɪʃənʃɪp ˈmænɪdʒmənt/', translation: 'gestión de relaciones con clientes', example: 'Our customer relationship management system tracks all interactions with prospects and clients.', difficulty: 'advanced' },
          { term: 'sales territory', pronunciation: '/seɪlz ˈtɛrɪtɔːri/', translation: 'territorio de ventas', example: 'Each sales representative is assigned a specific sales territory based on geography.', difficulty: 'beginner' },
          { term: 'upselling', pronunciation: '/ˈʌpsɛlɪŋ/', translation: 'venta adicional', example: 'Upselling premium features increased our average transaction value by 30%.', difficulty: 'intermediate' },
          { term: 'cross-selling', pronunciation: '/krɒs ˈsɛlɪŋ/', translation: 'venta cruzada', example: 'Cross-selling complementary products boosted revenue per customer significantly.', difficulty: 'intermediate' },
          { term: 'sales commission', pronunciation: '/seɪlz kəˈmɪʃən/', translation: 'comisión de ventas', example: 'Sales representatives earn a 10% sales commission on all closed deals.', difficulty: 'beginner' },
          { term: 'prospecting', pronunciation: '/ˈprɒspɛktɪŋ/', translation: 'prospección', example: 'Effective prospecting requires research to identify qualified potential customers.', difficulty: 'beginner' },
          { term: 'sales cycle', pronunciation: '/seɪlz ˈsaɪkl/', translation: 'ciclo de ventas', example: 'Our average sales cycle is 45 days from first contact to closing.', difficulty: 'intermediate' },
          { term: 'negotiation', pronunciation: '/nɪˌɡoʊʃiˈeɪʃən/', translation: 'negociación', example: 'Successful negotiation requires understanding the client\'s needs and constraints.', difficulty: 'intermediate' },
          { term: 'sales presentation', pronunciation: '/seɪlz ˌprɛzənˈteɪʃən/', translation: 'presentación de ventas', example: 'The sales presentation highlighted our product\'s unique features and benefits.', difficulty: 'beginner' },
          { term: 'account management', pronunciation: '/əˈkaʊnt ˈmænɪdʒmənt/', translation: 'gestión de cuentas', example: 'Strong account management ensures customer satisfaction and repeat business.', difficulty: 'intermediate' },
          { term: 'sales enablement', pronunciation: '/seɪlz ɪˈneɪblmənt/', translation: 'habilitación de ventas', example: 'Sales enablement tools provide representatives with resources to close deals faster.', difficulty: 'advanced' },
          { term: 'revenue stream', pronunciation: '/ˈrɛvənjuː striːm/', translation: 'flujo de ingresos', example: 'We\'re diversifying our revenue streams to reduce dependence on a single product.', difficulty: 'intermediate' },
          { term: 'sales strategy', pronunciation: '/seɪlz ˈstrætədʒi/', translation: 'estrategia de ventas', example: 'Our sales strategy focuses on building long-term relationships with key accounts.', difficulty: 'intermediate' },
          { term: 'qualified lead', pronunciation: '/ˈkwɒlɪfaɪd liːd/', translation: 'prospecto calificado', example: 'Marketing generated 200 qualified leads that meet our ideal customer profile.', difficulty: 'intermediate' },
          { term: 'sales funnel', pronunciation: '/seɪlz ˈfʌnl/', translation: 'embudo de ventas', example: 'We analyze the sales funnel to identify where prospects drop off.', difficulty: 'intermediate' },
          { term: 'business proposal', pronunciation: '/ˈbɪznəs prəˈpoʊzəl/', translation: 'propuesta comercial', example: 'The business proposal outlined pricing, deliverables, and implementation timeline.', difficulty: 'intermediate' },
          { term: 'sales performance', pronunciation: '/seɪlz pərˈfɔːrməns/', translation: 'desempeño de ventas', example: 'Sales performance metrics help us identify top performers and areas for improvement.', difficulty: 'intermediate' },
          { term: 'customer acquisition', pronunciation: '/ˈkʌstəmər ˌækwɪˈzɪʃən/', translation: 'adquisición de clientes', example: 'Customer acquisition costs have decreased due to improved targeting.', difficulty: 'intermediate' },
          { term: 'sales pitch', pronunciation: '/seɪlz pɪtʃ/', translation: 'discurso de ventas', example: 'A compelling sales pitch addresses the customer\'s pain points and offers solutions.', difficulty: 'beginner' },
          { term: 'market penetration', pronunciation: '/ˈmɑːrkɪt ˌpɛnɪˈtreɪʃən/', translation: 'penetración de mercado', example: 'Our market penetration strategy targets underserved segments in emerging markets.', difficulty: 'intermediate' },
          { term: 'sales conversion', pronunciation: '/seɪlz kənˈvɜːrʒən/', translation: 'conversión de ventas', example: 'Improving sales conversion rates is our top priority this quarter.', difficulty: 'intermediate' },
          { term: 'business partnership', pronunciation: '/ˈbɪznəs ˈpɑːrtnərʃɪp/', translation: 'asociación comercial', example: 'The business partnership with a major distributor expanded our market reach.', difficulty: 'intermediate' },
          { term: 'sales target', pronunciation: '/seɪlz ˈtɑːrɡɪt/', translation: 'objetivo de ventas', example: 'We exceeded our annual sales target by 15% this year.', difficulty: 'beginner' },
          { term: 'competitive advantage', pronunciation: '/kəmˈpɛtɪtɪv ədˈvæntɪdʒ/', translation: 'ventaja competitiva', example: 'Our competitive advantage lies in superior technology and customer service.', difficulty: 'intermediate' },
          { term: 'sales objection', pronunciation: '/seɪlz əbˈdʒɛkʃən/', translation: 'objeción de ventas', example: 'Handling sales objections effectively requires preparation and active listening.', difficulty: 'intermediate' },
          { term: 'business networking', pronunciation: '/ˈbɪznəs ˈnɛtwɜːrkɪŋ/', translation: 'networking empresarial', example: 'Business networking events provide opportunities to meet potential clients and partners.', difficulty: 'beginner' },
          { term: 'sales incentive', pronunciation: '/seɪlz ɪnˈsɛntɪv/', translation: 'incentivo de ventas', example: 'The sales incentive program rewards top performers with bonuses and trips.', difficulty: 'beginner' },
          { term: 'market analysis', pronunciation: '/ˈmɑːrkɪt əˈnæləsɪs/', translation: 'análisis de mercado', example: 'Market analysis revealed growing demand for sustainable products.', difficulty: 'intermediate' },
          { term: 'sales automation', pronunciation: '/seɪlz ˌɔːtəˈmeɪʃən/', translation: 'automatización de ventas', example: 'Sales automation tools handle routine tasks, freeing time for customer interactions.', difficulty: 'advanced' },
          { term: 'business opportunity', pronunciation: '/ˈbɪznəs ˌɒpərˈtuːnəti/', translation: 'oportunidad de negocio', example: 'We identified a significant business opportunity in the healthcare sector.', difficulty: 'beginner' },
          { term: 'sales meeting', pronunciation: '/seɪlz ˈmiːtɪŋ/', translation: 'reunión de ventas', example: 'Weekly sales meetings review progress and share best practices.', difficulty: 'beginner' },
          { term: 'customer retention', pronunciation: '/ˈkʌstəmər rɪˈtɛnʃən/', translation: 'retención de clientes', example: 'Customer retention programs focus on building loyalty and reducing churn.', difficulty: 'intermediate' },
          { term: 'sales training', pronunciation: '/seɪlz ˈtreɪnɪŋ/', translation: 'capacitación en ventas', example: 'Regular sales training keeps the team updated on new products and techniques.', difficulty: 'beginner' },
          { term: 'business expansion', pronunciation: '/ˈbɪznəs ɪkˈspænʃən/', translation: 'expansión empresarial', example: 'Business expansion into Asian markets is planned for next year.', difficulty: 'intermediate' },
          { term: 'sales analytics', pronunciation: '/seɪlz ˌænəˈlɪtɪks/', translation: 'analítica de ventas', example: 'Sales analytics help us understand which products and strategies perform best.', difficulty: 'advanced' },
          { term: 'business model', pronunciation: '/ˈbɪznəs ˈmɒdl/', translation: 'modelo de negocio', example: 'Our business model is based on recurring subscription revenue.', difficulty: 'intermediate' },
          { term: 'sales representative', pronunciation: '/seɪlz ˌrɛprɪˈzɛntətɪv/', translation: 'representante de ventas', example: 'Each sales representative manages a portfolio of 50 active accounts.', difficulty: 'beginner' },
          { term: 'market share', pronunciation: '/ˈmɑːrkɪt ʃɛr/', translation: 'cuota de mercado', example: 'We increased our market share from 10% to 15% in the past year.', difficulty: 'intermediate' },
          { term: 'sales dashboard', pronunciation: '/seɪlz ˈdæʃbɔːrd/', translation: 'panel de ventas', example: 'The sales dashboard provides real-time visibility into team performance.', difficulty: 'intermediate' },
          { term: 'business intelligence', pronunciation: '/ˈbɪznəs ɪnˈtɛlɪdʒəns/', translation: 'inteligencia de negocios', example: 'Business intelligence tools help us make data-driven sales decisions.', difficulty: 'advanced' },
          { term: 'sales process', pronunciation: '/seɪlz ˈprɒsɛs/', translation: 'proceso de ventas', example: 'Our standardized sales process ensures consistency across the team.', difficulty: 'intermediate' },
          { term: 'business growth', pronunciation: '/ˈbɪznəs ɡroʊθ/', translation: 'crecimiento empresarial', example: 'Business growth of 25% exceeded our projections for the year.', difficulty: 'beginner' },
          { term: 'sales channel', pronunciation: '/seɪlz ˈtʃænl/', translation: 'canal de ventas', example: 'We\'re expanding our sales channels to include e-commerce and retail partners.', difficulty: 'intermediate' },
          { term: 'business transaction', pronunciation: '/ˈbɪznəs trænˈzækʃən/', translation: 'transacción comercial', example: 'Each business transaction is recorded in our accounting system.', difficulty: 'beginner' },
          { term: 'sales methodology', pronunciation: '/seɪlz ˌmɛθəˈdɒlədʒi/', translation: 'metodología de ventas', example: 'We adopted a consultative sales methodology focused on solving customer problems.', difficulty: 'advanced' },
          { term: 'business relationship', pronunciation: '/ˈbɪznəs rɪˈleɪʃənʃɪp/', translation: 'relación comercial', example: 'Building strong business relationships leads to repeat sales and referrals.', difficulty: 'intermediate' },
          { term: 'sales volume', pronunciation: '/seɪlz ˈvɒljuːm/', translation: 'volumen de ventas', example: 'Sales volume increased by 40% during the holiday season.', difficulty: 'beginner' },
          { term: 'business negotiation', pronunciation: '/ˈbɪznəs nɪˌɡoʊʃiˈeɪʃən/', translation: 'negociación comercial', example: 'Successful business negotiation requires understanding both parties\' interests.', difficulty: 'intermediate' },
          { term: 'sales territory management', pronunciation: '/seɪlz ˈtɛrɪtɔːri ˈmænɪdʒmənt/', translation: 'gestión de territorio de ventas', example: 'Effective sales territory management ensures balanced workload and coverage.', difficulty: 'advanced' },
          { term: 'business contract', pronunciation: '/ˈbɪznəs ˈkɒntrækt/', translation: 'contrato comercial', example: 'The business contract outlines terms, pricing, and delivery schedules.', difficulty: 'intermediate' },
          { term: 'sales revenue', pronunciation: '/seɪlz ˈrɛvənjuː/', translation: 'ingresos por ventas', example: 'Sales revenue reached $10 million in the first quarter.', difficulty: 'beginner' },
          { term: 'business deal', pronunciation: '/ˈbɪznəs diːl/', translation: 'trato comercial', example: 'Closing the business deal required months of negotiation and relationship building.', difficulty: 'beginner' },
          { term: 'sales effectiveness', pronunciation: '/seɪlz ɪˈfɛktɪvnəs/', translation: 'efectividad de ventas', example: 'Improving sales effectiveness requires better training and tools.', difficulty: 'intermediate' },
          { term: 'business client', pronunciation: '/ˈbɪznəs ˈklaɪənt/', translation: 'cliente empresarial', example: 'Our largest business client accounts for 20% of annual revenue.', difficulty: 'beginner' },
          { term: 'sales productivity', pronunciation: '/seɪlz ˌprɒdʌkˈtɪvəti/', translation: 'productividad de ventas', example: 'Sales productivity increased after implementing new CRM software.', difficulty: 'intermediate' },
          { term: 'business venture', pronunciation: '/ˈbɪznəs ˈvɛntʃər/', translation: 'empresa comercial', example: 'The new business venture focuses on sustainable energy solutions.', difficulty: 'intermediate' },
          { term: 'sales leadership', pronunciation: '/seɪlz ˈliːdərʃɪp/', translation: 'liderazgo de ventas', example: 'Strong sales leadership motivates the team and drives results.', difficulty: 'intermediate' },
          { term: 'business ecosystem', pronunciation: '/ˈbɪznəs ˈiːkoʊˌsɪstəm/', translation: 'ecosistema empresarial', example: 'Our business ecosystem includes suppliers, partners, and distribution channels.', difficulty: 'advanced' },
          { term: 'sales excellence', pronunciation: '/seɪlz ˈɛksələns/', translation: 'excelencia en ventas', example: 'Achieving sales excellence requires continuous improvement and customer focus.', difficulty: 'advanced' },
          { term: 'Sales pipeline', pronunciation: '/seɪlz ˈpaɪpˌlaɪn/', translation: 'Embudo de ventas', example: 'Our sales pipeline shows we have 45 qualified leads in various stages of the buying process.', difficulty: 'intermediate' },
          { term: 'Upselling', pronunciation: '/ˈʌpˌsɛlɪŋ/', translation: 'Venta adicional', example: 'Through effective upselling techniques, we increased our average transaction value by 23% this quarter.', difficulty: 'intermediate' },
          { term: 'Cold calling', pronunciation: '/koʊld ˈkɔlɪŋ/', translation: 'Llamadas en frío', example: 'Despite the rise of digital marketing, cold calling remains an effective strategy for B2B sales in our industry.', difficulty: 'beginner' }
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
          { term: 'Scalability', pronunciation: '/ˌskeɪləˈbɪləti/', translation: 'Escalabilidad', example: 'Scalability is crucial for growth', difficulty: 'intermediate' },
          { term: 'machine learning', pronunciation: '/məˈʃiːn ˈlɜːrnɪŋ/', translation: 'aprendizaje automático', example: 'Machine learning algorithms improve their performance through experience with data.', difficulty: 'intermediate' },
          { term: 'neural network', pronunciation: '/ˈnjʊrəl ˈnɛtwɜːrk/', translation: 'red neuronal', example: 'The neural network was trained on millions of images to recognize patterns.', difficulty: 'advanced' },
          { term: 'artificial intelligence', pronunciation: '/ˌɑːrtɪˈfɪʃəl ɪnˈtɛlɪdʒəns/', translation: 'inteligencia artificial', example: 'Artificial intelligence is transforming industries from healthcare to finance.', difficulty: 'intermediate' },
          { term: 'deep learning', pronunciation: '/diːp ˈlɜːrnɪŋ/', translation: 'aprendizaje profundo', example: 'Deep learning models can process complex data like images and speech.', difficulty: 'advanced' },
          { term: 'natural language processing', pronunciation: '/ˈnætʃərəl ˈlæŋɡwɪdʒ ˈprɒsɛsɪŋ/', translation: 'procesamiento de lenguaje natural', example: 'Natural language processing enables computers to understand and generate human language.', difficulty: 'advanced' },
          { term: 'cloud computing', pronunciation: '/klaʊd kəmˈpjuːtɪŋ/', translation: 'computación en la nube', example: 'Cloud computing allows businesses to scale infrastructure without physical servers.', difficulty: 'intermediate' },
          { term: 'data analytics', pronunciation: '/ˈdeɪtə ˌænəˈlɪtɪks/', translation: 'analítica de datos', example: 'Data analytics helps us identify trends and make informed business decisions.', difficulty: 'intermediate' },
          { term: 'algorithm', pronunciation: '/ˈælɡərɪðəm/', translation: 'algoritmo', example: 'The algorithm processes thousands of transactions per second.', difficulty: 'intermediate' },
          { term: 'cybersecurity', pronunciation: '/ˈsaɪbərsɪˌkjʊrəti/', translation: 'ciberseguridad', example: 'Cybersecurity measures protect our systems from unauthorized access and attacks.', difficulty: 'intermediate' },
          { term: 'big data', pronunciation: '/bɪɡ ˈdeɪtə/', translation: 'macrodatos', example: 'Big data technologies enable us to analyze massive datasets in real-time.', difficulty: 'intermediate' },
          { term: 'blockchain', pronunciation: '/ˈblɒktʃeɪn/', translation: 'cadena de bloques', example: 'Blockchain technology ensures secure and transparent transactions.', difficulty: 'advanced' },
          { term: 'computer vision', pronunciation: '/kəmˈpjuːtər ˈvɪʒən/', translation: 'visión por computadora', example: 'Computer vision systems can identify objects and faces in images and videos.', difficulty: 'advanced' },
          { term: 'software development', pronunciation: '/ˈsɒftwɛr dɪˈvɛləpmənt/', translation: 'desarrollo de software', example: 'Our software development team follows agile methodologies for faster delivery.', difficulty: 'intermediate' },
          { term: 'application programming interface', pronunciation: '/ˌæplɪˈkeɪʃən ˈproʊɡræmɪŋ ˈɪntərfeɪs/', translation: 'interfaz de programación de aplicaciones', example: 'The application programming interface allows different systems to communicate seamlessly.', difficulty: 'advanced' },
          { term: 'data mining', pronunciation: '/ˈdeɪtə ˈmaɪnɪŋ/', translation: 'minería de datos', example: 'Data mining techniques revealed hidden patterns in customer behavior.', difficulty: 'intermediate' },
          { term: 'internet of things', pronunciation: '/ˈɪntərnɛt əv θɪŋz/', translation: 'internet de las cosas', example: 'Internet of things devices collect data from sensors throughout our facilities.', difficulty: 'intermediate' },
          { term: 'predictive analytics', pronunciation: '/prɪˈdɪktɪv ˌænəˈlɪtɪks/', translation: 'analítica predictiva', example: 'Predictive analytics helps us forecast demand and optimize inventory.', difficulty: 'advanced' },
          { term: 'automation', pronunciation: '/ˌɔːtəˈmeɪʃən/', translation: 'automatización', example: 'Automation of repetitive tasks increased productivity by 50%.', difficulty: 'beginner' },
          { term: 'digital transformation', pronunciation: '/ˈdɪdʒɪtl ˌtrænsfərˈmeɪʃən/', translation: 'transformación digital', example: 'Digital transformation is essential for staying competitive in today\'s market.', difficulty: 'intermediate' },
          { term: 'data science', pronunciation: '/ˈdeɪtə ˈsaɪəns/', translation: 'ciencia de datos', example: 'Our data science team builds models to predict customer churn.', difficulty: 'intermediate' },
          { term: 'robotics', pronunciation: '/roʊˈbɒtɪks/', translation: 'robótica', example: 'Robotics technology is revolutionizing manufacturing and logistics.', difficulty: 'intermediate' },
          { term: 'quantum computing', pronunciation: '/ˈkwɒntəm kəmˈpjuːtɪŋ/', translation: 'computación cuántica', example: 'Quantum computing promises to solve complex problems beyond classical computers.', difficulty: 'advanced' },
          { term: 'augmented reality', pronunciation: '/ɔːɡˈmɛntɪd riˈæləti/', translation: 'realidad aumentada', example: 'Augmented reality applications enhance training and customer experiences.', difficulty: 'intermediate' },
          { term: 'virtual reality', pronunciation: '/ˈvɜːrtʃuəl riˈæləti/', translation: 'realidad virtual', example: 'Virtual reality simulations provide immersive training environments.', difficulty: 'intermediate' },
          { term: 'edge computing', pronunciation: '/ɛdʒ kəmˈpjuːtɪŋ/', translation: 'computación en el borde', example: 'Edge computing processes data closer to the source for faster response times.', difficulty: 'advanced' },
          { term: 'artificial neural network', pronunciation: '/ˌɑːrtɪˈfɪʃəl ˈnjʊrəl ˈnɛtwɜːrk/', translation: 'red neuronal artificial', example: 'The artificial neural network mimics the human brain\'s structure and function.', difficulty: 'advanced' },
          { term: 'data visualization', pronunciation: '/ˈdeɪtə ˌvɪʒuəlaɪˈzeɪʃən/', translation: 'visualización de datos', example: 'Data visualization tools help stakeholders understand complex information quickly.', difficulty: 'intermediate' },
          { term: 'software as a service', pronunciation: '/ˈsɒftwɛr æz ə ˈsɜːrvɪs/', translation: 'software como servicio', example: 'Software as a service eliminates the need for local installation and maintenance.', difficulty: 'intermediate' },
          { term: 'reinforcement learning', pronunciation: '/ˌriːɪnˈfɔːrsmənt ˈlɜːrnɪŋ/', translation: 'aprendizaje por refuerzo', example: 'Reinforcement learning enables AI agents to learn optimal strategies through trial and error.', difficulty: 'advanced' },
          { term: 'supervised learning', pronunciation: '/ˈsuːpərvaɪzd ˈlɜːrnɪŋ/', translation: 'aprendizaje supervisado', example: 'Supervised learning uses labeled data to train predictive models.', difficulty: 'advanced' },
          { term: 'unsupervised learning', pronunciation: '/ˌʌnsəˈpɜːrvaɪzd ˈlɜːrnɪŋ/', translation: 'aprendizaje no supervisado', example: 'Unsupervised learning discovers hidden patterns in unlabeled data.', difficulty: 'advanced' },
          { term: 'convolutional neural network', pronunciation: '/ˌkɒnvəˈluːʃənl ˈnjʊrəl ˈnɛtwɜːrk/', translation: 'red neuronal convolucional', example: 'Convolutional neural networks excel at image recognition tasks.', difficulty: 'advanced' },
          { term: 'recurrent neural network', pronunciation: '/rɪˈkʌrənt ˈnjʊrəl ˈnɛtwɜːrk/', translation: 'red neuronal recurrente', example: 'Recurrent neural networks process sequential data like text and time series.', difficulty: 'advanced' },
          { term: 'generative AI', pronunciation: '/ˈdʒɛnərətɪv eɪ aɪ/', translation: 'IA generativa', example: 'Generative AI creates new content including text, images, and code.', difficulty: 'advanced' },
          { term: 'transfer learning', pronunciation: '/ˈtrænsfɜːr ˈlɜːrnɪŋ/', translation: 'aprendizaje por transferencia', example: 'Transfer learning allows us to adapt pre-trained models to new tasks efficiently.', difficulty: 'advanced' },
          { term: 'model training', pronunciation: '/ˈmɒdl ˈtreɪnɪŋ/', translation: 'entrenamiento de modelos', example: 'Model training requires significant computational resources and quality data.', difficulty: 'intermediate' },
          { term: 'feature engineering', pronunciation: '/ˈfiːtʃər ˌɛndʒɪˈnɪrɪŋ/', translation: 'ingeniería de características', example: 'Feature engineering transforms raw data into meaningful inputs for machine learning.', difficulty: 'advanced' },
          { term: 'hyperparameter tuning', pronunciation: '/ˈhaɪpərpəˌræmɪtər ˈtuːnɪŋ/', translation: 'ajuste de hiperparámetros', example: 'Hyperparameter tuning optimizes model performance through systematic experimentation.', difficulty: 'advanced' },
          { term: 'overfitting', pronunciation: '/ˈoʊvərˌfɪtɪŋ/', translation: 'sobreajuste', example: 'Overfitting occurs when a model learns training data too well and fails on new data.', difficulty: 'advanced' },
          { term: 'underfitting', pronunciation: '/ˈʌndərˌfɪtɪŋ/', translation: 'subajuste', example: 'Underfitting happens when a model is too simple to capture data patterns.', difficulty: 'advanced' },
          { term: 'training dataset', pronunciation: '/ˈtreɪnɪŋ ˈdeɪtəsɛt/', translation: 'conjunto de datos de entrenamiento', example: 'The training dataset contains 100,000 labeled examples for model development.', difficulty: 'intermediate' },
          { term: 'validation dataset', pronunciation: '/ˌvælɪˈdeɪʃən ˈdeɪtəsɛt/', translation: 'conjunto de datos de validación', example: 'The validation dataset helps us tune model parameters without overfitting.', difficulty: 'intermediate' },
          { term: 'test dataset', pronunciation: '/tɛst ˈdeɪtəsɛt/', translation: 'conjunto de datos de prueba', example: 'The test dataset provides an unbiased evaluation of final model performance.', difficulty: 'intermediate' },
          { term: 'model deployment', pronunciation: '/ˈmɒdl dɪˈplɔɪmənt/', translation: 'despliegue de modelos', example: 'Model deployment requires careful monitoring and version control.', difficulty: 'intermediate' },
          { term: 'inference', pronunciation: '/ˈɪnfərəns/', translation: 'inferencia', example: 'The model performs inference on new data to generate predictions.', difficulty: 'intermediate' },
          { term: 'sentiment analysis', pronunciation: '/ˈsɛntɪmənt əˈnæləsɪs/', translation: 'análisis de sentimiento', example: 'Sentiment analysis determines whether customer reviews are positive or negative.', difficulty: 'intermediate' },
          { term: 'chatbot', pronunciation: '/ˈtʃætbɒt/', translation: 'chatbot', example: 'Our AI-powered chatbot handles 80% of customer inquiries automatically.', difficulty: 'beginner' },
          { term: 'recommendation system', pronunciation: '/ˌrɛkəmɛnˈdeɪʃən ˈsɪstəm/', translation: 'sistema de recomendación', example: 'The recommendation system suggests products based on browsing history and preferences.', difficulty: 'intermediate' },
          { term: 'anomaly detection', pronunciation: '/əˈnɒməli dɪˈtɛkʃən/', translation: 'detección de anomalías', example: 'Anomaly detection identifies unusual patterns that may indicate fraud or errors.', difficulty: 'advanced' },
          { term: 'image recognition', pronunciation: '/ˈɪmɪdʒ ˌrɛkəɡˈnɪʃən/', translation: 'reconocimiento de imágenes', example: 'Image recognition technology enables automated quality control in manufacturing.', difficulty: 'intermediate' },
          { term: 'speech recognition', pronunciation: '/spiːtʃ ˌrɛkəɡˈnɪʃən/', translation: 'reconocimiento de voz', example: 'Speech recognition allows users to control devices with voice commands.', difficulty: 'intermediate' },
          { term: 'text generation', pronunciation: '/tɛkst ˌdʒɛnəˈreɪʃən/', translation: 'generación de texto', example: 'Text generation models can write articles, emails, and code automatically.', difficulty: 'intermediate' },
          { term: 'object detection', pronunciation: '/ˈɒbdʒɛkt dɪˈtɛkʃən/', translation: 'detección de objetos', example: 'Object detection systems identify and locate multiple items in images.', difficulty: 'advanced' },
          { term: 'facial recognition', pronunciation: '/ˈfeɪʃəl ˌrɛkəɡˈnɪʃən/', translation: 'reconocimiento facial', example: 'Facial recognition technology enhances security and user authentication.', difficulty: 'intermediate' },
          { term: 'autonomous vehicle', pronunciation: '/ɔːˈtɒnəməs ˈviːɪkl/', translation: 'vehículo autónomo', example: 'Autonomous vehicles use AI to navigate roads without human intervention.', difficulty: 'advanced' },
          { term: 'machine translation', pronunciation: '/məˈʃiːn trænsˈleɪʃən/', translation: 'traducción automática', example: 'Machine translation enables real-time communication across language barriers.', difficulty: 'intermediate' },
          { term: 'data preprocessing', pronunciation: '/ˈdeɪtə ˌpriːˈprɒsɛsɪŋ/', translation: 'preprocesamiento de datos', example: 'Data preprocessing cleans and transforms raw data for analysis.', difficulty: 'intermediate' },
          { term: 'model accuracy', pronunciation: '/ˈmɒdl ˈækjərəsi/', translation: 'precisión del modelo', example: 'The model accuracy improved to 95% after additional training.', difficulty: 'intermediate' },
          { term: 'neural architecture', pronunciation: '/ˈnjʊrəl ˈɑːrkɪtɛktʃər/', translation: 'arquitectura neuronal', example: 'The neural architecture consists of multiple layers with specific functions.', difficulty: 'advanced' },
          { term: 'gradient descent', pronunciation: '/ˈɡreɪdiənt dɪˈsɛnt/', translation: 'descenso de gradiente', example: 'Gradient descent is an optimization algorithm used to train neural networks.', difficulty: 'advanced' },
          { term: 'backpropagation', pronunciation: '/ˌbækprɒpəˈɡeɪʃən/', translation: 'retropropagación', example: 'Backpropagation calculates gradients to update neural network weights.', difficulty: 'advanced' },
          { term: 'activation function', pronunciation: '/ˌæktɪˈveɪʃən ˈfʌŋkʃən/', translation: 'función de activación', example: 'The activation function introduces non-linearity into the neural network.', difficulty: 'advanced' },
          { term: 'loss function', pronunciation: '/lɒs ˈfʌŋkʃən/', translation: 'función de pérdida', example: 'The loss function measures the difference between predictions and actual values.', difficulty: 'advanced' },
          { term: 'batch processing', pronunciation: '/bætʃ ˈprɒsɛsɪŋ/', translation: 'procesamiento por lotes', example: 'Batch processing handles large volumes of data efficiently.', difficulty: 'intermediate' },
          { term: 'real-time processing', pronunciation: '/ˈriːəl taɪm ˈprɒsɛsɪŋ/', translation: 'procesamiento en tiempo real', example: 'Real-time processing enables immediate responses to incoming data.', difficulty: 'intermediate' },
          { term: 'model optimization', pronunciation: '/ˈmɒdl ˌɒptɪmaɪˈzeɪʃən/', translation: 'optimización de modelos', example: 'Model optimization reduces computational requirements while maintaining accuracy.', difficulty: 'advanced' },
          { term: 'ensemble learning', pronunciation: '/ɑːnˈsɑːmbl ˈlɜːrnɪŋ/', translation: 'aprendizaje en conjunto', example: 'Ensemble learning combines multiple models to improve prediction accuracy.', difficulty: 'advanced' },
          { term: 'Neural network', pronunciation: '/ˈnʊrəl ˈnɛtˌwɜrk/', translation: 'Red neuronal', example: 'Our neural network model achieved 94% accuracy in predicting customer churn patterns.', difficulty: 'advanced' },
          { term: 'Cloud computing', pronunciation: '/klaʊd kəmˈpjutɪŋ/', translation: 'Computación en la nube', example: 'Migrating to cloud computing reduced our IT infrastructure costs by 40% while improving scalability.', difficulty: 'intermediate' },
          { term: 'API integration', pronunciation: '/ˌeɪ pi ˈaɪ ˌɪntəˈgreɪʃən/', translation: 'Integración de API', example: 'The API integration between our CRM and accounting software automated data synchronization across platforms.', difficulty: 'advanced' }
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
          { term: 'Efficiency ratio', pronunciation: '/ɪˈfɪʃnsi ˈreɪʃioʊ/', translation: 'Ratio de eficiencia', example: 'The efficiency ratio improved to 85%', difficulty: 'intermediate' },
          { term: 'process optimization', pronunciation: '/ˈprɒsɛs ˌɒptɪmaɪˈzeɪʃən/', translation: 'optimización de procesos', example: 'Process optimization reduced production time by 30% without compromising quality.', difficulty: 'intermediate' },
          { term: 'standard operating procedure', pronunciation: '/ˈstændərd ˈɒpəreɪtɪŋ prəˈsiːdʒər/', translation: 'procedimiento operativo estándar', example: 'All employees must follow the standard operating procedure for safety compliance.', difficulty: 'intermediate' },
          { term: 'workflow management', pronunciation: '/ˈwɜːrkfloʊ ˈmænɪdʒmənt/', translation: 'gestión del flujo de trabajo', example: 'Workflow management software tracks tasks from initiation to completion.', difficulty: 'intermediate' },
          { term: 'continuous improvement', pronunciation: '/kənˈtɪnjuəs ɪmˈpruːvmənt/', translation: 'mejora continua', example: 'Our continuous improvement program encourages employees to suggest process enhancements.', difficulty: 'intermediate' },
          { term: 'lean manufacturing', pronunciation: '/liːn ˌmænjəˈfæktʃərɪŋ/', translation: 'manufactura esbelta', example: 'Lean manufacturing principles help us eliminate waste and increase efficiency.', difficulty: 'advanced' },
          { term: 'six sigma', pronunciation: '/sɪks ˈsɪɡmə/', translation: 'seis sigma', example: 'Six sigma methodology reduces defects to fewer than 3.4 per million opportunities.', difficulty: 'advanced' },
          { term: 'quality control', pronunciation: '/ˈkwɒlɪti kənˈtroʊl/', translation: 'control de calidad', example: 'Quality control inspections ensure products meet specifications before shipping.', difficulty: 'intermediate' },
          { term: 'capacity planning', pronunciation: '/kəˈpæsəti ˈplænɪŋ/', translation: 'planificación de capacidad', example: 'Capacity planning helps us prepare for seasonal demand fluctuations.', difficulty: 'intermediate' },
          { term: 'bottleneck analysis', pronunciation: '/ˈbɒtlnɛk əˈnæləsɪs/', translation: 'análisis de cuellos de botella', example: 'Bottleneck analysis identified the packaging line as the constraint in our process.', difficulty: 'intermediate' },
          { term: 'process mapping', pronunciation: '/ˈprɒsɛs ˈmæpɪŋ/', translation: 'mapeo de procesos', example: 'Process mapping visualizes each step in our order fulfillment workflow.', difficulty: 'intermediate' },
          { term: 'operational efficiency', pronunciation: '/ˌɒpəˈreɪʃənl ɪˈfɪʃənsi/', translation: 'eficiencia operacional', example: 'Improving operational efficiency is critical for maintaining competitive pricing.', difficulty: 'intermediate' },
          { term: 'root cause analysis', pronunciation: '/ruːt kɔːz əˈnæləsɪs/', translation: 'análisis de causa raíz', example: 'Root cause analysis revealed that equipment maintenance was the underlying issue.', difficulty: 'intermediate' },
          { term: 'process automation', pronunciation: '/ˈprɒsɛs ˌɔːtəˈmeɪʃən/', translation: 'automatización de procesos', example: 'Process automation eliminated manual data entry and reduced errors by 90%.', difficulty: 'intermediate' },
          { term: 'throughput', pronunciation: '/ˈθruːpʊt/', translation: 'rendimiento', example: 'Increasing throughput requires optimizing each stage of the production line.', difficulty: 'intermediate' },
          { term: 'cycle time', pronunciation: '/ˈsaɪkl taɪm/', translation: 'tiempo de ciclo', example: 'We reduced cycle time from 48 hours to 24 hours through process improvements.', difficulty: 'intermediate' },
          { term: 'lead time', pronunciation: '/liːd taɪm/', translation: 'tiempo de entrega', example: 'Shorter lead times give us a competitive advantage in the market.', difficulty: 'beginner' },
          { term: 'value stream mapping', pronunciation: '/ˈvæljuː striːm ˈmæpɪŋ/', translation: 'mapeo de flujo de valor', example: 'Value stream mapping identified non-value-added activities we could eliminate.', difficulty: 'advanced' },
          { term: 'kaizen', pronunciation: '/ˈkaɪzən/', translation: 'kaizen', example: 'Kaizen events bring teams together to solve specific operational problems.', difficulty: 'advanced' },
          { term: 'just-in-time', pronunciation: '/dʒʌst ɪn taɪm/', translation: 'justo a tiempo', example: 'Just-in-time inventory management reduces storage costs and waste.', difficulty: 'intermediate' },
          { term: 'total quality management', pronunciation: '/ˈtoʊtl ˈkwɒlɪti ˈmænɪdʒmənt/', translation: 'gestión de calidad total', example: 'Total quality management involves all employees in continuous improvement efforts.', difficulty: 'advanced' },
          { term: 'process reengineering', pronunciation: '/ˈprɒsɛs ˌriːɛndʒɪˈnɪrɪŋ/', translation: 'reingeniería de procesos', example: 'Process reengineering fundamentally redesigned our customer service operations.', difficulty: 'advanced' },
          { term: 'operational excellence', pronunciation: '/ˌɒpəˈreɪʃənl ˈɛksələns/', translation: 'excelencia operacional', example: 'Achieving operational excellence requires commitment from leadership and employees.', difficulty: 'advanced' },
          { term: 'performance indicator', pronunciation: '/pərˈfɔːrməns ˈɪndɪkeɪtər/', translation: 'indicador de rendimiento', example: 'We track key performance indicators to monitor operational health.', difficulty: 'intermediate' },
          { term: 'process efficiency', pronunciation: '/ˈprɒsɛs ɪˈfɪʃənsi/', translation: 'eficiencia de procesos', example: 'Process efficiency improvements saved the company $500,000 annually.', difficulty: 'intermediate' },
          { term: 'batch processing', pronunciation: '/bætʃ ˈprɒsɛsɪŋ/', translation: 'procesamiento por lotes', example: 'Batch processing allows us to handle large volumes during off-peak hours.', difficulty: 'intermediate' },
          { term: 'production scheduling', pronunciation: '/prəˈdʌkʃən ˈskɛdʒuːlɪŋ/', translation: 'programación de producción', example: 'Production scheduling balances customer demand with available capacity.', difficulty: 'intermediate' },
          { term: 'resource utilization', pronunciation: '/rɪˈsɔːrs ˌjuːtɪlaɪˈzeɪʃən/', translation: 'utilización de recursos', example: 'Improving resource utilization increased output without additional investment.', difficulty: 'intermediate' },
          { term: 'process standardization', pronunciation: '/ˈprɒsɛs ˌstændərdaɪˈzeɪʃən/', translation: 'estandarización de procesos', example: 'Process standardization ensures consistent quality across all facilities.', difficulty: 'intermediate' },
          { term: 'waste reduction', pronunciation: '/weɪst rɪˈdʌkʃən/', translation: 'reducción de desperdicios', example: 'Waste reduction initiatives cut material costs by 15% last year.', difficulty: 'beginner' },
          { term: 'process documentation', pronunciation: '/ˈprɒsɛs ˌdɒkjəmɛnˈteɪʃən/', translation: 'documentación de procesos', example: 'Comprehensive process documentation facilitates training and knowledge transfer.', difficulty: 'intermediate' },
          { term: 'operational metrics', pronunciation: '/ˌɒpəˈreɪʃənl ˈmɛtrɪks/', translation: 'métricas operacionales', example: 'Operational metrics provide visibility into daily performance and trends.', difficulty: 'intermediate' },
          { term: 'process flow', pronunciation: '/ˈprɒsɛs floʊ/', translation: 'flujo de proceso', example: 'Analyzing process flow revealed opportunities to eliminate redundant steps.', difficulty: 'intermediate' },
          { term: 'capacity utilization', pronunciation: '/kəˈpæsəti ˌjuːtɪlaɪˈzeɪʃən/', translation: 'utilización de capacidad', example: 'Our capacity utilization rate is currently 85% of maximum output.', difficulty: 'intermediate' },
          { term: 'process improvement', pronunciation: '/ˈprɒsɛs ɪmˈpruːvmənt/', translation: 'mejora de procesos', example: 'Process improvement initiatives are evaluated based on ROI and implementation time.', difficulty: 'intermediate' },
          { term: 'operational planning', pronunciation: '/ˌɒpəˈreɪʃənl ˈplænɪŋ/', translation: 'planificación operativa', example: 'Operational planning aligns daily activities with strategic objectives.', difficulty: 'intermediate' },
          { term: 'process control', pronunciation: '/ˈprɒsɛs kənˈtroʊl/', translation: 'control de procesos', example: 'Statistical process control helps us maintain consistent product quality.', difficulty: 'intermediate' },
          { term: 'downtime', pronunciation: '/ˈdaʊntaɪm/', translation: 'tiempo de inactividad', example: 'Reducing equipment downtime is a priority for our maintenance team.', difficulty: 'beginner' },
          { term: 'process validation', pronunciation: '/ˈprɒsɛs ˌvælɪˈdeɪʃən/', translation: 'validación de procesos', example: 'Process validation ensures our methods consistently produce quality results.', difficulty: 'intermediate' },
          { term: 'operational risk', pronunciation: '/ˌɒpəˈreɪʃənl rɪsk/', translation: 'riesgo operacional', example: 'We assess operational risk to identify potential disruptions to our processes.', difficulty: 'intermediate' },
          { term: 'process capability', pronunciation: '/ˈprɒsɛs ˌkeɪpəˈbɪləti/', translation: 'capacidad de proceso', example: 'Process capability analysis determines if our operations can meet specifications.', difficulty: 'advanced' },
          { term: 'operational dashboard', pronunciation: '/ˌɒpəˈreɪʃənl ˈdæʃbɔːrd/', translation: 'panel operacional', example: 'The operational dashboard provides real-time visibility into key metrics.', difficulty: 'intermediate' },
          { term: 'process audit', pronunciation: '/ˈprɒsɛs ˈɔːdɪt/', translation: 'auditoría de procesos', example: 'Regular process audits ensure compliance with quality standards.', difficulty: 'intermediate' },
          { term: 'operational strategy', pronunciation: '/ˌɒpəˈreɪʃənl ˈstrætədʒi/', translation: 'estrategia operacional', example: 'Our operational strategy focuses on flexibility and responsiveness.', difficulty: 'intermediate' },
          { term: 'process integration', pronunciation: '/ˈprɒsɛs ˌɪntɪˈɡreɪʃən/', translation: 'integración de procesos', example: 'Process integration eliminated handoffs and improved coordination.', difficulty: 'intermediate' },
          { term: 'operational capacity', pronunciation: '/ˌɒpəˈreɪʃənl kəˈpæsəti/', translation: 'capacidad operacional', example: 'We\'re expanding operational capacity to meet growing demand.', difficulty: 'intermediate' },
          { term: 'process variance', pronunciation: '/ˈprɒsɛs ˈvɛriəns/', translation: 'varianza de proceso', example: 'Reducing process variance improves consistency and quality.', difficulty: 'advanced' },
          { term: 'operational readiness', pronunciation: '/ˌɒpəˈreɪʃənl ˈrɛdinəs/', translation: 'preparación operacional', example: 'Operational readiness assessments ensure we\'re prepared for new product launches.', difficulty: 'intermediate' },
          { term: 'process monitoring', pronunciation: '/ˈprɒsɛs ˈmɒnɪtərɪŋ/', translation: 'monitoreo de procesos', example: 'Continuous process monitoring detects deviations before they impact quality.', difficulty: 'intermediate' },
          { term: 'operational baseline', pronunciation: '/ˌɒpəˈreɪʃənl ˈbeɪslaɪn/', translation: 'línea base operacional', example: 'Establishing an operational baseline helps us measure improvement over time.', difficulty: 'intermediate' },
          { term: 'process scalability', pronunciation: '/ˈprɒsɛs ˌskeɪləˈbɪləti/', translation: 'escalabilidad de procesos', example: 'Process scalability is essential for supporting business growth.', difficulty: 'advanced' },
          { term: 'operational continuity', pronunciation: '/ˌɒpəˈreɪʃənl ˌkɒntɪˈnjuːɪti/', translation: 'continuidad operacional', example: 'Operational continuity plans ensure we can maintain service during disruptions.', difficulty: 'intermediate' },
          { term: 'process reliability', pronunciation: '/ˈprɒsɛs rɪˌlaɪəˈbɪləti/', translation: 'confiabilidad de procesos', example: 'High process reliability reduces defects and customer complaints.', difficulty: 'intermediate' },
          { term: 'operational agility', pronunciation: '/ˌɒpəˈreɪʃənl əˈdʒɪləti/', translation: 'agilidad operacional', example: 'Operational agility enables us to respond quickly to market changes.', difficulty: 'advanced' },
          { term: 'process synchronization', pronunciation: '/ˈprɒsɛs ˌsɪŋkrənaɪˈzeɪʃən/', translation: 'sincronización de procesos', example: 'Process synchronization ensures smooth handoffs between departments.', difficulty: 'advanced' },
          { term: 'operational benchmark', pronunciation: '/ˌɒpəˈreɪʃənl ˈbɛntʃmɑːrk/', translation: 'punto de referencia operacional', example: 'We compare our performance against operational benchmarks from industry leaders.', difficulty: 'intermediate' },
          { term: 'process maturity', pronunciation: '/ˈprɒsɛs məˈtʃʊrəti/', translation: 'madurez de procesos', example: 'Process maturity assessments identify areas for standardization and improvement.', difficulty: 'advanced' },
          { term: 'operational resilience', pronunciation: '/ˌɒpəˈreɪʃənl rɪˈzɪliəns/', translation: 'resiliencia operacional', example: 'Building operational resilience helps us recover quickly from unexpected events.', difficulty: 'advanced' },
          { term: 'process transparency', pronunciation: '/ˈprɒsɛs trænsˈpærənsi/', translation: 'transparencia de procesos', example: 'Process transparency improves accountability and facilitates problem-solving.', difficulty: 'intermediate' },
          { term: 'operational framework', pronunciation: '/ˌɒpəˈreɪʃənl ˈfreɪmwɜːrk/', translation: 'marco operacional', example: 'The operational framework defines roles, responsibilities, and procedures.', difficulty: 'intermediate' },
          { term: 'process governance', pronunciation: '/ˈprɒsɛs ˈɡʌvərnəns/', translation: 'gobernanza de procesos', example: 'Strong process governance ensures compliance and consistent execution.', difficulty: 'advanced' },
          { term: 'operational sustainability', pronunciation: '/ˌɒpəˈreɪʃənl səˌsteɪnəˈbɪləti/', translation: 'sostenibilidad operacional', example: 'Operational sustainability initiatives reduce environmental impact while maintaining efficiency.', difficulty: 'advanced' },
          { term: 'process innovation', pronunciation: '/ˈprɒsɛs ˌɪnəˈveɪʃən/', translation: 'innovación de procesos', example: 'Process innovation led to breakthrough improvements in production speed.', difficulty: 'advanced' },
          { term: 'operational alignment', pronunciation: '/ˌɒpəˈreɪʃənl əˈlaɪnmənt/', translation: 'alineación operacional', example: 'Operational alignment ensures all activities support strategic goals.', difficulty: 'intermediate' },
          { term: 'process excellence', pronunciation: '/ˈprɒsɛs ˈɛksələns/', translation: 'excelencia de procesos', example: 'Achieving process excellence requires continuous learning and adaptation.', difficulty: 'advanced' },
          { term: 'operational transformation', pronunciation: '/ˌɒpəˈreɪʃənl ˌtrænsfərˈmeɪʃən/', translation: 'transformación operacional', example: 'Operational transformation initiatives modernized our entire production system.', difficulty: 'advanced' },
          { term: 'process architecture', pronunciation: '/ˈprɒsɛs ˈɑːrkɪtɛktʃər/', translation: 'arquitectura de procesos', example: 'The process architecture defines how different workflows interact and integrate.', difficulty: 'advanced' },
          { term: 'Standard operating procedure', pronunciation: '/ˈstændərd ˈɑpəˌreɪtɪŋ prəˈsidʒər/', translation: 'Procedimiento operativo estándar', example: 'All employees must follow the standard operating procedure to ensure consistency and quality control.', difficulty: 'intermediate' },
          { term: 'Bottleneck', pronunciation: '/ˈbɑtəlˌnɛk/', translation: 'Cuello de botella', example: 'We identified a bottleneck in our production line that was causing delays in order fulfillment.', difficulty: 'intermediate' },
          { term: 'Throughput', pronunciation: '/ˈθruˌpʊt/', translation: 'Rendimiento', example: 'By optimizing our workflow, we increased throughput by 35% without adding additional resources.', difficulty: 'advanced' },
          { term: 'Quality assurance', pronunciation: '/ˈkwɑləti əˈʃʊrəns/', translation: 'Aseguramiento de calidad', example: 'Our quality assurance team conducts rigorous testing before any product reaches the customer.', difficulty: 'intermediate' }
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
          { term: 'Profitability analysis', pronunciation: '/ˌprɑːfɪtəˈbɪləti əˈnæləsɪs/', translation: 'Análisis de rentabilidad', example: 'Profitability analysis guides decisions', difficulty: 'intermediate' },
          { term: 'balance sheet', pronunciation: '/ˈbæləns ʃiːt/', translation: 'balance general', example: 'The balance sheet shows our company\'s assets, liabilities, and equity at year-end.', difficulty: 'intermediate' },
          { term: 'income statement', pronunciation: '/ˈɪnkʌm ˈsteɪtmənt/', translation: 'estado de resultados', example: 'The income statement reveals a 15% increase in net profit this quarter.', difficulty: 'intermediate' },
          { term: 'cash flow', pronunciation: '/kæʃ floʊ/', translation: 'flujo de efectivo', example: 'Positive cash flow is essential for meeting operational expenses and growth.', difficulty: 'intermediate' },
          { term: 'accounts payable', pronunciation: '/əˈkaʊnts ˈpeɪəbl/', translation: 'cuentas por pagar', example: 'Our accounts payable balance decreased by 20% through better payment management.', difficulty: 'intermediate' },
          { term: 'accounts receivable', pronunciation: '/əˈkaʊnts rɪˈsiːvəbl/', translation: 'cuentas por cobrar', example: 'We\'re implementing stricter policies to reduce accounts receivable aging.', difficulty: 'intermediate' },
          { term: 'depreciation', pronunciation: '/dɪˌpriːʃiˈeɪʃən/', translation: 'depreciación', example: 'Annual depreciation of equipment is calculated using the straight-line method.', difficulty: 'intermediate' },
          { term: 'return on investment', pronunciation: '/rɪˈtɜːrn ɒn ɪnˈvɛstmənt/', translation: 'retorno de inversión', example: 'The marketing campaign achieved a return on investment of 300%.', difficulty: 'intermediate' },
          { term: 'financial statement', pronunciation: '/faɪˈnænʃəl ˈsteɪtmənt/', translation: 'estado financiero', example: 'Quarterly financial statements are reviewed by the board of directors.', difficulty: 'intermediate' },
          { term: 'gross profit', pronunciation: '/ɡroʊs ˈprɒfɪt/', translation: 'utilidad bruta', example: 'Gross profit margin improved to 45% after reducing production costs.', difficulty: 'intermediate' },
          { term: 'net profit', pronunciation: '/nɛt ˈprɒfɪt/', translation: 'utilidad neta', example: 'Net profit exceeded expectations despite increased operating expenses.', difficulty: 'intermediate' },
          { term: 'working capital', pronunciation: '/ˈwɜːrkɪŋ ˈkæpɪtl/', translation: 'capital de trabajo', example: 'Adequate working capital ensures we can meet short-term obligations.', difficulty: 'intermediate' },
          { term: 'equity', pronunciation: '/ˈɛkwɪti/', translation: 'patrimonio', example: 'Shareholder equity increased by $5 million through retained earnings.', difficulty: 'intermediate' },
          { term: 'liability', pronunciation: '/ˌlaɪəˈbɪləti/', translation: 'pasivo', example: 'Total liabilities decreased as we paid down long-term debt.', difficulty: 'intermediate' },
          { term: 'asset', pronunciation: '/ˈæsɛt/', translation: 'activo', example: 'The company\'s assets include property, equipment, and intellectual property.', difficulty: 'beginner' },
          { term: 'revenue', pronunciation: '/ˈrɛvənjuː/', translation: 'ingresos', example: 'Annual revenue grew by 25% compared to the previous fiscal year.', difficulty: 'beginner' },
          { term: 'expense', pronunciation: '/ɪkˈspɛns/', translation: 'gasto', example: 'Operating expenses increased due to expansion into new markets.', difficulty: 'beginner' },
          { term: 'budget', pronunciation: '/ˈbʌdʒɪt/', translation: 'presupuesto', example: 'The annual budget allocates resources across all departments.', difficulty: 'beginner' },
          { term: 'audit', pronunciation: '/ˈɔːdɪt/', translation: 'auditoría', example: 'The external audit confirmed the accuracy of our financial records.', difficulty: 'intermediate' },
          { term: 'financial forecast', pronunciation: '/faɪˈnænʃəl ˈfɔːrkæst/', translation: 'pronóstico financiero', example: 'The financial forecast projects 20% revenue growth over the next three years.', difficulty: 'intermediate' },
          { term: 'profit margin', pronunciation: '/ˈprɒfɪt ˈmɑːrdʒɪn/', translation: 'margen de utilidad', example: 'Our profit margin improved through cost reduction initiatives.', difficulty: 'intermediate' },
          { term: 'cost of goods sold', pronunciation: '/kɒst əv ɡʊdz soʊld/', translation: 'costo de bienes vendidos', example: 'Cost of goods sold increased due to higher raw material prices.', difficulty: 'intermediate' },
          { term: 'accrual accounting', pronunciation: '/əˈkruːəl əˈkaʊntɪŋ/', translation: 'contabilidad de acumulación', example: 'Accrual accounting records revenue when earned, not when cash is received.', difficulty: 'advanced' },
          { term: 'cash accounting', pronunciation: '/kæʃ əˈkaʊntɪŋ/', translation: 'contabilidad de caja', example: 'Small businesses often use cash accounting for its simplicity.', difficulty: 'intermediate' },
          { term: 'general ledger', pronunciation: '/ˈdʒɛnərəl ˈlɛdʒər/', translation: 'libro mayor', example: 'All financial transactions are recorded in the general ledger.', difficulty: 'intermediate' },
          { term: 'journal entry', pronunciation: '/ˈdʒɜːrnl ˈɛntri/', translation: 'asiento contable', example: 'Each journal entry must include debits and credits that balance.', difficulty: 'intermediate' },
          { term: 'trial balance', pronunciation: '/ˈtraɪəl ˈbæləns/', translation: 'balance de comprobación', example: 'The trial balance ensures that total debits equal total credits.', difficulty: 'intermediate' },
          { term: 'financial ratio', pronunciation: '/faɪˈnænʃəl ˈreɪʃioʊ/', translation: 'razón financiera', example: 'Financial ratios help investors assess company performance and health.', difficulty: 'intermediate' },
          { term: 'liquidity', pronunciation: '/lɪˈkwɪdəti/', translation: 'liquidez', example: 'Strong liquidity ensures we can meet short-term financial obligations.', difficulty: 'intermediate' },
          { term: 'solvency', pronunciation: '/ˈsɒlvənsi/', translation: 'solvencia', example: 'The company\'s solvency ratio indicates ability to meet long-term debts.', difficulty: 'advanced' },
          { term: 'capital expenditure', pronunciation: '/ˈkæpɪtl ɪkˈspɛndɪtʃər/', translation: 'gasto de capital', example: 'Capital expenditures for new equipment totaled $2 million this year.', difficulty: 'intermediate' },
          { term: 'operating expense', pronunciation: '/ˈɒpəreɪtɪŋ ɪkˈspɛns/', translation: 'gasto operativo', example: 'Operating expenses include salaries, rent, and utilities.', difficulty: 'intermediate' },
          { term: 'retained earnings', pronunciation: '/rɪˈteɪnd ˈɜːrnɪŋz/', translation: 'utilidades retenidas', example: 'Retained earnings are reinvested in the business for growth.', difficulty: 'intermediate' },
          { term: 'dividend', pronunciation: '/ˈdɪvɪdɛnd/', translation: 'dividendo', example: 'The board declared a quarterly dividend of $0.50 per share.', difficulty: 'intermediate' },
          { term: 'accounts reconciliation', pronunciation: '/əˈkaʊnts ˌrɛkənsɪliˈeɪʃən/', translation: 'conciliación de cuentas', example: 'Monthly accounts reconciliation ensures accuracy of financial records.', difficulty: 'intermediate' },
          { term: 'financial planning', pronunciation: '/faɪˈnænʃəl ˈplænɪŋ/', translation: 'planificación financiera', example: 'Strategic financial planning aligns resources with business objectives.', difficulty: 'intermediate' },
          { term: 'tax liability', pronunciation: '/tæks ˌlaɪəˈbɪləti/', translation: 'obligación tributaria', example: 'Our tax liability decreased through legitimate deductions and credits.', difficulty: 'intermediate' },
          { term: 'financial analysis', pronunciation: '/faɪˈnænʃəl əˈnæləsɪs/', translation: 'análisis financiero', example: 'Financial analysis revealed opportunities to improve profitability.', difficulty: 'intermediate' },
          { term: 'break-even point', pronunciation: '/breɪk ˈiːvən pɔɪnt/', translation: 'punto de equilibrio', example: 'We reached the break-even point six months after product launch.', difficulty: 'intermediate' },
          { term: 'fixed cost', pronunciation: '/fɪkst kɒst/', translation: 'costo fijo', example: 'Fixed costs like rent remain constant regardless of production volume.', difficulty: 'beginner' },
          { term: 'variable cost', pronunciation: '/ˈvɛriəbl kɒst/', translation: 'costo variable', example: 'Variable costs increase proportionally with production output.', difficulty: 'beginner' },
          { term: 'overhead', pronunciation: '/ˈoʊvərhɛd/', translation: 'gastos generales', example: 'Reducing overhead expenses improved our bottom line significantly.', difficulty: 'intermediate' },
          { term: 'amortization', pronunciation: '/əˌmɔːrtɪˈzeɪʃən/', translation: 'amortización', example: 'Loan amortization spreads payments over the life of the debt.', difficulty: 'intermediate' },
          { term: 'financial leverage', pronunciation: '/faɪˈnænʃəl ˈliːvərɪdʒ/', translation: 'apalancamiento financiero', example: 'Financial leverage amplifies returns but also increases risk.', difficulty: 'advanced' },
          { term: 'credit rating', pronunciation: '/ˈkrɛdɪt ˈreɪtɪŋ/', translation: 'calificación crediticia', example: 'Our improved credit rating reduced borrowing costs significantly.', difficulty: 'intermediate' },
          { term: 'accounts payable turnover', pronunciation: '/əˈkaʊnts ˈpeɪəbl ˈtɜːrnoʊvər/', translation: 'rotación de cuentas por pagar', example: 'High accounts payable turnover indicates efficient payment management.', difficulty: 'advanced' },
          { term: 'accounts receivable turnover', pronunciation: '/əˈkaʊnts rɪˈsiːvəbl ˈtɜːrnoʊvər/', translation: 'rotación de cuentas por cobrar', example: 'Improving accounts receivable turnover accelerates cash collection.', difficulty: 'advanced' },
          { term: 'inventory turnover', pronunciation: '/ˈɪnvəntɔːri ˈtɜːrnoʊvər/', translation: 'rotación de inventario', example: 'Higher inventory turnover reduces storage costs and obsolescence risk.', difficulty: 'intermediate' },
          { term: 'earnings before interest and taxes', pronunciation: '/ˈɜːrnɪŋz bɪˈfɔːr ˈɪntrəst ænd ˈtæksɪz/', translation: 'ganancias antes de intereses e impuestos', example: 'Earnings before interest and taxes increased by 18% year-over-year.', difficulty: 'advanced' },
          { term: 'financial controller', pronunciation: '/faɪˈnænʃəl kənˈtroʊlər/', translation: 'contralor financiero', example: 'The financial controller oversees all accounting operations and reporting.', difficulty: 'intermediate' },
          { term: 'cost accounting', pronunciation: '/kɒst əˈkaʊntɪŋ/', translation: 'contabilidad de costos', example: 'Cost accounting helps us understand profitability by product line.', difficulty: 'intermediate' },
          { term: 'financial reporting', pronunciation: '/faɪˈnænʃəl rɪˈpɔːrtɪŋ/', translation: 'reporte financiero', example: 'Accurate financial reporting is essential for investor confidence.', difficulty: 'intermediate' },
          { term: 'variance analysis', pronunciation: '/ˈvɛriəns əˈnæləsɪs/', translation: 'análisis de varianza', example: 'Variance analysis compares actual results to budgeted expectations.', difficulty: 'advanced' },
          { term: 'internal controls', pronunciation: '/ɪnˈtɜːrnl kənˈtroʊlz/', translation: 'controles internos', example: 'Strong internal controls prevent fraud and ensure accurate reporting.', difficulty: 'intermediate' },
          { term: 'financial compliance', pronunciation: '/faɪˈnænʃəl kəmˈplaɪəns/', translation: 'cumplimiento financiero', example: 'Financial compliance with regulations is monitored by our audit committee.', difficulty: 'intermediate' },
          { term: 'accounts payable aging', pronunciation: '/əˈkaʊnts ˈpeɪəbl ˈeɪdʒɪŋ/', translation: 'antigüedad de cuentas por pagar', example: 'The accounts payable aging report shows outstanding vendor balances by date.', difficulty: 'intermediate' },
          { term: 'accounts receivable aging', pronunciation: '/əˈkaʊnts rɪˈsiːvəbl ˈeɪdʒɪŋ/', translation: 'antigüedad de cuentas por cobrar', example: 'Accounts receivable aging helps identify collection problems early.', difficulty: 'intermediate' },
          { term: 'financial modeling', pronunciation: '/faɪˈnænʃəl ˈmɒdlɪŋ/', translation: 'modelado financiero', example: 'Financial modeling projects future performance under various scenarios.', difficulty: 'advanced' },
          { term: 'budget variance', pronunciation: '/ˈbʌdʒɪt ˈvɛriəns/', translation: 'variación presupuestaria', example: 'Budget variance analysis explains differences between planned and actual spending.', difficulty: 'intermediate' },
          { term: 'financial risk', pronunciation: '/faɪˈnænʃəl rɪsk/', translation: 'riesgo financiero', example: 'We use hedging strategies to mitigate financial risk from currency fluctuations.', difficulty: 'intermediate' },
          { term: 'cash management', pronunciation: '/kæʃ ˈmænɪdʒmənt/', translation: 'gestión de efectivo', example: 'Effective cash management ensures liquidity while maximizing returns.', difficulty: 'intermediate' },
          { term: 'financial audit', pronunciation: '/faɪˈnænʃəl ˈɔːdɪt/', translation: 'auditoría financiera', example: 'The annual financial audit verified the accuracy of our statements.', difficulty: 'intermediate' },
          { term: 'accounting principles', pronunciation: '/əˈkaʊntɪŋ ˈprɪnsəplz/', translation: 'principios contables', example: 'We follow generally accepted accounting principles in all financial reporting.', difficulty: 'intermediate' },
          { term: 'financial performance', pronunciation: '/faɪˈnænʃəl pərˈfɔːrməns/', translation: 'desempeño financiero', example: 'Strong financial performance attracted new investors to the company.', difficulty: 'intermediate' },
          { term: 'cost-benefit analysis', pronunciation: '/kɒst ˈbɛnɪfɪt əˈnæləsɪs/', translation: 'análisis costo-beneficio', example: 'Cost-benefit analysis justified the investment in new technology.', difficulty: 'intermediate' },
          { term: 'financial sustainability', pronunciation: '/faɪˈnænʃəl səˌsteɪnəˈbɪləti/', translation: 'sostenibilidad financiera', example: 'Financial sustainability requires balancing growth with profitability.', difficulty: 'advanced' },
          { term: 'accounting cycle', pronunciation: '/əˈkaʊntɪŋ ˈsaɪkl/', translation: 'ciclo contable', example: 'The accounting cycle includes recording, classifying, and summarizing transactions.', difficulty: 'intermediate' },
          { term: 'financial transparency', pronunciation: '/faɪˈnænʃəl trænsˈpærənsi/', translation: 'transparencia financiera', example: 'Financial transparency builds trust with investors and stakeholders.', difficulty: 'intermediate' },
          { term: 'fiscal year', pronunciation: '/ˈfɪskəl jɪr/', translation: 'año fiscal', example: 'Our fiscal year runs from July 1st to June 30th.', difficulty: 'beginner' },
          { term: 'Depreciation', pronunciation: '/dɪˌpriʃiˈeɪʃən/', translation: 'Depreciación', example: 'We calculate depreciation on our equipment using the straight-line method over a five-year period.', difficulty: 'advanced' },
          { term: 'Accounts payable', pronunciation: '/əˈkaʊnts ˈpeɪəbəl/', translation: 'Cuentas por pagar', example: 'Our accounts payable department processes vendor invoices within 30 days to maintain good supplier relationships.', difficulty: 'intermediate' }
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
          { term: 'Organizational development', pronunciation: '/ˌɔːrɡənəˈzeɪʃənl dɪˈveləpmənt/', translation: 'Desarrollo organizacional', example: 'Organizational development drives transformation', difficulty: 'advanced' },
          { term: 'talent acquisition', pronunciation: '/ˈtælənt ˌækwɪˈzɪʃən/', translation: 'adquisición de talento', example: 'Our talent acquisition strategy focuses on attracting top performers in the industry.', difficulty: 'intermediate' },
          { term: 'employee engagement', pronunciation: '/ɪmˈplɔɪiː ɪnˈɡeɪdʒmənt/', translation: 'compromiso de empleados', example: 'High employee engagement correlates with better productivity and retention.', difficulty: 'intermediate' },
          { term: 'performance review', pronunciation: '/pərˈfɔːrməns rɪˈvjuː/', translation: 'evaluación de desempeño', example: 'Annual performance reviews provide feedback and set goals for the coming year.', difficulty: 'intermediate' },
          { term: 'onboarding', pronunciation: '/ˈɒnbɔːrdɪŋ/', translation: 'incorporación', example: 'Effective onboarding helps new employees integrate quickly into the company culture.', difficulty: 'intermediate' },
          { term: 'compensation package', pronunciation: '/ˌkɒmpənˈseɪʃən ˈpækɪdʒ/', translation: 'paquete de compensación', example: 'Our competitive compensation package includes salary, benefits, and stock options.', difficulty: 'intermediate' },
          { term: 'employee retention', pronunciation: '/ɪmˈplɔɪiː rɪˈtɛnʃən/', translation: 'retención de empleados', example: 'Employee retention improved after implementing flexible work arrangements.', difficulty: 'intermediate' },
          { term: 'workforce planning', pronunciation: '/ˈwɜːrkfɔːrs ˈplænɪŋ/', translation: 'planificación de la fuerza laboral', example: 'Workforce planning ensures we have the right talent to meet future needs.', difficulty: 'intermediate' },
          { term: 'succession planning', pronunciation: '/səkˈsɛʃən ˈplænɪŋ/', translation: 'planificación de sucesión', example: 'Succession planning identifies and develops future leaders within the organization.', difficulty: 'advanced' },
          { term: 'employee benefits', pronunciation: '/ɪmˈplɔɪiː ˈbɛnɪfɪts/', translation: 'beneficios para empleados', example: 'Employee benefits include health insurance, retirement plans, and paid time off.', difficulty: 'beginner' },
          { term: 'human capital', pronunciation: '/ˈhjuːmən ˈkæpɪtl/', translation: 'capital humano', example: 'Investing in human capital through training yields long-term competitive advantages.', difficulty: 'intermediate' },
          { term: 'organizational culture', pronunciation: '/ˌɔːrɡənaɪˈzeɪʃənl ˈkʌltʃər/', translation: 'cultura organizacional', example: 'Our organizational culture emphasizes innovation, collaboration, and integrity.', difficulty: 'intermediate' },
          { term: 'talent management', pronunciation: '/ˈtælənt ˈmænɪdʒmənt/', translation: 'gestión del talento', example: 'Talent management programs develop high-potential employees for leadership roles.', difficulty: 'intermediate' },
          { term: 'job description', pronunciation: '/dʒɒb dɪˈskrɪpʃən/', translation: 'descripción de puesto', example: 'Clear job descriptions help candidates understand role expectations and requirements.', difficulty: 'beginner' },
          { term: 'recruitment', pronunciation: '/rɪˈkruːtmənt/', translation: 'reclutamiento', example: 'Our recruitment process includes screening, interviews, and reference checks.', difficulty: 'beginner' },
          { term: 'employee turnover', pronunciation: '/ɪmˈplɔɪiː ˈtɜːrnoʊvər/', translation: 'rotación de empleados', example: 'High employee turnover costs the company in recruitment and training expenses.', difficulty: 'intermediate' },
          { term: 'performance management', pronunciation: '/pərˈfɔːrməns ˈmænɪdʒmənt/', translation: 'gestión del desempeño', example: 'Performance management systems align individual goals with organizational objectives.', difficulty: 'intermediate' },
          { term: 'workplace diversity', pronunciation: '/ˈwɜːrkpleɪs daɪˈvɜːrsəti/', translation: 'diversidad en el lugar de trabajo', example: 'Workplace diversity brings different perspectives that drive innovation.', difficulty: 'intermediate' },
          { term: 'employee satisfaction', pronunciation: '/ɪmˈplɔɪiː ˌsætɪsˈfækʃən/', translation: 'satisfacción de empleados', example: 'Employee satisfaction surveys help us identify areas for workplace improvement.', difficulty: 'intermediate' },
          { term: 'training and development', pronunciation: '/ˈtreɪnɪŋ ænd dɪˈvɛləpmənt/', translation: 'capacitación y desarrollo', example: 'Training and development programs enhance employee skills and career growth.', difficulty: 'intermediate' },
          { term: 'human resources management', pronunciation: '/ˈhjuːmən rɪˈsɔːrsɪz ˈmænɪdʒmənt/', translation: 'gestión de recursos humanos', example: 'Human resources management encompasses recruitment, development, and employee relations.', difficulty: 'intermediate' },
          { term: 'work-life balance', pronunciation: '/wɜːrk laɪf ˈbæləns/', translation: 'equilibrio trabajo-vida', example: 'Promoting work-life balance reduces burnout and improves employee wellbeing.', difficulty: 'beginner' },
          { term: 'employee handbook', pronunciation: '/ɪmˈplɔɪiː ˈhændbʊk/', translation: 'manual del empleado', example: 'The employee handbook outlines company policies, procedures, and expectations.', difficulty: 'beginner' },
          { term: 'exit interview', pronunciation: '/ˈɛɡzɪt ˈɪntərvjuː/', translation: 'entrevista de salida', example: 'Exit interviews provide valuable feedback about why employees leave the company.', difficulty: 'intermediate' },
          { term: 'job posting', pronunciation: '/dʒɒb ˈpoʊstɪŋ/', translation: 'publicación de empleo', example: 'The job posting attracted over 200 qualified applicants within two weeks.', difficulty: 'beginner' },
          { term: 'background check', pronunciation: '/ˈbækɡraʊnd tʃɛk/', translation: 'verificación de antecedentes', example: 'Background checks are conducted on all final candidates before extending offers.', difficulty: 'intermediate' },
          { term: 'employee relations', pronunciation: '/ɪmˈplɔɪiː rɪˈleɪʃənz/', translation: 'relaciones laborales', example: 'Strong employee relations foster a positive and productive work environment.', difficulty: 'intermediate' },
          { term: 'payroll', pronunciation: '/ˈpeɪroʊl/', translation: 'nómina', example: 'Payroll processing ensures employees are paid accurately and on time.', difficulty: 'beginner' },
          { term: 'performance appraisal', pronunciation: '/pərˈfɔːrməns əˈpreɪzəl/', translation: 'evaluación de desempeño', example: 'Performance appraisals identify strengths and areas for improvement.', difficulty: 'intermediate' },
          { term: 'talent pipeline', pronunciation: '/ˈtælənt ˈpaɪplaɪn/', translation: 'cartera de talento', example: 'Building a talent pipeline ensures we have qualified candidates for future openings.', difficulty: 'intermediate' },
          { term: 'employee wellness', pronunciation: '/ɪmˈplɔɪiː ˈwɛlnəs/', translation: 'bienestar de empleados', example: 'Employee wellness programs promote physical and mental health in the workplace.', difficulty: 'intermediate' },
          { term: 'competency framework', pronunciation: '/ˈkɒmpɪtənsi ˈfreɪmwɜːrk/', translation: 'marco de competencias', example: 'The competency framework defines skills and behaviors required for each role.', difficulty: 'advanced' },
          { term: 'employee recognition', pronunciation: '/ɪmˈplɔɪiː ˌrɛkəɡˈnɪʃən/', translation: 'reconocimiento de empleados', example: 'Employee recognition programs celebrate achievements and boost morale.', difficulty: 'intermediate' },
          { term: 'labor relations', pronunciation: '/ˈleɪbər rɪˈleɪʃənz/', translation: 'relaciones laborales', example: 'Labor relations involve negotiations between management and employee representatives.', difficulty: 'intermediate' },
          { term: 'career development', pronunciation: '/kəˈrɪr dɪˈvɛləpmənt/', translation: 'desarrollo profesional', example: 'Career development opportunities help employees advance within the organization.', difficulty: 'intermediate' },
          { term: 'employee empowerment', pronunciation: '/ɪmˈplɔɪiː ɪmˈpaʊərmənt/', translation: 'empoderamiento de empleados', example: 'Employee empowerment gives staff authority to make decisions and solve problems.', difficulty: 'intermediate' },
          { term: 'workplace safety', pronunciation: '/ˈwɜːrkpleɪs ˈseɪfti/', translation: 'seguridad en el lugar de trabajo', example: 'Workplace safety protocols protect employees from hazards and injuries.', difficulty: 'beginner' },
          { term: 'talent retention', pronunciation: '/ˈtælənt rɪˈtɛnʃən/', translation: 'retención de talento', example: 'Talent retention strategies include competitive pay, growth opportunities, and recognition.', difficulty: 'intermediate' },
          { term: 'organizational development', pronunciation: '/ˌɔːrɡənaɪˈzeɪʃənl dɪˈvɛləpmənt/', translation: 'desarrollo organizacional', example: 'Organizational development initiatives improve effectiveness and employee capabilities.', difficulty: 'advanced' },
          { term: 'employee morale', pronunciation: '/ɪmˈplɔɪiː məˈræl/', translation: 'moral de empleados', example: 'High employee morale leads to better productivity and lower turnover.', difficulty: 'intermediate' },
          { term: 'job analysis', pronunciation: '/dʒɒb əˈnæləsɪs/', translation: 'análisis de puesto', example: 'Job analysis identifies the tasks, responsibilities, and qualifications for each position.', difficulty: 'intermediate' },
          { term: 'employee advocacy', pronunciation: '/ɪmˈplɔɪiː ˈædvəkəsi/', translation: 'defensa del empleado', example: 'Employee advocacy programs encourage staff to promote the company brand.', difficulty: 'intermediate' },
          { term: 'workforce diversity', pronunciation: '/ˈwɜːrkfɔːrs daɪˈvɜːrsəti/', translation: 'diversidad de la fuerza laboral', example: 'Workforce diversity initiatives create an inclusive environment for all employees.', difficulty: 'intermediate' },
          { term: 'employee productivity', pronunciation: '/ɪmˈplɔɪiː ˌprɒdʌkˈtɪvəti/', translation: 'productividad de empleados', example: 'Employee productivity increased after implementing flexible work schedules.', difficulty: 'intermediate' },
          { term: 'talent development', pronunciation: '/ˈtælənt dɪˈvɛləpmənt/', translation: 'desarrollo de talento', example: 'Talent development programs prepare employees for future leadership roles.', difficulty: 'intermediate' },
          { term: 'employee orientation', pronunciation: '/ɪmˈplɔɪiː ˌɔːriənˈteɪʃən/', translation: 'orientación de empleados', example: 'Employee orientation introduces new hires to company culture and policies.', difficulty: 'beginner' },
          { term: 'performance incentive', pronunciation: '/pərˈfɔːrməns ɪnˈsɛntɪv/', translation: 'incentivo de desempeño', example: 'Performance incentives motivate employees to exceed their targets.', difficulty: 'intermediate' },
          { term: 'employee feedback', pronunciation: '/ɪmˈplɔɪiː ˈfiːdbæk/', translation: 'retroalimentación de empleados', example: 'Regular employee feedback helps managers address concerns and improve performance.', difficulty: 'beginner' },
          { term: 'workplace culture', pronunciation: '/ˈwɜːrkpleɪs ˈkʌltʃər/', translation: 'cultura laboral', example: 'A positive workplace culture attracts and retains top talent.', difficulty: 'intermediate' },
          { term: 'employee autonomy', pronunciation: '/ɪmˈplɔɪiː ɔːˈtɒnəmi/', translation: 'autonomía de empleados', example: 'Employee autonomy allows staff to make decisions within their areas of responsibility.', difficulty: 'intermediate' },
          { term: 'talent assessment', pronunciation: '/ˈtælənt əˈsɛsmənt/', translation: 'evaluación de talento', example: 'Talent assessment tools help identify candidates with the right skills and potential.', difficulty: 'intermediate' },
          { term: 'employee experience', pronunciation: '/ɪmˈplɔɪiː ɪkˈspɪriəns/', translation: 'experiencia del empleado', example: 'Improving employee experience from recruitment to retirement increases satisfaction.', difficulty: 'intermediate' },
          { term: 'workforce analytics', pronunciation: '/ˈwɜːrkfɔːrs ˌænəˈlɪtɪks/', translation: 'analítica de la fuerza laboral', example: 'Workforce analytics provide insights into hiring trends and employee performance.', difficulty: 'advanced' },
          { term: 'employee collaboration', pronunciation: '/ɪmˈplɔɪiː kəˌlæbəˈreɪʃən/', translation: 'colaboración de empleados', example: 'Employee collaboration tools facilitate teamwork across departments and locations.', difficulty: 'intermediate' },
          { term: 'talent strategy', pronunciation: '/ˈtælənt ˈstrætədʒi/', translation: 'estrategia de talento', example: 'Our talent strategy aligns workforce capabilities with business objectives.', difficulty: 'intermediate' },
          { term: 'employee commitment', pronunciation: '/ɪmˈplɔɪiː kəˈmɪtmənt/', translation: 'compromiso de empleados', example: 'Strong employee commitment results in higher quality work and customer service.', difficulty: 'intermediate' },
          { term: 'workplace flexibility', pronunciation: '/ˈwɜːrkpleɪs ˌflɛksəˈbɪləti/', translation: 'flexibilidad laboral', example: 'Workplace flexibility includes remote work options and flexible scheduling.', difficulty: 'intermediate' },
          { term: 'employee value proposition', pronunciation: '/ɪmˈplɔɪiː ˈvæljuː ˌprɒpəˈzɪʃən/', translation: 'propuesta de valor para empleados', example: 'Our employee value proposition emphasizes growth, innovation, and work-life balance.', difficulty: 'advanced' },
          { term: 'talent mobility', pronunciation: '/ˈtælənt moʊˈbɪləti/', translation: 'movilidad de talento', example: 'Talent mobility programs enable employees to move between roles and locations.', difficulty: 'advanced' },
          { term: 'employee lifecycle', pronunciation: '/ɪmˈplɔɪiː ˈlaɪfsaɪkl/', translation: 'ciclo de vida del empleado', example: 'Managing the employee lifecycle from hiring to retirement improves retention.', difficulty: 'advanced' },
          { term: 'workforce transformation', pronunciation: '/ˈwɜːrkfɔːrs ˌtrænsfərˈmeɪʃən/', translation: 'transformación de la fuerza laboral', example: 'Workforce transformation initiatives prepare employees for digital workplace changes.', difficulty: 'advanced' },
          { term: 'employee branding', pronunciation: '/ɪmˈplɔɪiː ˈbrændɪŋ/', translation: 'marca empleadora', example: 'Strong employee branding attracts candidates who align with company values.', difficulty: 'intermediate' },
          { term: 'talent ecosystem', pronunciation: '/ˈtælənt ˈiːkoʊˌsɪstəm/', translation: 'ecosistema de talento', example: 'Our talent ecosystem includes employees, contractors, and strategic partners.', difficulty: 'advanced' },
          { term: 'employee resilience', pronunciation: '/ɪmˈplɔɪiː rɪˈzɪliəns/', translation: 'resiliencia de empleados', example: 'Building employee resilience helps staff adapt to change and overcome challenges.', difficulty: 'intermediate' },
          { term: 'workforce agility', pronunciation: '/ˈwɜːrkfɔːrs əˈdʒɪləti/', translation: 'agilidad de la fuerza laboral', example: 'Workforce agility enables quick adaptation to market changes and opportunities.', difficulty: 'advanced' },
          { term: 'employee innovation', pronunciation: '/ɪmˈplɔɪiː ˌɪnəˈveɪʃən/', translation: 'innovación de empleados', example: 'Encouraging employee innovation leads to process improvements and new ideas.', difficulty: 'intermediate' },
          { term: 'talent optimization', pronunciation: '/ˈtælənt ˌɒptɪmaɪˈzeɪʃən/', translation: 'optimización de talento', example: 'Talent optimization ensures the right people are in the right roles.', difficulty: 'advanced' },
          { term: 'employee sustainability', pronunciation: '/ɪmˈplɔɪiː səˌsteɪnəˈbɪləti/', translation: 'sostenibilidad de empleados', example: 'Employee sustainability programs focus on long-term wellbeing and career growth.', difficulty: 'advanced' },
          { term: 'Employee retention', pronunciation: '/ɛmˈplɔɪi rɪˈtɛnʃən/', translation: 'Retención de empleados', example: 'Our employee retention rate improved to 92% after implementing flexible work arrangements and professional development programs.', difficulty: 'intermediate' },
          { term: 'Performance appraisal', pronunciation: '/pərˈfɔrməns əˈpreɪzəl/', translation: 'Evaluación de desempeño', example: 'Annual performance appraisals help us identify high performers and areas where employees need additional support.', difficulty: 'intermediate' },
          { term: 'Succession planning', pronunciation: '/səkˈsɛʃən ˈplænɪŋ/', translation: 'Planificación de sucesión', example: 'Effective succession planning ensures we have qualified candidates ready to fill key leadership positions.', difficulty: 'advanced' }
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
          { term: 'Customer success manager', pronunciation: '/ˈkʌstəmər səkˈses ˈmænɪdʒər/', translation: 'Gerente de éxito del cliente', example: 'The customer success manager ensures adoption', difficulty: 'intermediate' },
          { term: 'customer service', pronunciation: '/ˈkʌstəmər ˈsɜːrvɪs/', translation: 'servicio al cliente', example: 'Excellent customer service is the foundation of our business success.', difficulty: 'beginner' },
          { term: 'customer satisfaction', pronunciation: '/ˈkʌstəmər ˌsætɪsˈfækʃən/', translation: 'satisfacción del cliente', example: 'Customer satisfaction scores increased by 20% after implementing new support tools.', difficulty: 'intermediate' },
          { term: 'customer experience', pronunciation: '/ˈkʌstəmər ɪkˈspɪriəns/', translation: 'experiencia del cliente', example: 'We focus on creating a seamless customer experience across all touchpoints.', difficulty: 'intermediate' },
          { term: 'customer support', pronunciation: '/ˈkʌstəmər səˈpɔːrt/', translation: 'soporte al cliente', example: 'Our customer support team is available 24/7 to assist with any issues.', difficulty: 'beginner' },
          { term: 'customer loyalty', pronunciation: '/ˈkʌstəmər ˈlɔɪəlti/', translation: 'lealtad del cliente', example: 'Building customer loyalty requires consistent quality and exceptional service.', difficulty: 'intermediate' },
          { term: 'complaint resolution', pronunciation: '/kəmˈpleɪnt ˌrɛzəˈluːʃən/', translation: 'resolución de quejas', example: 'Quick complaint resolution turns dissatisfied customers into loyal advocates.', difficulty: 'intermediate' },
          { term: 'customer feedback', pronunciation: '/ˈkʌstəmər ˈfiːdbæk/', translation: 'retroalimentación del cliente', example: 'Customer feedback helps us identify areas for improvement in our service.', difficulty: 'beginner' },
          { term: 'service level agreement', pronunciation: '/ˈsɜːrvɪs ˈlɛvl əˈɡriːmənt/', translation: 'acuerdo de nivel de servicio', example: 'Our service level agreement guarantees response times within two hours.', difficulty: 'advanced' },
          { term: 'customer retention', pronunciation: '/ˈkʌstəmər rɪˈtɛnʃən/', translation: 'retención de clientes', example: 'Customer retention strategies focus on building long-term relationships.', difficulty: 'intermediate' },
          { term: 'help desk', pronunciation: '/hɛlp dɛsk/', translation: 'mesa de ayuda', example: 'The help desk handles technical support requests from customers and employees.', difficulty: 'beginner' },
          { term: 'customer inquiry', pronunciation: '/ˈkʌstəmər ɪnˈkwaɪəri/', translation: 'consulta del cliente', example: 'We respond to every customer inquiry within 24 hours.', difficulty: 'beginner' },
          { term: 'customer relationship management', pronunciation: '/ˈkʌstəmər rɪˈleɪʃənʃɪp ˈmænɪdʒmənt/', translation: 'gestión de relaciones con clientes', example: 'Customer relationship management software tracks all interactions with clients.', difficulty: 'advanced' },
          { term: 'first contact resolution', pronunciation: '/fɜːrst ˈkɒntækt ˌrɛzəˈluːʃən/', translation: 'resolución en el primer contacto', example: 'Our first contact resolution rate is 85%, reducing the need for follow-ups.', difficulty: 'advanced' },
          { term: 'customer engagement', pronunciation: '/ˈkʌstəmər ɪnˈɡeɪdʒmənt/', translation: 'compromiso del cliente', example: 'High customer engagement leads to increased sales and brand loyalty.', difficulty: 'intermediate' },
          { term: 'response time', pronunciation: '/rɪˈspɒns taɪm/', translation: 'tiempo de respuesta', example: 'Reducing response time is critical for improving customer satisfaction.', difficulty: 'intermediate' },
          { term: 'customer care', pronunciation: '/ˈkʌstəmər kɛr/', translation: 'atención al cliente', example: 'Our customer care philosophy emphasizes empathy and problem-solving.', difficulty: 'beginner' },
          { term: 'service quality', pronunciation: '/ˈsɜːrvɪs ˈkwɒlɪti/', translation: 'calidad de servicio', example: 'Maintaining high service quality requires ongoing training and monitoring.', difficulty: 'intermediate' },
          { term: 'customer touchpoint', pronunciation: '/ˈkʌstəmər ˈtʌtʃpɔɪnt/', translation: 'punto de contacto con el cliente', example: 'We optimize every customer touchpoint to create a positive experience.', difficulty: 'intermediate' },
          { term: 'escalation process', pronunciation: '/ˌɛskəˈleɪʃən ˈprɒsɛs/', translation: 'proceso de escalamiento', example: 'The escalation process ensures complex issues reach senior support staff quickly.', difficulty: 'intermediate' },
          { term: 'customer advocate', pronunciation: '/ˈkʌstəmər ˈædvəkət/', translation: 'defensor del cliente', example: 'Customer advocates represent client interests within the organization.', difficulty: 'intermediate' },
          { term: 'service recovery', pronunciation: '/ˈsɜːrvɪs rɪˈkʌvəri/', translation: 'recuperación de servicio', example: 'Effective service recovery can turn a negative experience into a positive one.', difficulty: 'intermediate' },
          { term: 'customer journey', pronunciation: '/ˈkʌstəmər ˈdʒɜːrni/', translation: 'recorrido del cliente', example: 'Mapping the customer journey helps identify pain points and opportunities.', difficulty: 'intermediate' },
          { term: 'call center', pronunciation: '/kɔːl ˈsɛntər/', translation: 'centro de llamadas', example: 'Our call center handles thousands of customer inquiries daily.', difficulty: 'beginner' },
          { term: 'customer success', pronunciation: '/ˈkʌstəmər səkˈsɛs/', translation: 'éxito del cliente', example: 'The customer success team ensures clients achieve their desired outcomes.', difficulty: 'intermediate' },
          { term: 'service excellence', pronunciation: '/ˈsɜːrvɪs ˈɛksələns/', translation: 'excelencia en el servicio', example: 'Service excellence is achieved through continuous improvement and training.', difficulty: 'intermediate' },
          { term: 'customer pain point', pronunciation: '/ˈkʌstəmər peɪn pɔɪnt/', translation: 'punto de dolor del cliente', example: 'Identifying customer pain points helps us develop better solutions.', difficulty: 'intermediate' },
          { term: 'support ticket', pronunciation: '/səˈpɔːrt ˈtɪkɪt/', translation: 'ticket de soporte', example: 'Each support ticket is tracked until the issue is fully resolved.', difficulty: 'beginner' },
          { term: 'customer outreach', pronunciation: '/ˈkʌstəmər ˈaʊtriːtʃ/', translation: 'alcance al cliente', example: 'Proactive customer outreach prevents issues before they escalate.', difficulty: 'intermediate' },
          { term: 'service delivery', pronunciation: '/ˈsɜːrvɪs dɪˈlɪvəri/', translation: 'entrega de servicio', example: 'Consistent service delivery builds trust and customer confidence.', difficulty: 'intermediate' },
          { term: 'customer communication', pronunciation: '/ˈkʌstəmər kəˌmjuːnɪˈkeɪʃən/', translation: 'comunicación con el cliente', example: 'Clear customer communication prevents misunderstandings and frustration.', difficulty: 'beginner' },
          { term: 'service standard', pronunciation: '/ˈsɜːrvɪs ˈstændərd/', translation: 'estándar de servicio', example: 'All team members must meet our service standards for quality and responsiveness.', difficulty: 'intermediate' },
          { term: 'customer expectation', pronunciation: '/ˈkʌstəmər ˌɛkspɛkˈteɪʃən/', translation: 'expectativa del cliente', example: 'Understanding customer expectations helps us deliver appropriate solutions.', difficulty: 'intermediate' },
          { term: 'service channel', pronunciation: '/ˈsɜːrvɪs ˈtʃænl/', translation: 'canal de servicio', example: 'We offer multiple service channels including phone, email, and live chat.', difficulty: 'intermediate' },
          { term: 'customer interaction', pronunciation: '/ˈkʌstəmər ˌɪntərˈækʃən/', translation: 'interacción con el cliente', example: 'Every customer interaction is an opportunity to build loyalty.', difficulty: 'beginner' },
          { term: 'service improvement', pronunciation: '/ˈsɜːrvɪs ɪmˈpruːvmənt/', translation: 'mejora del servicio', example: 'Continuous service improvement is driven by customer feedback and data analysis.', difficulty: 'intermediate' },
          { term: 'customer needs assessment', pronunciation: '/ˈkʌstəmər niːdz əˈsɛsmənt/', translation: 'evaluación de necesidades del cliente', example: 'Customer needs assessment helps us tailor solutions to specific requirements.', difficulty: 'intermediate' },
          { term: 'service response', pronunciation: '/ˈsɜːrvɪs rɪˈspɒns/', translation: 'respuesta de servicio', example: 'Fast service response times are critical for customer satisfaction.', difficulty: 'beginner' },
          { term: 'customer appreciation', pronunciation: '/ˈkʌstəmər əˌpriːʃiˈeɪʃən/', translation: 'apreciación del cliente', example: 'Customer appreciation events strengthen relationships and show gratitude.', difficulty: 'intermediate' },
          { term: 'service metrics', pronunciation: '/ˈsɜːrvɪs ˈmɛtrɪks/', translation: 'métricas de servicio', example: 'We track service metrics including response time, resolution rate, and satisfaction.', difficulty: 'intermediate' },
          { term: 'customer empathy', pronunciation: '/ˈkʌstəmər ˈɛmpəθi/', translation: 'empatía con el cliente', example: 'Customer empathy is essential for understanding and addressing concerns effectively.', difficulty: 'intermediate' },
          { term: 'service automation', pronunciation: '/ˈsɜːrvɪs ˌɔːtəˈmeɪʃən/', translation: 'automatización de servicio', example: 'Service automation handles routine inquiries, freeing agents for complex issues.', difficulty: 'advanced' },
          { term: 'customer priority', pronunciation: '/ˈkʌstəmər praɪˈɒrəti/', translation: 'prioridad del cliente', example: 'Understanding customer priorities helps us allocate resources effectively.', difficulty: 'intermediate' },
          { term: 'service personalization', pronunciation: '/ˈsɜːrvɪs ˌpɜːrsənəlaɪˈzeɪʃən/', translation: 'personalización del servicio', example: 'Service personalization creates unique experiences tailored to individual customers.', difficulty: 'advanced' },
          { term: 'customer trust', pronunciation: '/ˈkʌstəmər trʌst/', translation: 'confianza del cliente', example: 'Building customer trust requires consistency, transparency, and reliability.', difficulty: 'intermediate' },
          { term: 'service innovation', pronunciation: '/ˈsɜːrvɪs ˌɪnəˈveɪʃən/', translation: 'innovación en el servicio', example: 'Service innovation keeps us ahead of competitors and meets evolving needs.', difficulty: 'advanced' },
          { term: 'customer value', pronunciation: '/ˈkʌstəmər ˈvæljuː/', translation: 'valor del cliente', example: 'Maximizing customer value ensures long-term profitability and growth.', difficulty: 'intermediate' },
          { term: 'service consistency', pronunciation: '/ˈsɜːrvɪs kənˈsɪstənsi/', translation: 'consistencia del servicio', example: 'Service consistency across all channels builds customer confidence.', difficulty: 'intermediate' },
          { term: 'customer insight', pronunciation: '/ˈkʌstəmər ˈɪnsaɪt/', translation: 'perspectiva del cliente', example: 'Customer insights from data analysis inform our service strategy.', difficulty: 'intermediate' },
          { term: 'service efficiency', pronunciation: '/ˈsɜːrvɪs ɪˈfɪʃənsi/', translation: 'eficiencia del servicio', example: 'Improving service efficiency reduces costs while maintaining quality.', difficulty: 'intermediate' },
          { term: 'customer sentiment', pronunciation: '/ˈkʌstəmər ˈsɛntɪmənt/', translation: 'sentimiento del cliente', example: 'Monitoring customer sentiment helps us address issues before they escalate.', difficulty: 'intermediate' },
          { term: 'service accessibility', pronunciation: '/ˈsɜːrvɪs ækˌsɛsəˈbɪləti/', translation: 'accesibilidad del servicio', example: 'Service accessibility ensures all customers can reach support when needed.', difficulty: 'intermediate' },
          { term: 'customer education', pronunciation: '/ˈkʌstəmər ˌɛdʒʊˈkeɪʃən/', translation: 'educación del cliente', example: 'Customer education programs help users maximize product value.', difficulty: 'intermediate' },
          { term: 'service reliability', pronunciation: '/ˈsɜːrvɪs rɪˌlaɪəˈbɪləti/', translation: 'confiabilidad del servicio', example: 'Service reliability is measured by consistent performance and uptime.', difficulty: 'intermediate' },
          { term: 'customer advocacy', pronunciation: '/ˈkʌstəmər ˈædvəkəsi/', translation: 'defensa del cliente', example: 'Customer advocacy programs turn satisfied clients into brand promoters.', difficulty: 'intermediate' },
          { term: 'service transparency', pronunciation: '/ˈsɜːrvɪs trænsˈpærənsi/', translation: 'transparencia del servicio', example: 'Service transparency about processes and timelines builds customer trust.', difficulty: 'intermediate' },
          { term: 'customer empowerment', pronunciation: '/ˈkʌstəmər ɪmˈpaʊərmənt/', translation: 'empoderamiento del cliente', example: 'Customer empowerment through self-service tools reduces support volume.', difficulty: 'advanced' },
          { term: 'service agility', pronunciation: '/ˈsɜːrvɪs əˈdʒɪləti/', translation: 'agilidad del servicio', example: 'Service agility enables quick adaptation to changing customer needs.', difficulty: 'advanced' },
          { term: 'customer collaboration', pronunciation: '/ˈkʌstəmər kəˌlæbəˈreɪʃən/', translation: 'colaboración con el cliente', example: 'Customer collaboration in product development ensures solutions meet real needs.', difficulty: 'intermediate' },
          { term: 'service excellence culture', pronunciation: '/ˈsɜːrvɪs ˈɛksələns ˈkʌltʃər/', translation: 'cultura de excelencia en el servicio', example: 'A service excellence culture permeates every level of the organization.', difficulty: 'advanced' },
          { term: 'customer lifetime value', pronunciation: '/ˈkʌstəmər ˈlaɪftaɪm ˈvæljuː/', translation: 'valor del tiempo de vida del cliente', example: 'Maximizing customer lifetime value requires focus on retention and upselling.', difficulty: 'advanced' },
          { term: 'service transformation', pronunciation: '/ˈsɜːrvɪs ˌtrænsfərˈmeɪʃən/', translation: 'transformación del servicio', example: 'Service transformation initiatives modernize how we interact with customers.', difficulty: 'advanced' },
          { term: 'customer centricity', pronunciation: '/ˈkʌstəmər sɛnˈtrɪsəti/', translation: 'centricidad en el cliente', example: 'Customer centricity means every decision considers the customer perspective.', difficulty: 'advanced' },
          { term: 'service sustainability', pronunciation: '/ˈsɜːrvɪs səˌsteɪnəˈbɪləti/', translation: 'sostenibilidad del servicio', example: 'Service sustainability balances quality, efficiency, and long-term viability.', difficulty: 'advanced' },
          { term: 'customer intelligence', pronunciation: '/ˈkʌstəmər ɪnˈtɛlɪdʒəns/', translation: 'inteligencia del cliente', example: 'Customer intelligence from analytics drives strategic service improvements.', difficulty: 'advanced' },
          { term: 'service orchestration', pronunciation: '/ˈsɜːrvɪs ˌɔːrkɪˈstreɪʃən/', translation: 'orquestación del servicio', example: 'Service orchestration coordinates multiple touchpoints for seamless experiences.', difficulty: 'advanced' },
          { term: 'customer ecosystem', pronunciation: '/ˈkʌstəmər ˈiːkoʊˌsɪstəm/', translation: 'ecosistema del cliente', example: 'Understanding the customer ecosystem reveals opportunities for value creation.', difficulty: 'advanced' },
          { term: 'Customer satisfaction score', pronunciation: '/ˈkʌstəmər ˌsætɪsˈfækʃən skɔr/', translation: 'Puntuación de satisfacción del cliente', example: 'Our customer satisfaction score increased from 78% to 89% after implementing the new support ticketing system.', difficulty: 'intermediate' },
          { term: 'First call resolution', pronunciation: '/fɜrst kɔl ˌrɛzəˈluʃən/', translation: 'Resolución en la primera llamada', example: 'We aim for an 85% first call resolution rate to minimize customer effort and improve satisfaction.', difficulty: 'advanced' },
          { term: 'Service level agreement', pronunciation: '/ˈsɜrvɪs ˈlɛvəl əˈgrimənt/', translation: 'Acuerdo de nivel de servicio', example: 'Our service level agreement guarantees a response time of under two hours for all priority support tickets.', difficulty: 'advanced' },
          { term: 'Customer feedback', pronunciation: '/ˈkʌstəmər ˈfidˌbæk/', translation: 'Retroalimentación del cliente', example: 'We actively collect customer feedback through surveys and use it to improve our products and services.', difficulty: 'beginner' }
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
          { term: 'Delivery schedule', pronunciation: '/dɪˈlɪvəri ˈskedʒuːl/', translation: 'Programa de entrega', example: 'Check the delivery schedule for updates', difficulty: 'beginner' },
          { term: 'supply chain', pronunciation: '/səˈplaɪ tʃeɪn/', translation: 'cadena de suministro', example: 'Our supply chain spans multiple countries and involves dozens of suppliers.', difficulty: 'intermediate' },
          { term: 'inventory management', pronunciation: '/ˈɪnvəntɔːri ˈmænɪdʒmənt/', translation: 'gestión de inventario', example: 'Effective inventory management balances stock levels with demand forecasts.', difficulty: 'intermediate' },
          { term: 'warehouse', pronunciation: '/ˈwɛrhaʊs/', translation: 'almacén', example: 'The new warehouse increased our storage capacity by 50%.', difficulty: 'beginner' },
          { term: 'distribution center', pronunciation: '/ˌdɪstrɪˈbjuːʃən ˈsɛntər/', translation: 'centro de distribución', example: 'Our distribution center processes 10,000 orders daily.', difficulty: 'intermediate' },
          { term: 'freight forwarding', pronunciation: '/freɪt ˈfɔːrwərdɪŋ/', translation: 'transitario', example: 'Freight forwarding services coordinate international shipments across multiple carriers.', difficulty: 'advanced' },
          { term: 'last mile delivery', pronunciation: '/læst maɪl dɪˈlɪvəri/', translation: 'entrega de última milla', example: 'Last mile delivery is often the most expensive part of the shipping process.', difficulty: 'intermediate' },
          { term: 'procurement', pronunciation: '/prəˈkjʊrmənt/', translation: 'adquisición', example: 'Strategic procurement reduces costs while ensuring quality and reliability.', difficulty: 'intermediate' },
          { term: 'logistics', pronunciation: '/ləˈdʒɪstɪks/', translation: 'logística', example: 'Efficient logistics operations are critical for meeting customer delivery expectations.', difficulty: 'beginner' },
          { term: 'supply chain visibility', pronunciation: '/səˈplaɪ tʃeɪn ˌvɪzəˈbɪləti/', translation: 'visibilidad de la cadena de suministro', example: 'Supply chain visibility allows us to track shipments in real-time.', difficulty: 'advanced' },
          { term: 'order fulfillment', pronunciation: '/ˈɔːrdər fʊlˈfɪlmənt/', translation: 'cumplimiento de pedidos', example: 'Order fulfillment time decreased from 48 hours to 24 hours.', difficulty: 'intermediate' },
          { term: 'transportation management', pronunciation: '/ˌtrænspɔːrˈteɪʃən ˈmænɪdʒmənt/', translation: 'gestión de transporte', example: 'Transportation management systems optimize routes and reduce shipping costs.', difficulty: 'intermediate' },
          { term: 'vendor management', pronunciation: '/ˈvɛndər ˈmænɪdʒmənt/', translation: 'gestión de proveedores', example: 'Vendor management ensures suppliers meet quality and delivery standards.', difficulty: 'intermediate' },
          { term: 'cross-docking', pronunciation: '/krɒs ˈdɒkɪŋ/', translation: 'cross-docking', example: 'Cross-docking reduces storage time by transferring goods directly from inbound to outbound.', difficulty: 'advanced' },
          { term: 'lead time', pronunciation: '/liːd taɪm/', translation: 'tiempo de entrega', example: 'Reducing lead time improves customer satisfaction and competitive advantage.', difficulty: 'intermediate' },
          { term: 'stock keeping unit', pronunciation: '/stɒk ˈkiːpɪŋ ˈjuːnɪt/', translation: 'unidad de mantenimiento de existencias', example: 'Each stock keeping unit has a unique identifier for inventory tracking.', difficulty: 'intermediate' },
          { term: 'demand forecasting', pronunciation: '/dɪˈmænd ˈfɔːrkæstɪŋ/', translation: 'pronóstico de demanda', example: 'Accurate demand forecasting prevents stockouts and excess inventory.', difficulty: 'intermediate' },
          { term: 'reverse logistics', pronunciation: '/rɪˈvɜːrs ləˈdʒɪstɪks/', translation: 'logística inversa', example: 'Reverse logistics handles product returns and recycling efficiently.', difficulty: 'advanced' },
          { term: 'third-party logistics', pronunciation: '/θɜːrd ˈpɑːrti ləˈdʒɪstɪks/', translation: 'logística de terceros', example: 'Third-party logistics providers manage warehousing and distribution for us.', difficulty: 'advanced' },
          { term: 'just-in-time inventory', pronunciation: '/dʒʌst ɪn taɪm ˈɪnvəntɔːri/', translation: 'inventario justo a tiempo', example: 'Just-in-time inventory minimizes storage costs and reduces waste.', difficulty: 'intermediate' },
          { term: 'supply chain optimization', pronunciation: '/səˈplaɪ tʃeɪn ˌɒptɪmaɪˈzeɪʃən/', translation: 'optimización de la cadena de suministro', example: 'Supply chain optimization improved efficiency and reduced costs by 15%.', difficulty: 'advanced' },
          { term: 'shipping', pronunciation: '/ˈʃɪpɪŋ/', translation: 'envío', example: 'Free shipping on orders over $50 increased our conversion rate.', difficulty: 'beginner' },
          { term: 'packing slip', pronunciation: '/ˈpækɪŋ slɪp/', translation: 'albarán de entrega', example: 'The packing slip lists all items included in the shipment.', difficulty: 'beginner' },
          { term: 'bill of lading', pronunciation: '/bɪl əv ˈleɪdɪŋ/', translation: 'conocimiento de embarque', example: 'The bill of lading serves as a receipt and contract for freight transportation.', difficulty: 'advanced' },
          { term: 'customs clearance', pronunciation: '/ˈkʌstəmz ˈklɪrəns/', translation: 'despacho de aduanas', example: 'Customs clearance delays can impact delivery schedules significantly.', difficulty: 'intermediate' },
          { term: 'inbound logistics', pronunciation: '/ˈɪnbaʊnd ləˈdʒɪstɪks/', translation: 'logística de entrada', example: 'Inbound logistics manages the flow of materials from suppliers to our facilities.', difficulty: 'intermediate' },
          { term: 'outbound logistics', pronunciation: '/ˈaʊtbaʊnd ləˈdʒɪstɪks/', translation: 'logística de salida', example: 'Outbound logistics ensures products reach customers efficiently.', difficulty: 'intermediate' },
          { term: 'safety stock', pronunciation: '/ˈseɪfti stɒk/', translation: 'inventario de seguridad', example: 'Safety stock protects against unexpected demand spikes or supply disruptions.', difficulty: 'intermediate' },
          { term: 'reorder point', pronunciation: '/ˌriːˈɔːrdər pɔɪnt/', translation: 'punto de reorden', example: 'The reorder point triggers automatic purchase orders when inventory falls below threshold.', difficulty: 'intermediate' },
          { term: 'economic order quantity', pronunciation: '/ˌiːkəˈnɒmɪk ˈɔːrdər ˈkwɒntəti/', translation: 'cantidad económica de pedido', example: 'Economic order quantity calculations minimize total inventory costs.', difficulty: 'advanced' },
          { term: 'carrier', pronunciation: '/ˈkæriər/', translation: 'transportista', example: 'We work with multiple carriers to ensure competitive shipping rates.', difficulty: 'beginner' },
          { term: 'tracking number', pronunciation: '/ˈtrækɪŋ ˈnʌmbər/', translation: 'número de seguimiento', example: 'Customers receive a tracking number to monitor their shipment status.', difficulty: 'beginner' },
          { term: 'supply chain resilience', pronunciation: '/səˈplaɪ tʃeɪn rɪˈzɪliəns/', translation: 'resiliencia de la cadena de suministro', example: 'Supply chain resilience helps us recover quickly from disruptions.', difficulty: 'advanced' },
          { term: 'inventory turnover', pronunciation: '/ˈɪnvəntɔːri ˈtɜːrnoʊvər/', translation: 'rotación de inventario', example: 'High inventory turnover indicates efficient stock management.', difficulty: 'intermediate' },
          { term: 'warehouse management system', pronunciation: '/ˈwɛrhaʊs ˈmænɪdʒmənt ˈsɪstəm/', translation: 'sistema de gestión de almacenes', example: 'The warehouse management system tracks inventory location and movement.', difficulty: 'advanced' },
          { term: 'picking', pronunciation: '/ˈpɪkɪŋ/', translation: 'preparación de pedidos', example: 'Automated picking systems increased order processing speed by 40%.', difficulty: 'intermediate' },
          { term: 'packing', pronunciation: '/ˈpækɪŋ/', translation: 'empaque', example: 'Proper packing prevents damage during shipping and handling.', difficulty: 'beginner' },
          { term: 'loading dock', pronunciation: '/ˈloʊdɪŋ dɒk/', translation: 'muelle de carga', example: 'The loading dock operates 24/7 to accommodate delivery schedules.', difficulty: 'beginner' },
          { term: 'supply chain integration', pronunciation: '/səˈplaɪ tʃeɪn ˌɪntɪˈɡreɪʃən/', translation: 'integración de la cadena de suministro', example: 'Supply chain integration improves coordination between suppliers and customers.', difficulty: 'advanced' },
          { term: 'freight cost', pronunciation: '/freɪt kɒst/', translation: 'costo de flete', example: 'Rising freight costs are impacting our overall logistics budget.', difficulty: 'intermediate' },
          { term: 'delivery schedule', pronunciation: '/dɪˈlɪvəri ˈskɛdʒuːl/', translation: 'programa de entrega', example: 'The delivery schedule ensures products arrive when customers need them.', difficulty: 'beginner' },
          { term: 'supply chain analytics', pronunciation: '/səˈplaɪ tʃeɪn ˌænəˈlɪtɪks/', translation: 'analítica de la cadena de suministro', example: 'Supply chain analytics identify bottlenecks and optimization opportunities.', difficulty: 'advanced' },
          { term: 'route optimization', pronunciation: '/ruːt ˌɒptɪmaɪˈzeɪʃən/', translation: 'optimización de rutas', example: 'Route optimization software reduced fuel costs by 20%.', difficulty: 'intermediate' },
          { term: 'stockout', pronunciation: '/ˈstɒkaʊt/', translation: 'desabastecimiento', example: 'Stockouts result in lost sales and disappointed customers.', difficulty: 'intermediate' },
          { term: 'backorder', pronunciation: '/ˈbækɔːrdər/', translation: 'pedido pendiente', example: 'Items on backorder will ship as soon as inventory is replenished.', difficulty: 'intermediate' },
          { term: 'supply chain disruption', pronunciation: '/səˈplaɪ tʃeɪn dɪsˈrʌpʃən/', translation: 'interrupción de la cadena de suministro', example: 'Supply chain disruptions from natural disasters require contingency planning.', difficulty: 'intermediate' },
          { term: 'inventory accuracy', pronunciation: '/ˈɪnvəntɔːri ˈækjərəsi/', translation: 'precisión del inventario', example: 'High inventory accuracy reduces errors and improves customer satisfaction.', difficulty: 'intermediate' },
          { term: 'cold chain', pronunciation: '/koʊld tʃeɪn/', translation: 'cadena de frío', example: 'The cold chain maintains temperature control for perishable products.', difficulty: 'advanced' },
          { term: 'consolidation', pronunciation: '/kənˌsɒlɪˈdeɪʃən/', translation: 'consolidación', example: 'Freight consolidation combines multiple shipments to reduce costs.', difficulty: 'intermediate' },
          { term: 'supply chain partner', pronunciation: '/səˈplaɪ tʃeɪn ˈpɑːrtnər/', translation: 'socio de la cadena de suministro', example: 'Strong relationships with supply chain partners ensure reliability.', difficulty: 'intermediate' },
          { term: 'inventory valuation', pronunciation: '/ˈɪnvəntɔːri ˌvæljuˈeɪʃən/', translation: 'valoración de inventario', example: 'Inventory valuation methods impact financial reporting and taxes.', difficulty: 'advanced' },
          { term: 'supply chain strategy', pronunciation: '/səˈplaɪ tʃeɪn ˈstrætədʒi/', translation: 'estrategia de la cadena de suministro', example: 'Our supply chain strategy focuses on flexibility and cost efficiency.', difficulty: 'intermediate' },
          { term: 'material handling', pronunciation: '/məˈtɪriəl ˈhændlɪŋ/', translation: 'manejo de materiales', example: 'Automated material handling equipment improves warehouse efficiency.', difficulty: 'intermediate' },
          { term: 'supply chain network', pronunciation: '/səˈplaɪ tʃeɪn ˈnɛtwɜːrk/', translation: 'red de la cadena de suministro', example: 'Our supply chain network spans five continents and hundreds of locations.', difficulty: 'intermediate' },
          { term: 'inventory holding cost', pronunciation: '/ˈɪnvəntɔːri ˈhoʊldɪŋ kɒst/', translation: 'costo de mantenimiento de inventario', example: 'Inventory holding costs include storage, insurance, and obsolescence.', difficulty: 'advanced' },
          { term: 'supply chain collaboration', pronunciation: '/səˈplaɪ tʃeɪn kəˌlæbəˈreɪʃən/', translation: 'colaboración en la cadena de suministro', example: 'Supply chain collaboration improves forecasting and reduces costs.', difficulty: 'advanced' },
          { term: 'logistics service provider', pronunciation: '/ləˈdʒɪstɪks ˈsɜːrvɪs prəˈvaɪdər/', translation: 'proveedor de servicios logísticos', example: 'Our logistics service provider handles all warehousing and distribution.', difficulty: 'intermediate' },
          { term: 'supply chain sustainability', pronunciation: '/səˈplaɪ tʃeɪn səˌsteɪnəˈbɪləti/', translation: 'sostenibilidad de la cadena de suministro', example: 'Supply chain sustainability initiatives reduce environmental impact.', difficulty: 'advanced' },
          { term: 'inventory cycle count', pronunciation: '/ˈɪnvəntɔːri ˈsaɪkl kaʊnt/', translation: 'conteo cíclico de inventario', example: 'Regular inventory cycle counts maintain accuracy without full shutdowns.', difficulty: 'intermediate' },
          { term: 'supply chain risk', pronunciation: '/səˈplaɪ tʃeɪn rɪsk/', translation: 'riesgo de la cadena de suministro', example: 'Supply chain risk management identifies and mitigates potential disruptions.', difficulty: 'advanced' },
          { term: 'logistics automation', pronunciation: '/ləˈdʒɪstɪks ˌɔːtəˈmeɪʃən/', translation: 'automatización logística', example: 'Logistics automation reduces labor costs and improves accuracy.', difficulty: 'advanced' },
          { term: 'supply chain transparency', pronunciation: '/səˈplaɪ tʃeɪn trænsˈpærənsi/', translation: 'transparencia de la cadena de suministro', example: 'Supply chain transparency builds trust with customers and stakeholders.', difficulty: 'advanced' },
          { term: 'inventory optimization', pronunciation: '/ˈɪnvəntɔːri ˌɒptɪmaɪˈzeɪʃən/', translation: 'optimización de inventario', example: 'Inventory optimization balances service levels with carrying costs.', difficulty: 'advanced' },
          { term: 'supply chain agility', pronunciation: '/səˈplaɪ tʃeɪn əˈdʒɪləti/', translation: 'agilidad de la cadena de suministro', example: 'Supply chain agility enables quick response to market changes.', difficulty: 'advanced' },
          { term: 'logistics performance', pronunciation: '/ləˈdʒɪstɪks pərˈfɔːrməns/', translation: 'desempeño logístico', example: 'Logistics performance metrics track efficiency and customer satisfaction.', difficulty: 'intermediate' },
          { term: 'supply chain digitalization', pronunciation: '/səˈplaɪ tʃeɪn ˌdɪdʒɪtəlaɪˈzeɪʃən/', translation: 'digitalización de la cadena de suministro', example: 'Supply chain digitalization improves visibility and decision-making.', difficulty: 'advanced' },
          { term: 'inventory intelligence', pronunciation: '/ˈɪnvəntɔːri ɪnˈtɛlɪdʒəns/', translation: 'inteligencia de inventario', example: 'Inventory intelligence uses AI to predict demand and optimize stock levels.', difficulty: 'advanced' },
          { term: 'supply chain excellence', pronunciation: '/səˈplaɪ tʃeɪn ˈɛksələns/', translation: 'excelencia de la cadena de suministro', example: 'Achieving supply chain excellence requires continuous improvement and innovation.', difficulty: 'advanced' },
          { term: 'Lead time', pronunciation: '/lid taɪm/', translation: 'Tiempo de entrega', example: 'We reduced our lead time from six weeks to three weeks by optimizing our supplier relationships.', difficulty: 'intermediate' },
          { term: 'Just-in-time inventory', pronunciation: '/dʒʌst ɪn taɪm ˈɪnvənˌtɔri/', translation: 'Inventario justo a tiempo', example: 'Implementing just-in-time inventory management helped us reduce storage costs by 30% while maintaining product availability.', difficulty: 'advanced' },
          { term: 'Distribution center', pronunciation: '/ˌdɪstrəˈbjuʃən ˈsɛntər/', translation: 'Centro de distribución', example: 'Our new distribution center in Texas will enable faster delivery to customers in the southern United States.', difficulty: 'intermediate' }
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
          { term: 'Legal documentation', pronunciation: '/ˈliːɡl ˌdɑːkjumenˈteɪʃn/', translation: 'Documentación legal', example: 'File all legal documentation properly', difficulty: 'intermediate' },
          { term: 'compliance', pronunciation: '/kəmˈplaɪəns/', translation: 'cumplimiento', example: 'Compliance with industry regulations is mandatory for all operations.', difficulty: 'intermediate' },
          { term: 'contract', pronunciation: '/ˈkɒntrækt/', translation: 'contrato', example: 'The contract outlines the terms and conditions of our partnership.', difficulty: 'beginner' },
          { term: 'intellectual property', pronunciation: '/ˌɪntəˈlɛktʃuəl ˈprɒpərti/', translation: 'propiedad intelectual', example: 'Protecting intellectual property is crucial for maintaining competitive advantage.', difficulty: 'intermediate' },
          { term: 'non-disclosure agreement', pronunciation: '/nɒn dɪsˈkloʊʒər əˈɡriːmənt/', translation: 'acuerdo de confidencialidad', example: 'All vendors must sign a non-disclosure agreement before accessing sensitive information.', difficulty: 'intermediate' },
          { term: 'liability', pronunciation: '/ˌlaɪəˈbɪləti/', translation: 'responsabilidad legal', example: 'The company\'s liability is limited to the terms specified in the contract.', difficulty: 'intermediate' },
          { term: 'due diligence', pronunciation: '/djuː ˈdɪlɪdʒəns/', translation: 'debida diligencia', example: 'Due diligence revealed potential risks in the acquisition target.', difficulty: 'advanced' },
          { term: 'regulatory compliance', pronunciation: '/ˈrɛɡjələtɔːri kəmˈplaɪəns/', translation: 'cumplimiento regulatorio', example: 'Regulatory compliance requires ongoing monitoring of changing laws.', difficulty: 'intermediate' },
          { term: 'data protection', pronunciation: '/ˈdeɪtə prəˈtɛkʃən/', translation: 'protección de datos', example: 'Data protection regulations require secure handling of customer information.', difficulty: 'intermediate' },
          { term: 'litigation', pronunciation: '/ˌlɪtɪˈɡeɪʃən/', translation: 'litigio', example: 'The company is involved in litigation over patent infringement.', difficulty: 'advanced' },
          { term: 'corporate governance', pronunciation: '/ˈkɔːrpərət ˈɡʌvərnəns/', translation: 'gobierno corporativo', example: 'Strong corporate governance practices protect shareholder interests.', difficulty: 'advanced' },
          { term: 'legal counsel', pronunciation: '/ˈliːɡəl ˈkaʊnsl/', translation: 'asesor legal', example: 'Our legal counsel reviews all major contracts before signing.', difficulty: 'intermediate' },
          { term: 'terms and conditions', pronunciation: '/tɜːrmz ænd kənˈdɪʃənz/', translation: 'términos y condiciones', example: 'Please read the terms and conditions carefully before accepting.', difficulty: 'beginner' },
          { term: 'breach of contract', pronunciation: '/briːtʃ əv ˈkɒntrækt/', translation: 'incumplimiento de contrato', example: 'Breach of contract may result in legal action and financial penalties.', difficulty: 'intermediate' },
          { term: 'confidentiality', pronunciation: '/ˌkɒnfɪdɛnʃiˈæləti/', translation: 'confidencialidad', example: 'Maintaining confidentiality is essential when handling sensitive client data.', difficulty: 'intermediate' },
          { term: 'trademark', pronunciation: '/ˈtreɪdmɑːrk/', translation: 'marca registrada', example: 'Our trademark is registered in over 50 countries worldwide.', difficulty: 'intermediate' },
          { term: 'patent', pronunciation: '/ˈpætənt/', translation: 'patente', example: 'The patent protects our innovative technology for 20 years.', difficulty: 'intermediate' },
          { term: 'copyright', pronunciation: '/ˈkɒpiraɪt/', translation: 'derechos de autor', example: 'Copyright protection applies to all original content we create.', difficulty: 'intermediate' },
          { term: 'legal framework', pronunciation: '/ˈliːɡəl ˈfreɪmwɜːrk/', translation: 'marco legal', example: 'The legal framework governs how businesses operate in this jurisdiction.', difficulty: 'intermediate' },
          { term: 'arbitration', pronunciation: '/ˌɑːrbɪˈtreɪʃən/', translation: 'arbitraje', example: 'Disputes will be resolved through arbitration rather than court proceedings.', difficulty: 'advanced' },
          { term: 'indemnification', pronunciation: '/ɪnˌdɛmnɪfɪˈkeɪʃən/', translation: 'indemnización', example: 'The indemnification clause protects us from third-party claims.', difficulty: 'advanced' },
          { term: 'legal obligation', pronunciation: '/ˈliːɡəl ˌɒblɪˈɡeɪʃən/', translation: 'obligación legal', example: 'We have a legal obligation to report certain financial transactions.', difficulty: 'intermediate' },
          { term: 'compliance audit', pronunciation: '/kəmˈplaɪəns ˈɔːdɪt/', translation: 'auditoría de cumplimiento', example: 'The compliance audit verified adherence to all regulatory requirements.', difficulty: 'intermediate' },
          { term: 'legal risk', pronunciation: '/ˈliːɡəl rɪsk/', translation: 'riesgo legal', example: 'Legal risk assessment identifies potential exposure to lawsuits.', difficulty: 'intermediate' },
          { term: 'employment law', pronunciation: '/ɪmˈplɔɪmənt lɔː/', translation: 'derecho laboral', example: 'Employment law governs the relationship between employers and employees.', difficulty: 'intermediate' },
          { term: 'antitrust', pronunciation: '/ˌæntiˈtrʌst/', translation: 'antimonopolio', example: 'Antitrust regulations prevent monopolistic practices and promote competition.', difficulty: 'advanced' },
          { term: 'legal precedent', pronunciation: '/ˈliːɡəl ˈprɛsɪdənt/', translation: 'precedente legal', example: 'The court\'s decision established an important legal precedent.', difficulty: 'advanced' },
          { term: 'statute', pronunciation: '/ˈstætʃuːt/', translation: 'estatuto', example: 'The statute of limitations determines how long legal action can be taken.', difficulty: 'advanced' },
          { term: 'legal entity', pronunciation: '/ˈliːɡəl ˈɛntəti/', translation: 'entidad legal', example: 'Each subsidiary operates as a separate legal entity.', difficulty: 'intermediate' },
          { term: 'fiduciary duty', pronunciation: '/fɪˈdjuːʃiəri ˈdjuːti/', translation: 'deber fiduciario', example: 'Board members have a fiduciary duty to act in shareholders\' best interests.', difficulty: 'advanced' },
          { term: 'legal disclaimer', pronunciation: '/ˈliːɡəl dɪsˈkleɪmər/', translation: 'descargo de responsabilidad legal', example: 'The legal disclaimer limits our liability for information provided.', difficulty: 'intermediate' },
          { term: 'compliance officer', pronunciation: '/kəmˈplaɪəns ˈɒfɪsər/', translation: 'oficial de cumplimiento', example: 'The compliance officer ensures all operations meet regulatory standards.', difficulty: 'intermediate' },
          { term: 'legal jurisdiction', pronunciation: '/ˈliːɡəl ˌdʒʊrɪsˈdɪkʃən/', translation: 'jurisdicción legal', example: 'The contract specifies which legal jurisdiction governs disputes.', difficulty: 'advanced' },
          { term: 'regulatory body', pronunciation: '/ˈrɛɡjələtɔːri ˈbɒdi/', translation: 'organismo regulador', example: 'The regulatory body oversees industry practices and enforces standards.', difficulty: 'intermediate' },
          { term: 'legal documentation', pronunciation: '/ˈliːɡəl ˌdɒkjəmɛnˈteɪʃən/', translation: 'documentación legal', example: 'Proper legal documentation is essential for all business transactions.', difficulty: 'intermediate' },
          { term: 'compliance program', pronunciation: '/kəmˈplaɪəns ˈproʊɡræm/', translation: 'programa de cumplimiento', example: 'Our compliance program includes training, monitoring, and reporting.', difficulty: 'intermediate' },
          { term: 'legal liability', pronunciation: '/ˈliːɡəl ˌlaɪəˈbɪləti/', translation: 'responsabilidad legal', example: 'Insurance coverage protects against legal liability claims.', difficulty: 'intermediate' },
          { term: 'regulatory requirement', pronunciation: '/ˈrɛɡjələtɔːri rɪˈkwaɪrmənt/', translation: 'requisito regulatorio', example: 'Meeting regulatory requirements is mandatory for operating in this industry.', difficulty: 'intermediate' },
          { term: 'legal agreement', pronunciation: '/ˈliːɡəl əˈɡriːmənt/', translation: 'acuerdo legal', example: 'The legal agreement binds both parties to specific obligations.', difficulty: 'beginner' },
          { term: 'compliance monitoring', pronunciation: '/kəmˈplaɪəns ˈmɒnɪtərɪŋ/', translation: 'monitoreo de cumplimiento', example: 'Compliance monitoring systems detect potential violations automatically.', difficulty: 'intermediate' },
          { term: 'legal interpretation', pronunciation: '/ˈliːɡəl ɪnˌtɜːrprɪˈteɪʃən/', translation: 'interpretación legal', example: 'Legal interpretation of the regulation varies across jurisdictions.', difficulty: 'advanced' },
          { term: 'regulatory filing', pronunciation: '/ˈrɛɡjələtɔːri ˈfaɪlɪŋ/', translation: 'presentación regulatoria', example: 'Annual regulatory filings must be submitted by the deadline.', difficulty: 'intermediate' },
          { term: 'legal notice', pronunciation: '/ˈliːɡəl ˈnoʊtɪs/', translation: 'aviso legal', example: 'Legal notice must be provided 30 days before contract termination.', difficulty: 'intermediate' },
          { term: 'compliance training', pronunciation: '/kəmˈplaɪəns ˈtreɪnɪŋ/', translation: 'capacitación en cumplimiento', example: 'All employees must complete annual compliance training.', difficulty: 'intermediate' },
          { term: 'legal remedy', pronunciation: '/ˈliːɡəl ˈrɛmədi/', translation: 'recurso legal', example: 'The legal remedy for breach includes damages and specific performance.', difficulty: 'advanced' },
          { term: 'regulatory approval', pronunciation: '/ˈrɛɡjələtɔːri əˈpruːvəl/', translation: 'aprobación regulatoria', example: 'Regulatory approval is required before launching the new product.', difficulty: 'intermediate' },
          { term: 'legal standard', pronunciation: '/ˈliːɡəl ˈstændərd/', translation: 'estándar legal', example: 'Our practices exceed the minimum legal standards for safety.', difficulty: 'intermediate' },
          { term: 'compliance report', pronunciation: '/kəmˈplaɪəns rɪˈpɔːrt/', translation: 'informe de cumplimiento', example: 'The compliance report documents adherence to all regulations.', difficulty: 'intermediate' },
          { term: 'legal protection', pronunciation: '/ˈliːɡəl prəˈtɛkʃən/', translation: 'protección legal', example: 'Legal protection for whistleblowers encourages reporting of violations.', difficulty: 'intermediate' },
          { term: 'regulatory change', pronunciation: '/ˈrɛɡjələtɔːri tʃeɪndʒ/', translation: 'cambio regulatorio', example: 'Regulatory changes require updates to our compliance procedures.', difficulty: 'intermediate' },
          { term: 'legal validity', pronunciation: '/ˈliːɡəl vəˈlɪdəti/', translation: 'validez legal', example: 'The legal validity of electronic signatures is recognized in most jurisdictions.', difficulty: 'intermediate' },
          { term: 'compliance culture', pronunciation: '/kəmˈplaɪəns ˈkʌltʃər/', translation: 'cultura de cumplimiento', example: 'Building a compliance culture requires leadership commitment and employee engagement.', difficulty: 'advanced' },
          { term: 'legal enforcement', pronunciation: '/ˈliːɡəl ɪnˈfɔːrsmənt/', translation: 'aplicación legal', example: 'Legal enforcement of contracts ensures parties fulfill their obligations.', difficulty: 'intermediate' },
          { term: 'regulatory framework', pronunciation: '/ˈrɛɡjələtɔːri ˈfreɪmwɜːrk/', translation: 'marco regulatorio', example: 'The regulatory framework establishes rules for industry operations.', difficulty: 'intermediate' },
          { term: 'legal precedence', pronunciation: '/ˈliːɡəl ˈprɛsɪdəns/', translation: 'precedencia legal', example: 'Legal precedence determines which laws apply in case of conflict.', difficulty: 'advanced' },
          { term: 'compliance assessment', pronunciation: '/kəmˈplaɪəns əˈsɛsmənt/', translation: 'evaluación de cumplimiento', example: 'Regular compliance assessments identify gaps and improvement opportunities.', difficulty: 'intermediate' },
          { term: 'legal authority', pronunciation: '/ˈliːɡəl ɔːˈθɒrəti/', translation: 'autoridad legal', example: 'The legal authority to sign contracts is delegated to senior management.', difficulty: 'intermediate' },
          { term: 'regulatory oversight', pronunciation: '/ˈrɛɡjələtɔːri ˈoʊvərsaɪt/', translation: 'supervisión regulatoria', example: 'Regulatory oversight ensures companies comply with industry standards.', difficulty: 'intermediate' },
          { term: 'legal compliance', pronunciation: '/ˈliːɡəl kəmˈplaɪəns/', translation: 'cumplimiento legal', example: 'Legal compliance is monitored through regular audits and reviews.', difficulty: 'intermediate' },
          { term: 'regulatory penalty', pronunciation: '/ˈrɛɡjələtɔːri ˈpɛnəlti/', translation: 'sanción regulatoria', example: 'Regulatory penalties for non-compliance can be substantial.', difficulty: 'intermediate' },
          { term: 'legal accountability', pronunciation: '/ˈliːɡəl əˌkaʊntəˈbɪləti/', translation: 'responsabilidad legal', example: 'Legal accountability ensures individuals are responsible for their actions.', difficulty: 'intermediate' },
          { term: 'compliance management', pronunciation: '/kəmˈplaɪəns ˈmænɪdʒmənt/', translation: 'gestión de cumplimiento', example: 'Compliance management systems track and report regulatory adherence.', difficulty: 'intermediate' },
          { term: 'legal transparency', pronunciation: '/ˈliːɡəl trænsˈpærənsi/', translation: 'transparencia legal', example: 'Legal transparency in operations builds stakeholder trust.', difficulty: 'intermediate' },
          { term: 'regulatory environment', pronunciation: '/ˈrɛɡjələtɔːri ɪnˈvaɪrənmənt/', translation: 'entorno regulatorio', example: 'The regulatory environment is constantly evolving with new legislation.', difficulty: 'intermediate' },
          { term: 'legal governance', pronunciation: '/ˈliːɡəl ˈɡʌvərnəns/', translation: 'gobernanza legal', example: 'Strong legal governance structures prevent compliance violations.', difficulty: 'advanced' },
          { term: 'compliance excellence', pronunciation: '/kəmˈplaɪəns ˈɛksələns/', translation: 'excelencia en cumplimiento', example: 'Achieving compliance excellence requires continuous improvement and vigilance.', difficulty: 'advanced' },
          { term: 'legal sustainability', pronunciation: '/ˈliːɡəl səˌsteɪnəˈbɪləti/', translation: 'sostenibilidad legal', example: 'Legal sustainability ensures long-term compliance with evolving regulations.', difficulty: 'advanced' },
          { term: 'Non-disclosure agreement', pronunciation: '/nɑn dɪsˈkloʊʒər əˈgrimənt/', translation: 'Acuerdo de confidencialidad', example: 'All contractors must sign a non-disclosure agreement before accessing our proprietary technology and trade secrets.', difficulty: 'intermediate' },
          { term: 'Intellectual property', pronunciation: '/ˌɪntəˈlɛktʃuəl ˈprɑpərti/', translation: 'Propiedad intelectual', example: 'Protecting our intellectual property through patents and trademarks is essential to maintaining our competitive advantage.', difficulty: 'advanced' },
          { term: 'Regulatory compliance', pronunciation: '/ˈrɛgjələˌtɔri kəmˈplaɪəns/', translation: 'Cumplimiento normativo', example: 'Our compliance team ensures that all business operations meet regulatory compliance requirements in every jurisdiction we operate.', difficulty: 'advanced' },
          { term: 'Due diligence', pronunciation: '/du ˈdɪlɪdʒəns/', translation: 'Debida diligencia', example: 'We conducted thorough due diligence before acquiring the company to identify potential legal and financial risks.', difficulty: 'advanced' }
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
          { term: 'Total productive maintenance', pronunciation: '/ˈtoʊtl prəˈdʌktɪv ˈmeɪntənəns/', translation: 'Mantenimiento productivo total', example: 'Total productive maintenance prevents breakdowns', difficulty: 'advanced' },
          { term: 'production line', pronunciation: '/prəˈdʌkʃən laɪn/', translation: 'línea de producción', example: 'The production line operates 24 hours a day to meet demand.', difficulty: 'beginner' },
          { term: 'manufacturing process', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ˈprɒsɛs/', translation: 'proceso de manufactura', example: 'Our manufacturing process incorporates the latest automation technology.', difficulty: 'intermediate' },
          { term: 'quality assurance', pronunciation: '/ˈkwɒlɪti əˈʃʊrəns/', translation: 'aseguramiento de calidad', example: 'Quality assurance testing occurs at multiple stages of production.', difficulty: 'intermediate' },
          { term: 'assembly line', pronunciation: '/əˈsɛmbli laɪn/', translation: 'línea de ensamblaje', example: 'The assembly line increased production efficiency by 40%.', difficulty: 'beginner' },
          { term: 'raw materials', pronunciation: '/rɔː məˈtɪriəlz/', translation: 'materias primas', example: 'Rising costs of raw materials are impacting our profit margins.', difficulty: 'beginner' },
          { term: 'production capacity', pronunciation: '/prəˈdʌkʃən kəˈpæsəti/', translation: 'capacidad de producción', example: 'We\'re expanding production capacity to meet growing demand.', difficulty: 'intermediate' },
          { term: 'batch production', pronunciation: '/bætʃ prəˈdʌkʃən/', translation: 'producción por lotes', example: 'Batch production allows us to manufacture multiple product variants efficiently.', difficulty: 'intermediate' },
          { term: 'lean manufacturing', pronunciation: '/liːn ˌmænjəˈfæktʃərɪŋ/', translation: 'manufactura esbelta', example: 'Lean manufacturing principles eliminated waste and improved productivity.', difficulty: 'advanced' },
          { term: 'production schedule', pronunciation: '/prəˈdʌkʃən ˈskɛdʒuːl/', translation: 'programa de producción', example: 'The production schedule is adjusted weekly based on order volume.', difficulty: 'intermediate' },
          { term: 'quality control', pronunciation: '/ˈkwɒlɪti kənˈtroʊl/', translation: 'control de calidad', example: 'Quality control inspectors check every unit before shipping.', difficulty: 'intermediate' },
          { term: 'production output', pronunciation: '/prəˈdʌkʃən ˈaʊtpʊt/', translation: 'producción', example: 'Production output increased by 25% after equipment upgrades.', difficulty: 'intermediate' },
          { term: 'manufacturing efficiency', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ɪˈfɪʃənsi/', translation: 'eficiencia de manufactura', example: 'Improving manufacturing efficiency is our top operational priority.', difficulty: 'intermediate' },
          { term: 'production planning', pronunciation: '/prəˈdʌkʃən ˈplænɪŋ/', translation: 'planificación de producción', example: 'Production planning coordinates materials, labor, and equipment resources.', difficulty: 'intermediate' },
          { term: 'work in progress', pronunciation: '/wɜːrk ɪn ˈprɒɡrɛs/', translation: 'trabajo en proceso', example: 'Work in progress inventory represents partially completed products.', difficulty: 'intermediate' },
          { term: 'finished goods', pronunciation: '/ˈfɪnɪʃt ɡʊdz/', translation: 'productos terminados', example: 'Finished goods are stored in the warehouse awaiting shipment.', difficulty: 'beginner' },
          { term: 'production cost', pronunciation: '/prəˈdʌkʃən kɒst/', translation: 'costo de producción', example: 'Reducing production costs without compromising quality is challenging.', difficulty: 'intermediate' },
          { term: 'manufacturing automation', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ˌɔːtəˈmeɪʃən/', translation: 'automatización de manufactura', example: 'Manufacturing automation reduced labor costs and improved consistency.', difficulty: 'advanced' },
          { term: 'production yield', pronunciation: '/prəˈdʌkʃən jiːld/', translation: 'rendimiento de producción', example: 'Production yield improved from 85% to 95% after process optimization.', difficulty: 'intermediate' },
          { term: 'machine downtime', pronunciation: '/məˈʃiːn ˈdaʊntaɪm/', translation: 'tiempo de inactividad de máquina', example: 'Reducing machine downtime is critical for meeting production targets.', difficulty: 'intermediate' },
          { term: 'production bottleneck', pronunciation: '/prəˈdʌkʃən ˈbɒtlnɛk/', translation: 'cuello de botella de producción', example: 'We identified the packaging stage as the main production bottleneck.', difficulty: 'intermediate' },
          { term: 'manufacturing standards', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ˈstændərdz/', translation: 'estándares de manufactura', example: 'All products must meet strict manufacturing standards for safety and quality.', difficulty: 'intermediate' },
          { term: 'production rate', pronunciation: '/prəˈdʌkʃən reɪt/', translation: 'tasa de producción', example: 'The production rate is 500 units per hour on the main line.', difficulty: 'intermediate' },
          { term: 'manufacturing overhead', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ˈoʊvərhɛd/', translation: 'gastos generales de manufactura', example: 'Manufacturing overhead includes utilities, maintenance, and indirect labor.', difficulty: 'intermediate' },
          { term: 'production facility', pronunciation: '/prəˈdʌkʃən fəˈsɪləti/', translation: 'instalación de producción', example: 'Our new production facility will double our manufacturing capacity.', difficulty: 'beginner' },
          { term: 'quality inspection', pronunciation: '/ˈkwɒlɪti ɪnˈspɛkʃən/', translation: 'inspección de calidad', example: 'Quality inspection occurs at three checkpoints during production.', difficulty: 'intermediate' },
          { term: 'production workflow', pronunciation: '/prəˈdʌkʃən ˈwɜːrkfloʊ/', translation: 'flujo de trabajo de producción', example: 'Optimizing the production workflow reduced cycle time significantly.', difficulty: 'intermediate' },
          { term: 'manufacturing technology', pronunciation: '/ˌmænjəˈfæktʃərɪŋ tɛkˈnɒlədʒi/', translation: 'tecnología de manufactura', example: 'Investing in advanced manufacturing technology improves competitiveness.', difficulty: 'intermediate' },
          { term: 'production target', pronunciation: '/prəˈdʌkʃən ˈtɑːrɡɪt/', translation: 'objetivo de producción', example: 'We exceeded our monthly production target by 10%.', difficulty: 'beginner' },
          { term: 'manufacturing defect', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ˈdiːfɛkt/', translation: 'defecto de manufactura', example: 'Manufacturing defects are identified and corrected during quality control.', difficulty: 'intermediate' },
          { term: 'production optimization', pronunciation: '/prəˈdʌkʃən ˌɒptɪmaɪˈzeɪʃən/', translation: 'optimización de producción', example: 'Production optimization initiatives saved $500,000 annually.', difficulty: 'intermediate' },
          { term: 'manufacturing cycle time', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ˈsaɪkl taɪm/', translation: 'tiempo de ciclo de manufactura', example: 'Reducing manufacturing cycle time improves responsiveness to customer orders.', difficulty: 'intermediate' },
          { term: 'production equipment', pronunciation: '/prəˈdʌkʃən ɪˈkwɪpmənt/', translation: 'equipo de producción', example: 'Regular maintenance of production equipment prevents unexpected breakdowns.', difficulty: 'beginner' },
          { term: 'manufacturing quality', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ˈkwɒlɪti/', translation: 'calidad de manufactura', example: 'Manufacturing quality is monitored through statistical process control.', difficulty: 'intermediate' },
          { term: 'production metrics', pronunciation: '/prəˈdʌkʃən ˈmɛtrɪks/', translation: 'métricas de producción', example: 'Key production metrics include output, efficiency, and defect rates.', difficulty: 'intermediate' },
          { term: 'manufacturing capability', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ˌkeɪpəˈbɪləti/', translation: 'capacidad de manufactura', example: 'Our manufacturing capability allows us to produce complex components in-house.', difficulty: 'intermediate' },
          { term: 'production variance', pronunciation: '/prəˈdʌkʃən ˈvɛriəns/', translation: 'varianza de producción', example: 'Production variance analysis identifies deviations from standard costs.', difficulty: 'advanced' },
          { term: 'manufacturing innovation', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ˌɪnəˈveɪʃən/', translation: 'innovación en manufactura', example: 'Manufacturing innovation drives continuous improvement in our processes.', difficulty: 'advanced' },
          { term: 'production control', pronunciation: '/prəˈdʌkʃən kənˈtroʊl/', translation: 'control de producción', example: 'Production control systems monitor and adjust operations in real-time.', difficulty: 'intermediate' },
          { term: 'manufacturing flexibility', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ˌflɛksəˈbɪləti/', translation: 'flexibilidad de manufactura', example: 'Manufacturing flexibility enables quick changeovers between product lines.', difficulty: 'intermediate' },
          { term: 'production reliability', pronunciation: '/prəˈdʌkʃən rɪˌlaɪəˈbɪləti/', translation: 'confiabilidad de producción', example: 'Production reliability improved through preventive maintenance programs.', difficulty: 'intermediate' },
          { term: 'manufacturing scalability', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ˌskeɪləˈbɪləti/', translation: 'escalabilidad de manufactura', example: 'Manufacturing scalability allows us to increase output without major investments.', difficulty: 'advanced' },
          { term: 'production synchronization', pronunciation: '/prəˈdʌkʃən ˌsɪŋkrənaɪˈzeɪʃən/', translation: 'sincronización de producción', example: 'Production synchronization ensures smooth flow between manufacturing stages.', difficulty: 'advanced' },
          { term: 'manufacturing precision', pronunciation: '/ˌmænjəˈfæktʃərɪŋ prɪˈsɪʒən/', translation: 'precisión de manufactura', example: 'Manufacturing precision is critical for aerospace component production.', difficulty: 'intermediate' },
          { term: 'production monitoring', pronunciation: '/prəˈdʌkʃən ˈmɒnɪtərɪŋ/', translation: 'monitoreo de producción', example: 'Real-time production monitoring identifies issues before they impact quality.', difficulty: 'intermediate' },
          { term: 'manufacturing sustainability', pronunciation: '/ˌmænjəˈfæktʃərɪŋ səˌsteɪnəˈbɪləti/', translation: 'sostenibilidad de manufactura', example: 'Manufacturing sustainability initiatives reduce waste and energy consumption.', difficulty: 'advanced' },
          { term: 'production integration', pronunciation: '/prəˈdʌkʃən ˌɪntɪˈɡreɪʃən/', translation: 'integración de producción', example: 'Production integration connects manufacturing with supply chain systems.', difficulty: 'advanced' },
          { term: 'manufacturing agility', pronunciation: '/ˌmænjəˈfæktʃərɪŋ əˈdʒɪləti/', translation: 'agilidad de manufactura', example: 'Manufacturing agility enables rapid response to market changes.', difficulty: 'advanced' },
          { term: 'production traceability', pronunciation: '/prəˈdʌkʃən ˌtreɪsəˈbɪləti/', translation: 'trazabilidad de producción', example: 'Production traceability systems track components throughout manufacturing.', difficulty: 'advanced' },
          { term: 'manufacturing excellence', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ˈɛksələns/', translation: 'excelencia en manufactura', example: 'Achieving manufacturing excellence requires continuous improvement and innovation.', difficulty: 'advanced' },
          { term: 'production analytics', pronunciation: '/prəˈdʌkʃən ˌænəˈlɪtɪks/', translation: 'analítica de producción', example: 'Production analytics provide insights for optimizing manufacturing operations.', difficulty: 'advanced' },
          { term: 'manufacturing intelligence', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ɪnˈtɛlɪdʒəns/', translation: 'inteligencia de manufactura', example: 'Manufacturing intelligence systems collect and analyze production data.', difficulty: 'advanced' },
          { term: 'production transformation', pronunciation: '/prəˈdʌkʃən ˌtrænsfərˈmeɪʃən/', translation: 'transformación de producción', example: 'Production transformation initiatives modernize our manufacturing capabilities.', difficulty: 'advanced' },
          { term: 'manufacturing digitalization', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ˌdɪdʒɪtəlaɪˈzeɪʃən/', translation: 'digitalización de manufactura', example: 'Manufacturing digitalization connects machines and systems for better visibility.', difficulty: 'advanced' },
          { term: 'production resilience', pronunciation: '/prəˈdʌkʃən rɪˈzɪliəns/', translation: 'resiliencia de producción', example: 'Production resilience ensures operations continue during disruptions.', difficulty: 'advanced' },
          { term: 'manufacturing competitiveness', pronunciation: '/ˌmænjəˈfæktʃərɪŋ kəmˌpɛtɪˈtɪvnəs/', translation: 'competitividad de manufactura', example: 'Manufacturing competitiveness depends on quality, cost, and delivery performance.', difficulty: 'advanced' },
          { term: 'production visibility', pronunciation: '/prəˈdʌkʃən ˌvɪzəˈbɪləti/', translation: 'visibilidad de producción', example: 'Production visibility enables proactive management of manufacturing operations.', difficulty: 'intermediate' },
          { term: 'manufacturing ecosystem', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ˈiːkoʊˌsɪstəm/', translation: 'ecosistema de manufactura', example: 'Our manufacturing ecosystem includes suppliers, partners, and technology providers.', difficulty: 'advanced' },
          { term: 'production orchestration', pronunciation: '/prəˈdʌkʃən ˌɔːrkɪˈstreɪʃən/', translation: 'orquestación de producción', example: 'Production orchestration coordinates multiple manufacturing processes seamlessly.', difficulty: 'advanced' },
          { term: 'manufacturing maturity', pronunciation: '/ˌmænjəˈfæktʃərɪŋ məˈtʃʊrəti/', translation: 'madurez de manufactura', example: 'Manufacturing maturity assessments identify opportunities for advancement.', difficulty: 'advanced' },
          { term: 'production governance', pronunciation: '/prəˈdʌkʃən ˈɡʌvərnəns/', translation: 'gobernanza de producción', example: 'Production governance ensures compliance with quality and safety standards.', difficulty: 'advanced' },
          { term: 'manufacturing breakthrough', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ˈbreɪkθruː/', translation: 'avance en manufactura', example: 'The manufacturing breakthrough reduced production costs by 30%.', difficulty: 'advanced' },
          { term: 'production architecture', pronunciation: '/prəˈdʌkʃən ˈɑːrkɪtɛktʃər/', translation: 'arquitectura de producción', example: 'The production architecture defines how manufacturing systems interact.', difficulty: 'advanced' },
          { term: 'manufacturing evolution', pronunciation: '/ˌmænjəˈfæktʃərɪŋ ˌɛvəˈluːʃən/', translation: 'evolución de manufactura', example: 'Manufacturing evolution from manual to automated processes took five years.', difficulty: 'advanced' },
          { term: 'production paradigm', pronunciation: '/prəˈdʌkʃən ˈpærədaɪm/', translation: 'paradigma de producción', example: 'The new production paradigm emphasizes flexibility and customization.', difficulty: 'advanced' },
          { term: 'manufacturing renaissance', pronunciation: '/ˌmænjəˈfæktʃərɪŋ rɪˈneɪsəns/', translation: 'renacimiento de manufactura', example: 'The manufacturing renaissance brought production back to domestic facilities.', difficulty: 'advanced' },
          { term: 'Assembly line', pronunciation: '/əˈsɛmbli laɪn/', translation: 'Línea de ensamblaje', example: 'Our assembly line produces 500 units per day with a defect rate of less than 0.5%.', difficulty: 'beginner' },
          { term: 'Capacity planning', pronunciation: '/kəˈpæsəti ˈplænɪŋ/', translation: 'Planificación de capacidad', example: 'Effective capacity planning ensures we can meet increased demand during peak seasons without overinvesting in resources.', difficulty: 'advanced' },
          { term: 'Preventive maintenance', pronunciation: '/prɪˈvɛntɪv ˈmeɪntənəns/', translation: 'Mantenimiento preventivo', example: 'Our preventive maintenance program reduced equipment downtime by 40% and extended machinery lifespan.', difficulty: 'intermediate' },
          { term: 'Batch production', pronunciation: '/bætʃ prəˈdʌkʃən/', translation: 'Producción por lotes', example: 'We use batch production for our specialty products to maintain flexibility and reduce setup costs.', difficulty: 'intermediate' },
          { term: 'Yield rate', pronunciation: '/jild reɪt/', translation: 'Tasa de rendimiento', example: 'By improving our manufacturing process, we increased our yield rate from 85% to 93%, significantly reducing waste.', difficulty: 'advanced' }
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
          { term: 'Term sheet', pronunciation: '/tɜːrm ʃiːt/', translation: 'Hoja de términos', example: 'Review the term sheet carefully', difficulty: 'advanced' },
          { term: 'startup', pronunciation: '/ˈstɑːrtʌp/', translation: 'startup', example: 'Our startup secured seed funding from three angel investors.', difficulty: 'beginner' },
          { term: 'venture capital', pronunciation: '/ˈvɛntʃər ˈkæpɪtl/', translation: 'capital de riesgo', example: 'Venture capital firms invested $5 million in our Series A round.', difficulty: 'intermediate' },
          { term: 'business plan', pronunciation: '/ˈbɪznəs plæn/', translation: 'plan de negocios', example: 'A comprehensive business plan is essential for attracting investors.', difficulty: 'beginner' },
          { term: 'pitch deck', pronunciation: '/pɪtʃ dɛk/', translation: 'presentación de inversión', example: 'Our pitch deck highlights the market opportunity and competitive advantage.', difficulty: 'intermediate' },
          { term: 'minimum viable product', pronunciation: '/ˈmɪnɪməm ˈvaɪəbl ˈprɒdʌkt/', translation: 'producto mínimo viable', example: 'We launched a minimum viable product to test market demand quickly.', difficulty: 'intermediate' },
          { term: 'bootstrapping', pronunciation: '/ˈbuːtstræpɪŋ/', translation: 'autofinanciamiento', example: 'Bootstrapping allowed us to maintain full ownership while growing the business.', difficulty: 'intermediate' },
          { term: 'angel investor', pronunciation: '/ˈeɪndʒəl ɪnˈvɛstər/', translation: 'inversionista ángel', example: 'An angel investor provided early-stage funding and mentorship.', difficulty: 'intermediate' },
          { term: 'equity', pronunciation: '/ˈɛkwɪti/', translation: 'capital accionario', example: 'Founders retained 60% equity after the funding round.', difficulty: 'intermediate' },
          { term: 'scalability', pronunciation: '/ˌskeɪləˈbɪləti/', translation: 'escalabilidad', example: 'The business model\'s scalability attracted significant investor interest.', difficulty: 'intermediate' },
          { term: 'product-market fit', pronunciation: '/ˈprɒdʌkt ˈmɑːrkɪt fɪt/', translation: 'ajuste producto-mercado', example: 'Achieving product-market fit is crucial before scaling operations.', difficulty: 'advanced' },
          { term: 'burn rate', pronunciation: '/bɜːrn reɪt/', translation: 'tasa de consumo de capital', example: 'Our monthly burn rate is $50,000, giving us 18 months of runway.', difficulty: 'intermediate' },
          { term: 'runway', pronunciation: '/ˈrʌnweɪ/', translation: 'pista financiera', example: 'We have 12 months of runway before needing additional funding.', difficulty: 'intermediate' },
          { term: 'pivot', pronunciation: '/ˈpɪvət/', translation: 'pivote', example: 'The startup decided to pivot after initial market feedback was negative.', difficulty: 'intermediate' },
          { term: 'disruptive innovation', pronunciation: '/dɪsˈrʌptɪv ˌɪnəˈveɪʃən/', translation: 'innovación disruptiva', example: 'Our disruptive innovation is transforming the traditional industry model.', difficulty: 'advanced' },
          { term: 'incubator', pronunciation: '/ˈɪŋkjəbeɪtər/', translation: 'incubadora', example: 'The startup incubator provided office space and mentorship for six months.', difficulty: 'intermediate' },
          { term: 'accelerator', pronunciation: '/əkˈsɛləreɪtər/', translation: 'aceleradora', example: 'The accelerator program helped us refine our business model and connect with investors.', difficulty: 'intermediate' },
          { term: 'seed funding', pronunciation: '/siːd ˈfʌndɪŋ/', translation: 'financiamiento semilla', example: 'Seed funding of $500,000 enabled us to build our initial product.', difficulty: 'intermediate' },
          { term: 'valuation', pronunciation: '/ˌvæljuˈeɪʃən/', translation: 'valoración', example: 'The company\'s valuation reached $10 million after the latest funding round.', difficulty: 'intermediate' },
          { term: 'exit strategy', pronunciation: '/ˈɛɡzɪt ˈstrætədʒi/', translation: 'estrategia de salida', example: 'Our exit strategy includes potential acquisition by larger competitors.', difficulty: 'advanced' },
          { term: 'unicorn', pronunciation: '/ˈjuːnɪkɔːrn/', translation: 'unicornio', example: 'The startup became a unicorn after reaching a $1 billion valuation.', difficulty: 'intermediate' },
          { term: 'co-founder', pronunciation: '/koʊ ˈfaʊndər/', translation: 'cofundador', example: 'My co-founder handles technology while I focus on business development.', difficulty: 'beginner' },
          { term: 'traction', pronunciation: '/ˈtrækʃən/', translation: 'tracción', example: 'Strong user traction convinced investors to fund our Series A.', difficulty: 'intermediate' },
          { term: 'growth hacking', pronunciation: '/ɡroʊθ ˈhækɪŋ/', translation: 'growth hacking', example: 'Growth hacking strategies helped us acquire 10,000 users in three months.', difficulty: 'advanced' },
          { term: 'lean startup', pronunciation: '/liːn ˈstɑːrtʌp/', translation: 'startup ágil', example: 'The lean startup methodology emphasizes rapid experimentation and validated learning.', difficulty: 'advanced' },
          { term: 'venture capital', pronunciation: '/ˈvɛn.tʃər ˈkæp.ɪ.təl/', translation: 'capital de riesgo', example: 'The startup secured $5 million in venture capital to expand its operations.', difficulty: 'intermediate' },
          { term: 'pitch deck', pronunciation: '/pɪtʃ dɛk/', translation: 'presentación de proyecto', example: 'Our pitch deck highlights the market opportunity and our competitive advantage.', difficulty: 'intermediate' },
          { term: 'bootstrapping', pronunciation: '/ˈbuːt.stræp.ɪŋ/', translation: 'autofinanciamiento', example: 'We grew the company through bootstrapping without any external investment.', difficulty: 'advanced' },
          { term: 'scalability', pronunciation: '/ˌskeɪ.ləˈbɪl.ə.ti/', translation: 'escalabilidad', example: 'The platform\'s scalability allows it to handle millions of users simultaneously.', difficulty: 'intermediate' },
          { term: 'equity', pronunciation: '/ˈɛk.wɪ.ti/', translation: 'capital accionario', example: 'The founders retained 60% equity after the Series A funding round.', difficulty: 'intermediate' },
          { term: 'burn rate', pronunciation: '/bɜːrn reɪt/', translation: 'tasa de consumo de capital', example: 'We need to reduce our burn rate to extend our runway by six months.', difficulty: 'advanced' },
          { term: 'pivot', pronunciation: '/ˈpɪv.ət/', translation: 'cambio de estrategia', example: 'After analyzing user feedback, the company decided to pivot to a B2B model.', difficulty: 'intermediate' },
          { term: 'unicorn', pronunciation: '/ˈjuː.nɪ.kɔːrn/', translation: 'unicornio (empresa valorada en más de mil millones)', example: 'The fintech startup became a unicorn after reaching a $1.2 billion valuation.', difficulty: 'intermediate' },
          { term: 'angel investor', pronunciation: '/ˈeɪn.dʒəl ɪnˈvɛs.tər/', translation: 'inversionista ángel', example: 'An angel investor provided the initial seed funding for our mobile app.', difficulty: 'beginner' },
          { term: 'minimum viable product', pronunciation: '/ˈmɪn.ɪ.məm ˈvaɪ.ə.bəl ˈprɒd.ʌkt/', translation: 'producto mínimo viable', example: 'We launched our minimum viable product to test market demand before full development.', difficulty: 'intermediate' },
          { term: 'disruptive innovation', pronunciation: '/dɪsˈrʌp.tɪv ˌɪn.əˈveɪ.ʃən/', translation: 'innovación disruptiva', example: 'The company\'s disruptive innovation transformed the traditional taxi industry.', difficulty: 'advanced' },
          { term: 'incubator', pronunciation: '/ˈɪŋ.kjʊ.beɪ.tər/', translation: 'incubadora de empresas', example: 'The startup joined a tech incubator that provided mentorship and office space.', difficulty: 'beginner' },
          { term: 'accelerator', pronunciation: '/əkˈsɛl.ə.reɪ.tər/', translation: 'aceleradora de empresas', example: 'Y Combinator is one of the most prestigious startup accelerators in Silicon Valley.', difficulty: 'beginner' },
          { term: 'valuation', pronunciation: '/ˌvæl.juˈeɪ.ʃən/', translation: 'valoración', example: 'The pre-money valuation was set at $10 million before the investment round.', difficulty: 'intermediate' },
          { term: 'term sheet', pronunciation: '/tɜːrm ʃiːt/', translation: 'hoja de términos', example: 'Both parties signed the term sheet outlining the investment conditions.', difficulty: 'advanced' },
          { term: 'runway', pronunciation: '/ˈrʌn.weɪ/', translation: 'tiempo de operación con capital disponible', example: 'With our current burn rate, we have 18 months of runway remaining.', difficulty: 'advanced' },
          { term: 'product-market fit', pronunciation: '/ˈprɒd.ʌkt ˈmɑːr.kɪt fɪt/', translation: 'ajuste producto-mercado', example: 'Achieving product-market fit is crucial before scaling the business.', difficulty: 'advanced' },
          { term: 'exit strategy', pronunciation: '/ˈɛɡ.zɪt ˈstræt.ə.dʒi/', translation: 'estrategia de salida', example: 'The founders planned an exit strategy through acquisition by a larger company.', difficulty: 'intermediate' },
          { term: 'seed funding', pronunciation: '/siːd ˈfʌnd.ɪŋ/', translation: 'financiamiento semilla', example: 'We raised $500,000 in seed funding from family, friends, and angel investors.', difficulty: 'beginner' },
          { term: 'Series A', pronunciation: '/ˈsɪə.riːz eɪ/', translation: 'Serie A (ronda de financiamiento)', example: 'The company closed its Series A round with $8 million from venture capitalists.', difficulty: 'intermediate' },
          { term: 'cap table', pronunciation: '/kæp ˈteɪ.bəl/', translation: 'tabla de capitalización', example: 'The cap table shows the ownership percentages of all shareholders.', difficulty: 'advanced' },
          { term: 'traction', pronunciation: '/ˈtræk.ʃən/', translation: 'tracción (crecimiento)', example: 'The startup demonstrated strong traction with 50,000 active users in six months.', difficulty: 'intermediate' },
          { term: 'lean startup', pronunciation: '/liːn ˈstɑːrt.ʌp/', translation: 'startup ágil', example: 'We follow the lean startup methodology to minimize waste and iterate quickly.', difficulty: 'intermediate' },
          { term: 'business model canvas', pronunciation: '/ˈbɪz.nɪs ˈmɒd.əl ˈkæn.vəs/', translation: 'lienzo de modelo de negocio', example: 'The business model canvas helped us visualize our value proposition and revenue streams.', difficulty: 'advanced' },
          { term: 'churn rate', pronunciation: '/tʃɜːrn reɪt/', translation: 'tasa de abandono', example: 'Reducing our churn rate from 8% to 3% significantly improved customer retention.', difficulty: 'advanced' },
          { term: 'customer acquisition cost', pronunciation: '/ˈkʌs.tə.mər ˌæk.wɪˈzɪʃ.ən kɒst/', translation: 'costo de adquisición de cliente', example: 'Our customer acquisition cost decreased by 40% after optimizing our marketing campaigns.', difficulty: 'advanced' },
          { term: 'lifetime value', pronunciation: '/ˈlaɪf.taɪm ˈvæl.juː/', translation: 'valor de vida del cliente', example: 'The lifetime value of our premium subscribers is three times higher than basic users.', difficulty: 'advanced' },
          { term: 'go-to-market strategy', pronunciation: '/ɡəʊ tuː ˈmɑːr.kɪt ˈstræt.ə.dʒi/', translation: 'estrategia de comercialización', example: 'Our go-to-market strategy focuses on enterprise clients in the healthcare sector.', difficulty: 'advanced' },
          { term: 'intellectual property', pronunciation: '/ˌɪn.təˈlɛk.tʃu.əl ˈprɒp.ə.ti/', translation: 'propiedad intelectual', example: 'Protecting our intellectual property through patents is a top priority.', difficulty: 'intermediate' },
          { term: 'co-founder', pronunciation: '/kəʊ ˈfaʊn.dər/', translation: 'cofundador', example: 'My co-founder handles the technical development while I focus on business operations.', difficulty: 'beginner' },
          { term: 'vesting schedule', pronunciation: '/ˈvɛst.ɪŋ ˈʃɛd.juːl/', translation: 'calendario de adquisición de acciones', example: 'The vesting schedule grants 25% of equity after one year with monthly vesting thereafter.', difficulty: 'advanced' },
          { term: 'dilution', pronunciation: '/daɪˈluː.ʃən/', translation: 'dilución (de acciones)', example: 'The founders experienced 20% dilution after the new investment round.', difficulty: 'advanced' },
          { term: 'proof of concept', pronunciation: '/pruːf əv ˈkɒn.sɛpt/', translation: 'prueba de concepto', example: 'We developed a proof of concept to demonstrate the feasibility of our technology.', difficulty: 'intermediate' },
          { term: 'market penetration', pronunciation: '/ˈmɑːr.kɪt ˌpɛn.ɪˈtreɪ.ʃən/', translation: 'penetración de mercado', example: 'Our market penetration strategy targets small businesses in urban areas.', difficulty: 'intermediate' },
          { term: 'competitive advantage', pronunciation: '/kəmˈpɛt.ɪ.tɪv ədˈvɑːn.tɪdʒ/', translation: 'ventaja competitiva', example: 'Our proprietary algorithm provides a significant competitive advantage over rivals.', difficulty: 'intermediate' },
          { term: 'revenue stream', pronunciation: '/ˈrɛv.ə.njuː striːm/', translation: 'flujo de ingresos', example: 'The company diversified its revenue streams by adding subscription and advertising models.', difficulty: 'intermediate' },
          { term: 'break-even point', pronunciation: '/breɪk ˈiː.vən pɔɪnt/', translation: 'punto de equilibrio', example: 'We expect to reach our break-even point within 24 months of launch.', difficulty: 'intermediate' },
          { term: 'due diligence', pronunciation: '/djuː ˈdɪl.ɪ.dʒəns/', translation: 'debida diligencia', example: 'Investors conducted thorough due diligence before committing to the funding round.', difficulty: 'advanced' },
          { term: 'pitch', pronunciation: '/pɪtʃ/', translation: 'presentación de proyecto', example: 'I have five minutes to pitch our startup to potential investors at the conference.', difficulty: 'beginner' },
          { term: 'stakeholder', pronunciation: '/ˈsteɪk.həʊl.dər/', translation: 'parte interesada', example: 'We regularly communicate with all stakeholders to keep them informed of our progress.', difficulty: 'beginner' },
          { term: 'agile methodology', pronunciation: '/ˈædʒ.aɪl ˌmɛθ.əˈdɒl.ə.dʒi/', translation: 'metodología ágil', example: 'Our development team uses agile methodology to deliver features in two-week sprints.', difficulty: 'intermediate' },
          { term: 'networking', pronunciation: '/ˈnɛt.wɜːr.kɪŋ/', translation: 'establecimiento de contactos', example: 'Networking at industry events helped us connect with potential partners and investors.', difficulty: 'beginner' },
          { term: 'monetization', pronunciation: '/ˌmʌn.ɪ.taɪˈzeɪ.ʃən/', translation: 'monetización', example: 'Our monetization strategy includes premium subscriptions and in-app purchases.', difficulty: 'intermediate' },
          { term: 'scalable business model', pronunciation: '/ˈskeɪ.lə.bəl ˈbɪz.nɪs ˈmɒd.əl/', translation: 'modelo de negocio escalable', example: 'A scalable business model allows us to grow revenue without proportional cost increases.', difficulty: 'advanced' },
          { term: 'market validation', pronunciation: '/ˈmɑːr.kɪt ˌvæl.ɪˈdeɪ.ʃən/', translation: 'validación de mercado', example: 'Market validation through customer surveys confirmed demand for our product.', difficulty: 'intermediate' },
          { term: 'growth hacking', pronunciation: '/ɡrəʊθ ˈhæk.ɪŋ/', translation: 'técnicas de crecimiento acelerado', example: 'Growth hacking techniques helped us acquire 100,000 users in just three months.', difficulty: 'advanced' }
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
