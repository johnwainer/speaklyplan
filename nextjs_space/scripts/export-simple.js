
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function exportDatabase() {
  try {
    console.log('🔄 Exportando base de datos...')

    // Export users (excluding passwords)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
      }
    })

    // Export learning contexts
    let learningContexts = []
    try {
      learningContexts = await prisma.learningContext.findMany()
    } catch (e) {
      console.log('⚠️  LearningContext no disponible')
    }

    // Export conversations
    let conversations = []
    try {
      conversations = await prisma.conversation.findMany({
        include: {
          messages: true,
        }
      })
    } catch (e) {
      console.log('⚠️  Conversations no disponible')
    }

    // Export vocabulary progress
    let vocabularyProgress = []
    try {
      vocabularyProgress = await prisma.vocabularyProgress.findMany()
    } catch (e) {
      console.log('⚠️  VocabularyProgress no disponible')
    }

    // Export grammar mistakes
    let grammarMistakes = []
    try {
      grammarMistakes = await prisma.grammarMistake.findMany()
    } catch (e) {
      console.log('⚠️  GrammarMistake no disponible')
    }

    // Export user progress
    let userProgress = []
    try {
      userProgress = await prisma.userProgress.findMany()
    } catch (e) {
      console.log('⚠️  UserProgress no disponible')
    }

    // Export achievements
    let achievements = []
    try {
      achievements = await prisma.achievement.findMany()
    } catch (e) {
      console.log('⚠️  Achievement no disponible')
    }

    // Export notes
    let notes = []
    try {
      notes = await prisma.note.findMany()
    } catch (e) {
      console.log('⚠️  Note no disponible')
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      users,
      learningContexts,
      conversations,
      vocabularyProgress,
      grammarMistakes,
      userProgress,
      achievements,
      notes,
    }

    const exportPath = path.join(process.cwd(), 'database_export.json')
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2))

    console.log('✅ Base de datos exportada exitosamente a:', exportPath)
    console.log(`📊 Estadísticas:`)
    console.log(`   - Usuarios: ${users.length}`)
    console.log(`   - Conversaciones: ${conversations.length}`)
    console.log(`   - Progreso de vocabulario: ${vocabularyProgress.length}`)
    console.log(`   - Errores de gramática: ${grammarMistakes.length}`)
    console.log(`   - Logros: ${achievements.length}`)
    console.log(`   - Notas: ${notes.length}`)
  } catch (error) {
    console.error('❌ Error exportando base de datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportDatabase()
