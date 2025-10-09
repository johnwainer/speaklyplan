
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function importDatabase() {
  try {
    const exportPath = path.join(process.cwd(), 'database_export.json')
    
    if (!fs.existsSync(exportPath)) {
      console.error('❌ Archivo de exportación no encontrado:', exportPath)
      return
    }

    console.log('🔄 Importando base de datos...')
    
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf-8'))

    console.log('📥 Importando usuarios...')
    for (const user of data.users) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: user,
        create: user,
      })
    }

    console.log('📥 Importando contextos de aprendizaje...')
    for (const context of data.learningContexts) {
      await prisma.learningContext.upsert({
        where: { userId: context.userId },
        update: context,
        create: context,
      })
    }

    console.log('📥 Importando conversaciones...')
    for (const conversation of data.conversations) {
      const { messages, ...conversationData } = conversation
      await prisma.conversation.upsert({
        where: { id: conversation.id },
        update: conversationData,
        create: conversationData,
      })

      for (const message of messages) {
        await prisma.message.upsert({
          where: { id: message.id },
          update: message,
          create: message,
        })
      }
    }

    console.log('📥 Importando progreso de vocabulario...')
    for (const progress of data.vocabularyProgress) {
      await prisma.vocabularyProgress.upsert({
        where: { id: progress.id },
        update: progress,
        create: progress,
      })
    }

    console.log('📥 Importando errores de gramática...')
    for (const mistake of data.grammarMistakes) {
      await prisma.grammarMistake.upsert({
        where: { id: mistake.id },
        update: mistake,
        create: mistake,
      })
    }

    console.log('📥 Importando progreso de usuarios...')
    for (const progress of data.userProgress) {
      await prisma.userProgress.upsert({
        where: { id: progress.id },
        update: progress,
        create: progress,
      })
    }

    console.log('📥 Importando logros...')
    for (const achievement of data.achievements) {
      await prisma.achievement.upsert({
        where: { id: achievement.id },
        update: achievement,
        create: achievement,
      })
    }

    console.log('📥 Importando notas...')
    for (const note of data.notes) {
      await prisma.note.upsert({
        where: { id: note.id },
        update: note,
        create: note,
      })
    }

    console.log('✅ Base de datos importada exitosamente')
  } catch (error) {
    console.error('❌ Error importando base de datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importDatabase()
