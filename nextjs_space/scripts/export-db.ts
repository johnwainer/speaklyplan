
require('dotenv').config()
import { prisma } from '../lib/db'
import * as fs from 'fs'
import * as path from 'path'

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
    const learningContexts = await prisma.learningContext.findMany()

    // Export conversations
    const conversations = await prisma.conversation.findMany({
      include: {
        messages: true,
      }
    })

    // Export vocabulary progress
    const vocabularyProgress = await prisma.vocabularyProgress.findMany()

    // Export grammar mistakes
    const grammarMistakes = await prisma.grammarMistake.findMany()

    // Export user progress
    const userProgress = await prisma.userProgress.findMany()

    // Export achievements
    const achievements = await prisma.achievement.findMany()

    // Export notes
    const notes = await prisma.note.findMany()

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
