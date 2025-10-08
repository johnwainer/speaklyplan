import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config()

const prisma = new PrismaClient()

const vocabularyData = [
  {
    category: '💼 VOCABULARIO BÁSICO DE OFICINA',
    terms: [
      { english: 'Meeting', spanish: 'Reunión', example: 'We have a team meeting at 10 AM' },
      { english: 'Deadline', spanish: 'Fecha límite', example: 'The deadline for this project is next Friday' },
      { english: 'Schedule', spanish: 'Horario/Agenda', example: "Let's schedule a call for tomorrow" },
      { english: 'Report', spanish: 'Informe', example: 'I need to finish the monthly report' },
      { english: 'Presentation', spanish: 'Presentación', example: 'I gave a presentation to the team' },
      { english: 'Feedback', spanish: 'Retroalimentación', example: 'Can you give me feedback on my work?' },
      { english: 'Task', spanish: 'Tarea', example: 'I have three tasks to complete today' },
      { english: 'Assignment', spanish: 'Asignación', example: 'This is your assignment for the week' },
      { english: 'Coworker', spanish: 'Compañero de trabajo', example: 'My coworkers are very helpful' },
      { english: 'Supervisor', spanish: 'Supervisor', example: 'I need to talk to my supervisor' }
    ]
  },
  {
    category: '📧 COMUNICACIÓN POR EMAIL',
    terms: [
      { english: 'Regarding', spanish: 'Con respecto a', example: 'Regarding your question, here is my answer' },
      { english: 'Attached', spanish: 'Adjunto', example: 'Please find the document attached' },
      { english: 'Follow up', spanish: 'Hacer seguimiento', example: "I'm following up on my previous email" },
      { english: 'Reply', spanish: 'Responder', example: 'Please reply to this email by Friday' },
      { english: 'Forward', spanish: 'Reenviar', example: 'Can you forward this email to the team?' },
      { english: 'CC (Carbon Copy)', spanish: 'Copia', example: 'Please CC me on that email' },
      { english: 'Subject line', spanish: 'Asunto', example: 'Make sure the subject line is clear' },
      { english: 'Draft', spanish: 'Borrador', example: 'I saved it as a draft' },
      { english: 'Urgent', spanish: 'Urgente', example: 'This is an urgent matter' },
      { english: 'As soon as possible (ASAP)', spanish: 'Lo antes posible', example: 'Please send it ASAP' }
    ]
  },
  {
    category: '🤝 TRABAJO EN EQUIPO',
    terms: [
      { english: 'Collaborate', spanish: 'Colaborar', example: 'We need to collaborate on this project' },
      { english: 'Delegate', spanish: 'Delegar', example: 'I will delegate some tasks to the team' },
      { english: 'Teamwork', spanish: 'Trabajo en equipo', example: 'Good teamwork is essential' },
      { english: 'Contribution', spanish: 'Contribución', example: 'Your contribution to the project was valuable' },
      { english: 'Support', spanish: 'Apoyar', example: 'We support each other in the team' },
      { english: 'Coordinate', spanish: 'Coordinar', example: 'We need to coordinate our efforts' },
      { english: 'Team member', spanish: 'Miembro del equipo', example: 'Every team member has a role' },
      { english: 'Responsibility', spanish: 'Responsabilidad', example: 'This is your responsibility' },
      { english: 'Accountability', spanish: 'Rendir cuentas', example: 'We all have accountability for results' },
      { english: 'Brainstorm', spanish: 'Lluvia de ideas', example: "Let's brainstorm some solutions" }
    ]
  },
  {
    category: '📊 PROYECTOS Y PLANIFICACIÓN',
    terms: [
      { english: 'Goal', spanish: 'Objetivo', example: 'Our goal is to finish by June' },
      { english: 'Milestone', spanish: 'Hito', example: 'We reached an important milestone' },
      { english: 'Timeline', spanish: 'Cronograma', example: "What's the timeline for this project?" },
      { english: 'Priority', spanish: 'Prioridad', example: 'This task is a high priority' },
      { english: 'Budget', spanish: 'Presupuesto', example: 'We need to stay within budget' },
      { english: 'Resources', spanish: 'Recursos', example: 'Do we have enough resources?' },
      { english: 'Deliverable', spanish: 'Entregable', example: 'The deliverable is due next week' },
      { english: 'Scope', spanish: 'Alcance', example: "Let's define the project scope" },
      { english: 'Progress', spanish: 'Progreso', example: 'We made good progress this week' },
      { english: 'Status update', spanish: 'Actualización de estado', example: 'Can you give us a status update?' }
    ]
  },
  {
    category: '💡 RESOLUCIÓN DE PROBLEMAS',
    terms: [
      { english: 'Issue', spanish: 'Problema', example: 'We have an issue with the delivery' },
      { english: 'Challenge', spanish: 'Desafío', example: 'This is a big challenge for us' },
      { english: 'Solution', spanish: 'Solución', example: 'We found a solution to the problem' },
      { english: 'Alternative', spanish: 'Alternativa', example: 'We need to find an alternative' },
      { english: 'Approach', spanish: 'Enfoque', example: 'We need a different approach' },
      { english: 'Improvement', spanish: 'Mejora', example: 'This is a significant improvement' },
      { english: 'Analysis', spanish: 'Análisis', example: 'We need to do an analysis of the situation' },
      { english: 'Recommendation', spanish: 'Recomendación', example: 'My recommendation is to wait' },
      { english: 'Decision', spanish: 'Decisión', example: 'We need to make a decision today' },
      { english: 'Risk', spanish: 'Riesgo', example: 'There is some risk involved' }
    ]
  },
  {
    category: '📈 NEGOCIOS Y RESULTADOS',
    terms: [
      { english: 'Revenue', spanish: 'Ingresos', example: 'Our revenue increased this quarter' },
      { english: 'Profit', spanish: 'Ganancia', example: 'The company made a good profit' },
      { english: 'Loss', spanish: 'Pérdida', example: 'We had a loss last year' },
      { english: 'Growth', spanish: 'Crecimiento', example: 'We experienced strong growth' },
      { english: 'Market', spanish: 'Mercado', example: 'We need to understand the market' },
      { english: 'Customer', spanish: 'Cliente', example: 'Our customers are satisfied' },
      { english: 'Client', spanish: 'Cliente', example: 'We have a new client' },
      { english: 'Sales', spanish: 'Ventas', example: 'Sales were good this month' },
      { english: 'Target', spanish: 'Meta', example: 'We reached our target' },
      { english: 'Performance', spanish: 'Desempeño', example: 'Your performance was excellent' }
    ]
  },
  {
    category: '🎯 OBJETIVOS Y ESTRATEGIA',
    terms: [
      { english: 'Strategy', spanish: 'Estrategia', example: 'We need a new marketing strategy' },
      { english: 'Plan', spanish: 'Plan', example: "What's the plan for next quarter?" },
      { english: 'Objective', spanish: 'Objetivo', example: 'Our main objective is customer satisfaction' },
      { english: 'Vision', spanish: 'Visión', example: 'The company vision is very clear' },
      { english: 'Mission', spanish: 'Misión', example: 'Our mission is to help people' },
      { english: 'Initiative', spanish: 'Iniciativa', example: 'This is a great initiative' },
      { english: 'Implementation', spanish: 'Implementación', example: 'The implementation will start next month' },
      { english: 'Execution', spanish: 'Ejecución', example: 'Good execution is key' },
      { english: 'Achievement', spanish: 'Logro', example: 'This is a great achievement' },
      { english: 'Success', spanish: 'Éxito', example: 'We celebrated our success' }
    ]
  },
  {
    category: '📅 TIEMPO Y ORGANIZACIÓN',
    terms: [
      { english: 'Appointment', spanish: 'Cita', example: 'I have an appointment at 3 PM' },
      { english: 'Reschedule', spanish: 'Reprogramar', example: 'Can we reschedule the meeting?' },
      { english: 'Postpone', spanish: 'Posponer', example: 'We need to postpone the launch' },
      { english: 'Advance', spanish: 'Adelantar', example: 'Can we advance the meeting?' },
      { english: 'Punctual', spanish: 'Puntual', example: 'Please be punctual' },
      { english: 'Overtime', spanish: 'Horas extra', example: 'I worked overtime this week' },
      { english: 'Flexible', spanish: 'Flexible', example: 'We have flexible working hours' },
      { english: 'Remote', spanish: 'Remoto', example: 'I work remotely from home' },
      { english: 'On time', spanish: 'A tiempo', example: 'The project was delivered on time' },
      { english: 'Behind schedule', spanish: 'Atrasado', example: 'We are behind schedule' }
    ]
  },
  {
    category: '🗣️ FRASES PARA REUNIONES',
    terms: [
      { english: 'Let me give you some context', spanish: 'Déjame darte contexto', example: 'Let me give you some context before we begin' },
      { english: 'That makes sense', spanish: 'Eso tiene sentido', example: 'Yes, that makes sense to me' },
      { english: 'I agree with you', spanish: 'Estoy de acuerdo', example: 'I agree with your point' },
      { english: 'I have a question', spanish: 'Tengo una pregunta', example: 'I have a question about the timeline' },
      { english: 'Could you clarify?', spanish: '¿Podrías aclarar?', example: 'Could you clarify that point?' },
      { english: 'Moving forward', spanish: 'De aquí en adelante', example: 'Moving forward, we will do this differently' },
      { english: "Let's take a break", spanish: 'Tomemos un descanso', example: "Let's take a 10-minute break" },
      { english: 'To summarize', spanish: 'Para resumir', example: 'To summarize, we need to focus on quality' },
      { english: "I'd like to add", spanish: 'Me gustaría agregar', example: "I'd like to add one more point" },
      { english: "Let's move on", spanish: 'Sigamos adelante', example: "Let's move on to the next topic" }
    ]
  },
  {
    category: '🎤 FRASES PARA PRESENTACIONES',
    terms: [
      { english: 'Good morning everyone', spanish: 'Buenos días a todos', example: 'Good morning everyone, thank you for coming' },
      { english: "Today I'll talk about", spanish: 'Hoy hablaré sobre', example: "Today I'll talk about our results" },
      { english: 'As you can see', spanish: 'Como pueden ver', example: 'As you can see in this chart' },
      { english: 'The main point is', spanish: 'El punto principal es', example: 'The main point is customer satisfaction' },
      { english: 'In conclusion', spanish: 'En conclusión', example: 'In conclusion, we had a good quarter' },
      { english: 'Thank you for your attention', spanish: 'Gracias por su atención', example: 'Thank you for your attention' },
      { english: 'Are there any questions?', spanish: '¿Hay preguntas?', example: 'Are there any questions?' },
      { english: 'Let me show you', spanish: 'Déjenme mostrarles', example: 'Let me show you the data' },
      { english: 'This leads me to', spanish: 'Esto me lleva a', example: 'This leads me to my next point' },
      { english: 'To wrap up', spanish: 'Para terminar', example: 'To wrap up, we are on track' }
    ]
  },
  {
    category: '📞 LLAMADAS Y VIDEOCONFERENCIAS',
    terms: [
      { english: 'Can you hear me?', spanish: '¿Me escuchas?', example: 'Can you hear me clearly?' },
      { english: 'Sorry, you are breaking up', spanish: 'Se corta el audio', example: 'Sorry, you are breaking up' },
      { english: 'Let me share my screen', spanish: 'Déjame compartir mi pantalla', example: 'Let me share my screen' },
      { english: 'I will mute myself', spanish: 'Me voy a silenciar', example: 'I will mute myself when not speaking' },
      { english: 'Can you turn on your camera?', spanish: '¿Puedes activar tu cámara?', example: 'Can you turn on your camera?' },
      { english: 'I have to drop off', spanish: 'Tengo que salirme', example: 'I have to drop off in 5 minutes' },
      { english: 'Can we schedule a call?', spanish: '¿Podemos agendar una llamada?', example: 'Can we schedule a call for tomorrow?' },
      { english: 'I will call you back', spanish: 'Te llamo de vuelta', example: 'I will call you back in 10 minutes' },
      { english: 'Line is busy', spanish: 'Línea ocupada', example: 'The line is busy, try later' },
      { english: 'Dial the number', spanish: 'Marca el número', example: 'Please dial the number to join' }
    ]
  },
  {
    category: '✍️ ESCRITURA PROFESIONAL',
    terms: [
      { english: 'Please find attached', spanish: 'Adjunto encontrarás', example: 'Please find attached the document' },
      { english: 'Kind regards', spanish: 'Saludos cordiales', example: 'Best regards, John' },
      { english: 'I look forward to', spanish: 'Espero con interés', example: 'I look forward to hearing from you' },
      { english: 'As requested', spanish: 'Como fue solicitado', example: 'As requested, here is the information' },
      { english: 'Please let me know', spanish: 'Por favor avísame', example: 'Please let me know if you have questions' },
      { english: 'For your consideration', spanish: 'Para tu consideración', example: 'For your consideration, I attached the proposal' },
      { english: 'I apologize for', spanish: 'Me disculpo por', example: 'I apologize for the delay' },
      { english: 'Thank you for your patience', spanish: 'Gracias por tu paciencia', example: 'Thank you for your patience' },
      { english: 'I would like to inform you', spanish: 'Quisiera informarte', example: 'I would like to inform you about the changes' },
      { english: 'Please confirm', spanish: 'Por favor confirma', example: 'Please confirm your attendance' }
    ]
  },
]

async function main() {
  console.log('🌱 Seeding vocabulary data...')
  
  // Clear existing vocabulary data
  await prisma.userVocabularyProgress.deleteMany()
  await prisma.vocabularyWord.deleteMany()
  await prisma.vocabularyCategory.deleteMany()
  
  for (const categoryData of vocabularyData) {
    console.log(`  📚 Creating category: ${categoryData.category}`)
    
    const category = await prisma.vocabularyCategory.create({
      data: {
        name: categoryData.category,
        description: `Vocabulario profesional de ${categoryData.category}`
      }
    })
    
    for (const term of categoryData.terms) {
      await prisma.vocabularyWord.create({
        data: {
          categoryId: category.id,
          english: term.english,
          spanish: term.spanish,
          example: term.example
        }
      })
    }
    
    console.log(`    ✅ Added ${categoryData.terms.length} terms`)
  }
  
  console.log('✅ Vocabulary seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
