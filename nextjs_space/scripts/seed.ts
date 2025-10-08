
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
    console.log('📅 Creando plan semanal...')
    
    const sampleWeeksData = [
      {
        number: 1, month: 1, phase: 1,
        objective: "Primeros pasos: Presentación personal básica",
        activities: [
          { day: 'lunes', dayNumber: 1, title: 'Vocabulario técnico', description: 'Vocabulario técnico (20 palabras) + Listening BBC 6 Min (40 min)', duration: 40, category: 'vocabulario' },
          { day: 'martes', dayNumber: 2, title: 'Práctica de Speaking', description: 'Speaking con ChatGPT + Shadowing (30+30 min)', duration: 60, category: 'speaking' },
          { day: 'miércoles', dayNumber: 3, title: 'Escritura técnica', description: 'Gramática aplicada + Writing emails (30+30 min)', duration: 60, category: 'writing' },
          { day: 'jueves', dayNumber: 4, title: 'Simulación de reunión', description: 'Simulación reunión técnica con IA (60 min)', duration: 60, category: 'simulación' },
          { day: 'viernes', dayNumber: 5, title: 'Presentación técnica', description: 'Presentación técnica (prep + delivery) (60 min)', duration: 60, category: 'presentación' },
          { day: 'sábado', dayNumber: 6, title: 'Inmersión en contenido', description: 'Inmersión: Serie tech (Silicon Valley/Mr Robot) (60 min)', duration: 60, category: 'inmersión' },
          { day: 'domingo', dayNumber: 7, title: 'Revisión semanal', description: 'Revisión semanal + Autoevaluación + Plan next week (60 min)', duration: 60, category: 'revisión' }
        ]
      },
      {
        number: 2, month: 1, phase: 1,
        objective: "Rutina diaria: Describir tu día",
        activities: [
          { day: 'lunes', dayNumber: 1, title: 'Vocabulario técnico', description: 'Vocabulario técnico (20 palabras) + Listening BBC 6 Min (40 min)', duration: 40, category: 'vocabulario' },
          { day: 'martes', dayNumber: 2, title: 'Práctica de Speaking', description: 'Speaking con ChatGPT + Shadowing (30+30 min)', duration: 60, category: 'speaking' },
          { day: 'miércoles', dayNumber: 3, title: 'Escritura técnica', description: 'Gramática aplicada + Writing emails (30+30 min)', duration: 60, category: 'writing' },
          { day: 'jueves', dayNumber: 4, title: 'Simulación de reunión', description: 'Simulación reunión técnica con IA (60 min)', duration: 60, category: 'simulación' },
          { day: 'viernes', dayNumber: 5, title: 'Presentación técnica', description: 'Presentación técnica (prep + delivery) (60 min)', duration: 60, category: 'presentación' },
          { day: 'sábado', dayNumber: 6, title: 'Inmersión en contenido', description: 'Inmersión: Serie tech (Silicon Valley/Mr Robot) (60 min)', duration: 60, category: 'inmersión' },
          { day: 'domingo', dayNumber: 7, title: 'Revisión semanal', description: 'Revisión semanal + Autoevaluación + Plan next week (60 min)', duration: 60, category: 'revisión' }
        ]
      },
      {
        number: 3, month: 1, phase: 1,
        objective: "Trabajo: Hablar sobre tu rol actual",
        activities: [
          { day: 'lunes', dayNumber: 1, title: 'Vocabulario técnico', description: 'Vocabulario técnico (20 palabras) + Listening BBC 6 Min (40 min)', duration: 40, category: 'vocabulario' },
          { day: 'martes', dayNumber: 2, title: 'Práctica de Speaking', description: 'Speaking con ChatGPT + Shadowing (30+30 min)', duration: 60, category: 'speaking' },
          { day: 'miércoles', dayNumber: 3, title: 'Escritura técnica', description: 'Gramática aplicada + Writing emails (30+30 min)', duration: 60, category: 'writing' },
          { day: 'jueves', dayNumber: 4, title: 'Simulación de reunión', description: 'Simulación reunión técnica con IA (60 min)', duration: 60, category: 'simulación' },
          { day: 'viernes', dayNumber: 5, title: 'Presentación técnica', description: 'Presentación técnica (prep + delivery) (60 min)', duration: 60, category: 'presentación' },
          { day: 'sábado', dayNumber: 6, title: 'Inmersión en contenido', description: 'Inmersión: Serie tech (Silicon Valley/Mr Robot) (60 min)', duration: 60, category: 'inmersión' },
          { day: 'domingo', dayNumber: 7, title: 'Revisión semanal', description: 'Revisión semanal + Autoevaluación + Plan next week (60 min)', duration: 60, category: 'revisión' }
        ]
      },
      {
        number: 9, month: 3, phase: 2,
        objective: "Transición a Speaking Mínimo Viable",
        activities: [
          { day: 'lunes', dayNumber: 1, title: 'Vocabulario avanzado', description: 'Vocabulario técnico avanzado (30 palabras) + Listening TED Talks (45 min)', duration: 45, category: 'vocabulario' },
          { day: 'martes', dayNumber: 2, title: 'Speaking con nativos', description: 'Conversación con nativos + Role-playing (45 min)', duration: 45, category: 'speaking' },
          { day: 'miércoles', dayNumber: 3, title: 'Escritura profesional', description: 'Redacción de documentos técnicos + Business emails (60 min)', duration: 60, category: 'writing' },
          { day: 'jueves', dayNumber: 4, title: 'Presentaciones complejas', description: 'Presentación de arquitectura + Q&A session (75 min)', duration: 75, category: 'presentación' },
          { day: 'viernes', dayNumber: 5, title: 'Simulación avanzada', description: 'Simulación de entrevista técnica + Code review (60 min)', duration: 60, category: 'simulación' },
          { day: 'sábado', dayNumber: 6, title: 'Inmersión técnica', description: 'Documentación técnica + Open source projects (60 min)', duration: 60, category: 'inmersión' },
          { day: 'domingo', dayNumber: 7, title: 'Revisión avanzada', description: 'Autoevaluación + Planning + Peer feedback (60 min)', duration: 60, category: 'revisión' }
        ]
      },
      {
        number: 17, month: 5, phase: 3,
        objective: "Dominio avanzado y simulaciones reales",
        activities: [
          { day: 'lunes', dayNumber: 1, title: 'Vocabulario ejecutivo', description: 'Vocabulario ejecutivo (40 palabras) + Industry reports (60 min)', duration: 60, category: 'vocabulario' },
          { day: 'martes', dayNumber: 2, title: 'Liderazgo en inglés', description: 'Team meetings + Strategic discussions (60 min)', duration: 60, category: 'speaking' },
          { day: 'miércoles', dayNumber: 3, title: 'Comunicación ejecutiva', description: 'Executive summaries + Board presentations (75 min)', duration: 75, category: 'writing' },
          { day: 'jueves', dayNumber: 4, title: 'Presentación ejecutiva', description: 'Presentación a stakeholders + Budget discussions (90 min)', duration: 90, category: 'presentación' },
          { day: 'viernes', dayNumber: 5, title: 'Simulación C-level', description: 'Simulación de board meeting + Crisis management (75 min)', duration: 75, category: 'simulación' },
          { day: 'sábado', dayNumber: 6, title: 'Inmersión empresarial', description: 'Case studies + Industry analysis (75 min)', duration: 75, category: 'inmersión' },
          { day: 'domingo', dayNumber: 7, title: 'Revisión estratégica', description: 'Strategic review + KPI analysis + Future planning (75 min)', duration: 75, category: 'revisión' }
        ]
      }
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

    console.log(`✅ Creadas ${sampleWeeksData.length} semanas de plan (muestra representativa)`)

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
