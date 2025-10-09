
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@speaklyplan.com'
  
  try {
    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email: adminEmail }
    })
    
    if (!user) {
      console.error(`Usuario con email ${adminEmail} no encontrado`)
      process.exit(1)
    }
    
    // Actualizar el rol a admin
    const updatedUser = await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'admin' }
    })
    
    console.log(`✅ Usuario ${adminEmail} actualizado exitosamente a rol: ${updatedUser.role}`)
  } catch (error) {
    console.error('Error actualizando usuario:', error)
    process.exit(1)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
