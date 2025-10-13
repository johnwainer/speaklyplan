
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Actualizando nombres de las fases...')

  try {
    // Actualizar FASE 1
    await prisma.planPhase.update({
      where: { number: 1 },
      data: {
        name: 'FASE 1: FUNDACIÓN SÓLIDA',
        description: 'Vocabulario esencial y gramática básica'
      }
    })
    console.log('✅ Fase 1 actualizada')

    // Actualizar FASE 2
    await prisma.planPhase.update({
      where: { number: 2 },
      data: {
        name: 'FASE 2: CONSTRUCCIÓN ACTIVA',
        description: 'Conversaciones prácticas y fluidez'
      }
    })
    console.log('✅ Fase 2 actualizada')

    // Actualizar FASE 3
    await prisma.planPhase.update({
      where: { number: 3 },
      data: {
        name: 'FASE 3: DOMINIO PROFESIONAL',
        description: 'Inglés avanzado para el trabajo'
      }
    })
    console.log('✅ Fase 3 actualizada')

    console.log('✨ Todos los nombres de las fases han sido actualizados exitosamente!')
  } catch (error) {
    console.error('❌ Error actualizando las fases:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
