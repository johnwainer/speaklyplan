
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

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

    // Crear datos del plan basados en la estructura del Excel
    console.log('📅 Creando plan semanal completo (24 semanas)...')
    
    const sampleWeeksData = [
  {
    number: 1, month: 1, phase: 1,
    objective: "Primeros pasos: Presentación personal básica",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Vocabulario y Listening", description: "Vocabulario técnico (20 palabras) + Listening BBC 6 Min (40 min)", duration: 40, category: "vocabulario" },
      { day: "martes", dayNumber: 2, title: "Práctica de Speaking", description: "Speaking con ChatGPT + Shadowing (30+30 min)", duration: 60, category: "speaking" },
      { day: "miércoles", dayNumber: 3, title: "Escritura y Gramática", description: "Gramática aplicada + Writing emails (30+30 min)", duration: 60, category: "writing" },
      { day: "jueves", dayNumber: 4, title: "Simulación Práctica", description: "Simulación reunión técnica con IA (60 min)", duration: 60, category: "simulación" },
      { day: "viernes", dayNumber: 5, title: "Presentación Técnica", description: "Presentación técnica (prep + delivery) (60 min)", duration: 60, category: "presentación" },
      { day: "sábado", dayNumber: 6, title: "Inmersión Cultural", description: "Inmersión: Serie tech (Silicon Valley/Mr Robot) (60 min)", duration: 60, category: "inmersión" },
      { day: "domingo", dayNumber: 7, title: "Revisión Semanal", description: "Revisión semanal + Autoevaluación + Plan next week (60 min)", duration: 60, category: "revisión" },
    ]
  },
  {
    number: 2, month: 1, phase: 1,
    objective: "Rutina diaria: Describir tu día",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Vocabulario y Listening", description: "Vocabulario técnico (20 palabras) + Listening BBC 6 Min (40 min)", duration: 40, category: "vocabulario" },
      { day: "martes", dayNumber: 2, title: "Práctica de Speaking", description: "Speaking con ChatGPT + Shadowing (30+30 min)", duration: 60, category: "speaking" },
      { day: "miércoles", dayNumber: 3, title: "Escritura y Gramática", description: "Gramática aplicada + Writing emails (30+30 min)", duration: 60, category: "writing" },
      { day: "jueves", dayNumber: 4, title: "Simulación Práctica", description: "Simulación reunión técnica con IA (60 min)", duration: 60, category: "simulación" },
      { day: "viernes", dayNumber: 5, title: "Presentación Técnica", description: "Presentación técnica (prep + delivery) (60 min)", duration: 60, category: "presentación" },
      { day: "sábado", dayNumber: 6, title: "Inmersión Cultural", description: "Inmersión: Serie tech (Silicon Valley/Mr Robot) (60 min)", duration: 60, category: "inmersión" },
      { day: "domingo", dayNumber: 7, title: "Revisión Semanal", description: "Revisión semanal + Autoevaluación + Plan next week (60 min)", duration: 60, category: "revisión" },
    ]
  },
  {
    number: 3, month: 1, phase: 1,
    objective: "Trabajo: Hablar sobre tu rol actual",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Vocabulario y Listening", description: "Vocabulario técnico (20 palabras) + Listening BBC 6 Min (40 min)", duration: 40, category: "vocabulario" },
      { day: "martes", dayNumber: 2, title: "Práctica de Speaking", description: "Speaking con ChatGPT + Shadowing (30+30 min)", duration: 60, category: "speaking" },
      { day: "miércoles", dayNumber: 3, title: "Escritura y Gramática", description: "Gramática aplicada + Writing emails (30+30 min)", duration: 60, category: "writing" },
      { day: "jueves", dayNumber: 4, title: "Simulación Práctica", description: "Simulación reunión técnica con IA (60 min)", duration: 60, category: "simulación" },
      { day: "viernes", dayNumber: 5, title: "Presentación Técnica", description: "Presentación técnica (prep + delivery) (60 min)", duration: 60, category: "presentación" },
      { day: "sábado", dayNumber: 6, title: "Inmersión Cultural", description: "Inmersión: Serie tech (Silicon Valley/Mr Robot) (60 min)", duration: 60, category: "inmersión" },
      { day: "domingo", dayNumber: 7, title: "Revisión Semanal", description: "Revisión semanal + Autoevaluación + Plan next week (60 min)", duration: 60, category: "revisión" },
    ]
  },
  {
    number: 4, month: 1, phase: 1,
    objective: "Tecnología: Explicar stack técnico básico",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Vocabulario y Listening", description: "Vocabulario técnico (20 palabras) + Listening BBC 6 Min (40 min)", duration: 40, category: "vocabulario" },
      { day: "martes", dayNumber: 2, title: "Práctica de Speaking", description: "Speaking con ChatGPT + Shadowing (30+30 min)", duration: 60, category: "speaking" },
      { day: "miércoles", dayNumber: 3, title: "Escritura y Gramática", description: "Gramática aplicada + Writing emails (30+30 min)", duration: 60, category: "writing" },
      { day: "jueves", dayNumber: 4, title: "Simulación Práctica", description: "Simulación reunión técnica con IA (60 min)", duration: 60, category: "simulación" },
      { day: "viernes", dayNumber: 5, title: "Presentación Técnica", description: "Presentación técnica (prep + delivery) (60 min)", duration: 60, category: "presentación" },
      { day: "sábado", dayNumber: 6, title: "Inmersión Cultural", description: "Inmersión: Serie tech (Silicon Valley/Mr Robot) (60 min)", duration: 60, category: "inmersión" },
      { day: "domingo", dayNumber: 7, title: "Revisión Semanal", description: "Revisión semanal + Autoevaluación + Plan next week (60 min)", duration: 60, category: "revisión" },
    ]
  },
  {
    number: 5, month: 2, phase: 1,
    objective: "Equipo: Describir tu equipo y proyectos",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Vocabulario y Listening", description: "Vocabulario técnico (20 palabras) + Listening BBC 6 Min (40 min)", duration: 40, category: "vocabulario" },
      { day: "martes", dayNumber: 2, title: "Práctica de Speaking", description: "Speaking con ChatGPT + Shadowing (30+30 min)", duration: 60, category: "speaking" },
      { day: "miércoles", dayNumber: 3, title: "Escritura y Gramática", description: "Gramática aplicada + Writing emails (30+30 min)", duration: 60, category: "writing" },
      { day: "jueves", dayNumber: 4, title: "Simulación Práctica", description: "Simulación reunión técnica con IA (60 min)", duration: 60, category: "simulación" },
      { day: "viernes", dayNumber: 5, title: "Presentación Técnica", description: "Presentación técnica (prep + delivery) (60 min)", duration: 60, category: "presentación" },
      { day: "sábado", dayNumber: 6, title: "Inmersión Cultural", description: "Inmersión: Serie tech (Silicon Valley/Mr Robot) (60 min)", duration: 60, category: "inmersión" },
      { day: "domingo", dayNumber: 7, title: "Revisión Semanal", description: "Revisión semanal + Autoevaluación + Plan next week (60 min)", duration: 60, category: "revisión" },
    ]
  },
  {
    number: 6, month: 2, phase: 1,
    objective: "Procesos: Explicar metodologías ágiles",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Vocabulario y Listening", description: "Vocabulario técnico (20 palabras) + Listening BBC 6 Min (40 min)", duration: 40, category: "vocabulario" },
      { day: "martes", dayNumber: 2, title: "Práctica de Speaking", description: "Speaking con ChatGPT + Shadowing (30+30 min)", duration: 60, category: "speaking" },
      { day: "miércoles", dayNumber: 3, title: "Escritura y Gramática", description: "Gramática aplicada + Writing emails (30+30 min)", duration: 60, category: "writing" },
      { day: "jueves", dayNumber: 4, title: "Simulación Práctica", description: "Simulación reunión técnica con IA (60 min)", duration: 60, category: "simulación" },
      { day: "viernes", dayNumber: 5, title: "Presentación Técnica", description: "Presentación técnica (prep + delivery) (60 min)", duration: 60, category: "presentación" },
      { day: "sábado", dayNumber: 6, title: "Inmersión Cultural", description: "Inmersión: Serie tech (Silicon Valley/Mr Robot) (60 min)", duration: 60, category: "inmersión" },
      { day: "domingo", dayNumber: 7, title: "Revisión Semanal", description: "Revisión semanal + Autoevaluación + Plan next week (60 min)", duration: 60, category: "revisión" },
    ]
  },
  {
    number: 7, month: 2, phase: 1,
    objective: "Desafíos: Hablar de problemas y soluciones",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Vocabulario y Listening", description: "Vocabulario técnico (20 palabras) + Listening BBC 6 Min (40 min)", duration: 40, category: "vocabulario" },
      { day: "martes", dayNumber: 2, title: "Práctica de Speaking", description: "Speaking con ChatGPT + Shadowing (30+30 min)", duration: 60, category: "speaking" },
      { day: "miércoles", dayNumber: 3, title: "Escritura y Gramática", description: "Gramática aplicada + Writing emails (30+30 min)", duration: 60, category: "writing" },
      { day: "jueves", dayNumber: 4, title: "Simulación Práctica", description: "Simulación reunión técnica con IA (60 min)", duration: 60, category: "simulación" },
      { day: "viernes", dayNumber: 5, title: "Presentación Técnica", description: "Presentación técnica (prep + delivery) (60 min)", duration: 60, category: "presentación" },
      { day: "sábado", dayNumber: 6, title: "Inmersión Cultural", description: "Inmersión: Serie tech (Silicon Valley/Mr Robot) (60 min)", duration: 60, category: "inmersión" },
      { day: "domingo", dayNumber: 7, title: "Revisión Semanal", description: "Revisión semanal + Autoevaluación + Plan next week (60 min)", duration: 60, category: "revisión" },
    ]
  },
  {
    number: 8, month: 2, phase: 1,
    objective: "Consolidación Fase 1: Video presentación 5 min",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Vocabulario y Listening", description: "Vocabulario técnico (20 palabras) + Listening BBC 6 Min (40 min)", duration: 40, category: "vocabulario" },
      { day: "martes", dayNumber: 2, title: "Práctica de Speaking", description: "Speaking con ChatGPT + Shadowing (30+30 min)", duration: 60, category: "speaking" },
      { day: "miércoles", dayNumber: 3, title: "Escritura y Gramática", description: "Gramática aplicada + Writing emails (30+30 min)", duration: 60, category: "writing" },
      { day: "jueves", dayNumber: 4, title: "Simulación Práctica", description: "Simulación reunión técnica con IA (60 min)", duration: 60, category: "simulación" },
      { day: "viernes", dayNumber: 5, title: "Presentación Técnica", description: "Presentación técnica (prep + delivery) (60 min)", duration: 60, category: "presentación" },
      { day: "sábado", dayNumber: 6, title: "Inmersión Cultural", description: "Inmersión: Serie tech (Silicon Valley/Mr Robot) (60 min)", duration: 60, category: "inmersión" },
      { day: "domingo", dayNumber: 7, title: "Revisión Semanal", description: "Revisión semanal + Autoevaluación + Plan next week (60 min)", duration: 60, category: "revisión" },
    ]
  },
  {
    number: 9, month: 3, phase: 2,
    objective: "Arquitectura: Explicar sistemas complejos",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Vocab: Agile terms + Podcast: Tech Stuff", description: "Vocab: Agile terms + Podcast: Tech Stuff (60 min)", duration: 60, category: "general" },
      { day: "martes", dayNumber: 2, title: "Role-play daily standup + Pronunciation practice", description: "Role-play daily standup + Pronunciation practice (60 min)", duration: 60, category: "general" },
      { day: "miércoles", dayNumber: 3, title: "Complex sentences + Technical documentation", description: "Complex sentences + Technical documentation (60 min)", duration: 60, category: "general" },
      { day: "jueves", dayNumber: 4, title: "Sprint planning simulation + Note-taking", description: "Sprint planning simulation + Note-taking (60 min)", duration: 60, category: "general" },
      { day: "viernes", dayNumber: 5, title: "Demo presentation + Storytelling", description: "Demo presentation + Storytelling (60 min)", duration: 60, category: "general" },
      { day: "sábado", dayNumber: 6, title: "Movie: The Social Network + vocab notes", description: "Movie: The Social Network + vocab notes (60 min)", duration: 60, category: "general" },
      { day: "domingo", dayNumber: 7, title: "Weekly review + Record progress + Adjust", description: "Weekly review + Record progress + Adjust (60 min)", duration: 60, category: "general" },
    ]
  },
  {
    number: 10, month: 3, phase: 2,
    objective: "Decision-making: Justificar decisiones técnicas",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Vocab: Agile terms + Podcast: Tech Stuff", description: "Vocab: Agile terms + Podcast: Tech Stuff (60 min)", duration: 60, category: "general" },
      { day: "martes", dayNumber: 2, title: "Role-play daily standup + Pronunciation practice", description: "Role-play daily standup + Pronunciation practice (60 min)", duration: 60, category: "general" },
      { day: "miércoles", dayNumber: 3, title: "Complex sentences + Technical documentation", description: "Complex sentences + Technical documentation (60 min)", duration: 60, category: "general" },
      { day: "jueves", dayNumber: 4, title: "Sprint planning simulation + Note-taking", description: "Sprint planning simulation + Note-taking (60 min)", duration: 60, category: "general" },
      { day: "viernes", dayNumber: 5, title: "Demo presentation + Storytelling", description: "Demo presentation + Storytelling (60 min)", duration: 60, category: "general" },
      { day: "sábado", dayNumber: 6, title: "Movie: The Social Network + vocab notes", description: "Movie: The Social Network + vocab notes (60 min)", duration: 60, category: "general" },
      { day: "domingo", dayNumber: 7, title: "Weekly review + Record progress + Adjust", description: "Weekly review + Record progress + Adjust (60 min)", duration: 60, category: "general" },
    ]
  },
  {
    number: 11, month: 3, phase: 2,
    objective: "Trade-offs: Discutir pros/contras de tecnologías",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Vocab: Agile terms + Podcast: Tech Stuff", description: "Vocab: Agile terms + Podcast: Tech Stuff (60 min)", duration: 60, category: "general" },
      { day: "martes", dayNumber: 2, title: "Role-play daily standup + Pronunciation practice", description: "Role-play daily standup + Pronunciation practice (60 min)", duration: 60, category: "general" },
      { day: "miércoles", dayNumber: 3, title: "Complex sentences + Technical documentation", description: "Complex sentences + Technical documentation (60 min)", duration: 60, category: "general" },
      { day: "jueves", dayNumber: 4, title: "Sprint planning simulation + Note-taking", description: "Sprint planning simulation + Note-taking (60 min)", duration: 60, category: "general" },
      { day: "viernes", dayNumber: 5, title: "Demo presentation + Storytelling", description: "Demo presentation + Storytelling (60 min)", duration: 60, category: "general" },
      { day: "sábado", dayNumber: 6, title: "Movie: The Social Network + vocab notes", description: "Movie: The Social Network + vocab notes (60 min)", duration: 60, category: "general" },
      { day: "domingo", dayNumber: 7, title: "Weekly review + Record progress + Adjust", description: "Weekly review + Record progress + Adjust (60 min)", duration: 60, category: "general" },
    ]
  },
  {
    number: 12, month: 3, phase: 2,
    objective: "Estrategia: Presentar roadmap técnico",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Vocab: Agile terms + Podcast: Tech Stuff", description: "Vocab: Agile terms + Podcast: Tech Stuff (60 min)", duration: 60, category: "general" },
      { day: "martes", dayNumber: 2, title: "Role-play daily standup + Pronunciation practice", description: "Role-play daily standup + Pronunciation practice (60 min)", duration: 60, category: "general" },
      { day: "miércoles", dayNumber: 3, title: "Complex sentences + Technical documentation", description: "Complex sentences + Technical documentation (60 min)", duration: 60, category: "general" },
      { day: "jueves", dayNumber: 4, title: "Sprint planning simulation + Note-taking", description: "Sprint planning simulation + Note-taking (60 min)", duration: 60, category: "general" },
      { day: "viernes", dayNumber: 5, title: "Demo presentation + Storytelling", description: "Demo presentation + Storytelling (60 min)", duration: 60, category: "general" },
      { day: "sábado", dayNumber: 6, title: "Movie: The Social Network + vocab notes", description: "Movie: The Social Network + vocab notes (60 min)", duration: 60, category: "general" },
      { day: "domingo", dayNumber: 7, title: "Weekly review + Record progress + Adjust", description: "Weekly review + Record progress + Adjust (60 min)", duration: 60, category: "general" },
    ]
  },
  {
    number: 13, month: 4, phase: 2,
    objective: "Liderazgo: Principios de gestión de equipos",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Vocab: Agile terms + Podcast: Tech Stuff", description: "Vocab: Agile terms + Podcast: Tech Stuff (60 min)", duration: 60, category: "general" },
      { day: "martes", dayNumber: 2, title: "Role-play daily standup + Pronunciation practice", description: "Role-play daily standup + Pronunciation practice (60 min)", duration: 60, category: "general" },
      { day: "miércoles", dayNumber: 3, title: "Complex sentences + Technical documentation", description: "Complex sentences + Technical documentation (60 min)", duration: 60, category: "general" },
      { day: "jueves", dayNumber: 4, title: "Sprint planning simulation + Note-taking", description: "Sprint planning simulation + Note-taking (60 min)", duration: 60, category: "general" },
      { day: "viernes", dayNumber: 5, title: "Demo presentation + Storytelling", description: "Demo presentation + Storytelling (60 min)", duration: 60, category: "general" },
      { day: "sábado", dayNumber: 6, title: "Movie: The Social Network + vocab notes", description: "Movie: The Social Network + vocab notes (60 min)", duration: 60, category: "general" },
      { day: "domingo", dayNumber: 7, title: "Weekly review + Record progress + Adjust", description: "Weekly review + Record progress + Adjust (60 min)", duration: 60, category: "general" },
    ]
  },
  {
    number: 14, month: 4, phase: 2,
    objective: "Escalabilidad: Discutir growth y performance",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Vocab: Agile terms + Podcast: Tech Stuff", description: "Vocab: Agile terms + Podcast: Tech Stuff (60 min)", duration: 60, category: "general" },
      { day: "martes", dayNumber: 2, title: "Role-play daily standup + Pronunciation practice", description: "Role-play daily standup + Pronunciation practice (60 min)", duration: 60, category: "general" },
      { day: "miércoles", dayNumber: 3, title: "Complex sentences + Technical documentation", description: "Complex sentences + Technical documentation (60 min)", duration: 60, category: "general" },
      { day: "jueves", dayNumber: 4, title: "Sprint planning simulation + Note-taking", description: "Sprint planning simulation + Note-taking (60 min)", duration: 60, category: "general" },
      { day: "viernes", dayNumber: 5, title: "Demo presentation + Storytelling", description: "Demo presentation + Storytelling (60 min)", duration: 60, category: "general" },
      { day: "sábado", dayNumber: 6, title: "Movie: The Social Network + vocab notes", description: "Movie: The Social Network + vocab notes (60 min)", duration: 60, category: "general" },
      { day: "domingo", dayNumber: 7, title: "Weekly review + Record progress + Adjust", description: "Weekly review + Record progress + Adjust (60 min)", duration: 60, category: "general" },
    ]
  },
  {
    number: 15, month: 4, phase: 2,
    objective: "Seguridad: Explicar prácticas de security",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Vocab: Agile terms + Podcast: Tech Stuff", description: "Vocab: Agile terms + Podcast: Tech Stuff (60 min)", duration: 60, category: "general" },
      { day: "martes", dayNumber: 2, title: "Role-play daily standup + Pronunciation practice", description: "Role-play daily standup + Pronunciation practice (60 min)", duration: 60, category: "general" },
      { day: "miércoles", dayNumber: 3, title: "Complex sentences + Technical documentation", description: "Complex sentences + Technical documentation (60 min)", duration: 60, category: "general" },
      { day: "jueves", dayNumber: 4, title: "Sprint planning simulation + Note-taking", description: "Sprint planning simulation + Note-taking (60 min)", duration: 60, category: "general" },
      { day: "viernes", dayNumber: 5, title: "Demo presentation + Storytelling", description: "Demo presentation + Storytelling (60 min)", duration: 60, category: "general" },
      { day: "sábado", dayNumber: 6, title: "Movie: The Social Network + vocab notes", description: "Movie: The Social Network + vocab notes (60 min)", duration: 60, category: "general" },
      { day: "domingo", dayNumber: 7, title: "Weekly review + Record progress + Adjust", description: "Weekly review + Record progress + Adjust (60 min)", duration: 60, category: "general" },
    ]
  },
  {
    number: 16, month: 4, phase: 2,
    objective: "Consolidación Fase 2: Presentación técnica 10 min",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Vocab: Agile terms + Podcast: Tech Stuff", description: "Vocab: Agile terms + Podcast: Tech Stuff (60 min)", duration: 60, category: "general" },
      { day: "martes", dayNumber: 2, title: "Role-play daily standup + Pronunciation practice", description: "Role-play daily standup + Pronunciation practice (60 min)", duration: 60, category: "general" },
      { day: "miércoles", dayNumber: 3, title: "Complex sentences + Technical documentation", description: "Complex sentences + Technical documentation (60 min)", duration: 60, category: "general" },
      { day: "jueves", dayNumber: 4, title: "Sprint planning simulation + Note-taking", description: "Sprint planning simulation + Note-taking (60 min)", duration: 60, category: "general" },
      { day: "viernes", dayNumber: 5, title: "Demo presentation + Storytelling", description: "Demo presentation + Storytelling (60 min)", duration: 60, category: "general" },
      { day: "sábado", dayNumber: 6, title: "Movie: The Social Network + vocab notes", description: "Movie: The Social Network + vocab notes (60 min)", duration: 60, category: "general" },
      { day: "domingo", dayNumber: 7, title: "Weekly review + Record progress + Adjust", description: "Weekly review + Record progress + Adjust (60 min)", duration: 60, category: "general" },
    ]
  },
  {
    number: 17, month: 5, phase: 3,
    objective: "Budget: Discutir inversiones y ROI",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Executive vocab + Harvard Business Review", description: "Executive vocab + Harvard Business Review (60 min)", duration: 60, category: "general" },
      { day: "martes", dayNumber: 2, title: "Boardroom discussion + Executive presence", description: "Boardroom discussion + Executive presence (60 min)", duration: 60, category: "general" },
      { day: "miércoles", dayNumber: 3, title: "Business cases + Strategic documents", description: "Business cases + Strategic documents (60 min)", duration: 60, category: "general" },
      { day: "jueves", dayNumber: 4, title: "Investor pitch + Q&A handling", description: "Investor pitch + Q&A handling (60 min)", duration: 60, category: "general" },
      { day: "viernes", dayNumber: 5, title: "M&A discussions + Negotiations", description: "M&A discussions + Negotiations (60 min)", duration: 60, category: "general" },
      { day: "sábado", dayNumber: 6, title: "Leadership documentaries + Analysis", description: "Leadership documentaries + Analysis (60 min)", duration: 60, category: "general" },
      { day: "domingo", dayNumber: 7, title: "Strategic planning + KPI review", description: "Strategic planning + KPI review (60 min)", duration: 60, category: "general" },
    ]
  },
  {
    number: 18, month: 5, phase: 3,
    objective: "Cultura: Building and leading tech culture",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Executive vocab + Harvard Business Review", description: "Executive vocab + Harvard Business Review (60 min)", duration: 60, category: "general" },
      { day: "martes", dayNumber: 2, title: "Boardroom discussion + Executive presence", description: "Boardroom discussion + Executive presence (60 min)", duration: 60, category: "general" },
      { day: "miércoles", dayNumber: 3, title: "Business cases + Strategic documents", description: "Business cases + Strategic documents (60 min)", duration: 60, category: "general" },
      { day: "jueves", dayNumber: 4, title: "Investor pitch + Q&A handling", description: "Investor pitch + Q&A handling (60 min)", duration: 60, category: "general" },
      { day: "viernes", dayNumber: 5, title: "M&A discussions + Negotiations", description: "M&A discussions + Negotiations (60 min)", duration: 60, category: "general" },
      { day: "sábado", dayNumber: 6, title: "Leadership documentaries + Analysis", description: "Leadership documentaries + Analysis (60 min)", duration: 60, category: "general" },
      { day: "domingo", dayNumber: 7, title: "Strategic planning + KPI review", description: "Strategic planning + KPI review (60 min)", duration: 60, category: "general" },
    ]
  },
  {
    number: 19, month: 5, phase: 3,
    objective: "Board: Reporting to stakeholders",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Executive vocab + Harvard Business Review", description: "Executive vocab + Harvard Business Review (60 min)", duration: 60, category: "general" },
      { day: "martes", dayNumber: 2, title: "Boardroom discussion + Executive presence", description: "Boardroom discussion + Executive presence (60 min)", duration: 60, category: "general" },
      { day: "miércoles", dayNumber: 3, title: "Business cases + Strategic documents", description: "Business cases + Strategic documents (60 min)", duration: 60, category: "general" },
      { day: "jueves", dayNumber: 4, title: "Investor pitch + Q&A handling", description: "Investor pitch + Q&A handling (60 min)", duration: 60, category: "general" },
      { day: "viernes", dayNumber: 5, title: "M&A discussions + Negotiations", description: "M&A discussions + Negotiations (60 min)", duration: 60, category: "general" },
      { day: "sábado", dayNumber: 6, title: "Leadership documentaries + Analysis", description: "Leadership documentaries + Analysis (60 min)", duration: 60, category: "general" },
      { day: "domingo", dayNumber: 7, title: "Strategic planning + KPI review", description: "Strategic planning + KPI review (60 min)", duration: 60, category: "general" },
    ]
  },
  {
    number: 20, month: 5, phase: 3,
    objective: "Innovation: Liderar transformación digital",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Executive vocab + Harvard Business Review", description: "Executive vocab + Harvard Business Review (60 min)", duration: 60, category: "general" },
      { day: "martes", dayNumber: 2, title: "Boardroom discussion + Executive presence", description: "Boardroom discussion + Executive presence (60 min)", duration: 60, category: "general" },
      { day: "miércoles", dayNumber: 3, title: "Business cases + Strategic documents", description: "Business cases + Strategic documents (60 min)", duration: 60, category: "general" },
      { day: "jueves", dayNumber: 4, title: "Investor pitch + Q&A handling", description: "Investor pitch + Q&A handling (60 min)", duration: 60, category: "general" },
      { day: "viernes", dayNumber: 5, title: "M&A discussions + Negotiations", description: "M&A discussions + Negotiations (60 min)", duration: 60, category: "general" },
      { day: "sábado", dayNumber: 6, title: "Leadership documentaries + Analysis", description: "Leadership documentaries + Analysis (60 min)", duration: 60, category: "general" },
      { day: "domingo", dayNumber: 7, title: "Strategic planning + KPI review", description: "Strategic planning + KPI review (60 min)", duration: 60, category: "general" },
    ]
  },
  {
    number: 21, month: 6, phase: 3,
    objective: "Risk: Gestión de crisis y contingencias",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Executive vocab + Harvard Business Review", description: "Executive vocab + Harvard Business Review (60 min)", duration: 60, category: "general" },
      { day: "martes", dayNumber: 2, title: "Boardroom discussion + Executive presence", description: "Boardroom discussion + Executive presence (60 min)", duration: 60, category: "general" },
      { day: "miércoles", dayNumber: 3, title: "Business cases + Strategic documents", description: "Business cases + Strategic documents (60 min)", duration: 60, category: "general" },
      { day: "jueves", dayNumber: 4, title: "Investor pitch + Q&A handling", description: "Investor pitch + Q&A handling (60 min)", duration: 60, category: "general" },
      { day: "viernes", dayNumber: 5, title: "M&A discussions + Negotiations", description: "M&A discussions + Negotiations (60 min)", duration: 60, category: "general" },
      { day: "sábado", dayNumber: 6, title: "Leadership documentaries + Analysis", description: "Leadership documentaries + Analysis (60 min)", duration: 60, category: "general" },
      { day: "domingo", dayNumber: 7, title: "Strategic planning + KPI review", description: "Strategic planning + KPI review (60 min)", duration: 60, category: "general" },
    ]
  },
  {
    number: 22, month: 6, phase: 3,
    objective: "Hiring: Entrevistas y recruitment",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Executive vocab + Harvard Business Review", description: "Executive vocab + Harvard Business Review (60 min)", duration: 60, category: "general" },
      { day: "martes", dayNumber: 2, title: "Boardroom discussion + Executive presence", description: "Boardroom discussion + Executive presence (60 min)", duration: 60, category: "general" },
      { day: "miércoles", dayNumber: 3, title: "Business cases + Strategic documents", description: "Business cases + Strategic documents (60 min)", duration: 60, category: "general" },
      { day: "jueves", dayNumber: 4, title: "Investor pitch + Q&A handling", description: "Investor pitch + Q&A handling (60 min)", duration: 60, category: "general" },
      { day: "viernes", dayNumber: 5, title: "M&A discussions + Negotiations", description: "M&A discussions + Negotiations (60 min)", duration: 60, category: "general" },
      { day: "sábado", dayNumber: 6, title: "Leadership documentaries + Analysis", description: "Leadership documentaries + Analysis (60 min)", duration: 60, category: "general" },
      { day: "domingo", dayNumber: 7, title: "Strategic planning + KPI review", description: "Strategic planning + KPI review (60 min)", duration: 60, category: "general" },
    ]
  },
  {
    number: 23, month: 6, phase: 3,
    objective: "Vision: Articular estrategia long-term",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Executive vocab + Harvard Business Review", description: "Executive vocab + Harvard Business Review (60 min)", duration: 60, category: "general" },
      { day: "martes", dayNumber: 2, title: "Boardroom discussion + Executive presence", description: "Boardroom discussion + Executive presence (60 min)", duration: 60, category: "general" },
      { day: "miércoles", dayNumber: 3, title: "Business cases + Strategic documents", description: "Business cases + Strategic documents (60 min)", duration: 60, category: "general" },
      { day: "jueves", dayNumber: 4, title: "Investor pitch + Q&A handling", description: "Investor pitch + Q&A handling (60 min)", duration: 60, category: "general" },
      { day: "viernes", dayNumber: 5, title: "M&A discussions + Negotiations", description: "M&A discussions + Negotiations (60 min)", duration: 60, category: "general" },
      { day: "sábado", dayNumber: 6, title: "Leadership documentaries + Analysis", description: "Leadership documentaries + Analysis (60 min)", duration: 60, category: "general" },
      { day: "domingo", dayNumber: 7, title: "Strategic planning + KPI review", description: "Strategic planning + KPI review (60 min)", duration: 60, category: "general" },
    ]
  },
  {
    number: 24, month: 6, phase: 3,
    objective: "Consolidación Final: Simulación completa CTO",
    activities: [
      { day: "lunes", dayNumber: 1, title: "Advanced vocab + Conference talk (AWS/Google)", description: "Advanced vocab + Conference talk (AWS/Google) (60 min)", duration: 60, category: "general" },
      { day: "martes", dayNumber: 2, title: "Mock interview + Feedback análisis", description: "Mock interview + Feedback análisis (60 min)", duration: 60, category: "general" },
      { day: "miércoles", dayNumber: 3, title: "Escritura y Gramática", description: "Write thought leadership article + Review (60 min)", duration: 60, category: "writing" },
      { day: "jueves", dayNumber: 4, title: "Full board meeting simulation", description: "Full board meeting simulation (60 min)", duration: 60, category: "general" },
      { day: "viernes", dayNumber: 5, title: "Conference talk + Live Q&A simulation", description: "Conference talk + Live Q&A simulation (60 min)", duration: 60, category: "general" },
      { day: "sábado", dayNumber: 6, title: "Tech leadership content + Community", description: "Tech leadership content + Community (60 min)", duration: 60, category: "general" },
      { day: "domingo", dayNumber: 7, title: "Complete assessment + Future planning", description: "Complete assessment + Future planning (60 min)", duration: 60, category: "general" },
    ]
  },
]

    for (const weekData of sampleWeeksData) {
      const phase = await prisma.planPhase.findUnique({
        where: { number: weekData.phase }
      })

      if (!phase) continue

      const week = await prisma.planWeek.upsert({
        where: { number: weekData.number },
        update: {},
        create: {
          number: weekData.number,
          month: weekData.month,
          phaseId: phase.id,
          objective: weekData.objective
        }
      })

      for (const activityData of weekData.activities) {
        await prisma.planActivity.create({
          data: {
            weekId: week.id,
            day: activityData.day,
            dayNumber: activityData.dayNumber,
            title: activityData.title,
            description: activityData.description,
            duration: activityData.duration,
            category: activityData.category
          }
        })
      }
    }

    console.log(`✅ Creadas ${sampleWeeksData.length} semanas completas del plan (24 semanas, 168 actividades)`)

    // Crear vocabulario CTO con datos de muestra
    console.log('📚 Creando vocabulario técnico...')
    
    const vocabCategory = await prisma.vocabularyCategory.upsert({
      where: { id: 'cto-vocabulary' },
      update: {},
      create: {
        id: 'cto-vocabulary',
        name: 'Vocabulario CTO',
        description: 'Términos esenciales para CTOs y profesionales de tecnología'
      }
    })

    const sampleVocabulary = [
      { english: 'Microservices', spanish: 'Arquitectura de microservicios', example: 'Our system uses a microservices architecture for better scalability' },
      { english: 'API Gateway', spanish: 'Puerta de enlace de API', example: 'The API gateway handles all incoming requests' },
      { english: 'Load Balancer', spanish: 'Balanceador de carga', example: 'We need to configure the load balancer for better distribution' },
      { english: 'Scalability', spanish: 'Escalabilidad', example: 'Horizontal scalability is crucial for our growth' },
      { english: 'High Availability', spanish: 'Alta disponibilidad', example: 'We guarantee 99.99% high availability' },
      { english: 'Fault Tolerance', spanish: 'Tolerancia a fallos', example: 'The system is designed with fault tolerance in mind' },
      { english: 'Database Sharding', spanish: 'Fragmentación de base de datos', example: 'We implemented database sharding to improve performance' },
      { english: 'CI/CD Pipeline', spanish: 'Pipeline de integración y despliegue continuo', example: 'Our CI/CD pipeline automates testing and deployment' },
      { english: 'Container Orchestration', spanish: 'Orquestación de contenedores', example: 'Kubernetes provides container orchestration capabilities' },
      { english: 'Technical Debt', spanish: 'Deuda técnica', example: 'We need to address the technical debt in our legacy systems' },
      { english: 'Code Review', spanish: 'Revisión de código', example: 'All pull requests must go through code review' },
      { english: 'Sprint Planning', spanish: 'Planificación de sprint', example: 'Sprint planning helps us define our two-week goals' },
      { english: 'Stakeholder', spanish: 'Parte interesada', example: 'We need to align with all stakeholders before proceeding' },
      { english: 'ROI', spanish: 'Retorno de inversión', example: 'The ROI for this project is expected to be 150%' },
      { english: 'KPI', spanish: 'Indicador clave de rendimiento', example: 'Our KPIs show significant improvement this quarter' }
    ]

    for (const vocabWord of sampleVocabulary) {
      await prisma.vocabularyWord.create({
        data: {
          categoryId: vocabCategory.id,
          english: vocabWord.english,
          spanish: vocabWord.spanish,
          example: vocabWord.example
        }
      })
    }

    console.log(`✅ Creadas ${sampleVocabulary.length} palabras de vocabulario`)

    // Crear recursos gratuitos con datos de muestra
    console.log('🔧 Creando recursos gratuitos...')
    
    const resourceCategories = [
      { id: 'mobile-apps', name: 'Apps Móviles', description: 'Aplicaciones para dispositivos móviles' },
      { id: 'web-platforms', name: 'Plataformas Web', description: 'Sitios web y plataformas online' },
      { id: 'podcasts', name: 'Podcasts', description: 'Podcasts para escuchar' },
      { id: 'youtube', name: 'YouTube', description: 'Canales de YouTube' }
    ]

    for (const catData of resourceCategories) {
      await prisma.resourceCategory.upsert({
        where: { id: catData.id },
        update: {},
        create: catData
      })
    }

    const sampleResources = [
      // Apps Móviles
      { categoryId: 'mobile-apps', name: 'Duolingo', description: 'Vocabulario y gramática básica', platform: 'iOS/Android', rating: 5 },
      { categoryId: 'mobile-apps', name: 'ELSA Speak', description: 'Pronunciación con IA', platform: 'iOS/Android', rating: 5 },
      { categoryId: 'mobile-apps', name: 'HelloTalk', description: 'Intercambio con nativos', platform: 'iOS/Android', rating: 4 },
      { categoryId: 'mobile-apps', name: 'Tandem', description: 'Conversaciones 1-on-1', platform: 'iOS/Android', rating: 4 },
      
      // Plataformas Web
      { categoryId: 'web-platforms', name: 'BBC Learning English', description: 'Contenido estructurado y profesional', platform: 'Web', rating: 5 },
      { categoryId: 'web-platforms', name: 'TED Talks', description: 'Presentaciones profesionales con subtítulos', platform: 'Web', rating: 5 },
      { categoryId: 'web-platforms', name: 'Coursera', description: 'Cursos técnicos en inglés', platform: 'Web', rating: 4 },
      { categoryId: 'web-platforms', name: 'Stack Overflow', description: 'Documentación técnica en inglés', platform: 'Web', rating: 5 },
      
      // Podcasts
      { categoryId: 'podcasts', name: 'Software Engineering Daily', description: 'Podcast técnico diario', platform: 'Podcast', rating: 5 },
      { categoryId: 'podcasts', name: 'The Changelog', description: 'Conversaciones sobre desarrollo', platform: 'Podcast', rating: 4 },
      { categoryId: 'podcasts', name: 'Syntax', description: 'Desarrollo web y tecnología', platform: 'Podcast', rating: 4 },
      
      // YouTube
      { categoryId: 'youtube', name: 'Traversy Media', description: 'Tutoriales de programación', platform: 'YouTube', rating: 5 },
      { categoryId: 'youtube', name: 'FreeCodeCamp', description: 'Cursos completos de programación', platform: 'YouTube', rating: 5 },
      { categoryId: 'youtube', name: 'TechLead', description: 'Experiencias de liderazgo técnico', platform: 'YouTube', rating: 4 }
    ]

    for (const resourceData of sampleResources) {
      await prisma.resource.create({
        data: {
          categoryId: resourceData.categoryId,
          name: resourceData.name,
          description: resourceData.description,
          platform: resourceData.platform,
          rating: resourceData.rating,
          isFree: true
        }
      })
    }

    console.log(`✅ Creados ${sampleResources.length} recursos`)

    console.log('🎉 Seed completado exitosamente!')

  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fatal durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
