
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

    // Export chat conversations
    const chatConversations = await prisma.chatConversation.findMany({
      include: {
        messages: true,
      }
    })

    // Export user vocabulary progress
    const userVocabularyProgress = await prisma.userVocabularyProgress.findMany()

    // Export common mistakes
    const commonMistakes = await prisma.commonMistake.findMany()

    // Export user progress
    const userProgress = await prisma.userProgress.findMany()

    // Export achievements
    const achievements = await prisma.achievement.findMany()

    // Export user notes
    const userNotes = await prisma.userNote.findMany()

    const exportData = {
      exportDate: new Date().toISOString(),
      users,
      learningContexts,
      chatConversations,
      userVocabularyProgress,
      commonMistakes,
      userProgress,
      achievements,
      userNotes,
    }

    const exportPath = path.join(process.cwd(), 'database_export.json')
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2))

    console.log('✅ Base de datos exportada exitosamente a:', exportPath)
    console.log(`📊 Estadísticas:`)
    console.log(`   - Usuarios: ${users.length}`)
    console.log(`   - Conversaciones: ${chatConversations.length}`)
    console.log(`   - Progreso de vocabulario: ${userVocabularyProgress.length}`)
    console.log(`   - Errores comunes: ${commonMistakes.length}`)
    console.log(`   - Logros: ${achievements.length}`)
    console.log(`   - Notas: ${userNotes.length}`)
  } catch (error) {
    console.error('❌ Error exportando base de datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportDatabase()
